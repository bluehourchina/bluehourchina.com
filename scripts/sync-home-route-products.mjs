import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const destinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast"];
const images = {
  yunnan: "/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg",
  xinjiang: "/assets/real-xinjiang/sayram-lake-cc0.jpg",
  dunhuang: "/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg",
  "inner-mongolia": "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg",
  sanya: "/assets/real-sanya/haitang-bay-cc-by-sa.jpg",
  northeast: "/assets/real-northeast/china-snow-town-cc-by.jpg",
};
const destinationNames = {
  en: { yunnan: "Yunnan", xinjiang: "Xinjiang", dunhuang: "Dunhuang", "inner-mongolia": "Inner Mongolia", sanya: "Sanya", northeast: "Northeast China" },
  zh: { yunnan: "雲南", xinjiang: "新疆", dunhuang: "敦煌", "inner-mongolia": "內蒙古", sanya: "三亞", northeast: "中國東北" },
  ja: { yunnan: "雲南", xinjiang: "新疆", dunhuang: "敦煌", "inner-mongolia": "内モンゴル", sanya: "三亜", northeast: "中国東北" },
  ko: { yunnan: "윈난", xinjiang: "신장", dunhuang: "둔황", "inner-mongolia": "내몽골", sanya: "싼야", northeast: "중국 동북" },
  th: { yunnan: "ยูนนาน", xinjiang: "ซินเจียง", dunhuang: "ตุนหวง", "inner-mongolia": "มองโกเลียใน", sanya: "ซานย่า", northeast: "จีนตะวันออกเฉียงเหนือ" },
};
const labels = {
  en: { eyebrow: "Standard private journeys", title: ["See the route first", "Then tailor it to your people"], intro: "Every journey shows its length, route, starting price and minimum group before you enquire.", from: "From", group: "Private group", route: "Route", view: "View day-by-day route" },
  zh: { eyebrow: "標準私人方案", title: ["先看標準路線", "再依同行者調整"], intro: "每一條方案先公開天數、路線、起價與最低人數；確認日期後再做私人調整。", from: "起價", group: "私人成行", route: "路線", view: "看每日行程" },
  ja: { eyebrow: "標準プライベート旅行", title: ["先にルートを確認", "同行者に合わせて調整"], intro: "日数、ルート、料金目安、最少人数を先に公開し、日程確認後に個別調整します。", from: "料金目安", group: "人数", route: "ルート", view: "日ごとの旅程を見る" },
  ko: { eyebrow: "표준 프라이빗 여정", title: ["경로를 먼저 확인하고", "동행자에 맞게 조정합니다"], intro: "기간, 경로, 시작가, 최소 인원을 먼저 공개하고 날짜 확인 뒤 맞춤 조정합니다.", from: "시작가", group: "인원", route: "경로", view: "일자별 일정 보기" },
  th: { eyebrow: "เส้นทางส่วนตัวมาตรฐาน", title: ["ดูเส้นทางให้ชัดก่อน", "แล้วจึงปรับให้เหมาะกับผู้ร่วมทาง"], intro: "ทุกเส้นทางแสดงจำนวนวัน เส้นทาง ราคาเริ่มต้น และจำนวนขั้นต่ำก่อนส่งคำขอ", from: "ราคาเริ่มต้น", group: "กลุ่มส่วนตัว", route: "เส้นทาง", view: "ดูแผนรายวัน" },
};

const targets = [
  { file: "index.html", locale: "en", routeLocale: null },
  { file: "en/index.html", locale: "en", routeLocale: "en" },
  { file: "zh.html", locale: "zh", routeLocale: "zh", sync: "zh/index.html" },
  { file: "ja.html", locale: "ja", routeLocale: "ja", sync: "ja/index.html" },
  { file: "ko.html", locale: "ko", routeLocale: "ko", sync: "ko/index.html" },
  { file: "th.html", locale: "th", routeLocale: "th", sync: "th/index.html" },
];

function routeFile(destination, routeLocale) {
  return routeLocale ? `${routeLocale}/${destination}/index.html` : `${destination}.html`;
}

function routeHref(destination, routeLocale) {
  if (!routeLocale || routeLocale === "en") return routeLocale === "en" ? `/en/${destination}/` : `/${destination}.html`;
  return `/${routeLocale}/${destination}/`;
}

function extractProduct(html) {
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const value = JSON.parse(match[1]);
      if (value?.["@type"] === "Product") return value;
    } catch {
      // Other audits report malformed JSON-LD.
    }
  }
  throw new Error("Product schema missing");
}

function cleanText(value) {
  return value.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
}

function property(product, pattern) {
  return product.additionalProperty?.find((item) => pattern.test(item.name))?.value || "";
}

function displayPrice(html, product, locale) {
  const firstTier = cleanText(html.match(/<div class="route-price-tiers"><div>[\s\S]*?<span>([\s\S]*?)<\/span>/)?.[1] || "");
  const currencyPattern = locale === "en" ? /US\$\s?[\d,]+/ : locale === "zh" ? /RMB\s?[\d,]+/ : locale === "ja" ? /JPY\s?[\d,]+/ : locale === "ko" ? /KRW\s?[\d,]+/ : /THB\s?[\d,]+/;
  if (firstTier.match(currencyPattern)) return firstTier.match(currencyPattern)[0];
  const raw = cleanText(html.match(/<div class="route-price">[\s\S]*?<strong>([\s\S]*?)<\/strong>/)?.[1] || "");
  if (raw) {
    const cleaned = raw
      .replace(/^From\s+/i, "")
      .replace(/^เริ่มที่\s+/, "")
      .replace(/\s+から$/, "")
      .replace(/\s+부터$/, "")
      .replace(/\s+起$/, "");
    return cleaned.match(currencyPattern)?.[0] || cleaned;
  }
  const offer = product.offers || {};
  const value = Number(offer.price || offer.lowPrice || 0).toLocaleString("en-US");
  return locale === "en" ? `US$${value}` : locale === "zh" ? `RMB ${value}` : `${offer.priceCurrency} ${value}`;
}

