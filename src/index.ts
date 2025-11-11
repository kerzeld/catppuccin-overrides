import mustache from "mustache";
import fs from "node:fs";
import path from "node:path";
import { PATH_OUT, PATH_TEMPLATES } from "./const.ts";
import type { ITheme, IThemeView } from "./interfaces.ts";
import { themes } from "./themes.ts";
import { buildHexFromHSV, buildThemeView, ensureDirectoryExistence, recurseDirRead } from "./utils.ts";
import { getUserStyles } from "./userStyles.ts";
import minimist from "minimist";
import { generateFirefoxThemeManifest } from "./firefox.ts";

async function main() {
	const args = minimist(process.argv.slice(2));

	const themeName = args._[0];

	if (!themeName) {
		console.log("No theme specified");
		process.exit(1);
	}

	let theme: ITheme | undefined = undefined;
	for (const key in themes) {
		const name = key as keyof typeof themes;
		theme = themes[name];
	}

	if (!theme) {
		console.log("Theme does not exist");
		process.exit(1);
	}

	try {
		fs.rmSync(PATH_OUT, { recursive: true });
		// oxlint-disable-next-line no-unused-vars
	} catch (error) {
		// dir already deleted
	}

	// init template object
	const view: IThemeView = buildThemeView(theme);

	const templates = recurseDirRead(PATH_TEMPLATES);

	// Read and write templates
	for (const template of templates) {
		const out = mustache.render(fs.readFileSync(template).toString(), view);
		const templateRelativePath = template.replace(PATH_TEMPLATES + "/", "");
		const outFilePath = path.join(PATH_OUT, templateRelativePath);

		ensureDirectoryExistence(outFilePath);
		fs.writeFileSync(outFilePath, out);
	}

	// Write userStyles
	fs.writeFileSync(path.join(PATH_OUT, "userStyles.json"), JSON.stringify(await getUserStyles(view)));

	// Write firefox color theme
	const manifestPath = path.join(PATH_OUT, "firefox", "manifest.json");
	ensureDirectoryExistence(manifestPath);
	fs.writeFileSync(manifestPath, JSON.stringify(await generateFirefoxThemeManifest(view)));

	buildHexFromHSV(theme.overrides.hsv![0]!);

	console.log("Theme successfully applied");
}

main();
