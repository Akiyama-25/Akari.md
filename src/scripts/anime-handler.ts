/**
 * Anime 追番页面交互与布局管理器
 * 处理追番列表布局切换（Grid/List）、状态筛选与过滤、无限滚动加载
 * 适配 Swup 客户端页面无刷新过渡跳转
 */

let activeObserver: IntersectionObserver | null = null;
let boundFilterListeners: [Element, string, EventListener][] = [];
let listenersRegistered = false;

/**
 * 更新追番列表布局（Grid 模式 vs List 模式）
 */
export function updateAnimeListLayout(layout: string, shouldAnimate = true): void {
	const animeListContainer = document.getElementById("anime-list-container");
	if (!animeListContainer) {
		return;
	}
	animeListContainer.dataset.currentLayout = layout;

	const animeItems = Array.from(
		document.querySelectorAll("[data-anime-status]"),
	) as HTMLElement[];
	const visibleItems = animeItems.filter(
		(item) => item.offsetParent !== null,
	);
	const firstPositions = new Map<
		HTMLElement,
		{ left: number; top: number; width: number; height: number }
	>();
	if (shouldAnimate) {
		visibleItems.forEach((item) => {
			const rect = item.getBoundingClientRect();
			firstPositions.set(item, {
				left: rect.left,
				top: rect.top,
				width: rect.width,
				height: rect.height,
			});
		});
	}

	const style = document.createElement("style");
	style.innerHTML = `.anime-grid-container .group { transition: none !important; }`;
	document.head.appendChild(style);
	animeListContainer.classList.remove(
		"anime-list-mode",
		"anime-grid-mode",
	);
	animeListContainer.classList.remove(
		"grid-cols-1",
		"md:grid-cols-2",
		"lg:grid-cols-3",
	);

	const rightSidebar = document.querySelector(
		".right-sidebar-container",
	) as HTMLElement | null;
	const mainGrid = document.getElementById("main-grid") as HTMLElement | null;

	if (layout === "grid") {
		animeListContainer.classList.add("anime-grid-mode");
		if (rightSidebar) {
			rightSidebar.style.display = "none";
			rightSidebar.classList.add("hidden-in-grid-mode");
		}
		if (mainGrid) {
			mainGrid.style.gridTemplateColumns =
				"var(--layout-sidebar-width) minmax(0, 1fr)";
			mainGrid.classList.add("two-column-layout");
		}
	} else {
		animeListContainer.classList.add("anime-list-mode");
		animeListContainer.classList.add("grid-cols-1", "lg:grid-cols-2");
		if (rightSidebar) {
			rightSidebar.style.display = "";
			rightSidebar.classList.remove("hidden-in-grid-mode");
		}
		if (mainGrid) {
			mainGrid.style.gridTemplateColumns = "";
			mainGrid.classList.remove("two-column-layout");
		}
	}

	void animeListContainer.offsetHeight;
	if (!shouldAnimate) {
		if (style.parentNode) {
			style.parentNode.removeChild(style);
		}
		return;
	}

	requestAnimationFrame(() => {
		if (style.parentNode) {
			style.parentNode.removeChild(style);
		}

		visibleItems.forEach((item) => {
			const first = firstPositions.get(item);
			if (!first) {
				return;
			}
			const last = item.getBoundingClientRect();

			const deltaX = Math.round(first.left - last.left);
			const deltaY = Math.round(first.top - last.top);
			const deltaW = last.width > 0 ? first.width / last.width : 1;
			const deltaH = last.height > 0 ? first.height / last.height : 1;

			if (
				Math.abs(deltaX) < 1 &&
				Math.abs(deltaY) < 1 &&
				Math.abs(deltaW - 1) < 0.01 &&
				Math.abs(deltaH - 1) < 0.01
			) {
				return;
			}

			item.style.willChange = "transform";
			item.style.transition = "none";
			item.style.transformOrigin = "top left";
			item.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
		});

		void animeListContainer.offsetHeight;
		requestAnimationFrame(() => {
			visibleItems.forEach((item) => {
				item.style.transition =
					"transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)";
				item.style.transform = "";
			});
			setTimeout(() => {
				visibleItems.forEach((item) => {
					item.style.transition = "";
					item.style.transformOrigin = "";
					item.style.transform = "";
					item.style.willChange = "";
				});
			}, 500);
		});
	});
}

function isPostListLayoutEnabled(): boolean {
	return (
		document.documentElement.getAttribute(
			"data-post-list-layout-enabled",
		) !== "false"
	);
}

