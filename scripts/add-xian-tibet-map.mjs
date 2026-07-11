import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const styleVersion = "20260711-rhythm9";
const languages = ["en", "zh", "ja", "ko", "th", "ru"];
const allDestinations = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet"];

const ui = {
  en: {
    lang: "en", home: "/", interest: "/route-note/", stories: "/stories.html", before: "/before-china/",
    nav: ["Destinations", "Stories", "Before China"], cta: "Plan a private journey", back: "All routes",
    from: "Starting price", groupLabel: "Private group", group: "Private from 2 travellers · public starting price based on 6",
    route: "Route", pace: "Pace", fit: "Best for", season: "Best season", standard: "Standard private route",
    days: "Day by day", daysIntro: "One clear plan first; dates, rooms and daily pace are adjusted after enquiry.", stay: "Night",
    scenes: "Along the route", specifics: "What is arranged first", view: "View this route", mapReset: "View all China",
    mapEyebrow: "Choose on the map", mapTitle: "Where would you like to go next?", mapIntro: "Choose a marker to see the length, route and RMB starting price before opening the full plan.",
    duration: "Length", mapPrice: "From", mapRoute: "Route", fallback: "Choose a destination below to see its route.",
    finalEyebrow: "Start with the route", finalTitle: "Share your dates and preferred pace", finalBody: "We reply with availability, the suitable room level and a first quotation direction.",
    heroLead: "From Yunnan and Xinjiang to Xi'an and Tibet, private routes begin with your dates, pace and comfort needs.",
  },
  zh: {
    lang: "zh-Hant", home: "/zh.html", interest: "/zh/interest/", stories: "/zh/stories/", before: "/zh/before-china/",
    nav: ["目的地", "故事", "出發準備"], cta: "規劃私人旅程", back: "查看所有路線",
    from: "參考起價", groupLabel: "私人成行", group: "2 人起私人成行 · 公開起價以 6 人同行計",
    route: "路線", pace: "節奏", fit: "適合", season: "合適季節", standard: "標準私人方案",
    days: "每日安排", daysIntro: "先看完整路線；日期、房型與每天節奏在諮詢後再調整。", stay: "住宿",
    scenes: "沿途會看見", specifics: "先安排好的重要細節", view: "查看這條路線", mapReset: "看全中國",
    mapEyebrow: "從地圖選目的地", mapTitle: "從中國地圖開始選路線", mapIntro: "點一個目的地，即時查看天數、路線與人民幣起價。",
    duration: "天數", mapPrice: "起價", mapRoute: "路線", fallback: "請從下方選擇目的地查看方案。",
    finalEyebrow: "從路線開始", finalTitle: "留下日期與想要的步調", finalBody: "我們會回覆檔期、合適房型與第一版報價方向。",
    heroLead: "從雲南、新疆到西安與西藏，依日期、步調與舒適需求安排 2 人起私人路線。",
  },
  ja: {
    lang: "ja", home: "/ja.html", interest: "/ja/interest/", stories: "/ja/stories/", before: "/before-china/",
    nav: ["目的地", "ストーリー", "出発準備"], cta: "個人旅行を相談", back: "すべての旅程",
    from: "参考料金", groupLabel: "プライベート", group: "2名様から · 公開料金は6名利用時の目安",
    route: "ルート", pace: "旅のペース", fit: "おすすめ", season: "おすすめ時期", standard: "モデルプライベート旅程",
    days: "日ごとの旅程", daysIntro: "まず全体像を確認し、日程・客室・毎日のペースは相談後に調整します。", stay: "宿泊",
    scenes: "旅の風景", specifics: "先に整えること", view: "この旅程を見る", mapReset: "中国全体を見る",
    mapEyebrow: "地図から選ぶ", mapTitle: "次の中国を地図から選ぶ", mapIntro: "目的地を選ぶと、日数・ルート・人民元の参考料金がすぐに表示されます。",
    duration: "日数", mapPrice: "参考料金", mapRoute: "ルート", fallback: "下の目的地から旅程を選んでください。",
    finalEyebrow: "旅程から始める", finalTitle: "日程と希望のペースを教えてください", finalBody: "空き状況、客室の目安、最初のお見積り方針を返信します。",
    heroLead: "雲南・新疆から西安・チベットまで、日程と心地よさに合わせた個人旅行を2名様から整えます。",
  },
  ko: {
    lang: "ko", home: "/ko.html", interest: "/ko/interest/", stories: "/ko/stories/", before: "/before-china/",
    nav: ["목적지", "이야기", "출발 준비"], cta: "프라이빗 여행 상담", back: "모든 일정 보기",
    from: "참고 시작가", groupLabel: "프라이빗", group: "2인부터 · 공개 시작가는 6인 기준",
    route: "경로", pace: "여행 속도", fit: "추천 대상", season: "추천 시기", standard: "표준 프라이빗 일정",
    days: "일자별 일정", daysIntro: "먼저 전체 경로를 보고 날짜, 객실, 매일의 속도는 상담 후 조정합니다.", stay: "숙박",
    scenes: "여정의 풍경", specifics: "먼저 준비하는 것", view: "이 일정 보기", mapReset: "중국 전체 보기",
    mapEyebrow: "지도에서 선택", mapTitle: "다음 중국 여행을 지도에서 고르세요", mapIntro: "목적지를 선택하면 기간, 경로, 위안화 시작가가 바로 표시됩니다.",
    duration: "기간", mapPrice: "시작가", mapRoute: "경로", fallback: "아래 목적지를 선택해 일정을 확인하세요.",
    finalEyebrow: "일정에서 시작", finalTitle: "날짜와 원하는 속도를 알려 주세요", finalBody: "가능 일정, 객실 수준, 첫 견적 방향을 답변드립니다.",
    heroLead: "윈난과 신장에서 시안과 티베트까지, 날짜와 편안함에 맞춘 2인 이상 프라이빗 일정을 준비합니다.",
  },
  th: {
    lang: "th", home: "/th.html", interest: "/th/interest/", stories: "/th/stories/", before: "/before-china/",
    nav: ["จุดหมาย", "เรื่องราว", "เตรียมตัว"], cta: "วางแผนทริปส่วนตัว", back: "ดูทุกเส้นทาง",
    from: "ราคาอ้างอิง", groupLabel: "กลุ่มส่วนตัว", group: "เริ่มที่ 2 คน · ราคาเผยแพร่อ้างอิงกลุ่ม 6 คน",
    route: "เส้นทาง", pace: "จังหวะ", fit: "เหมาะสำหรับ", season: "ช่วงที่เหมาะ", standard: "เส้นทางส่วนตัวมาตรฐาน",
    days: "แผนรายวัน", daysIntro: "ดูเส้นทางทั้งหมดก่อน แล้วค่อยปรับวันที่ ห้องพัก และจังหวะรายวันหลังสอบถาม", stay: "พักที่",
    scenes: "ภาพระหว่างทาง", specifics: "สิ่งที่จัดเตรียมก่อน", view: "ดูเส้นทางนี้", mapReset: "ดูแผนที่จีนทั้งหมด",
    mapEyebrow: "เลือกจากแผนที่", mapTitle: "เลือกทริปจีนครั้งถัดไปจากแผนที่", mapIntro: "เลือกจุดหมายเพื่อดูจำนวนวัน เส้นทาง และราคาเริ่มต้นเป็นหยวนทันที",
    duration: "ระยะเวลา", mapPrice: "ราคาเริ่มต้น", mapRoute: "เส้นทาง", fallback: "เลือกจุดหมายด้านล่างเพื่อดูเส้นทาง",
    finalEyebrow: "เริ่มจากเส้นทาง", finalTitle: "บอกวันที่และจังหวะที่ต้องการ", finalBody: "เราจะตอบเรื่องวันว่าง ระดับห้องพัก และแนวทางราคาเบื้องต้น",
    heroLead: "ตั้งแต่ยูนนานและซินเจียงถึงซีอานและทิเบต เราจัดเส้นทางส่วนตัวเริ่มที่ 2 คนตามวันและความสบายที่ต้องการ",
  },
  ru: {
    lang: "ru", home: "/ru.html", interest: "/ru/interest/", stories: "/ru/stories/", before: "/before-china/",
    nav: ["Маршруты", "Истории", "Перед поездкой"], cta: "Запросить маршрут", back: "Все маршруты",
    from: "Стартовая цена", groupLabel: "Частная группа", group: "От 2 человек · опубликованная цена рассчитана на 6",
    route: "Маршрут", pace: "Темп", fit: "Кому подходит", season: "Лучшее время", standard: "Стандартный частный маршрут",
    days: "Маршрут по дням", daysIntro: "Сначала ясный план; даты, номер и темп каждого дня уточняются после запроса.", stay: "Ночь",
    scenes: "По дороге", specifics: "Что согласуем заранее", view: "Открыть маршрут", mapReset: "Вся карта Китая",
    mapEyebrow: "Выберите на карте", mapTitle: "Куда отправиться по Китаю дальше", mapIntro: "Выберите точку, чтобы увидеть длительность, маршрут и стартовую цену в юанях.",
    duration: "Длительность", mapPrice: "Цена", mapRoute: "Маршрут", fallback: "Выберите направление ниже, чтобы увидеть маршрут.",
    finalEyebrow: "Начните с маршрута", finalTitle: "Назовите даты и желаемый темп", finalBody: "Мы ответим по наличию, уровню номера и направлению первой сметы.",
    heroLead: "От Юньнани и Синьцзяна до Сианя и Тибета: частные маршруты от 2 человек с учётом дат и комфорта.",
  },
};

