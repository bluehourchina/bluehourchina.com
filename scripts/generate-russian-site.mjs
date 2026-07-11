import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const endpoint = "https://script.google.com/macros/s/AKfycbxCxsA5x0zzq_5pqI2MNJcki0MC9R236i_e3oRtu_0QPl7osg9CDHnaOzsSW_sZiRrh/exec";
const formAction = "https://formsubmit.co/67d31e8a5231a5944bbb8f18952a58df";

const routes = {
  yunnan: {
    region: "Юньнань",
    name: "Куньмин, Дали и Лицзян",
    duration: "8 дней · 7 ночей",
    price: "95 000 ₽",
    priceNumber: "95000",
    route: "Куньмин → Дали → Лицзян",
    summary: "Спокойный маршрут через озеро Эрхай, ремёсла Дали, деревни Лицзяна и один день у Снежной горы.",
    pace: "Три базы, скоростной поезд и один горный день",
    best: "Первое глубокое знакомство с природной Юньнанью",
    season: "Март–май и сентябрь–ноябрь",
    mainImage: "/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg",
    days: [
      ["День 1", "Прибытие в Куньмин", "Индивидуальная встреча, заселение и свободный вечер.", "Ночь: Куньмин"],
      ["День 2", "Доунань, водно-болотный парк Лаоюйхэ и поезд в Дали", "Цветочный рынок, свет у озера Дяньчи и переезд на скоростном поезде.", "Ночь: Дали"],
      ["День 3", "Рассвет в Лункане, берег Эрхая и Сичжоу", "Озеро на рассвете, дорога вдоль воды и традиционное окрашивание ткани.", "Ночь: Дали"],
      ["День 4", "Старый город Дали и закат на Юньсяне", "Старый город, садовая остановка и закат без спешки.", "Ночь: Дали"],
      ["День 5", "Из Дали в Лицзян", "Мягкий переезд через водно-болотные пейзажи к Лицзяну.", "Ночь: Лицзян"],
      ["День 6", "Юньшаньпин, Долина Голубой Луны и Шухэ", "Горная зона, голубая вода и тихий вечер в старом посёлке Шухэ.", "Ночь: Лицзян"],
      ["День 7", "Байша, деревня Юйху и поезд в Куньмин", "Две деревни у горы, затем возвращение в Куньмин на поезде.", "Ночь: Куньмин"],
      ["День 8", "Отъезд", "Индивидуальный трансфер по времени рейса.", "День отъезда"],
    ],
    notes: ["Высоту и самочувствие проверяем до горного дня.", "Поезда и входные билеты бронируются заранее.", "В Дали остаются три ночи, чтобы маршрут не превратился в переезды."],
    gallery: [
      ["/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg", "Дни 2–4 · Дали", "Озеро, дворы и утро без спешки."],
      ["/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg", "День 3 · Сичжоу", "Ремесло остаётся частью маршрута, а не сувенирной остановкой."],
      ["/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg", "Дни 5–7 · Лицзян", "Деревни и горная зона с запасом на погоду."],
    ],
  },
  xinjiang: {
    region: "Синьцзян",
    name: "Небесная дорога Или",
    duration: "9 дней · 8 ночей",
    price: "143 000 ₽",
    priceNumber: "143000",
    route: "Урумчи → Куйтун → Сайрам-Нур → Инин → Текес → Налати",
    summary: "Девять дней по реальным ночёвкам: Сайрам-Нур, Инин, Текес и две ночи в Налати.",
    pace: "Длинные переезды указаны заранее; в Налати две ночи",
    best: "Большие ландшафты, частный транспорт и простор",
    season: "Конец мая–сентябрь",
    mainImage: "/assets/real-xinjiang/sayram-lake-cc0.jpg",
    days: [
      ["День 1", "Прибытие в Урумчи и Большой базар", "Встреча, заселение и краткий разбор маршрута.", "Ночь: Урумчи"],
      ["День 2", "Дорога S101 к Куйтуну", "Самый длинный дорожный день с остановками по погоде и самочувствию.", "Ночь: Куйтун"],
      ["День 3", "Куйтун — озеро Сайрам-Нур", "Прибытие до полудня и полноценное время у воды.", "Ночь: Сайрам-Нур или Циншуйхэ"],
      ["День 4", "Гоцзыгоу, Хочэн и Инин", "Мост Гоцзыгоу, сезонные поля Хочэна и вечер в Инине.", "Ночь: Инин"],
      ["День 5", "Инин — Текес и направление Калацзюнь", "Переезд в Текес без возврата по той же дороге.", "Ночь: Текес"],
      ["День 6", "Текес — Налати", "Переезд и лёгкий день. Начало проживания на две ночи.", "Ночь: Налати"],
      ["День 7", "Полный день в Налати", "Небесное пастбище, долина или спокойная прогулка из одной гостиницы.", "Ночь: Налати"],
      ["День 8", "Налати — Инин", "Возвращение без жёсткой стыковки с рейсом.", "Ночь: Инин"],
      ["День 9", "Отъезд из Инина", "Трансфер в аэропорт и вылет напрямую или через Урумчи.", "День отъезда"],
    ],
    notes: ["S101 — самый длинный дорожный день.", "Озеро и Налати не превращаются в короткие фотостопы.", "Две ночи в Налати дают запас на погоду."],
    gallery: [
      ["/assets/real-xinjiang/urumqi-grand-bazaar-cc-by-sa.jpg", "Дни 1–2 · Урумчи", "Прибытие, базар и начало большой дороги."],
      ["/assets/real-xinjiang/sayram-lake-cc0.jpg", "Дни 3–4 · Сайрам-Нур", "Озеру выделен отдельный день и правильный свет."],
      ["/assets/real-xinjiang/nalati-grassland-cc0.jpg", "Дни 5–7 · Налати", "Две ночи и один настоящий день в степи."],
    ],
  },
  dunhuang: {
    region: "Дуньхуан",
    name: "Свет Шёлкового пути",
    duration: "6 дней · 5 ночей",
    price: "110 000 ₽",
    priceNumber: "110000",
    route: "Дуньхуан → Могао → Юймэньгуань и Ядань → Минша",
    summary: "Пещеры Могао, западные пограничные памятники и дюны в часы мягкого света.",
    pace: "Одна главная тема в день; четвёртый день — единственный длинный",
    best: "Искусство, история Шёлкового пути и пустыня",
    season: "Апрель–май и сентябрь–октябрь",
    mainImage: "/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg",
    days: [
      ["День 1", "Прибытие в Дуньхуан", "Индивидуальная встреча и спокойный первый вечер.", "Ночь: Дуньхуан"],
      ["День 2", "Музей Дуньхуана и контекст города", "Сначала история и подготовка к посещению пещер.", "Ночь: Дуньхуан"],
      ["День 3", "Пещеры Могао и вечер в Шачжоу", "Цифровая экспозиция, посещение по времени и спокойный вечер.", "Ночь: Дуньхуан"],
      ["День 4", "Юймэньгуань, Великая стена эпохи Хань и закат в Ядане", "Длинный западный маршрут с ранним выездом.", "Ночь: Дуньхуан"],
      ["День 5", "Гора Минша и озеро Полумесяца", "Дюны после спада жары; вечернее шоу остаётся опцией.", "Ночь: Дуньхуан"],
      ["День 6", "Отъезд или переезд в Лююань", "Трансфер к следующему участку Шёлкового пути.", "День отъезда"],
    ],
    notes: ["Вход в Могао строго по времени.", "Западный маршрут занимает полный день.", "Дюны планируются по температуре и свету."],
    gallery: [
      ["/assets/real-dunhuang/mogao-caves-cc-by-sa.jpg", "Дни 2–3 · Могао", "Сначала контекст, затем посещение по брони."],
      ["/assets/real-dunhuang/yumen-pass-cc-by-sa.jpg", "День 4 · Западный маршрут", "Юймэньгуань, стена Хань и Ядань за один день."],
      ["/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg", "День 5 · Минша", "Дюны после жары и при мягком свете."],
    ],
  },
  "inner-mongolia": {
    region: "Внутренняя Монголия",
    name: "Степь и пустыня",
    duration: "6 дней · 5 ночей",
    price: "96 000 ₽",
    priceNumber: "96000",
    route: "Хух-Хото → Хуйтэн-Силэ → Кубуци → Ордос",
    summary: "Городской контекст, две ночи рядом со степью и один день в пустыне Кубуци.",
    pace: "Город, степной дом и пустыня без списка представлений",
    best: "Открытое пространство, культура и частный автомобиль",
    season: "Июнь–сентябрь",
    mainImage: "/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg",
    days: [
      ["День 1", "Прибытие в Хух-Хото", "Встреча, заселение и тёплый ужин.", "Ночь: Хух-Хото"],
      ["День 2", "История города и местная кухня", "Музей Внутренней Монголии и район храма Да-Чжао.", "Ночь: Хух-Хото"],
      ["День 3", "Степь Хуйтэн-Силэ", "Переезд, проверенное размещение и вечер после отъезда дневных групп.", "Ночь: степной лодж"],
      ["День 4", "Утро в степи", "Спокойное утро, опциональная верховая прогулка и уважительное знакомство с культурой.", "Ночь: по маршруту"],
      ["День 5", "Пустыня Кубуци", "Дюны по свету и температуре; активности согласуются отдельно.", "Ночь: пустыня или Ордос"],
      ["День 6", "Ордос и отъезд", "Свободное утро и индивидуальный трансфер.", "День отъезда"],
    ],
    notes: ["Размещение выбирается по теплу, ванной и тишине.", "Верховая езда и пустынные активности не обязательны.", "Погодный запас включён в логику маршрута."],
    gallery: [
      ["/assets/real-inner-mongolia/dazhao-temple-cc-by.jpg", "Дни 1–2 · Хух-Хото", "Сначала город и история региона."],
      ["/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "Дни 3–4 · Степь", "Вечер, утро и проверенное размещение."],
      ["/assets/real-inner-mongolia/kubuqi-desert-cc-by-sa.jpg", "День 5 · Кубуци", "Дюны по свету; активности отдельно."],
    ],
  },
  sanya: {
    region: "Санья",
    name: "Побережье и культура",
    duration: "5 дней · 4 ночи",
    price: "103 000 ₽",
    priceNumber: "103000",
    route: "Аэропорт Санья → Хайтанвань → Бинлангу → Ялунвань",
    summary: "Курорт в Хайтанване, день культуры ли и мяо и спокойное побережье Ялунваня.",
    pace: "Два свободных курортных утра и один культурный день",
    best: "Пары, семьи и тёплый финал большого путешествия",
    season: "Ноябрь–апрель",
    mainImage: "/assets/real-sanya/haitang-bay-cc-by-sa.jpg",
    days: [
      ["День 1", "Прибытие в Хайтанвань", "Индивидуальный трансфер и свободный вечер у моря.", "Ночь: Хайтанвань"],
      ["День 2", "Курортный день", "Завтрак, пляж и бассейн без обязательной экскурсии.", "Ночь: Хайтанвань"],
      ["День 3", "Культура ли и мяо в Бинлангу", "Отдельный выезд на частном автомобиле и возвращение до ужина.", "Ночь: Хайтанвань"],
      ["День 4", "Спокойный Ялунвань", "Поздний выезд, обед у моря и свободное время.", "Ночь: Санья"],
      ["День 5", "Отъезд", "Индивидуальный трансфер по времени рейса.", "День отъезда"],
    ],
    notes: ["Пляж и категория номера подтверждаются до брони.", "Бинлангу — единственный полный экскурсионный день.", "Сезон дождей и тайфунов проверяется до предложения дат."],
    gallery: [
      ["/assets/real-sanya/haitang-bay-cc-by-sa.jpg", "Дни 1–2 · Хайтанвань", "Отель и море остаются центром первых дней."],
      ["/assets/real-sanya/binglanggu-cc-by-sa.jpg", "День 3 · Бинлангу", "Один полный культурный день."],
      ["/assets/real-sanya/yalong-bay-panoramio-cc-by.jpg", "День 4 · Ялунвань", "Поздний старт, обед и свободное побережье."],
    ],
  },
  northeast: {
    region: "Северо-Восточный Китай",
    name: "Харбин, Ябули и Снежная деревня",
    duration: "7 дней · 6 ночей",
    price: "121 000 ₽",
    priceNumber: "121000",
    route: "Харбин → Ябули → Китайская Снежная деревня → Харбин",
    summary: "Зимняя линия от Харбина к Ябули и Снежной деревне с честным запасом на погоду.",
    pace: "Два места с проживанием по две ночи и погодный запас",
    best: "Первый снег, зимние пейзажи и семьи",
    season: "Декабрь–февраль",
    mainImage: "/assets/real-northeast/china-snow-town-cc-by.jpg",
    days: [
      ["День 1", "Прибытие в Харбин", "Встреча, тёплое заселение и простой первый вечер.", "Ночь: Харбин"],
      ["День 2", "Исторический Харбин и сезонный лёд", "Собор Святой Софии, Центральная улица и Мир льда и снега только в официальный сезон.", "Ночь: Харбин"],
      ["День 3", "Харбин — Ябули", "Частный переезд с тёплой остановкой и подбором снаряжения.", "Ночь: Ябули"],
      ["День 4", "Лыжи или день в лесу", "Программа по возрасту, опыту и желаемой активности.", "Ночь: Ябули"],
      ["День 5", "Дорога Ясюэ к Снежной деревне", "Тёплые остановки и прибытие до вечерней подсветки.", "Ночь: Снежная деревня"],
      ["День 6", "Утро в деревне и возвращение в Харбин", "Спокойное утро до пикового потока и консервативный зимний переезд.", "Ночь: Харбин"],
      ["День 7", "Отъезд или погодный запас", "Трансфер в аэропорт или на вокзал.", "День отъезда"],
    ],
    notes: ["Ледовые объекты и снег зависят от сезона.", "Зимняя машина и тёплые остановки входят в план.", "Лыжи остаются опцией и подбираются по уровню."],
    gallery: [
      ["/assets/real-northeast/saint-sophia-harbin-cc-by-sa.jpg", "Дни 1–2 · Харбин", "Архитектура, центральная улица и сезонный лёд."],
      ["/assets/real-northeast/yabuli-ski-resort-cc-by-sa.jpg", "Дни 3–4 · Ябули", "Две ночи вместо короткой остановки."],
      ["/assets/real-northeast/china-snow-town-cc-by.jpg", "Дни 5–6 · Снежная деревня", "Вечерняя подсветка, ночь и тихое утро."],
    ],
  },
};

const languageAlternates = (destination = "", pageKind = "home") => {
  const paths = destination
    ? {
        en: `/${destination}.html`, zh: `/zh/${destination}/`, ja: `/ja/${destination}/`,
        ko: `/ko/${destination}/`, th: `/th/${destination}/`, ru: `/ru/${destination}/`,
      }
    : pageKind === "interest"
      ? { en: "/interest.html", zh: "/zh/interest/", ja: "/ja/interest/", ko: "/ko/interest/", th: "/th/interest/", ru: "/ru/interest/" }
      : { en: "/", zh: "/zh.html", ja: "/ja.html", ko: "/ko.html", th: "/th.html", ru: "/ru.html" };
  return `<link rel="alternate" hreflang="en" href="https://bluehourchina.com${paths.en}">
  <link rel="alternate" hreflang="zh-Hant" href="https://bluehourchina.com${paths.zh}">
  <link rel="alternate" hreflang="ja" href="https://bluehourchina.com${paths.ja}">
  <link rel="alternate" hreflang="ko" href="https://bluehourchina.com${paths.ko}">
  <link rel="alternate" hreflang="th" href="https://bluehourchina.com${paths.th}">
  <link rel="alternate" hreflang="ru" href="https://bluehourchina.com${paths.ru}">
  <link rel="alternate" hreflang="x-default" href="https://bluehourchina.com${paths.en}">`;
};

function productSchema(slug, route) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: route.name,
    brand: { "@type": "Brand", name: "Bluehour China Journeys" },
    category: "Индивидуальные путешествия по Китаю",
    inLanguage: "ru",
    description: route.summary,
    image: `https://bluehourchina.com${route.mainImage}`,
    url: `https://bluehourchina.com/ru/${slug}/`,
    offers: { "@type": "Offer", priceCurrency: "RUB", price: route.priceNumber, url: `https://bluehourchina.com/ru/${slug}/`, availability: "https://schema.org/InStock" },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Продолжительность", value: route.duration },
      { "@type": "PropertyValue", name: "Маршрут", value: route.route },
      { "@type": "PropertyValue", name: "Минимальная группа", value: "От 2 человек" },
      { "@type": "PropertyValue", name: "Кому подходит", value: route.best },
    ],
  }, null, 2);
}

