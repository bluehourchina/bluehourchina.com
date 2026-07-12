import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "outputs");
const destinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet", "zhangjiajie"];
const localeConfig = {
  en: {
    homes: ["index.html", "en/index.html"],
    interest: "interest.html",
    destination: (slug) => [`${slug}.html`, `en/${slug}/index.html`],
    currency: "CNY",
  },
  zh: {
    homes: ["zh.html", "zh/index.html"],
    interest: "zh/interest/index.html",
    destination: (slug) => [`zh/${slug}/index.html`],
    currency: "CNY",
  },
  ja: {
    homes: ["ja.html", "ja/index.html"],
    interest: "ja/interest/index.html",
    destination: (slug) => [`ja/${slug}/index.html`],
    currency: "CNY",
  },
  ko: {
    homes: ["ko.html", "ko/index.html"],
    interest: "ko/interest/index.html",
    destination: (slug) => [`ko/${slug}/index.html`],
    currency: "CNY",
  },
  th: {
    homes: ["th.html", "th/index.html"],
    interest: "th/interest/index.html",
    destination: (slug) => [`th/${slug}/index.html`],
    currency: "CNY",
  },
  ru: {
    homes: ["ru.html", "ru/index.html"],
    interest: "ru/interest/index.html",
    destination: (slug) => [`ru/${slug}/index.html`],
    currency: "CNY",
  },
};

const issues = [];
const checked = [];

async function read(file) {
  try {
    const html = await fs.readFile(path.join(root, file), "utf8");
    checked.push(file);
    return html;
  } catch {
    issues.push(`${file}: missing file`);
    return "";
  }
}

function count(html, pattern) {
  return [...html.matchAll(pattern)].length;
}

function check(condition, file, message) {
  if (!condition) issues.push(`${file}: ${message}`);
}

for (const [locale, config] of Object.entries(localeConfig)) {
  for (const file of config.homes) {
    const html = await read(file);
    check(count(html, /class="language-menu"/g) >= 2, file, "desktop and mobile language menus missing");
    check(count(html, /<a href="[^"]+" lang="(?:en|zh|ja|ko|th|ru)"/g) >= 12, file, "language menus do not expose six languages twice");
    check(!html.includes('class="language-switch"'), file, "legacy horizontal language switch remains");
    check(html.includes("/assets/language-menu.js"), file, "language menu behavior script missing");
    check(count(html, /class="product-route-card"/g) === 9, file, "expected nine route products");
    check(count(html, /player\.bilibili\.com/g) === 0, file, "embedded Bilibili players should not appear on the luxury home page");
    check(!html.includes("official-films-band"), file, "removed destination-film section returned");
    check(count(html, /hero-scene scene-/g) === 9, file, "expected nine real-photo hero scenes");
    check(html.includes('class="lead-form home-lead-form"'), file, "home inquiry form missing");
    check(html.includes('hreflang="ru"'), file, "Russian hreflang missing");
  }

  const interestHtml = await read(config.interest);
  check(interestHtml.includes('class="lead-form'), config.interest, "inquiry form missing");
  check(interestHtml.includes(`data-form-lang="${locale}"`), config.interest, "form language label mismatch");
  check(interestHtml.includes("data-sheet-endpoint"), config.interest, "Google Sheet endpoint missing");
  check(interestHtml.includes("formsubmit.co"), config.interest, "email fallback action missing");

  for (const slug of destinations) {
    for (const file of config.destination(slug)) {
      const html = await read(file);
      check(count(html, /class="route-day-item"/g) >= 5, file, "day-by-day route missing");
      check(html.includes("standard-route-band"), file, "standard route summary missing");
      check(html.includes("material-notes-band") || html.includes("visual-route-overview"), file, "real-place photo notes missing");
      check(html.includes(`destination=${slug}`), file, "destination inquiry link missing");
      check(html.includes('hreflang="ru"'), file, "Russian hreflang missing");
      check(html.includes(`"priceCurrency": "${config.currency}"`) || html.includes(`"priceCurrency":"${config.currency}"`), file, `Product currency is not ${config.currency}`);
      check(count(html, /<a href="[^"]+" lang="(?:en|zh|ja|ko|th|ru)"/g) >= 12, file, "destination language menus incomplete");
    }
  }
}

const sitemap = await read("sitemap.xml");
for (const slug of destinations) {
  check(sitemap.includes(`https://bluehourchina.com/ru/${slug}/`), "sitemap.xml", `Russian ${slug} URL missing`);
}

const summary = {
  checkedAt: new Date().toISOString(),
  localeCount: Object.keys(localeConfig).length,
  destinationCount: destinations.length,
  fileCount: new Set(checked).size,
  issueCount: issues.length,
  issues,
};

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, "multilingual-parity-audit.json"), JSON.stringify(summary, null, 2));

console.log(`Multilingual parity audit checked ${summary.fileCount} files across ${summary.localeCount} languages`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues.slice(0, 100)) console.log(`ISSUE ${issue}`);
if (issues.length) process.exitCode = 1;