const routeAssets = {
  xian: {
    price: 6800,
    hero: "/assets/real-xian/xian-yongning-gate-night.jpg",
    standard: "/assets/real-xian/xian-city-wall-night.jpg",
    gallery: [
      "/assets/real-xian/xian-terracotta-army.jpg",
      "/assets/real-xian/xian-giant-wild-goose-pagoda.jpg",
      "/assets/real-xian/xian-bell-tower.jpg",
      "/assets/real-xian/xian-muslim-quarter.jpg",
      "/assets/real-xian/xian-shaanxi-history-museum.jpg",
    ],
  },
  tibet: {
    price: 18800,
    hero: "/assets/real-tibet/tibet-potala-palace.jpg",
    standard: "/assets/real-tibet/tibet-yamdrok-lake.jpg",
    gallery: [
      "/assets/real-tibet/tibet-barkhor-square.jpg",
      "/assets/real-tibet/tibet-jokhang.jpg",
      "/assets/real-tibet/tibet-gyantse-kumbum.jpg",
      "/assets/real-tibet/tibet-tashilhunpo.jpg",
      "/assets/real-tibet/tibet-sera-monastery.jpg",
    ],
  },
};

const extraGalleryCaptions = {
  xian: {
    en: "Shaanxi History Museum · reserve the visit before arrival", zh: "陝西歷史博物館 · 重要館藏提前預約", ja: "陝西歴史博物館 · 入場を事前予約", ko: "산시 역사박물관 · 입장 사전 예약", th: "พิพิธภัณฑ์ประวัติศาสตร์ส่านซี · จองล่วงหน้า", ru: "Исторический музей Шэньси · вход бронируется заранее",
  },
  tibet: {
    en: "Sera Monastery · a lighter reserve-day visit", zh: "色拉寺 · 適合彈性日的較輕停留", ja: "セラ寺 · 予備日に組みやすい訪問", ko: "세라 사원 · 예비일의 가벼운 일정", th: "อารามเซรา · เหมาะกับวันสำรอง", ru: "Монастырь Сера · лёгкий вариант для резервного дня",
  },
};

