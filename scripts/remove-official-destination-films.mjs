import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const homes = [
  "index.html",
  "en.html",
  "en/index.html",
  "zh.html",
  "zh/index.html",
  "ja.html",
  "ja/index.html",
  "ko.html",
  "ko/index.html",
  "th.html",
  "th/index.html",
  "ru.html",
  "ru/index.html",
];

let updated = 0;
for (const file of homes) {
  const absolute = path.join(root, file);
  let html = await fs.readFile(absolute, "utf8");
  const before = html;
  html = html.replace(/\s*<!-- official-destination-films-start -->[\s\S]*?<!-- official-destination-films-end -->\s*/g, "\n");
  if (html !== before) {
    await fs.writeFile(absolute, html);
    updated += 1;
  }
}

console.log(`Removed embedded destination films from ${updated} home pages.`);
