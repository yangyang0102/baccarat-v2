import { execFileSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const dist = resolve(root, "dist");
rmSync(dist, { recursive: true, force: true });
mkdirSync(resolve(dist, "js"), { recursive: true });
execFileSync("tsc", ["-p", resolve(root, "tsconfig.json")], { stdio: "inherit" });
cpSync(resolve(root, "static"), dist, { recursive: true });
