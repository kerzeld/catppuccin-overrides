import { styleText } from "node:util";
import { ensureDirectoryExistence } from "./utils.ts";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

function ensureLink(source: string, target: string) {
	if (!fs.existsSync(source)) {
		console.log(styleText("yellow", "File " + source + " does not exists"));
		return;
	}

	try {
		const stats = fs.lstatSync(target);
		if (stats.isFile()) {
			fs.rmSync(target);
		} else if (stats.isSymbolicLink()) {
			fs.unlinkSync(target);
		}
	} catch (error: unknown) {
		//console.error(error);
	}

	ensureDirectoryExistence(target);
	fs.symlinkSync(source, target);
}

export function linkTheme(outPath: string) {
	const homeDir = os.homedir();

	// KDE
	ensureLink(
		path.join(outPath, "plasma", "kerzeld-konsole.colorscheme"),
		path.join(homeDir, ".local/share/konsole/kerzeld-konsole.colorscheme"),
	);
	ensureLink(
		path.join(outPath, "plasma", "kerzeld.colors"),
		path.join(homeDir, ".local/share/color-schemes/kerzeld.colors"),
	);
	ensureLink(
		path.join(outPath, "plasma", "kerzeld-glassy.colors"),
		path.join(homeDir, ".local/share/color-schemes/kerzeld-glassy.colors"),
	);

	// Firefox
	ensureLink(
		path.join(outPath, "firefox", "userChrome.css"),
		path.join(homeDir, ".mozilla/firefox/default/chrome/userChrome.css"),
	);
	ensureLink(
		path.join(outPath, "firefox", "userContent.css"),
		path.join(homeDir, ".mozilla/firefox/default/chrome/userContent.css"),
	);

	// Oh My Posh
	ensureLink(path.join(outPath, "template.omp.json"), path.join(homeDir, ".config/oh-my-posh/template.omp.json"));

	// Zed themes
	ensureLink(
		path.join(outPath, "whiskers/zed", "catppuccin-kerzeld.json"),
		path.join(homeDir, ".config/zed/themes/catppuccin-kerzeld.json"),
	);
	ensureLink(
		path.join(outPath, "whiskers/zed-glassy", "catppuccin-kerzeld.json"),
		path.join(homeDir, ".config/zed/themes/catppuccin-kerzeld-glassy.json"),
	);
}