const routeCopy = {
  xian: {
    en: {
      name: "Xi'an Ancient Capital · 5 Days", short: "Xi'an", title: ["Xi'an in five days", "City walls, dynasties and time"],
      lead: "From the city wall at night to the Terracotta Army, the ancient capital opens without rushing.",
      description: "Stay four nights in the ancient capital, explore the old city after dark, reserve a full day for Lintong, and keep museum time separate from transfers.",
      duration: "5 days 4 nights", route: "Xi'an old city → Lintong → Xi'an", pace: "One major theme each day", fit: "History, architecture and food", season: "March–May · September–November",
      note: "Land-arrangement reference price based on 6 travellers. Flights, selected performances and upgraded rooms are confirmed separately.",
      galleryTitle: "Five days with enough room to look", galleryIntro: "The route balances the old city, imperial sites and one quieter cultural day.",
      captions: ["Terracotta Army · a full Lintong day", "Giant Wild Goose Pagoda · Tang-era context", "Bell Tower · the old-city axis", "Muslim Quarter · an evening of local flavours"],
      days: [
        ["Arrive and settle into the old city", "Private pickup, hotel check-in and a quiet first evening near the city wall.", "Xi'an"],
        ["City wall, Bell Tower and the old lanes", "Walk or cycle the wall at a comfortable hour, then continue to the Bell Tower and Muslim Quarter.", "Xi'an"],
        ["Terracotta Army and Lintong", "A dedicated private-car day for the Terracotta Army, with Huaqing Palace added only if the pace remains comfortable.", "Xi'an"],
        ["Museum, pagoda and Tang culture", "Reserve museum entry in advance, then leave the late afternoon for the Giant Wild Goose Pagoda district.", "Xi'an"],
        ["A slow morning before departure", "Keep breakfast and the final transfer unhurried; add one nearby stop only when the departure time allows.", "Departure"],
      ],
      specifics: [["Private movement", "Airport or station pickup and the Lintong day by private vehicle."], ["Reservations", "Museum, Terracotta Army and selected performance tickets are confirmed before arrival."], ["Hotel rhythm", "Four nights in one Xi'an hotel to avoid packing every day."]],
    },
    zh: {
      name: "西安古都 5 天 4 晚", short: "西安", title: ["西安古都五日", "把時間留給城牆與盛唐"],
      lead: "從城牆夜色到兵馬俑，一座古都用五天慢慢打開。",
      description: "西安古都 5 天 4 晚私人路線：連住四晚，把城牆夜色、兵馬俑、陝西歷史博物館與大雁塔分開安排，不讓景點與轉場擠在同一個下午。",
      duration: "5 天 4 晚", route: "西安古城 → 臨潼 → 西安", pace: "每天一個主要主題", fit: "歷史、建築與地方飲食", season: "3–5 月 · 9–11 月",
      note: "此為 6 人同行的地接安排參考起價；往返機票、指定演出與升級房型另行確認。",
      galleryTitle: "五天足夠好好看一座古都", galleryIntro: "古城、帝陵與盛唐文化分開安排，不把每個景點塞進同一天。",
      captions: ["兵馬俑 · 臨潼完整一天", "大雁塔 · 讀懂盛唐脈絡", "鐘樓 · 古城中軸", "回民街 · 留給夜晚的地方味道"],
      days: [
        ["抵達西安 安靜落地", "私人接站、入住古城周邊，第一晚只留一段城牆夜色。", "西安"],
        ["城牆 鐘樓與老城巷弄", "在舒服的時間走城牆，再進鐘樓與回民街，不把夜晚趕成打卡。", "西安"],
        ["兵馬俑與臨潼", "專車完整安排臨潼；華清宮是否加入，依當天體力與停留時間決定。", "西安"],
        ["博物館 大雁塔與盛唐", "重要館藏提前預約，午後留給大雁塔街區與一場從容的晚餐。", "西安"],
        ["慢慢吃完早餐再離開", "依班機或車次安排送站；時間足夠才加入附近的一個停留。", "返程"],
      ],
      specifics: [["私人移動", "機場或車站接送，臨潼當日使用私人車輛。"], ["重要預訂", "博物館、兵馬俑與指定演出在抵達前確認。"], ["住宿節奏", "西安連住四晚，不讓每天整理行李。"]],
    },
    ja: {
      name: "西安 古都5日間", short: "西安", title: ["西安を五日で", "城壁と唐の時代をゆっくり"],
      lead: "城壁の夜景から兵馬俑まで、古都を急がずにひらく五日間です。",
      description: "西安に4連泊し、城壁の夜景、兵馬俑、陝西歴史博物館、大雁塔を五日間に分けて巡る、移動を詰め込みすぎないプライベート旅程です。",
      duration: "5日4泊", route: "西安旧城 → 臨潼 → 西安", pace: "一日一つの主要テーマ", fit: "歴史・建築・食文化", season: "3–5月 · 9–11月",
      note: "6名利用時の現地手配参考料金です。往復航空券、指定公演、客室アップグレードは別途確認します。",
      galleryTitle: "五日あれば 古都をきちんと見られる", galleryIntro: "旧城、帝陵、唐文化を分け、同じ日に詰め込みません。",
      captions: ["兵馬俑 · 臨潼に一日", "大雁塔 · 唐代の文脈", "鐘楼 · 旧城の軸", "回民街 · 夜に味わう西安"],
      days: [["西安到着 静かに旅を始める", "専用車で迎え、旧城近くに宿泊。初日は城壁の夜景だけを楽しみます。", "西安"], ["城壁・鐘楼・旧市街", "心地よい時間に城壁を歩き、鐘楼と回民街へ。夜を急がせません。", "西安"], ["兵馬俑と臨潼", "専用車で臨潼へ。華清宮は当日の体力と滞在時間を見て加えます。", "西安"], ["博物館・大雁塔・唐文化", "主要展示を事前予約し、午後は大雁塔周辺と落ち着いた夕食へ。", "西安"], ["朝食のあと ゆっくり出発", "便の時間に合わせて送迎し、余裕がある場合のみ近隣を一か所訪れます。", "帰路"],
      ],
      specifics: [["専用車", "空港・駅送迎と臨潼の日は専用車で移動します。"], ["事前予約", "博物館、兵馬俑、希望公演を到着前に確認します。"], ["連泊", "西安に4連泊し、毎日の荷造りをなくします。"]],
    },
    ko: {
      name: "시안 고도 5일", short: "시안", title: ["시안을 닷새 동안", "성벽과 당나라의 시간을 천천히"],
      lead: "성벽의 밤부터 병마용까지, 고도를 서두르지 않고 여는 5일입니다.",
      description: "시안에서 4박하며 성벽의 밤, 병마용, 산시 역사박물관과 대안탑을 닷새에 나누어 보는 여유로운 프라이빗 일정입니다.",
      duration: "5일 4박", route: "시안 구시가지 → 린퉁 → 시안", pace: "하루 한 가지 핵심 주제", fit: "역사·건축·음식", season: "3–5월 · 9–11월",
      note: "6인 기준 현지 일정 참고 시작가입니다. 왕복 항공, 지정 공연, 객실 업그레이드는 별도 확인합니다.",
      galleryTitle: "닷새면 고도를 제대로 볼 수 있습니다", galleryIntro: "구시가지, 황제릉, 당 문화를 나누어 같은 날 몰아넣지 않습니다.",
      captions: ["병마용 · 린퉁에서 온전한 하루", "대안탑 · 당나라의 맥락", "종루 · 구시가지의 중심", "회민가 · 밤에 만나는 시안의 맛"],
      days: [["시안 도착 조용히 시작", "전용 픽업 후 구시가지 가까이 체크인하고 첫날은 성벽의 밤만 남깁니다.", "시안"], ["성벽 종루와 옛 골목", "편안한 시간에 성벽을 걷고 종루와 회민가로 이어 갑니다.", "시안"], ["병마용과 린퉁", "전용 차량으로 린퉁을 온전히 봅니다. 화청궁은 당일 체력에 따라 더합니다.", "시안"], ["박물관 대안탑과 당 문화", "중요 전시는 미리 예약하고 오후는 대안탑 일대와 느긋한 저녁에 둡니다.", "시안"], ["아침을 마치고 출발", "항공이나 열차 시간에 맞춰 이동하며 여유가 있을 때만 가까운 곳을 한 군데 봅니다.", "귀가"],
      ],
      specifics: [["전용 이동", "공항·역 픽업과 린퉁 일정은 전용 차량으로 진행합니다."], ["중요 예약", "박물관, 병마용, 선택 공연을 도착 전에 확인합니다."], ["한 호텔 연박", "시안에서 4연박해 매일 짐을 싸지 않습니다."]],
    },
    th: {
      name: "ซีอาน เมืองหลวงโบราณ 5 วัน", short: "ซีอาน", title: ["ซีอานในห้าวัน", "กำแพงเมืองและยุคราชวงศ์ถัง"],
      lead: "จากกำแพงเมืองยามค่ำถึงกองทัพทหารดินเผา เปิดเมืองโบราณอย่างไม่เร่งรีบ",
      description: "พักโรงแรมเดียวในซีอาน 4 คืน แยกคืนในเมืองเก่า วันเต็มที่หลินถง และเวลาพิพิธภัณฑ์ออกจากกัน",
      duration: "5 วัน 4 คืน", route: "เมืองเก่าซีอาน → หลินถง → ซีอาน", pace: "หนึ่งหัวข้อสำคัญต่อวัน", fit: "ประวัติศาสตร์ สถาปัตยกรรม และอาหาร", season: "มีนาคม–พฤษภาคม · กันยายน–พฤศจิกายน",
      note: "ราคาอ้างอิงภาคพื้นดินสำหรับ 6 ท่าน ไม่รวมเที่ยวบิน การแสดงที่ระบุ และการอัปเกรดห้องพัก",
      galleryTitle: "ห้าวันที่มีเวลามองเมืองเก่าให้ชัด", galleryIntro: "แยกเมืองเก่า สุสานจักรพรรดิ และวัฒนธรรมราชวงศ์ถัง ไม่ยัดไว้วันเดียว",
      captions: ["กองทัพทหารดินเผา · หนึ่งวันเต็มที่หลินถง", "เจดีย์ห่านป่าใหญ่ · บริบทราชวงศ์ถัง", "หอระฆัง · แกนกลางเมืองเก่า", "ย่านมุสลิม · รสชาติของซีอานยามค่ำ"],
      days: [["ถึงซีอานและพักให้สบาย", "รถส่วนตัวรับและเช็กอินใกล้เมืองเก่า คืนแรกเหลือเพียงแสงบนกำแพงเมือง", "ซีอาน"], ["กำแพงเมือง หอระฆัง และตรอกเก่า", "เดินกำแพงในเวลาที่สบาย แล้วต่อหอระฆังและย่านมุสลิมโดยไม่เร่งค่ำคืน", "ซีอาน"], ["กองทัพทหารดินเผาและหลินถง", "ใช้รถส่วนตัวตลอดวัน เพิ่มพระราชวังหัวชิงเมื่อเวลาและกำลังเหมาะสม", "ซีอาน"], ["พิพิธภัณฑ์ เจดีย์ และวัฒนธรรมถัง", "จองพิพิธภัณฑ์ล่วงหน้า ช่วงบ่ายให้เจดีย์ห่านป่าใหญ่และมื้อเย็นสบาย ๆ", "ซีอาน"], ["เช้าไม่รีบก่อนเดินทางกลับ", "ส่งสนามบินหรือสถานีตามเวลา เพิ่มเพียงหนึ่งจุดใกล้ ๆ เมื่อมีเวลาพอ", "เดินทางกลับ"],
      ],
      specifics: [["รถส่วนตัว", "รับสนามบินหรือสถานี และใช้รถส่วนตัวตลอดวันหลินถง"], ["จองล่วงหน้า", "ยืนยันพิพิธภัณฑ์ ทหารดินเผา และการแสดงก่อนเดินทาง"], ["พักต่อเนื่อง", "พักโรงแรมเดียวในซีอาน 4 คืน ไม่ต้องเก็บกระเป๋าทุกวัน"]],
    },
    ru: {
      name: "Сиань · 5 дней в древней столице", short: "Сиань", title: ["Пять дней в Сиане", "Стены города и эпоха Тан"],
      lead: "От вечерней стены до Терракотовой армии — древняя столица раскрывается без спешки.",
      description: "Четыре ночи в одном отеле, отдельный вечер для старого города, полный день в Линьтуне и музей без спешных переездов.",
      duration: "5 дней / 4 ночи", route: "Старый Сиань → Линьтун → Сиань", pace: "Одна главная тема в день", fit: "История, архитектура и кухня", season: "Март–май · сентябрь–ноябрь",
      note: "Ориентировочная наземная цена для 6 человек. Перелёт, выбранные шоу и повышение категории номера подтверждаются отдельно.",
      galleryTitle: "Пять дней чтобы увидеть город", galleryIntro: "Старый город, императорские памятники и культура Тан не собраны в один перегруженный день.",
      captions: ["Терракотовая армия · полный день в Линьтуне", "Большая пагода диких гусей · эпоха Тан", "Колокольная башня · ось старого города", "Мусульманский квартал · вечерние вкусы Сианя"],
      days: [["Прибытие и спокойное начало", "Частная встреча, заселение рядом со старым городом и только вечерняя стена в первый день.", "Сиань"], ["Стена, Колокольная башня и старые улицы", "Прогулка по стене в удобный час, затем башня и Мусульманский квартал.", "Сиань"], ["Терракотовая армия и Линьтун", "Полный день с частным автомобилем; дворец Хуацин добавляется только при комфортном темпе.", "Сиань"], ["Музей, пагода и культура Тан", "Билеты в музей бронируются заранее, а вторая половина дня остаётся пагоде и ужину.", "Сиань"], ["Спокойное утро и отъезд", "Трансфер под рейс или поезд; ещё одна близкая остановка только при достаточном времени.", "Отъезд"],
      ],
      specifics: [["Частный транспорт", "Встреча в аэропорту или на вокзале и отдельная машина в Линьтун."], ["Бронирования", "Музей, Терракотовая армия и выбранное шоу подтверждаются заранее."], ["Один отель", "Четыре ночи в Сиане без ежедневной упаковки багажа."]],
    },
  },
  tibet: {
    en: {
      name: "Tibet · Lhasa to Shigatse in 8 Days", short: "Tibet", title: ["Tibet in eight days", "Lhasa, Yamdrok and Shigatse"],
      lead: "A slower first two days, one clear highland road and time for documents to be arranged correctly.",
      description: "Begin with two gentle days in Lhasa, cross Yamdrok Lake to Gyantse and Shigatse, then return with one reserve day before departure.",
      duration: "8 days 7 nights", route: "Lhasa → Yamdrok Lake → Gyantse → Shigatse → Lhasa", pace: "Gentle first 48 hours", fit: "Culture, highland scenery and long-road travellers", season: "April–October",
      note: "Reference land price based on 6 travellers. Foreign visitors travel after current entry documents, local arrangements and physical suitability are confirmed; flights to Lhasa are not included.",
      galleryTitle: "The plateau is not a route to rush", galleryIntro: "The first days remain light; the longer road begins only after the body has had time to settle.",
      captions: ["Barkhor · everyday Lhasa", "Jokhang · the spiritual centre of the old city", "Gyantse Kumbum · a clear stop between lake and Shigatse", "Tashilhunpo · time inside the monastery complex"],
      days: [["Arrive in Lhasa and rest", "Private pickup, hotel check-in and no scheduled sightseeing beyond a short nearby walk.", "Lhasa"], ["Potala Palace at a gentle pace", "A reserved visit window and a quiet afternoon, keeping stairs and walking conservative.", "Lhasa"], ["Jokhang and Barkhor", "Walk the old-city circuit with time for tea, courtyards and explanations rather than extra stops.", "Lhasa"], ["Lhasa to Yamdrok Lake and Gyantse", "Cross the pass only after conditions are checked, then continue to Gyantse without a late arrival.", "Gyantse"], ["Gyantse to Shigatse", "Visit the Kumbum before driving to Shigatse and leave a proper window for Tashilhunpo.", "Shigatse"], ["Return to Lhasa", "Use the return road as a measured travel day with planned comfort stops.", "Lhasa"], ["Reserve day in Lhasa", "Keep one flexible day for weather, ticket changes or a lighter cultural visit.", "Lhasa"], ["Private departure transfer", "Leave for the airport or station with the transfer time confirmed the day before.", "Departure"],
      ],
      specifics: [["Entry documents", "Passport and visa details are checked before an eligible local operator arranges the current Tibet entry documents."], ["Altitude rhythm", "The first 48 hours stay light; medical advice and personal medication remain the traveller's responsibility."], ["Local operation", "Private vehicle, licensed local guide, accommodation and key reservations are confirmed together."]],
    },
    zh: {
      name: "西藏拉薩日喀則 8 天 7 晚", short: "西藏", title: ["西藏八日", "拉薩 羊湖 江孜與日喀則"],
      lead: "前兩天放慢，長路只走一條，入藏文件與高原節奏都先確認。",
      description: "西藏 8 天 7 晚私人路線：拉薩先留兩個緩慢日，再經羊卓雍錯、江孜到日喀則，返回拉薩前保留彈性日，入藏文件與高原節奏一併確認。",
      duration: "8 天 7 晚", route: "拉薩 → 羊卓雍錯 → 江孜 → 日喀則 → 拉薩", pace: "前 48 小時放慢", fit: "文化、高原風景與長途移動", season: "4–10 月",
      note: "此為 6 人同行地接安排參考起價；外籍旅客須待當期入藏文件、合資格地接與身體狀況確認後成行，不含往返拉薩的大交通。",
      galleryTitle: "高原不適合被趕成一張清單", galleryIntro: "前兩天只做必要停留，身體有時間安定後才開始較長的高原公路。",
      captions: ["八廓街 · 拉薩日常", "大昭寺 · 古城的精神中心", "江孜白居寺 · 羊湖與日喀則之間", "扎什倫布寺 · 留足寺院停留時間"],
      days: [["抵達拉薩 只做安頓", "私人接站、入住飯店，除附近短距離散步外不安排正式景點。", "拉薩"], ["慢慢看布達拉宮", "預約固定時段，午後留白，步行與階梯都採保守安排。", "拉薩"], ["大昭寺與八廓街", "沿古城慢慢走，留下喝茶、看院落與理解背景的時間。", "拉薩"], ["拉薩經羊湖到江孜", "確認天候與道路後翻越山口，不把抵達江孜拖到太晚。", "江孜"], ["江孜到日喀則", "先看白居寺，再前往日喀則，為扎什倫布寺留一段完整時間。", "日喀則"], ["返回拉薩", "把返程視為移動日，預先安排休息與舒適停靠。", "拉薩"], ["拉薩彈性日", "保留一天處理天候、票務變動，或安排一個較輕的文化停留。", "拉薩"], ["私人送站返程", "前一晚確認班機或車次與出發時間，從容離開高原。", "返程"],
      ],
      specifics: [["入藏文件", "先核對護照與簽證資料，再由合資格的在地服務團隊依當期規定辦理。"], ["高原節奏", "前 48 小時減量；醫療建議與個人用藥仍由旅客自行向專業人士確認。"], ["當地執行", "私人車輛、合資格當地導遊、住宿與重要預訂一併確認。"]],
    },
    ja: {
      name: "チベット ラサ・シガツェ8日間", short: "チベット", title: ["チベット八日間", "ラサ・ヤムドク湖・シガツェ"],
      lead: "最初の二日を軽くし、高原の道と入域書類を先に整える旅です。",
      description: "ラサで二日ゆっくり過ごし、ヤムドク湖、ギャンツェ、シガツェへ。出発前に一日の余白を残します。",
      duration: "8日7泊", route: "ラサ → ヤムドク湖 → ギャンツェ → シガツェ → ラサ", pace: "最初の48時間は軽め", fit: "文化・高原風景・長距離移動", season: "4–10月",
      note: "6名利用時の現地手配参考料金です。外国籍のお客様は当期の入域書類、現地手配、体調確認後に実施し、ラサまでの交通は含みません。",
      galleryTitle: "高原を急いで回らない", galleryIntro: "最初の二日は軽くし、身体が落ち着いてから長い高原道路へ進みます。",
      captions: ["バルコル · ラサの日常", "ジョカン寺 · 旧市街の中心", "ギャンツェのクンブム · 湖とシガツェの間", "タシルンポ寺 · 境内に十分な時間"],
      days: [["ラサ到着 休息を優先", "専用車で迎え、ホテルへ。近くの短い散歩以外は予定を入れません。", "ラサ"], ["ポタラ宮をゆっくり", "予約時間に訪れ、午後は余白。階段と歩行を控えめにします。", "ラサ"], ["ジョカン寺とバルコル", "旧市街をゆっくり歩き、お茶、路地、背景を知る時間を残します。", "ラサ"], ["ラサからヤムドク湖・ギャンツェ", "天候と道路を確認して峠を越え、遅くならないうちにギャンツェへ。", "ギャンツェ"], ["ギャンツェからシガツェ", "クンブムを見てから移動し、タシルンポ寺に十分な時間を確保します。", "シガツェ"], ["ラサへ戻る", "帰路も移動日として扱い、休憩場所を事前に整えます。", "ラサ"], ["ラサ予備日", "天候やチケット変更に備え、軽い文化訪問にも使える一日を残します。", "ラサ"], ["専用車で出発", "前日に便と出発時刻を確認し、空港または駅へ送ります。", "帰路"],
      ],
      specifics: [["入域書類", "旅券と査証情報を確認し、資格のある現地会社が当期の書類を手配します。"], ["高原のペース", "最初の48時間は軽め。医療相談と個人の薬は専門家に確認してください。"], ["現地手配", "専用車、資格ある現地ガイド、宿泊、主要予約をまとめて確認します。"]],
    },
    ko: {
      name: "티베트 라싸·시가체 8일", short: "티베트", title: ["티베트 8일", "라싸 얌드록초와 시가체"],
      lead: "첫 이틀은 가볍게, 고원 도로와 입경 서류는 먼저 정확히 준비합니다.",
      description: "라싸에서 이틀을 천천히 보내고 얌드록초, 장쯔, 시가체로 이동한 뒤 출발 전 하루의 여유를 둡니다.",
      duration: "8일 7박", route: "라싸 → 얌드록초 → 장쯔 → 시가체 → 라싸", pace: "첫 48시간은 가볍게", fit: "문화·고원 풍경·장거리 이동", season: "4–10월",
      note: "6인 기준 현지 일정 참고 시작가입니다. 외국인은 현행 입경 서류, 현지 운영, 건강 상태 확인 후 출발하며 라싸 왕복 교통은 포함하지 않습니다.",
      galleryTitle: "고원은 서둘러 볼 곳이 아닙니다", galleryIntro: "첫 이틀은 가볍게 두고 몸이 안정된 뒤 긴 고원 도로로 나갑니다.",
      captions: ["바코르 · 라싸의 일상", "조캉 사원 · 구시가지의 중심", "장쯔 쿰붐 · 호수와 시가체 사이", "타실훈포 사원 · 충분한 체류 시간"],
      days: [["라싸 도착 휴식 우선", "전용 픽업과 체크인 후 가까운 짧은 산책 외에는 일정을 넣지 않습니다.", "라싸"], ["포탈라궁을 천천히", "예약 시간에 방문하고 오후는 비워 계단과 걷기를 보수적으로 조절합니다.", "라싸"], ["조캉 사원과 바코르", "옛 도시를 천천히 걸으며 차, 골목, 배경 설명을 위한 시간을 남깁니다.", "라싸"], ["라싸에서 얌드록초와 장쯔", "날씨와 도로를 확인한 뒤 고개를 넘어 늦지 않게 장쯔에 도착합니다.", "장쯔"], ["장쯔에서 시가체", "쿰붐을 본 뒤 이동하고 타실훈포 사원에 충분한 시간을 둡니다.", "시가체"], ["라싸로 귀환", "귀환 도로도 이동일로 보고 편안한 휴식 지점을 미리 정합니다.", "라싸"], ["라싸 예비일", "날씨와 티켓 변경에 대비하거나 가벼운 문화 방문에 쓰는 유연한 하루입니다.", "라싸"], ["전용 차량으로 출발", "전날 항공이나 열차 시간을 확인하고 공항 또는 역으로 이동합니다.", "귀가"],
      ],
      specifics: [["입경 서류", "여권과 비자 정보를 확인하고 자격 있는 현지 운영사가 현행 서류를 준비합니다."], ["고원 속도", "첫 48시간은 가볍게. 의료 상담과 개인 약은 전문의에게 확인해야 합니다."], ["현지 운영", "전용 차량, 자격 있는 현지 가이드, 숙박, 주요 예약을 함께 확인합니다."]],
    },
    th: {
      name: "ทิเบต ลาซา–ชิกัตเซ 8 วัน", short: "ทิเบต", title: ["ทิเบตแปดวัน", "ลาซา ทะเลสาบยัมดรก และชิกัตเซ"],
      lead: "สองวันแรกเดินเบา ใช้ถนนสายหลักเพียงเส้นเดียว และจัดเอกสารเข้าเขตให้ถูกต้องก่อน",
      description: "เริ่มด้วยสองวันสบาย ๆ ในลาซา ผ่านทะเลสาบยัมดรก เกียงเซ และชิกัตเซ แล้วเหลือหนึ่งวันยืดหยุ่นก่อนกลับ",
      duration: "8 วัน 7 คืน", route: "ลาซา → ทะเลสาบยัมดรก → เกียงเซ → ชิกัตเซ → ลาซา", pace: "48 ชั่วโมงแรกเบาเป็นพิเศษ", fit: "วัฒนธรรม วิวที่ราบสูง และการเดินทางไกล", season: "เมษายน–ตุลาคม",
      note: "ราคาอ้างอิงภาคพื้นดินสำหรับ 6 ท่าน ชาวต่างชาติต้องยืนยันเอกสารเข้าเขต ผู้ดำเนินการท้องถิ่น และความเหมาะสมทางร่างกายก่อน ไม่รวมการเดินทางไปกลับลาซา",
      galleryTitle: "ที่ราบสูงไม่ควรถูกเร่งเป็นรายการ", galleryIntro: "สองวันแรกเบาไว้ก่อน แล้วเริ่มถนนยาวเมื่อร่างกายมีเวลาปรับตัว",
      captions: ["บาร์กอร์ · ชีวิตประจำวันของลาซา", "วัดโจคัง · ศูนย์กลางเมืองเก่า", "เจดีย์คุมบุม เกียงเซ · ระหว่างทะเลสาบกับชิกัตเซ", "อารามทาชิลฮุนโป · เวลาเต็มที่ในอาราม"],
      days: [["ถึงลาซาและพัก", "รถส่วนตัวรับ เช็กอิน และไม่มีโปรแกรมนอกจากเดินสั้น ๆ ใกล้โรงแรม", "ลาซา"], ["พระราชวังโปตาลาอย่างช้า ๆ", "เข้าตามเวลาจอง เว้นช่วงบ่าย และจำกัดบันไดกับการเดิน", "ลาซา"], ["วัดโจคังและบาร์กอร์", "เดินเมืองเก่าอย่างช้า ๆ มีเวลาสำหรับชา ลานบ้าน และคำอธิบาย", "ลาซา"], ["ลาซาไปทะเลสาบยัมดรกและเกียงเซ", "ตรวจอากาศและถนนก่อนข้ามช่องเขา ถึงเกียงเซโดยไม่ดึก", "เกียงเซ"], ["เกียงเซไปชิกัตเซ", "ชมคุมบุมก่อนเดินทางและเผื่อเวลาให้อารามทาชิลฮุนโป", "ชิกัตเซ"], ["กลับลาซา", "ถือเป็นวันเดินทาง วางจุดพักและความสบายไว้ล่วงหน้า", "ลาซา"], ["วันสำรองในลาซา", "เก็บไว้สำหรับอากาศ ตั๋วเปลี่ยน หรือสถานที่วัฒนธรรมที่เบากว่า", "ลาซา"], ["รถส่วนตัวส่งกลับ", "ยืนยันเที่ยวบินหรือรถไฟและเวลาออกเดินทางในคืนก่อน", "เดินทางกลับ"],
      ],
      specifics: [["เอกสารเข้าเขต", "ตรวจหนังสือเดินทางและวีซ่า แล้วให้ผู้ดำเนินการที่มีคุณสมบัติจัดเอกสารตามกฎปัจจุบัน"], ["จังหวะที่ราบสูง", "48 ชั่วโมงแรกเบา คำแนะนำทางการแพทย์และยาส่วนบุคคลต้องปรึกษาผู้เชี่ยวชาญ"], ["การดำเนินงาน", "รถส่วนตัว ไกด์ท้องถิ่นที่มีคุณสมบัติ ที่พัก และการจองสำคัญยืนยันพร้อมกัน"]],
    },
    ru: {
      name: "Тибет · Лхаса и Шигадзе за 8 дней", short: "Тибет", title: ["Тибет за восемь дней", "Лхаса, Ямдрок и Шигадзе"],
      lead: "Первые два дня проходят легко, длинная дорога остаётся одной, а документы оформляются заранее.",
      description: "Два спокойных дня в Лхасе, затем озеро Ямдрок, Гьянгдзе и Шигадзе, после чего остаётся резервный день перед отъездом.",
      duration: "8 дней / 7 ночей", route: "Лхаса → Ямдрок → Гьянгдзе → Шигадзе → Лхаса", pace: "Лёгкие первые 48 часов", fit: "Культура, высокогорье и длинные переезды", season: "Апрель–октябрь",
      note: "Ориентировочная наземная цена для 6 человек. Иностранные гости путешествуют после подтверждения текущих въездных документов, местного оператора и физической готовности; дорога до Лхасы не включена.",
      galleryTitle: "По высокогорью нельзя спешить", galleryIntro: "Первые два дня остаются лёгкими, а длинная дорога начинается после времени на адаптацию.",
      captions: ["Баркхор · повседневная Лхаса", "Джоканг · центр старого города", "Кумбум в Гьянгдзе · между озером и Шигадзе", "Ташилунпо · достаточно времени в монастыре"],
      days: [["Прибытие в Лхасу и отдых", "Частная встреча, заселение и только короткая прогулка рядом с отелем.", "Лхаса"], ["Потала в спокойном темпе", "Вход по забронированному времени, свободный день после и осторожный объём лестниц.", "Лхаса"], ["Джоканг и Баркхор", "Медленная прогулка по старому городу с временем на чай, дворы и объяснения.", "Лхаса"], ["Лхаса — Ямдрок — Гьянгдзе", "Перевал после проверки погоды и дороги, прибытие в Гьянгдзе без позднего переезда.", "Гьянгдзе"], ["Гьянгдзе — Шигадзе", "Кумбум утром, затем переезд и полноценное время для монастыря Ташилунпо.", "Шигадзе"], ["Возвращение в Лхасу", "Обратная дорога остаётся отдельным днём с заранее выбранными остановками.", "Лхаса"], ["Резервный день в Лхасе", "Гибкий день для погоды, изменений билетов или лёгкого культурного визита.", "Лхаса"], ["Частный трансфер на отъезд", "Время рейса или поезда подтверждается накануне.", "Отъезд"],
      ],
      specifics: [["Въездные документы", "Данные паспорта и визы проверяются до оформления текущих документов подходящим местным оператором."], ["Высотный ритм", "Первые 48 часов остаются лёгкими; медицинские рекомендации и личные лекарства обсуждаются со специалистом."], ["Местная работа", "Частная машина, лицензированный гид, отель и основные брони подтверждаются вместе."]],
    },
  },
};

