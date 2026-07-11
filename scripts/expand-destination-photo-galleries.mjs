import fs from "node:fs/promises";

const routes = {
  xinjiang: [
    ["/assets/real-xinjiang/urumqi-grand-bazaar-cc-by-sa.jpg", "1", "city", { en: "Urumqi Grand Bazaar", zh: "烏魯木齊國際大巴扎", ja: "ウルムチ国際大バザール", ko: "우루무치 국제대바자르", th: "ตลาดนานาชาติอุรุมชี", ru: "Большой базар Урумчи" }],
    ["/assets/real-xinjiang/sayram-lake-cc0.jpg", "3", "lake", { en: "Sayram Lake", zh: "賽里木湖", ja: "サイラム湖", ko: "사이람호", th: "ทะเลสาบไซหลี่มู่", ru: "озеро Сайрам-Нур" }],
    ["/assets/real-xinjiang/guozigou-bridge-cc-by.jpg", "4", "road", { en: "Guozigou Bridge", zh: "果子溝大橋", ja: "果子溝大橋", ko: "궈쯔거우 대교", th: "สะพานกั่วจื่อโกว", ru: "мост Гоцзыгоу" }],
    ["/assets/real-xinjiang/nalati-grassland-cc0.jpg", "6-7", "grassland", { en: "Nalati grassland", zh: "那拉提草原", ja: "ナラティ草原", ko: "나라티 초원", th: "ทุ่งหญ้าน่าลาถี", ru: "степь Налати" }],
    ["/assets/real-xinjiang/sayram-lake-scenery-cc-by-sa.jpg", "3", "light", { en: "Sayram Lake shoreline", zh: "賽里木湖岸", ja: "サイラム湖畔", ko: "사이람호 호숫가", th: "ริมทะเลสาบไซหลี่มู่", ru: "берег Сайрам-Нура" }],
    ["/assets/real-xinjiang/nalati-town-cc-by-sa.jpg", "6-7", "stay", { en: "Nalati town", zh: "那拉提小鎮", ja: "ナラティの町", ko: "나라티 마을", th: "เมืองน่าลาถี", ru: "посёлок Налати" }],
  ],
  "inner-mongolia": [
    ["/assets/real-inner-mongolia/dazhao-temple-cc-by.jpg", "1-2", "culture", { en: "Dazhao Temple", zh: "大召寺", ja: "大召寺", ko: "다자오 사원", th: "วัดต้าจ้าว", ru: "храм Дачжао" }],
    ["/assets/real-inner-mongolia/inner-mongolia-museum-cc-by-sa.jpg", "2", "museum", { en: "Inner Mongolia Museum", zh: "內蒙古博物院", ja: "内モンゴル博物院", ko: "내몽골 박물관", th: "พิพิธภัณฑ์มองโกเลียใน", ru: "музей Внутренней Монголии" }],
    ["/assets/real-inner-mongolia/grassland-sunset-cc-by.jpg", "3-4", "grassland", { en: "Huitengxile grassland", zh: "輝騰錫勒草原", ja: "輝騰錫勒草原", ko: "후이텅시러 초원", th: "ทุ่งหญ้าฮุยเถิงซีเล่อ", ru: "степь Хуэйтэнсилэ" }],
    ["/assets/real-inner-mongolia/kubuqi-desert-cc-by-sa.jpg", "5", "desert", { en: "Kubuqi Desert", zh: "庫布齊沙漠", ja: "クブチ砂漠", ko: "쿠부치 사막", th: "ทะเลทรายคูปู้ฉี", ru: "пустыня Кубуци" }],
    ["/assets/real-inner-mongolia/ordos-museum-cc-by-sa.jpg", "6", "museum", { en: "Ordos Museum", zh: "鄂爾多斯博物館", ja: "オルドス博物館", ko: "오르도스 박물관", th: "พิพิธภัณฑ์ออร์ดอส", ru: "музей Ордоса" }],
    ["/assets/real-inner-mongolia/ordos-kangbashi-bridge-cc-by-sa.jpg", "6", "city", { en: "Kangbashi, Ordos", zh: "鄂爾多斯康巴什", ja: "オルドス・カンバシ", ko: "오르도스 캉바스", th: "คังปาซือ ออร์ดอส", ru: "Канбаши, Ордос" }],
  ],
  sanya: [
    ["/assets/real-hainan/haikou-old-town-cc-by-sa.jpg", "1", "city", { en: "Haikou old town", zh: "海口騎樓老街", ja: "海口の騎楼老街", ko: "하이커우 치러우 옛거리", th: "ย่านเมืองเก่าไหโข่ว", ru: "старый город Хайкоу" }],
    ["/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg", "3", "coast", { en: "Shimei Bay, Wanning", zh: "萬寧石梅灣", ja: "万寧・石梅湾", ko: "완닝 스메이만", th: "อ่าวสือเหมย ว่านหนิง", ru: "бухта Шимэй, Ваньнин" }],
    ["/assets/real-sanya/haitang-bay-cc-by-sa.jpg", "5", "coast", { en: "Haitang Bay, Sanya", zh: "三亞海棠灣", ja: "三亜・海棠湾", ko: "싼야 하이탕만", th: "อ่าวไห่ถัง ซานย่า", ru: "бухта Хайтан, Санья" }],
    ["/assets/real-sanya/sanya-edition-01-cc-by.jpg", "5-6", "stay", { en: "A calm Sanya resort morning", zh: "三亞旅宿的安靜早晨", ja: "三亜リゾートの静かな朝", ko: "싼야 리조트의 고요한 아침", th: "เช้าอันสงบในรีสอร์ตซานย่า", ru: "тихое утро в курорте Саньи" }],
    ["/assets/real-sanya/binglanggu-cc-by-sa.jpg", "6", "culture", { en: "Binglanggu", zh: "檳榔谷", ja: "檳榔谷", ko: "빙랑구", th: "หุบเขาปิงหลาง", ru: "Бинлангу" }],
    ["/assets/real-sanya/yalong-bay-panoramio-cc-by.jpg", "6", "coast", { en: "Yalong Bay", zh: "亞龍灣", ja: "亜龍湾", ko: "야룽만", th: "อ่าวย่าหลง", ru: "бухта Ялунвань" }],
  ],
  northeast: [
    ["/assets/real-northeast/saint-sophia-harbin-cc-by-sa.jpg", "1-2", "city", { en: "Saint Sophia, Harbin", zh: "哈爾濱聖索菲亞教堂", ja: "ハルビン聖ソフィア大聖堂", ko: "하얼빈 성 소피아 성당", th: "มหาวิหารเซนต์โซเฟีย ฮาร์บิน", ru: "Софийский собор, Харбин" }],
    ["/assets/real-northeast/harbin-central-street-cc-by-sa.jpg", "2", "culture", { en: "Harbin Central Street", zh: "哈爾濱中央大街", ja: "ハルビン中央大街", ko: "하얼빈 중앙대가", th: "ถนนจงยาง ฮาร์บิน", ru: "Центральная улица Харбина" }],
    ["/assets/real-northeast/ice-snow-world-cc0.jpg", "2", "light", { en: "Ice and Snow World", zh: "冰雪大世界", ja: "氷雪大世界", ko: "빙설대세계", th: "โลกน้ำแข็งและหิมะ", ru: "Мир льда и снега" }],
    ["/assets/real-northeast/yabuli-ski-resort-cc-by-sa.jpg", "3-4", "snow", { en: "Yabuli", zh: "亞布力", ja: "ヤブリ", ko: "야부리", th: "ย่าปู้ลี่", ru: "Ябули" }],
    ["/assets/real-northeast/sun-mountain-yabuli-cc-by.jpg", "3-4", "landscape", { en: "Sun Mountain, Yabuli", zh: "亞布力陽光山", ja: "ヤブリ・サンマウンテン", ko: "야부리 선마운틴", th: "ซันเมาน์เทน ย่าปู้ลี่", ru: "Солнечная гора, Ябули" }],
    ["/assets/real-northeast/china-snow-town-cc-by.jpg", "5-6", "stay", { en: "Snow Town", zh: "雪鄉", ja: "雪郷", ko: "설향", th: "หมู่บ้านหิมะ", ru: "Снежная деревня" }],
  ],
};

