import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const destinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast"];
const pricing = {
  en: {
    currency: "CNY",
    homes: ["index.html", "en.html", "en/index.html"],
    routes: (slug) => [`${slug}.html`, `en/${slug}/index.html`],
    values: {
      yunnan: { price: "4680", replace: [["US$545", "RMB 4,680"], ["RMB 6,100", "RMB 4,680"]] },
      xinjiang: { price: "13800", replace: [["US$1,850", "RMB 13,800"], ["RMB 19,800", "RMB 13,800"]] },
      dunhuang: { price: "4980", replace: [["US$1,450", "RMB 4,980"], ["RMB 15,100", "RMB 4,980"], ["RMB 19,800", "RMB 4,980"]] },
      "inner-mongolia": { price: "9500", replace: [["US$850", "RMB 9,500"]] },
      sanya: { price: "14200", replace: [["US$1,350", "RMB 14,200"]] },
      northeast: { price: "16700", replace: [["US$1,600", "RMB 16,700"]] },
    },
  },
  zh: {
    currency: "CNY",
    homes: ["zh.html", "zh/index.html"],
    routes: (slug) => [`zh/${slug}/index.html`],
    values: {
      yunnan: { price: "4680", replace: [["NT$18,600", "RMB 4,680"], ["RMB 3,917", "RMB 4,680"], ["RMB 6,100", "RMB 4,680"]] },
      xinjiang: { price: "13800", replace: [["RMB 12,800", "RMB 13,800"], ["RMB 19,800", "RMB 13,800"]] },
      dunhuang: { price: "4980", replace: [["RMB 9,800", "RMB 4,980"], ["RMB 15,100", "RMB 4,980"], ["RMB 19,800", "RMB 4,980"]] },
      "inner-mongolia": { price: "9500", replace: [["RMB 6,150", "RMB 9,500"]] },
      sanya: { price: "14200", replace: [["RMB 9,200", "RMB 14,200"]] },
      northeast: { price: "16700", replace: [["RMB 10,800", "RMB 16,700"]] },
    },
  },
  ja: {
    currency: "CNY",
    homes: ["ja.html", "ja/index.html"],
    routes: (slug) => [`ja/${slug}/index.html`],
    values: {
      yunnan: { price: "4680", replace: [["JPY 86,000", "RMB 4,680"], ["RMB 6,100", "RMB 4,680"]] },
      xinjiang: { price: "13800", replace: [["JPY 300,000", "RMB 13,800"], ["RMB 19,800", "RMB 13,800"]] },
      dunhuang: { price: "4980", replace: [["JPY 235,000", "RMB 4,980"], ["RMB 15,100", "RMB 4,980"], ["RMB 19,800", "RMB 4,980"]] },
      "inner-mongolia": { price: "9500", replace: [["JPY 136,000", "RMB 9,500"]] },
      sanya: { price: "14200", replace: [["JPY 220,000", "RMB 14,200"]] },
      northeast: { price: "16700", replace: [["JPY 255,000", "RMB 16,700"]] },
    },
  },
  ko: {
    currency: "CNY",
    homes: ["ko.html", "ko/index.html"],
    routes: (slug) => [`ko/${slug}/index.html`],
    values: {
      yunnan: { price: "4680", replace: [["KRW 745,000", "RMB 4,680"], ["RMB 6,100", "RMB 4,680"]] },
      xinjiang: { price: "13800", replace: [["KRW 2,850,000", "RMB 13,800"], ["RMB 19,800", "RMB 13,800"]] },
      dunhuang: { price: "4980", replace: [["KRW 2,200,000", "RMB 4,980"], ["RMB 15,100", "RMB 4,980"], ["RMB 19,800", "RMB 4,980"]] },
      "inner-mongolia": { price: "9500", replace: [["KRW 1,180,000", "RMB 9,500"]] },
      sanya: { price: "14200", replace: [["KRW 2,100,000", "RMB 14,200"]] },
      northeast: { price: "16700", replace: [["KRW 2,400,000", "RMB 16,700"]] },
    },
  },
  th: {
    currency: "CNY",
    homes: ["th.html", "th/index.html"],
    routes: (slug) => [`th/${slug}/index.html`],
    values: {
      yunnan: { price: "4680", replace: [["THB 17,700", "RMB 4,680"], ["RMB 6,100", "RMB 4,680"]] },
      xinjiang: { price: "13800", replace: [["THB 62,000", "RMB 13,800"], ["RMB 19,800", "RMB 13,800"]] },
      dunhuang: { price: "4980", replace: [["THB 48,000", "RMB 4,980"], ["RMB 15,100", "RMB 4,980"], ["RMB 19,800", "RMB 4,980"]] },
      "inner-mongolia": { price: "9500", replace: [["THB 28,000", "RMB 9,500"]] },
      sanya: { price: "14200", replace: [["THB 45,000", "RMB 14,200"]] },
      northeast: { price: "16700", replace: [["THB 52,000", "RMB 16,700"]] },
    },
  },
  ru: {
    currency: "CNY",
    homes: ["ru.html", "ru/index.html"],
    routes: (slug) => [`ru/${slug}/index.html`],
    values: {
      yunnan: { price: "4680", replace: [["95 000 ₽", "RMB 4,680"], ["RMB 6,100", "RMB 4,680"]] },
      xinjiang: { price: "13800", replace: [["143 000 ₽", "RMB 13,800"], ["RMB 19,800", "RMB 13,800"]] },
      dunhuang: { price: "4980", replace: [["110 000 ₽", "RMB 4,980"], ["RMB 15,100", "RMB 4,980"], ["RMB 19,800", "RMB 4,980"]] },
      "inner-mongolia": { price: "9500", replace: [["96 000 ₽", "RMB 9,500"]] },
      sanya: { price: "14200", replace: [["103 000 ₽", "RMB 14,200"]] },
      northeast: { price: "16700", replace: [["121 000 ₽", "RMB 16,700"]] },
    },
  },
};

