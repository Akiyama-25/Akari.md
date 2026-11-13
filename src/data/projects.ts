// Project data configuration file
// Used to manage data for the project display page

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	visitUrl?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
	showImage?: boolean;
}

export const projectsData: Project[] = [
	{
		id: "ame-player",
		title: "Ame-Player",
		description:
			"Android本地播放器，兼网易云第三方客户端，支持USB独占",
		image: "",
		category: "mobile",
		techStack: ["Kotlin", "Android", "Audio"],
		status: "in-progress",
		sourceCode: "https://github.com/Akiyama-25/Ame-Player",
		startDate: "2024-01-01",
		featured: true,
		tags: ["Android", "Music", "Player"],
		showImage: false,
	},
	{
		id: "tsukimibox",
		title: "TsukimiBox",
		description:
			"全能微型调试与常用功能聚合箱，轻快简洁的 Android 工具利器。",
		image: "",
		category: "mobile",
		techStack: ["Kotlin", "Android", "Toolbox"],
		status: "in-progress",
		sourceCode: "https://github.com/Akiyama-25/TsukimiBox",
		startDate: "2024-05-01",
		featured: true,
		tags: ["Android", "Toolbox", "Utility"],
		showImage: false,
	},
	{
		id: "ncm-converter",
		title: "NCM Converter",
		description:
			"网易云音乐加密音频格式本地极速转码工具，支持完整元数据与封面保留。",
		image: "",
		category: "desktop",
		techStack: ["Kotlin", "Java", "Audio"],
		status: "completed",
		sourceCode: "https://github.com/Akiyama-25/NCM-Converter-For-Android",
		startDate: "2024-08-01",
		featured: true,
		tags: ["Audio", "Converter", "NCM"],
		showImage: false,
	},
	{
		id: "rename-apps",
		title: "Rename Apps",
		description:
			"APK 自动化重命名、信息提取与一键重签名小工具。",
		image: "",
		category: "other",
		techStack: ["Shell", "Python", "Android"],
		status: "completed",
		sourceCode: "https://github.com/Akiyama-25/rename-your-APPs",
		startDate: "2024-09-01",
		featured: true,
		tags: ["Android", "Automation", "Sign"],
		showImage: false,
	},
];

// Get project statistics
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter((p) => p.status === "completed").length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// Get projects by category
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// Get featured projects
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// Get all tech stacks
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => {
			techSet.add(tech);
		});
	});
	return Array.from(techSet).sort();
};
