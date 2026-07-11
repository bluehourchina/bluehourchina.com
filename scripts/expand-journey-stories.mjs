import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const storyFiles = {
  en: ["stories.html", "en/stories/index.html"],
  zh: ["zh/stories/index.html"],
  ja: ["ja/stories/index.html"],
  ko: ["ko/stories/index.html"],
  th: ["th/stories/index.html"],
};

const copy = {
  en: {
    eyebrow: "Journey journals",
    title: "What a private week can feel like",
    intro: "Editorial journey scenarios based on the sample routes shown on this site. They are not presented as customer testimonials.",
    link: "See this route",
    stories: [
      ["Yunnan · 8 days", "Eight days remembered in small details", "The trip begins softly in Kunming, then gives Dali enough time for a lake sunrise, a village craft and an afternoon with nowhere else to be. Lijiang arrives later, when the group is ready for one mountain day instead of three rushed viewpoints.", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg"],
      ["Xinjiang · 9 days", "The road was never treated as lost time", "Between Urumqi and the Ili valley, the long road becomes part of the memory: the first blue of Sayram Lake, a quiet night in Yining and two unhurried days near Nalati. Distance remains real, but it no longer feels careless.", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg"],
      ["Hainan · 7 days", "An island journey beyond one resort", "The family lands in Haikou, follows the east coast through local streets and Wanning, then finishes with two settled nights in Sanya. The children get the sea; the adults also remember the road, the table and the places between hotels.", "sanya", "/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg"],
    ],
  },
  zh: {
    eyebrow: "旅程紀行",
    title: "旅程結束後留下的是什麼",
    intro: "以下為依標準路線撰寫的旅程紀行，讓你先感受沿途節奏；內容不是客戶評價。",
    link: "看這條路線",
    stories: [
      ["雲南 · 8 天", "八天之後 記住的是那些小事", "旅程從昆明輕輕落地，大理留給湖邊日出、喜洲手作與一個沒有下一站的午後。到了麗江，大家已經準備好用一整天看雪山，而不是匆忙收集三個觀景台。", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg"],
      ["新疆 · 9 天", "最珍貴的是 路沒有被趕過", "從烏魯木齊走向伊犁，長路不再只是代價。賽里木湖第一眼的藍、伊寧安靜的一晚，以及那拉提連續兩天的草原，都因為沒有被催促而留下來。", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg"],
      ["海南 · 7 天", "一家人的海島 不只住在三亞", "從海口落地，沿東海岸經過老街、瓊海與萬寧，最後在三亞連住兩晚。孩子記得海，大人也記得島上的路、餐桌，以及飯店之外那些有地方感的片刻。", "sanya", "/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg"],
    ],
  },
  ja: {
    eyebrow: "旅の記録",
    title: "一週間の個人旅行が残すもの",
    intro: "掲載中のモデルルートをもとにした旅の情景です。実在のお客様の声として装ったものではありません。",
    link: "この旅程を見る",
    stories: [
      ["雲南 · 8日間", "八日後に残るのは 小さな場面", "昆明で静かに旅を始め、大理では湖の朝、喜洲の手仕事、次を急がない午後を守ります。麗江に着く頃には、三つの展望台を急ぐより、一日を雪山に渡す心の余白が生まれています。", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg"],
      ["新疆 · 9日間", "長い道を 急がせない旅", "ウルムチからイリへ向かう距離も旅の記憶になります。サイラム湖の青、伊寧の静かな夜、ナラティでの二日間。遠さは消えませんが、雑には扱われません。", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg"],
      ["海南島 · 7日間", "一つのリゾートで終わらない島旅", "海口から東海岸を南へ進み、万寧を経て三亜で二連泊。子どもは海を、大人は島の道と食卓、ホテルの間にある土地の時間を覚えています。", "sanya", "/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg"],
    ],
  },
  ko: {
    eyebrow: "여행 기록",
    title: "개인 여행 한 주가 남기는 감각",
    intro: "사이트의 표준 루트를 바탕으로 쓴 여행 상황입니다. 실제 고객 후기인 것처럼 꾸미지 않았습니다.",
    link: "이 일정 보기",
    stories: [
      ["윈난 · 8일", "여덟 날 뒤에 남는 작은 장면", "쿤밍에서 천천히 시작하고 다리에서는 호수의 아침, 시저우의 손작업, 다음 장소를 서두르지 않는 오후를 지킵니다. 리장에서는 여러 전망대를 모으기보다 하루를 설산에 온전히 씁니다.", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg"],
      ["신장 · 9일", "긴 길을 재촉하지 않았던 여행", "우루무치에서 이리로 가는 거리는 버리는 시간이 아닙니다. 사이람호의 첫 푸른빛, 이닝의 조용한 밤, 나라티의 이틀이 서두르지 않은 기억으로 남습니다.", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg"],
      ["하이난 · 7일", "한 리조트로 끝나지 않는 섬 여행", "하이커우에서 동해안을 따라 완닝을 지나 싼야에서 이틀을 머뭅니다. 아이들은 바다를, 어른들은 호텔 사이의 길과 식탁, 섬의 생활을 함께 기억합니다.", "sanya", "/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg"],
    ],
  },
  th: {
    eyebrow: "บันทึกการเดินทาง",
    title: "หนึ่งสัปดาห์แบบส่วนตัวให้ความรู้สึกอย่างไร",
    intro: "เรื่องราวจำลองจากเส้นทางตัวอย่างบนเว็บไซต์ ไม่ได้นำเสนอว่าเป็นคำรีวิวจากลูกค้าจริง",
    link: "ดูเส้นทางนี้",
    stories: [
      ["ยูนนาน · 8 วัน", "สิ่งที่จำได้คือช่วงเวลาเล็ก ๆ", "เริ่มอย่างนุ่มนวลที่คุนหมิง ให้ต้าหลี่มีเวลาแก่เช้าริมทะเลสาบ งานฝีมือที่ซีโจว และบ่ายที่ไม่ต้องรีบไปไหน เมื่อถึงลี่เจียง ทุกคนพร้อมให้เวลาหนึ่งวันเต็มแก่ภูเขาหิมะ", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg"],
      ["ซินเจียง · 9 วัน", "ถนนยาวไม่ใช่เวลาที่เสียไป", "ระยะทางจากอุรุมชีสู่อีหลีกลายเป็นส่วนหนึ่งของความทรงจำ สีฟ้าครั้งแรกของทะเลสาบไซหลี่มู่ คืนสงบในอีหนิง และสองวันที่น่าลาถีไม่ถูกเร่งให้ผ่านไป", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg"],
      ["ไหหลำ · 7 วัน", "ทริปเกาะที่ไม่จบในรีสอร์ตเดียว", "เริ่มที่ไหโข่ว เดินทางตามชายฝั่งตะวันออกผ่านว่านหนิง และพักสองคืนที่ซานย่า เด็ก ๆ ได้ทะเล ส่วนผู้ใหญ่ยังจำถนน โต๊ะอาหาร และชีวิตระหว่างโรงแรม", "sanya", "/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg"],
    ],
  },
  ru: {
    eyebrow: "Дневники маршрутов",
    title: "Каким может быть частное путешествие",
    intro: "Это редакционные сценарии на основе опубликованных маршрутов, а не вымышленные отзывы реальных клиентов.",
    link: "Посмотреть маршрут",
    stories: [
      ["Юньнань · 8 дней", "После восьми дней остаются детали", "Куньмин мягко открывает поездку. В Дали остаются рассвет у озера, ремесло в Сичжоу и свободный вечер. К Лицзяну группа готова отдать целый день горе, а не собирать несколько смотровых площадок.", "yunnan", "/assets/wechat-reference-20260709/wechat-yunnan-dali-xizhou-ancient-town-09.jpg"],
      ["Синьцзян · 9 дней", "Дорогу не превращают в потерянное время", "Между Урумчи и долиной Или запоминаются первый синий свет Сайрам-Нура, спокойная ночь в Инине и два неторопливых дня у Налати. Расстояние остаётся честным, но не становится небрежным.", "xinjiang", "/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg"],
      ["Хайнань · 7 дней", "Островное путешествие шире одного курорта", "Маршрут начинается в Хайкоу, идёт вдоль восточного берега через Ваньнин и заканчивается двумя ночами в Санье. Дети запоминают море, взрослые — дорогу, стол и жизнь между отелями.", "sanya", "/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg"],
    ],
  },
};

const localePaths = {
  en: { home: "/", stories: "/stories.html", interest: "/route-note/", route: (slug) => `/${slug}.html` },
  zh: { home: "/zh.html", stories: "/zh/stories/", interest: "/zh/interest/", route: (slug) => `/zh/${slug}/` },
  ja: { home: "/ja.html", stories: "/ja/stories/", interest: "/ja/interest/", route: (slug) => `/ja/${slug}/` },
  ko: { home: "/ko.html", stories: "/ko/stories/", interest: "/ko/interest/", route: (slug) => `/ko/${slug}/` },
  th: { home: "/th.html", stories: "/th/stories/", interest: "/th/interest/", route: (slug) => `/th/${slug}/` },
  ru: { home: "/ru.html", stories: "/ru/stories/", interest: "/ru/interest/", route: (slug) => `/ru/${slug}/` },
};

function storySection(lang) {
  const locale = copy[lang];
  const links = localePaths[lang];
  const cards = locale.stories.map(([label, title, body, slug, image]) => `
      <article class="journey-journal-card">
        <figure><img loading="lazy" src="${image}" alt="${label}"></figure>
        <div class="journey-journal-copy"><p class="eyebrow">${label}</p><h3>${title}</h3><p>${body}</p><a href="${links.route(slug)}">${locale.link}</a></div>
      </article>`).join("");
  return `<!-- journey-journals-start -->
    <section class="section journey-journals-band" id="journey-journals"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${locale.eyebrow}</p><h2>${locale.title}</h2></div><p>${locale.intro}</p></div><div class="journey-journal-grid">${cards}</div></div></section>
    <!-- journey-journals-end -->`;
}

for (const [lang, files] of Object.entries(storyFiles)) {
  for (const file of files) {
    const absolute = path.join(root, file);
    let html = await fs.readFile(absolute, "utf8");
    const section = storySection(lang);
    if (/<!-- journey-journals-start -->[\s\S]*?<!-- journey-journals-end -->/.test(html)) {
      html = html.replace(/<!-- journey-journals-start -->[\s\S]*?<!-- journey-journals-end -->/, section);
    } else {
      html = html.replace(/\s*<section class="next">/, `\n    ${section}\n    <section class="next">`);
    }
    if (lang === "zh") {
      html = html.replaceAll(
        "每個目的地都先用短短的故事打開，讓你判斷它是不是屬於你的下一次中國。",
        "用短短的故事打開每個目的地，先看它是否屬於你的下一次中國。",
      );
    }
    html = html.replace('hreflang="ru" href="https://bluehourchina.com/ru.html"', 'hreflang="ru" href="https://bluehourchina.com/ru/stories/"');
    await fs.writeFile(absolute, html);
  }
}

function russianPage() {
  const locale = copy.ru;
  const links = localePaths.ru;
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><title>Истории путешествий | Bluehour China</title><meta name="description" content="Редакционные дневники частных маршрутов по Юньнани, Синьцзяну и Хайнаню: ритм, места и ощущения до отправки заявки."><link rel="canonical" href="https://bluehourchina.com/ru/stories/"><link rel="alternate" hreflang="en" href="https://bluehourchina.com/stories.html"><link rel="alternate" hreflang="zh-Hant" href="https://bluehourchina.com/zh/stories/"><link rel="alternate" hreflang="ja" href="https://bluehourchina.com/ja/stories/"><link rel="alternate" hreflang="ko" href="https://bluehourchina.com/ko/stories/"><link rel="alternate" hreflang="th" href="https://bluehourchina.com/th/stories/"><link rel="alternate" hreflang="ru" href="https://bluehourchina.com/ru/stories/"><link rel="alternate" hreflang="x-default" href="https://bluehourchina.com/stories.html"><link rel="icon" type="image/svg+xml" href="/assets/ruoqing-avatar.svg"><meta property="og:title" content="Истории путешествий | Bluehour China"><meta property="og:description" content="Почувствуйте ритм частного маршрута до отправки заявки."><meta property="og:type" content="website"><meta property="og:url" content="https://bluehourchina.com/ru/stories/"><meta property="og:image" content="https://bluehourchina.com/assets/ai/bluehour-china-hero-luxury-lake-v2.jpg"><link rel="stylesheet" href="/assets/luxury-multilang.css?v=20260711-rhythm8"><link rel="stylesheet" href="/assets/heading-polish.css?v=20260711-rhythm8"></head><body style="--hero-image:url('/assets/ai/bluehour-china-hero-luxury-lake-v2.jpg')"><nav class="nav" aria-label="Основная навигация"><a class="brand" href="${links.home}"><img src="/assets/ruoqing-avatar.svg" alt="" aria-hidden="true"><span><strong>Bluehour China</strong><span>若青中國旅策</span></span></a><div class="nav-links"><a href="${links.home}#places">Маршруты</a><a href="${links.stories}">Истории</a><a href="/before-china/">Перед поездкой</a><a class="nav-cta" href="${links.interest}">Запросить маршрут</a></div></nav><main><section class="hero"><div class="wrap hero-inner"><p class="eyebrow">Истории путешествий</p><h1>Сначала почувствовать маршрут</h1><p class="lead">Короткие дневники показывают не только места, но и ритм частной поездки по Китаю.</p><div class="hero-actions"><a class="btn primary" href="#journey-journals">Читать истории</a><a class="btn" href="${links.interest}">Запросить маршрут</a></div></div></section>${storySection("ru")}<section class="next"><div class="wrap"><p class="eyebrow">Начать спокойно</p><h2>Назовите даты, людей и желаемый ритм</h2><p>Мы ответим направлением маршрута и стартовой стоимостью.</p><div class="hero-actions"><a class="btn primary" href="${links.interest}">Запросить маршрут</a><a class="btn" href="${links.home}#places">Все маршруты</a></div></div></section></main><footer class="footer"><div class="wrap"><span>Bluehour China Journeys</span><span><a href="/credits.html">Источники изображений</a> · <a href="/privacy.html">Privacy</a></span></div></footer><a class="sticky-review" href="${links.interest}">Запросить маршрут</a><script src="/assets/language-menu.js" defer></script></body></html>`;
}

await fs.mkdir(path.join(root, "ru/stories"), { recursive: true });
await fs.writeFile(path.join(root, "ru/stories/index.html"), russianPage());

for (const file of ["ru.html", "ru/index.html", ...Object.values(routeFilesForRussian())]) {
  const absolute = path.join(root, file);
  try {
    let html = await fs.readFile(absolute, "utf8");
    if (!html.includes('href="/ru/stories/"')) {
      html = html.replace(/(<a href="\/ru\.html#care">[^<]+<\/a>)/, `$1<a href="/ru/stories/">Истории</a>`);
    }
    await fs.writeFile(absolute, html);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

function routeFilesForRussian() {
  return {
    yunnan: "ru/yunnan/index.html",
    xinjiang: "ru/xinjiang/index.html",
    dunhuang: "ru/dunhuang/index.html",
    sanya: "ru/sanya/index.html",
    northeast: "ru/northeast/index.html",
    innerMongolia: "ru/inner-mongolia/index.html",
  };
}

const sitemapPath = path.join(root, "sitemap.xml");
let sitemap = await fs.readFile(sitemapPath, "utf8");
if (!sitemap.includes("https://bluehourchina.com/ru/stories/")) {
  sitemap = sitemap.replace("</urlset>", "  <url><loc>https://bluehourchina.com/ru/stories/</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>\n</urlset>");
  await fs.writeFile(sitemapPath, sitemap);
}

console.log("Added multilingual journey journals and a Russian stories page.");