const pageFiles = {
  xinjiang: [["xinjiang.html", "en"], ["en/xinjiang/index.html", "en"], ["zh/xinjiang/index.html", "zh"], ["ja/xinjiang/index.html", "ja"], ["ko/xinjiang/index.html", "ko"], ["th/xinjiang/index.html", "th"], ["ru/xinjiang/index.html", "ru"]],
  "inner-mongolia": [["inner-mongolia.html", "en"], ["en/inner-mongolia/index.html", "en"], ["zh/inner-mongolia/index.html", "zh"], ["ja/inner-mongolia/index.html", "ja"], ["ko/inner-mongolia/index.html", "ko"], ["th/inner-mongolia/index.html", "th"], ["ru/inner-mongolia/index.html", "ru"]],
  sanya: [["sanya.html", "en"], ["en/sanya/index.html", "en"], ["zh/sanya/index.html", "zh"], ["ja/sanya/index.html", "ja"], ["ko/sanya/index.html", "ko"], ["th/sanya/index.html", "th"], ["ru/sanya/index.html", "ru"]],
  northeast: [["northeast.html", "en"], ["en/northeast/index.html", "en"], ["zh/northeast/index.html", "zh"], ["ja/northeast/index.html", "ja"], ["ko/northeast/index.html", "ko"], ["th/northeast/index.html", "th"], ["ru/northeast/index.html", "ru"]],
};

