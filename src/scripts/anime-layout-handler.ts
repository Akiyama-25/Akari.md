/**
 * Anime 布局处理模块（兼容层，逻辑已收敛至 anime-handler.ts）
 */
import { initAnimeHandler } from "./anime-handler";

export {
	initAnimeHandler,
	initAnimeLayout,
	updateAnimeListLayout,
} from "./anime-handler";

export interface LayoutHandlerOptions {
	containerId?: string;
	hasRightSidebars?: boolean;
}

export function initAnimeLayoutHandler(_options?: LayoutHandlerOptions) {
	initAnimeHandler();
}

export function initLayoutListener(
	_containerId?: string,
	_hasRightSidebars?: boolean,
) {
	initAnimeHandler();
}