function replacePrices(html, values) {
  let output = html;
  for (const value of Object.values(values)) {
    for (const [from, to] of value.replace) output = output.replaceAll(from, to);
  }
  return output;
}

function slugFromUrl(url = "") {
  return destinations.find((slug) => new RegExp(`(?:/|^)${slug}(?:\\.html|/|$)`).test(url));
}

const budgetLabels = {
  en: ["Under RMB 8,000", "RMB 8,000-15,000", "RMB 15,000-25,000", "RMB 25,000 and above", "Not sure yet"],
  zh: ["RMB 8,000 以下", "RMB 8,000-15,000", "RMB 15,000-25,000", "RMB 25,000 以上", "還沒決定"],
  ja: ["RMB 8,000 未満", "RMB 8,000-15,000", "RMB 15,000-25,000", "RMB 25,000 以上", "まだ未定"],
  ko: ["RMB 8,000 미만", "RMB 8,000-15,000", "RMB 15,000-25,000", "RMB 25,000 이상", "미정"],
  th: ["ต่ำกว่า RMB 8,000", "RMB 8,000-15,000", "RMB 15,000-25,000", "RMB 25,000 ขึ้นไป", "ยังไม่แน่ใจ"],
  ru: ["До RMB 8,000", "RMB 8,000-15,000", "RMB 15,000-25,000", "Более RMB 25,000", "Пока не решил(а)"],
};

