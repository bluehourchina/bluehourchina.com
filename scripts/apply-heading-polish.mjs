import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excludedDirectories = new Set([".git", "node_modules", "output", "outputs"]);
const stylesheet = '<link rel="stylesheet" href="/assets/heading-polish.css?v=20260711-rhythm9">';

async function collectHtml(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(absolute));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

let updated = 0;
for (const file of await collectHtml(root)) {
  let html = await fs.readFile(file, "utf8");
  if (!html.includes("</head>")) continue;
  const next = html
    .replace(/\s*<link rel="stylesheet" href="\/assets\/heading-polish\.css\?v=[^"]+">/g, "")
    .replace("</head>", `  ${stylesheet}\n</head>`);
  if (next === html) continue;
  await fs.writeFile(file, next);
  updated += 1;
}

console.log(`heading-polish-applied ${updated}`);
