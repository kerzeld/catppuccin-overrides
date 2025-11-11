import type { IThemeView, TColorNames } from "./interfaces.ts";

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
	popup_highlight: "mantle",
	sidebar_border: "accent",
	sidebar_highlight_text: "overlay1",
	sidebar_highlight: "accent",
	sidebar_text: "text",
	sidebar: "mantle",
	tab_background_separator: "accent",
	tab_loading: "accent",
	tab_selected: "surface1",
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
