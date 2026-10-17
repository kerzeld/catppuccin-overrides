import mustache from "mustache";
import fs from "node:fs";
import path from "node:path";
import { PATH_OUT, PATH_TEMPLATES } from "./const.ts";
import { ensureDirectoryExistence } from "./utils.ts";
import type { IThemeView } from "./interfaces.ts";

/**
 * Catppuccin publishes every userstyle bundled into a single Stylus "import"
 * file. We fetch it, swap each style's `@import` of the shared Less library for
 * a locally generated library that contains this repo's palette, and pin the
 * accent colour. The result is `out/<theme>/userStyles.json`, importable in
 * Stylus via "Import" (or by dropping it into Stylus' backup folder).
 */
const USERSTYLES_URL =
	"https://github.com/catppuccin/userstyles/releases/download/all-userstyles-export/import.json";

// Successful downloads are cached here so re-runs (and offline runs) still work.
const CACHE_PATH = path.join(PATH_OUT, ".cache", "userstyles-import.json");

// Import statements used across catppuccin/userstyles versions.
const LIB_IMPORTS = [
	'@import "https://userstyles.catppuccin.com/lib/std/v1.less";',
	'@import "https://userstyles.catppuccin.com/lib/lib.less";',
	"@import url(\"https://userstyles.catppuccin.com/lib/lib.less\");",
];

interface IAccentColorVar {
	value: unknown;
}

interface IUserStyle {
	usercssData?: {
		vars?: Record<string, IAccentColorVar>;
	};
	sourceCode?: string;
}

let cachedUserStyles: IUserStyle[] | undefined;

async function downloadUserStyles(): Promise<IUserStyle[]> {
	if (cachedUserStyles) return cachedUserStyles;
	try {
		const response = await fetch(USERSTYLES_URL);
		if (!response.ok) {
			throw new Error(`userstyles export returned ${response.status} ${response.statusText}`);
		}
		const text = await response.text();
		ensureDirectoryExistence(CACHE_PATH);
		fs.writeFileSync(CACHE_PATH, text);
		cachedUserStyles = JSON.parse(text) as IUserStyle[];
	} catch (error) {
		if (!fs.existsSync(CACHE_PATH)) throw error;
		console.warn(
			`Using cached userstyles export (${(error as Error).message})`,
		);
		cachedUserStyles = JSON.parse(fs.readFileSync(CACHE_PATH, "utf8")) as IUserStyle[];
	}
	return cachedUserStyles;
}

export async function getUserStyles(view: IThemeView): Promise<IUserStyle[]> {
	const userStyles = await downloadUserStyles();
	const lessLibrary = mustache.render(
		fs.readFileSync(path.join(PATH_TEMPLATES, "stylus.less")).toString(),
		view,
	);

	for (const style of userStyles) {
		if (!style.sourceCode) continue;

		const accentColor = style.usercssData?.vars?.accentColor;
		if (accentColor) accentColor.value = view.accent;

		for (const libraryImport of LIB_IMPORTS) {
			style.sourceCode = style.sourceCode.replaceAll(libraryImport, lessLibrary);
		}
	}

	return userStyles;
}
