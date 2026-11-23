import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, "../src/config/siteConfig.ts");
const OUTPUT_FILE = path.join(__dirname, "../src/data/webdav-anime-data.json");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function readSiteWebDavConfig() {
	try {
		const content = await fs.readFile(CONFIG_PATH, "utf-8");
		const modeMatch = content.match(
			/anime:\s*\{[\s\S]*?mode:\s*["']([^"']+)["']/,
		);
		const blockMatch = content.match(/webdavAnime:\s*\{([\s\S]*?)\}/);
		const block = blockMatch ? blockMatch[1] : "";
		const extractStr = (key, fallback = "") => {
			const m = block.match(new RegExp(`${key}:\\s*["']([^"']*)["']`));
			return m ? m[1] : fallback;
		};
		const extractBool = (key, fallback = true) => {
			const m = block.match(new RegExp(`${key}:\\s*(true|false)`));
			return m ? m[1] === "true" : fallback;
		};
		return {
			mode: modeMatch ? modeMatch[1] : "bangumi",
			url: extractStr("url", ""),
			path: extractStr("path", "/anime.json"),
			format: extractStr("format", "auto"),
			enrichBangumi: extractBool("enrichBangumi", true),
		};
	} catch {
		return {
			mode: "bangumi",
			url: "",
			path: "/anime.json",
			format: "auto",
			enrichBangumi: true,
		};
	}
}

function joinWebDavUrl(baseUrl, remotePath) {
	const cleanBase = String(baseUrl || "").trim().replace(/\/+$/, "");
	const cleanPath = String(remotePath || "").trim();
	if (!cleanPath || cleanPath === "/") return `${cleanBase}/`;
	if (/^https?:\/\//i.test(cleanPath)) return cleanPath;
	return `${cleanBase}/${cleanPath.replace(/^\/+/, "")}`;
}

function buildAuthHeaders(username, password) {
	const headers = {
		"User-Agent": "Akari.md-WebDAV-Anime-Sync/1.0",
	};
	if (username || password) {
		const token = Buffer.from(
			`${username || ""}:${password || ""}`,
			"utf-8",
		).toString("base64");
		headers.Authorization = `Basic ${token}`;
	}
	return headers;
}

function normalizeStatus(raw) {
	if (raw === undefined || raw === null || raw === "") return "watching";
	if (typeof raw === "number") {
		// Bangumi / Kazumi numeric collection types:
		// Bangumi: 1=wish(planned), 2=collect(completed), 3=do(watching), 4=on_hold, 5=dropped
		// Kazumi CollectType: 1=watching, 2=completed, 3=planned, 4=onhold, 5=dropped (if tagged kazumi)
		const numMap = {
			1: "planned",
			2: "completed",
			3: "watching",
			4: "onhold",
			5: "dropped",
		};
		return numMap[raw] || "watching";
	}
	const s = String(raw).trim().toLowerCase();
	if (
		["watching", "do", "doing", "current", "in_progress", "在看", "追番中", "观看中"].includes(s)
	) {
		return "watching";
	}
	if (
		["completed", "collect", "done", "finished", "watched", "看过", "已看完", "完结"].includes(s)
	) {
		return "completed";
	}
	if (
		["planned", "wish", "plan_to_watch", "plan", "want", "想看", "计划看"].includes(s)
	) {
		return "planned";
	}
	if (["onhold", "on_hold", "on-hold", "paused", "hold", "搁置", "暂停"].includes(s)) {
		return "onhold";
	}
	if (["dropped", "drop", "abandoned", "抛弃", "弃番"].includes(s)) {
		return "dropped";
	}
	return "watching";
}

function normalizeKazumiStatus(raw) {
	if (typeof raw === "number") {
		// Kazumi CollectType: 0=none, 1=watching, 2=completed, 3=planned/wish, 4=onhold, 5=dropped
		const kMap = {
			1: "watching",
			2: "completed",
			3: "planned",
			4: "onhold",
			5: "dropped",
		};
		return kMap[raw] || "watching";
	}
	return normalizeStatus(raw);
}

function toNumber(val, fallback = 0) {
	if (typeof val === "number" && Number.isFinite(val)) return val;
	if (typeof val === "string") {
		const m = val.match(/-?\d+(\.\d+)?/);
		if (m) {
			const n = Number.parseFloat(m[0]);
			if (Number.isFinite(n)) return n;
		}
	}
	return fallback;
}

function normalizeTags(raw) {
	if (Array.isArray(raw)) {
		return raw
			.map((t) => {
				if (typeof t === "string") return t.trim();
				if (t && typeof t === "object") return String(t.name || t.label || t.title || "").trim();
				return "";
			})
			.filter(Boolean)
			.slice(0, 6);
	}
	if (typeof raw === "string" && raw.trim()) {
		return raw
			.split(/[,，、/|]/)
			.map((s) => s.trim())
			.filter(Boolean)
			.slice(0, 6);
	}
	return [];
}

function extractYear(rawDate) {
	if (!rawDate) return "";
	const m = String(rawDate).match(/(19|20)\d{2}/);
	return m ? m[0] : "";
}

function normalizeAnimeRecord(item, isKazumi = false) {
	if (!item || typeof item !== "object") return null;

	// Kazumi collectibles / history item often wraps `bangumiItem`
	const sub = item.bangumiItem || item.subject || item.anime || item;
	const title = String(
		item.title ||
			item.name_cn ||
			item.nameCn ||
			sub.nameCn ||
			sub.name_cn ||
			sub.title ||
			sub.name ||
			item.name ||
			item.series_title ||
			"",
	).trim();

	if (!title) return null;

	const rawStatus =
		item.status ??
		item.state ??
		item.type ??
		item.collectType ??
		item.my_status ??
		(isKazumi ? 1 : "watching");
	const status = isKazumi
		? normalizeKazumiStatus(rawStatus)
		: normalizeStatus(rawStatus);

	const progress = Math.max(
		0,
		Math.round(
			toNumber(
				item.progress ??
					item.ep_status ??
					item.watched_episodes ??
					item.my_watched_episodes ??
					item.lastWatchEpisode ??
					item.episode ??
					item.watched ??
					0,
				0,
			),
		),
	);

	let totalEpisodes = Math.max(
		0,
		Math.round(
			toNumber(
				item.totalEpisodes ??
					item.total_episodes ??
					item.eps ??
					item.episodes ??
					item.series_episodes ??
					sub.eps ??
					sub.totalEpisodes ??
					0,
				0,
			),
		),
	);
	if (totalEpisodes === 0) {
		totalEpisodes = progress > 0 ? Math.max(progress, 12) : 12;
	}

	const rating = Number(
		toNumber(
			item.rating ??
				item.rate ??
				item.score ??
				item.my_score ??
				sub.ratingScore ??
				sub.score ??
				0,
			0,
		).toFixed(1),
	);

	let cover = "";
	const rawCover =
		item.cover ??
		item.image ??
		item.poster ??
		item.img ??
		sub.images?.large ??
		sub.images?.common ??
		sub.images?.medium ??
		sub.cover ??
		sub.image ??
		"";
	if (typeof rawCover === "string") {
		cover = rawCover.trim();
	} else if (rawCover && typeof rawCover === "object") {
		cover = String(
			rawCover.large || rawCover.common || rawCover.medium || rawCover.url || "",
		).trim();
	}

	const subjectId =
		item.subject_id ||
		item.bangumiId ||
		item.bgmId ||
		sub.id ||
		item.series_animedb_id ||
		"";

	let link = String(item.link || item.url || sub.url || "").trim();
	if (!link && subjectId && /^\d+$/.test(String(subjectId))) {
		link = `https://bgm.tv/subject/${subjectId}`;
	}

	const rawDate =
		item.startDate ||
		item.airDate ||
		item.air_date ||
		item.date ||
		sub.airDate ||
		sub.date ||
		item.year ||
		"";
	const year = String(item.year || extractYear(rawDate) || "").trim();

	const genre = normalizeTags(
		item.genre || item.genres || item.tags || sub.tags || [],
	);

	const description = String(
		item.description ||
			item.summary ||
			item.comment ||
			sub.summary ||
			sub.short_summary ||
			"",
	).trim();

	const studio = String(item.studio || item.company || sub.studio || "").trim();

	return {
		title,
		status,
		rating,
		cover: cover || "/assets/anime/default.webp",
		description,
		episodes: `${totalEpisodes} episodes`,
		year,
		genre,
		studio,
		link: link || "#",
		progress,
		totalEpisodes,
		startDate: String(item.startDate || rawDate || "").slice(0, 10),
		endDate: String(item.endDate || "").slice(0, 10),
		_bangumiId:
			subjectId && /^\d+$/.test(String(subjectId)) ? String(subjectId) : "",
	};
}

function parseCsvLine(line, delimiter = ",") {
	const result = [];
	let current = "";
	let inQuotes = false;
	for (let i = 0; i < line.length; i++) {
		const ch = line[i];
		if (ch === '"') {
			if (inQuotes && line[i + 1] === '"') {
				current += '"';
				i++;
			} else {
				inQuotes = !inQuotes;
			}
		} else if (ch === delimiter && !inQuotes) {
			result.push(current.trim());
			current = "";
		} else {
			current += ch;
		}
	}
	result.push(current.trim());
	return result;
}

function parseCsvContent(text) {
	const lines = text
		.replace(/^\uFEFF/, "")
		.split(/\r?\n/)
		.map((l) => l.trim())
		.filter(Boolean);
	if (lines.length < 2) return [];
	const delimiter = lines[0].includes("\t") && !lines[0].includes(",") ? "\t" : ",";
	const headers = parseCsvLine(lines[0], delimiter).map((h) => h.toLowerCase());
	const keyMap = {
		title: ["title", "name", "名称", "番名", "番剧名称", "动画名"],
		status: ["status", "state", "状态", "追番状态"],
		rating: ["rating", "score", "rate", "评分"],
		cover: ["cover", "image", "img", "poster", "封面", "封面图"],
		description: ["description", "desc", "summary", "简介", "备注"],
		year: ["year", "年份", "首播年份"],
		studio: ["studio", "制作", "制作公司", "动画制作"],
		genre: ["genre", "genres", "tags", "标签", "类型"],
		link: ["link", "url", "链接"],
		progress: ["progress", "watched", "进度", "已看集数"],
		totalEpisodes: ["totalepisodes", "total", "episodes", "eps", "总集数"],
	};
	const getCol = (row, aliases) => {
		for (const alias of aliases) {
			const idx = headers.indexOf(alias);
			if (idx !== -1 && row[idx] !== undefined) return row[idx];
		}
		return "";
	};
	const list = [];
	for (let i = 1; i < lines.length; i++) {
		const row = parseCsvLine(lines[i], delimiter);
		const obj = {};
		for (const [k, aliases] of Object.entries(keyMap)) {
			const v = getCol(row, aliases);
			if (v !== "") obj[k] = v;
		}
		const norm = normalizeAnimeRecord(obj);
		if (norm) list.push(norm);
	}
	return list;
}

function decodeXmlEntities(str) {
	return String(str || "")
		.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&apos;/g, "'")
		.trim();
}

function parseMalXml(text) {
	const animeBlocks = text.match(/<anime>[\s\S]*?<\/anime>/gi) || [];
	const getTag = (block, tag) => {
		const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, "i"));
		return m ? decodeXmlEntities(m[1]) : "";
	};
	const results = [];
	for (const block of animeBlocks) {
		const title = getTag(block, "series_title");
		if (!title) continue;
		const malId = getTag(block, "series_animedb_id");
		const norm = normalizeAnimeRecord({
			title,
			status: getTag(block, "my_status"),
			progress: getTag(block, "my_watched_episodes"),
			totalEpisodes: getTag(block, "series_episodes"),
			rating: getTag(block, "my_score"),
			description: getTag(block, "my_comments"),
			tags: getTag(block, "my_tags"),
			startDate: getTag(block, "my_start_date"),
			endDate: getTag(block, "my_finish_date"),
			link: malId ? `https://myanimelist.net/anime/${malId}` : "",
		});
		if (norm) results.push(norm);
	}
	return results;
}

