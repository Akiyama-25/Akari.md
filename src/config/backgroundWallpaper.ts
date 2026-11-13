import type { FullscreenWallpaperConfig } from "../types/config";

export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
	enable: true,
	src: {
		desktop: [
			"/assets/desktop-banner/banner_1794572087249.webp",
			"/assets/desktop-banner/banner_drive_desk_1.webp",
		],
		mobile: [
			"/assets/mobile-banner/banner_1794572110000.webp",
			"/assets/mobile-banner/banner_drive_mob_1.webp",
			"/assets/mobile-banner/banner_drive_mob_3.webp",
			"/assets/mobile-banner/banner_drive_mob_4.webp",
			"/assets/mobile-banner/banner_drive_mob_5.webp",
		],
	},
	position: "center",
	carousel: {
		enable: true,
		interval: 5,
	},
	zIndex: -1,
	opacity: 0.8,
	blur: 1,
	switchable: true,
	overlay: {
		opacity: 0.8, // 壁纸不透明度，0-1
		blur: 1.5, // 背景模糊半径（px）
		cardOpacity: 0.8, // 卡片不透明度，0-1
		switchable: {
			opacity: true,
			blur: true,
			cardOpacity: true,
		},
	},
	fullscreen: {
		switchable: {
			opacity: true,
			blur: true,
		},
	},
};
