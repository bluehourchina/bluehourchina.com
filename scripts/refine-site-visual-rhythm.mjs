import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const homeFiles = [
  "index.html",
  "en.html",
  "en/index.html",
  "zh.html",
  "zh/index.html",
  "ja.html",
  "ja/index.html",
  "ko.html",
  "ko/index.html",
  "th.html",
  "th/index.html",
  "ru.html",
  "ru/index.html",
];

const serviceImages = [
  "/assets/real-xinjiang/guozigou-bridge-cc-by.jpg",
  "/assets/real-sanya/sanya-edition-02-cc-by.jpg",
  "/assets/real-hainan/haikou-old-town-cc-by-sa.jpg",
  "/assets/gowind-profile-conversion/night-route-desk.png",
];

const guideImages = [
  "/assets/editorial-prep/mobile-payment-card-pexels-7621358.jpg",
  "/assets/editorial-prep/travel-phone-map-pexels-7321954.jpg",
  "/assets/editorial-prep/china-airport-arrival-pexels-35421850.jpg",
];

const routeFiles = {
  yunnan: ["yunnan.html", "en/yunnan/index.html", "zh/yunnan/index.html", "ja/yunnan/index.html", "ko/yunnan/index.html", "th/yunnan/index.html", "ru/yunnan/index.html"],
  xinjiang: ["xinjiang.html", "en/xinjiang/index.html", "zh/xinjiang/index.html", "ja/xinjiang/index.html", "ko/xinjiang/index.html", "th/xinjiang/index.html", "ru/xinjiang/index.html"],
  dunhuang: ["dunhuang.html", "en/dunhuang/index.html", "zh/dunhuang/index.html", "ja/dunhuang/index.html", "ko/dunhuang/index.html", "th/dunhuang/index.html", "ru/dunhuang/index.html"],
  sanya: ["sanya.html", "en/sanya/index.html", "zh/sanya/index.html", "ja/sanya/index.html", "ko/sanya/index.html", "th/sanya/index.html", "ru/sanya/index.html"],
  northeast: ["northeast.html", "en/northeast/index.html", "zh/northeast/index.html", "ja/northeast/index.html", "ko/northeast/index.html", "th/northeast/index.html", "ru/northeast/index.html"],
  "inner-mongolia": ["inner-mongolia.html", "en/inner-mongolia/index.html", "zh/inner-mongolia/index.html", "ja/inner-mongolia/index.html", "ko/inner-mongolia/index.html", "th/inner-mongolia/index.html", "ru/inner-mongolia/index.html"],
};

