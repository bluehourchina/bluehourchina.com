import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "outputs");
const destinations = {
  yunnan: 8,
  xinjiang: 9,
  dunhuang: 6,
  sanya: 5,
  northeast: 7,
  "inner-mongolia": 6,
};
const locales = ["en", "zh", "ja", "ko", "th", "ru"];
const expectedCurrency = { en: "USD", zh: "CNY", ja: "JPY", ko: "KRW", th: "THB", ru: "RUB" };
const files = [];

for (const [destination, dayCount] of Object.entries(destinations)) {
  files.push({ file: `${destination}.html`, destination, locale: "en", dayCount });
  for (const locale of locales) {
    files.push({ file: `${locale}/${destination}/index.html`, destination, locale, dayCount });
  }
}

function visible(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

function productSchema(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const block of blocks) {
    try {
      const value = JSON.parse(block[1]);
      if (value?.["@type"] === "Product") return value;
    } catch {
      // The general site audit reports malformed JSON-LD with more context.
    }
  }
  return null;
}

const issues = [];
for (const item of files) {
  const abs = path.join(root, item.file);
  const html = await fs.readFile(abs, "utf8");
  const page = visible(html);
  const days = [...page.matchAll(/class="route-day-item"/g)].length;
  const product = productSchema(html);

  if (!page.includes("standard-route-band")) issues.push(`${item.file}: standard route missing`);
  if (!page.includes("route-day-plan-band")) issues.push(`${item.file}: day plan missing`);
  if (days !== item.dayCount) issues.push(`${item.file}: expected ${item.dayCount} days, found ${days}`);
  if (!page.includes("/assets/real-") && !page.includes("/assets/wechat-reference-")) {
    issues.push(`${item.file}: no real route photography referenced`);
  }
  if (!page.includes(`destination=${item.destination}`)) issues.push(`${item.file}: destination inquiry CTA missing`);
  if (!product) {
    issues.push(`${item.file}: Product schema missing`);
  } else {
    if (product.offers?.priceCurrency !== expectedCurrency[item.locale]) {
      issues.push(`${item.file}: expected ${expectedCurrency[item.locale]} schema price`);
    }
    if (!product.additionalProperty?.some((entry) => /2/.test(String(entry.value)))) {
      issues.push(`${item.file}: minimum private group not exposed in schema`);
    }
  }

  if (["ja", "ko", "th", "ru"].includes(item.locale)) {
    const dayBlock = page.match(/<!-- route-day-plan-start -->([\s\S]*?)<!-- route-day-plan-end -->/)?.[1] || "";
    const leakage = /\b(?:Day \d|Stay:|Departure day|Arrive in|Private pickup|Standard day plan|Included in the starting estimate)\b/i;
    if (leakage.test(dayBlock)) issues.push(`${item.file}: English itinerary copy leaked into localized day plan`);
  }
}

const summary = {
  checkedAt: new Date().toISOString(),
  fileCount: files.length,
  destinationCount: Object.keys(destinations).length,
  issueCount: issues.length,
  issues,
};

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, "destination-product-audit.json"), JSON.stringify(summary, null, 2));

console.log(`Destination product audit checked ${files.length} pages across ${summary.destinationCount} destinations`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues) console.log(`ISSUE ${issue}`);
if (issues.length) process.exitCode = 1;
