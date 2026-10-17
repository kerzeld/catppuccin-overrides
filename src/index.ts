import mustache from "mustache";
import fs from "node:fs";
import path from "node:path";
import { PATH_ROOT, PATH_TEMPLATES } from "./const.ts";
import type { ITheme, IThemeView } from "./interfaces.ts";
import { themes } from "./themes.ts";
import { buildThemeView, ensureDirectoryExistence, recurseDirRead } from "./utils.ts";
import minimist from "minimist";
import { generateFirefoxColorLink, generateFirefoxThemeManifest } from "./firefox.ts";
import { styleText } from "node:util";
import { buildComputedView } from "./computedView.ts";
import { linkTheme } from "./link.ts";
import { getUserStyles } from "./userStyles.ts";

async function main() {
	const args = minimist(process.argv.slice(2));

	if (args.release) {
		for (const themeName of Object.keys(themes) as (keyof typeof themes)[]) {
			await constructTheme(themeName, args);
		}
		return;
	}

	const themeName = args._[0] as keyof typeof themes | undefined;
	if (!themeName) {
		console.log("No theme specified");
		process.exit(1);
	}

	if (!(themeName in themes)) {
		console.log("Theme does not exist");
		process.exit(1);
	}

	const outPath = await constructTheme(themeName, args);

	if (args.link) {
		console.log(styleText("green", "Linking files..."));
		linkTheme(outPath);
		console.log(styleText("green", "Linked all files!"));
	}
}

async function constructTheme(themeName: keyof typeof themes, args: minimist.ParsedArgs): Promise<string> {
	const theme: ITheme = themes[themeName];
	const outPath = path.join(PATH_ROOT, "out", themeName);

	fs.rmSync(outPath, { recursive: true, force: true });

	const view: IThemeView = buildThemeView(theme);
	const mustacheView = { ...view, whiskers: buildComputedView(view) };

	for (const template of recurseDirRead(PATH_TEMPLATES)) {
		const rendered = mustache.render(fs.readFileSync(template).toString(), mustacheView);
		const outFilePath = path.join(outPath, template.replace(PATH_TEMPLATES + "/", ""));

		ensureDirectoryExistence(outFilePath);
		fs.writeFileSync(outFilePath, rendered);
	}

	if (args.firefoxTheme) {
		const manifestPath = path.join(outPath, "firefox", "manifest.json");
		ensureDirectoryExistence(manifestPath);
		fs.writeFileSync(manifestPath, JSON.stringify(generateFirefoxThemeManifest(view)));
	}

	// Stylus: catppuccin/userstyles bundle with this palette baked in.
	// Network-dependent, so don't fail the whole generation if it's unavailable.
	try {
		const userStylesPath = path.join(outPath, "userStyles.json");
		ensureDirectoryExistence(userStylesPath);
		fs.writeFileSync(userStylesPath, JSON.stringify(await getUserStyles(view)));
	} catch (error) {
		console.warn(
			styleText("yellow", `Skipped Stylus userStyles.json: ${(error as Error).message}`),
		);
	}

	generateFirefoxColorLink(view, outPath);

	console.log("");
	console.log(styleText("green", `Theme ${themeName} successfully generated!`));

	return outPath;
}

main();