function extractArrayFromJson(parsed) {
	if (Array.isArray(parsed)) return parsed;
	if (parsed && typeof parsed === "object") {
		const candidateKeys = [
			"data",
			"items",
			"list",
			"animes",
			"anime",
			"animeList",
			"bangumi",
			"collections",
			"collectibles",
			"histories",
			"records",
		];
		for (const key of candidateKeys) {
			if (Array.isArray(parsed[key])) return parsed[key];
		}
		// Kazumi map-like object { "12345": { bangumiItem: ... } }
		const values = Object.values(parsed);
		if (
			values.length > 0 &&
			values.every((v) => v && typeof v === "object" && !Array.isArray(v))
		) {
			return values;
		}
	}
	return [];
}

function parseAnimePayload(rawText, format = "auto", filenameHint = "") {
	const trimmed = String(rawText || "").trim();
	if (!trimmed) return [];

	const isKazumiHint =
		format === "kazumi" ||
		/kazumi|collectibles|histories/i.test(filenameHint);

	if (
		format === "mal-xml" ||
		(format === "auto" && /<myanimelist[\s>]|<anime>/i.test(trimmed))
	) {
		return parseMalXml(trimmed);
	}

	if (format === "csv") {
		return parseCsvContent(trimmed);
	}

	// Try JSON parse (direct or embedded JSON snippet)
	let parsed = null;
	try {
		parsed = JSON.parse(trimmed);
	} catch {
		const firstBracket = trimmed.search(/[\[{]/);
		if (firstBracket !== -1) {
			const lastBrace = Math.max(
				trimmed.lastIndexOf("]"),
				trimmed.lastIndexOf("}"),
			);
			if (lastBrace > firstBracket) {
				try {
					parsed = JSON.parse(trimmed.slice(firstBracket, lastBrace + 1));
				} catch {
					parsed = null;
				}
			}
		}
	}

	if (parsed !== null) {
		const arr = extractArrayFromJson(parsed);
		return arr
			.map((item) => normalizeAnimeRecord(item, isKazumiHint))
			.filter(Boolean);
	}

	if (format === "auto" && trimmed.includes("\n") && /[,;\t]/.test(trimmed.split("\n")[0])) {
		return parseCsvContent(trimmed);
	}

	return [];
}

function mergeAnimeLists(lists) {
	const map = new Map();
	for (const list of lists) {
		for (const item of list) {
			const key = (item._bangumiId || item.title).toLowerCase();
			const existing = map.get(key);
			if (!existing) {
				map.set(key, item);
			} else {
				map.set(key, {
					...existing,
					...item,
					progress: Math.max(existing.progress || 0, item.progress || 0),
					totalEpisodes: Math.max(
						existing.totalEpisodes || 0,
						item.totalEpisodes || 0,
					),
					cover:
						item.cover && item.cover !== "/assets/anime/default.webp"
							? item.cover
							: existing.cover,
					description: item.description || existing.description,
					studio: item.studio || existing.studio,
					year: item.year || existing.year,
					genre: item.genre?.length ? item.genre : existing.genre,
				});
			}
		}
	}
	return Array.from(map.values());
}

async function enrichFromBangumi(items) {
	const enriched = [];
	let fetchCount = 0;
	for (const item of items) {
		const needsCover =
			!item.cover || item.cover === "/assets/anime/default.webp";
		const needsDesc = !item.description;
		const bgmId = item._bangumiId;

		if (bgmId && (needsCover || needsDesc) && fetchCount < 60) {
			fetchCount++;
			try {
				const res = await fetch(`https://api.bgm.tv/v0/subjects/${bgmId}`, {
					headers: { "User-Agent": "Akari.md-WebDAV-Anime-Sync/1.0" },
				});
				if (res.ok) {
					const detail = await res.json();
					if (needsCover && detail.images?.medium) {
						item.cover = detail.images.medium;
					}
					if (needsDesc && detail.summary) {
						item.description = detail.summary.trim();
					}
					if (!item.year && detail.date) {
						item.year = String(detail.date).slice(0, 4);
					}
					if ((!item.genre || item.genre.length === 0) && Array.isArray(detail.tags)) {
						item.genre = detail.tags.slice(0, 3).map((t) => t.name);
					}
					if (!item.rating && detail.rating?.score) {
						item.rating = Number(Number(detail.rating.score).toFixed(1));
					}
					if (!item.studio && Array.isArray(detail.infobox)) {
						const studioInfo = detail.infobox.find((i) =>
							["动画制作", "制作", "製作"].includes(i.key),
						);
						if (studioInfo) {
							if (typeof studioInfo.value === "string") {
								item.studio = studioInfo.value;
							} else if (Array.isArray(studioInfo.value) && studioInfo.value[0]?.v) {
								item.studio = studioInfo.value[0].v;
							}
						}
					}
				}
				await delay(120);
			} catch {
				// Ignore transient Bangumi API failures
			}
		}
		const { _bangumiId, ...clean } = item;
		enriched.push(clean);
	}
	return enriched;
}

async function fetchWebDavText(url, headers) {
	const res = await fetch(url, { method: "GET", headers });
	if (!res.ok) return { ok: false, status: res.status, text: "" };
	const text = await res.text();
	return { ok: true, status: res.status, text };
}

async function discoverWebDavFiles(dirUrl, headers) {
	const candidates = [
		"anime.json",
		"bangumi-data.json",
		"bangumi.json",
		"webdav-anime-data.json",
		"collectibles.tmp",
		"histories.tmp",
		"kazumiSync/collectibles.tmp",
		"kazumiSync/histories.tmp",
	];
	const discovered = [];

	// Try PROPFIND first
	try {
		const res = await fetch(dirUrl, {
			method: "PROPFIND",
			headers: {
				...headers,
				Depth: "1",
				"Content-Type": "application/xml; charset=utf-8",
			},
			body: '<?xml version="1.0" encoding="utf-8"?><d:propfind xmlns:d="DAV:"><d:prop><d:displayname/></d:prop></d:propfind>',
		});
		if (res.ok || res.status === 207) {
			const xml = await res.text();
			const hrefMatches = [...xml.matchAll(/<[^:>]*:?href[^>]*>([^<]+)<\/[^:>]*:?href>/gi)];
			const baseOrigin = new URL(dirUrl).origin;
			for (const m of hrefMatches) {
				const href = decodeURIComponent(m[1].trim());
				if (/\.(json|xml|csv|tmp)$/i.test(href)) {
					const fullUrl = /^https?:\/\//i.test(href)
						? href
						: `${baseOrigin}${href.startsWith("/") ? "" : "/"}${href}`;
					discovered.push(fullUrl);
				}
			}
		}
	} catch {
		// Fall back to known filenames
	}

	if (discovered.length > 0) return discovered;

	return candidates.map((name) => joinWebDavUrl(dirUrl, name));
}

async function main() {
	const config = await readSiteWebDavConfig();
	const forceRun = process.env.WEBDAV_FORCE_SYNC === "true";

	if (!forceRun && config.mode !== "webdav") {
		console.log(
			`Detected current anime mode is "${config.mode}", skipping WebDAV anime update.`,
		);
		return;
	}

	const webdavUrl = process.env.WEBDAV_URL || config.url;
	const webdavPath = process.env.WEBDAV_PATH || config.path || "/anime.json";
	const username = process.env.WEBDAV_USERNAME || "";
	const password = process.env.WEBDAV_PASSWORD || "";
	const format = process.env.WEBDAV_FORMAT || config.format || "auto";
	const shouldEnrich =
		process.env.WEBDAV_ENRICH_BANGUMI !== undefined
			? process.env.WEBDAV_ENRICH_BANGUMI === "true"
			: config.enrichBangumi;

	if (!webdavUrl) {
		console.log(
			"[WebDAV Anime] WEBDAV_URL is not configured; keeping existing src/data/webdav-anime-data.json.",
		);
		return;
	}

	const headers = buildAuthHeaders(username, password);
	const targetUrl = joinWebDavUrl(webdavUrl, webdavPath);
	const isDirHint = webdavPath.endsWith("/") || !/\.[a-z0-9]{2,5}$/i.test(webdavPath);

	console.log(`[WebDAV Anime] Fetching from ${targetUrl}...`);

	const parsedLists = [];

	if (!isDirHint) {
		const res = await fetchWebDavText(targetUrl, headers);
		if (!res.ok) {
			throw new Error(`WebDAV GET failed with HTTP ${res.status} for ${targetUrl}`);
		}
		const items = parseAnimePayload(res.text, format, webdavPath);
		if (items.length > 0) parsedLists.push(items);
	} else {
		const urls = await discoverWebDavFiles(targetUrl, headers);
		for (const fileUrl of urls) {
			try {
				const res = await fetchWebDavText(fileUrl, headers);
				if (res.ok && res.text) {
					const items = parseAnimePayload(res.text, format, fileUrl);
					if (items.length > 0) {
						console.log(`[WebDAV Anime] Parsed ${items.length} records from ${fileUrl}`);
						parsedLists.push(items);
					}
				}
			} catch {
				// Skip inaccessible candidates
			}
		}
	}

	const merged = mergeAnimeLists(parsedLists);
	if (merged.length === 0) {
		console.warn(
			"[WebDAV Anime] No valid anime records parsed from WebDAV. Keeping existing local file.",
		);
		return;
	}

	const finalList = shouldEnrich
		? await enrichFromBangumi(merged)
		: merged.map(({ _bangumiId, ...clean }) => clean);

	await fs.mkdir(path.dirname(OUTPUT_FILE), { recursive: true });
	await fs.writeFile(OUTPUT_FILE, `${JSON.stringify(finalList, null, 2)}\n`, "utf-8");
	console.log(
		`[WebDAV Anime] Synced ${finalList.length} anime records to src/data/webdav-anime-data.json`,
	);
}

main().catch((err) => {
	console.error("[WebDAV Anime] Sync error:", err.message || err);
	// Do not hard-fail CI build if cached data already exists unless forced
	if (process.env.WEBDAV_FORCE_SYNC === "true") {
		process.exit(1);
	}
});
