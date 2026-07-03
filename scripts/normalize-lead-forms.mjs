import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const skipDirs = new Set([".git", "outputs", "node_modules"]);
const updated = [];

async function walk(dir = root, files = []) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, files);
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(path.relative(root, full));
  }
  return files;
}

function normalizeForm(form) {
  if (!/class=["'][^"']*\blead-form\b/i.test(form)) return form;
  let next = form;

  if (!/\bname=["']campaign["']/i.test(next)) {
    const campaignInput = '            <input type="hidden" name="campaign" value="private_route_consultation">';
    if (/\bname=["']utm_campaign["']/i.test(next)) {
      next = next.replace(/([ \t]*<input[^>]+\bname=["']utm_campaign["'][^>]*>\n?)/i, `$1${campaignInput}\n`);
    } else {
      next = next.replace(/(<form\b[^>]*>\n?)/i, `$1${campaignInput}\n`);
    }
  }

  if (!/mailto:bluehourchina@gmail\.com/i.test(next)) {
    const fallback = [
      '            <p class="form-fallback">如果表單無法送出，也可以直接寄到',
      '              <a href="mailto:bluehourchina@gmail.com?subject=Bluehour%20China%20route%20consultation">bluehourchina@gmail.com</a>',
      "            </p>",
    ].join("\n");
    next = next.replace(/([ \t]*<button\b[\s\S]*?<\/button>\n?)/i, `$1${fallback}\n`);
  }

  return next;
}

for (const file of await walk()) {
  const full = path.join(root, file);
  const html = await fs.readFile(full, "utf8");
  const next = html.replace(/<form\b[\s\S]*?<\/form>/gi, normalizeForm);
  if (next !== html) {
    await fs.writeFile(full, next);
    updated.push(file);
  }
}

console.log(`normalized-lead-form-files ${updated.length}`);
for (const file of updated) console.log(file);
