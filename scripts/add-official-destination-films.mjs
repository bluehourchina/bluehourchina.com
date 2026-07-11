import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const homeFiles = [
  "index.html", "en/index.html",
  "zh.html", "zh/index.html",
  "ja.html", "ja/index.html",
  "ko.html", "ko/index.html",
  "th.html", "th/index.html",
  "ru.html", "ru/index.html",
];

const copy = {
  en: {
    eyebrow: "Official destination films",
    title: ["See the landscape", "before choosing"],
    intro: "Official films from Xinjiang, Dunhuang and Heilongjiang. Feel the scale, light and season before opening the day-by-day route.",
    cards: [
      ["Xinjiang in motion", "Lakes, grassland and the long road through Ili.", "Xinjiang is a Wonderful Place"],
      ["Dunhuang through art", "A quieter way into Mogao's history and visual language.", "Dunhuang Art Museum"],
      ["Winter in Heilongjiang", "Harbin, forest and snow as a real seasonal journey.", "Discover Heilongjiang"],
    ],
    source: "Watch the official source",
  },
  zh: {
    eyebrow: "目的地官方影像",
    title: ["先看風景", "再選路線"],
    intro: "新疆、敦煌與黑龍江的官方目的地影像。先感受尺度、光線與季節，再打開每日路線。",
    cards: [
      ["新疆的遼闊與長路", "湖泊、草原與伊犁一路展開的風景。", "新疆是個好地方"],
      ["從藝術走進敦煌", "先理解莫高窟的歷史與視覺，再安排實際參訪。", "敦煌藝術館"],
      ["黑龍江的冬日路線", "哈爾濱、森林與雪景，放進一條可真正完成的冬季旅程。", "暢賞黑龍江"],
    ],
    source: "前往官方原片",
  },
  ja: {
    eyebrow: "目的地の公式映像",
    title: ["景色を見てから", "旅程を選ぶ"],
    intro: "新疆、敦煌、黒竜江の公式映像です。日程表を開く前に、風景の大きさ、光、季節を感じてください。",
    cards: [
      ["動きのある新疆", "湖、草原、イリへ続く長い道。", "新疆是个好地方"],
      ["芸術から見る敦煌", "莫高窟の歴史と視覚を静かに知る入口。", "敦煌艺术馆官方"],
      ["黒竜江の冬", "ハルビン、森、雪を一つの季節の旅へ。", "畅赏黑龙江"],
    ],
    source: "公式映像を見る",
  },
  ko: {
    eyebrow: "목적지 공식 영상",
    title: ["풍경을 먼저 보고", "동선을 고르세요"],
    intro: "신장, 둔황, 헤이룽장의 공식 영상입니다. 일정표를 열기 전에 풍경의 크기와 빛, 계절을 먼저 느껴보세요.",
    cards: [
      ["움직이는 신장", "호수와 초원, 이리로 이어지는 긴 길.", "新疆是个好地方"],
      ["예술로 만나는 둔황", "막고굴의 역사와 시각 언어를 차분히 이해하는 시작.", "敦煌艺术馆官方"],
      ["헤이룽장의 겨울", "하얼빈과 숲, 눈을 하나의 계절 여행으로.", "畅赏黑龙江"],
    ],
    source: "공식 영상 보기",
  },
  th: {
    eyebrow: "วิดีโอทางการของจุดหมาย",
    title: ["เห็นภูมิประเทศก่อน", "แล้วค่อยเลือกเส้นทาง"],
    intro: "วิดีโอทางการจากซินเจียง ตุนหวง และเฮยหลงเจียง ชมขนาดของภูมิประเทศ แสง และฤดูกาลก่อนเปิดแผนรายวัน",
    cards: [
      ["ซินเจียงที่เคลื่อนไหว", "ทะเลสาบ ทุ่งหญ้า และถนนยาวสู่อีหลี", "新疆是个好地方"],
      ["มองตุนหวงผ่านศิลปะ", "ทำความเข้าใจประวัติศาสตร์และภาษาภาพของถ้ำโม่เกาก่อนเดินทางจริง", "敦煌艺术馆官方"],
      ["ฤดูหนาวในเฮยหลงเจียง", "ฮาร์บิน ป่า และหิมะในเส้นทางฤดูหนาวที่เดินทางได้จริง", "畅赏黑龙江"],
    ],
    source: "ชมวิดีโอต้นฉบับ",
  },
  ru: {
    eyebrow: "Официальные фильмы направлений",
    title: ["Сначала увидеть место", "потом выбрать маршрут"],
    intro: "Официальные фильмы Синьцзяна, Дуньхуана и Хэйлунцзяна. Сначала почувствуйте масштаб, свет и сезон, затем откройте маршрут по дням.",
    cards: [
      ["Синьцзян в движении", "Озёра, степь и длинная дорога через Или.", "新疆是个好地方"],
      ["Дуньхуан через искусство", "Спокойный вход в историю и визуальный язык Могао.", "敦煌艺术馆官方"],
      ["Зима в Хэйлунцзяне", "Харбин, лес и снег как реальное сезонное путешествие.", "畅赏黑龙江"],
    ],
    source: "Смотреть официальный источник",
  },
};

