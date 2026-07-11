import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const oldCssVersion = "20260704-polish95f";
const newCssVersion = "20260705-offers1";

const routeData = [
  {
    key: "yunnan",
    englishName: "Yunnan private route: Dali, Shaxi and Lijiang",
    itinerary: "Dali, Shaxi, Lijiang or Baisha",
    urls: {
      en: "https://bluehourchina.com/yunnan.html",
      zh: "https://bluehourchina.com/zh/yunnan/",
      ja: "https://bluehourchina.com/ja/yunnan/",
      ko: "https://bluehourchina.com/ko/yunnan/",
      th: "https://bluehourchina.com/th/yunnan/",
    },
    offers: {
      en: { duration: "7 days", price: "From US$1,250", currency: "USD", amount: "1250" },
      zh: { duration: "一週", price: "RMB 8,800 起", currency: "CNY", amount: "8800" },
      ja: { duration: "7日間", price: "JPY 205,000 から", currency: "JPY", amount: "205000" },
      ko: { duration: "7일", price: "KRW 1,950,000 부터", currency: "KRW", amount: "1950000" },
      th: { duration: "7 วัน", price: "เริ่มที่ THB 42,000", currency: "THB", amount: "42000" },
    },
  },
  {
    key: "xinjiang",
    englishName: "Xinjiang private route: Urumqi, Sayram Lake or Ili",
    itinerary: "Urumqi, Sayram Lake or Ili, grassland or bazaar",
    urls: {
      en: "https://bluehourchina.com/xinjiang.html",
      zh: "https://bluehourchina.com/zh/xinjiang/",
      ja: "https://bluehourchina.com/ja/xinjiang/",
      ko: "https://bluehourchina.com/ko/xinjiang/",
      th: "https://bluehourchina.com/th/xinjiang/",
    },
    offers: {
      en: { duration: "8-9 days", price: "From US$1,850", currency: "USD", amount: "1850" },
      zh: { duration: "8-9 日", price: "RMB 12,800 起", currency: "CNY", amount: "12800" },
      ja: { duration: "8-9日間", price: "JPY 300,000 から", currency: "JPY", amount: "300000" },
      ko: { duration: "8-9일", price: "KRW 2,850,000 부터", currency: "KRW", amount: "2850000" },
      th: { duration: "8-9 วัน", price: "เริ่มที่ THB 62,000", currency: "THB", amount: "62000" },
    },
  },
  {
    key: "dunhuang",
    englishName: "Dunhuang private route: Mogao Caves and desert evening",
    itinerary: "Dunhuang, Mogao Caves, Mingsha dunes and oasis evening",
    urls: {
      en: "https://bluehourchina.com/dunhuang.html",
      zh: "https://bluehourchina.com/zh/dunhuang/",
      ja: "https://bluehourchina.com/ja/dunhuang/",
      ko: "https://bluehourchina.com/ko/dunhuang/",
      th: "https://bluehourchina.com/th/dunhuang/",
    },
    offers: {
      en: { duration: "5-6 days", price: "From US$1,450", currency: "USD", amount: "1450" },
      zh: { duration: "5-6 日", price: "RMB 9,800 起", currency: "CNY", amount: "9800" },
      ja: { duration: "5-6日間", price: "JPY 235,000 から", currency: "JPY", amount: "235000" },
      ko: { duration: "5-6일", price: "KRW 2,200,000 부터", currency: "KRW", amount: "2200000" },
      th: { duration: "5-6 วัน", price: "เริ่มที่ THB 48,000", currency: "THB", amount: "48000" },
    },
  },
  {
    key: "sanya",
    englishName: "Sanya private route: resort stay and coastal ease",
    itinerary: "Sanya resort stay, coastal day and gentle local moment",
    urls: {
      en: "https://bluehourchina.com/sanya.html",
      zh: "https://bluehourchina.com/zh/sanya/",
      ja: "https://bluehourchina.com/ja/sanya/",
      ko: "https://bluehourchina.com/ko/sanya/",
      th: "https://bluehourchina.com/th/sanya/",
    },
    offers: {
      en: { duration: "5 days", price: "From US$1,350", currency: "USD", amount: "1350" },
      zh: { duration: "5 日", price: "RMB 9,200 起", currency: "CNY", amount: "9200" },
      ja: { duration: "5日間", price: "JPY 220,000 から", currency: "JPY", amount: "220000" },
      ko: { duration: "5일", price: "KRW 2,100,000 부터", currency: "KRW", amount: "2100000" },
      th: { duration: "5 วัน", price: "เริ่มที่ THB 45,000", currency: "THB", amount: "45000" },
    },
  },
  {
    key: "northeast",
    englishName: "Northeast China winter private route",
    itinerary: "Harbin, snow or forest stay and winter rail movement",
    urls: {
      en: "https://bluehourchina.com/northeast.html",
      zh: "https://bluehourchina.com/zh/northeast/",
      ja: "https://bluehourchina.com/ja/northeast/",
      ko: "https://bluehourchina.com/ko/northeast/",
      th: "https://bluehourchina.com/th/northeast/",
    },
    offers: {
      en: { duration: "About 1 week", price: "From US$1,600", currency: "USD", amount: "1600" },
      zh: { duration: "約一週", price: "RMB 10,800 起", currency: "CNY", amount: "10800" },
      ja: { duration: "約1週間", price: "JPY 255,000 から", currency: "JPY", amount: "255000" },
      ko: { duration: "약 일주일", price: "KRW 2,400,000 부터", currency: "KRW", amount: "2400000" },
      th: { duration: "ประมาณหนึ่งสัปดาห์", price: "เริ่มที่ THB 52,000", currency: "THB", amount: "52000" },
    },
  },
];