function nav(activePath = "/ru.html") {
  return `<nav class="nav" aria-label="Основная навигация"><a class="brand" href="/ru.html"><img src="/assets/ruoqing-avatar.svg" alt="" aria-hidden="true"><span><strong>Bluehour China</strong><span>若青中國旅策</span></span></a><div class="nav-links"><a href="/ru.html#places">Маршруты</a><a href="/ru.html#care">Как мы помогаем</a><span class="language-switch" aria-label="Выбор языка"><a href="/">EN</a><a href="/zh.html">中</a><a href="/ja.html">JP</a><a href="/ko.html">KO</a><a href="/th.html">TH</a><a href="${activePath}" aria-current="page">RU</a></span><a class="nav-cta" href="/ru/interest/">Запросить маршрут</a></div></nav><div class="mobile-lang" aria-label="Выбор языка"><a href="/">EN</a><a href="/zh.html">中</a><a href="/ja.html">JP</a><a href="/ko.html">KO</a><a href="/th.html">TH</a><a href="${activePath}" aria-current="page">RU</a></div>`;
}

function head({ title, description, canonical, destination = "", pageKind = "home", image }) {
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><title>${title}</title><meta name="description" content="${description}"><link rel="canonical" href="${canonical}">${languageAlternates(destination, pageKind)}<link rel="icon" type="image/svg+xml" href="/assets/ruoqing-avatar.svg"><meta property="og:title" content="${title}"><meta property="og:description" content="${description}"><meta property="og:type" content="website"><meta property="og:locale" content="ru_RU"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://bluehourchina.com${image}"><meta name="twitter:card" content="summary_large_image"><link rel="stylesheet" href="/assets/luxury-multilang.css?v=20260711-calm1"><link rel="stylesheet" href="/assets/heading-polish.css?v=20260711-calm1">`;
}

