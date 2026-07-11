import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const destinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast"];
const locales = ["en", "zh", "ja", "ko", "th", "ru"];
const issues = [];

function report(file, message) {
  issues.push(`${file}: ${message}`);
}

function productSchema(html) {
  for (const match of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      const value = JSON.parse(match[1]);
      if (value?.["@type"] === "Product") return value;
    } catch {
      // JSON validity is covered by the site-quality audit.
    }
  }
  return null;
}

async function read(file) {
  return fs.readFile(path.join(root, file), "utf8");
}

const standardFiles = [];
for (const destination of destinations) {
  standardFiles.push(`${destination}.html`);
  for (const locale of locales) standardFiles.push(`${locale}/${destination}/index.html`);
}

for (const file of standardFiles) {
  const html = await read(file);
  if (/route-price-tiers/.test(html)) report(file, "still exposes a multi-tier price table");
  if (/public starting prices for 2, 4 and 6|公開 2、4、6 人參考起價|2\/4\/6 traveller starting prices/i.test(html)) {
    report(file, "still describes public 2/4/6 pricing");
  }
  const schema = productSchema(html);
  if (!schema) {
    report(file, "Product schema missing");
    continue;
  }
  if (schema.offers?.["@type"] !== "Offer") report(file, "Product schema is not a single Offer");
  if (!schema.offers?.price || !schema.offers?.priceCurrency) report(file, "single public price is incomplete");
  const basis = schema.additionalProperty?.some((entry) => entry?.name === "Public starting price basis");
  if (!basis) report(file, "public 6-traveller price basis missing from Product schema");
}

const homeExpectations = {
  "index.html": ["US$545", "US$850"],
  "en.html": ["US$545", "US$850"],
  "en/index.html": ["US$545", "US$850"],
  "zh.html": ["NT$18,600", "RMB 6,150"],
  "zh/index.html": ["NT$18,600", "RMB 6,150"],
  "ja.html": ["JPY 86,000", "JPY 136,000"],
  "ja/index.html": ["JPY 86,000", "JPY 136,000"],
  "ko.html": ["KRW 745,000", "KRW 1,180,000"],
  "ko/index.html": ["KRW 745,000", "KRW 1,180,000"],
  "th.html": ["THB 17,700", "THB 28,000"],
  "th/index.html": ["THB 17,700", "THB 28,000"],
  "ru.html": ["95 000 ₽", "96 000 ₽"],
  "ru/index.html": ["95 000 ₽", "96 000 ₽"],
};

for (const [file, expected] of Object.entries(homeExpectations)) {
  const html = await read(file);
  for (const price of expected) {
    if (!html.includes(price)) report(file, `home route card missing ${price}`);
  }
}

const grandEnglish = ["yunnan.html", "en/yunnan/index.html", "yunnan-grand-loop/index.html"];
for (const file of grandEnglish) {
  const html = await read(file);
  if (!html.includes("US$1,250")) report(file, "Grand Yunnan public 6-person price is not US$1,250");
  if (/US\$(?:765|895|1,?290)/.test(html)) report(file, "old Grand Yunnan public tier remains");
}

const grandChinese = ["zh/yunnan/index.html", "zh/yunnan-grand-loop/index.html"];
for (const file of grandChinese) {
  const html = await read(file);
  if (!html.includes("NT$40,000")) report(file, "大雲南環線未顯示 6 人約 NT$40,000 起");
  if (/NT\$(?:26,100|30,600|44,100)|RMB\s*(?:5,490|6,438|9,275)/.test(html)) report(file, "仍有舊的 2/4/6 人公開價格");
}

console.log(`Public price audit checked ${standardFiles.length} standard route pages and ${Object.keys(homeExpectations).length} home pages`);
if (issues.length) {
  console.error(`Issues: ${issues.length}`);
  for (const issue of issues) console.error(`ISSUE ${issue}`);
  process.exitCode = 1;
} else {
  console.log("Issues: 0");
}
