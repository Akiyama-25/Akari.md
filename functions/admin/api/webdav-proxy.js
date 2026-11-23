// Cloudflare Pages Function: Same-origin WebDAV proxy under /admin/api/webdav-proxy
// Protected alongside /admin/* by Cloudflare Zero Trust Access.

const ALLOWED_METHODS = new Set(["GET", "PUT", "PROPFIND", "HEAD"]);

function isPrivateHost(hostname) {
	const h = hostname.toLowerCase();
	if (
		h === "localhost" ||
		h === "::1" ||
		h.endsWith(".local") ||
		h.endsWith(".internal")
	) {
		return true;
	}
	if (/^127\./.test(h) || /^10\./.test(h) || /^192\.168\./.test(h) || /^169\.254\./.test(h)) {
		return true;
	}
	const m172 = h.match(/^172\.(\d+)\./);
	if (m172) {
		const second = Number.parseInt(m172[1], 10);
		if (second >= 16 && second <= 31) return true;
	}
	return false;
}

export async function onRequest(context) {
	const { request } = context;

	if (request.method === "OPTIONS") {
		return new Response(null, {
			status: 204,
			headers: {
				"Access-Control-Allow-Origin": new URL(request.url).origin,
				"Access-Control-Allow-Methods": "GET, PUT, PROPFIND, HEAD, OPTIONS",
				"Access-Control-Allow-Headers": "Authorization, Content-Type, Depth, X-WebDAV-Method, X-WebDAV-Target",
				"Access-Control-Max-Age": "86400",
			},
		});
	}

	const reqUrl = new URL(request.url);
	const targetRaw =
		reqUrl.searchParams.get("url") || request.headers.get("X-WebDAV-Target") || "";

	if (!targetRaw) {
		return new Response(JSON.stringify({ error: "Missing url parameter" }), {
			status: 400,
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});
	}

	let targetUrl;
	try {
		targetUrl = new URL(targetRaw);
	} catch {
		return new Response(JSON.stringify({ error: "Invalid target URL" }), {
			status: 400,
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});
	}

	if (targetUrl.protocol !== "https:" || isPrivateHost(targetUrl.hostname)) {
		return new Response(
			JSON.stringify({ error: "Only public HTTPS WebDAV endpoints are allowed" }),
			{
				status: 403,
				headers: { "Content-Type": "application/json; charset=utf-8" },
			},
		);
	}

	const upstreamMethod = (
		request.headers.get("X-WebDAV-Method") || request.method || "GET"
	).toUpperCase();

	if (!ALLOWED_METHODS.has(upstreamMethod)) {
		return new Response(JSON.stringify({ error: `Method ${upstreamMethod} not allowed` }), {
			status: 405,
			headers: { "Content-Type": "application/json; charset=utf-8" },
		});
	}

	const upstreamHeaders = new Headers();
	upstreamHeaders.set("User-Agent", "Akari.md-WebDAV-Proxy/1.0");
	const auth = request.headers.get("Authorization");
	if (auth) upstreamHeaders.set("Authorization", auth);
	const depth = request.headers.get("Depth");
	if (depth) upstreamHeaders.set("Depth", depth);
	const contentType = request.headers.get("Content-Type");
	if (contentType) upstreamHeaders.set("Content-Type", contentType);

	const init = {
		method: upstreamMethod,
		headers: upstreamHeaders,
		redirect: "follow",
	};

	if (upstreamMethod === "PUT" || upstreamMethod === "PROPFIND") {
		init.body = await request.arrayBuffer();
	}

	try {
		const upstreamRes = await fetch(targetUrl.toString(), init);
		const resHeaders = new Headers();
		const ct = upstreamRes.headers.get("Content-Type");
		if (ct) resHeaders.set("Content-Type", ct);
		resHeaders.set("Cache-Control", "no-store");
		return new Response(upstreamRes.body, {
			status: upstreamRes.status,
			statusText: upstreamRes.statusText,
			headers: resHeaders,
		});
	} catch (err) {
		return new Response(
			JSON.stringify({ error: `Upstream WebDAV error: ${err?.message || String(err)}` }),
			{
				status: 502,
				headers: { "Content-Type": "application/json; charset=utf-8" },
			},
		);
	}
}
