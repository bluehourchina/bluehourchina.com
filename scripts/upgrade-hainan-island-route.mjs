import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const price = "14200";
const displayPrice = "RMB 14,200";
const heroImage = "/assets/real-sanya/sanya-edition-02-cc-by.jpg";
const routeImage = "/assets/real-sanya/sanya-edition-01-cc-by.jpg";

const copy = {
  en: {
    region: "Hainan Island", name: "Hainan East Coast & Sanya", duration: "7 days · 6 nights", heading: ["Hainan East Coast", "Haikou to Sanya"],
    lead: "A one-way private island route through Haikou, Qionghai, Wanning and Sanya, with two slower coast stays instead of one resort stop.",
    route: "Haikou → Qionghai → Wanning → Lingshui → Sanya", season: "November to April", group: "Private from 2 · public price based on 6", cta: "Plan this island route", view: "See all 7 days",
    labels: { price: "From", group: "Private group", season: "Best season", route: "Route", pace: "Pace", fit: "Best for", standard: "Standard private journey", days: "Day-by-day route" },
    pace: "One-way private vehicle · two nights in Wanning · two nights in Sanya", fit: "Travellers who want local Hainan and a refined Sanya finish",
    intro: "The route begins with Haikou's old streets, follows the east coast through Wanning, then slows down for two nights in Sanya.",
    note: "Land-arrangement reference price. Flights are excluded; final pricing follows season, room category and group size.",
    dayIntro: "The route states every overnight base before inquiry. Resort level, swimming priorities and language support are tailored after dates are known.",
    visualNotes: ["No backtracking to Haikou after Sanya.", "Wanning and Sanya each receive two nights.", "Typhoon and sea conditions are reviewed before confirmation."],
    days: [
      ["Arrive in Haikou", "Private pickup, check-in and an easy walk through the Qilou old streets if arrival time allows.", "Stay: Haikou"],
      ["Haikou to Qionghai", "A relaxed east-coast transfer with one local lunch and time around Bo'ao or Qionghai rather than a list of stops.", "Stay: Qionghai or Bo'ao"],
      ["Qionghai to Wanning", "Continue to Shimei Bay and settle into the first coast stay before the afternoon light softens.", "Stay: Wanning"],
      ["A full Wanning coast day", "Choose a beach, gentle surf lesson or quiet resort day. The same hotel protects the rhythm.", "Stay: Wanning"],
      ["Wanning through Lingshui to Sanya", "Travel south with one coastal stop, then check into a selected Haitang Bay or Yalong Bay resort.", "Stay: Sanya"],
      ["Sanya at your pace", "Keep a full resort day, or add Binglanggu and return before dinner. The cultural visit remains optional.", "Stay: Sanya"],
      ["Departure from Sanya", "Private airport transfer with enough buffer for the final morning to remain calm.", "Departure day"],
    ],
    fitTitle: "Who this Hainan route is for", fitIntro: "Choose it for contrast: an island road, local towns and a polished coast finish.",
    fitCards: [["A good fit", "You want more of Hainan than one Sanya hotel, without circling the whole island."], ["Think twice", "You want seven uninterrupted resort nights or dislike changing hotels."], ["Comfort rule", "Good rooms, short daily focus and two-night stays matter more than collecting beaches."]],
    faqTitle: "Hainan route questions", faqs: [["Is this only Sanya?", "No. Sanya is the final two nights after Haikou, Qionghai and Wanning."], ["Why travel one way?", "Arrival in Haikou and departure from Sanya avoids unnecessary backtracking."], ["Are flights included?", "No. The public price covers land arrangements; flights are quoted separately."]],
  },
  zh: {
    region: "海南島", name: "海南東海岸與三亞", duration: "7 天 6 晚", heading: ["海南東海岸", "從海口走到三亞"],
    lead: "從海口出發，經瓊海、萬寧與陵水走到三亞。不是只住一間度假酒店，而是一條有地方感、也有留白的海島路線。",
    route: "海口 → 瓊海 → 萬寧 → 陵水 → 三亞", season: "11 月至翌年 4 月", group: "2 人起私人成行 · 公開起價以 6 人同行計", cta: "規劃這條海島路線", view: "看完整 7 天",
    labels: { price: "起價", group: "私人成行", season: "適合季節", route: "路線", pace: "節奏", fit: "適合", standard: "標準私人方案", days: "每日路線" },
    pace: "單向私人用車 · 萬寧連住兩晚 · 三亞連住兩晚", fit: "想看見海南地方風景，也想在三亞舒服收尾的旅人",
    intro: "先在海口讀懂騎樓與島嶼生活，再沿東海岸南下；萬寧與三亞都連住兩晚，不每天搬行李。",
    note: "此為地接安排參考起價，不含往返機票；正式價格依季節、房型與同行人數確認。",
    dayIntro: "先把每天的住宿地說清楚。確認日期後，再依海況、房型、同行者與語言需求微調。",
    visualNotes: ["海口進、三亞出，不走回頭路。", "萬寧與三亞各連住兩晚。", "確認前會檢查颱風季、海況與泳池維護。"],
    days: [
      ["抵達海口", "私人接送、入住；若抵達時間合適，傍晚輕走騎樓老街。", "住宿：海口"],
      ["海口到瓊海", "沿東海岸南下，只留一頓在地午餐與博鰲或瓊海的慢停留。", "住宿：瓊海或博鰲"],
      ["瓊海到萬寧", "抵達石梅灣，先入住再看午後海色，不把第一個海岸日塞滿。", "住宿：萬寧"],
      ["完整的萬寧海岸日", "選一段海灘、輕度衝浪或留在旅宿；同一家飯店連住，保留真正休息。", "住宿：萬寧"],
      ["經陵水前往三亞", "沿海岸南下，只選一個停靠，再入住海棠灣或亞龍灣旅宿。", "住宿：三亞"],
      ["依你的方式感受三亞", "可完整留給旅宿，也可上午前往檳榔谷，晚餐前回到海邊。", "住宿：三亞"],
      ["從三亞離開", "私人送機並預留交通緩衝，最後一個早晨不必匆忙。", "離開日"],
    ],
    fitTitle: "這條海南路線適合誰", fitIntro: "它適合想看地方、也想舒服度假的旅人，不是環島打卡團。",
    fitCards: [["適合", "不想只待三亞飯店，也不想十天繞完整座島。"], ["先想想", "七天都只想住同一家度假酒店，或非常不想換房。"], ["舒適原則", "兩晚連住、好房間與每天一個重點，比多收一個海灘重要。"]],
    faqTitle: "關於海南與三亞", faqs: [["這還是只有三亞嗎", "不是。三亞是海口、瓊海與萬寧之後的最後兩晚。"], ["為什麼單向走", "海口進、三亞出，避免多花一天折返。"], ["價格包含機票嗎", "不包含。公開起價是地接安排，航班另行確認。"]],
  },
  ja: {
    region: "海南島", name: "海南島東海岸と三亜", duration: "7日間 · 6泊", heading: ["海南島の東海岸", "海口から三亜へ"],
    lead: "海口から瓊海、万寧、陵水を経て三亜へ。島の暮らしと二つの連泊を組み合わせた一方向の旅です。",
    route: "海口 → 瓊海 → 万寧 → 陵水 → 三亜", season: "11月〜4月", group: "2名様から · 公開料金は6名利用時", cta: "この島ルートを相談", view: "7日間を見る",
    labels: { price: "料金目安", group: "人数", season: "季節", route: "ルート", pace: "ペース", fit: "おすすめ", standard: "モデルプライベート旅行", days: "日ごとのルート" },
    pace: "専用車で一方向 · 万寧2連泊 · 三亜2連泊", fit: "海南島の土地感と上質な三亜滞在を両方求める方", intro: "海口の旧市街から東海岸を南下し、万寧と三亜はそれぞれ2連泊します。", note: "現地手配の参考料金です。航空券は含まず、季節、客室、人数で最終確認します。", dayIntro: "宿泊地を先に明示し、日程確定後に海況、客室、言語サポートを調整します。", visualNotes: ["海口到着・三亜出発で逆戻りなし。", "万寧と三亜は各2連泊。", "台風期と海況を予約前に確認。"],
    days: [["海口到着", "専用送迎とチェックイン。時間が合えば騎楼老街を軽く歩きます。", "宿泊：海口"], ["海口から瓊海へ", "東海岸を南下し、博鰲または瓊海で一つの穏やかな立ち寄り。", "宿泊：瓊海または博鰲"], ["万寧・石梅湾へ", "午後の海に間に合うように宿へ入り、最初の海岸日を詰め込みません。", "宿泊：万寧"], ["万寧で一日", "海辺、軽いサーフィン、またはホテル時間。同じ宿でゆっくり過ごします。", "宿泊：万寧"], ["陵水を経て三亜へ", "海岸の立ち寄りを一つに絞り、海棠湾または亜龍湾へ。", "宿泊：三亜"], ["三亜を自分のペースで", "終日ホテル、または午前の檳榔谷。夕食前には海辺へ戻ります。", "宿泊：三亜"], ["三亜から出発", "専用送迎と十分な空港余裕。", "出発日"]],
    fitTitle: "この海南ルートが合う方", fitIntro: "島の道と上質な海辺を一続きで楽しみたい方へ。", fitCards: [["おすすめ", "三亜だけでなく海南島の東海岸も見たい方。"], ["要検討", "7日間ずっと同じホテルに滞在したい方。"], ["快適さ", "2連泊、よい客室、毎日一つの焦点を優先。"]], faqTitle: "よくある質問", faqs: [["三亜だけですか", "いいえ。三亜は旅の最後の2泊です。"], ["なぜ一方向ですか", "海口から入り三亜から出ることで逆戻りを避けます。"], ["航空券は含まれますか", "含まれません。現地手配の参考料金です。"]],
  },
  ko: {
    region: "하이난섬", name: "하이난 동해안과 싼야", duration: "7일 · 6박", heading: ["하이난 동해안", "하이커우에서 싼야까지"], lead: "하이커우, 충하이, 완닝, 링수이를 지나 싼야로 이어지는 편도 개인 루트입니다.", route: "하이커우 → 충하이 → 완닝 → 링수이 → 싼야", season: "11월–4월", group: "2인부터 · 공개가는 6인 기준", cta: "섬 루트 상담", view: "7일 일정 보기",
    labels: { price: "시작가", group: "인원", season: "시즌", route: "루트", pace: "속도", fit: "추천", standard: "표준 개인 여행", days: "일자별 루트" }, pace: "편도 전용차량 · 완닝 2연박 · 싼야 2연박", fit: "하이난의 지역성과 고급 싼야 휴식을 함께 원하는 여행자", intro: "하이커우 옛거리에서 시작해 동해안을 따라 내려가며 완닝과 싼야는 각각 2연박합니다.", note: "현지 일정 참고가입니다. 항공권은 제외하며 계절, 객실, 인원에 따라 확정합니다.", dayIntro: "숙박지를 먼저 공개하고 날짜 확인 후 해상 상태, 객실과 언어 지원을 조정합니다.", visualNotes: ["하이커우 도착, 싼야 출발로 역주행 없음.", "완닝과 싼야 각각 2연박.", "태풍 시기와 해상 상태를 예약 전 확인."],
    days: [["하이커우 도착", "전용 픽업과 체크인. 시간이 맞으면 치러우 옛거리를 가볍게 걷습니다.", "숙박: 하이커우"], ["하이커우에서 충하이", "동해안을 따라 남하하며 보아오 또는 충하이에서 한 번 천천히 머뭅니다.", "숙박: 충하이 또는 보아오"], ["완닝 스메이만", "오후 바다에 맞춰 숙소에 들어가 첫 해안일을 비워 둡니다.", "숙박: 완닝"], ["완닝에서 하루", "해변, 가벼운 서핑 또는 호텔 휴식. 같은 숙소에서 2연박합니다.", "숙박: 완닝"], ["링수이를 지나 싼야", "해안 정차 한 곳만 고르고 하이탕만 또는 야룽만 숙소로 이동합니다.", "숙박: 싼야"], ["싼야를 원하는 방식으로", "하루 종일 리조트 또는 오전 빙랑구 후 해변 복귀.", "숙박: 싼야"], ["싼야 출발", "전용 공항 이동과 충분한 여유.", "출발일"]],
    fitTitle: "이 하이난 루트가 맞는 여행자", fitIntro: "섬의 길과 편안한 바다를 한 흐름으로 보고 싶은 분에게 맞습니다.", fitCards: [["추천", "싼야 호텔만이 아니라 하이난 동해안도 보고 싶을 때."], ["고려", "7일 내내 한 리조트에만 머물고 싶을 때."], ["편안함", "2연박, 좋은 객실과 하루 한 가지를 우선합니다."]], faqTitle: "자주 묻는 질문", faqs: [["싼야만 가나요", "아닙니다. 싼야는 마지막 2박입니다."], ["왜 편도인가요", "하이커우 입국과 싼야 출국으로 되돌아가지 않습니다."], ["항공권이 포함되나요", "아닙니다. 공개가는 현지 일정 기준입니다."]],
  },
  th: {
    region: "เกาะไหหลำ", name: "ชายฝั่งตะวันออกไหหลำและซานย่า", duration: "7 วัน · 6 คืน", heading: ["ชายฝั่งตะวันออกไหหลำ", "จากไหโข่วสู่ซานย่า"], lead: "เส้นทางส่วนตัวทางเดียวผ่านไหโข่ว ฉงไห่ ว่านหนิง หลิงสุ่ย และซานย่า พร้อมพักสองคืนในสองเมืองชายฝั่ง", route: "ไหโข่ว → ฉงไห่ → ว่านหนิง → หลิงสุ่ย → ซานย่า", season: "พฤศจิกายน–เมษายน", group: "เริ่ม 2 ท่าน · ราคาเผยแพร่สำหรับ 6 ท่าน", cta: "วางแผนเส้นทางเกาะ", view: "ดูครบ 7 วัน",
    labels: { price: "ราคาเริ่มต้น", group: "กลุ่มส่วนตัว", season: "ฤดูกาล", route: "เส้นทาง", pace: "จังหวะ", fit: "เหมาะกับ", standard: "เส้นทางส่วนตัวมาตรฐาน", days: "แผนรายวัน" }, pace: "รถส่วนตัวทางเดียว · ว่านหนิง 2 คืน · ซานย่า 2 คืน", fit: "ผู้ที่อยากเห็นไหหลำท้องถิ่นและจบทริปอย่างสบายในซานย่า", intro: "เริ่มจากเมืองเก่าไหโข่ว ลงใต้ตามชายฝั่งตะวันออก และพักต่อเนื่องที่ว่านหนิงกับซานย่า", note: "ราคาอ้างอิงภาคพื้นดิน ไม่รวมเที่ยวบิน และยืนยันตามฤดูกาล ห้องพัก และจำนวนคน", dayIntro: "ระบุเมืองพักทุกคืนก่อนสอบถาม แล้วปรับตามสภาพทะเล ห้อง และภาษาเมื่อทราบวันที่", visualNotes: ["เข้าไหโข่ว ออกซานย่า ไม่ย้อนทาง.", "พักว่านหนิงและซานย่าแห่งละ 2 คืน.", "ตรวจฤดูพายุและสภาพทะเลก่อนยืนยัน."],
    days: [["ถึงไหโข่ว", "รถส่วนตัวรับและเช็กอิน หากเวลาพอเดินย่านฉีโหลวเบา ๆ", "พัก: ไหโข่ว"], ["ไหโข่วสู่ฉงไห่", "เดินทางลงใต้และเลือกแวะเพียงหนึ่งช่วงที่โป๋อ๋าวหรือฉงไห่", "พัก: ฉงไห่หรือโป๋อ๋าว"], ["ฉงไห่สู่ว่านหนิง", "ถึงอ่าวสือเหมยและเข้าที่พักก่อนช่วงแสงบ่าย", "พัก: ว่านหนิง"], ["หนึ่งวันเต็มที่ว่านหนิง", "เลือกชายหาด โต้คลื่นเบา ๆ หรือพักในโรงแรมเดิม", "พัก: ว่านหนิง"], ["ผ่านหลิงสุ่ยสู่ซานย่า", "แวะชายฝั่งหนึ่งจุดแล้วเข้าที่พักอ่าวไห่ถังหรือย่าหลง", "พัก: ซานย่า"], ["ซานย่าตามจังหวะของคุณ", "พักเต็มวันหรือไปปิงหลางกู่ช่วงเช้าแล้วกลับก่อนเย็น", "พัก: ซานย่า"], ["ออกจากซานย่า", "รถส่วนตัวไปสนามบินและเผื่อเวลา", "วันเดินทางกลับ"]],
    fitTitle: "เส้นทางไหหลำนี้เหมาะกับใคร", fitIntro: "เหมาะกับคนที่อยากเห็นถนนบนเกาะและจบทริปด้วยทะเลที่สบาย", fitCards: [["เหมาะ", "อยากเห็นมากกว่าหนึ่งรีสอร์ตในซานย่า."], ["คิดก่อน", "ต้องการอยู่โรงแรมเดียวตลอด 7 วัน."], ["ความสบาย", "พักต่อเนื่อง ห้องดี และหนึ่งจุดหลักต่อวัน."]], faqTitle: "คำถามที่พบบ่อย", faqs: [["มีแค่ซานย่าหรือไม่", "ไม่ใช่ ซานย่าเป็นสองคืนสุดท้าย."], ["ทำไมเดินทางทางเดียว", "เข้าไหโข่วและออกซานย่าเพื่อไม่ย้อนทาง."], ["รวมตั๋วเครื่องบินไหม", "ไม่รวม ราคาเป็นบริการภาคพื้นดิน."]],
  },
  ru: {
    region: "остров Хайнань", name: "Восточное побережье Хайнаня и Санья", duration: "7 дней · 6 ночей", heading: ["Восточное побережье Хайнаня", "Из Хайкоу в Санью"], lead: "Односторонний частный маршрут через Хайкоу, Цюнхай, Ваньнин и Линшуй к двум спокойным ночам в Санье.", route: "Хайкоу → Цюнхай → Ваньнин → Линшуй → Санья", season: "Ноябрь–апрель", group: "От 2 человек · публичная цена для 6", cta: "Запросить маршрут по острову", view: "Все 7 дней",
    labels: { price: "Стоимость", group: "Частная группа", season: "Сезон", route: "Маршрут", pace: "Темп", fit: "Подходит", standard: "Стандартный частный маршрут", days: "Маршрут по дням" }, pace: "Частный автомобиль в одну сторону · 2 ночи в Ваньнине · 2 ночи в Санье", fit: "Тем, кто хочет увидеть местный Хайнань и завершить поездку хорошим курортом", intro: "Старые улицы Хайкоу сменяются восточным побережьем; Ваньнин и Санья получают по две ночи.", note: "Ориентир по наземной части. Перелёты не включены; итог зависит от сезона, номера и группы.", dayIntro: "Все ночёвки видны заранее. После заявки уточняются море, отель и языковая поддержка.", visualNotes: ["Прилёт в Хайкоу, вылет из Саньи без возврата.", "По две ночи в Ваньнине и Санье.", "Сезон тайфунов и море проверяются заранее."],
    days: [["Прибытие в Хайкоу", "Встреча, заселение и лёгкая прогулка по старым улицам Цилоу.", "Ночь: Хайкоу"], ["Хайкоу — Цюнхай", "Дорога вдоль восточного берега и одна спокойная остановка в Боао или Цюнхае.", "Ночь: Цюнхай или Боао"], ["Цюнхай — Ваньнин", "Прибытие к бухте Шимэй до мягкого дневного света.", "Ночь: Ваньнин"], ["Полный день в Ваньнине", "Пляж, лёгкий сёрфинг или день в том же отеле.", "Ночь: Ваньнин"], ["Через Линшуй в Санью", "Одна береговая остановка и заселение в Хайтан или Ялунвань.", "Ночь: Санья"], ["Санья в вашем ритме", "Полный курортный день или утренний Бинлангу с возвращением до ужина.", "Ночь: Санья"], ["Отъезд из Саньи", "Индивидуальный трансфер и спокойный запас времени.", "День отъезда"]],
    fitTitle: "Кому подходит маршрут по Хайнаню", fitIntro: "Тем, кто хочет связать островную дорогу и комфортный финал у моря.", fitCards: [["Подходит", "Хотите увидеть больше, чем один отель в Санье."], ["Подумать", "Хотите все семь дней жить в одном курорте."], ["Комфорт", "Две ночи подряд, хороший номер и одна главная тема в день."]], faqTitle: "Частые вопросы", faqs: [["Это только Санья?", "Нет. Санья — последние две ночи после восточного побережья."], ["Почему маршрут в одну сторону?", "Прилёт в Хайкоу и вылет из Саньи убирают возврат."], ["Перелёты включены?", "Нет. Публичная цена относится к наземной части."]],
  },
};

