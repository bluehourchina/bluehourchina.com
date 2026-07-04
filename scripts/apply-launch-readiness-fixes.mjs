import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const scriptTag = '  <script src="/assets/lead-form.js?v=20260704-lead1" defer></script>';
const skipDirs = new Set([".git", "node_modules", "outputs"]);
const htmlFiles = [];

async function walk(dir = root) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.isFile() && entry.name.endsWith(".html")) htmlFiles.push(full);
  }
}

function addLeadScript(html) {
  if (!html.includes("lead-form")) return html;
  if (html.includes("/assets/lead-form.js")) return html;
  return html.replace(/<\/body>/i, `${scriptTag}\n</body>`);
}

function addPrivacyFooterLink(html) {
  if (html.includes('href="/privacy.html"')) return html;
  return html
    .replace(
      /<a href="\/credits\.html">Image credits<\/a> · <a href="\/llms\.txt">AI-readable summary<\/a>/g,
      '<a href="/credits.html">Image credits</a> · <a href="/privacy.html">Privacy</a> · <a href="/llms.txt">AI-readable summary</a>'
    )
    .replace(
      /<a href="\/llms\.txt">AI-readable summary<\/a>/g,
      '<a href="/privacy.html">Privacy</a> · <a href="/llms.txt">AI-readable summary</a>'
    );
}

await walk();

let changed = 0;
for (const file of htmlFiles) {
  const original = await fs.readFile(file, "utf8");
  let next = addLeadScript(original);
  next = addPrivacyFooterLink(next);
  if (next !== original) {
    await fs.writeFile(file, next);
    changed += 1;
  }
}

console.log(`Launch readiness fixes applied to ${changed} HTML files.`);
