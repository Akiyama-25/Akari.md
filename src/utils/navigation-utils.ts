/**
 * 导航工具函数
 * 提供统一的页面导航功能，支持 Swup 无刷新跳转
 */

/**
 * 导航到指定页面
 * @param url 目标页面URL
 * @param options 导航选项
 */
export function navigateToPage(
	url: string,
	options?: {
		replace?: boolean;
		force?: boolean;
	},
): void {
	// 检查 URL 是否有效
	if (!url || typeof url !== "string") {
		console.warn("navigateToPage: Invalid URL provided");
		return;
	}

	// 如果是外部链接，直接跳转
	if (
		url.startsWith("http://") ||
		url.startsWith("https://") ||
		url.startsWith("//")
	) {
		window.open(url, "_blank");
		return;
	}

	// 如果是锚点链接，滚动到对应位置
	if (url.startsWith("#")) {
		const element = document.getElementById(url.slice(1));
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		return;
	}

	// 检查 Swup 是否可用
	if (typeof window !== "undefined" && window.swup) {
		try {
			// 使用 Swup 进行无刷新跳转
			if (options?.replace) {
				window.swup.navigate(url, { history: false });
			} else {
				window.swup.navigate(url);
			}
		} catch (error) {
			console.error("Swup navigation failed:", error);
			// 降级到普通跳转
			fallbackNavigation(url, options);
		}
	} else {
		// Swup 不可用时的降级处理
		fallbackNavigation(url, options);
	}
}

/**
 * 降级导航函数
 * 当 Swup 不可用时使用普通的页面跳转
 */
function fallbackNavigation(
	url: string,
	options?: {
		replace?: boolean;
		force?: boolean;
	},
): void {
	if (options?.replace) {
		window.location.replace(url);
	} else {
		window.location.href = url;
	}
}

/**
 * 检查 Swup 是否已准备就绪
 */
export function isSwupReady(): boolean {
	return typeof window !== "undefined" && !!window.swup;
}

/**
 * 等待 Swup 准备就绪
 * @param timeout 超时时间（毫秒）
 */
export function waitForSwup(timeout = 5000): Promise<boolean> {
	return new Promise((resolve) => {
		if (isSwupReady()) {
			resolve(true);
			return;
		}

		let timeoutId: ReturnType<typeof setTimeout>;

		const checkSwup = () => {
			if (isSwupReady()) {
				clearTimeout(timeoutId);
				document.removeEventListener("swup:enable", checkSwup);
				resolve(true);
			}
		};

		// 监听 Swup 启用事件
		document.addEventListener("swup:enable", checkSwup);

		// 设置超时
		timeoutId = setTimeout(() => {
			document.removeEventListener("swup:enable", checkSwup);
			resolve(false);
		}, timeout);
	});
}

/**
 * 预加载页面
 * @param url 要预加载的页面URL
 */
export function preloadPage(url: string): void {
	if (!url || typeof url !== "string") {
		return;
	}

	// 如果 Swup 可用，使用其预加载功能
	if (isSwupReady() && window.swup?.preload) {
		try {
			window.swup.preload(url);
		} catch (error) {
			console.warn("Failed to preload page:", error);
		}
	}
}

/**
 * 检查是否为同源链接
 */
function isSameOrigin(url: string): boolean {
	try {
		const parsed = new URL(url, window.location.origin);
		return parsed.origin === window.location.origin;
	} catch {
		return false;
	}
}

/**
 * 检查网络状态是否为慢速连接
 */
function isSlowConnection(): boolean {
	const conn = (
		navigator as unknown as { connection?: { effectiveType: string } }
	).connection;
	if (!conn) {
		return false;
	}
	return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g";
}

/**
 * 初始化链接预加载功能
 * 基于用户真实交互意图（移动端 touchstart、桌面端 hover 悬停）进行即时预加载
 * 避免首屏盲目预加载导致缓存陈旧，同时利用点击间隙实现秒开
 */
export function initLinkPreloading(): void {
	// 如果 Swup 不可用或用户偏好减少动画，不进行预加载
	if (!isSwupReady() || isSlowConnection()) {
		return;
	}

	// 检查用户是否偏好减少动画
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		return;
	}

	// 已预加载的 URL 集合，避免重复预加载
	const preloadedUrls = new Set<string>();

	const triggerPreload = (link: HTMLAnchorElement) => {
		const href = link.href;
		if (
			href &&
			isSameOrigin(href) &&
			!preloadedUrls.has(href) &&
			href !== window.location.href &&
			!href.includes("#") &&
			!link.hasAttribute("download") &&
			link.target !== "_blank"
		) {
			preloadedUrls.add(href);
			preloadPage(href);
		}
	};

	let hoverTimer: ReturnType<typeof setTimeout> | null = null;

	// 桌面端鼠标悬停 50ms 后预加载（防快速滑过抖动）
	document.addEventListener(
		"pointerenter",
		(event) => {
			const target = (event.target as HTMLElement)?.closest?.("a");
			if (target && target instanceof HTMLAnchorElement) {
				if (hoverTimer) clearTimeout(hoverTimer);
				hoverTimer = setTimeout(() => {
					triggerPreload(target);
				}, 50);
			}
		},
		{ capture: true, passive: true },
	);

	document.addEventListener(
		"pointerleave",
		(event) => {
			const target = (event.target as HTMLElement)?.closest?.("a");
			if (target) {
				if (hoverTimer) {
					clearTimeout(hoverTimer);
					hoverTimer = null;
				}
			}
		},
		{ capture: true, passive: true },
	);

	// 移动端手指触碰（touchstart）瞬间预加载，利用触碰至点击的 100~300ms 间隙实现秒开
	document.addEventListener(
		"touchstart",
		(event) => {
			const target = (event.target as HTMLElement)?.closest?.("a");
			if (target && target instanceof HTMLAnchorElement) {
				triggerPreload(target);
			}
		},
		{ capture: true, passive: true },
	);
}

/**
 * 获取当前页面路径
 */
export function getCurrentPath(): string {
	return typeof window !== "undefined" ? window.location.pathname : "";
}

/**
 * 检查是否为首页
 */
export function isHomePage(): boolean {
	const path = getCurrentPath();
	return path === "/" || path === "";
}

/**
 * 检查是否为文章页面
 */
export function isPostPage(): boolean {
	const path = getCurrentPath();
	return path.startsWith("/posts/");
}

/**
 * 检查两个路径是否相等
 */
export function pathsEqual(path1: string, path2: string): boolean {
	// 标准化路径（移除末尾斜杠）
	const normalize = (path: string) => {
		return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
	};

	return normalize(path1) === normalize(path2);
}
