import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const price = "4980";
const displayPrice = "RMB 4,980";
const mainImage = "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg";
const routeImages = [
  "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg",
  "/assets/real-qinggan/chaka-salt-lake-cc-by.jpg",
  "/assets/real-dunhuang/mogao-caves-cc-by-sa.jpg",
  "/assets/wechat-qinggan/wechat-qinggan-dachaidan-emerald-lake-01.jpg",
  "/assets/real-qinggan/jiayuguan-gatetower-cc-by-sa.jpg",
  "/assets/real-qinggan/zhangye-danxia-cc-by-sa.jpg",
];

const copy = {
  en: {
    region: "Qinghai & Gansu", name: "Qinghai-Gansu Grand Loop", duration: "9 days · 8 nights",
    heading: ["Qinghai-Gansu Grand Loop", "Lakes, desert and Silk Road"],
    lead: "A private route from Xining through Qinghai Lake and Chaka to Dunhuang, Jiayuguan and Zhangye, with enough nights to protect comfort on the long road.",
    route: "Xining → Qinghai Lake → Chaka → Dachaidan → Dunhuang → Jiayuguan → Zhangye",
    season: "May to October", group: "Private from 2 · public price based on 6", cta: "Plan this route", view: "See all 9 days",
    labels: { price: "From", group: "Private group", season: "Best season", route: "Route", pace: "Pace", fit: "Best for", standard: "Standard private journey", days: "Day-by-day route" },
    pace: "Seven route bases · private vehicle · no same-day return to Xining", fit: "Travellers who want one complete northwest China journey, not a Dunhuang-only stop",
    intro: "Nine days connect plateau lakes, salt flats, the desert, Mogao Caves, the Great Wall frontier and Zhangye Danxia in one clear line.",
    note: "Land-arrangement reference price. International flights are excluded; final pricing follows season, room category and group size.",
    dayIntro: "A clear base route with the long drives stated upfront. Dates, hotels and language support are tailored after inquiry.",
    visualNotes: ["Altitude comfort is checked before the lake days.", "Mogao access is reserved by time slot.", "Long drives include rest and weather buffers."],
    days: [
      ["Arrive in Xining", "Private pickup, check-in and an early night before the plateau route begins.", "Stay: Xining"],
      ["Qinghai Lake", "A paced private drive to the lake, with stops chosen for light, weather and walking comfort.", "Stay: Qinghai Lake area"],
      ["Chaka Salt Lake", "A later start where possible, then time on the salt lake without forcing a rushed return.", "Stay: Chaka or Delingha"],
      ["Dachaidan and the desert road", "Cross the open Qaidam landscape with proper meal, restroom and weather stops.", "Stay: Dachaidan"],
      ["Across the Gobi to Dunhuang", "One honest transfer day, arriving with enough time for rest rather than adding another attraction.", "Stay: Dunhuang"],
      ["Mogao Caves and Mingsha Mountain", "Timed Mogao access first; dunes and Crescent Spring move to the softer part of the day.", "Stay: Dunhuang"],
      ["Dunhuang to Jiayuguan", "Travel east to the frontier fortress, with a slower visit after the main heat and crowds.", "Stay: Jiayuguan"],
      ["Jiayuguan to Zhangye Danxia", "Continue to Zhangye and keep the coloured landforms for suitable afternoon light.", "Stay: Zhangye"],
      ["Departure from Zhangye", "Private transfer for the onward flight or train, with a connection buffer built in.", "Departure day"],
    ],
    photo: ["Route in real scenes", "Six landscapes, one complete northwest route", "Every photograph maps to a real stop in the nine-day journey."],
    scenes: [
      ["Day 2 · Qinghai Lake", "The first large landscape, with time protected for altitude and changing light."],
      ["Day 3 · Chaka", "Salt-lake timing follows weather and reflections, not a fixed photo queue."],
      ["Day 6 · Mogao Caves", "Context and timed entry come before a calm cave visit."],
      ["Day 4 · Dachaidan Emerald Lake", "The colour belongs to the Qaidam landscape, with timing kept flexible for wind and weather."],
      ["Day 7 · Jiayuguan", "The Great Wall frontier becomes a full route chapter, not a passing stop."],
      ["Day 8 · Zhangye", "Danxia closes the route in colour before departure from Zhangye."],
    ],
    fitTitle: "Who this grand loop is for", fitIntro: "Choose it for breadth and continuity, not for collecting stops at speed.",
    fitCards: [["A good fit", "You want Qinghai and Gansu in one private route and accept a few honest road days."], ["Think twice", "You prefer one hotel base or are highly sensitive to altitude and long drives."], ["Comfort rule", "Good rooms, private movement and recovery time matter more than adding one more attraction."]],
    faqTitle: "Qinghai-Gansu route questions", faqs: [["Is this only a Dunhuang trip?", "No. Dunhuang is two central days inside a nine-day route from Xining to Zhangye."], ["Why nine days?", "Nine days keeps Qinghai Lake, Chaka, Dunhuang, Jiayuguan and Zhangye from becoming drive-by stops."], ["Are flights included?", "No. The public price is for land arrangements; arrival in Xining and departure from Zhangye are quoted separately."]],
  },
  zh: {
    region: "青甘", name: "青甘大環線", duration: "9 天 8 晚", heading: ["青甘大環線", "湖泊、石窟與丹霞"],
    lead: "從西寧出發，經青海湖、茶卡、大柴旦走到敦煌、嘉峪關與張掖。九天把長路說清楚，也把休息留進行程。",
    route: "西寧 → 青海湖 → 茶卡 → 大柴旦 → 敦煌 → 嘉峪關 → 張掖", season: "5 月至 10 月", group: "2 人起私人成行 · 公開起價以 6 人同行計", cta: "規劃這條路線", view: "看完整 9 天",
    labels: { price: "起價", group: "私人成行", season: "適合季節", route: "路線", pace: "節奏", fit: "適合", standard: "標準私人方案", days: "每日路線" },
    pace: "七段住宿 · 私人用車 · 不折返西寧", fit: "想一次看懂青海與甘肅，不只停在敦煌的旅人",
    intro: "九天串起高原湖泊、鹽湖、戈壁、莫高窟、長城關城與張掖丹霞，路線完整，但不把每一天塞滿。",
    note: "此為地接安排參考起價，不含往返中國機票；正式價格依季節、房型與同行人數確認。",
    dayIntro: "先把長車程與住宿點攤開來看。日期、旅宿與語言支援會在詢問後依同行者調整。",
    visualNotes: ["進入高原前先確認海拔舒適度。", "莫高窟依實際預約時段安排。", "長車程保留用餐、休息與天氣緩衝。"],
    days: [
      ["抵達西寧", "私人接送、入住與早休，先讓身體適應高原。", "住宿：西寧"],
      ["青海湖", "私人車前往青海湖，停靠點依光線、天氣與步行舒適度調整。", "住宿：青海湖周邊"],
      ["茶卡鹽湖", "盡量避開最擁擠時段，把鹽湖留成一段完整感受。", "住宿：茶卡或德令哈"],
      ["大柴旦與戈壁公路", "穿越柴達木地景，沿途安排清楚的用餐、洗手間與天氣停靠。", "住宿：大柴旦"],
      ["穿越戈壁到敦煌", "這天誠實保留給移動，抵達後休息，不再硬塞景點。", "住宿：敦煌"],
      ["莫高窟與鳴沙山", "先依預約進莫高窟，鳴沙山與月牙泉放在熱度較低、光線較柔的時段。", "住宿：敦煌"],
      ["敦煌到嘉峪關", "向東走到長城關城，避開最熱與最擁擠的時間慢慢看。", "住宿：嘉峪關"],
      ["嘉峪關到張掖丹霞", "抵達張掖後，把丹霞留給適合的午後光線。", "住宿：張掖"],
      ["張掖離開", "依航班或列車私人送站，為後續轉程保留緩衝。", "離開日"],
    ],
    photo: ["沿路實景", "六個畫面，看懂青甘大環線", "每張照片都對應九天路線中的真實停靠點。"],
    scenes: [["第 2 天 · 青海湖", "第一段大風景，也先照顧海拔與光線。"], ["第 3 天 · 茶卡", "鹽湖依天氣與倒影安排，不追著人潮拍一張就走。"], ["第 6 天 · 莫高窟", "先有脈絡，再依預約時段安靜進窟。"], ["第 4 天 · 大柴旦翡翠湖", "湖色屬於柴達木地景，停留時段依風與天氣彈性調整。"], ["第 7 天 · 嘉峪關", "讓長城邊關成為一整段理解，不只是路過。"], ["第 8 天 · 張掖", "以丹霞收住整條路線，再從張掖離開。"]],
    fitTitle: "這條大環線適合誰", fitIntro: "它適合想看完整西北的人，不適合用速度收集地名。",
    fitCards: [["適合", "想一次走完青海與甘肅，也能接受幾個誠實長車日。"], ["先想想", "只想住同一家飯店，或對海拔與長車程非常敏感。"], ["舒適原則", "好房間、私人移動與恢復時間，比再多塞一個景點重要。"]],
    faqTitle: "關於青甘大環線", faqs: [["這還是只有敦煌嗎", "不是。敦煌是九天路線中的兩個核心日，整條路從西寧走到張掖。"], ["為什麼需要九天", "九天才不會把青海湖、茶卡、敦煌、嘉峪關與張掖都做成匆忙停靠。"], ["價格包含機票嗎", "不包含。公開起價是地接安排，西寧抵達與張掖離開的航班另行確認。"]],
  },
  ja: {
    region: "青海・甘粛", name: "青海・甘粛グランドループ", duration: "9日間 · 8泊", heading: ["青海・甘粛グランドループ", "湖、石窟、シルクロード"],
    lead: "西寧から青海湖、茶卡、大柴旦、敦煌、嘉峪関、張掖へ。長距離移動を明確にし、休息も守る9日間です。",
    route: "西寧 → 青海湖 → 茶卡 → 大柴旦 → 敦煌 → 嘉峪関 → 張掖", season: "5月〜10月", group: "2名様から · 公開料金は6名利用時", cta: "このルートを相談", view: "9日間を見る",
    labels: { price: "料金目安", group: "人数", season: "季節", route: "ルート", pace: "ペース", fit: "おすすめ", standard: "モデルプライベート旅行", days: "日ごとのルート" }, pace: "7つの滞在地 · 専用車 · 西寧へ戻らない一方向ルート", fit: "敦煌だけでなく青海と甘粛を一度に見たい方",
    intro: "高原の湖、塩湖、ゴビ、莫高窟、嘉峪関、張掖丹霞を、急がず一つの線で結びます。", note: "現地手配の参考料金です。国際航空券は含まず、季節、客室、人数で最終確認します。", dayIntro: "長い移動と宿泊地を先に明示します。日程、宿、言語サポートは相談後に調整します。", visualNotes: ["高原へ入る前に体調を確認。", "莫高窟は予約時間に合わせます。", "長距離日は休憩と天候の余白を確保。"],
    days: [["西寧到着", "専用送迎と早めの休息。", "宿泊：西寧"], ["青海湖", "光と体調に合わせて湖畔へ。", "宿泊：青海湖周辺"], ["茶卡塩湖", "混雑と天候を見て滞在時間を守ります。", "宿泊：茶卡または徳令哈"], ["大柴旦とゴビの道", "食事と休憩を含めて柴達木を横断。", "宿泊：大柴旦"], ["敦煌へ", "移動を主役にし、到着後は休息。", "宿泊：敦煌"], ["莫高窟と鳴沙山", "予約入場と夕方の砂丘。", "宿泊：敦煌"], ["嘉峪関へ", "長城西端の関城をゆっくり見学。", "宿泊：嘉峪関"], ["張掖丹霞", "午後の光に合わせて丹霞へ。", "宿泊：張掖"], ["張掖出発", "専用送迎と乗継の余白。", "出発日"]],
    photo: ["実景で見るルート", "六つの風景で知る青海・甘粛", "9日間の実際の立ち寄り先に対応する写真です。"], scenes: [["2日目 · 青海湖", "標高と光を見ながら最初の大景観へ。"], ["3日目 · 茶卡", "天候と反射に合わせて時間を調整。"], ["6日目 · 莫高窟", "背景を知り、予約時間に入場。"], ["4日目 · 大柴旦翡翠湖", "風と天候に合わせ、湖の色をゆっくり見ます。"], ["7日目 · 嘉峪関", "通過せず、関城を一章として見る。"], ["8日目 · 張掖", "丹霞の色で旅を締めくくります。"]],
    fitTitle: "このルートが合う方", fitIntro: "速さより、北西中国を一続きで理解したい方へ。", fitCards: [["おすすめ", "青海と甘粛を一度に見たい方。"], ["要検討", "高地と長距離移動が苦手な方。"], ["快適さ", "専用車、よい客室、休息時間を優先。"]], faqTitle: "よくある質問", faqs: [["敦煌だけの旅行ですか", "いいえ。敦煌は9日間の中心となる2日です。"], ["なぜ9日間ですか", "主要地点を短い写真ストップにしないためです。"], ["航空券は含まれますか", "含まれません。現地手配の参考料金です。"]],
  },
  ko: {
    region: "칭하이·간쑤", name: "칭하이·간쑤 그랜드 루프", duration: "9일 · 8박", heading: ["칭하이·간쑤 그랜드 루프", "호수, 석굴, 실크로드"], lead: "시닝에서 칭하이호, 차카, 다차이단, 둔황, 자위관, 장예까지 이어지는 9일 개인 루트입니다.", route: "시닝 → 칭하이호 → 차카 → 다차이단 → 둔황 → 자위관 → 장예", season: "5월–10월", group: "2인부터 · 공개가는 6인 기준", cta: "이 루트 상담", view: "9일 일정 보기",
    labels: { price: "시작가", group: "인원", season: "시즌", route: "루트", pace: "속도", fit: "추천", standard: "표준 개인 여행", days: "일자별 루트" }, pace: "7개 숙박지 · 전용 차량 · 시닝으로 되돌아가지 않는 동선", fit: "둔황만이 아니라 칭하이와 간쑤를 한 번에 보고 싶은 여행자", intro: "고원 호수, 소금호수, 고비, 막고굴, 자위관과 장예 단샤를 한 줄로 연결합니다.", note: "현지 일정 참고가입니다. 국제선은 제외하며 계절, 객실, 인원에 따라 확정합니다.", dayIntro: "긴 이동일과 숙박지를 먼저 공개하고 호텔과 언어 지원은 문의 후 조정합니다.", visualNotes: ["고원 진입 전 컨디션 확인.", "막고굴은 예약 시간 기준.", "긴 이동일에 휴식과 날씨 버퍼 포함."],
    days: [["시닝 도착", "전용 픽업과 이른 휴식.", "숙박: 시닝"], ["칭하이호", "빛과 고도 적응을 고려한 호수 일정.", "숙박: 칭하이호 인근"], ["차카 소금호수", "날씨와 반사에 맞춰 충분히 머뭅니다.", "숙박: 차카 또는 더링하"], ["다차이단과 고비 도로", "식사와 휴식을 포함해 차이다무를 건넙니다.", "숙박: 다차이단"], ["둔황 이동", "이동에 집중하고 도착 후 쉽니다.", "숙박: 둔황"], ["막고굴과 명사산", "예약 입장 후 늦은 시간 사구로 이동.", "숙박: 둔황"], ["자위관", "장성 서단의 관성을 천천히 봅니다.", "숙박: 자위관"], ["장예 단샤", "오후 빛에 맞춰 단샤를 봅니다.", "숙박: 장예"], ["장예 출발", "전용 이동과 환승 여유.", "출발일"]],
    photo: ["실제 장소", "여섯 장면으로 보는 칭하이·간쑤", "9일 루트의 실제 정차 지점입니다."], scenes: [["2일차 · 칭하이호", "고도와 빛을 살피며 첫 큰 풍경으로."], ["3일차 · 차카", "날씨와 반사에 따라 시간을 조정."], ["6일차 · 막고굴", "배경을 이해한 뒤 예약 입장."], ["4일차 · 다차이단 비취호", "바람과 날씨에 맞춰 호수의 색을 천천히 봅니다."], ["7일차 · 자위관", "지나치지 않고 한 장면으로 이해."], ["8일차 · 장예", "단샤의 색으로 루트를 마무리."]],
    fitTitle: "이 루트가 맞는 여행자", fitIntro: "속도보다 중국 서북을 하나의 흐름으로 보고 싶은 분에게 맞습니다.", fitCards: [["추천", "칭하이와 간쑤를 한 번에 보고 싶을 때."], ["고려", "고도와 장거리 차량 이동이 힘들 때."], ["편안함", "전용차, 객실, 회복 시간을 우선합니다."]], faqTitle: "자주 묻는 질문", faqs: [["둔황만 가는 여행인가요", "아닙니다. 둔황은 9일 중 핵심 2일입니다."], ["왜 9일인가요", "주요 장소를 짧은 사진 정차로 만들지 않기 위해서입니다."], ["항공권이 포함되나요", "아닙니다. 공개가는 현지 일정 기준입니다."]],
  },
  th: {
    region: "ชิงไห่–กานซู่", name: "วงใหญ่ชิงไห่–กานซู่", duration: "9 วัน · 8 คืน", heading: ["วงใหญ่ชิงไห่–กานซู่", "ทะเลสาบ ถ้ำ และเส้นทางสายไหม"], lead: "เส้นทางส่วนตัวจากซีหนิง ผ่านทะเลสาบชิงไห่ ฉาข่า ต้าไฉตั้น ตุนหวง เจียยวี่กวน และจางเย่ ใน 9 วันที่ไม่เร่งเกินไป", route: "ซีหนิง → ทะเลสาบชิงไห่ → ฉาข่า → ต้าไฉตั้น → ตุนหวง → เจียยวี่กวน → จางเย่", season: "พฤษภาคม–ตุลาคม", group: "เริ่ม 2 ท่าน · ราคาเผยแพร่สำหรับ 6 ท่าน", cta: "วางแผนเส้นทางนี้", view: "ดูครบ 9 วัน",
    labels: { price: "ราคาเริ่มต้น", group: "กลุ่มส่วนตัว", season: "ฤดูกาล", route: "เส้นทาง", pace: "จังหวะ", fit: "เหมาะกับ", standard: "เส้นทางส่วนตัวมาตรฐาน", days: "แผนรายวัน" }, pace: "พัก 7 จุด · รถส่วนตัว · ไม่ย้อนกลับซีหนิง", fit: "ผู้ที่อยากเห็นชิงไห่และกานซู่ทั้งเส้น ไม่ใช่แค่ตุนหวง", intro: "เชื่อมทะเลสาบบนที่สูง ทะเลสาบเกลือ โกบี ถ้ำม่อเกา กำแพงเมือง และภูมิประเทศจางเย่", note: "ราคาอ้างอิงภาคพื้นดิน ไม่รวมเที่ยวบินระหว่างประเทศ และยืนยันตามฤดูกาล ห้องพัก และจำนวนคน", dayIntro: "บอกวันเดินทางไกลและเมืองพักให้ชัดก่อน แล้วจึงปรับโรงแรมและภาษา", visualNotes: ["ตรวจความสบายต่อระดับความสูงก่อน.", "ม่อเกาตามเวลาจองจริง.", "วันรถยาวมีเวลาพักและเผื่ออากาศ."],
    days: [["ถึงซีหนิง", "รถส่วนตัวรับและพักเร็ว.", "พัก: ซีหนิง"], ["ทะเลสาบชิงไห่", "จัดเวลาแสงและการปรับตัวกับความสูง.", "พัก: รอบทะเลสาบ"], ["ทะเลสาบเกลือฉาข่า", "เลือกเวลาตามอากาศและเงาสะท้อน.", "พัก: ฉาข่าหรือเต๋อหลิงฮา"], ["ต้าไฉตั้นและถนนโกบี", "ข้ามไฉต๋ามู่พร้อมจุดพักชัดเจน.", "พัก: ต้าไฉตั้น"], ["เดินทางสู่ตุนหวง", "เป็นวันเดินทางและพักเมื่อถึง.", "พัก: ตุนหวง"], ["ถ้ำม่อเกาและหมิงซาซาน", "เข้าตามเวลา แล้วไปเนินทรายช่วงเย็น.", "พัก: ตุนหวง"], ["เจียยวี่กวน", "ชมด่านกำแพงเมืองอย่างไม่รีบ.", "พัก: เจียยวี่กวน"], ["จางเย่ตันเสีย", "เก็บภูมิประเทศสีสันในแสงบ่าย.", "พัก: จางเย่"], ["ออกจากจางเย่", "รถส่วนตัวส่งพร้อมเวลาเผื่อต่อรถ.", "วันเดินทางกลับ"]],
    photo: ["สถานที่จริง", "หกภาพของวงใหญ่ชิงไห่–กานซู่", "ภาพจริงที่ตรงกับจุดหยุดในเส้นทาง 9 วัน"], scenes: [["วันที่ 2 · ชิงไห่", "เริ่มภูมิทัศน์ใหญ่โดยเผื่อเรื่องความสูง."], ["วันที่ 3 · ฉาข่า", "ปรับเวลาตามอากาศและเงาสะท้อน."], ["วันที่ 6 · ม่อเกา", "เข้าใจบริบทก่อนเข้าตามเวลาจอง."], ["วันที่ 4 · ทะเลสาบมรกตต้าไฉตั้น", "จัดเวลาตามลมและอากาศเพื่อเห็นสีของทะเลสาบ."], ["วันที่ 7 · เจียยวี่กวน", "ให้ด่านเป็นหนึ่งบท ไม่ใช่จุดผ่าน."], ["วันที่ 8 · จางเย่", "ปิดเส้นทางด้วยสีของตันเสีย."]],
    fitTitle: "เส้นทางนี้เหมาะกับใคร", fitIntro: "เหมาะกับคนที่อยากเห็นจีนตะวันตกเฉียงเหนือเป็นเรื่องเดียว ไม่ใช่สะสมชื่อสถานที่", fitCards: [["เหมาะ", "อยากเห็นชิงไห่และกานซู่ในทริปเดียว."], ["คิดก่อน", "ไม่สบายกับที่สูงหรือวันรถยาว."], ["ความสบาย", "รถส่วนตัว ห้องที่ดี และเวลาพักมาก่อน."]], faqTitle: "คำถามที่พบบ่อย", faqs: [["มีแค่ตุนหวงหรือไม่", "ไม่ใช่ ตุนหวงเป็นสองวันสำคัญในเส้นทาง 9 วัน."], ["ทำไมต้อง 9 วัน", "เพื่อไม่ให้ทุกจุดเป็นเพียงแวะถ่ายรูป."], ["รวมตั๋วเครื่องบินไหม", "ไม่รวม ราคาเป็นบริการภาคพื้นดิน."]],
  },
  ru: {
    region: "Цинхай и Ганьсу", name: "Большое кольцо Цинхай — Ганьсу", duration: "9 дней · 8 ночей", heading: ["Большое кольцо Цинхай — Ганьсу", "Озёра, пещеры и Шёлковый путь"], lead: "Частный маршрут из Синина через озеро Цинхай, Чака, Дачайдан, Дуньхуан, Цзяюйгуань и Чжанъе — без попытки превратить дорогу в гонку.", route: "Синин → озеро Цинхай → Чака → Дачайдан → Дуньхуан → Цзяюйгуань → Чжанъе", season: "Май–октябрь", group: "От 2 человек · публичная цена для 6", cta: "Запросить этот маршрут", view: "Все 9 дней",
    labels: { price: "Стоимость", group: "Частная группа", season: "Сезон", route: "Маршрут", pace: "Темп", fit: "Подходит", standard: "Стандартный частный маршрут", days: "Маршрут по дням" }, pace: "7 баз · частный автомобиль · без возврата в Синин", fit: "Тем, кто хочет увидеть Цинхай и Ганьсу целиком, а не только Дуньхуан", intro: "Высокогорные озёра, солончак, Гоби, Могао, крепость и данься соединены в одну понятную линию.", note: "Ориентир по наземной части. Международные перелёты не включены; итог зависит от сезона, номера и группы.", dayIntro: "Длинные переезды и ночёвки показаны заранее. Отели и языковая поддержка уточняются после заявки.", visualNotes: ["Высоту обсуждаем до озёрных дней.", "Могао — по времени брони.", "На длинных дорогах есть запас на отдых и погоду."],
    days: [["Прибытие в Синин", "Встреча и ранний отдых.", "Ночь: Синин"], ["Озеро Цинхай", "Свет и адаптация к высоте определяют ритм.", "Ночь: у озера"], ["Солёное озеро Чака", "Время выбирается по погоде и отражениям.", "Ночь: Чака или Дэлинха"], ["Дачайдан и дорога через Гоби", "Переезд с понятными остановками.", "Ночь: Дачайдан"], ["В Дуньхуан", "Честный день дороги и отдых по прибытии.", "Ночь: Дуньхуан"], ["Могао и Минша", "Вход по брони и дюны ближе к вечеру.", "Ночь: Дуньхуан"], ["Цзяюйгуань", "Крепость западной границы без спешки.", "Ночь: Цзяюйгуань"], ["Данься Чжанъе", "Цветные склоны при подходящем свете.", "Ночь: Чжанъе"], ["Отъезд из Чжанъе", "Индивидуальный трансфер и запас на пересадку.", "День отъезда"]],
    photo: ["Реальные места", "Шесть кадров большого кольца", "Каждая фотография соответствует реальной остановке девятидневного маршрута."], scenes: [["День 2 · Озеро Цинхай", "Первый большой пейзаж с учётом высоты."], ["День 3 · Чака", "Время зависит от погоды и отражений."], ["День 6 · Могао", "Контекст и вход по брони."], ["День 4 · Изумрудное озеро Дачайдан", "Цвет воды смотрят с учётом ветра и погоды."], ["День 7 · Цзяюйгуань", "Крепость — отдельная глава, не фотостоп."], ["День 8 · Чжанъе", "Цветная данься завершает маршрут."]],
    fitTitle: "Кому подходит кольцо", fitIntro: "Тем, кто хочет связный Северо-Запад, а не список быстрых остановок.", fitCards: [["Подходит", "Цинхай и Ганьсу в одной частной поездке."], ["Подумать", "Если тяжело переносите высоту и долгую дорогу."], ["Комфорт", "Частный транспорт, хороший номер и время на восстановление."]], faqTitle: "Частые вопросы", faqs: [["Это только Дуньхуан?", "Нет. Дуньхуан — два центральных дня маршрута из Синина в Чжанъе."], ["Почему девять дней?", "Чтобы главные места не стали короткими фотостопами."], ["Перелёты включены?", "Нет. Публичная цена относится к наземной части."]],
  },
};