function getPostListLayout(): string {
	return isPostListLayoutEnabled()
		? localStorage.getItem("postListLayout") || "list"
		: "list";
}

/**
 * 初始化追番布局
 */
export function initAnimeLayout(): boolean {
	const animeListContainer = document.getElementById("anime-list-container");
	if (!animeListContainer) {
		return false;
	}
	const currentLayout = getPostListLayout();
	updateAnimeListLayout(currentLayout, false);
	requestAnimationFrame(() => {
		animeListContainer.classList.remove("opacity-0");
	});
	return true;
}

/**
 * 初始化追番状态筛选标签与无限滚动监听
 */
export function initFilterButtons(): boolean {
	const filterTags = document.querySelectorAll(".anime-filter-tag");
	const sentinel = document.getElementById("infinite-scroll-sentinel");
	const listContainer = document.getElementById("anime-list-container");
	const lazyStore = document.getElementById(
		"anime-lazy-store",
	) as HTMLTemplateElement | null;

	if (!listContainer || filterTags.length === 0) {
		return false;
	}

	// 清理旧的事件监听器，防止多次初始化累加
	boundFilterListeners.forEach(([element, type, handler]) => {
		element.removeEventListener(type, handler);
	});
	boundFilterListeners = [];

	filterTags.forEach((tag) => {
		const clickHandler = function (this: HTMLElement) {
			if (this.classList.contains("anime-active")) {
				return;
			}

			filterTags.forEach((t) => t.classList.remove("anime-active"));
			this.classList.add("anime-active");

			// 切换筛选时，若模板中还有待懒加载的卡片，先一次性刷入 DOM
			if (
				lazyStore &&
				lazyStore.content.children.length > 0 &&
				listContainer
			) {
				const fragment = document.createDocumentFragment();
				while (lazyStore.content.firstChild) {
					const node = lazyStore.content.firstChild;
					fragment.appendChild(node);
				}
				listContainer.appendChild(fragment);
			}

			if (sentinel) {
				sentinel.style.display = "none";
			}
			if (activeObserver) {
				activeObserver.disconnect();
				activeObserver = null;
			}

			const initialHidden =
				listContainer.querySelectorAll(".initial-hidden");
			initialHidden.forEach((el) => {
				el.classList.remove("hidden", "initial-hidden");
			});

			const status = this.getAttribute("data-status");
			const animeItems = Array.from(listContainer.children).filter((item) =>
				item.hasAttribute("data-anime-status"),
			) as HTMLElement[];
			const itemsToHide: HTMLElement[] = [];
			const itemsToShow: HTMLElement[] = [];
			const itemsToKeep: HTMLElement[] = [];

			animeItems.forEach((item) => {
				const itemStatus = item.getAttribute("data-anime-status");
				const shouldShow =
					status === "all" || itemStatus === status;
				const isCurrentlyVisible =
					!item.classList.contains("anime-hidden");

				if (shouldShow) {
					if (isCurrentlyVisible) {
						itemsToKeep.push(item);
					} else {
						itemsToShow.push(item);
					}
				} else {
					if (isCurrentlyVisible) {
						itemsToHide.push(item);
					}
				}
			});

			const firstPositions = new Map<
				HTMLElement,
				{ left: number; top: number }
			>();
			itemsToKeep.forEach((item) => {
				const rect = item.getBoundingClientRect();
				firstPositions.set(item, {
					left: rect.left,
					top: rect.top,
				});
			});

			const runAnimation = () => {
				itemsToHide.forEach((item) => {
					item.classList.add("anime-hidden");
					item.classList.remove("anime-fade-out");
				});
				itemsToShow.forEach((item) => {
					item.classList.remove("anime-hidden");
					item.classList.add("anime-fade-in");
					item.style.transition = "none";
				});
				itemsToKeep.forEach((item) => {
					const first = firstPositions.get(item);
					if (!first) {
						return;
					}

					const rect = item.getBoundingClientRect();
					const deltaX = Math.round(first.left - rect.left);
					const deltaY = Math.round(first.top - rect.top);

					if (deltaX !== 0 || deltaY !== 0) {
						item.style.willChange = "transform";
						item.style.transition = "none";
						item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
					}
				});

				requestAnimationFrame(() => {
					itemsToKeep.forEach((item) => {
						item.style.transition =
							"transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)";
						item.style.transform = "";
					});

					const STAGGER_LIMIT = 20;
					itemsToShow.forEach((item, index) => {
						item.style.transition = "";
						item.style.willChange = "opacity, transform";

						const delay =
							index < STAGGER_LIMIT ? index * 30 : 0;
						item.style.transitionDelay = `${delay}ms`;

						requestAnimationFrame(() => {
							item.classList.remove("anime-fade-in");
							item.classList.add("anime-fade-in-active");
						});
					});

					setTimeout(
						() => {
							[...itemsToKeep, ...itemsToShow].forEach(
								(item) => {
									item.classList.remove(
										"anime-fade-in-active",
									);
									item.style.transition = "";
									item.style.transform = "";
									item.style.opacity = "";
									item.style.willChange = "";
									item.style.transitionDelay = "";
								},
							);
						},
						600 +
							(itemsToShow.length > 0
								? Math.min(itemsToShow.length, 20) * 30
								: 0),
					);
				});
			};

			if (itemsToHide.length > 0) {
				itemsToHide.forEach((item) =>
					item.classList.add("anime-fade-out"),
				);
				setTimeout(runAnimation, 200);
			} else {
				runAnimation();
			}
		};

		tag.addEventListener("click", clickHandler as EventListener);
		boundFilterListeners.push([tag, "click", clickHandler as EventListener]);
	});

	// 重建并挂载 IntersectionObserver
	if (activeObserver) {
		activeObserver.disconnect();
		activeObserver = null;
	}

	if (sentinel && lazyStore && listContainer) {
		if (lazyStore.content.children.length > 0) {
			sentinel.style.display = "";
			activeObserver = new IntersectionObserver(
				(entries) => {
					if (entries[0].isIntersecting) {
						const BATCH_SIZE = 24;
						if (lazyStore.content.children.length === 0) {
							sentinel.style.display = "none";
							activeObserver?.disconnect();
							activeObserver = null;
							return;
						}

						const fragment = document.createDocumentFragment();
						let movedCount = 0;
						while (
							lazyStore.content.firstChild &&
							movedCount < BATCH_SIZE
						) {
							const node = lazyStore.content
								.firstChild as HTMLElement;
							if (node.nodeType === 1) {
								node.classList.add("anime-fade-in-active");
							}
							fragment.appendChild(node);
							movedCount++;
						}

						requestAnimationFrame(() => {
							listContainer.appendChild(fragment);
							if (lazyStore.content.children.length === 0) {
								sentinel.style.display = "none";
								activeObserver?.disconnect();
								activeObserver = null;
							}
						});
					}
				},
				{ rootMargin: "200px" },
			);
			activeObserver.observe(sentinel);
		} else {
			sentinel.style.display = "none";
		}
	} else if (sentinel) {
		sentinel.style.display = "none";
	}

	return true;
}