const coords = {
  yunnan: [25.04, 102.72], xinjiang: [43.82, 87.62], dunhuang: [36.62, 101.78],
  "inner-mongolia": [40.84, 111.75], sanya: [20.04, 110.2], northeast: [45.8, 126.53],
  xian: [34.34, 108.94], tibet: [29.65, 91.17],
};

const destinationNames = {
  en: { yunnan: "Yunnan", xinjiang: "Xinjiang", dunhuang: "Qinghai & Gansu", "inner-mongolia": "Inner Mongolia", sanya: "Hainan", northeast: "Northeast", xian: "Xi'an", tibet: "Tibet" },
  zh: { yunnan: "雲南", xinjiang: "新疆", dunhuang: "青甘", "inner-mongolia": "內蒙古", sanya: "海南", northeast: "東北", xian: "西安", tibet: "西藏" },
  ja: { yunnan: "雲南", xinjiang: "新疆", dunhuang: "青海・甘粛", "inner-mongolia": "内モンゴル", sanya: "海南島", northeast: "東北", xian: "西安", tibet: "チベット" },
  ko: { yunnan: "윈난", xinjiang: "신장", dunhuang: "칭하이·간쑤", "inner-mongolia": "내몽골", sanya: "하이난", northeast: "동북", xian: "시안", tibet: "티베트" },
  th: { yunnan: "ยูนนาน", xinjiang: "ซินเจียง", dunhuang: "ชิงไห่–กานซู่", "inner-mongolia": "มองโกเลียใน", sanya: "ไหหลำ", northeast: "ตะวันออกเฉียงเหนือ", xian: "ซีอาน", tibet: "ทิเบต" },
  ru: { yunnan: "Юньнань", xinjiang: "Синьцзян", dunhuang: "Цинхай и Ганьсу", "inner-mongolia": "Внутренняя Монголия", sanya: "Хайнань", northeast: "Северо-Восток", xian: "Сиань", tibet: "Тибет" },
};