// Thai needs an intentional break here; otherwise the route name leaves a two-letter orphan on 390px screens.
copy.th.heading = ["วงใหญ่ชิงไห่–กานซู่", "ทะเลสาบ ถ้ำ และเส้นทางสายไหม"];

const files = [
  ["dunhuang.html", "en", "/interest.html"],
  ["en/dunhuang/index.html", "en", "/en/interest/"],
  ["zh/dunhuang/index.html", "zh", "/zh/interest/"],
  ["ja/dunhuang/index.html", "ja", "/ja/interest/"],
  ["ko/dunhuang/index.html", "ko", "/ko/interest/"],
  ["th/dunhuang/index.html", "th", "/th/interest/"],
  ["ru/dunhuang/index.html", "ru", "/ru/interest/"],
];

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function dayLabel(locale, index) {
  if (locale === "zh") return `第 ${index} 天`;
  if (locale === "ja") return `${index}日目`;
  if (locale === "ko") return `${index}일차`;
  if (locale === "th") return `วันที่ ${index}`;
  if (locale === "ru") return `День ${index}`;
  return `Day ${index}`;
}

function updateProductSchema(html, data, canonical) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (block, json) => {
    let schema;
    try { schema = JSON.parse(json); } catch { return block; }
    if (schema?.["@type"] !== "Product") return block;
    schema.name = data.name;
    schema.description = data.lead;
    schema.image = `https://bluehourchina.com${mainImage}`;
    schema.url = canonical;
    schema.offers = { "@type": "Offer", priceCurrency: "CNY", price, url: canonical, availability: "https://schema.org/InStock" };
    schema.additionalProperty = [
      { "@type": "PropertyValue", name: data.labels.route, value: data.route },
      { "@type": "PropertyValue", name: "Duration", value: data.duration },
      { "@type": "PropertyValue", name: data.labels.group, value: data.group },
      { "@type": "PropertyValue", name: "Public starting price basis", value: "Based on 6 travellers; prices for 2 or 4 travellers are provided after inquiry" },
    ];
    return `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n  </script>`;
  });
}