function footer() {
  return `<footer class="footer"><div class="wrap"><span>Bluehour China Journeys｜若青中國旅策</span><span><a href="/credits.html">Источники изображений</a> · <a href="/privacy.html">Конфиденциальность</a> · <a href="/llms.txt">AI summary</a></span></div></footer>`;
}

function routePage(slug, route) {
  const dayItems = route.days.map(([index, title, body, stay]) => `<article class="route-day-item"><div class="route-day-index">${index}</div><div class="route-day-copy"><h3>${title}</h3><p>${body}</p><span>${stay}</span></div></article>`).join("");
  const scenes = route.gallery.map(([src, label, body]) => `<figure class="material-card"><img loading="lazy" src="${src}" alt="${label}"><figcaption><b>${label}</b><span>${body}</span></figcaption></figure>`).join("");
  const title = `${route.name}｜Индивидуальный маршрут по Китаю`;
  const description = `${route.duration}, ${route.route}, ${route.price} на человека. Частный маршрут от 2 путешественников.`;
  return `${head({ title, description, canonical: `https://bluehourchina.com/ru/${slug}/`, destination: slug, image: route.mainImage })}<script type="application/ld+json">${productSchema(slug, route)}</script></head><body style="--hero-image:url('${route.mainImage}');--cta-image:url('${route.mainImage}')">${nav(`/ru/${slug}/`)}<main>
  <section class="hero destination-hero"><div class="wrap hero-inner"><p class="eyebrow">${route.region} · ${route.duration}</p><h1>${route.name}</h1><p class="lead">${route.summary}</p><div class="hero-actions"><a class="btn primary" href="/ru/interest/?destination=${slug}&amp;utm_source=destination_hero&amp;utm_medium=site&amp;utm_campaign=private_route_consultation">Запросить маршрут</a><a class="btn" href="#day-plan">Посмотреть по дням</a></div><div class="facts"><div class="fact"><b>Стоимость</b><span>от ${route.price}/чел.</span></div><div class="fact"><b>Частная группа</b><span>От 2 человек · оптимально 2–6</span></div><div class="fact"><b>Сезон</b><span>${route.season}</span></div></div></div></section>
  <section class="section standard-route-band"><div class="wrap route-showcase"><div class="route-copy"><p class="eyebrow">Стандартный частный маршрут</p><h2>${route.name}</h2><p>${route.summary}</p><div class="route-price"><span>${route.duration}</span><strong>${route.price}</strong><small>на человека · группа от 2</small></div><div class="route-points"><div><b>Маршрут</b><span>${route.route}</span></div><div><b>Темп</b><span>${route.pace}</span></div><div><b>Кому подходит</b><span>${route.best}</span></div><div><b>Лучший сезон</b><span>${route.season}</span></div></div><p class="route-note">Стоимость ориентировочная и пересчитывается по датам, категории номера и курсу. Отправка заявки не требует оплаты.</p></div><div class="route-card"><div class="route-image"><img src="${route.mainImage}" alt="${route.name}"></div><div class="route-map"><h3>Маршрут</h3><div class="map-line">${route.route.split(" → ").map((place) => `<span>${place}</span>`).join("")}</div></div></div></div></section>
  <section class="section route-day-plan-band" id="day-plan"><div class="wrap route-day-plan-wrap"><div class="route-day-head"><div><p class="eyebrow">Маршрут по дням</p><h2>${route.duration}</h2><p>Понятная базовая программа. После заявки меняются только даты, уровень отеля, темп и языковая поддержка.</p></div><div class="route-terms"><div><b>Стоимость</b><span>от ${route.price}/чел.</span></div><div><b>Группа</b><span>От 2 человек · оптимально 2–6</span></div></div></div><div class="route-day-layout"><div class="route-day-list">${dayItems}</div><aside class="route-visual-panel"><figure><img src="${route.mainImage}" alt="${route.name}"><figcaption>Реальное место на маршруте · ${route.region}</figcaption></figure><ul class="route-visual-notes">${route.notes.map((note, index) => `<li><b>0${index + 1}</b><span>${note}</span></li>`).join("")}</ul><div class="route-inclusion-grid"><section><h3>В базовую стоимость входит</h3><ul><li>Разработка маршрута и местная координация</li><li>Частный автомобиль на маршрутные дни</li><li>Проживание в двухместном номере</li><li>Основные билеты и англоязычная поддержка по смете</li></ul></section><section><h3>Рассчитывается отдельно</h3><ul><li>Перелёты и междугородние поезда</li><li>Одноместное размещение и повышение категории</li><li>Неуказанное питание и опционные активности</li><li>Виза, страховка и личные расходы</li></ul></section></div><p class="route-note">Отправка заявки не требует оплаты.</p><a class="btn primary dark-gold" href="/ru/interest/?destination=${slug}&amp;utm_source=route_day_plan&amp;utm_medium=site&amp;utm_campaign=private_route_consultation">Получить расчёт</a></aside></div></div></section>
  <section class="section material-notes-band"><div class="wrap material-notes-wrap"><div class="material-notes-intro"><div><p class="eyebrow">Реальные места</p><h2>Что вы увидите по пути</h2></div><p>Фотографии соответствуют конкретным точкам маршрута. Доступ и сезонность проверяются перед подтверждением.</p></div><div class="material-grid">${scenes}</div></div></section>
  <section class="section care-band"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Спокойная организация</p><h2>Комфорт — это часть маршрута</h2></div><p>Мы заранее проверяем переезды, номер, язык, сезонные ограничения и запас времени.</p></div><div class="care-grid"><article class="care"><h3>Частный транспорт</h3><p>Встречи и основные переезды без большой группы.</p></article><article class="care"><h3>Проверенное размещение</h3><p>Категория номера подтверждается до оплаты.</p></article><article class="care"><h3>Языковая поддержка</h3><p>Англоязычная поддержка включается в смету; русскоязычный гид — по наличию.</p></article><article class="care"><h3>Честные ограничения</h3><p>Сезон, дорога и опционные активности называются заранее.</p></article></div></div></section>
  <section class="cta"><div class="wrap"><p class="eyebrow">Частный запрос</p><h2>Назовите даты и людей</h2><p>Мы ответим направлением маршрута, стартовой стоимостью и вопросами для точного расчёта.</p><div class="hero-actions"><a class="btn primary" href="/ru/interest/?destination=${slug}">Запросить маршрут</a><a class="btn" href="/ru.html#places">Все направления</a></div></div></section>
  </main>${footer()}<script src="/assets/lead-form-20260706-sheet.js" defer></script></body></html>`;
}

function homePage() {
  const cards = Object.entries(routes).map(([slug, route]) => {
    const samples = [route.days[0], route.days[Math.floor(route.days.length / 2)], route.days.at(-1)];
    return `<article class="product-route-card"><a class="product-route-image" href="/ru/${slug}/"><img loading="lazy" src="${route.mainImage}" alt="${route.region}"><span>${route.duration}</span></a><div class="product-route-copy"><p class="eyebrow">${route.region}</p><h3>${route.name}</h3><dl class="product-route-meta"><div><dt>Стоимость</dt><dd>${route.price}/чел.</dd></div><div><dt>Частная группа</dt><dd>От 2 человек · оптимально 2–6</dd></div><div><dt>Маршрут</dt><dd>${route.route}</dd></div></dl><ol class="mini-days">${samples.map((day) => `<li>${day[0]} · ${day[1]}</li>`).join("")}</ol><a class="text-link" href="/ru/${slug}/#day-plan">Маршрут по дням</a></div></article>`;
  }).join("");
  const offers = Object.entries(routes).map(([slug, route]) => ({ "@type": "Offer", name: route.name, url: `https://bluehourchina.com/ru/${slug}/`, priceCurrency: "RUB", price: route.priceNumber, availability: "https://schema.org/InStock", itemOffered: { "@type": "TouristTrip", name: route.name, itinerary: route.route } }));
  const schema = JSON.stringify({ "@context": "https://schema.org", "@type": "TravelAgency", name: "Bluehour China Journeys", alternateName: "若青中國旅策", url: "https://bluehourchina.com/ru.html", inLanguage: "ru", areaServed: ["Yunnan", "Xinjiang", "Dunhuang", "Inner Mongolia", "Sanya", "Northeast China"], description: "Индивидуальные маршруты по Китаю за пределами Пекина и Шанхая.", hasOfferCatalog: { "@type": "OfferCatalog", name: "Частные маршруты по Китаю", itemListElement: offers } }, null, 2);
  return `${head({ title: "Индивидуальные путешествия по Китаю за пределами мегаполисов｜Bluehour China", description: "Частные маршруты по Юньнани, Синьцзяну, Дуньхуану, Внутренней Монголии, Санье и Северо-Восточному Китаю. От 2 человек.", canonical: "https://bluehourchina.com/ru.html", image: "/assets/ai/bluehour-china-hero-luxury-lake-v2.jpg" })}<script type="application/ld+json">${schema}</script></head><body>${nav("/ru.html")}<main>
  <section class="hero home-hero"><div class="hero-media" aria-hidden="true"><div class="hero-scene lake"></div><div class="hero-scene yunnan"></div><div class="hero-scene sanya"></div></div><div class="wrap hero-inner"><p class="eyebrow">Частный Китай за пределами мегаполисов</p><h1>Увидеть Китай глубже<br>и путешествовать спокойно</h1><p class="lead">Юньнань, Синьцзян, Дуньхуан, Внутренняя Монголия, Санья и Северо-Восточный Китай. Частные маршруты от 2 путешественников.</p><div class="hero-actions"><a class="btn primary" href="#places">Посмотреть маршруты</a><a class="btn" href="/ru/interest/">Начать планирование</a></div><div class="hero-proofline"><span>Частно от 2 человек</span><span>Маршрут и цена до заявки</span><span>Ответ человека за 1 рабочий день</span></div></div></section>
  <section class="section product-routes-band" id="places"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Стандартные частные маршруты</p><h2>Сначала понятный маршрут<br>затем персональная настройка</h2></div><p>Каждый вариант заранее показывает дни, маршрут, стартовую цену и минимальную группу.</p></div><div class="product-route-grid">${cards}</div></div></section>
  <section class="section conversion-band"><div class="wrap conversion-wrap"><div class="conversion-copy"><p class="eyebrow">Как начать</p><h2>Три шага до точного расчёта</h2><div class="hero-actions"><a class="btn primary dark-gold" href="/ru/interest/">Оставить запрос</a></div></div><div class="conversion-steps"><article><b>01</b><h3>Выберите базовый маршрут</h3><p>Сначала посмотрите реальные дни, цену и переезды.</p></article><article><b>02</b><h3>Укажите даты и состав группы</h3><p>Нам нужны месяц, количество дней, бюджет и требования к комфорту.</p></article><article><b>03</b><h3>Получите направление и цену</h3><p>В течение одного рабочего дня ответит человек, а не автоматическая рассылка.</p></article></div></div></section>
  <section class="section service-band" id="care"><div class="wrap"><div class="section-head"><div><p class="eyebrow">Что входит в заботу</p><h2>Спокойствие строится заранее</h2></div><p>Мы проверяем транспорт, комнаты, язык, сезон и реальный темп каждого дня.</p></div><div class="promise-grid"><article class="promise"><h3>Частные переезды</h3><p>Без большой группы и лишних пересадок.</p></article><article class="promise"><h3>Комфорт номера</h3><p>Категория и условия подтверждаются заранее.</p></article><article class="promise"><h3>Поддержка на месте</h3><p>Китайская координация и англоязычная помощь; русский гид по наличию.</p></article><article class="promise"><h3>Честная смета</h3><p>Опционные активности и доплаты видны до решения.</p></article></div></div></section>
  <section class="section home-intake-band" id="plan-trip"><div class="wrap home-intake-grid"><div class="home-intake-copy"><p class="eyebrow">Частный маршрут</p><h2>Расскажите, какой Китай вы хотите увидеть</h2><p>Оставьте даты, количество людей, длительность и бюджет. Мы ответим направлением и стартовой стоимостью.</p><strong>Ответ человека за 1 рабочий день</strong></div>${leadForm("home_inline")}</div></section>
  </main>${footer()}<script src="/assets/lead-form-20260706-sheet.js" defer></script></body></html>`;
}