const homeTargets = [
  { file: "index.html", locale: "en", routeLocale: null },
  { file: "en.html", locale: "en", routeLocale: "en" },
  { file: "en/index.html", locale: "en", routeLocale: "en" },
  { file: "zh.html", locale: "zh", routeLocale: "zh" },
  { file: "zh/index.html", locale: "zh", routeLocale: "zh" },
  { file: "ja.html", locale: "ja", routeLocale: "ja" },
  { file: "ja/index.html", locale: "ja", routeLocale: "ja" },
  { file: "ko.html", locale: "ko", routeLocale: "ko" },
  { file: "ko/index.html", locale: "ko", routeLocale: "ko" },
  { file: "th.html", locale: "th", routeLocale: "th" },
  { file: "th/index.html", locale: "th", routeLocale: "th" },
  { file: "ru.html", locale: "ru", routeLocale: "ru" },
  { file: "ru/index.html", locale: "ru", routeLocale: "ru" },
];

const homeHeroScenes = [
  "scene-yunnan",
  "scene-xinjiang",
  "scene-dunhuang",
  "scene-mongolia",
  "scene-sanya",
  "scene-northeast",
  "scene-xian",
  "scene-tibet",
].map((scene) => `<div class="hero-scene ${scene}"></div>`).join("");