function hero(data, locale, cta) {
  const titleClass = locale === "th" ? ' class="thai-route-title"' : locale === "en" || locale === "ru" ? "" : ' class="cjk-title"';
  return `<section class="hero destination-hero"><div class="wrap hero-inner"><p class="eyebrow">${data.region} · ${data.duration}</p><h1${titleClass}>${data.heading.map((line, index) => `<span class="title-line${locale === "th" && index === 0 ? " thai-nowrap" : ""}">${line}</span>`).join("")}</h1><p class="lead">${data.lead}</p><div class="hero-actions"><a class="btn primary" href="${cta}?destination=dunhuang&amp;utm_source=destination_hero&amp;utm_medium=site&amp;utm_campaign=private_route_consultation">${data.cta}</a><a class="btn" href="#day-plan">${data.view}</a></div><div class="facts"><div class="fact"><b>${data.labels.price}</b><span>${displayPrice}</span></div><div class="fact"><b>${data.labels.group}</b><span>${data.group}</span></div><div class="fact"><b>${data.labels.season}</b><span>${data.season}</span></div></div></div></section>`;
}

function standard(data, locale) {
  const titleClass = locale === "en" || locale === "ru" || locale === "th" ? "" : ' class="cjk-title"';
  return `<section class="section standard-route-band" id="standard-route"><div class="wrap route-showcase"><div class="route-copy"><p class="eyebrow">${data.labels.standard}</p><h2${titleClass}>${data.name}</h2><p>${data.intro}</p><div class="route-price"><span>${data.duration}</span><strong>${displayPrice}</strong><small>${data.group}</small></div><div class="route-points"><div><b>${data.labels.route}</b><span>${data.route}</span></div><div><b>${data.labels.pace}</b><span>${data.pace}</span></div><div><b>${data.labels.fit}</b><span>${data.fit}</span></div><div><b>${data.labels.season}</b><span>${data.season}</span></div></div><p class="route-note">${data.note}</p></div><div class="route-card"><div class="route-image"><img src="${mainImage}" alt="${esc(data.name)}"></div><div class="route-map"><h3>${data.labels.route}</h3><div class="map-line">${data.route.split(" → ").map((stop) => `<span>${stop}</span>`).join("")}</div></div></div></div></section>`;
}

