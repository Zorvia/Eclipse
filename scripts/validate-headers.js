/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

const fs = require("node:fs");
const path = require("node:path");

const REQUIRED = [
  "Project: Mycelium",
  "Owned by Zorvia",
  "All credits to the Zorvia Community",
  "Licensed under ZPL v2.0",
];

const ROOT = process.cwd();
const INCLUDE_EXT = new Set([".ts", ".tsx", ".js", ".jsx", ".css", ".md", ".html", ".svg"]);
const IGNORE_DIRS = new Set([".git", "node_modules", ".next", "dist", "coverage"]);

function walk(dir, out) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.has(name)) walk(full, out);
      continue;
    }

    const ext = path.extname(name);
    if (!INCLUDE_EXT.has(ext)) continue;
    if (name === "LICENSE.md" || name === "next-env.d.ts") continue;
    out.push(full);
  }
}

const files = [];
walk(ROOT, files);

let failures = 0;
for (const file of files) {
  const firstChunk = fs.readFileSync(file, "utf8").split(/\r?\n/).slice(0, 12).join("\n");
  const ok =
    REQUIRED.every((token) => firstChunk.includes(token)) &&
    firstChunk.includes("LICENSE.md");
  if (!ok) {
    failures += 1;
    console.error(`Missing canonical header: ${path.relative(ROOT, file)}`);
  }
}

if (failures > 0) {
  console.error(`\nHeader validation failed for ${failures} file(s).`);
  process.exit(1);
}

console.log(`Header validation passed for ${files.length} file(s).`);

