import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excluded = new Set([".git", "node_modules", "output", "outputs", "public"]);
const expected = {
  en: ["Destinations", "Care", "Stories", "Before China", "Plan a private journey"],
  zh: ["目的地", "照應", "故事", "出發準備", "規劃私人旅程"],
  ja: ["旅先", "旅のサポート", "旅の物語", "中国へ行く前に", "旅を相談する"],
  ko: ["여행지", "여행 지원", "이야기", "중국 출발 전", "맞춤 여행 상담"],
  th: ["จุดหมาย", "การดูแล", "เรื่องราว", "ก่อนเดินทางไปจีน", "วางแผนทริปส่วนตัว"],
  ru: ["Маршруты", "Поддержка", "Истории", "Перед поездкой", "Спланировать поездку"],
};

async function collect(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excluded.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collect(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

function localeFor(html) {
  const value = html.match(/<html\s+[^>]*lang="([^"]+)"/i)?.[1]?.toLowerCase() || "en";
  if (value.startsWith("zh")) return "zh";
  return Object.keys(expected).find((locale) => value.startsWith(locale)) || "en";
}

function stripTags(value) {
  return value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const issues = [];
let checked = 0;
for (const file of await collect(root)) {
  const html = await fs.readFile(file, "utf8");
  if (!html.includes('<nav class="nav"')) continue;
  checked += 1;
  const relative = path.relative(root, file).split(path.sep).join("/");
  const locale = localeFor(html);
  const nav = html.match(/<nav class="nav"[\s\S]*?<\/nav>/i)?.[0] || "";
  const mobile = html.match(/<div class="mobile-lang"[\s\S]*?<\/details>\s*<details class="language-menu">[\s\S]*?<\/details>\s*<\/div>/i)?.[0] || "";
  const labels = expected[locale];
  let cursor = -1;
  for (const label of labels) {
    const index = stripTags(nav).indexOf(label, cursor + 1);
    if (index < 0) issues.push(`${relative}: missing or reordered navigation label ${label}`);
    else cursor = index;
  }
  const languageMenus = (nav.match(/<details class="language-menu">/g) || []).length;
  const ctas = (nav.match(/<a class="nav-cta"/g) || []).length;
  if (languageMenus !== 1) issues.push(`${relative}: expected 1 desktop language menu, found ${languageMenus}`);
  if (ctas !== 1) issues.push(`${relative}: expected 1 desktop CTA, found ${ctas}`);
  if (!mobile) issues.push(`${relative}: mobile site and language menus missing`);
  if (!html.includes('/assets/navigation-continuity.css')) issues.push(`${relative}: shared navigation stylesheet missing`);
  if (!html.includes('/assets/language-menu.js')) issues.push(`${relative}: menu interaction script missing`);
}

console.log(`Navigation continuity audit checked ${checked} navigation pages`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues.slice(0, 100)) console.log(`ISSUE ${issue}`);
if (issues.length) process.exitCode = 1;
