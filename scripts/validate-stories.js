/*
Project: Mycelium
Owned by Zorvia
All credits to the Zorvia Community
Licensed under ZPL v2.0 — see LICENSE.md
*/

const fs = require("node:fs");
const path = require("node:path");

const STORIES_DIR = path.join(process.cwd(), "stories");
const REQUIRED = ["id", "title", "author", "date", "cover", "description"];

const mdFiles = fs.readdirSync(STORIES_DIR).filter((f) => f.endsWith(".md"));
if (mdFiles.length === 0) {
  console.error("No markdown stories found.");
  process.exit(1);
}

let failed = 0;
for (const file of mdFiles) {
  const full = path.join(STORIES_DIR, file);
  const text = fs.readFileSync(full, "utf8");
  const fm = text.match(/^\s*(?:<!--[\s\S]*?-->\s*)?---\r?\n([\s\S]*?)\r?\n---/);
  if (!fm) {
    failed += 1;
    console.error(`Missing frontmatter: ${file}`);
    continue;
  }

  const block = fm[1];
  const missing = REQUIRED.filter((key) => !new RegExp(`^${key}:`, "m").test(block));
  if (missing.length) {
    failed += 1;
    console.error(`Missing keys in ${file}: ${missing.join(", ")}`);
  }
}

if (failed > 0) {
  console.error(`\nStory validation failed for ${failed} file(s).`);
  process.exit(1);
}

console.log(`Story validation passed for ${mdFiles.length} file(s).`);
