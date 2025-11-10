import type { MochaColors } from "./colors";

export interface IThemeObject {
	colors: Record<string, { rgb: string; hex: string }>;
	name: string;
	accent: keyof typeof MochaColors;
}
