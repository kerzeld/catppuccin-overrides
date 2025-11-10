import Color from "color";
import mustache from "mustache";
import fs from "node:fs";
import path from "node:path";
import { MochaColors } from "./colors.ts";
import { PATH_TEMPLATES, PATH_THEMES, THEME_JSON_FILE_NAME } from "./const.ts";
import { getUserStyles } from "./userstyles.ts";
import type { IThemeObject } from "./interfaces.ts";

const themes = ["pink", "yellow"];

function recurseDirRead(dir: string) {
	const files: string[] = [];
	for (const file of fs.readdirSync(dir, { recursive: true, withFileTypes: true })) {
		if (file.isFile()) files.push(path.join(file.parentPath, file.name));
	}
	return files;
}

function ensureDirectoryExistence(filePath: string) {
	var dirname = path.dirname(filePath);
	if (fs.existsSync(dirname)) {
		return true;
	}
	ensureDirectoryExistence(dirname);
	fs.mkdirSync(dirname);
}

async function main() {
	for (const theme of themes) {
		const themePath = path.join(PATH_THEMES, theme);
		const outPath = path.join(themePath, "out");

		try {
			fs.rmSync(outPath, { recursive: true });
		} catch (error) {
			// dir already deleted
		}

		// Read theme and override base colors
		const themeJSON = JSON.parse(fs.readFileSync(path.join(themePath, THEME_JSON_FILE_NAME)).toString());
		const colors = { ...MochaColors, ...themeJSON.overrides };

		// init template object
		const themeObject: IThemeObject = { colors: {}, name: themeJSON.name, accent: themeJSON.accent };

		// Generate color formats
		for (const name of Object.keys(colors)) {
			const color = new Color(colors[name]);
			themeObject.colors[name] = {
				rgb: color.rgb().toString().replace("rgb(", "").replace(")", ""),
				hex: colors[name].replace("#", ""),
			};
		}

		// Add accent color
		const color = new Color(colors[themeJSON.accent]);
		themeObject.colors["accent"] = {
			rgb: color.rgb().toString().replace("rgb(", "").replace(")", ""),
			hex: colors[themeJSON.accent].replace("#", ""),
		};

		const templates = recurseDirRead(PATH_TEMPLATES);

		// Read and write templates
		for (const template of templates) {
			const out = mustache.render(fs.readFileSync(template).toString(), themeObject);
			const templateRelativePath = template.replace(PATH_TEMPLATES + "/", "");
			const outFilePath = path.join(outPath, templateRelativePath);

			ensureDirectoryExistence(outFilePath);
			fs.writeFileSync(outFilePath, out);
		}

		fs.writeFileSync(path.join(outPath, "userstyles.json"), JSON.stringify(await getUserStyles(themeObject)));

		console.log("Created themes for " + theme);
	}
}

main();