function normalizeBudgetSelects(html) {
  const locale = html.match(/<html\b[^>]*lang=["']([^"']+)/i)?.[1]?.slice(0, 2) || "en";
  const labels = budgetLabels[locale] || budgetLabels.en;
  let output = html.replace(/(<select\b[^>]*name=["']budget["'][^>]*>)([\s\S]*?)(<\/select>)/gi, (block, open, inner, close) => {
    if (!/US\$|NT\$|\b(?:USD|TWD|JPY|KRW|THB|RUB)\b|₽|¥\s*[\d,]/i.test(inner)) return block;
    const placeholder = inner.match(/<option\b[^>]*value=["']["'][^>]*disabled[^>]*selected[^>]*>[\s\S]*?<\/option>/i)?.[0]
      || inner.match(/<option\b[^>]*disabled[^>]*selected[^>]*>[\s\S]*?<\/option>/i)?.[0]
      || '<option value="" disabled selected>Budget per traveller</option>';
    const options = labels.map((label, index) => `<option value="${index === 4 ? "not-sure" : label}">${label}</option>`).join("");
    return `${open}${placeholder}${options}${close}`;
  });
  output = output
    .replace(/data-lead-currency=["'][^"']+["']/g, 'data-lead-currency="CNY"')
    .replace(/(<input\b[^>]*name=["']lead_currency["'][^>]*value=)["'][^"']*["']/g, '$1"CNY"');
  return output;
}

function normalizeCurrencySchemas(html) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (block, json) => {
    let schema;
    try {
      schema = JSON.parse(json);
    } catch {
      return block;
    }

    let changed = false;
    const visit = (value) => {
      if (!value || typeof value !== "object") return;
      if (Object.hasOwn(value, "priceCurrency") && value.priceCurrency !== "CNY") {
        value.priceCurrency = "CNY";
        changed = true;
      }
      for (const child of Object.values(value)) visit(child);
    };
    visit(schema);
    if (!changed) return block;
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`;
  });
}

function updateSchemas(html, config, routeSlug = null) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (block, json) => {
    let schema;
    try {
      schema = JSON.parse(json);
    } catch {
      return block;
    }

    if (schema?.["@type"] === "Product" && schema.offers) {
      const slug = routeSlug || slugFromUrl(schema.offers.url || schema.url);
      if (slug && config.values[slug]) {
        schema.offers["@type"] = "Offer";
        schema.offers.priceCurrency = config.currency;
        schema.offers.price = config.values[slug].price;
        delete schema.offers.lowPrice;
        delete schema.offers.highPrice;
        delete schema.offers.offerCount;
      }
    }

    const offers = schema?.hasOfferCatalog?.itemListElement;
    if (Array.isArray(offers)) {
      for (const [index, offer] of offers.entries()) {
        const slug = slugFromUrl(offer.url || offer.itemOffered?.url || "") || destinations[index];
        if (slug && config.values[slug]) {
          offer.priceCurrency = config.currency;
          offer.price = config.values[slug].price;
        }
      }
    }

    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`;
  });
}

async function update(file, transform) {
  const absolute = path.join(root, file);
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
for (const config of Object.values(pricing)) {
  for (const slug of destinations) {
    for (const file of config.routes(slug)) {
      updated += await update(file, (html) => updateSchemas(replacePrices(html, { [slug]: config.values[slug] }), config, slug));
    }
  }
  for (const file of config.homes) {
    updated += await update(file, (html) => updateSchemas(replacePrices(html, config.values), config));
  }
}

const grandYunnanFiles = [
  "yunnan.html",
  "en/yunnan/index.html",
  "yunnan-grand-loop/index.html",
  "china-travel/index.html",
  "zh/yunnan/index.html",
  "zh/yunnan-grand-loop/index.html",
  "ja/yunnan/index.html",
  "ko/yunnan/index.html",
];
const grandYunnanReplacements = [
  ["US$1,250", "RMB 8,500"],
  ["NT$40,000", "RMB 8,500"],
  ["JPY 190,000", "RMB 8,500"],
  ["KRW 1,600,000", "RMB 8,500"],
];
for (const file of grandYunnanFiles) {
  updated += await update(file, (html) => {
    let output = html;
    for (const [from, to] of grandYunnanReplacements) output = output.replaceAll(from, to);
    if (file.includes("yunnan-grand-loop")) {
      output = output.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (block, json) => {
        let schema;
        try {
          schema = JSON.parse(json);
        } catch {
          return block;
        }
        if (schema?.["@type"] !== "Product" || !schema.offers) return block;
        schema.offers.priceCurrency = "CNY";
        schema.offers.price = "8500";
        return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
      });
    }
    return output
      .replace(/English pages use USD, Traditional Chinese pages show RMB, Japanese pages show JPY, Korean pages show KRW, Thai pages show THB and Russian pages show RUB\./g, "Every language displays public prices in RMB, while structured data uses the ISO currency code CNY.")
      .replace(/English and x-default pages use USD, Traditional Chinese pages show RMB publicly while JSON-LD uses CNY, Japanese pages use JPY, Korean pages use KRW and Thai pages use THB\./g, "Every language displays public prices in RMB, while JSON-LD uses CNY.")
      .replace(/with day-by-day itinerary and USD starting prices/g, "with day-by-day itinerary and an RMB starting price")
      .replace(/Public reference prices use RUB/g, "Public reference prices use RMB consistently across languages");
  });
}

for (const file of ["llms.txt", "llms-full.txt"]) {
  updated += await update(file, (text) => {
    let output = text;
    for (const config of Object.values(pricing)) output = replacePrices(output, config.values);
    for (const [from, to] of grandYunnanReplacements) output = output.replaceAll(from, to);
    return output;
  });
}

async function htmlFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".git", "node_modules", "outputs"].includes(entry.name)) continue;
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(absolute));
    else if (entry.name.endsWith(".html")) files.push(path.relative(root, absolute));
  }
  return files;
}

for (const file of await htmlFiles(root)) {
  updated += await update(file, (html) => normalizeCurrencySchemas(normalizeBudgetSelects(html))
    .replaceAll(
      "台幣依 1 CNY 約兌 NT$4.75 概算。正式報價依季節、房型、車輛與匯率確認；不含往返中國機票、未列明正餐與個人消費。",
      "所有公開價格均以人民幣計。正式報價依季節、房型、車輛與實際資源確認；不含往返中國機票、未列明正餐與個人消費。",
    ));
}

console.log(`Applied retail-margin prices to ${updated} files.`);
