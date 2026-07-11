import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "outputs");
const destinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast"];
const locales = ["en", "zh", "ja", "ko", "th", "ru"];
const prices = {
  yunnan: "4680",
  xinjiang: "13800",
  dunhuang: "4980",
  "inner-mongolia": "9500",
  sanya: "14200",
  northeast: "16700",
};
const displayPrices = Object.fromEntries(
  Object.entries(prices).map(([slug, value]) => [slug, `RMB ${Number(value).toLocaleString("en-US")}`]),
);
const foreignCurrency = /US\$|NT\$|\b(?:USD|TWD|JPY|KRW|THB|RUB)\b|₽|¥\s*[\d,]/i;
const issues = [];

async function walk(dir) {
  const result = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if ([".git", "node_modules", "outputs"].includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...await walk(absolute));
    else if (entry.name.endsWith(".html")) result.push(absolute);
  }
  return result;
}

function visibleHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<(?:input|meta|link)\b[^>]*>/gi, "");
}

function productSchema(html) {
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1]);
      if (schema?.["@type"] === "Product") return schema;
    } catch {
      // JSON validity is reported by the general site audit.
    }
  }
  return null;
}

const htmlFiles = await walk(root);
for (const absolute of htmlFiles) {
  const file = path.relative(root, absolute);
  const visible = visibleHtml(await fs.readFile(absolute, "utf8"));
  const match = visible.match(foreignCurrency);
  if (match) issues.push(`${file}: visible non-RMB currency remains (${match[0]})`);
}

const standardPages = [];
for (const slug of destinations) {
  standardPages.push({ file: `${slug}.html`, slug });
  for (const locale of locales) standardPages.push({ file: `${locale}/${slug}/index.html`, slug });
}

for (const { file, slug } of standardPages) {
  const html = await fs.readFile(path.join(root, file), "utf8");
  const schema = productSchema(html);
  if (!visibleHtml(html).includes(displayPrices[slug])) issues.push(`${file}: missing ${displayPrices[slug]}`);
  if (schema?.offers?.priceCurrency !== "CNY") issues.push(`${file}: Product schema is not CNY`);
  if (String(schema?.offers?.price) !== prices[slug]) issues.push(`${file}: Product price is not ${prices[slug]}`);
}

const homes = [
  "index.html", "en.html", "en/index.html", "zh.html", "zh/index.html", "ja.html", "ja/index.html",
  "ko.html", "ko/index.html", "th.html", "th/index.html", "ru.html", "ru/index.html",
];
for (const file of homes) {
  const visible = visibleHtml(await fs.readFile(path.join(root, file), "utf8"));
  for (const price of Object.values(displayPrices)) {
    if (!visible.includes(price)) issues.push(`${file}: home card missing ${price}`);
  }
  if (/<dt>[^<]*(?:Route|路線|ルート|경로|เส้นทาง|Маршрут)[^<]*<\/dt>\s*<dd>\s*<\/dd>/i.test(visible)) {
    issues.push(`${file}: home route description is empty`);
  }
}

for (const file of ["yunnan-grand-loop/index.html", "zh/yunnan-grand-loop/index.html"]) {
  const html = await fs.readFile(path.join(root, file), "utf8");
  const schema = productSchema(html);
  if (!visibleHtml(html).includes("RMB 8,500")) issues.push(`${file}: Grand Yunnan price is not RMB 8,500`);
  if (schema?.offers?.priceCurrency !== "CNY" || String(schema?.offers?.price) !== "8500") {
    issues.push(`${file}: Grand Yunnan Product schema is not CNY 8500`);
  }
}

const summary = {
  checkedAt: new Date().toISOString(),
  htmlFileCount: htmlFiles.length,
  standardPageCount: standardPages.length,
  homePageCount: homes.length,
  issueCount: issues.length,
  issues,
};
await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, "all-cny-pricing-audit.json"), JSON.stringify(summary, null, 2));

console.log(`All-CNY pricing audit checked ${summary.htmlFileCount} HTML files`);
console.log(`Standard routes: ${summary.standardPageCount}; homes: ${summary.homePageCount}`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues) console.log(`ISSUE ${issue}`);
if (issues.length) process.exitCode = 1;