const homeFiles = [
  { file: "index.html", locale: "en" },
  { file: "en.html", locale: "en" },
  { file: "en/index.html", locale: "en" },
  { file: "zh.html", locale: "zh" },
  { file: "zh/index.html", locale: "zh" },
  { file: "ja.html", locale: "ja" },
  { file: "ja/index.html", locale: "ja" },
  { file: "ko.html", locale: "ko" },
  { file: "ko/index.html", locale: "ko" },
  { file: "th.html", locale: "th" },
  { file: "th/index.html", locale: "th" },
];

const cssLinkedHtmlFiles = [];

async function walk(dir = root) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "outputs" || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      cssLinkedHtmlFiles.push(path.relative(root, full));
    }
  }
}

function offerCatalog(locale) {
  return {
    "@type": "OfferCatalog",
    name: "Private China route starting offers",
    itemListElement: routeData.map((route) => {
      const offer = route.offers[locale];
      return {
        "@type": "Offer",
        name: route.englishName,
        url: route.urls[locale],
        priceCurrency: offer.currency,
        price: offer.amount,
        availability: "https://schema.org/InStock",
        itemOffered: {
          "@type": "TouristTrip",
          name: route.englishName,
          itinerary: route.itinerary,
          touristType: "International travellers beyond first-city China trips",
        },
      };
    }),
  };
}

function addJsonLdOfferCatalog(html, locale) {
  const scriptRe = /<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/;
  const match = html.match(scriptRe);
  if (!match) return html;

  let data;
  try {
    data = JSON.parse(match[1]);
  } catch {
    return html;
  }

  if (data["@type"] !== "TravelAgency") return html;
  data.inLanguage = data.inLanguage || locale;
  data.hasOfferCatalog = offerCatalog(locale);

  const replacement = `<script type="application/ld+json">\n  ${JSON.stringify(data, null, 2)}\n  </script>`;
  return html.replace(scriptRe, replacement);
}

function normalizeMalformedEnglishPrices(html) {
  return html.replace(/<span>From US\s*,([0-9]{3})<\/span>/g, (_match, amountTail) => {
    return `<span>From US$1,${amountTail}</span>`;
  });
}

function addVisibleOfferSignals(html, locale) {
  for (const route of routeData) {
    if (html.includes(`data-route-offer="${route.key}"`)) continue;
    const offer = route.offers[locale];
    const destinationHref = new URL(route.urls[locale]).pathname;
    const href = locale === "en" ? destinationHref.replace(/\/$/, ".html") : destinationHref;
    const anchorRe = new RegExp(`(\\s*)<a href="${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}">`);
    html = html.replace(anchorRe, (_match, indent) => {
      return `${indent}<div class="place-meta" data-route-offer="${route.key}"><span>${offer.duration}</span><span>${offer.price}</span></div>${indent}<a href="${href}">`;
    });
  }
  return html;
}

await walk();

for (const file of cssLinkedHtmlFiles) {
  const full = path.join(root, file);
  let html = await fs.readFile(full, "utf8");
  html = html.replaceAll(`luxury-multilang.css?v=${oldCssVersion}`, `luxury-multilang.css?v=${newCssVersion}`);
  html = normalizeMalformedEnglishPrices(html);
  html = addJsonLdOfferCatalog(html, locale);
  html = addVisibleOfferSignals(html, locale);
  await fs.writeFile(full, html);
}

const auditFile = path.join(root, "scripts/audit-site-quality.mjs");
let audit = await fs.readFile(auditFile, "utf8");
audit = audit.replace(`v=${oldCssVersion}`, `v=${newCssVersion}`);
await fs.writeFile(auditFile, audit);

console.log(`Updated ${cssLinkedHtmlFiles.length} HTML files to CSS ${newCssVersion}`);
console.log(`Updated ${homeFiles.length} home files with visible route offers and OfferCatalog JSON-LD`);