const films = [
  ["BV1aJ41117Qa", "https://www.bilibili.com/video/BV1aJ41117Qa/"],
  ["BV1sT4y1k74Z", "https://www.bilibili.com/video/BV1sT4y1k74Z/"],
  ["BV1BW4y1J7WB", "https://www.bilibili.com/video/BV1BW4y1J7WB/"],
];

const oldHero = '<div class="hero-media" aria-hidden="true"><div class="hero-scene lake"></div><div class="hero-scene yunnan"></div><div class="hero-scene sanya"></div></div>';
const realHero = '<div class="hero-media" aria-hidden="true"><div class="hero-scene scene-yunnan"></div><div class="hero-scene scene-xinjiang"></div><div class="hero-scene scene-dunhuang"></div><div class="hero-scene scene-mongolia"></div><div class="hero-scene scene-sanya"></div><div class="hero-scene scene-northeast"></div></div>';

function localeFor(file) {
  if (file === "zh.html" || file.startsWith("zh/")) return "zh";
  if (file === "ja.html" || file.startsWith("ja/")) return "ja";
  if (file === "ko.html" || file.startsWith("ko/")) return "ko";
  if (file === "th.html" || file.startsWith("th/")) return "th";
  if (file === "ru.html" || file.startsWith("ru/")) return "ru";
  return "en";
}

function sectionMarkup(locale) {
  const text = copy[locale];
  const cards = films.map(([bvid, url], index) => {
    const [title, body, account] = text.cards[index];
    return `<article class="official-film"><div class="official-film-frame"><iframe loading="lazy" src="https://player.bilibili.com/player.html?bvid=${bvid}&amp;page=1&amp;high_quality=1&amp;danmaku=0&amp;autoplay=0" title="${title}" allow="fullscreen; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div><div class="official-film-copy"><p class="eyebrow">${account}</p><h3>${title}</h3><p>${body}</p><a href="${url}" target="_blank" rel="noopener noreferrer">${text.source}</a></div></article>`;
  }).join("");
  const titleClass = locale === "zh" ? ' class="cjk-title"' : "";
  const title = locale === "zh"
    ? `<span class="title-line">${text.title[0]}</span><span class="title-line">${text.title[1]}</span>`
    : `${text.title[0]}<br>${text.title[1]}`;
  return `\n  <!-- official-destination-films-start -->\n  <section class="section official-films-band" aria-labelledby="official-films-title"><div class="wrap"><div class="official-films-head"><div><p class="eyebrow">${text.eyebrow}</p><h2 id="official-films-title"${titleClass}>${title}</h2></div><p>${text.intro}</p></div><div class="official-film-grid">${cards}</div></div></section>\n  <!-- official-destination-films-end -->`;
}

function insertAfterProductRoutes(html, markup) {
  const classIndex = html.indexOf('class="section product-routes-band"');
  if (classIndex < 0) throw new Error("product-routes-band not found");
  const start = html.lastIndexOf("<section", classIndex);
  const tag = /<\/?section\b[^>]*>/g;
  tag.lastIndex = start;
  let depth = 0;
  let match;
  while ((match = tag.exec(html))) {
    if (match[0].startsWith("</")) depth -= 1;
    else depth += 1;
    if (depth === 0) return `${html.slice(0, tag.lastIndex)}${markup}${html.slice(tag.lastIndex)}`;
  }
  throw new Error("product-routes-band closing tag not found");
}

let updated = 0;
for (const file of homeFiles) {
  const absolute = path.join(root, file);
  let html = await fs.readFile(absolute, "utf8");
  const before = html;
  html = html.replace(oldHero, realHero);
  if (!html.includes("official-destination-films-start")) {
    html = insertAfterProductRoutes(html, sectionMarkup(localeFor(file)));
  }
  if (html !== before) {
    await fs.writeFile(absolute, html);
    updated += 1;
  }
}

console.log(`Added real-photo hero motion and official destination films to ${updated} home pages.`);
