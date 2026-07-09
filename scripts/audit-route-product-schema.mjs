import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "outputs");

const destinations = ["yunnan", "xinjiang", "dunhuang", "sanya", "northeast"];
const files = [
  ...destinations.map((destination) => ({
    file: `${destination}.html`,
    expectedCurrency: "USD",
  })),
  ...["en", "zh", "ja", "ko", "th"].flatMap((locale) =>
    destinations.map((destination) => ({
      file: `${locale}/${destination}/index.html`,
      expectedCurrency:
        locale === "zh"
          ? "CNY"
          : locale === "ja"
            ? "JPY"
            : locale === "ko"
              ? "KRW"
              : locale === "th"
                ? "THB"
                : "USD",
    })),
  ),
];

function extractJsonLd(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (match) => match[1],
  );
}

function visibleHtml(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
}

function routeHasInquiryUrl(product) {
  return (
    typeof product.url === "string" &&
    product.url.startsWith("https://bluehourchina.com/")
  );
}

const issues = [];
const checked = [];

for (const item of files) {
  const abs = path.join(root, item.file);
  let html;
  try {
    html = await fs.readFile(abs, "utf8");
  } catch (error) {
    issues.push(`${item.file}: missing file`);
    continue;
  }
  checked.push(item.file);

  if (/from price|per traveller from|land arrangement from price/i.test(visibleHtml(html))) {
    issues.push(`${item.file}: low-quality English price phrase found`);
  }

  const schemas = extractJsonLd(html).map((json, index) => {
    try {
      return JSON.parse(json);
    } catch (error) {
      issues.push(`${item.file}: invalid JSON-LD #${index + 1}: ${error.message}`);
      return null;
    }
  });

  const products = schemas.filter((schema) => schema?.["@type"] === "Product");
  if (products.length !== 1) {
    issues.push(`${item.file}: expected 1 standard route Product schema, found ${products.length}`);
    continue;
  }

  const product = products[0];
  const currency = product.offers?.priceCurrency;
  const price = product.offers?.price;

  if (currency !== item.expectedCurrency) {
    issues.push(`${item.file}: expected ${item.expectedCurrency} schema currency, found ${currency}`);
  }
  if (!/^[0-9]+$/.test(String(price))) {
    issues.push(`${item.file}: schema price is not a plain number`);
  }
  if (!routeHasInquiryUrl(product)) {
    issues.push(`${item.file}: schema url is missing or not canonical`);
  }
  if (!Array.isArray(product.additionalProperty) || product.additionalProperty.length < 4) {
    issues.push(`${item.file}: schema route properties are incomplete`);
  }
}

const summary = {
  checkedAt: new Date().toISOString(),
  fileCount: checked.length,
  issueCount: issues.length,
  issues,
};

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(
  path.join(outputDir, "route-product-schema-audit.json"),
  JSON.stringify(summary, null, 2),
);

console.log(`Route product schema audit checked ${checked.length} files`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues.slice(0, 80)) console.log(`ISSUE ${issue}`);

if (issues.length) process.exitCode = 1;