function esc(value = "") {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function routeHref(slug, locale) {
  if (locale === "en" || !locale) return `/${slug}.html`;
  return `/${locale}/${slug}/`;
}

function routeFile(slug, locale) {
  if (!locale) return `${slug}.html`;
  return `${locale}/${slug}/index.html`;
}

function interestHref(locale, slug) {
  return `${ui[locale].interest}?utm_source=${slug}&utm_medium=site&utm_campaign=private_route_consultation&destination=${slug}`;
}

function languageMenu(locale, slug) {
  const labels = { en: ["English", "EN"], zh: ["繁體中文", "中"], ja: ["日本語", "日"], ko: ["한국어", "한"], th: ["ไทย", "ไทย"], ru: ["Русский", "RU"] };
  const links = languages.map((code) => `<a href="${routeHref(slug, code)}" lang="${code}"${code === locale ? ' aria-current="page"' : ""}><span>${labels[code][0]}</span><small>${labels[code][1]}</small></a>`).join("");
  return `<details class="language-menu"><summary aria-label="Choose language"><span>${labels[locale][1]}</span></summary><div class="language-options">${links}</div></details>`;
}

function hreflang(slug) {
  return `<link rel="alternate" hreflang="en" href="https://bluehourchina.com/${slug}.html"><link rel="alternate" hreflang="zh-Hant" href="https://bluehourchina.com/zh/${slug}/"><link rel="alternate" hreflang="ja" href="https://bluehourchina.com/ja/${slug}/"><link rel="alternate" hreflang="ko" href="https://bluehourchina.com/ko/${slug}/"><link rel="alternate" hreflang="th" href="https://bluehourchina.com/th/${slug}/"><link rel="alternate" hreflang="ru" href="https://bluehourchina.com/ru/${slug}/"><link rel="alternate" hreflang="x-default" href="https://bluehourchina.com/${slug}.html">`;
}

function dayLabel(locale, number) {
  if (locale === "zh") return `第 ${number} 天`;
  if (locale === "ja") return `${number}日目`;
  if (locale === "ko") return `${number}일 차`;
  if (locale === "th") return `วันที่ ${number}`;
  if (locale === "ru") return `День ${number}`;
  return `Day ${number}`;
}

function groupMarkup(locale) {
  return ui[locale].group.split(" · ").map((part) => `<span class="term-line">${esc(part)}</span>`).join("");
}

function productSchema(slug, locale, data, canonical) {
  const assets = routeAssets[slug];
  return {
    "@context": "https://schema.org", "@type": "Product", name: data.name,
    brand: { "@type": "Brand", name: "Bluehour China Journeys" },
    description: data.description, image: `https://bluehourchina.com${assets.hero}`, url: canonical,
    offers: { "@type": "Offer", priceCurrency: "CNY", price: String(assets.price), availability: "https://schema.org/InStock", url: canonical },
    additionalProperty: [
      { "@type": "PropertyValue", name: ui[locale].route, value: data.route },
      { "@type": "PropertyValue", name: "Duration", value: data.duration },
      { "@type": "PropertyValue", name: ui[locale].groupLabel, value: ui[locale].group },
      { "@type": "PropertyValue", name: ui[locale].season, value: data.season },
      { "@type": "PropertyValue", name: "Public starting price basis", value: "6 travellers" },
    ],
  };
}

function routePage(slug, locale, canonicalOverride) {
  const l = ui[locale];
  const data = routeCopy[slug][locale];
  const assets = routeAssets[slug];
  const canonical = canonicalOverride || `https://bluehourchina.com${routeHref(slug, locale)}`;
  const cta = interestHref(locale, slug);
  const menu = languageMenu(locale, slug);
  const group = groupMarkup(locale);
  const brand = locale === "zh" ? "<strong>若青中國</strong><span>BLUEHOUR CHINA</span>" : "<strong>Bluehour China</strong><span>若青中國旅策</span>";
  const dayItems = data.days.map(([heading, body, stay], index) => `<article class="route-day-item"><div class="route-day-index">${dayLabel(locale, index + 1)}</div><div class="route-day-copy"><h3>${esc(heading)}</h3><p>${esc(body)}</p><span>${esc(l.stay)} · ${esc(stay)}</span></div></article>`).join("");
  const galleryCaptions = [...data.captions, extraGalleryCaptions[slug][locale]];
  const gallery = assets.gallery.map((image, index) => `<figure><img loading="lazy" src="${image}" alt="${esc(galleryCaptions[index])}"><figcaption>${esc(galleryCaptions[index])}</figcaption></figure>`).join("");
  const specifics = data.specifics.map(([heading, body]) => `<article><h3>${esc(heading)}</h3><p>${esc(body)}</p></article>`).join("");
  const routeStops = data.route.split(" → ").map((stop) => `<span>${esc(stop)}</span>`).join("");
  return `<!doctype html><html lang="${l.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><title>${esc(data.name)} | Bluehour China</title><meta name="description" content="${esc(data.description)}"><link rel="canonical" href="${canonical}">${hreflang(slug)}<link rel="icon" type="image/svg+xml" href="/assets/ruoqing-avatar.svg"><meta property="og:title" content="${esc(data.name)} | Bluehour China"><meta property="og:description" content="${esc(data.lead)}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://bluehourchina.com${assets.hero}"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(productSchema(slug, locale, data, canonical))}</script><link rel="stylesheet" href="/assets/luxury-multilang.css?v=${styleVersion}"><link rel="stylesheet" href="/assets/heading-polish.css?v=${styleVersion}"></head><body class="destination-route-page" style="--hero-image:url('${assets.hero}')"><nav class="nav" aria-label="Primary navigation"><a class="brand" href="${l.home}"><img src="/assets/ruoqing-avatar.svg" alt="" aria-hidden="true"><span>${brand}</span></a><div class="nav-links"><a href="${l.home}#places">${esc(l.nav[0])}</a><a href="${l.stories}">${esc(l.nav[1])}</a><a href="${l.before}">${esc(l.nav[2])}</a>${menu}<a class="nav-cta" href="${cta}">${esc(l.cta)}</a></div></nav><div class="mobile-lang" aria-label="Mobile language switcher">${menu}</div><main><section class="hero destination-hero"><div class="wrap hero-inner"><p class="eyebrow">${esc(data.duration)} · ${esc(data.short)}</p><h1 class="cjk-title"><span class="title-line">${esc(data.title[0])}</span><span class="title-line">${esc(data.title[1])}</span></h1><p class="lead">${esc(data.lead)}</p><div class="hero-actions"><a class="btn primary" href="#standard-route">${esc(l.standard)}</a><a class="btn" href="${cta}">${esc(l.cta)}</a></div><div class="facts"><div class="fact"><b>${esc(l.from)}</b><span>RMB ${assets.price.toLocaleString("en-US")}</span></div><div class="fact"><b>${esc(l.groupLabel)}</b><span>${group}</span></div><div class="fact"><b>${esc(l.route)}</b><span>${esc(data.route)}</span></div></div></div></section><section class="section standard-route-band" id="standard-route"><div class="wrap route-showcase"><div class="route-copy"><p class="eyebrow">${esc(l.standard)}</p><h2 class="cjk-title">${esc(data.name)}</h2><p>${esc(data.description)}</p><div class="route-price"><span>${esc(data.duration)}</span><strong>RMB ${assets.price.toLocaleString("en-US")}</strong><small>${group}</small></div><div class="route-points"><div><b>${esc(l.route)}</b><span>${esc(data.route)}</span></div><div><b>${esc(l.pace)}</b><span>${esc(data.pace)}</span></div><div><b>${esc(l.fit)}</b><span>${esc(data.fit)}</span></div><div><b>${esc(l.season)}</b><span>${esc(data.season)}</span></div></div><p class="route-note">${esc(data.note)}</p></div><div class="route-card"><div class="route-image"><img src="${assets.standard}" alt="${esc(data.name)}"></div><div class="route-map"><h3>${esc(l.route)}</h3><div class="map-line">${routeStops}</div></div></div></div></section><!-- route-day-plan-start --><section class="section route-day-plan-band" id="day-plan"><div class="wrap route-day-plan-wrap"><div class="route-day-head"><div><p class="eyebrow">${esc(l.days)}</p><h2>${esc(data.name)}</h2><p>${esc(l.daysIntro)}</p></div><div class="route-terms"><div><b>${esc(l.from)}</b><span>RMB ${assets.price.toLocaleString("en-US")}</span></div><div><b>${esc(l.groupLabel)}</b><span>${group}</span></div></div></div><div class="route-day-list route-day-list-wide">${dayItems}</div></div></section><!-- route-day-plan-end --><section class="section material-notes-band route-photo-story"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${esc(l.scenes)}</p><h2>${esc(data.galleryTitle)}</h2></div><p>${esc(data.galleryIntro)}</p></div><div class="route-photo-grid">${gallery}</div></div></section><section class="section route-specifics-band"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${esc(l.specifics)}</p><h2>${esc(data.name)}</h2></div><p>${esc(data.note)}</p></div><div class="route-specifics">${specifics}</div></div></section><section class="next"><div class="wrap"><p class="eyebrow">${esc(l.finalEyebrow)}</p><h2>${esc(l.finalTitle)}</h2><p>${esc(l.finalBody)}</p><div class="hero-actions"><a class="btn primary" href="${cta}">${esc(l.cta)}</a><a class="btn" href="${l.home}#places">${esc(l.back)}</a></div></div></section></main><footer class="footer"><div class="wrap"><span>Bluehour China Journeys | 若青中國旅策</span><span><a href="/credits.html">Image credits</a> · <a href="/privacy.html">Privacy</a> · <a href="/llms.txt">AI-readable summary</a></span></div></footer><a class="sticky-review" href="${cta}">${esc(l.cta)}</a><script src="/assets/language-menu.js" defer></script></body></html>`;
}

for (const slug of ["xian", "tibet"]) {
  await fs.writeFile(path.join(root, `${slug}.html`), routePage(slug, "en", `https://bluehourchina.com/${slug}.html`));
  for (const locale of languages) {
    const directory = path.join(root, locale, slug);
    await fs.mkdir(directory, { recursive: true });
    const canonical = locale === "en" ? `https://bluehourchina.com/${slug}.html` : `https://bluehourchina.com/${locale}/${slug}/`;
    await fs.writeFile(path.join(directory, "index.html"), routePage(slug, locale, canonical));
  }
}

function extractProduct(html) {
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const schema = JSON.parse(match[1]);
      if (schema?.["@type"] === "Product") return schema;
    } catch {
      // The quality audit reports malformed JSON-LD.
    }
  }
  throw new Error("Product schema missing");
}