const ui = {
  en: { eyebrow: "Route in real scenes", title: "Six moments along the route", intro: "Every photograph corresponds to a stop or stay in the day-by-day route.", day: (n) => `${n.includes("-") ? "Days" : "Day"} ${n}`, notes: { city: "A paced city beginning before the long landscapes.", lake: "Time is protected for the water and changing light.", road: "A necessary crossing treated as part of the journey.", grassland: "Two nights keep this from becoming a brief photo stop.", light: "Timing follows season, weather and the softer light.", stay: "The overnight base is part of the comfort plan.", culture: "Local context is given its own time, without a rushed checklist.", museum: "A concise cultural layer before or after the open landscapes.", desert: "Dune time follows temperature, light and comfort.", coast: "The coast is left spacious rather than filled with stops.", resort: "Room, privacy and quiet are checked before confirmation.", snow: "Cold-weather movement and warm breaks are planned together.", landscape: "A second view shows the scale beyond the main attraction." } },
  zh: { eyebrow: "路線實景", title: "沿途六個片段", intro: "每張照片都對應每日路線中的停留或住宿，不以無關圖片填滿版面。", day: (n) => `第 ${n.replace("-", "–")} 天`, notes: { city: "先在城市安穩落地，再進入長距離風景。", lake: "為湖面與光線保留真正停留的時間。", road: "必要的移動，也被當成旅程的一部分。", grassland: "連住兩晚，不把草原變成匆忙拍照點。", light: "時段依季節、天氣與較柔和的光線調整。", stay: "住宿地本身也是舒適節奏的一部分。", culture: "留出完整時間理解地方，不用景點清單趕路。", museum: "在進入大景觀前後，補上清楚的地方脈絡。", desert: "沙丘活動依溫度、光線與體力安排。", coast: "海邊保留留白，不塞入過多停靠。", resort: "房型、隱私與安靜程度會在確認前核實。", snow: "低溫移動、暖房與休息點一起規劃。", landscape: "第二個視角，讓主景點之外的尺度也被看見。" } },
  ja: { eyebrow: "実景で見るルート", title: "旅の途中にある六つの場面", intro: "すべての写真が、日程内の立ち寄り先または滞在地に対応しています。", day: (n) => `${n.replace("-", "–")}日目`, notes: { city: "大きな景観へ向かう前に、街で穏やかに旅を始めます。", lake: "水辺と光の変化を味わう時間を確保します。", road: "必要な移動も旅の一部として整えます。", grassland: "二連泊で、短い撮影停車にしません。", light: "季節、天候、柔らかな光に合わせて時刻を調整します。", stay: "宿泊地そのものを快適な旅程の一部にします。", culture: "急ぐ名所巡りではなく、地域を知る時間を取ります。", museum: "広い風景の前後に地域の背景を簡潔に学びます。", desert: "気温、光、体力に合わせて砂丘を楽しみます。", coast: "海辺には余白を残し、立ち寄りを詰め込みません。", resort: "客室、プライバシー、静けさを事前に確認します。", snow: "寒冷地の移動と暖かな休憩を一緒に設計します。", landscape: "主要スポットの外に広がるスケールも見せます。" } },
  ko: { eyebrow: "실제 풍경으로 보는 일정", title: "루트 위 여섯 장면", intro: "모든 사진은 일자별 일정의 실제 방문지나 숙박지와 연결됩니다.", day: (n) => `${n.replace("-", "–")}일차`, notes: { city: "긴 풍경으로 들어가기 전 도시에서 편안하게 시작합니다.", lake: "물과 빛의 변화를 볼 수 있는 시간을 확보합니다.", road: "필요한 이동도 여행의 한 장면으로 설계합니다.", grassland: "2연박으로 짧은 사진 정차가 되지 않게 합니다.", light: "계절, 날씨와 부드러운 빛에 맞춰 시간을 조정합니다.", stay: "숙박지 자체가 편안한 리듬의 일부입니다.", culture: "체크리스트보다 지역을 이해하는 시간을 둡니다.", museum: "큰 풍경 전후에 지역의 맥락을 간결하게 더합니다.", desert: "기온, 빛과 체력에 맞춰 사막 시간을 정합니다.", coast: "바다는 여유롭게 두고 정차 지점을 늘리지 않습니다.", resort: "객실, 프라이버시와 조용함을 예약 전에 확인합니다.", snow: "추위 속 이동과 따뜻한 휴식을 함께 계획합니다.", landscape: "대표 명소 밖으로 이어지는 규모도 보여 줍니다." } },
  th: { eyebrow: "เส้นทางผ่านภาพจริง", title: "หกช่วงเวลาตลอดเส้นทาง", intro: "ภาพทุกภาพตรงกับจุดแวะหรือเมืองที่พักในแผนรายวัน", day: (n) => `วันที่ ${n.replace("-", "–")}`, notes: { city: "เริ่มต้นอย่างสบายในเมืองก่อนเข้าสู่ภูมิทัศน์กว้างใหญ่", lake: "กันเวลาไว้ให้ผืนน้ำและแสงที่เปลี่ยนไป", road: "การเดินทางที่จำเป็นถูกออกแบบให้เป็นส่วนหนึ่งของทริป", grassland: "พักสองคืนเพื่อไม่ให้ทุ่งหญ้าเป็นเพียงจุดถ่ายรูป", light: "ปรับเวลาตามฤดูกาล อากาศ และแสงที่นุ่มกว่า", stay: "เมืองที่พักเป็นส่วนหนึ่งของจังหวะที่สบาย", culture: "ให้เวลาทำความเข้าใจท้องถิ่นโดยไม่เร่งตามรายการ", museum: "เติมบริบทของภูมิภาคก่อนหรือหลังภูมิทัศน์เปิดกว้าง", desert: "เลือกเวลาทะเลทรายตามอุณหภูมิ แสง และกำลัง", coast: "เว้นพื้นที่ให้ทะเลโดยไม่อัดจุดแวะ", resort: "ตรวจห้อง ความเป็นส่วนตัว และความสงบก่อนยืนยัน", snow: "วางแผนการเดินทางในอากาศหนาวพร้อมจุดพักอุ่น", landscape: "อีกมุมหนึ่งช่วยให้เห็นขนาดที่ไกลกว่าจุดหลัก" } },
  ru: { eyebrow: "Маршрут в реальных кадрах", title: "Шесть моментов по пути", intro: "Каждая фотография связана с конкретной остановкой или ночёвкой программы.", day: (n) => `${n.includes("-") ? "Дни" : "День"} ${n.replace("-", "–")}`, notes: { city: "Спокойное начало в городе перед большими пейзажами.", lake: "Для воды и меняющегося света оставлено настоящее время.", road: "Необходимый переезд становится частью путешествия.", grassland: "Две ночи не превращают степь в короткую фотостопку.", light: "Время меняется по сезону, погоде и мягкому свету.", stay: "Место ночёвки входит в план комфорта.", culture: "Региону уделено время без гонки по списку достопримечательностей.", museum: "Краткий культурный контекст до или после открытых пейзажей.", desert: "Время в дюнах зависит от температуры, света и сил.", coast: "У моря остаётся пространство без лишних остановок.", resort: "Номер, приватность и тишина проверяются заранее.", snow: "Переезды на холоде планируются вместе с тёплыми паузами.", landscape: "Второй ракурс показывает масштаб за пределами главной точки." } },
};

