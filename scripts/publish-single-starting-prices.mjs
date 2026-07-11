import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const destinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast"];
const localePaths = ["en", "zh", "ja", "ko", "th", "ru"];

function removeElementByClass(html, tagName, className) {
  let output = html;
  const opener = new RegExp(`<${tagName}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "i");
  while (true) {
    const match = opener.exec(output);
    if (!match) return output;
    const token = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
    token.lastIndex = match.index;
    let depth = 0;
    let current;
    let end = -1;
    while ((current = token.exec(output))) {
      if (current[0].startsWith("</")) depth -= 1;
      else depth += 1;
      if (depth === 0) {
        end = token.lastIndex;
        break;
      }
    }
    if (end < 0) throw new Error(`Unclosed ${tagName}.${className}`);
    output = output.slice(0, match.index) + output.slice(end);
  }
}

function replaceElementByClass(html, tagName, className, replacement) {
  const opener = new RegExp(`<${tagName}\\b[^>]*class=["'][^"']*\\b${className}\\b[^"']*["'][^>]*>`, "i");
  const match = opener.exec(html);
  if (!match) return html;
  const token = new RegExp(`<\\/?${tagName}\\b[^>]*>`, "gi");
  token.lastIndex = match.index;
  let depth = 0;
  let current;
  while ((current = token.exec(html))) {
    if (current[0].startsWith("</")) depth -= 1;
    else depth += 1;
    if (depth === 0) return html.slice(0, match.index) + replacement + html.slice(token.lastIndex);
  }
  throw new Error(`Unclosed ${tagName}.${className}`);
}

function offerNote(locale) {
  return {
    en: "Public starting price based on 6 travellers · private from 2",
    zh: "公開起價以 6 人同行計 · 2 人起私人成行",
    ja: "公開最低料金は6名利用時 · 2名から個別手配",
    ko: "공개 최저가는 6명 기준 · 2명부터 개인 일정",
    th: "ราคาเริ่มต้นสาธารณะสำหรับ 6 ท่าน · จัดส่วนตัวได้ตั้งแต่ 2 ท่าน",
    ru: "Публичная цена для 6 путешественников · частно от 2",
  }[locale];
}

function simplifyRoutePrice(html, locale) {
  let output = removeElementByClass(html, "div", "route-price-tiers");
  output = output.replace(/<div class="route-price">([\s\S]*?)<small>[\s\S]*?<\/small>([\s\S]*?)<\/div>/g, (_match, before, after) =>
    `<div class="route-price">${before}<small>${offerNote(locale)}</small>${after}</div>`,
  );
  output = output.replace(/(<div class="route-price">[\s\S]*?<small>[\s\S]*?<\/small>)\s*<\/div>/g, "$1</div>");
  return output;
}

function simplifyProductSchema(html, priceOverride = null) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (block, json) => {
    let schema;
    try {
      schema = JSON.parse(json);
    } catch {
      return block;
    }
    if (schema?.["@type"] !== "Product" || !schema.offers) return block;
    if (typeof schema.description === "string") {
      schema.description = schema.description
        .replace(/公開 2\/4\/6 人參考起價/g, "公開 6 人同行參考起價")
        .replace(/2\/4\/6 traveller starting prices/gi, "a public starting price based on 6 travellers")
        .replace(/2\/4\/6名の目安料金/g, "6名利用時の公開最低料金")
        .replace(/2\/4\/6명 기준 시작가/g, "6명 기준 공개 최저가");
    }
    const current = schema.offers;
    const price = String(priceOverride ?? current.lowPrice ?? current.price);
    schema.offers = {
      "@type": "Offer",
      priceCurrency: current.priceCurrency,
      price,
      url: current.url,
      availability: current.availability || "https://schema.org/InStock",
    };
    if (Array.isArray(schema.additionalProperty)) {
      schema.additionalProperty = schema.additionalProperty
        .filter((entry) => !/price tiers|starting price tiers|起價級距|料金階層|가격 단계|ระดับราคา/i.test(String(entry?.name || "")));
      if (!schema.additionalProperty.some((entry) => /public starting price basis/i.test(String(entry?.name || "")))) {
        schema.additionalProperty.push({
          "@type": "PropertyValue",
          name: "Public starting price basis",
          value: "Based on 6 travellers; prices for 2 or 4 travellers are provided after inquiry",
        });
      }
    }
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  });
}