function property(schema, pattern) {
  return schema.additionalProperty?.find((item) => pattern.test(item.name))?.value || "";
}

function mapSection(locale, routes) {
  const l = ui[locale];
  const first = routes[0];
  const buttons = routes.map((route) => `<button type="button" data-map-destination="${route.slug}" aria-pressed="false">${esc(destinationNames[locale][route.slug])}</button>`).join("");
  const data = JSON.stringify({ default: first.slug, fallback: l.fallback, routes }).replaceAll("</", "<\\/");
  return `<!-- destination-map-start --><section class="section destination-map-band" id="destination-map" data-destination-map><div class="wrap"><div class="section-head"><div><p class="eyebrow">${esc(l.mapEyebrow)}</p><h2>${esc(l.mapTitle)}</h2></div><p>${esc(l.mapIntro)}</p></div><div class="destination-map-layout"><div class="destination-map-stage"><div class="destination-map-canvas" data-map-canvas aria-label="China destination map"></div><button class="destination-map-reset" type="button" data-map-reset>${esc(l.mapReset)}</button></div><aside class="destination-map-panel" aria-live="polite"><div><p class="eyebrow">${esc(l.standard)}</p><h3 data-map-name>${esc(first.name)}</h3><dl class="destination-map-facts"><div><dt>${esc(l.duration)}</dt><dd data-map-duration>${esc(first.duration)}</dd></div><div><dt>${esc(l.mapPrice)}</dt><dd data-map-price>${esc(first.price)}</dd></div><div><dt>${esc(l.mapRoute)}</dt><dd data-map-route>${esc(first.route)}</dd></div></dl></div><a class="btn primary" data-map-link href="${first.href}">${esc(l.view)}</a></aside></div><div class="destination-map-selector" aria-label="Destination choices">${buttons}</div><script type="application/json">${data}</script></div></section><!-- destination-map-end -->`;
}

function addNewDestinationOptions(html, locale) {
  const options = ["xian", "tibet"]
    .map((slug) => `<option value="${slug}">${esc(destinationNames[locale][slug])}</option>`)
    .join("");
  return html.replace(
    /(<select name="destination"[\s\S]*?)(<option value="multi-region">)/,
    (_match, start, multiRegion) => {
      const withoutExisting = start.replace(/<option value="(?:xian|tibet)">[\s\S]*?<\/option>/g, "");
      return `${withoutExisting}${options}${multiRegion}`;
    },
  );
}