const files = [["sanya.html", "en", "/interest.html"], ["en/sanya/index.html", "en", "/en/interest/"], ["zh/sanya/index.html", "zh", "/zh/interest/"], ["ja/sanya/index.html", "ja", "/ja/interest/"], ["ko/sanya/index.html", "ko", "/ko/interest/"], ["th/sanya/index.html", "th", "/th/interest/"], ["ru/sanya/index.html", "ru", "/ru/interest/"]];

const esc = (value) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
const dayLabel = (locale, number) => ({ en: `Day ${number}`, zh: `第 ${number} 天`, ja: `${number}日目`, ko: `${number}일차`, th: `วันที่ ${number}`, ru: `День ${number}` }[locale]);

function schema(html, data, canonical) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (block, source) => {
    let json;
    try { json = JSON.parse(source); } catch { return block; }
    if (json?.["@type"] !== "Product") return block;
    json.name = data.name;
    json.description = `${data.intro} ${data.group}.`;
    json.image = `https://bluehourchina.com${routeImage}`;
    json.url = canonical;
    json.offers = { "@type": "Offer", priceCurrency: "CNY", price, url: canonical, availability: "https://schema.org/InStock" };
    json.additionalProperty = [{ "@type": "PropertyValue", name: data.labels.route, value: data.route }, { "@type": "PropertyValue", name: "Duration", value: data.duration }, { "@type": "PropertyValue", name: data.labels.group, value: data.group }, { "@type": "PropertyValue", name: "Public starting price basis", value: "Based on 6 travellers; prices for 2 or 4 travellers are provided after inquiry" }];
    return `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n  </script>`;
  });
}

