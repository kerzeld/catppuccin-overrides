import mustache from "mustache";
import fs from "node:fs";
import path from "node:path";
import { PATH_OUT, PATH_TEMPLATES } from "./const.ts";
import type { ITheme, IThemeView } from "./interfaces.ts";
import { themes } from "./themes.ts";
import { buildHexFromHSV, buildThemeView, ensureDirectoryExistence, recurseDirRead } from "./utils.ts";
import { getUserStyles } from "./userStyles.ts";
import minimist from "minimist";
import { generateFirefoxColorLink, generateFirefoxThemeManifest } from "./firefox.ts";
import { styleText } from "node:util";

async function main() {
	const args = minimist(process.argv.slice(2));

	const themeName = args._[0] as keyof typeof themes;

	if (!themeName) {
		console.log("No theme specified");
		process.exit(1);
	}

	if (!(themeName in themes)) {
		console.log("Theme does not exist");
		process.exit(1);
	}

	let theme: ITheme = themes[themeName];

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

	if (args.firefoxTheme) {
		// Write firefox color theme
		const manifestPath = path.join(PATH_OUT, "firefox", "manifest.json");
		ensureDirectoryExistence(manifestPath);
		fs.writeFileSync(manifestPath, JSON.stringify(await generateFirefoxThemeManifest(view)));
	}

	// Generate firefox color link
	generateFirefoxColorLink(view);

	buildHexFromHSV(theme.overrides.hsv![0]!);

	console.log("");
	console.log(styleText("green", "Theme successfully generated!"));
}

main();
