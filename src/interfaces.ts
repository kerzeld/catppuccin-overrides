import type { MochaColors, MochaTheme } from "./colors.ts";
import type { ColorInstance } from "color";

export type TColorNames = keyof typeof MochaTheme;

export interface IColorHSV {
	h: number;
	s: number;
	v: number;
}

export interface IHSVOverride {
	base: IColorHSV;
	overrides: Partial<Record<TColorNames, Partial<IColorHSV>>>;
}

export interface IColorValue {
	rgb: string;
	hex: string;
	color: ColorInstance;
}

export interface IThemeView {
	colors: Record<TColorNames | "accent", IColorValue>;
	name: string;
	opacity: {
		float: string;
		num: string;
	};
	accent: keyof typeof MochaColors;
}

export interface ITheme {
	accent: keyof typeof MochaColors;
	name: string;
	overrides: {
		// these have the highest priority
		hex?: Partial<Record<TColorNames, string>>;
		// second priority and ordered from first to last
		hsv?: IHSVOverride[];
	};
}