const routeAssets = {
  yunnan: {
    hero: "/assets/ai/bluehour-yunnan-luxury-dali-terrace.jpg",
    standard: "/assets/wechat-reference-20260709/wechat-yunnan-dali-shuanglang-sun-palace-07.jpg",
    day: "/assets/real-yunnan/erhai-cangshan-editorial-web.jpg",
    extension: [
      "/assets/wechat-reference-20260709/wechat-yunnan-mangshi-culture-collage-13.png",
      "/assets/wechat-reference-20260709/wechat-yunnan-tengchong-vlog-cover-14.png",
      "/assets/wechat-reference-20260709/wechat-yunnan-temple-pagoda-collage-12.png",
      "/assets/real-yunnan/shaxi-old-town-web.jpg",
    ],
    dayLabel: { en: "Erhai Lake and Cangshan on the Yunnan route", zh: "雲南路線中的洱海與蒼山", ja: "雲南ルートの洱海と蒼山", ko: "윈난 루트의 얼하이와 창산", th: "ทะเลสาบเอ๋อร์ไห่และภูเขาชางซานในเส้นทางยูนนาน", ru: "озеро Эрхай и горы Цаншань на маршруте по Юньнани" },
  },
  xinjiang: {
    hero: "/assets/ai/bluehour-xinjiang-luxury-lake-v1.jpg",
    standard: "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg",
    day: "/assets/real-xinjiang/nalati-town-cc-by-sa.jpg",
    dayLabel: { en: "Nalati town on the Xinjiang route", zh: "新疆路線中的那拉提小鎮", ja: "新疆ルートのナラティの町", ko: "신장 루트의 나라티 마을", th: "เมืองน่าลาถีในเส้นทางซินเจียง", ru: "посёлок Налати на маршруте по Синьцзяну" },
  },
  dunhuang: {
    hero: "/assets/ai/bluehour-dunhuang-luxury-desert-v1.jpg",
    standard: "/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg",
    day: "/assets/real-dunhuang/yumen-pass-cc-by-sa.jpg",
    dayLabel: { en: "Yumen Pass on the Qinghai-Gansu Grand Loop", zh: "青甘大環線中的玉門關", ja: "青海・甘粛大環状線の玉門関", ko: "칭하이-간쑤 대순환의 위먼관", th: "ด่านอวี้เหมินบนวงแหวนชิงไห่–กานซู่", ru: "застава Юймэнь на Большом кольце Цинхай — Ганьсу" },
  },
  sanya: {
    hero: "/assets/ai/bluehour-sanya-luxury-coast-v1.jpg",
    standard: "/assets/real-sanya/sanya-edition-02-cc-by.jpg",
    day: "/assets/real-sanya/yalong-bay-cc0.jpg",
    dayLabel: { en: "Yalong Bay on the Hainan route", zh: "海南路線中的三亞亞龍灣", ja: "海南島ルートの三亜・亜龍湾", ko: "하이난 루트의 싼야 야룽만", th: "อ่าวย่าหลงในเส้นทางไหหลำ", ru: "бухта Ялунвань на маршруте по Хайнаню" },
  },
  northeast: {
    hero: "/assets/ai/bluehour-northeast-winter-lodge-v1.jpg",
    standard: "/assets/real-northeast/china-snow-town-cc-by.jpg",
    day: "/assets/real-northeast/ice-snow-world-cc0.jpg",
    dayLabel: { en: "Harbin Ice and Snow World", zh: "哈爾濱冰雪大世界", ja: "ハルビン氷雪大世界", ko: "하얼빈 빙설대세계", th: "โลกน้ำแข็งและหิมะฮาร์บิน", ru: "Мир льда и снега в Харбине" },
  },
  "inner-mongolia": {
    hero: "/assets/ai/bluehour-inner-mongolia-grassland-v1.jpg",
    standard: "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg",
    day: "/assets/real-inner-mongolia/kubuqi-desert-cc-by-sa.jpg",
    dayLabel: { en: "Kubuqi Desert on the Inner Mongolia route", zh: "內蒙古路線中的庫布齊沙漠", ja: "内モンゴルルートのクブチ砂漠", ko: "내몽골 루트의 쿠부치 사막", th: "ทะเลทรายคูปู้ฉีในเส้นทางมองโกเลียใน", ru: "пустыня Кубуци на маршруте по Внутренней Монголии" },
  },
};

