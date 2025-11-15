import type { IThemeView, TColorNames } from "./interfaces.ts";
import lzma from "lzma";
import { encode } from "@msgpack/msgpack";
import { styleText } from "node:util";
import { PATH_OUT } from "./const.ts";
import path from "node:path";
import fs from "node:fs";
import { ensureDirectoryExistence } from "./utils.ts";

const colors: Record<string, TColorNames | "accent"> = {
	toolbar: "mantle",
	toolbar_text: "text",
	frame: "mantle",
	tab_background_text: "text",
	toolbar_field: "crust",
	toolbar_field_text: "text",
	tab_line: "accent",
	popup: "mantle",
	popup_text: "text",
	button_background_active: "overlay1",
	frame_inactive: "mantle",
	icons_attention: "accent",
	icons: "accent",
	ntp_background: "mantle",
	ntp_text: "text",
	popup_border: "accent",
	popup_highlight_text: "text",
	popup_highlight: "surface2",
	sidebar_border: "accent",
	sidebar_highlight_text: "overlay1",
	sidebar_highlight: "accent",
	sidebar_text: "text",
	sidebar: "mantle",
	tab_background_separator: "accent",
	tab_loading: "accent",
	tab_selected: "crust",
	tab_text: "text",
	toolbar_bottom_separator: "mantle",
	toolbar_field_border_focus: "accent",
	toolbar_field_border: "mantle",
	toolbar_field_focus: "mantle",
	toolbar_field_highlight_text: "mantle",
	toolbar_field_highlight: "accent",
	toolbar_field_separator: "accent",
	toolbar_vertical_separator: "accent",
};

export function generateFirefoxThemeManifest(view: IThemeView) {
	const finishedColors: Record<string, string> = {};

	for (const key in colors) {
		const value = colors[key];
		finishedColors[key] = `rgb(${view.colors[value].rgb})`;
	}

	return {
		name: view.name,
		version: "1.0",
		manifest_version: 2,
		theme: {
			colors: finishedColors,
		},
	};
}

export function generateFirefoxColorLink(view: IThemeView) {
	const finishedColors: Record<string, { r: number; g: number; b: number }> = {};

	for (const key in colors) {
		const value = colors[key];
		finishedColors[key] = {
			r: view.colors[value].color.red(),
			g: view.colors[value].color.green(),
			b: view.colors[value].color.blue(),
		};
	}

	const theme = {
		name: view.name,
		colors: finishedColors,
	};

	const encoded = encode(theme);
	const compressed = lzma.compress(encoded);

	const linkFile = path.join(PATH_OUT, "firefox", "colors-link.txt");
	ensureDirectoryExistence(linkFile);
	fs.writeFileSync(linkFile, "https://color.firefox.com/?theme=" + Buffer.from(compressed).toString("base64url"));

	console.log("Firefox Colors Link:");
	console.log(styleText("blackBright", "#########################################"));
	console.log(styleText("blue", "https://color.firefox.com/?theme=" + Buffer.from(compressed).toString("base64url")));
	console.log(styleText("blackBright", "#########################################"));
}
