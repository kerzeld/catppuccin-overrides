import mustache from "mustache";
import type { MochaColors } from "./colors.ts";
import { PATH_CONFIG } from "./const.ts";
import type { IThemeView } from "./interfaces.ts";
import fs from "node:fs";
import path from "node:path";

interface IUserCSS {
	vars: {
		accentColor: {
			value: keyof typeof MochaColors;
		};
	};
}

interface IUserStyle {
	usercssData?: IUserCSS;
	sourceCode?: string;
}

let userstyleData: undefined | IUserStyle[] = undefined;

async function donwloadStyles(): Promise<IUserStyle[]> {
	if (userstyleData) return userstyleData;
	const resp = await fetch("https://github.com/catppuccin/userstyles/releases/download/all-userstyles-export/import.json");
	userstyleData = await resp.json();
	return userstyleData!;
}

export async function getUserStyles(theme: IThemeView) {
	const importObject = await donwloadStyles();
	const themeLessFile = fs.readFileSync(path.join(PATH_CONFIG, "templates/stylus.less")).toString();

	const renderedLessFile = mustache.render(themeLessFile, theme);
	//const finalLessString = renderedLessFile.replaceAll("\n", "").replace(/\s+/g, " ").trim();

	for (const style of importObject) {
		if (style.sourceCode && style.usercssData) {
			style.usercssData.vars.accentColor.value = theme.accent;
			style.sourceCode = style.sourceCode.replaceAll('@import "https://userstyles.catppuccin.com/lib/lib.less";', renderedLessFile);
		}
	}

	return importObject;
}
