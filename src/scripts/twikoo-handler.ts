/**
 * Twikoo 评论系统全局管理器
 * 适配 Swup 无刷新跳转与 Cloudflare Rocket Loader，避免内联脚本在切页时失效或重复初始化
 */

declare global {
	interface Window {
		twikoo?: {
			init: (options: Record<string, unknown>) => Promise<void>;
		};
	}
}

const TWIKOO_CONTAINER_ID = "twikoo-container";
const TWIKOO_COMMENT_ID = "tcomment";
const TWIKOO_SCRIPT_ID = "twikoo-script-loaded";
const TWIKOO_SCRIPT_URL = "/assets/js/twikoo.all.min.js";

let twikooScriptPromise: Promise<void> | null = null;
let listenersRegistered = false;

function getNormalizedPath(): string {
	const pathname = window.location.pathname;
	return pathname.endsWith("/") && pathname.length > 1
		? pathname.slice(0, -1)
		: pathname;
}

function loadTwikooScript(): Promise<void> {
	if (typeof window.twikoo !== "undefined") {
		return Promise.resolve();
	}
	if (twikooScriptPromise) {
		return twikooScriptPromise;
	}

	twikooScriptPromise = new Promise<void>((resolve, reject) => {
		const existing = document.getElementById(
			TWIKOO_SCRIPT_ID,
		) as HTMLScriptElement | null;
		if (existing) {
			if (typeof window.twikoo !== "undefined") {
				resolve();
				return;
			}
			existing.addEventListener("load", () => resolve(), { once: true });
			existing.addEventListener(
				"error",
				(err) => {
					twikooScriptPromise = null;
					reject(err);
				},
				{ once: true },
			);
			return;
		}

		const script = document.createElement("script");
		script.id = TWIKOO_SCRIPT_ID;
		script.src = TWIKOO_SCRIPT_URL;
		script.async = true;
		script.setAttribute("data-cfasync", "false");
		script.onload = () => resolve();
		script.onerror = (err) => {
			twikooScriptPromise = null;
			script.remove();
			reject(err);
		};
		document.head.appendChild(script);
	});

	return twikooScriptPromise;
}

export async function initTwikooPage(): Promise<void> {
	const container = document.getElementById(TWIKOO_CONTAINER_ID);
	const commentEl = document.getElementById(TWIKOO_COMMENT_ID);
	if (!container || !commentEl) {
		return;
	}

	const envId = container.dataset.envId;
	if (!envId) {
		return;
	}

	const targetPath = getNormalizedPath();
	const currentState = container.dataset.twikooState;
	const currentPath = container.dataset.twikooPath;

	if (currentPath === targetPath) {
		if (currentState === "loading") {
			return;
		}
		if (currentState === "ready" && commentEl.children.length > 0) {
			return;
		}
	}

	container.dataset.twikooState = "loading";
	container.dataset.twikooPath = targetPath;

	try {
		await loadTwikooScript();

		// 若异步加载期间页面已切换，放弃旧容器初始化
		if (!document.body.contains(commentEl)) {
			return;
		}

		if (typeof window.twikoo === "undefined") {
			console.warn("[Twikoo] 脚本加载后未检测到 window.twikoo");
			container.dataset.twikooState = "error";
			return;
		}

		commentEl.innerHTML = "";
		const initOptions: Record<string, unknown> = {
			envId,
			el: `#${TWIKOO_COMMENT_ID}`,
			path: targetPath,
			lang: container.dataset.lang || "zh-cn",
		};
		if (container.dataset.region) {
			initOptions.region = container.dataset.region;
		}

		await window.twikoo.init(initOptions);
		container.dataset.twikooState = "ready";
	} catch (error) {
		container.dataset.twikooState = "error";
		console.error("[Twikoo] 初始化失败:", error);
	}
}

export function initTwikooHandler(): void {
	if (listenersRegistered) {
		return;
	}
	listenersRegistered = true;

	document.addEventListener("mizuki:page:loaded", () => {
		void initTwikooPage();
	});
}
