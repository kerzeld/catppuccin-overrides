import path from "node:path"
import fs from "node:fs"
import { fileURLToPath } from 'node:url';
import { THEME_JSON_FILE_NAME } from "./const.ts"
import mustasche from "mustache";
import Color from "color";
import type { ITemplateObject } from "./interfaces.ts";

const __filename = fileURLToPath(import.meta.url);
const rootPath = path.join(path.dirname(__filename), "../")
const themesPath = path.join(rootPath, "themes")
const templatePath = path.join(rootPath, "templates")
const configPath = path.join(rootPath, "config")

const themes = [
    "pink"
]

function recurseDirRead(dir: string) {
    const files: string[] = []
    for (const file of fs.readdirSync(dir, { recursive: true, "withFileTypes": true })) {
        if (file.isFile()) files.push(path.join(file.parentPath, file.name))
    }
    return files
}

function ensureDirectoryExistence(filePath: string) {
    var dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}




function main() {
    // Read base catppuccin frape colors
    const baseColors = JSON.parse(fs.readFileSync(path.join(configPath, "base.json")).toString());
    for (const theme of themes) {
        const themePath = path.join(themesPath, theme)
        const outPath = path.join(themePath, "out")

        try {
            fs.rmdirSync(outPath)
        } catch (error) {
            // dir already deleted
        }

        // Read theme and override base colors
        const themeJSON = JSON.parse(fs.readFileSync(path.join(themePath, THEME_JSON_FILE_NAME)).toString())
        const colors = { ...baseColors, ...themeJSON.overrides }

        // init template object
        const templateObject: ITemplateObject = { colors: {}, name: themeJSON.name }

        // Generate color formats
        for (const name of Object.keys(colors)) {
            const color = new Color(colors[name])
            templateObject.colors[name] = {
                rgb: color.rgb().toString().replace("rgb(", "").replace(")", ""),
                hex: colors[name].replace("#", "")
            };
        }

        // Add accent color
        const color = new Color(colors[themeJSON.accent])
        templateObject.colors["accent"] = {
            rgb: color.rgb().toString().replace("rgb(", "").replace(")", ""),
            hex: colors[themeJSON.accent].replace("#", "")
        };

        const templates = recurseDirRead(templatePath)
        console.log(templates)

        // Read and write templates
        for (const template of templates) {
            const out = mustasche.render(fs.readFileSync(template).toString(), templateObject)
            const templateRelativePath = template.replace(templatePath + "/", "")
            const outFilePath = path.join(outPath, templateRelativePath)

            ensureDirectoryExistence(outFilePath)
            fs.writeFileSync(outFilePath, out)
        }
    }

}

main()