function leadForm(source = "interest") {
  return `<form class="lead-form home-lead-form" data-sheet-endpoint="${endpoint}" data-form-lang="ru" data-sending-message="Отправляем..." data-success-message="Запрос получен. Мы ответим маршрутом и стартовой стоимостью." data-error-message="Форма временно недоступна. Напишите нам по электронной почте." data-lead-value="120000" data-lead-currency="RUB" name="bluehour-china-${source}-ru" method="POST" action="${formAction}"><input type="hidden" name="_next" value="https://bluehourchina.com/thanks.html?source=${source}&amp;lang=ru"><input type="hidden" name="_subject" value="Bluehour China Russian private route inquiry"><input type="hidden" name="_template" value="table"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="form-name" value="bluehour-china-${source}-ru"><input type="hidden" name="submitted_at" value=""><input type="hidden" name="status" value="New"><input type="hidden" name="priority" value="High"><input type="hidden" name="campaign" value="private_route_consultation"><input type="hidden" name="next_step" value="Prepare Russian route direction and quote"><input type="hidden" name="intake_provider" value="google_sheet_webapp"><input type="hidden" name="language" value="Russian"><input type="hidden" name="page_url" value=""><input type="hidden" name="referrer" value=""><input type="hidden" name="utm_source" value="home"><input type="hidden" name="utm_medium" value="website"><input type="hidden" name="utm_campaign" value="private_route_consultation"><input type="hidden" name="intent_angle" value="${source}_private_route"><input type="hidden" name="source_path" value="/ru.html"><input type="hidden" name="source_content" value="russian-private-route"><input type="hidden" name="lead_currency" value="RUB"><div class="hp-field" aria-hidden="true"><label>Leave this field empty<input type="text" name="bot-field" tabindex="-1" autocomplete="off"></label></div><input type="text" name="name" placeholder="Имя" aria-label="Имя" autocomplete="name" required><input type="text" name="contact" placeholder="Email / WhatsApp / Telegram" aria-label="Email, WhatsApp или Telegram" autocomplete="email" required><select name="destination" aria-label="Направление" required><option value="" disabled selected>Куда вы хотите поехать?</option>${Object.entries(routes).map(([slug, route]) => `<option value="${slug}">${route.region}</option>`).join("")}<option value="multi-region">Несколько регионов</option><option value="not-sure">Пока не решил(а)</option></select><select name="travel_window" aria-label="Срок поездки" required><option value="" disabled selected>Когда поездка?</option><option value="1-3 months">Через 1–3 месяца</option><option value="3-6 months">Через 3–6 месяцев</option><option value="next spring-summer">Следующей весной или летом</option><option value="next autumn-winter">Следующей осенью или зимой</option><option value="comparing">Пока сравниваю</option></select><select name="route_days" aria-label="Количество дней" required><option value="" disabled selected>Сколько дней?</option><option value="5-6">5–6 дней</option><option value="7-9">7–9 дней</option><option value="10-12">10–12 дней</option><option value="13+">13 дней и больше</option></select><select name="group_size" aria-label="Количество путешественников" required><option value="" disabled selected>Сколько человек?</option><option value="2">2</option><option value="3-4">3–4</option><option value="5-6">5–6</option><option value="family">Семья с детьми</option><option value="older travellers">Старшие путешественники</option></select><select name="budget" aria-label="Бюджет на человека" required><option value="" disabled selected>Бюджет на человека</option><option value="under RUB 120000">До 120 000 ₽</option><option value="RUB 120000-200000">120 000–200 000 ₽</option><option value="RUB 200000-350000">200 000–350 000 ₽</option><option value="above RUB 350000">Более 350 000 ₽</option><option value="not sure">Пока не решил(а)</option></select><textarea name="message" placeholder="Темп, отель, дети, старшие путешественники, питание или язык" aria-label="Дополнительные пожелания"></textarea><button type="submit">Получить предложение маршрута</button><p class="form-consent">Данные используются только для ответа на этот запрос. Оплата на этой странице не требуется. <a href="/privacy.html">Privacy</a></p><p class="form-fallback">Если форма не отправилась: <a href="mailto:bluehourchina@gmail.com">bluehourchina@gmail.com</a></p></form>`;
}