function withBodyClass(html, className) {
  if (new RegExp(`<body\\b[^>]*class=["'][^"']*\\b${className}\\b`, "i").test(html)) return html;
  if (/<body\b[^>]*class=["']/i.test(html)) {
    return html.replace(/(<body\b[^>]*class=["'])([^"']*)/i, `$1$2 ${className}`);
  }
  return html.replace(/<body\b/i, `<body class="${className}"`);
}

function addCardMedia(html, sectionPattern, cardClass, mediaClass, images) {
  return html.replace(sectionPattern, (section) => {
    if (section.includes(mediaClass)) return section;
    let index = 0;
    return section.replace(new RegExp(`<article class="${cardClass}">`, "g"), (tag) => {
      const src = images[index++];
      if (!src) return tag;
      return `${tag}<figure class="${mediaClass}" aria-hidden="true"><img loading="lazy" src="${src}" alt=""></figure>`;
    });
  });
}

function removeRedundantRouteSections(html) {
  return html
    .replace(/\s*<section class="section">\s*<div class="wrap split">[\s\S]*?<\/section>/, "")
    .replace(/\s*<section class="section cultural-band">[\s\S]*?<\/section>/, "")
    .replace(/\s*<section class="section content-note-band" id="planning-checks">[\s\S]*?<\/section>/, "")
    .replace(/\s*<section class="section care-band" id="care">[\s\S]*?<\/section>/, "")
    .replace(/\s*<section class="section care-band">[\s\S]*?<\/section>/, "")
    .replace(/\s*<section class="section service-band" id="care">[\s\S]*?<\/section>/, "")
    .replace(/\s*<section class="section conversion-band" id="review">[\s\S]*?<\/section>/, "");
}

function setHeroImage(html, src) {
  if (/--hero-image\s*:\s*url\([^)]*\)/i.test(html)) {
    html = html.replace(/--hero-image\s*:\s*url\([^)]*\)/i, `--hero-image:url('${src}')`);
  }
  return html.replace(/;?\s*--cta-image\s*:\s*url\([^)]*\)/i, "");
}

function pageLanguage(html) {
  return html.match(/<html\b[^>]*lang=["']([^"']+)/i)?.[1]?.slice(0, 2) || "en";
}

function setRouteImages(html, assets) {
  html = html.replace(
    /(<div class="route-card"[^>]*>[\s\S]*?<div class="route-image"><img\b[^>]*?src=")[^"]+/,
    `$1${assets.standard}`,
  );
  html = html.replace(
    /(<aside class="route-visual-panel"[^>]*>[\s\S]*?<figure>\s*<img\b[^>]*?src=")[^"]+/,
    `$1${assets.day}`,
  );
  const label = assets.dayLabel?.[pageLanguage(html)] || assets.dayLabel?.en;
  if (label) {
    html = html.replace(/<aside class="route-visual-panel"[^>]*>[\s\S]*?<\/aside>/, (aside) => aside
      .replace(/(<figure>\s*<img\b[^>]*?)\s+alt="[^"]*"/, `$1 alt="${label}"`)
      .replace(/<figcaption>[\s\S]*?<\/figcaption>/, `<figcaption>${label}</figcaption>`));
  }
  return html;
}

function removeGalleryCards(html, sources) {
  return html.replace(
    /<figure class="material-card(?: [^"]*)?">[\s\S]*?<\/figure>/g,
    (figure) => sources.some((src) => figure.includes(`src="${src}"`)) ? "" : figure,
  );
}

function removeMaterialGallery(html) {
  return html
    .replace(/\s*<!-- real-scenes-start -->[\s\S]*?<!-- real-scenes-end -->/, "")
    .replace(/\s*<!-- yunnan-material-notes-start -->[\s\S]*?<!-- yunnan-material-notes-end -->/, "")
    .replace(/\s*<section class="section material-notes-band"[^>]*>[\s\S]*?<\/section>/, "");
}

function replaceExtensionImages(html, images) {
  return html.replace(/<section class="route-extension">[\s\S]*?<\/section>/, (section) => {
    let index = 0;
    return section.replace(/(<img\b[^>]*?src=")[^"]+/g, (match, prefix) => {
      const src = images[index++];
      return src ? `${prefix}${src}` : match;
    });
  });
}

function addBalancedChineseTerms(html) {
  const replacements = [
    ["2 人起私人成行 · 公開起價以 6 人同行計", ["2 人起私人成行", "6 人同行參考起價"]],
    ["公開起價以 6 人同行計 · 2 人起私人成行", ["2 人起私人成行", "6 人同行參考起價"]],
    ["2 人起 · 建議 2-6 人", ["2 人起私人成行", "建議 2–6 人同行"]],
  ];
  for (const [text, lines] of replacements) {
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    html = html.replace(
      new RegExp(`>${escaped}<`, "g"),
      `><span class="term-line">${lines[0]}</span><span class="term-line">${lines[1]}</span><`,
    );
  }
  return html;
}

for (const file of homeFiles) {
  const absolute = path.join(root, file);
  try {
    let html = await fs.readFile(absolute, "utf8");
    html = addCardMedia(
      html,
      /<section class="section service-band" id="care">[\s\S]*?<\/section>/,
      "promise",
      "service-card-media",
      serviceImages,
    );
    html = addCardMedia(
      html,
      /<section class="section search-intent-band compact-guides" id="stories">[\s\S]*?<\/section>/,
      "search-intent-card",
      "guide-card-media",
      guideImages,
    );
    html = addBalancedChineseTerms(html);
    await fs.writeFile(absolute, html);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

for (const [slug, files] of Object.entries(routeFiles)) {
  const assets = routeAssets[slug];
  for (const file of files) {
    const absolute = path.join(root, file);
    try {
      let html = await fs.readFile(absolute, "utf8");
      const hasVisualRoute = html.includes("visual-route-overview");
      html = withBodyClass(html, "destination-route-page");
      html = removeRedundantRouteSections(html);
      html = setHeroImage(html, assets.hero);
      html = setRouteImages(html, assets);
      html = addBalancedChineseTerms(html);

      if (slug === "yunnan" && hasVisualRoute) {
        html = replaceExtensionImages(html, assets.extension);
        html = removeMaterialGallery(html);
      } else if (slug === "xinjiang" && hasVisualRoute) {
        html = removeMaterialGallery(html);
      } else if (["xinjiang", "northeast", "inner-mongolia"].includes(slug)) {
        html = removeGalleryCards(html, [assets.standard, assets.day]);
      }

      await fs.writeFile(absolute, html);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
}

for (const file of ["yunnan-grand-loop/index.html", "zh/yunnan-grand-loop/index.html"]) {
  const absolute = path.join(root, file);
  let html = await fs.readFile(absolute, "utf8");
  html = withBodyClass(html, "destination-route-page");
  html = setHeroImage(html, routeAssets.yunnan.hero);
  html = html.replace(
    /(<section class="route-extension">[\s\S]*?<div class="route-extension-image"><img\b[^>]*?src=")[^"]+/,
    "$1/assets/wechat-reference-20260709/wechat-yunnan-mangshi-culture-collage-13.png",
  );
  const extensionImages = [
    "/assets/wechat-reference-20260709/wechat-yunnan-yunshanping-02.jpg",
    "/assets/wechat-reference-20260709/wechat-yunnan-dali-shuanglang-sun-palace-07.jpg",
    "/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg",
  ];
  html = html.replace(/<div class="route-extension-gallery">[\s\S]*?<\/div>/, (gallery) => {
    let index = 0;
    return gallery.replace(/(<img\b[^>]*?src=")[^"]+/g, (match, prefix) => {
      const src = extensionImages[index++];
      return src ? `${prefix}${src}` : match;
    });
  });
  await fs.writeFile(absolute, html);
}

{
  const absolute = path.join(root, "ru/yunnan/index.html");
  let html = await fs.readFile(absolute, "utf8");
  const image = "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg";
  if (!html.includes(image)) {
    const card = `<figure class="material-card"><img loading="lazy" src="${image}" alt="День 4 · Сичжоу"><figcaption><b>День 4 · Сичжоу</b><span>Старый город остаётся спокойной главой дня, а не быстрой фотостопкой.</span></figcaption></figure>`;
    html = html.replace(/<section class="section material-notes-band"[^>]*>[\s\S]*?<\/section>/, (section) => section.replace("</div></div></section>", `${card}</div></div></section>`));
    await fs.writeFile(absolute, html);
  }
}

console.log("Refined home imagery, destination-page rhythm, route photos and Chinese term wrapping.");
