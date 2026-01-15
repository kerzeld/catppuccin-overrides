import mustache from "mustache";
import fs from "node:fs";
import path from "node:path";
import { PATH_OUT, PATH_ROOT, PATH_TEMPLATES } from "./const.ts";
import type { ITheme, IThemeView } from "./interfaces.ts";
import { themes } from "./themes.ts";
import { buildHexFromHSV, buildThemeView, ensureDirectoryExistence, promiseSleep, recurseDirRead } from "./utils.ts";
import { getUserStyles } from "./userStyles.ts";
import minimist from "minimist";
import { generateFirefoxColorLink, generateFirefoxThemeManifest } from "./firefox.ts";
import { styleText } from "node:util";
import { generateWhiskersThemes } from "./whiskers.ts";
import { linkTheme } from "./link.ts";

async function main() {
	const args = minimist(process.argv.slice(2));

	if (args.release) {
		for (const key in themes) {
			if (themes.hasOwnProperty(key)) {
				const themeName = key as keyof typeof themes;
				await constructTheme(themeName, args, path.join(PATH_ROOT, "out", themeName));
			}
		}
	} else {
		const themeName = args._[0] as keyof typeof themes;
		if (!themeName) {
			console.log("No theme specified");
			process.exit(1);
		}

		if (!(themeName in themes)) {
			console.log("Theme does not exist");
			process.exit(1);
		}
		const outPath = path.join(PATH_ROOT, "out", themeName);

		await constructTheme(themeName, args, outPath);

		if (args.link) {
			console.log(styleText("green", "Starting linking files!"));
			await promiseSleep(2000);
			linkTheme(outPath);
			console.log(styleText("green", "Linked all files!"));
		}
	}
}

async function constructTheme(themeName: keyof typeof themes, args: minimist.ParsedArgs, outPath: string = PATH_OUT) {
	let theme: ITheme = themes[themeName];

	try {
		fs.rmSync(outPath, { recursive: true });
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
		const outFilePath = path.join(outPath, templateRelativePath);

		ensureDirectoryExistence(outFilePath);
		fs.writeFileSync(outFilePath, out);
	}

	// Write userStyles
	fs.writeFileSync(path.join(outPath, "userStyles.json"), JSON.stringify(await getUserStyles(view)));

	if (args.firefoxTheme) {
		// Write firefox color theme
		const manifestPath = path.join(outPath, "firefox", "manifest.json");
		ensureDirectoryExistence(manifestPath);
		fs.writeFileSync(manifestPath, JSON.stringify(generateFirefoxThemeManifest(view)));
	}

	// Generate firefox color link
	generateFirefoxColorLink(view, outPath);
	generateWhiskersThemes(view, outPath);

	buildHexFromHSV(theme.overrides.hsv![0]!);

	console.log("");
	console.log(styleText("green", "Theme " + themeName + " successfully generated!"));
}

main();