function interestPage() {
  const title = "Запросить индивидуальный маршрут по Китаю｜Bluehour China";
  const description = "Укажите даты, направление, состав группы и бюджет. Мы ответим направлением маршрута и стартовой стоимостью.";
  return `${head({ title, description, canonical: "https://bluehourchina.com/ru/interest/", pageKind: "interest", image: "/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg" })}</head><body class="interest-body">${nav("/ru/interest/")}<main class="interest-page"><section class="interest-story"><div><p class="eyebrow">Спокойный первый шаг</p><h1>Расскажите, какой Китай вы хотите увидеть</h1><p>Заполните короткую форму. Мы не просим оплату и не отправляем автоматический пакет.</p></div><div class="interest-proof"><span>Ответ человека</span><span>1 рабочий день</span><span>Маршрут и стартовая цена</span></div></section><section class="form-side"><div class="form-card"><p class="eyebrow">Частный запрос</p><h2>Даты, люди и комфорт</h2>${leadForm("interest")}</div></section></main>${footer()}<script src="/assets/lead-form-20260706-sheet.js" defer></script></body></html>`;
}

await fs.mkdir(path.join(root, "ru"), { recursive: true });
const home = homePage();
await fs.writeFile(path.join(root, "ru.html"), home);
await fs.writeFile(path.join(root, "ru/index.html"), home.replace('name="source_path" value="/ru.html"', 'name="source_path" value="/ru/"'));

for (const [slug, route] of Object.entries(routes)) {
  const dir = path.join(root, "ru", slug);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, "index.html"), routePage(slug, route));
}

await fs.mkdir(path.join(root, "ru/interest"), { recursive: true });
await fs.writeFile(path.join(root, "ru/interest/index.html"), interestPage());
console.log("Generated Russian home, six destination pages and inquiry form.");
