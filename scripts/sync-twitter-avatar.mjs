import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const TWITTER_USER = process.env.TWITTER_USER || "FascinatingAnon";

async function fetchAvatarBuffer() {
	// Strategy 1: api.fxtwitter.com
	try {
		console.log(`[Twitter Avatar Sync] Trying api.fxtwitter.com for @${TWITTER_USER}...`);
		const apiUrl = `https://api.fxtwitter.com/${TWITTER_USER}`;
		const res = await fetch(apiUrl, {
			headers: {
				"User-Agent":
					"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
			},
		});
		if (res.ok) {
			const data = await res.json();
			const rawUrl = data.user?.avatar_url;
			if (rawUrl) {
				const highResUrl = rawUrl.replace("_normal", "_400x400");
				console.log(`[Twitter Avatar Sync] Downloading from: ${highResUrl}`);
				const imgRes = await fetch(highResUrl, {
					headers: { "User-Agent": "Mozilla/5.0" },
				});
				if (imgRes.ok) {
					return Buffer.from(await imgRes.arrayBuffer());
				}
			}
		}
	} catch (err) {
		console.log(`[Twitter Avatar Sync] fxtwitter failed: ${err.message}`);
	}

	// Strategy 2: unavatar.io/x/:user
	const fallbacks = [
		`https://unavatar.io/x/${TWITTER_USER}`,
		`https://unavatar.io/twitter/${TWITTER_USER}`,
	];

	for (const url of fallbacks) {
		try {
			console.log(`[Twitter Avatar Sync] Trying fallback provider: ${url}`);
			const res = await fetch(url, {
				headers: {
					"User-Agent":
						"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
				},
				redirect: "follow",
			});
			if (res.ok) {
				const buf = Buffer.from(await res.arrayBuffer());
				if (buf.length > 500) {
					return buf;
				}
			}
		} catch (err) {
			console.log(`[Twitter Avatar Sync] Fallback ${url} failed: ${err.message}`);
		}
	}

	throw new Error(`Failed to fetch avatar for @${TWITTER_USER} from all available sources.`);
}

async function run() {
	const buffer = await fetchAvatarBuffer();

	const avatarWebpPath = path.join(projectRoot, "src/assets/images/avatar.webp");
	const homeIconPath = path.join(projectRoot, "public/assets/home/home.webp");
	const faviconPngPath = path.join(projectRoot, "public/favicon.png");
	const faviconIconPath = path.join(projectRoot, "public/favicon/icon.png");

	let converted = false;
	try {
		const sharpModule = await import("sharp");
		const sharp = sharpModule.default;
		console.log("[Twitter Avatar Sync] Converting with sharp...");
		const webpBuffer = await sharp(buffer).webp({ quality: 90 }).toBuffer();
		const squareWebpIcon = await sharp(buffer)
			.resize(128, 128)
			.webp({ quality: 90 })
			.toBuffer();
		const squarePngIcon = await sharp(buffer)
			.resize(128, 128)
			.png()
			.toBuffer();

		fs.writeFileSync(avatarWebpPath, webpBuffer);
		fs.writeFileSync(homeIconPath, squareWebpIcon);
		fs.writeFileSync(faviconPngPath, squarePngIcon);
		fs.writeFileSync(faviconIconPath, squarePngIcon);
		converted = true;
	} catch (_e) {
		console.log("[Twitter Avatar Sync] sharp not available, trying ffmpeg...");
		const tmpInput = path.join(projectRoot, "node_modules/.tmp-avatar-raw.jpg");
		try {
			fs.mkdirSync(path.dirname(tmpInput), { recursive: true });
			fs.writeFileSync(tmpInput, buffer);
			const ffmpegCmd = fs.existsSync("/data/.memoh/deps/bin/ffmpeg")
				? "/data/.memoh/deps/bin/ffmpeg"
				: "ffmpeg";
			execSync(
				`${ffmpegCmd} -y -i "${tmpInput}" -vf scale=400:400 -vcodec libwebp "${avatarWebpPath}"`,
				{ stdio: "ignore" },
			);
			execSync(
				`${ffmpegCmd} -y -i "${tmpInput}" -vf scale=128:128 -vcodec libwebp "${homeIconPath}"`,
				{ stdio: "ignore" },
			);
			execSync(
				`${ffmpegCmd} -y -i "${tmpInput}" -vf scale=128:128 -update 1 "${faviconPngPath}"`,
				{ stdio: "ignore" },
			);
			execSync(
				`${ffmpegCmd} -y -i "${tmpInput}" -vf scale=128:128 -update 1 "${faviconIconPath}"`,
				{ stdio: "ignore" },
			);
			if (fs.existsSync(tmpInput)) fs.unlinkSync(tmpInput);
			converted = true;
		} catch (err) {
			console.log("[Twitter Avatar Sync] ffmpeg failed:", err.message);
		}
	}

	if (!converted) {
		console.log("[Twitter Avatar Sync] Fallback: writing raw buffer directly.");
		fs.writeFileSync(avatarWebpPath, buffer);
		fs.writeFileSync(homeIconPath, buffer);
		fs.writeFileSync(faviconPngPath, buffer);
		fs.writeFileSync(faviconIconPath, buffer);
	}

	console.log(
		`[Twitter Avatar Sync] Successfully synced Twitter avatar for @${TWITTER_USER}!`,
	);
}

run().catch((err) => {
	console.error("[Twitter Avatar Sync] Error:", err.message);
	process.exit(1);
});
