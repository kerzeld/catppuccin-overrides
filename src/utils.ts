import Color from "color";
import type { IColorValue, IHSVOverride, ITheme, IThemeView, TColorNames } from "./interfaces.ts";
import { MochaColors } from "./colors.ts";
import fs from "node:fs";
import path from "node:path";
import { DEFAULT_OPACITY } from "./const.ts";

function toColorValue(hex: string): IColorValue {
	const color = new Color(hex);
	return {
		rgb: color.rgb().toString().replace("rgb(", "").replace(")", ""),
		hex: hex.replace("#", ""),
		color,
	};
}

function buildHexFromHSV(overrides: IHSVOverride): Partial<Record<TColorNames, string>> {
	const colorObj: Partial<Record<TColorNames, string>> = {};
	for (const _key in overrides.overrides) {
		const key = _key as TColorNames;
		const hsv = { ...overrides.base, ...overrides.overrides[key] };
		colorObj[key] = new Color(hsv, "hsv").hex();
	}

	return colorObj;
}

export function buildThemeView(theme: ITheme): IThemeView {
	const colors: Record<string, string> = { ...MochaColors };
	for (const override of theme.overrides.hsv ?? []) {
		Object.assign(colors, buildHexFromHSV(override));
	}
	Object.assign(colors, theme.overrides.hex);

	const view: IThemeView = {
		name: "catppuccin-kerzeld-" + theme.name,
		accent: theme.accent,
		colors: {} as Record<TColorNames | "accent", IColorValue>,
		opacity: {
			num: Math.floor(255 * DEFAULT_OPACITY).toString(),
			float: DEFAULT_OPACITY.toString(),
		},
	};

	for (const name of Object.keys(colors)) {
		view.colors[name as TColorNames] = toColorValue(colors[name]);
	}

	view.colors.accent = toColorValue(colors[theme.accent]);

	return view;
}

export function recurseDirRead(dir: string): string[] {
	const files: string[] = [];
	for (const file of fs.readdirSync(dir, { recursive: true, withFileTypes: true })) {
		if (file.isFile()) files.push(path.join(file.parentPath, file.name));
	}
	return files;
}

export function ensureDirectoryExistence(filePath: string): void {
	const dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
		return;
	}
	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname);
}
