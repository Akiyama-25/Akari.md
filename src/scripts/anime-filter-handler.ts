/**
 * Anime 筛选过滤处理模块（兼容层，逻辑已收敛至 anime-handler.ts）
 */
import { initAnimeHandler } from "./anime-handler";

export {
	initAnimeHandler,
	initAnimePage,
	initFilterButtons,
} from "./anime-handler";

export function initFilterHandler() {
	initAnimeHandler();
}
