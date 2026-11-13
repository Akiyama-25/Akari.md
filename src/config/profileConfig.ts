import type { ProfileConfig } from "../types/config";

// 个人资料配置
export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.webp", // 相对于 /src 目录。如果以 '/' 开头，则相对于 /public 目录
	name: "Akari",
	bio: `簡単なことも解らないわ あたしって何だっけ
—フォニイ`,
	typewriter: {
		enable: true, // 启用个人简介打字机效果
		speed: 80, // 打字速度（毫秒）
	},
	links: [
		{
			name: "GitHub",
			icon: "fa7-brands:github",
			url: "https://github.com/Akiyama-25",
		},
		{
			name: "Email",
			icon: "material-symbols:mail-outline",
			url: "mailto:hana@anon-akari.top",
		},
	],
};
