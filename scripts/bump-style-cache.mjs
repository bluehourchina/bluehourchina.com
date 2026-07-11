import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const luxuryVersion = "20260711-rhythm8";
const headingVersion = "20260711-rhythm8";

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".git", "node_modules", "outputs"].includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

let updated = 0;
for (const file of await walk(root)) {
  let html = await fs.readFile(file, "utf8");
  const before = html;
  html = html
    .replace(/luxury-multilang\.css\?v=[^"']+/g, `luxury-multilang.css?v=${luxuryVersion}`)
    .replace(/heading-polish\.css\?v=[^"']+/g, `heading-polish.css?v=${headingVersion}`);
  if (html !== before) {
    await fs.writeFile(file, html);
    updated += 1;
  }
}

console.log(`Updated style cache versions in ${updated} HTML files.`);