function hero(data, locale, cta) {
  const cls = locale === "en" || locale === "ru" || locale === "th" ? "" : ' class="cjk-title"';
  return `<section class="hero destination-hero"><div class="wrap hero-inner"><p class="eyebrow">${data.region} · ${data.duration}</p><h1${cls}>${data.heading.map((line) => `<span class="title-line">${line}</span>`).join("")}</h1><p class="lead">${data.lead}</p><div class="hero-actions"><a class="btn primary" href="${cta}?destination=sanya&amp;utm_source=destination_hero&amp;utm_medium=site&amp;utm_campaign=private_route_consultation">${data.cta}</a><a class="btn" href="#day-plan">${data.view}</a></div><div class="facts"><div class="fact"><b>${data.labels.price}</b><span>${displayPrice}</span></div><div class="fact"><b>${data.labels.group}</b><span>${data.group}</span></div><div class="fact"><b>${data.labels.season}</b><span>${data.season}</span></div></div></div></section>`;
}

function standard(data, locale) {
  const cls = locale === "en" || locale === "ru" || locale === "th" ? "" : ' class="cjk-title"';
  return `<section class="section standard-route-band" id="standard-route"><div class="wrap route-showcase"><div class="route-copy"><p class="eyebrow">${data.labels.standard}</p><h2${cls}>${data.name}</h2><p>${data.intro}</p><div class="route-price"><span>${data.duration}</span><strong>${displayPrice}</strong><small>${data.group}</small></div><div class="route-points"><div><b>${data.labels.route}</b><span>${data.route}</span></div><div><b>${data.labels.pace}</b><span>${data.pace}</span></div><div><b>${data.labels.fit}</b><span>${data.fit}</span></div><div><b>${data.labels.season}</b><span>${data.season}</span></div></div><p class="route-note">${data.note}</p></div><div class="route-card"><div class="route-image"><img src="${routeImage}" alt="${esc(data.name)}"></div><div class="route-map"><h3>${data.labels.route}</h3><div class="map-line">${data.route.split(" → ").map((stop) => `<span>${stop}</span>`).join("")}</div></div></div></div></section>`;
}

