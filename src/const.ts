import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
export const PATH_ROOT = path.join(path.dirname(__filename), "../");
export const PATH_OUT = path.join(PATH_ROOT, "out");
export const PATH_TEMPLATES = path.join(PATH_ROOT, "templates");
export const PATH_CONFIG = path.join(PATH_ROOT, "config");
