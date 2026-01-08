import path from "node:path";
import { DEFAULT_OPACITY, PATH_CONFIG } from "./const.ts";
import type { IThemeView } from "./interfaces.ts";
import { ensureDirectoryExistence, recurseDirRead } from "./utils.ts";
import fs from "node:fs";
import { ThemeKeys } from "./colors.ts";
import { exec } from "node:child_process";

const FOLDER_NAME = "whiskers";

export async function generateWhiskersThemes(view: IThemeView, outPath: string) {
	const overridesPath = path.join(outPath, FOLDER_NAME, "overrides.json");
	const colors = {};
	for (const key of ThemeKeys) {
		colors[key] = view.colors[key].hex;
	}

	ensureDirectoryExistence(overridesPath);
	fs.writeFileSync(overridesPath, JSON.stringify({ all: colors }));

	const templates = recurseDirRead(path.join(PATH_CONFIG, FOLDER_NAME));
	// Read and write templates
	for (const template of templates) {
		let str = fs.readFileSync(template).toString();
		str = str.replaceAll("%accent%", view.accent);
		str = str.replaceAll("%name%", view.name);
		str = str.replaceAll("opacity.float", DEFAULT_OPACITY.toString());

		const templateRelativePath = template.replace(PATH_CONFIG + "/", "");
		const outFilePath = path.join(outPath, templateRelativePath);

		ensureDirectoryExistence(outFilePath);
		fs.writeFileSync(outFilePath, str);

		const processResolver = Promise.withResolvers();
		const process = exec(
			"whiskers --color-overrides ./overrides.json " + path.basename(template) + " -f mocha",
			{
				cwd: path.join(outPath, FOLDER_NAME),
			},
			(error) => {
				if (error) console.log(error);
			},
		);
		process.on("exit", () => processResolver.resolve(null));
		process.on("error", (err) => processResolver.reject(err));

		await processResolver.promise;

		//Cleanup the template after generation
		fs.rmSync(outFilePath);
	}

	//Cleanup the overrides after generation
	fs.rmSync(overridesPath);
}