function days(data, locale, cta) {
  const list = data.days.map((day, index) => `<article class="route-day-item"><div class="route-day-index">${dayLabel(locale, index + 1)}</div><div class="route-day-copy"><h3>${day[0]}</h3><p>${day[1]}</p><span>${day[2]}</span></div></article>`).join("");
  return `<section class="section route-day-plan-band" id="day-plan"><div class="wrap route-day-plan-wrap"><div class="route-day-head"><div><p class="eyebrow">${data.labels.days}</p><h2>${data.duration}</h2><p>${data.dayIntro}</p></div><div class="route-terms"><div><b>${data.labels.price}</b><span>${displayPrice}</span></div><div><b>${data.labels.group}</b><span>${data.group}</span></div></div></div><div class="route-day-layout"><div class="route-day-list">${list}</div><aside class="route-visual-panel"><figure><img src="${routeImage}" alt="${esc(data.name)}"><figcaption>${data.route}</figcaption></figure><ul class="route-visual-notes">${data.visualNotes.map((note, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${note}</span></li>`).join("")}</ul><p class="route-note">${data.note}</p><a class="btn primary dark-gold" href="${cta}?destination=sanya&amp;utm_source=route_day_plan&amp;utm_medium=site&amp;utm_campaign=private_route_consultation">${data.cta}</a></aside></div></div></section>`;
}

function decision(data, locale) {
  const cls = locale === "en" || locale === "ru" || locale === "th" ? "" : ' class="cjk-title"';
  return `<section class="section content-95-band" id="route-fit"><div class="wrap content-95-wrap"><div class="content-95-intro"><p class="eyebrow">${data.labels.fit}</p><h2${cls}>${data.fitTitle}</h2><p>${data.fitIntro}</p></div><div class="fit-grid">${data.fitCards.map((card) => `<article><b>${card[0]}</b><p>${card[1]}</p></article>`).join("")}</div></div></section><section class="section faq-band" id="faq"><div class="wrap"><div class="section-head compact-head"><div><p class="eyebrow">FAQ</p><h2${cls}>${data.faqTitle}</h2></div></div><div class="faq-grid">${data.faqs.map((faq) => `<article class="faq-item"><h3>${faq[0]}</h3><p>${faq[1]}</p></article>`).join("")}</div></div></section>`;
}

async function update(file, locale, cta) {
  const absolute = path.join(root, file);
  const data = copy[locale];
  let html = await fs.readFile(absolute, "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || `https://bluehourchina.com/${file}`;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${data.name}｜${data.duration}｜Bluehour China</title>`).replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(data.lead)} ${displayPrice}.">`).replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(data.name)}｜Bluehour China">`).replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(data.lead)}">`).replace(/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="https://bluehourchina.com${heroImage}">`).replace(/--hero-image:url\('[^']+'\)/, `--hero-image:url('${heroImage}')`).replace(/--cta-image:url\('[^']+'\)/, `--cta-image:url('${routeImage}')`);
  html = schema(html, data, canonical);
  html = html.replace(/<section class="hero destination-hero"[\s\S]*?(?=<section class="section standard-route-band")/, `${hero(data, locale, cta)}\n  `);
  html = html.replace(/<section class="section standard-route-band"[\s\S]*?(?=(?:\s*<!-- route-day-plan-start -->)?\s*<section class="section route-day-plan-band")/, `${standard(data, locale)}\n  `);
  const dayBlock = days(data, locale, cta);
  if (html.includes("<!-- route-day-plan-start -->")) html = html.replace(/<!-- route-day-plan-start -->[\s\S]*?<!-- route-day-plan-end -->/, `<!-- route-day-plan-start -->\n    ${dayBlock}\n    <!-- route-day-plan-end -->`);
  else html = html.replace(/<section class="section route-day-plan-band"[\s\S]*?(?=<section class="section material-notes-band")/, `${dayBlock}\n  `);
  const decisions = decision(data, locale);
  if (html.includes("<!-- content-95-start -->")) html = html.replace(/<!-- content-95-start -->[\s\S]*?<!-- content-95-end -->/, `<!-- content-95-start -->\n    ${decisions}\n    <!-- content-95-end -->`);
  else html = html.replace(/(?=<section class="section care-band")/, `${decisions}\n  `);
  await fs.writeFile(absolute, html.replace(/[ \t]+$/gm, ""));
}

for (const args of files) await update(...args);
for (const file of ["llms.txt", "llms-full.txt"]) {
  const absolute = path.join(root, file);
  let text = await fs.readFile(absolute, "utf8");
  text = text.replace(/- Sanya Coastal Ease:[^\n]+/g, "- Hainan East Coast & Sanya: 7 days and 6 nights, Haikou · Qionghai · Wanning · Lingshui · Sanya, from RMB 14,200 per traveller based on 6 travellers.");
  text = text.replace(/Standard route: Sanya Coastal Ease[^\n]+/g, "Standard route: Hainan East Coast & Sanya, 7 days and 6 nights, Haikou · Qionghai · Wanning · Lingshui · Sanya, from RMB 14,200 per traveller based on 6 travellers.");
  await fs.writeFile(absolute, text);
}

console.log("Upgraded Sanya into the seven-day Hainan East Coast route.");
await import("./expand-destination-photo-galleries.mjs");
await import("./sync-home-route-products.mjs");
await import("./normalize-home-destination-copy.mjs");
await import("./apply-retail-margin-prices.mjs");
