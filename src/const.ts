import path from "node:path";
import { fileURLToPath } from "node:url";

export const THEME_JSON_FILE_NAME = "theme.json";

const __filename = fileURLToPath(import.meta.url);
export const PATH_ROOT = path.join(path.dirname(__filename), "../");
export const PATH_THEMES = path.join(PATH_ROOT, "themes");
export const PATH_TEMPLATES = path.join(PATH_ROOT, "templates");
export const PATH_CONFIG = path.join(PATH_ROOT, "config");
