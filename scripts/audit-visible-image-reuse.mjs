import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const skipDirs = new Set([".git", "node_modules", "outputs"]);
const files = [];

async function walk(dir = root) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (skipDirs.has(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(absolute);
    else if (entry.name.endsWith(".html")) files.push(path.relative(root, absolute));
  }
}

function visibleReferences(html) {
  const body = html.split(/<body\b/i)[1] || html;
  const refs = [];
  for (const match of body.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) {
    const src = match[1].split("?")[0];
    if (/ruoqing-(avatar|logo|mark)|bluehourchina-(logo|avatar|icon)|gowind-avatar/.test(src)) continue;
    refs.push(src);
  }
  for (const match of body.matchAll(/--hero-image\s*:\s*url\(["']?([^"')]+)["']?\)/gi)) {
    refs.push(match[1].split("?")[0]);
  }
  return refs;
}

function isCorePage(file) {
  if (/^(?:index|en|zh|ja|ko|th|ru)\.html$/.test(file)) return true;
  if (/^(?:en|zh|ja|ko|th|ru)\/index\.html$/.test(file)) return true;
  if (/(?:^|\/)(?:yunnan|xinjiang|dunhuang|sanya|northeast|inner-mongolia|xian|tibet|zhangjiajie)(?:\.html|\/index\.html)$/.test(file)) return true;
  return /(?:^|\/)stories(?:\.html|\/index\.html)$/.test(file);
}

await walk();

const pages = [];
for (const file of files.sort()) {
  const html = await fs.readFile(path.join(root, file), "utf8");
  const counts = new Map();
  for (const ref of visibleReferences(html)) counts.set(ref, (counts.get(ref) || 0) + 1);
  const duplicates = [...counts.entries()].filter(([, count]) => count > 1).map(([src, count]) => ({ src, count }));
  if (duplicates.length) pages.push({ file, core: isCorePage(file), duplicates });
}

const coreIssues = pages.filter((page) => page.core);
const report = {
  checkedAt: new Date().toISOString(),
  htmlFiles: files.length,
  pagesWithDuplicates: pages.length,
  corePagesWithDuplicates: coreIssues.length,
  pages,
};

await fs.mkdir(path.join(root, "outputs"), { recursive: true });
await fs.writeFile(path.join(root, "outputs/visible-image-reuse-audit.json"), JSON.stringify(report, null, 2));

console.log(`Visible image reuse: ${pages.length} page(s) site-wide; ${coreIssues.length} core page(s).`);
for (const page of coreIssues) {
  console.log(`- ${page.file}: ${page.duplicates.map(({ src, count }) => `${count}x ${src}`).join(" | ")}`);
}
if (coreIssues.length) process.exitCode = 1;
