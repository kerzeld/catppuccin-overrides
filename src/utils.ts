import Color from "color";
import type { IHSVOverride, ITheme, IThemeView, TColorNames } from "./interfaces.ts";
import { MochaColors } from "./colors.ts";
import fs from "node:fs";
import path from "node:path";

export function buildHexFromHSV(overrides: IHSVOverride) {
	const colorObj: Partial<Record<TColorNames, string>> = {};
	for (const _key in overrides.overrides) {
		const key = _key as TColorNames;
		const hsv = { ...overrides.base, ...overrides.overrides[key] };
		const color = new Color(hsv, "hsv");

		colorObj[key] = color.hex();
	}

	return colorObj;
}

export function buildThemeView(theme: ITheme): IThemeView {
	// Build hsv overrides
	const hsvOverriedes = theme.overrides.hsv
		?.map((ov) => buildHexFromHSV(ov))
		.reduce((prev, curr) => ({ ...prev, ...curr }));

	// Add all overrides together
	const colors: Record<string, string> = { ...MochaColors, ...hsvOverriedes, ...theme.overrides.hex };

	// Create view object
	const view: IThemeView = { name: "catppuccin-kerzeld-" + theme.name, accent: theme.accent, colors: {} };

	// Generate color formats
	for (const name of Object.keys(colors)) {
		const color = new Color(colors[name]);
		view.colors[name] = {
			rgb: color.rgb().toString().replace("rgb(", "").replace(")", ""),
			hex: colors[name].replace("#", ""),
		};
	}

	// Add accent color
	const color = new Color(colors[theme.accent]);
	view.colors["accent"] = {
		rgb: color.rgb().toString().replace("rgb(", "").replace(")", ""),
		hex: colors[theme.accent].replace("#", ""),
	};

	return view;
}

export function recurseDirRead(dir: string) {
	const files: string[] = [];
	for (const file of fs.readdirSync(dir, { recursive: true, withFileTypes: true })) {
		if (file.isFile()) files.push(path.join(file.parentPath, file.name));
	}
	return files;
}

export function ensureDirectoryExistence(filePath: string) {
	var dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
		return true;
	}
	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname);
}