function dayPlan(data, locale, cta) {
  const items = data.days.map((day, index) => `<article class="route-day-item"><div class="route-day-index">${dayLabel(locale, index + 1)}</div><div class="route-day-copy"><h3>${day[0]}</h3><p>${day[1]}</p><span>${day[2]}</span></div></article>`).join("");
  return `<section class="section route-day-plan-band" id="day-plan"><div class="wrap route-day-plan-wrap"><div class="route-day-head"><div><p class="eyebrow">${data.labels.days}</p><h2>${data.duration}</h2><p>${data.dayIntro}</p></div><div class="route-terms"><div><b>${data.labels.price}</b><span>${displayPrice}</span></div><div><b>${data.labels.group}</b><span>${data.group}</span></div></div></div><div class="route-day-layout"><div class="route-day-list">${items}</div><aside class="route-visual-panel"><figure><img src="${mainImage}" alt="${esc(data.name)}"><figcaption>${data.route}</figcaption></figure><ul class="route-visual-notes">${data.visualNotes.map((note, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${note}</span></li>`).join("")}</ul><p class="route-note">${data.note}</p><a class="btn primary dark-gold" href="${cta}?destination=dunhuang&amp;utm_source=route_day_plan&amp;utm_medium=site&amp;utm_campaign=private_route_consultation">${data.cta}</a></aside></div></div></section>`;
}

function gallery(data, locale) {
  const titleClass = locale === "en" || locale === "ru" || locale === "th" ? "" : ' class="cjk-title"';
  const cards = data.scenes.map((scene, index) => `<figure class="material-card"><img loading="lazy" src="${routeImages[index]}" alt="${esc(scene[0])}"><figcaption><b>${scene[0]}</b><span>${scene[1]}</span></figcaption></figure>`).join("");
  return `<section class="section material-notes-band" id="real-scenes"><div class="wrap material-notes-wrap"><div class="material-notes-intro"><div><p class="eyebrow">${data.photo[0]}</p><h2${titleClass}>${data.photo[1]}</h2></div><p>${data.photo[2]}</p></div><div class="material-grid">${cards}</div></div></section>`;
}

function decision(data, locale) {
  const titleClass = locale === "en" || locale === "ru" || locale === "th" ? "" : ' class="cjk-title"';
  return `<section class="section content-95-band" id="route-fit"><div class="wrap content-95-wrap"><div class="content-95-intro"><p class="eyebrow">${data.labels.fit}</p><h2${titleClass}>${data.fitTitle}</h2><p>${data.fitIntro}</p></div><div class="fit-grid">${data.fitCards.map((card) => `<article><b>${card[0]}</b><p>${card[1]}</p></article>`).join("")}</div></div></section><section class="section faq-band" id="faq"><div class="wrap"><div class="section-head compact-head"><div><p class="eyebrow">FAQ</p><h2${titleClass}>${data.faqTitle}</h2></div></div><div class="faq-grid">${data.faqs.map((faq) => `<article class="faq-item"><h3>${faq[0]}</h3><p>${faq[1]}</p></article>`).join("")}</div></div></section>`;
}

async function updateFile(file, locale, interest) {
  const absolute = path.join(root, file);
  let html = await fs.readFile(absolute, "utf8");
  const data = copy[locale];
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || `https://bluehourchina.com/${file}`;
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${data.name}｜${data.duration}｜Bluehour China</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(data.lead)} ${displayPrice}.">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(data.name)}｜Bluehour China">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(data.lead)}">`)
    .replace(/--hero-image:url\('[^']+'\)/, `--hero-image:url('${mainImage}')`)
    .replace(/--cta-image:url\('[^']+'\)/, `--cta-image:url('/assets/real-qinggan/zhangye-danxia-cc-by-sa.jpg')`);
  html = updateProductSchema(html, data, canonical);
  html = html.replace(/<section class="hero destination-hero"[\s\S]*?(?=<section class="section standard-route-band")/, `${hero(data, locale, interest)}\n  `);
  html = html.replace(/<section class="section standard-route-band"[\s\S]*?(?=(?:\s*<!-- route-day-plan-start -->)?\s*<section class="section route-day-plan-band")/, `${standard(data, locale)}\n  `);
  const days = dayPlan(data, locale, interest);
  if (html.includes("<!-- route-day-plan-start -->")) html = html.replace(/<!-- route-day-plan-start -->[\s\S]*?<!-- route-day-plan-end -->/, `<!-- route-day-plan-start -->\n    ${days}\n    <!-- route-day-plan-end -->`);
  else html = html.replace(/<section class="section route-day-plan-band"[\s\S]*?(?=<section class="section material-notes-band")/, `${days}\n  `);
  const photos = gallery(data, locale);
  if (html.includes("<!-- real-scenes-start -->")) html = html.replace(/<!-- real-scenes-start -->[\s\S]*?<!-- real-scenes-end -->/, `<!-- real-scenes-start -->\n    ${photos}\n    <!-- real-scenes-end -->`);
  else html = html.replace(/<section class="section material-notes-band"[\s\S]*?(?=<section class="section care-band")/, `${photos}\n  `);
  const decisions = decision(data, locale);
  if (html.includes("<!-- content-95-start -->")) html = html.replace(/<!-- content-95-start -->[\s\S]*?<!-- content-95-end -->/, `<!-- content-95-start -->\n    ${decisions}\n    <!-- content-95-end -->`);
  else html = html.replace(/(?=<section class="section care-band")/, `${decisions}\n  `);
  await fs.writeFile(absolute, html.replace(/[ \t]+$/gm, ""));
}

for (const args of files) await updateFile(...args);

for (const file of ["llms.txt", "llms-full.txt"]) {
  const absolute = path.join(root, file);
  let text = await fs.readFile(absolute, "utf8");
  text = text.replace(/- Dunhuang Silk Road Light:[^\n]+/g, "- Qinghai-Gansu Grand Loop: 9 days and 8 nights, Xining · Qinghai Lake · Chaka · Dachaidan · Dunhuang · Jiayuguan · Zhangye, from RMB 4,980 per traveller based on 6 travellers.");
  text = text.replace(/Standard route: Dunhuang Silk Road Light[^\n]+/g, "Standard route: Qinghai-Gansu Grand Loop, 9 days and 8 nights, Xining · Qinghai Lake · Chaka · Dachaidan · Dunhuang · Jiayuguan · Zhangye, from RMB 4,980 per traveller based on 6 travellers.");
  await fs.writeFile(absolute, text);
}

console.log("Upgraded the Dunhuang product into the nine-day Qinghai-Gansu Grand Loop.");
await import("./sync-home-route-products.mjs");
await import("./normalize-home-destination-copy.mjs");
await import("./apply-retail-margin-prices.mjs");
