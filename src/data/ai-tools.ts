export type AIToolCategory =
	| "chat"
	| "coding"
	| "image"
	| "audio"
	| "video"
	| "writing"
	| "search"
	| "other";

export type AIToolFrequency =
	| "daily"
	| "weekly"
	| "occasional"
	| "experimental";

export type LocaleString = Partial<
	Record<"en" | "zh_CN" | "zh_TW" | "ja", string>
>;

export function getLocaleString(value: LocaleString, lang: string): string {
	return value[lang as keyof LocaleString] ?? value["en"] ?? "";
}

export interface AITool {
	id: string;
	name: string;
	description: LocaleString;
	icon: string;
	category: AIToolCategory;
	frequency: AIToolFrequency;
	url?: string;
	usage?: LocaleString;
	tags?: string[];
	color?: string;
}

// Replace the examples below with your own AI tools
export const aiToolsData: AITool[] = [
	{
		"id": "ai-5014",
		"name": "Antigravity",
		"description": {
			"en": "The Agent of Google.",
			"zh_CN": "Google旗下的Agent"
		},
		"icon": "material-symbols:code",
		"category": "coding",
		"frequency": "weekly",
		"url": "https://antigravity.google",
		"tags": [
			"Vibe Coding",
			"Agent"
		],
		"color": "#4271ff"
	}
];