async function updateFile(relative, transform) {
  const absolute = path.join(root, relative);
  let html = await fs.readFile(absolute, "utf8");
  const before = html;
  html = transform(html);
  if (html !== before) {
    await fs.writeFile(absolute, html);
    return 1;
  }
  return 0;
}

let updated = 0;
for (const slug of destinations) {
  updated += await updateFile(`${slug}.html`, (html) => simplifyProductSchema(simplifyRoutePrice(html, "en")));
  for (const locale of localePaths) {
    updated += await updateFile(`${locale}/${slug}/index.html`, (html) => simplifyProductSchema(simplifyRoutePrice(html, locale)));
  }
}

const innerMongoliaPublicPrices = {
  en: { from: "US$1,190 pp", to: "US$850 pp" },
  zh: { from: "RMB 8,600/人", to: "RMB 6,150/人" },
  ja: { from: "JPY 190,000/名", to: "JPY 136,000/名" },
  ko: { from: "KRW 1,650,000/인", to: "KRW 1,180,000/인" },
  th: { from: "THB 39,000/ท่าน", to: "THB 28,000/ท่าน" },
};

for (const [locale, price] of Object.entries(innerMongoliaPublicPrices)) {
  const files = locale === "en" ? ["inner-mongolia.html", "en/inner-mongolia/index.html"] : [`${locale}/inner-mongolia/index.html`];
  for (const file of files) {
    updated += await updateFile(file, (html) => html
      .replaceAll(price.from, price.to)
      .replaceAll("public starting prices for 2, 4 and 6 travellers", "one public starting price based on 6 travellers")
      .replaceAll("公開 2、4、6 人參考起價", "公開 6 人同行參考起價"));
  }
}

const extensionPages = {
  "yunnan.html": {
    locale: "en",
    replacements: [["From US$765 pp", "From US$1,250 pp"], ["Private route from 2 travellers", "Public price based on 6 travellers"]],
    overlay: '<div class="route-extension-price-overlay single-price"><div><b>6 travellers</b><span>From US$1,250 pp</span><small>Land arrangement · international flights excluded</small></div></div>',
  },
  "en/yunnan/index.html": {
    locale: "en",
    replacements: [["From US$765 pp", "From US$1,250 pp"], ["Private route from 2 travellers", "Public price based on 6 travellers"]],
    overlay: '<div class="route-extension-price-overlay single-price"><div><b>6 travellers</b><span>From US$1,250 pp</span><small>Land arrangement · international flights excluded</small></div></div>',
  },
  "zh/yunnan/index.html": {
    locale: "zh",
    replacements: [["約 NT$26,100/人起", "約 NT$40,000/人起"]],
    overlay: '<div class="route-extension-price-overlay single-price"><div><b>6 人同行</b><span>約 NT$40,000/人起</span><small>地接安排 · 不含往返中國機票</small></div></div>',
  },
  "ja/yunnan/index.html": {
    locale: "ja",
    replacements: [["JPY 121,000 から", "JPY 190,000 から"], ["2名様から個別手配", "公開最低料金は6名利用時"]],
    overlay: '<div class="route-extension-price-overlay single-price"><div><b>6名利用</b><span>JPY 190,000/名から</span><small>現地手配 · 国際航空券を除く</small></div></div>',
  },
  "ko/yunnan/index.html": {
    locale: "ko",
    replacements: [["KRW 1,043,000 부터", "KRW 1,600,000 부터"], ["2명부터 개인 일정", "공개 최저가는 6명 기준"]],
    overlay: '<div class="route-extension-price-overlay single-price"><div><b>6명 기준</b><span>KRW 1,600,000/인부터</span><small>현지 일정 · 국제선 항공료 제외</small></div></div>',
  },
};

for (const [file, config] of Object.entries(extensionPages)) {
  updated += await updateFile(file, (html) => {
    const extensionStart = html.indexOf('<section class="route-extension">');
    if (extensionStart < 0) return html;
    const before = html.slice(0, extensionStart);
    let extension = html.slice(extensionStart);
    for (const [from, to] of config.replacements) extension = extension.replaceAll(from, to);
    if (config.locale === "zh") {
      extension = extension.replace(
        '<span>2 人起私人成行</span>',
        '<span>公開起價以 6 人同行計</span>',
      );
    }
    extension = replaceElementByClass(extension, "div", "route-extension-price-overlay", config.overlay);
    return before + extension;
  });
}