/**
 * 完整初始化追番页面
 */
export function initAnimePage(): boolean {
	const listContainer = document.getElementById("anime-list-container");
	if (!listContainer) {
		if (activeObserver) {
			activeObserver.disconnect();
			activeObserver = null;
		}
		return false;
	}

	initAnimeLayout();
	initFilterButtons();
	return true;
}

/**
 * 注册全局事件监听器（包括 Swup 钩子与布局切换事件）
 */
export function setupAnimeListeners(): void {
	if (listenersRegistered) {
		return;
	}
	listenersRegistered = true;

	// 布局切换全局事件
	window.addEventListener("layoutChange", ((
		event: CustomEvent<{ layout: string }>,
	) => {
		const listContainer = document.getElementById("anime-list-container");
		if (listContainer && event.detail?.layout) {
			updateAnimeListLayout(event.detail.layout, true);
		}
	}) as EventListener);

	// Swup DOM 事件监听
	const handleSwupTransition = () => {
		initAnimePage();
	};

	document.addEventListener("swup:content:replace", handleSwupTransition);
	document.addEventListener("swup:page:view", handleSwupTransition);
	document.addEventListener("swup:contentReplaced", handleSwupTransition);

	// Swup 实例 hooks 挂载
	const registerSwupHooks = () => {
		if (window.swup?.hooks) {
			window.swup.hooks.on("content:replace", () => {
				initAnimePage();
			});
			window.swup.hooks.on("page:view", () => {
				initAnimePage();
			});
		}
	};

	if (window.swup) {
		registerSwupHooks();
	} else {
		document.addEventListener("swup:enable", registerSwupHooks);
	}
}

/**
 * 统一入口函数
 */
export function initAnimeHandler(): void {
	setupAnimeListeners();
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => initAnimePage());
	} else {
		initAnimePage();
	}
}