for (const target of homeTargets) {
  const mapRoutes = [];
  for (const slug of allDestinations) {
    const html = await fs.readFile(path.join(root, routeFile(slug, target.routeLocale)), "utf8");
    const schema = extractProduct(html);
    const duration = property(schema, /Duration|天數|日数|기간|ระยะเวลา|Продолжительность/i);
    const route = property(schema, /Route|路線|ルート|경로|เส้นทาง|Маршрут/i);
    const priceValue = schema.offers?.price || schema.offers?.lowPrice;
    mapRoutes.push({
      slug, name: destinationNames[target.locale][slug], duration,
      price: `RMB ${Number(priceValue).toLocaleString("en-US")}`,
      route, href: routeHref(slug, target.routeLocale), lat: coords[slug][0], lng: coords[slug][1],
    });
  }

  const absolute = path.join(root, target.file);
  let html = await fs.readFile(absolute, "utf8");
  const section = mapSection(target.locale, mapRoutes);
  if (/<!-- destination-map-start -->[\s\S]*?<!-- destination-map-end -->/.test(html)) {
    html = html.replace(/<!-- destination-map-start -->[\s\S]*?<!-- destination-map-end -->/, section);
  } else {
    html = html.replace(/(<section class="section product-routes-band" id="places">)/, `${section}$1`);
  }
  if (!html.includes("/assets/vendor/leaflet/leaflet.css")) {
    html = html.replace(/<link rel="stylesheet" href="\/assets\/luxury-multilang\.css[^>]*>/, `<link rel="stylesheet" href="/assets/vendor/leaflet/leaflet.css"><link rel="stylesheet" href="/assets/luxury-multilang.css?v=${styleVersion}">`);
  }
  if (!html.includes("/assets/destination-map.js")) {
    html = html.replace(/<\/body>/, `<script src="/assets/vendor/leaflet/leaflet.js" defer></script><script src="/assets/destination-map.js" defer></script></body>`);
  }
  html = html.replace(/(<div class="hero-media"[^>]*>)[\s\S]*?(<\/div><div class="wrap hero-inner">)/, `$1${homeHeroScenes}$2`);
  html = html.replace(/(<section class="hero home-hero">[\s\S]*?<p class="lead">)[\s\S]*?(<\/p>)/, `$1${esc(ui[target.locale].heroLead)}$2`);
  html = addNewDestinationOptions(html, target.locale);
  await fs.writeFile(absolute, html);
}

const interestFiles = ["route-note/index.html", "interest.html", "en/interest/index.html", "zh/interest/index.html", "ja/interest/index.html", "ko/interest/index.html", "th/interest/index.html", "ru/interest/index.html"];
for (const file of interestFiles) {
  const absolute = path.join(root, file);
  try {
    let html = await fs.readFile(absolute, "utf8");
    const locale = file.startsWith("zh/") ? "zh" : file.startsWith("ja/") ? "ja" : file.startsWith("ko/") ? "ko" : file.startsWith("th/") ? "th" : file.startsWith("ru/") ? "ru" : "en";
    html = html.replace(/(<select[^>]*name="destination"[^>]*>[\s\S]*?)(<\/select>)/, (match, start, end) => {
      let options = start;
      for (const slug of ["xian", "tibet"]) {
        if (!options.includes(`value="${slug}"`)) options += `<option value="${slug}">${esc(destinationNames[locale][slug])}</option>`;
      }
      return options + end;
    });
    await fs.writeFile(absolute, html);
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

const sitemapPath = path.join(root, "sitemap.xml");
let sitemap = await fs.readFile(sitemapPath, "utf8");
for (const slug of ["xian", "tibet"]) {
  const urls = [`https://bluehourchina.com/${slug}.html`, ...languages.map((locale) => `https://bluehourchina.com/${locale}/${slug}/`)];
  for (const url of urls) {
    if (!sitemap.includes(`<loc>${url}</loc>`)) sitemap = sitemap.replace("</urlset>", `  <url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n</urlset>`);
  }
}
await fs.writeFile(sitemapPath, sitemap);

for (const file of ["llms.txt", "llms-full.txt"]) {
  const absolute = path.join(root, file);
  let text = await fs.readFile(absolute, "utf8");
  if (!text.includes("/xian.html")) text += "\n- Xi'an private route: https://bluehourchina.com/xian.html (5 days, city wall, Terracotta Army, museum and Giant Wild Goose Pagoda; RMB 6,800 per person starting reference).\n";
  if (!text.includes("/tibet.html")) text += "- Tibet private route: https://bluehourchina.com/tibet.html (8 days, Lhasa, Yamdrok Lake, Gyantse and Shigatse; RMB 18,800 per person starting reference; entry documents confirmed before travel).\n";
  await fs.writeFile(absolute, text);
}

const creditCards = `<!-- xian-tibet-photo-credits-start -->
          <article class="credit-card"><img loading="lazy" src="/assets/real-xian/xian-yongning-gate-night.jpg" alt="西安永寧門夜景"><div class="credit-copy"><h3>Xi'an Yongning Gate</h3><p>作者／來源：源義信 · Wikimedia Commons</p><p>授權：CC BY-SA 4.0</p><p><a href="https://commons.wikimedia.org/wiki/File:2023-10-10_Yung-ning_Gate_(%E6%B0%B8%E5%AF%A7%E9%96%80)_of_Hsi-an_(%E8%A5%BF%E5%AE%89)_01.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-xian/xian-city-wall-night.jpg" alt="西安城門夜景"><div class="credit-copy"><h3>Xi'an City Gate at Night</h3><p>作者／來源：Jan Bockaert · Wikimedia Commons</p><p>授權：CC BY-SA 2.0</p><p><a href="https://commons.wikimedia.org/wiki/File:2015-01-04_a_former_city_gate_of_Xi%27an_at_night.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-xian/xian-terracotta-army.jpg" alt="西安兵馬俑"><div class="credit-copy"><h3>Terracotta Army</h3><p>作者／來源：xiquinhosilva · Wikimedia Commons</p><p>授權：CC BY 2.0</p><p><a href="https://commons.wikimedia.org/wiki/File:51900-Terracota-Army.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-xian/xian-giant-wild-goose-pagoda.jpg" alt="西安大雁塔"><div class="credit-copy"><h3>Giant Wild Goose Pagoda</h3><p>作者／來源：源義信 · Wikimedia Commons</p><p>授權：CC BY-SA 4.0</p><p><a href="https://commons.wikimedia.org/wiki/File:2023-10-10_Giant_Wild_Goose_Pagoda_%E5%A4%A7%E9%9B%81%E5%A1%94_01.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-xian/xian-bell-tower.jpg" alt="西安鐘樓"><div class="credit-copy"><h3>Xi'an Bell Tower</h3><p>作者／來源：xiquinhosilva · Wikimedia Commons</p><p>授權：CC BY 2.0</p><p><a href="https://commons.wikimedia.org/wiki/File:Xi%27an_Bell_Tower_2024.10.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-xian/xian-muslim-quarter.jpg" alt="西安回民街"><div class="credit-copy"><h3>Xi'an Muslim Quarter</h3><p>作者／來源：David Stanley · Wikimedia Commons</p><p>授權：CC BY 2.0</p><p><a href="https://commons.wikimedia.org/wiki/File:Muslim_Quarter_in_Xi%27an_(48785759581).jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-xian/xian-shaanxi-history-museum.jpg" alt="陝西歷史博物館"><div class="credit-copy"><h3>Shaanxi History Museum</h3><p>作者／來源：Danielinblue（張之誠） · Wikimedia Commons</p><p>授權：CC BY-SA 3.0</p><p><a href="https://commons.wikimedia.org/wiki/File:Shaanxi_History_Museum_architecture.JPG">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-tibet/tibet-potala-palace.jpg" alt="西藏布達拉宮"><div class="credit-copy"><h3>Potala Palace</h3><p>作者／來源：Windmemories · Wikimedia Commons</p><p>授權：CC BY-SA 4.0</p><p><a href="https://commons.wikimedia.org/wiki/File:20140505_Potala_Palace.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-tibet/tibet-yamdrok-lake.jpg" alt="西藏羊卓雍錯"><div class="credit-copy"><h3>Yamdrok Lake</h3><p>作者／來源：Hiroki Ogawa · Wikimedia Commons</p><p>授權：CC BY 3.0</p><p><a href="https://commons.wikimedia.org/wiki/File:4,250m_Yamdrok_Tso_Tibet_China_%E8%A5%BF%E8%97%8F_%E7%BE%8A%E5%8D%93%E9%9B%8D%E6%B9%96_-_panoramio_(1).jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-tibet/tibet-barkhor-square.jpg" alt="拉薩八廓街"><div class="credit-copy"><h3>Barkhor Square</h3><p>作者／來源：Stan Adam · Wikimedia Commons</p><p>授權：Public domain</p><p><a href="https://commons.wikimedia.org/wiki/File:Barkhor_Square_at_Jokhang_on_15_May_2019.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-tibet/tibet-jokhang.jpg" alt="拉薩大昭寺"><div class="credit-copy"><h3>Jokhang</h3><p>作者／來源：Windmemories · Wikimedia Commons</p><p>授權：CC BY-SA 4.0</p><p><a href="https://commons.wikimedia.org/wiki/File:20140509_Jokhang_01.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-tibet/tibet-gyantse-kumbum.jpg" alt="江孜白居寺"><div class="credit-copy"><h3>Gyantse Kumbum</h3><p>作者／來源：Hiroki Ogawa · Wikimedia Commons</p><p>授權：CC BY 3.0</p><p><a href="https://commons.wikimedia.org/wiki/File:Kumbum_Chorten_Pelkor_Chode_Monastery_Gyantse_Tibet_China_%E8%A5%BF%E8%97%8F_%E6%B1%9F%E5%AD%9C_%E7%99%BD%E5%B1%85%E5%AF%BA_%E4%BD%9B%E5%A1%94_-_panoramio.jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-tibet/tibet-tashilhunpo.jpg" alt="日喀則扎什倫布寺"><div class="credit-copy"><h3>Tashilhunpo Monastery</h3><p>作者／來源：Prof. Mortel · Wikimedia Commons</p><p>授權：CC BY 2.0</p><p><a href="https://commons.wikimedia.org/wiki/File:Tashilhunpo_Monastery,_SHigatse,_Tibet_(30).jpg">查看原始來源</a></p></div></article>
          <article class="credit-card"><img loading="lazy" src="/assets/real-tibet/tibet-sera-monastery.jpg" alt="拉薩色拉寺"><div class="credit-copy"><h3>Sera Monastery</h3><p>作者／來源：Hiroki Ogawa · Wikimedia Commons</p><p>授權：CC BY 3.0</p><p><a href="https://commons.wikimedia.org/wiki/File:Sera_Monastery_Lhasa_Tibet_China_%E8%A5%BF%E8%97%8F_%E6%8B%89%E8%90%A8_%E8%89%B2%E6%8B%89%E5%AF%BA_-_panoramio.jpg">查看原始來源</a></p></div></article>
        <!-- xian-tibet-photo-credits-end -->`;

for (const file of ["credits.html", "credits/index.html"]) {
  const absolute = path.join(root, file);
  let html = await fs.readFile(absolute, "utf8");
  if (/<!-- xian-tibet-photo-credits-start -->[\s\S]*?<!-- xian-tibet-photo-credits-end -->/.test(html)) {
    html = html.replace(/<!-- xian-tibet-photo-credits-start -->[\s\S]*?<!-- xian-tibet-photo-credits-end -->/, creditCards);
  } else {
    html = html.replace("<!-- expanded-real-photo-credits-end -->", `${creditCards}\n        <!-- expanded-real-photo-credits-end -->`);
  }
  html = html.replace("雲南、新疆、青甘、內蒙古、海南與三亞、東北實景", "雲南、新疆、青甘、內蒙古、海南、東北、西安與西藏實景");
  await fs.writeFile(absolute, html);
}

console.log("Added Xi'an, Tibet and the multilingual interactive destination map.");