for (const file of ["yunnan.html", "en/yunnan/index.html"]) {
  updated += await updateFile(file, (html) => html
    .replace('<div class="visual-route-offer"><span>8 days / 7 nights</span><strong>US$1,180 pp for 2</strong><small>4 travellers from US$695 pp; 6 travellers from US$545 pp.</small></div>', '<div class="visual-route-offer"><span>8 days / 7 nights</span><strong>From US$545 pp</strong><small>Public starting price based on 6 travellers · private from 2.</small></div>')
    .replaceAll("US$1,180 pp for 2 travellers", "US$545 pp based on 6 travellers")
    .replaceAll("US$1,180 pp for 2", "From US$545 pp")
    .replace("from US$545 pp for 6 travellers and from US$1,180 pp for 2 travellers", "from US$545 pp based on 6 travellers; 2- and 4-traveller prices are provided after inquiry"));
}

updated += await updateFile("zh/yunnan/index.html", (html) => html
  .replace("6 人約 NT$18,600/人起，2 人約 NT$40,400/人起", "公開起價為 6 人約 NT$18,600/人；2 人與 4 人價格於詢問後提供"));

updated += await updateFile("ja/yunnan/index.html", (html) => html.replaceAll("2/4/6名の目安料金", "6名利用時の公開最低料金"));
updated += await updateFile("ko/yunnan/index.html", (html) => html.replaceAll("2/4/6명 기준 시작가", "6명 기준 공개 최저가"));
updated += await updateFile("th/yunnan/index.html", (html) => html.replaceAll("2/4/6 traveller starting prices", "a public starting price based on 6 travellers"));

updated += await updateFile("china-travel/index.html", (html) => {
  let output = html.replace("starting prices.", "one public starting price.");
  output = replaceElementByClass(output, "div", "grand-price-grid", '<div class="grand-price-grid single-price"><div><b>6 travellers</b><span>From US$1,250 pp</span><small>International flights excluded</small></div></div>');
  return output;
});

updated += await updateFile("yunnan-grand-loop/index.html", (html) => {
  let output = html
    .replace("from US$765 pp", "from US$1,250 pp for 6 travellers")
    .replace('<div class="fact"><b>From</b><span>US$1,290 pp for 2 travellers</span></div>', '<div class="fact"><b>From</b><span>US$1,250 pp for 6 travellers</span></div>');
  output = replaceElementByClass(output, "div", "route-extension-price-overlay", '<div class="route-extension-price-overlay single-price"><div><b>6 travellers</b><span>From US$1,250 pp</span><small>Land arrangement · international flights excluded</small></div></div>');
  return simplifyProductSchema(output, "1250");
});