function groupDisplay(locale) {
  if (locale === "zh") return "2 人起 · 建議 2–6 人";
  if (locale === "ja") return "2名様から · おすすめは2–6名様";
  if (locale === "ko") return "2인부터 · 권장 2–6인";
  if (locale === "th") return "เริ่มที่ 2 คน · เหมาะที่สุด 2–6 คน";
  return "From 2 travellers · best for 2–6";
}

function dayLabel(locale, day) {
  if (locale === "zh") return `第 ${day} 天`;
  if (locale === "ja") return `${day}日目`;
  if (locale === "ko") return `${day}일 차`;
  if (locale === "th") return `วันที่ ${day}`;
  return `Day ${day}`;
}

function replaceTravelAgencySchema(html, offers, locale) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  for (const block of blocks) {
    let schema;
    try { schema = JSON.parse(block[1]); } catch { continue; }
    if (schema?.["@type"] !== "TravelAgency") continue;
    schema.areaServed = [...new Set([...(schema.areaServed || []), "Inner Mongolia"] )];
    schema.hasOfferCatalog = {
      "@type": "OfferCatalog",
      name: locale === "zh" ? "中國私人路線起價" : "Private China route starting offers",
      itemListElement: offers,
    };
    return html.replace(block[0], `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`);
  }
  return html;
}

for (const target of targets) {
  const cards = [];
  const offers = [];
  for (const destination of destinations) {
    const routeHtml = await fs.readFile(path.join(root, routeFile(destination, target.routeLocale)), "utf8");
    const schema = extractProduct(routeHtml);
    const duration = property(schema, /Duration|天數|日数|기간|ระยะเวลา/i);
    const route = property(schema, /Route|路線|ルート|경로|เส้นทาง/i);
    const group = groupDisplay(target.locale);
    const dayTitles = [...routeHtml.matchAll(/class="route-day-copy"[^>]*>\s*<h3>([\s\S]*?)<\/h3>/g)].map((match) => cleanText(match[1]));
    const sampleIndexes = [...new Set([0, Math.floor((dayTitles.length - 1) / 2), dayTitles.length - 1])];
    const href = routeHref(destination, target.routeLocale);
    const price = displayPrice(routeHtml, schema, target.locale);
    const miniDays = sampleIndexes.map((index) => `<li>${dayLabel(target.locale, index + 1)} · ${dayTitles[index]}</li>`).join("");
    cards.push(`<article class="product-route-card">
        <a class="product-route-image" href="${href}"><img loading="lazy" src="${images[destination]}" alt="${destinationNames[target.locale][destination]}"><span>${duration}</span></a>
        <div class="product-route-copy"><p class="eyebrow">${destinationNames[target.locale][destination]}</p><h3>${schema.name}</h3>
          <dl class="product-route-meta"><div><dt>${labels[target.locale].from}</dt><dd>${price}</dd></div><div><dt>${labels[target.locale].group}</dt><dd>${group}</dd></div><div><dt>${labels[target.locale].route}</dt><dd>${route}</dd></div></dl>
          <ol class="mini-days">${miniDays}</ol><a class="text-link" href="${href}#day-plan">${labels[target.locale].view}</a>
        </div></article>`);
    const offeredPrice = price.replace(/[^0-9]/g, "");
    offers.push({
      "@type": "Offer",
      name: schema.name,
      url: schema.url,
      priceCurrency: schema.offers?.priceCurrency,
      price: String(offeredPrice),
      availability: "https://schema.org/InStock",
      itemOffered: { "@type": "TouristTrip", name: schema.name, itinerary: route, touristType: "International travellers beyond first-city China trips" },
    });
  }

  const l = labels[target.locale];
  const titleClass = target.locale === "en" || target.locale === "th" ? "" : ' class="cjk-title"';
  const section = `<section class="section product-routes-band" id="places"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${l.eyebrow}</p><h2${titleClass}><span class="title-line">${l.title[0]}</span><span class="title-line">${l.title[1]}</span></h2></div><p>${l.intro}</p></div><div class="product-route-grid">${cards.join("")}</div></div></section>`;
  const sectionPattern = /<section class="section product-routes-band" id="places">[\s\S]*?<\/section>/;
  let home = await fs.readFile(path.join(root, target.file), "utf8");
  if (!sectionPattern.test(home)) throw new Error(`Product route section missing: ${target.file}`);
  home = home.replace(sectionPattern, section);
  home = replaceTravelAgencySchema(home, offers, target.locale);
  await fs.writeFile(path.join(root, target.file), home);

  if (target.sync) {
    const synced = home.replace(
      new RegExp(`name="source_path" value="/${target.locale}\\.html"`, "g"),
      `name="source_path" value="/${target.locale}/"`,
    );
    await fs.writeFile(path.join(root, target.sync), synced);
  }
  console.log(`updated ${target.file}${target.sync ? ` and ${target.sync}` : ""}`);
}

for (const file of ["zh/stories/index.html", "zh/dunhuang/index.html", "zh/sanya/index.html"]) {
  const abs = path.join(root, file);
  let html = await fs.readFile(abs, "utf8");
  html = html
    .replaceAll("沙色沉下去", "沙色入夜")
    .replaceAll("石窟仍亮", "石窟有光")
    .replaceAll("海風把中國", "海風輕起")
    .replaceAll("放得更輕", "島嶼入夏");
  await fs.writeFile(abs, html);
}

console.log("Synchronized all localized home route products.");