function gallery(slug, locale) {
  const language = ui[locale];
  const cards = routes[slug].map(([src, days, note, names]) => {
    const label = `${language.day(days)} · ${names[locale]}`;
    return `<figure class="material-card"><img loading="lazy" src="${src}" alt="${label}"><figcaption><b>${label}</b><span>${language.notes[note]}</span></figcaption></figure>`;
  }).join("");
  const headingClass = locale === "en" || locale === "ru" ? "" : ' class="cjk-title"';
  return `<!-- real-scenes-start -->\n    <section class="section material-notes-band" id="real-scenes"><div class="wrap material-notes-wrap"><div class="material-notes-intro"><div><p class="eyebrow">${language.eyebrow}</p><h2${headingClass}>${language.title}</h2></div><p>${language.intro}</p></div><div class="material-grid">${cards}</div></div></section>\n    <!-- real-scenes-end -->`;
}

for (const [slug, files] of Object.entries(pageFiles)) {
  for (const [file, locale] of files) {
    let html = await fs.readFile(file, "utf8");
    const block = gallery(slug, locale);
    if (/<!-- real-scenes-start -->[\s\S]*?<!-- real-scenes-end -->/.test(html)) {
      html = html.replace(/<!-- real-scenes-start -->[\s\S]*?<!-- real-scenes-end -->/, block);
    } else if (/<section class="section material-notes-band"[\s\S]*?<\/section>/.test(html)) {
      html = html.replace(/<section class="section material-notes-band"[\s\S]*?<\/section>/, block);
    } else {
      const anchor = html.search(/<section class="section (?:content-95-band|content-note-band|care-band|service-band)"/);
      if (anchor < 0) throw new Error(`No gallery insertion point in ${file}`);
      html = `${html.slice(0, anchor)}${block}\n    ${html.slice(anchor)}`;
    }
    await fs.writeFile(file, html);
  }
}

console.log("Expanded Xinjiang, Inner Mongolia, Sanya and Northeast route galleries to six real photographs in every language.");
