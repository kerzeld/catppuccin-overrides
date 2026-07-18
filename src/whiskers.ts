import path from "node:path";
import { DEFAULT_OPACITY, PATH_CONFIG, PATH_TEMPLATES } from "./const.ts";
import type { IThemeView } from "./interfaces.ts";
import { ensureDirectoryExistence, recurseDirRead } from "./utils.ts";
import fs from "node:fs";
import { ThemeKeys } from "./colors.ts";
import { exec } from "node:child_process";
import mustache from "mustache";
import { buildWhiskersView } from "./whiskersView.ts";

const FOLDER_NAME = "whiskers";

export async function generateWhiskersThemes(view: IThemeView, outPath: string, useWhiskersCli: boolean = false) {
  generateWhiskersMustache(view, outPath);
  if (useWhiskersCli) {
    await generateWhiskersCli(view, outPath);
  }
}

function generateWhiskersMustache(view: IThemeView, outPath: string) {
  const whiskersView = buildWhiskersView(view);
  const mustacheView = { ...view, whiskers: whiskersView };

  const templates = recurseDirRead(path.join(PATH_TEMPLATES, FOLDER_NAME));

  for (const template of templates) {
    const str = fs.readFileSync(template).toString();
    const rendered = mustache.render(str, mustacheView);

    const templateRelativePath = template.replace(PATH_TEMPLATES + "/" + FOLDER_NAME + "/", "");
    const outFilePath = path.join(outPath, FOLDER_NAME, templateRelativePath);

    ensureDirectoryExistence(outFilePath);
    fs.writeFileSync(outFilePath, rendered);
  }
}

async function generateWhiskersCli(view: IThemeView, outPath: string) {
  const teraOutPath = path.join(outPath, FOLDER_NAME + "-tera");
  const overridesPath = path.join(teraOutPath, "overrides.json");
  const colors: Record<string, string> = {};
  for (const key of ThemeKeys) {
    colors[key] = view.colors[key].hex;
  }

  ensureDirectoryExistence(overridesPath);
  fs.writeFileSync(overridesPath, JSON.stringify({ all: colors }));

  const templates = recurseDirRead(path.join(PATH_CONFIG, FOLDER_NAME));
  for (const template of templates) {
    let str = fs.readFileSync(template).toString();
    str = str.replaceAll("%accent%", view.accent);
    str = str.replaceAll("%name%", view.name);
    str = str.replaceAll("opacity.float", DEFAULT_OPACITY.toString());

    const templateRelativePath = template.replace(PATH_CONFIG + "/" + FOLDER_NAME + "/", "");
    const outFilePath = path.join(teraOutPath, templateRelativePath);

    ensureDirectoryExistence(outFilePath);
    fs.writeFileSync(outFilePath, str);

    const processResolver = Promise.withResolvers();
    const process = exec(
      "whiskers --color-overrides ./overrides.json " + path.basename(template) + " -f mocha",
      {
        cwd: teraOutPath,
      },
      (error) => {
        if (error) console.log(error);
      },
    );
    process.on("exit", () => processResolver.resolve(null));
    process.on("error", (err) => processResolver.reject(err));

    await processResolver.promise;

    fs.rmSync(outFilePath);
  }

  fs.rmSync(overridesPath);
}