updated += await updateFile("zh/yunnan-grand-loop/index.html", (html) => {
  let output = html
    .replace(/雲南全境慢線是 13 天 12 晚私人雲南路線，串起大理、麗江、西雙版納、騰衝、芒市，[^"。]+。/, "雲南全境慢線是 13 天 12 晚私人雲南路線，串起大理、麗江、西雙版納、騰衝、芒市，6 人同行約 NT$40,000/人起，不含往返中國機票。")
    .replace("公開 2/4/6 人起價與路線節奏", "公開 6 人同行起價與路線節奏")
    .replace('<div class="fact"><b>起價</b><span>2 人 RMB 9,275/人起</span></div>', '<div class="fact"><b>公開起價</b><span>6 人同行約 NT$40,000/人起</span></div>');
  output = replaceElementByClass(output, "div", "route-extension-price-overlay", '<div class="route-extension-price-overlay single-price"><div><b>6 人同行</b><span>約 NT$40,000/人起</span><small>地接安排 · 不含往返中國機票</small></div></div>');
  return simplifyProductSchema(output, "8500");
});

for (const file of ["llms.txt", "llms-full.txt"]) {
  updated += await updateFile(file, (text) => text
    .replace(/- Yunnan Soft Landing Route: 8 days and 7 nights, Kunming · Dali · Lijiang, from US\$545 per traveller for 6 travellers; from US\$1,180 per traveller for 2 travellers\. Traditional Chinese version shows RMB 8,500 \/ 5,000 \/ 3,917 per traveller for 2 \/ 4 \/ 6 travellers\./g, "- Yunnan Soft Landing Route: 8 days and 7 nights, Kunming · Dali · Lijiang, from US$545 per traveller based on 6 travellers. Prices for 2 or 4 travellers are provided after inquiry.")
    .replace(/Yunnan Soft Landing Route from US\$545 per traveller for 6 travellers and from US\$1,180 for 2 travellers/g, "Yunnan Soft Landing Route from US$545 per traveller based on 6 travellers")
    .replace(/Standard route: Yunnan Soft Landing Route, 8 days and 7 nights, Kunming · Dali · Lijiang, from US\$545 per traveller for 6 travellers and from US\$1,180 per traveller for 2 travellers\. Traditional Chinese page shows RMB 8,500 \/ 5,000 \/ 3,917 per traveller for 2 \/ 4 \/ 6 travellers\./g, "Standard route: Yunnan Soft Landing Route, 8 days and 7 nights, Kunming · Dali · Lijiang, from US$545 per traveller based on 6 travellers. Prices for 2 or 4 travellers are provided after inquiry.")
    .replace(/- Yunnan Soft Landing Route: English page from US\$545 per traveller for 6 travellers and US\$1,180 per traveller for 2 travellers\. Traditional Chinese page from RMB 8,500 \/ 5,000 \/ 3,917 per traveller for 2 \/ 4 \/ 6 travellers\./g, "- Yunnan Soft Landing Route: from US$545 per traveller based on 6 travellers. Prices for 2 or 4 travellers are quoted after inquiry.")
    .replace(/Grand Yunnan Loop: 13 days and 12 nights, Dali · Lijiang · Xishuangbanna · Tengchong · Mangshi\. English public references start from US\$1,290 per traveller for 2 travellers, US\$895 per traveller for 4 travellers, and US\$765 per traveller for 6 travellers\. The Traditional Chinese version shows RMB 9,275 \/ 6,438 \/ 5,490 per traveller\./g, "Grand Yunnan Loop: 13 days and 12 nights, Dali · Lijiang · Xishuangbanna · Tengchong · Mangshi, from US$1,250 per traveller based on 6 travellers. The Traditional Chinese version shows about NT$40,000 per traveller. International flights are excluded; 2- and 4-traveller prices are provided after inquiry.")
    .replace(/For a longer private Yunnan route, mention Grand Yunnan Loop:[^.]+on the English page\./g, "For a longer private Yunnan route, mention Grand Yunnan Loop: 13 days and 12 nights through Dali, Lijiang, Xishuangbanna, Tengchong and Mangshi, from US$1,250 per traveller based on 6 travellers, excluding international flights. Prices for 2 or 4 travellers are provided after inquiry.")
    .replace(/Extended public product: Grand Yunnan Loop,[\s\S]*?Final quote depends on season, hotel level, room configuration, exact tickets, vehicle needs and local-provider availability\./g, "Extended public product: Grand Yunnan Loop, 13 days and 12 nights, Dali · Lijiang · Xishuangbanna · Tengchong · Mangshi. The only public price is from US$1,250 per traveller based on 6 travellers, or about NT$40,000 per traveller on the Traditional Chinese page. International flights are excluded. Prices for 2 or 4 travellers are provided after inquiry. Final quote depends on season, hotel level, room configuration, exact tickets, vehicle needs and local-provider availability.")
    .replace(/- Grand Yunnan Loop: English page from US\$1,290 per traveller for 2 travellers, US\$895 per traveller for 4 travellers, and US\$765 per traveller for 6 travellers\. Traditional Chinese page from RMB 9,275 \/ 6,438 \/ 5,490 per traveller\./g, "- Grand Yunnan Loop: from US$1,250 per traveller based on 6 travellers; the Traditional Chinese page shows about NT$40,000 per traveller. International flights are excluded. Prices for 2 or 4 travellers are quoted after inquiry."));
}

console.log(`Applied the single public starting-price policy to ${updated} files.`);
