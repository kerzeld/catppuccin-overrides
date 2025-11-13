import path from "node:path";
import { PATH_CONFIG, PATH_OUT } from "./const.ts";
import type { IThemeView } from "./interfaces.ts";
import { ensureDirectoryExistence, recurseDirRead } from "./utils.ts";
import fs from "node:fs";
import { ThemeKeys } from "./colors.ts";
import { exec } from "node:child_process";

const FOLDER_NAME = "whiskers";

export function generateWhiskersThemes(view: IThemeView) {
	const overridesPath = path.join(PATH_OUT, FOLDER_NAME, "overrides.json");
	const colors = {};
	for (const key of ThemeKeys) {
		colors[key] = view.colors[key].hex;
	}

	ensureDirectoryExistence(overridesPath);
	fs.writeFileSync(overridesPath, JSON.stringify({ all: colors }));

	const templates = recurseDirRead(path.join(PATH_CONFIG, FOLDER_NAME));
	// Read and write templates
	for (const template of templates) {
		const str = fs.readFileSync(template).toString();
		const parts = str.split("---");
		const configPart = parts[1].replace("%accent%", view.accent);
		const templatePart = parts[2];
		const templateRelativePath = template.replace(PATH_CONFIG + "/", "");
		const outFilePath = path.join(PATH_OUT, templateRelativePath);

		ensureDirectoryExistence(outFilePath);
		fs.writeFileSync(outFilePath, "---" + configPart + "---" + templatePart);

		exec(
			"whiskers --color-overrides ./overrides.json zed.tera -f mocha",
			{
				cwd: path.join(PATH_OUT, FOLDER_NAME),
			},
			(stdin, stderr) => {
				console.log(stdin);
				console.log(stderr);
			},
		);
	}
}
