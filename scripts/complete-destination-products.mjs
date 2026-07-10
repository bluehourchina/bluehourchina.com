import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const destinations = ["dunhuang", "sanya", "northeast"];

const ui = {
  en: {
    standard: "Standard private route",
    route: "Route",
    pace: "Pace",
    bestFor: "Best for",
    firstCheck: "Confirm first",
    routeShape: "Route at a glance",
    ask: "Ask for dates & quote",
    dayPlan: "Day-by-day route",
    dayPlanIntro: "A clear starting plan. We refine it only after confirming your dates, room level, walking comfort and language needs.",
    days: "Length",
    from: "From",
    group: "Private group",
    imageNotes: "Route notes",
    included: "Included in the starting estimate",
    separate: "Quoted separately",
    noPayment: "No payment is required to send your request.",
    scenes: "Route in real scenes",
    sceneTitle: "See where each day goes",
    sceneIntro: "Real location photography, matched to the days in the route. Final access and timing are reconfirmed for your travel month.",
    propertyDuration: "Duration",
    propertyRoute: "Route",
    propertyGroup: "Minimum private group",
    propertyBest: "Best for",
  },
  zh: {
    standard: "標準私人路線",
    route: "路線",
    pace: "節奏",
    bestFor: "適合",
    firstCheck: "先確認",
    routeShape: "路線一覽",
    ask: "索取日期與正式報價",
    dayPlan: "逐日路線",
    dayPlanIntro: "先公開一條可執行的標準方案。確認日期、房型、步行舒適度與語言需求後，再做私人調整。",
    days: "天數",
    from: "每人起價",
    group: "私人成行",
    imageNotes: "路線說明",
    included: "標準起價包含",
    separate: "另外報價",
    noPayment: "送出需求不需付款。",
    scenes: "沿路實景",
    sceneTitle: "每天去到哪裡",
    sceneIntro: "以下皆為路線實際地點照片，並與每日安排對照。正式出發前仍會依月份確認開放狀態與最佳時段。",
    propertyDuration: "天數",
    propertyRoute: "路線",
    propertyGroup: "最低私人成行人數",
    propertyBest: "適合旅客",
  },
  ja: {
    standard: "標準プライベートルート",
    route: "ルート",
    pace: "旅のペース",
    bestFor: "おすすめ",
    firstCheck: "最初に確認",
    routeShape: "ルート概要",
    ask: "日程と正式見積りを相談する",
    dayPlan: "日ごとのルート",
    dayPlanIntro: "実行できる標準日程を先に公開します。旅行日、部屋、歩行量、言語サポートを確認してから個別に整えます。",
    days: "日数",
    from: "1名様料金",
    group: "プライベート手配",
    imageNotes: "ルートの要点",
    included: "基本料金に含むもの",
    separate: "別途見積り",
    noPayment: "お問い合わせの送信にお支払いは不要です。",
    scenes: "実景で見るルート",
    sceneTitle: "日ごとの場所が見える旅程",
    sceneIntro: "ルート上の実際の場所を撮影した写真です。開館状況と最適な時間帯は旅行月に合わせて再確認します。",
    propertyDuration: "日数",
    propertyRoute: "ルート",
    propertyGroup: "最少催行人数",
    propertyBest: "おすすめ",
  },
  ko: {
    standard: "표준 프라이빗 여정",
    route: "경로",
    pace: "여행 속도",
    bestFor: "추천 대상",
    firstCheck: "먼저 확인",
    routeShape: "한눈에 보는 경로",
    ask: "날짜와 정식 견적 문의",
    dayPlan: "일자별 경로",
    dayPlanIntro: "실행 가능한 표준 일정을 먼저 공개합니다. 날짜, 객실, 보행 편의, 언어 지원을 확인한 뒤 맞춤 조정합니다.",
    days: "기간",
    from: "1인 시작가",
    group: "프라이빗 그룹",
    imageNotes: "경로 포인트",
    included: "시작가 포함 사항",
    separate: "별도 견적",
    noPayment: "문의 제출에는 결제가 필요하지 않습니다.",
    scenes: "실제 사진으로 보는 경로",
    sceneTitle: "매일 어디로 가는지 확인하세요",
    sceneIntro: "일정의 실제 장소를 촬영한 사진입니다. 운영 여부와 가장 좋은 시간은 여행 월에 맞춰 다시 확인합니다.",
    propertyDuration: "기간",
    propertyRoute: "경로",
    propertyGroup: "최소 프라이빗 인원",
    propertyBest: "추천 대상",
  },
  th: {
    standard: "เส้นทางส่วนตัวมาตรฐาน",
    route: "เส้นทาง",
    pace: "จังหวะการเดินทาง",
    bestFor: "เหมาะสำหรับ",
    firstCheck: "สิ่งที่ต้องยืนยันก่อน",
    routeShape: "ภาพรวมเส้นทาง",
    ask: "สอบถามวันเดินทางและใบเสนอราคา",
    dayPlan: "เส้นทางรายวัน",
    dayPlanIntro: "เราแสดงแผนมาตรฐานที่เดินทางได้จริงก่อน แล้วจึงปรับตามวันเดินทาง ระดับห้องพัก ความสะดวกในการเดิน และภาษาที่ต้องการ",
    days: "ระยะเวลา",
    from: "ราคาเริ่มต้นต่อคน",
    group: "กลุ่มส่วนตัว",
    imageNotes: "จุดสำคัญของเส้นทาง",
    included: "รวมในราคาเริ่มต้น",
    separate: "เสนอราคาแยก",
    noPayment: "ส่งคำขอได้โดยยังไม่ต้องชำระเงิน",
    scenes: "เส้นทางผ่านภาพสถานที่จริง",
    sceneTitle: "เห็นชัดว่าแต่ละวันไปที่ไหน",
    sceneIntro: "ภาพถ่ายสถานที่จริงที่ตรงกับแต่ละช่วงของเส้นทาง เราจะยืนยันเวลาเปิดและช่วงเวลาที่เหมาะสมอีกครั้งตามเดือนเดินทาง",
    propertyDuration: "ระยะเวลา",
    propertyRoute: "เส้นทาง",
    propertyGroup: "จำนวนขั้นต่ำสำหรับกลุ่มส่วนตัว",
    propertyBest: "เหมาะสำหรับ",
  },
};

const prices = {
  dunhuang: {
    en: { display: "US$1,450", currency: "USD", number: "1450" },
    zh: { display: "RMB 9,800", currency: "CNY", number: "9800" },
    ja: { display: "JPY 235,000", currency: "JPY", number: "235000" },
    ko: { display: "KRW 2,200,000", currency: "KRW", number: "2200000" },
    th: { display: "THB 48,000", currency: "THB", number: "48000" },
  },
  sanya: {
    en: { display: "US$1,350", currency: "USD", number: "1350" },
    zh: { display: "RMB 9,200", currency: "CNY", number: "9200" },
    ja: { display: "JPY 220,000", currency: "JPY", number: "220000" },
    ko: { display: "KRW 2,100,000", currency: "KRW", number: "2100000" },
    th: { display: "THB 45,000", currency: "THB", number: "45000" },
  },
  northeast: {
    en: { display: "US$1,600", currency: "USD", number: "1600" },
    zh: { display: "RMB 10,800", currency: "CNY", number: "10800" },
    ja: { display: "JPY 255,000", currency: "JPY", number: "255000" },
    ko: { display: "KRW 2,400,000", currency: "KRW", number: "2400000" },
    th: { display: "THB 52,000", currency: "THB", number: "52000" },
  },
};

const product = {
  dunhuang: {
    mainImage: "/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg",
    galleryClass: "",
    locales: {
      en: {
        name: "Dunhuang Silk Road Light",
        duration: "6 days · 5 nights",
        summary: "Six days linking the Mogao Caves, the western Silk Road ruins and the dunes at the hour when the desert softens.",
        route: "Dunhuang → Mogao Caves → Yumen Pass & Yadan → Mingsha Mountain",
        pace: "One main focus a day; Day 4 is the only long drive",
        bestFor: "Art, Silk Road history and desert landscapes",
        firstCheck: "Mogao tickets, heat tolerance and arrival transport",
        shape: ["Arrive & understand Dunhuang", "Mogao Caves", "Western Silk Road day", "Mingsha & Crescent Spring"],
        group: "From 2 travellers · best for 2–6",
        days: [
          ["Day 1", "Arrive in Dunhuang", "Private pickup, hotel check-in and an unhurried first evening.", "Stay: Dunhuang"],
          ["Day 2", "Dunhuang Museum and city context", "Dunhuang Museum, local history and a calm afternoon before the cave day.", "Stay: Dunhuang"],
          ["Day 3", "Mogao Caves and Shazhou evening", "Digital exhibition, reserved cave visit and a choice of Shazhou Night Market or a quiet dinner.", "Stay: Dunhuang"],
          ["Day 4", "Yumen Pass, Han Great Wall and Yadan sunset", "An early start for the western route. This is the longest driving day, paced around the desert light.", "Stay: Dunhuang"],
          ["Day 5", "Mingsha Mountain and Crescent Spring", "A slow morning, then the dunes after the heat drops. An evening performance remains optional.", "Stay: Dunhuang"],
          ["Day 6", "Departure or Liuyuan connection", "Private transfer to Dunhuang airport, station or Liuyuan for the next Silk Road stop.", "Departure day"],
        ],
        notes: ["Mogao entry is timed and should be reserved early.", "The western route is beautiful but long; it stays as one dedicated day.", "Dunes are scheduled for light and temperature, not convenience."],
        included: ["5 nights in a quality local hotel, twin-share", "Private vehicle and driver on route days", "Listed core admissions and reservation coordination", "English-speaking guide on core sightseeing days"],
        separate: ["Flights or intercity rail to and from Dunhuang", "Meals not listed and optional performances", "Single-room supplement or hotel upgrades", "Visa, insurance and personal spending"],
        caption: "Real scene · Crescent Spring beneath the Mingsha dunes",
        sceneTitle: "Mogao, the western frontier and the dunes",
        gallery: [
          ["/assets/real-dunhuang/mogao-caves-cc-by-sa.jpg", "Mogao Caves exterior in Dunhuang", "Days 2–3 · Mogao Caves", "Museum context comes first; timed cave access follows on a separate day."],
          ["/assets/real-dunhuang/yumen-pass-cc-by-sa.jpg", "Yumen Pass ruin west of Dunhuang", "Day 4 · Western route", "Yumen Pass, the Han Great Wall and Yadan form one long, private-vehicle day."],
          ["/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg", "Crescent Spring and Mingsha dunes", "Day 5 · Mingsha Mountain", "The dunes are kept for late afternoon when heat and light are kinder."],
        ],
      },
      zh: {
        name: "敦煌絲路光影線",
        duration: "6 天 5 夜",
        summary: "六天串起莫高窟、絲路西線遺址與鳴沙山，把唯一的長車程留給值得的一天。",
        route: "敦煌 → 莫高窟 → 玉門關與雅丹 → 鳴沙山月牙泉",
        pace: "每天一個核心；第 4 天為唯一長車程",
        bestFor: "佛教藝術、絲路歷史與沙漠風景",
        firstCheck: "莫高窟票、耐熱程度與抵達交通",
        shape: ["抵達並讀懂敦煌", "莫高窟", "絲路西線一日", "鳴沙山月牙泉"],
        group: "2 人起 · 建議 2–6 人",
        days: [
          ["第 1 天", "抵達敦煌", "私人接送、入住，第一晚不安排重行程。", "住宿：敦煌"],
          ["第 2 天", "敦煌博物館與城市背景", "先從博物館與地方歷史理解絲路，下午留出休息。", "住宿：敦煌"],
          ["第 3 天", "莫高窟與沙州夜色", "數字展示、預約洞窟參觀；晚上可選沙州夜市或安靜晚餐。", "住宿：敦煌"],
          ["第 4 天", "玉門關、漢長城與雅丹日落", "清晨出發走絲路西線。這是全程最長車日，依沙漠光線安排節奏。", "住宿：敦煌"],
          ["第 5 天", "鳴沙山月牙泉", "上午慢下來，降溫後再進沙丘；晚間演出保留為自選。", "住宿：敦煌"],
          ["第 6 天", "離開敦煌或銜接柳園", "私人送往機場、車站或柳園，繼續下一段絲路。", "離開日"],
        ],
        notes: ["莫高窟採分時入場，建議提早確認。", "西線景色值得，但車程長，因此獨立成一天。", "沙丘依溫度與光線安排，不在最熱時段趕景點。"],
        included: ["5 晚品質旅宿，雙人房入住", "路線日私人車與司機", "表列核心門票與預約協調", "中文在地協調與主要景點導覽安排"],
        separate: ["往返敦煌的機票或城際火車", "未列餐食與自選演出", "單房差與旅宿升級", "簽證、保險與個人消費"],
        caption: "實景 · 鳴沙山下的月牙泉",
        sceneTitle: "莫高窟、西線遺址與鳴沙山",
        gallery: [
          ["/assets/real-dunhuang/mogao-caves-cc-by-sa.jpg", "敦煌莫高窟外觀實景", "第 2–3 天 · 莫高窟", "先有博物館脈絡，再依預約時段進入洞窟。"],
          ["/assets/real-dunhuang/yumen-pass-cc-by-sa.jpg", "敦煌西線玉門關遺址實景", "第 4 天 · 絲路西線", "玉門關、漢長城與雅丹合成一個完整的私人車日。"],
          ["/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg", "鳴沙山月牙泉實景", "第 5 天 · 鳴沙山", "傍晚進沙丘，避開高溫，也保留更好的光。"],
        ],
      },
      ja: {
        name: "敦煌シルクロード光の旅",
        duration: "6日間・5泊",
        summary: "莫高窟、西域の遺跡、鳴沙山を6日で結び、長い移動は価値のある一日にまとめます。",
        route: "敦煌 → 莫高窟 → 玉門関・雅丹 → 鳴沙山月牙泉",
        pace: "1日1つの主題。4日目だけが長距離移動",
        bestFor: "仏教美術、シルクロード史、砂漠の景観",
        firstCheck: "莫高窟の入場、暑さ、敦煌までの交通",
        shape: ["敦煌到着と背景理解", "莫高窟", "西域遺跡の一日", "鳴沙山と月牙泉"],
        group: "2名様から · おすすめは2–6名様",
        days: [
          ["1日目", "敦煌到着", "専用車でお迎えし、ホテルへ。初日は重い予定を入れません。", "宿泊：敦煌"],
          ["2日目", "敦煌博物館と街の背景", "博物館と地域の歴史からシルクロードを理解し、午後は休息を残します。", "宿泊：敦煌"],
          ["3日目", "莫高窟と沙州の夜", "デジタル展示と予約済みの石窟見学。夜は沙州夜市または静かな夕食を選べます。", "宿泊：敦煌"],
          ["4日目", "玉門関・漢代長城・雅丹の夕景", "早朝に西ルートへ出発。全日程で最も長い移動日を砂漠の光に合わせます。", "宿泊：敦煌"],
          ["5日目", "鳴沙山と月牙泉", "午前はゆっくり過ごし、暑さが引いてから砂丘へ。夜の公演は任意です。", "宿泊：敦煌"],
          ["6日目", "敦煌出発または柳園へ", "空港、駅、または次のシルクロード区間へ向かう柳園まで専用車で送ります。", "出発日"],
        ],
        notes: ["莫高窟は時間指定制のため早めの予約が必要です。", "西ルートは長距離のため一日を丸ごと確保します。", "砂丘は暑さと光を基準に時間を決めます。"],
        included: ["上質な現地ホテル5泊・2名1室", "ルート日の専用車とドライバー", "記載された主要入場料と予約手配", "主要観光日の英語ガイド。日本語は空き状況により別見積り"],
        separate: ["敦煌までの航空券・都市間鉄道", "記載外の食事と任意の公演", "1名1室追加料金とホテルのアップグレード", "ビザ、保険、個人的費用"],
        caption: "実景 · 鳴沙山の麓にある月牙泉",
        sceneTitle: "莫高窟、西域遺跡、鳴沙山",
        gallery: [
          ["/assets/real-dunhuang/mogao-caves-cc-by-sa.jpg", "敦煌莫高窟の実景", "2–3日目 · 莫高窟", "博物館で背景を知り、翌日に予約時間に合わせて石窟へ入ります。"],
          ["/assets/real-dunhuang/yumen-pass-cc-by-sa.jpg", "敦煌西方の玉門関遺跡", "4日目 · 西ルート", "玉門関、漢代長城、雅丹を専用車で巡る長い一日です。"],
          ["/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg", "鳴沙山月牙泉の実景", "5日目 · 鳴沙山", "暑さが引き、光が柔らかくなる午後に砂丘へ入ります。"],
        ],
      },
      ko: {
        name: "둔황 실크로드 빛의 여정",
        duration: "6일 5박",
        summary: "막고굴, 서역 유적, 명사산을 6일로 잇고 긴 이동은 가치 있는 하루에 집중합니다.",
        route: "둔황 → 막고굴 → 옥문관·야단 → 명사산 월아천",
        pace: "하루 한 가지 중심. 4일 차만 장거리 이동",
        bestFor: "불교 예술, 실크로드 역사, 사막 풍경",
        firstCheck: "막고굴 입장, 더위 적응, 둔황 도착 교통",
        shape: ["둔황 도착과 배경 이해", "막고굴", "서부 실크로드 하루", "명사산과 월아천"],
        group: "2인부터 · 권장 2–6인",
        days: [
          ["1일 차", "둔황 도착", "전용 픽업과 체크인 후 첫날은 무리한 일정을 넣지 않습니다.", "숙박: 둔황"],
          ["2일 차", "둔황박물관과 도시의 맥락", "박물관과 지역 역사로 실크로드를 이해하고 오후에는 휴식을 둡니다.", "숙박: 둔황"],
          ["3일 차", "막고굴과 사저우의 저녁", "디지털 전시와 예약된 석굴 관람 후 사저우 야시장 또는 조용한 저녁을 선택합니다.", "숙박: 둔황"],
          ["4일 차", "옥문관, 한나라 장성, 야단 일몰", "이른 아침 서부 노선으로 출발합니다. 가장 긴 이동일을 사막의 빛에 맞춥니다.", "숙박: 둔황"],
          ["5일 차", "명사산과 월아천", "오전은 천천히 보내고 더위가 가신 뒤 사구로 갑니다. 야간 공연은 선택 사항입니다.", "숙박: 둔황"],
          ["6일 차", "출발 또는 류위안 연결", "공항, 역 또는 다음 실크로드 구간을 위한 류위안까지 전용 이동합니다.", "출발일"],
        ],
        notes: ["막고굴은 시간 지정 입장이므로 일찍 예약해야 합니다.", "서부 노선은 길기 때문에 하루를 온전히 배정합니다.", "사구는 편의보다 기온과 빛을 기준으로 정합니다."],
        included: ["품질 좋은 현지 호텔 5박·2인 1실", "경로일 전용 차량과 기사", "표기된 핵심 입장권과 예약 조정", "핵심 관광일 영어 가이드. 한국어는 가능 여부에 따라 별도 견적"],
        separate: ["둔황 왕복 항공·도시간 철도", "표기되지 않은 식사와 선택 공연", "1인실 추가금과 호텔 업그레이드", "비자, 보험, 개인 지출"],
        caption: "실제 풍경 · 명사산 아래 월아천",
        sceneTitle: "막고굴, 서부 유적, 명사산",
        gallery: [
          ["/assets/real-dunhuang/mogao-caves-cc-by-sa.jpg", "둔황 막고굴 실제 풍경", "2–3일 차 · 막고굴", "박물관에서 배경을 이해한 뒤 예약 시간에 맞춰 석굴을 관람합니다."],
          ["/assets/real-dunhuang/yumen-pass-cc-by-sa.jpg", "둔황 서부 옥문관 유적", "4일 차 · 서부 노선", "옥문관, 한나라 장성, 야단을 전용차로 잇는 긴 하루입니다."],
          ["/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg", "명사산 월아천 실제 풍경", "5일 차 · 명사산", "더위가 가시고 빛이 부드러워지는 오후에 사구로 들어갑니다."],
        ],
      },
      th: {
        name: "ตุนหวง แสงแห่งเส้นทางสายไหม",
        duration: "6 วัน 5 คืน",
        summary: "หกวันที่เชื่อมถ้ำโม่เกา โบราณสถานสายไหมตะวันตก และภูเขาทราย โดยรวมการเดินทางไกลไว้ในวันที่คุ้มค่าเพียงวันเดียว",
        route: "ตุนหวง → ถ้ำโม่เกา → ด่านอวี้เหมินและหย่าตั้น → หมิงซาซานเย่ว์หยาฉวน",
        pace: "วันละหนึ่งจุดหลัก วันที่ 4 เป็นวันเดียวที่เดินทางไกล",
        bestFor: "ศิลปะพุทธ ประวัติศาสตร์สายไหม และทะเลทราย",
        firstCheck: "ตั๋วถ้ำโม่เกา ความทนร้อน และการเดินทางเข้าตุนหวง",
        shape: ["ถึงตุนหวงและเข้าใจเมือง", "ถ้ำโม่เกา", "เส้นทางสายไหมตะวันตก", "หมิงซาซานและเย่ว์หยาฉวน"],
        group: "เริ่มที่ 2 คน · เหมาะที่สุด 2–6 คน",
        days: [
          ["วันที่ 1", "เดินทางถึงตุนหวง", "รถส่วนตัวรับส่ง เช็กอิน และไม่มีโปรแกรมหนักในเย็นแรก", "พัก: ตุนหวง"],
          ["วันที่ 2", "พิพิธภัณฑ์ตุนหวงและบริบทของเมือง", "ทำความเข้าใจเส้นทางสายไหมผ่านพิพิธภัณฑ์และประวัติศาสตร์ท้องถิ่น ก่อนพักช่วงบ่าย", "พัก: ตุนหวง"],
          ["วันที่ 3", "ถ้ำโม่เกาและค่ำคืนซาโจว", "ชมนิทรรศการดิจิทัลและถ้ำตามเวลาจอง ตอนเย็นเลือกตลาดกลางคืนซาโจวหรือมื้อเย็นเงียบ ๆ", "พัก: ตุนหวง"],
          ["วันที่ 4", "ด่านอวี้เหมิน กำแพงฮั่น และพระอาทิตย์ตกหย่าตั้น", "ออกเช้าสู่เส้นทางตะวันตก เป็นวันที่นั่งรถนานที่สุดและจัดจังหวะตามแสงทะเลทราย", "พัก: ตุนหวง"],
          ["วันที่ 5", "ภูเขาทรายหมิงซาและสระพระจันทร์เสี้ยว", "พักสบายในช่วงเช้า แล้วเข้าสู่เนินทรายหลังอากาศเย็นลง การแสดงช่วงค่ำเป็นตัวเลือก", "พัก: ตุนหวง"],
          ["วันที่ 6", "ออกเดินทางหรือเชื่อมต่อหลิ่วหยวน", "รถส่วนตัวไปสนามบิน สถานี หรือหลิ่วหยวนเพื่อเดินทางต่อบนเส้นทางสายไหม", "วันเดินทางกลับ"],
        ],
        notes: ["ถ้ำโม่เกาเข้าชมตามเวลาจอง ควรยืนยันล่วงหน้า", "เส้นทางตะวันตกใช้เวลานาน จึงแยกไว้เต็มหนึ่งวัน", "เวลาไปเนินทรายเลือกตามอุณหภูมิและแสง"],
        included: ["โรงแรมคุณภาพ 5 คืน พักห้องคู่", "รถส่วนตัวและคนขับในวันเดินทาง", "ค่าเข้าหลักตามรายการและการจอง", "ไกด์ภาษาอังกฤษในวันเที่ยวหลัก ภาษาไทยเสนอราคาตามจำนวนที่ว่าง"],
        separate: ["เที่ยวบินหรือรถไฟระหว่างเมืองไปกลับตุนหวง", "อาหารที่ไม่ระบุและการแสดงเสริม", "ค่าห้องเดี่ยวและการอัปเกรดโรงแรม", "วีซ่า ประกัน และค่าใช้จ่ายส่วนตัว"],
        caption: "สถานที่จริง · สระพระจันทร์เสี้ยวใต้ภูเขาทรายหมิงซา",
        sceneTitle: "ถ้ำโม่เกา โบราณสถานตะวันตก และหมิงซาซาน",
        gallery: [
          ["/assets/real-dunhuang/mogao-caves-cc-by-sa.jpg", "ภาพจริงภายนอกถ้ำโม่เกา", "วันที่ 2–3 · ถ้ำโม่เกา", "เริ่มจากพิพิธภัณฑ์เพื่อเข้าใจบริบท แล้วเข้าถ้ำตามเวลาจองในวันถัดไป"],
          ["/assets/real-dunhuang/yumen-pass-cc-by-sa.jpg", "ภาพจริงซากด่านอวี้เหมิน", "วันที่ 4 · เส้นทางตะวันตก", "ด่านอวี้เหมิน กำแพงฮั่น และหย่าตั้นรวมเป็นหนึ่งวันเต็มด้วยรถส่วนตัว"],
          ["/assets/real-dunhuang/crescent-lake-cc-by-sa.jpg", "ภาพจริงสระพระจันทร์เสี้ยวและหมิงซาซาน", "วันที่ 5 · หมิงซาซาน", "เข้าสู่เนินทรายในช่วงบ่ายเมื่ออากาศเย็นลงและแสงนุ่มขึ้น"],
        ],
      },
    },
  },
  sanya: {
    mainImage: "/assets/real-sanya/haitang-bay-cc-by-sa.jpg",
    galleryClass: "",
    locales: {
      en: {
        name: "Sanya Coast & Culture",
        duration: "5 days · 4 nights",
        summary: "A five-day private stay linking Haitang Bay, Li and Miao culture at Binglanggu, and a slow Yalong Bay coast day.",
        route: "Sanya Airport → Haitang Bay → Binglanggu → Yalong Bay",
        pace: "Two open resort mornings and one private cultural day",
        bestFor: "Couples, families and a warm-weather ending to China",
        firstCheck: "Resort level, beach location and typhoon season",
        shape: ["Arrive at Haitang Bay", "Resort & coast", "Binglanggu cultural day", "Yalong Bay & departure"],
        group: "From 2 travellers · best for 2–6",
        days: [
          ["Day 1", "Arrive and settle into Haitang Bay", "Private airport transfer, resort check-in and an open evening by the coast.", "Stay: Haitang Bay"],
          ["Day 2", "Haitang Bay resort day", "Breakfast, beach and pool time. No compulsory sightseeing is added to the first full day.", "Stay: Haitang Bay"],
          ["Day 3", "Binglanggu Li and Miao cultural day", "A private vehicle to Binglanggu for a focused cultural visit, then return to the resort before dinner.", "Stay: Haitang Bay"],
          ["Day 4", "Yalong Bay slow coast", "A later start for Yalong Bay, a seaside lunch and enough free time for the hotel to remain part of the trip.", "Stay: Sanya"],
          ["Day 5", "Departure", "Private airport transfer with time matched to your flight.", "Departure day"],
        ],
        notes: ["The hotel is part of the product, so beach and room category are confirmed first.", "Binglanggu is the one full cultural outing; the rest stays deliberately light.", "Rain and typhoon risk are reviewed before recommending dates."],
        included: ["4 nights in a selected beach resort, twin-share", "Private airport transfers and Binglanggu vehicle", "Binglanggu admission and booking coordination", "English-speaking local support on the cultural day"],
        separate: ["Flights to and from Sanya", "Meals not listed and resort activities", "Single-room supplement and room upgrades", "Visa, insurance and personal spending"],
        caption: "Real scene · Haitang Bay coastline and resort district",
        sceneTitle: "Haitang Bay, Binglanggu and Yalong Bay",
        gallery: [
          ["/assets/real-sanya/haitang-bay-cc-by-sa.jpg", "Aerial view of Haitang Bay in Sanya", "Days 1–2 · Haitang Bay", "The first two nights keep the resort, beach and room quality at the centre."],
          ["/assets/real-sanya/binglanggu-cc-by-sa.jpg", "Binglanggu Li and Miao cultural site", "Day 3 · Binglanggu", "One dedicated cultural day, reached by private vehicle and not squeezed between resort activities."],
          ["/assets/real-sanya/yalong-bay-panoramio-cc-by.jpg", "Palm trees and coast at Yalong Bay", "Day 4 · Yalong Bay", "A later coastal day with lunch and free time instead of a list of rushed stops."],
        ],
      },
      zh: {
        name: "三亞海岸與文化線",
        duration: "5 天 4 夜",
        summary: "五天連起海棠灣、檳榔谷黎苗文化與亞龍灣，把度假留白保留下來。",
        route: "三亞機場 → 海棠灣 → 檳榔谷 → 亞龍灣",
        pace: "兩個度假慢早晨，加一個私人文化日",
        bestFor: "伴侶、家庭與中國長線後的溫暖收尾",
        firstCheck: "旅宿等級、海灘位置與颱風季節",
        shape: ["抵達海棠灣", "度假村與海岸", "檳榔谷文化日", "亞龍灣與返程"],
        group: "2 人起 · 建議 2–6 人",
        days: [
          ["第 1 天", "抵達海棠灣", "私人接機、度假旅宿入住，第一晚留給海邊。", "住宿：海棠灣"],
          ["第 2 天", "海棠灣度假日", "早餐、沙灘與泳池。第一個完整日不強塞景點。", "住宿：海棠灣"],
          ["第 3 天", "檳榔谷黎苗文化日", "私人車前往檳榔谷，完成一個有重點的文化參訪，晚餐前回到旅宿。", "住宿：海棠灣"],
          ["第 4 天", "亞龍灣慢海岸", "晚一點出發，安排海邊午餐與自由時間，讓旅宿仍是旅程的一部分。", "住宿：三亞"],
          ["第 5 天", "離開三亞", "依航班時間私人送機。", "離開日"],
        ],
        notes: ["旅宿本身就是產品，先確認海灘與房型。", "檳榔谷是唯一完整文化外出日，其餘刻意留白。", "推薦日期前會先檢視降雨與颱風風險。"],
        included: ["4 晚精選海濱旅宿，雙人房入住", "私人接送機與檳榔谷用車", "檳榔谷門票與預約協調", "文化日中文在地協調與導覽安排"],
        separate: ["往返三亞的機票", "未列餐食與度假村活動", "單房差與房型升級", "簽證、保險與個人消費"],
        caption: "實景 · 海棠灣海岸與度假區",
        sceneTitle: "海棠灣、檳榔谷與亞龍灣",
        gallery: [
          ["/assets/real-sanya/haitang-bay-cc-by-sa.jpg", "三亞海棠灣實景空拍", "第 1–2 天 · 海棠灣", "前兩晚把房間、海灘與度假品質放在中心。"],
          ["/assets/real-sanya/binglanggu-cc-by-sa.jpg", "三亞檳榔谷黎苗文化區實景", "第 3 天 · 檳榔谷", "私人車安排一個完整文化日，不夾在度假村活動之間。"],
          ["/assets/real-sanya/yalong-bay-panoramio-cc-by.jpg", "三亞亞龍灣棕櫚與海岸實景", "第 4 天 · 亞龍灣", "晚一點出發，留下吃午餐與看海的時間，不追趕景點。"],
        ],
      },
      ja: {
        name: "三亜 海岸と文化の旅",
        duration: "5日間・4泊",
        summary: "海棠湾、檳榔谷のリー族・ミャオ族文化、亜龍湾を5日で結び、リゾートの余白を守ります。",
        route: "三亜空港 → 海棠湾 → 檳榔谷 → 亜龍湾",
        pace: "ゆっくりした朝を2回、文化の日を1回",
        bestFor: "カップル、家族、中国周遊後の温暖な休息",
        firstCheck: "ホテル水準、ビーチ位置、台風シーズン",
        shape: ["海棠湾到着", "リゾートと海岸", "檳榔谷の文化日", "亜龍湾と出発"],
        group: "2名様から · おすすめは2–6名様",
        days: [
          ["1日目", "海棠湾に到着", "空港から専用車でホテルへ。最初の夜は海辺で自由に過ごします。", "宿泊：海棠湾"],
          ["2日目", "海棠湾リゾートの日", "朝食、ビーチ、プール。最初の一日に必須観光は加えません。", "宿泊：海棠湾"],
          ["3日目", "檳榔谷 リー族・ミャオ族文化の日", "専用車で檳榔谷へ。文化を丁寧に見た後、夕食前にホテルへ戻ります。", "宿泊：海棠湾"],
          ["4日目", "亜龍湾でゆっくり過ごす", "遅めに出発し、海辺の昼食と自由時間を確保します。", "宿泊：三亜"],
          ["5日目", "三亜出発", "フライト時間に合わせて専用車で空港へ送ります。", "出発日"],
        ],
        notes: ["ホテルそのものが商品なので、ビーチと部屋カテゴリーを先に確認します。", "檳榔谷は唯一の終日文化外出。ほかの日は意図的に軽くします。", "雨と台風の可能性を確認してから日程を提案します。"],
        included: ["厳選したビーチリゾート4泊・2名1室", "空港送迎と檳榔谷日の専用車", "檳榔谷入場料と予約手配", "文化日の英語サポート。日本語は空き状況により別見積り"],
        separate: ["三亜までの航空券", "記載外の食事とリゾート内アクティビティ", "1名1室追加料金と客室アップグレード", "ビザ、保険、個人的費用"],
        caption: "実景 · 海棠湾の海岸とリゾート地区",
        sceneTitle: "海棠湾、檳榔谷、亜龍湾",
        gallery: [
          ["/assets/real-sanya/haitang-bay-cc-by-sa.jpg", "三亜海棠湾の実景", "1–2日目 · 海棠湾", "最初の2泊は客室、ビーチ、リゾートの質を中心にします。"],
          ["/assets/real-sanya/binglanggu-cc-by-sa.jpg", "檳榔谷リー族ミャオ族文化区の実景", "3日目 · 檳榔谷", "専用車で訪れる一日の文化体験として、ほかの予定を詰め込みません。"],
          ["/assets/real-sanya/yalong-bay-panoramio-cc-by.jpg", "三亜亜龍湾の海岸とヤシ", "4日目 · 亜龍湾", "遅めの出発、海辺の昼食、自由時間を組み合わせます。"],
        ],
      },
      ko: {
        name: "싼야 해안과 문화 여정",
        duration: "5일 4박",
        summary: "하이탕만, 빙랑구 리족·먀오족 문화, 야룽만을 5일로 잇고 리조트의 여백을 지킵니다.",
        route: "싼야 공항 → 하이탕만 → 빙랑구 → 야룽만",
        pace: "느린 리조트 아침 두 번과 문화 일정 하루",
        bestFor: "커플, 가족, 중국 장거리 여행 뒤의 따뜻한 휴식",
        firstCheck: "리조트 등급, 해변 위치, 태풍 시즌",
        shape: ["하이탕만 도착", "리조트와 해안", "빙랑구 문화의 날", "야룽만과 출발"],
        group: "2인부터 · 권장 2–6인",
        days: [
          ["1일 차", "하이탕만 도착", "공항에서 전용차로 이동해 체크인하고 첫 저녁은 해변에서 여유롭게 보냅니다.", "숙박: 하이탕만"],
          ["2일 차", "하이탕만 리조트 데이", "조식, 해변, 수영장. 첫 종일 일정에는 의무 관광을 넣지 않습니다.", "숙박: 하이탕만"],
          ["3일 차", "빙랑구 리족·먀오족 문화의 날", "전용차로 빙랑구를 방문하고 문화 일정에 집중한 뒤 저녁 전 리조트로 돌아옵니다.", "숙박: 하이탕만"],
          ["4일 차", "야룽만 느린 해안", "늦게 출발해 해변 점심과 자유 시간을 충분히 둡니다.", "숙박: 싼야"],
          ["5일 차", "싼야 출발", "항공편 시간에 맞춰 전용차로 공항까지 이동합니다.", "출발일"],
        ],
        notes: ["호텔이 상품의 일부이므로 해변과 객실 등급을 먼저 확인합니다.", "빙랑구가 유일한 종일 문화 외출이며 다른 날은 의도적으로 가볍게 둡니다.", "날짜 추천 전에 강우와 태풍 위험을 확인합니다."],
        included: ["선별된 해변 리조트 4박·2인 1실", "공항 전용 이동과 빙랑구 차량", "빙랑구 입장권과 예약 조정", "문화일 영어 지원. 한국어는 가능 여부에 따라 별도 견적"],
        separate: ["싼야 왕복 항공권", "표기되지 않은 식사와 리조트 활동", "1인실 추가금과 객실 업그레이드", "비자, 보험, 개인 지출"],
        caption: "실제 풍경 · 하이탕만 해안과 리조트 지구",
        sceneTitle: "하이탕만, 빙랑구, 야룽만",
        gallery: [
          ["/assets/real-sanya/haitang-bay-cc-by-sa.jpg", "싼야 하이탕만 실제 풍경", "1–2일 차 · 하이탕만", "첫 두 밤은 객실과 해변, 리조트 품질을 중심에 둡니다."],
          ["/assets/real-sanya/binglanggu-cc-by-sa.jpg", "빙랑구 리족 먀오족 문화구 실제 풍경", "3일 차 · 빙랑구", "전용차로 방문하는 온전한 문화의 날로 다른 활동을 끼워 넣지 않습니다."],
          ["/assets/real-sanya/yalong-bay-panoramio-cc-by.jpg", "싼야 야룽만 해안과 야자수", "4일 차 · 야룽만", "늦은 출발, 해변 점심, 자유 시간을 조합합니다."],
        ],
      },
      th: {
        name: "ซานย่า ชายฝั่งและวัฒนธรรม",
        duration: "5 วัน 4 คืน",
        summary: "ห้าวันที่เชื่อมอ่าวไห่ถัง วัฒนธรรมหลีและเหมียวที่ปิงหลางกู่ และวันสบายริมอ่าวย่าหลง",
        route: "สนามบินซานย่า → อ่าวไห่ถัง → ปิงหลางกู่ → อ่าวย่าหลง",
        pace: "เช้าสบายในรีสอร์ตสองวัน และวันวัฒนธรรมส่วนตัวหนึ่งวัน",
        bestFor: "คู่รัก ครอบครัว และการพักอากาศอุ่นหลังเที่ยวจีน",
        firstCheck: "ระดับรีสอร์ต ตำแหน่งชายหาด และฤดูพายุ",
        shape: ["ถึงอ่าวไห่ถัง", "รีสอร์ตและชายฝั่ง", "วันวัฒนธรรมปิงหลางกู่", "อ่าวย่าหลงและเดินทางกลับ"],
        group: "เริ่มที่ 2 คน · เหมาะที่สุด 2–6 คน",
        days: [
          ["วันที่ 1", "เดินทางถึงอ่าวไห่ถัง", "รถส่วนตัวรับจากสนามบิน เช็กอิน และปล่อยช่วงเย็นแรกไว้สำหรับชายทะเล", "พัก: อ่าวไห่ถัง"],
          ["วันที่ 2", "วันพักรีสอร์ตอ่าวไห่ถัง", "อาหารเช้า ชายหาด และสระว่ายน้ำ โดยไม่บังคับโปรแกรมเที่ยวในวันเต็มวันแรก", "พัก: อ่าวไห่ถัง"],
          ["วันที่ 3", "วัฒนธรรมหลีและเหมียวที่ปิงหลางกู่", "รถส่วนตัวไปปิงหลางกู่เพื่อเรียนรู้วัฒนธรรมอย่างมีจุดเน้น แล้วกลับรีสอร์ตก่อนมื้อเย็น", "พัก: อ่าวไห่ถัง"],
          ["วันที่ 4", "วันสบายริมอ่าวย่าหลง", "ออกสายขึ้น รับประทานมื้อกลางวันริมทะเล และมีเวลาว่างเพียงพอ", "พัก: ซานย่า"],
          ["วันที่ 5", "ออกเดินทางจากซานย่า", "รถส่วนตัวไปสนามบินตามเวลาเที่ยวบิน", "วันเดินทางกลับ"],
        ],
        notes: ["โรงแรมเป็นส่วนหนึ่งของสินค้า จึงยืนยันชายหาดและประเภทห้องก่อน", "ปิงหลางกู่เป็นวันวัฒนธรรมเต็มวันเพียงวันเดียว วันอื่นตั้งใจให้เบา", "ตรวจสอบฝนและความเสี่ยงพายุก่อนแนะนำวันเดินทาง"],
        included: ["รีสอร์ตชายหาดที่คัดเลือก 4 คืน ห้องคู่", "รถรับส่งสนามบินและรถส่วนตัววันปิงหลางกู่", "ค่าเข้าปิงหลางกู่และการจอง", "การสนับสนุนภาษาอังกฤษในวันวัฒนธรรม ภาษาไทยเสนอราคาตามจำนวนที่ว่าง"],
        separate: ["เที่ยวบินไปกลับซานย่า", "อาหารที่ไม่ระบุและกิจกรรมของรีสอร์ต", "ค่าห้องเดี่ยวและอัปเกรดห้อง", "วีซ่า ประกัน และค่าใช้จ่ายส่วนตัว"],
        caption: "สถานที่จริง · ชายฝั่งอ่าวไห่ถังและเขตรีสอร์ต",
        sceneTitle: "อ่าวไห่ถัง ปิงหลางกู่ และอ่าวย่าหลง",
        gallery: [
          ["/assets/real-sanya/haitang-bay-cc-by-sa.jpg", "ภาพจริงมุมสูงอ่าวไห่ถัง ซานย่า", "วันที่ 1–2 · อ่าวไห่ถัง", "สองคืนแรกให้ห้องพัก ชายหาด และคุณภาพรีสอร์ตเป็นหัวใจของทริป"],
          ["/assets/real-sanya/binglanggu-cc-by-sa.jpg", "ภาพจริงเขตวัฒนธรรมปิงหลางกู่", "วันที่ 3 · ปิงหลางกู่", "วันวัฒนธรรมเต็มวันด้วยรถส่วนตัวโดยไม่แทรกกิจกรรมรีสอร์ตอื่น"],
          ["/assets/real-sanya/yalong-bay-panoramio-cc-by.jpg", "ภาพจริงชายฝั่งและต้นปาล์มอ่าวย่าหลง", "วันที่ 4 · อ่าวย่าหลง", "ออกสาย รับประทานมื้อกลางวันริมทะเล และมีเวลาว่าง"],
        ],
      },
    },
  },
  northeast: {
    mainImage: "/assets/real-northeast/china-snow-town-cc-by.jpg",
    galleryClass: " four-up",
    locales: {
      en: {
        name: "Harbin, Yabuli & Snow Town",
        duration: "7 days · 6 nights",
        summary: "A seven-day winter line from Harbin to Yabuli and Snow Town, with one weather buffer and clear seasonal limits.",
        route: "Harbin → Yabuli → China Snow Town → Harbin",
        pace: "Two base stays, one snow-road transfer and a weather buffer",
        bestFor: "Winter scenery, first-time snow and families",
        firstCheck: "Travel month, cold tolerance and snow activity level",
        shape: ["Harbin city & ice", "Yabuli ski or forest", "Yaxue road to Snow Town", "Return to Harbin"],
        group: "From 2 travellers · best for 2–6",
        days: [
          ["Day 1", "Arrive in Harbin", "Private pickup, warm check-in and a simple first evening near the historic centre.", "Stay: Harbin"],
          ["Day 2", "Historic Harbin and seasonal ice", "Saint Sophia, Central Street and Ice & Snow World when operating. Winter access is confirmed by date.", "Stay: Harbin"],
          ["Day 3", "Harbin to Yabuli", "Private transfer to Yabuli with a warm lunch stop and time to fit equipment or settle into the forest stay.", "Stay: Yabuli"],
          ["Day 4", "Yabuli ski or forest day", "Choose a suitable ski session, snow play or a quieter forest day according to age and confidence.", "Stay: Yabuli"],
          ["Day 5", "Yabuli to China Snow Town", "Travel the Yaxue road with planned warm stops, arriving before the evening lights.", "Stay: China Snow Town"],
          ["Day 6", "Snow Town morning and return to Harbin", "See the village before peak movement, then return by private vehicle with a conservative winter buffer.", "Stay: Harbin"],
          ["Day 7", "Departure or weather buffer", "Private airport or station transfer. The final morning also protects the route from winter delays.", "Departure day"],
        ],
        notes: ["Ice & Snow World and snow conditions are seasonal, never guaranteed by name alone.", "Cold-weather vehicles, warm stops and realistic transfer times are part of the route.", "Skiing is optional and matched to age, confidence and equipment needs."],
        included: ["6 nights in selected warm hotels, twin-share", "Private winter-ready vehicle and driver on route days", "Listed core admissions and booking coordination", "English-speaking local support on core sightseeing days"],
        separate: ["Flights or rail to and from Harbin", "Ski equipment, lessons and optional snow activities", "Single-room supplement or hotel upgrades", "Visa, insurance and personal spending"],
        caption: "Real scene · Morning in China Snow Town",
        sceneTitle: "Harbin, Yabuli and China Snow Town",
        gallery: [
          ["/assets/real-northeast/saint-sophia-harbin-cc-by-sa.jpg", "Saint Sophia Cathedral in snowy Harbin", "Days 1–2 · Harbin", "A warm-paced city day linking Saint Sophia, Central Street and seasonal ice."],
          ["/assets/real-northeast/ice-snow-world-cc0.jpg", "Harbin Ice and Snow World illuminated at night", "Day 2 · Seasonal ice", "Ice & Snow World is included only when the official season is operating."],
          ["/assets/real-northeast/yabuli-ski-resort-cc-by-sa.jpg", "Yabuli Ski Resort mountain view", "Days 3–4 · Yabuli", "Two nights avoid a rushed ski stop and allow a forest-day alternative."],
          ["/assets/real-northeast/china-snow-town-cc-by.jpg", "Morning snow roofs in China Snow Town", "Days 5–6 · Snow Town", "Arrive before evening lights, stay overnight and leave after a quiet morning."],
        ],
      },
      zh: {
        name: "哈爾濱、亞布力與雪鄉",
        duration: "7 天 6 夜",
        summary: "七天從哈爾濱走到亞布力與中國雪鄉，公開冬季限制，也保留一個天候緩衝。",
        route: "哈爾濱 → 亞布力 → 中國雪鄉 → 哈爾濱",
        pace: "兩段連住、一次雪路轉移，加一天候緩衝",
        bestFor: "冬季風景、第一次看雪與家庭旅客",
        firstCheck: "月份、耐寒程度與雪上活動需求",
        shape: ["哈爾濱城市與冰雪", "亞布力滑雪或森林", "亞雪公路至雪鄉", "返回哈爾濱"],
        group: "2 人起 · 建議 2–6 人",
        days: [
          ["第 1 天", "抵達哈爾濱", "私人接送、溫暖入住，第一晚留在歷史街區附近。", "住宿：哈爾濱"],
          ["第 2 天", "哈爾濱歷史街區與季節冰雪", "聖索菲亞教堂、中央大街；冰雪大世界僅在官方營運期安排。", "住宿：哈爾濱"],
          ["第 3 天", "哈爾濱前往亞布力", "私人車前往亞布力，中途保留溫暖用餐，抵達後試裝備或入住森林旅宿。", "住宿：亞布力"],
          ["第 4 天", "亞布力滑雪或森林日", "依年齡與經驗選擇合適滑雪時段、玩雪或安靜森林日。", "住宿：亞布力"],
          ["第 5 天", "亞布力經亞雪公路至中國雪鄉", "沿途安排保暖停靠，在晚間燈光亮起前抵達。", "住宿：中國雪鄉"],
          ["第 6 天", "雪鄉清晨與返回哈爾濱", "趁人流尚少看雪屋，再以保守冬季車程返回哈爾濱。", "住宿：哈爾濱"],
          ["第 7 天", "離開或天候緩衝", "私人送機或送站；最後半天同時保護行程不受冬季延誤擠壓。", "離開日"],
        ],
        notes: ["冰雪大世界與雪況都有季節性，不用景點名稱做保證。", "冬季合適車輛、保暖停靠與真實車程都是方案的一部分。", "滑雪為自選，依年齡、經驗與裝備需求安排。"],
        included: ["6 晚精選保暖旅宿，雙人房入住", "路線日冬季適用私人車與司機", "表列核心門票與預約協調", "中文在地協調與主要景點導覽安排"],
        separate: ["往返哈爾濱的機票或城際火車", "雪具、教練與自選冰雪活動", "單房差與旅宿升級", "簽證、保險與個人消費"],
        caption: "實景 · 中國雪鄉清晨",
        sceneTitle: "哈爾濱、亞布力與中國雪鄉",
        gallery: [
          ["/assets/real-northeast/saint-sophia-harbin-cc-by-sa.jpg", "雪夜中的哈爾濱聖索菲亞教堂", "第 1–2 天 · 哈爾濱", "用舒適節奏串起聖索菲亞教堂、中央大街與季節冰雪。"],
          ["/assets/real-northeast/ice-snow-world-cc0.jpg", "哈爾濱冰雪大世界夜間實景", "第 2 天 · 季節冰雪", "僅在官方營運期安排冰雪大世界，出發前再次確認。"],
          ["/assets/real-northeast/yabuli-ski-resort-cc-by-sa.jpg", "亞布力滑雪場山景實拍", "第 3–4 天 · 亞布力", "連住兩晚，不把滑雪做成匆忙停靠，也可改為森林慢日。"],
          ["/assets/real-northeast/china-snow-town-cc-by.jpg", "中國雪鄉清晨雪屋實景", "第 5–6 天 · 中國雪鄉", "晚間亮燈前抵達、住一晚，隔日清晨再離開。"],
        ],
      },
      ja: {
        name: "ハルビン・ヤブリ・雪郷",
        duration: "7日間・6泊",
        summary: "ハルビンからヤブリ、中国雪郷へ進む7日間。冬の制約を明示し、天候予備時間を残します。",
        route: "ハルビン → ヤブリ → 中国雪郷 → ハルビン",
        pace: "2か所で連泊、雪道移動1回、天候予備時間あり",
        bestFor: "冬景色、初めての雪、家族旅行",
        firstCheck: "旅行月、寒さへの慣れ、雪上活動の希望",
        shape: ["ハルビン市街と氷雪", "ヤブリのスキーまたは森", "亜雪公路で雪郷へ", "ハルビンへ戻る"],
        group: "2名様から · おすすめは2–6名様",
        days: [
          ["1日目", "ハルビン到着", "専用車でお迎えし、暖かなホテルへ。初日は歴史地区近くで軽く過ごします。", "宿泊：ハルビン"],
          ["2日目", "歴史あるハルビンと季節の氷雪", "聖ソフィア大聖堂、中央大街。氷雪大世界は公式営業期間のみ組み込みます。", "宿泊：ハルビン"],
          ["3日目", "ハルビンからヤブリへ", "専用車で移動し、温かな昼食休憩を確保。到着後は装備合わせまたは森の宿で休みます。", "宿泊：ヤブリ"],
          ["4日目", "ヤブリでスキーまたは森の日", "年齢と経験に合わせてスキー、雪遊び、静かな森の日から選びます。", "宿泊：ヤブリ"],
          ["5日目", "亜雪公路で中国雪郷へ", "暖を取る休憩を組み、夕方の明かりが灯る前に到着します。", "宿泊：中国雪郷"],
          ["6日目", "雪郷の朝とハルビン帰着", "人が増える前の村を見てから、冬の余裕を持った車程でハルビンへ戻ります。", "宿泊：ハルビン"],
          ["7日目", "出発または天候予備", "空港または駅へ専用車で送ります。最終朝は冬の遅延にも備えます。", "出発日"],
        ],
        notes: ["氷雪大世界と積雪は季節条件があり、名称だけでは保証しません。", "冬用車両、暖を取る休憩、現実的な移動時間を旅程に含めます。", "スキーは任意で、年齢、経験、装備に合わせます。"],
        included: ["厳選した暖かなホテル6泊・2名1室", "ルート日の冬対応専用車とドライバー", "記載された主要入場料と予約手配", "主要観光日の英語サポート。日本語は空き状況により別見積り"],
        separate: ["ハルビンまでの航空券・都市間鉄道", "スキー用品、レッスン、任意の雪上活動", "1名1室追加料金とホテルのアップグレード", "ビザ、保険、個人的費用"],
        caption: "実景 · 中国雪郷の朝",
        sceneTitle: "ハルビン、ヤブリ、中国雪郷",
        gallery: [
          ["/assets/real-northeast/saint-sophia-harbin-cc-by-sa.jpg", "雪のハルビン聖ソフィア大聖堂", "1–2日目 · ハルビン", "聖ソフィア大聖堂、中央大街、季節の氷雪を無理なく結びます。"],
          ["/assets/real-northeast/ice-snow-world-cc0.jpg", "夜のハルビン氷雪大世界", "2日目 · 季節の氷雪", "氷雪大世界は公式営業期間のみ日程に含めます。"],
          ["/assets/real-northeast/yabuli-ski-resort-cc-by-sa.jpg", "ヤブリスキー場の山景", "3–4日目 · ヤブリ", "2泊して慌ただしいスキー立ち寄りを避け、森の日にも変更できます。"],
          ["/assets/real-northeast/china-snow-town-cc-by.jpg", "中国雪郷の朝の雪屋根", "5–6日目 · 中国雪郷", "夕方前に到着し、一泊して静かな朝を見てから出発します。"],
        ],
      },
      ko: {
        name: "하얼빈·야부리·중국설향",
        duration: "7일 6박",
        summary: "하얼빈에서 야부리와 중국설향으로 이어지는 7일 겨울 여정으로 계절 한계와 날씨 여유를 분명히 둡니다.",
        route: "하얼빈 → 야부리 → 중국설향 → 하얼빈",
        pace: "두 곳 연박, 한 번의 설경 도로 이동, 날씨 여유",
        bestFor: "겨울 풍경, 첫눈 여행, 가족",
        firstCheck: "여행 월, 추위 적응, 눈 활동 수준",
        shape: ["하얼빈 도시와 얼음", "야부리 스키 또는 숲", "야쉐 도로로 설향 이동", "하얼빈 귀환"],
        group: "2인부터 · 권장 2–6인",
        days: [
          ["1일 차", "하얼빈 도착", "전용 픽업 후 따뜻한 호텔에 체크인하고 역사 지구 근처에서 가볍게 시작합니다.", "숙박: 하얼빈"],
          ["2일 차", "역사적 하얼빈과 계절 얼음", "성 소피아 성당, 중앙대가. 빙설대세계는 공식 운영 기간에만 포함합니다.", "숙박: 하얼빈"],
          ["3일 차", "하얼빈에서 야부리로", "전용차로 이동하며 따뜻한 점심 휴식을 두고 장비 피팅 또는 숲 숙소 체크인을 합니다.", "숙박: 야부리"],
          ["4일 차", "야부리 스키 또는 숲의 날", "나이와 경험에 맞춰 스키, 눈놀이, 조용한 숲 일정 중 선택합니다.", "숙박: 야부리"],
          ["5일 차", "야쉐 도로를 따라 중국설향으로", "따뜻한 휴게 시간을 계획해 저녁 불빛이 켜지기 전 도착합니다.", "숙박: 중국설향"],
          ["6일 차", "설향의 아침과 하얼빈 귀환", "사람이 많아지기 전 마을을 보고 겨울 여유 시간을 둔 전용차로 돌아갑니다.", "숙박: 하얼빈"],
          ["7일 차", "출발 또는 날씨 여유", "공항이나 역으로 전용 이동합니다. 마지막 오전은 겨울 지연에도 대비합니다.", "출발일"],
        ],
        notes: ["빙설대세계와 적설은 계절 조건이 있으며 이름만으로 보장하지 않습니다.", "겨울 차량, 따뜻한 휴식, 현실적인 이동 시간을 일정에 포함합니다.", "스키는 선택 사항이며 나이, 경험, 장비 요구에 맞춥니다."],
        included: ["선별된 따뜻한 호텔 6박·2인 1실", "경로일 겨울 대응 전용차와 기사", "표기된 핵심 입장권과 예약 조정", "핵심 관광일 영어 지원. 한국어는 가능 여부에 따라 별도 견적"],
        separate: ["하얼빈 왕복 항공·도시간 철도", "스키 장비, 강습, 선택 눈 활동", "1인실 추가금과 호텔 업그레이드", "비자, 보험, 개인 지출"],
        caption: "실제 풍경 · 중국설향의 아침",
        sceneTitle: "하얼빈, 야부리, 중국설향",
        gallery: [
          ["/assets/real-northeast/saint-sophia-harbin-cc-by-sa.jpg", "눈 내린 하얼빈 성 소피아 성당", "1–2일 차 · 하얼빈", "성 소피아 성당, 중앙대가, 계절 얼음을 따뜻한 속도로 잇습니다."],
          ["/assets/real-northeast/ice-snow-world-cc0.jpg", "밤의 하얼빈 빙설대세계", "2일 차 · 계절 얼음", "빙설대세계는 공식 운영 기간에만 일정에 포함합니다."],
          ["/assets/real-northeast/yabuli-ski-resort-cc-by-sa.jpg", "야부리 스키 리조트 산 풍경", "3–4일 차 · 야부리", "2박으로 급한 스키 방문을 피하고 숲 일정으로 바꿀 여유도 둡니다."],
          ["/assets/real-northeast/china-snow-town-cc-by.jpg", "중국설향 아침의 눈 지붕", "5–6일 차 · 중국설향", "저녁 전 도착해 1박하고 조용한 아침 뒤 출발합니다."],
        ],
      },
      th: {
        name: "ฮาร์บิน ย่าปู้ลี่ และหมู่บ้านหิมะจีน",
        duration: "7 วัน 6 คืน",
        summary: "เส้นทางฤดูหนาวเจ็ดวันจากฮาร์บินสู่ย่าปู้ลี่และหมู่บ้านหิมะจีน พร้อมเวลาสำรองสำหรับสภาพอากาศ",
        route: "ฮาร์บิน → ย่าปู้ลี่ → หมู่บ้านหิมะจีน → ฮาร์บิน",
        pace: "พักต่อเนื่องสองฐาน เดินทางบนถนนหิมะหนึ่งครั้ง และมีเวลาสำรอง",
        bestFor: "วิวฤดูหนาว การเห็นหิมะครั้งแรก และครอบครัว",
        firstCheck: "เดือนเดินทาง ความทนหนาว และระดับกิจกรรมหิมะ",
        shape: ["เมืองฮาร์บินและน้ำแข็ง", "สกีหรือป่าที่ย่าปู้ลี่", "ถนนย่าเสวี่ยสู่หมู่บ้านหิมะ", "กลับฮาร์บิน"],
        group: "เริ่มที่ 2 คน · เหมาะที่สุด 2–6 คน",
        days: [
          ["วันที่ 1", "เดินทางถึงฮาร์บิน", "รถส่วนตัวรับส่ง เช็กอินโรงแรมที่อบอุ่น และเริ่มเบา ๆ ใกล้ย่านประวัติศาสตร์", "พัก: ฮาร์บิน"],
          ["วันที่ 2", "ฮาร์บินเก่าและน้ำแข็งตามฤดูกาล", "โบสถ์เซนต์โซเฟีย ถนนจงหยาง และ Ice & Snow World เฉพาะช่วงที่เปิดอย่างเป็นทางการ", "พัก: ฮาร์บิน"],
          ["วันที่ 3", "ฮาร์บินสู่ย่าปู้ลี่", "รถส่วนตัวไปย่าปู้ลี่ มีจุดพักรับประทานอาหารอุ่น ๆ และเวลาเตรียมอุปกรณ์หรือเข้าที่พักกลางป่า", "พัก: ย่าปู้ลี่"],
          ["วันที่ 4", "สกีหรือวันป่าที่ย่าปู้ลี่", "เลือกช่วงสกี เล่นหิมะ หรือวันเงียบในป่าตามอายุและประสบการณ์", "พัก: ย่าปู้ลี่"],
          ["วันที่ 5", "ถนนย่าเสวี่ยสู่หมู่บ้านหิมะจีน", "เดินทางพร้อมจุดพักอุ่นตามแผน และถึงก่อนแสงไฟยามเย็น", "พัก: หมู่บ้านหิมะจีน"],
          ["วันที่ 6", "เช้าที่หมู่บ้านหิมะและกลับฮาร์บิน", "ชมหมู่บ้านก่อนคนมาก แล้วกลับด้วยรถส่วนตัวพร้อมเวลาเผื่อฤดูหนาว", "พัก: ฮาร์บิน"],
          ["วันที่ 7", "ออกเดินทางหรือเวลาสำรอง", "รถส่วนตัวไปสนามบินหรือสถานี ช่วงเช้าสุดท้ายช่วยรองรับความล่าช้าจากอากาศ", "วันเดินทางกลับ"],
        ],
        notes: ["Ice & Snow World และสภาพหิมะขึ้นกับฤดูกาล ไม่รับประกันจากชื่อสถานที่เพียงอย่างเดียว", "รถสำหรับฤดูหนาว จุดพักอุ่น และเวลาเดินทางจริงเป็นส่วนหนึ่งของแผน", "สกีเป็นตัวเลือกและจัดตามอายุ ประสบการณ์ และอุปกรณ์"],
        included: ["โรงแรมที่อบอุ่นคัดเลือก 6 คืน ห้องคู่", "รถส่วนตัวพร้อมคนขับที่เหมาะกับฤดูหนาว", "ค่าเข้าหลักตามรายการและการจอง", "การสนับสนุนภาษาอังกฤษในวันเที่ยวหลัก ภาษาไทยเสนอราคาตามจำนวนที่ว่าง"],
        separate: ["เที่ยวบินหรือรถไฟไปกลับฮาร์บิน", "อุปกรณ์สกี ครูสอน และกิจกรรมหิมะเสริม", "ค่าห้องเดี่ยวและอัปเกรดโรงแรม", "วีซ่า ประกัน และค่าใช้จ่ายส่วนตัว"],
        caption: "สถานที่จริง · เช้าในหมู่บ้านหิมะจีน",
        sceneTitle: "ฮาร์บิน ย่าปู้ลี่ และหมู่บ้านหิมะจีน",
        gallery: [
          ["/assets/real-northeast/saint-sophia-harbin-cc-by-sa.jpg", "โบสถ์เซนต์โซเฟียในฮาร์บินท่ามกลางหิมะ", "วันที่ 1–2 · ฮาร์บิน", "เชื่อมโบสถ์เซนต์โซเฟีย ถนนจงหยาง และน้ำแข็งตามฤดูกาลในจังหวะที่อบอุ่น"],
          ["/assets/real-northeast/ice-snow-world-cc0.jpg", "ฮาร์บิน Ice and Snow World ตอนกลางคืน", "วันที่ 2 · น้ำแข็งตามฤดูกาล", "รวม Ice & Snow World เฉพาะเมื่อฤดูกาลเปิดอย่างเป็นทางการ"],
          ["/assets/real-northeast/yabuli-ski-resort-cc-by-sa.jpg", "วิวภูเขาที่สกีรีสอร์ตย่าปู้ลี่", "วันที่ 3–4 · ย่าปู้ลี่", "พักสองคืนเพื่อไม่ให้การเล่นสกีเร่งรีบ และเปลี่ยนเป็นวันป่าได้"],
          ["/assets/real-northeast/china-snow-town-cc-by.jpg", "หลังคาหิมะยามเช้าในหมู่บ้านหิมะจีน", "วันที่ 5–6 · หมู่บ้านหิมะ", "ถึงก่อนเย็น พักหนึ่งคืน แล้วออกหลังชมเช้าที่เงียบกว่า"],
        ],
      },
    },
  },
};

const localePaths = {
  en: "/interest.html",
  zh: "/zh/interest/",
  ja: "/ja/interest/",
  ko: "/ko/interest/",
  th: "/th/interest/",
};

function headingClass(locale) {
  return ["zh", "ja", "ko"].includes(locale) ? ' class="cjk-title"' : "";
}

function renderStandard(destination, locale) {
  const copy = product[destination].locales[locale];
  const labels = ui[locale];
  const price = prices[destination][locale].display;
  const interest = `${localePaths[locale]}?utm_source=standard_route&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=${destination}`;
  return `<!-- standard-route-start -->
    <section class="section standard-route-band" id="standard-route">
      <div class="wrap route-showcase">
        <div class="route-copy">
          <p class="eyebrow">${labels.standard}</p>
          <h2${headingClass(locale)}>${copy.name}</h2>
          <p>${copy.summary}</p>
          <div class="route-price"><span>${copy.duration}</span><strong>${price}</strong><small>${labels.from}</small></div>
          <div class="route-points">
            <div><b>${labels.route}</b><span>${copy.route}</span></div>
            <div><b>${labels.pace}</b><span>${copy.pace}</span></div>
            <div><b>${labels.bestFor}</b><span>${copy.bestFor}</span></div>
            <div><b>${labels.firstCheck}</b><span>${copy.firstCheck}</span></div>
          </div>
          <p class="route-note">${copy.group}. ${labels.noPayment}</p>
          <div class="hero-actions"><a class="btn primary dark-gold" href="${interest}">${labels.ask}</a></div>
        </div>
        <div class="route-card" aria-label="${copy.name}">
          <div class="route-image"><img src="${product[destination].mainImage}" alt="${copy.caption}"></div>
          <div class="route-map"><h3>${labels.routeShape}</h3><div class="map-line">${copy.shape.map((item) => `<span>${item}</span>`).join("")}</div></div>
        </div>
      </div>
    </section>
    <!-- standard-route-end -->`;
}

function renderDayPlan(destination, locale) {
  const copy = product[destination].locales[locale];
  const labels = ui[locale];
  const price = prices[destination][locale].display;
  const interest = `${localePaths[locale]}?utm_source=route_day_plan&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=${destination}`;
  const dayItems = copy.days.map(([index, title, body, stay]) => `<article class="route-day-item">
            <div class="route-day-index">${index}</div>
            <div class="route-day-copy"><h3>${title}</h3><p>${body}</p><span>${stay}</span></div>
          </article>`).join("");
  return `<!-- route-day-plan-start -->
    <section class="section route-day-plan-band" id="day-plan">
      <div class="wrap route-day-plan-wrap">
        <div class="route-day-head">
          <div><p class="eyebrow">${labels.dayPlan}</p><h2${headingClass(locale)}>${copy.name}</h2><p>${labels.dayPlanIntro}</p></div>
          <div class="route-terms"><div><b>${labels.days}</b><span>${copy.duration}</span></div><div><b>${labels.from}</b><span>${price}</span></div><div><b>${labels.group}</b><span>${copy.group}</span></div></div>
        </div>
        <div class="route-day-layout">
          <div class="route-day-list">${dayItems}</div>
          <aside class="route-visual-panel" aria-label="${labels.imageNotes}">
            <figure><img src="${product[destination].mainImage}" alt="${copy.caption}"><figcaption>${copy.caption}</figcaption></figure>
            <ul class="route-visual-notes">${copy.notes.map((note, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${note}</span></li>`).join("")}</ul>
            <div class="route-inclusion-grid">
              <section><h3>${labels.included}</h3><ul>${copy.included.map((item) => `<li>${item}</li>`).join("")}</ul></section>
              <section><h3>${labels.separate}</h3><ul>${copy.separate.map((item) => `<li>${item}</li>`).join("")}</ul></section>
            </div>
            <p class="route-note">${labels.noPayment}</p>
            <a class="btn primary dark-gold" href="${interest}">${labels.ask}</a>
          </aside>
        </div>
      </div>
    </section>
    <!-- route-day-plan-end -->`;
}

function renderScenes(destination, locale) {
  const copy = product[destination].locales[locale];
  const labels = ui[locale];
  const cards = copy.gallery.map(([src, alt, label, body]) => `<figure class="material-card"><img loading="lazy" src="${src}" alt="${alt}"><figcaption><b>${label}</b><span>${body}</span></figcaption></figure>`).join("");
  return `<!-- real-scenes-start -->
    <section class="section material-notes-band" id="real-scenes">
      <div class="wrap material-notes-wrap">
        <div class="material-notes-intro"><div><p class="eyebrow">${labels.scenes}</p><h2${headingClass(locale)}>${copy.sceneTitle}</h2></div><p>${labels.sceneIntro}</p></div>
        <div class="material-grid${product[destination].galleryClass}">${cards}</div>
      </div>
    </section>
    <!-- real-scenes-end -->`;
}

function canonicalUrl(destination, locale, rootEnglish) {
  if (rootEnglish) return `https://bluehourchina.com/${destination}.html`;
  return `https://bluehourchina.com/${locale}/${destination}/`;
}

function renderProductSchema(destination, locale, rootEnglish) {
  const copy = product[destination].locales[locale];
  const labels = ui[locale];
  const price = prices[destination][locale];
  const canonical = canonicalUrl(destination, locale, rootEnglish);
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: copy.name,
    brand: { "@type": "Brand", name: "Bluehour China Journeys" },
    category: "Private China travel planning",
    inLanguage: locale,
    description: `${copy.summary} ${price.display}. ${copy.group}.`,
    image: `https://bluehourchina.com${product[destination].mainImage}`,
    url: canonical,
    offers: { "@type": "Offer", priceCurrency: price.currency, price: price.number, url: canonical, availability: "https://schema.org/InStock" },
    additionalProperty: [
      { "@type": "PropertyValue", name: labels.propertyDuration, value: copy.duration },
      { "@type": "PropertyValue", name: labels.propertyRoute, value: copy.route },
      { "@type": "PropertyValue", name: labels.propertyGroup, value: copy.group },
      { "@type": "PropertyValue", name: labels.propertyBest, value: copy.bestFor },
    ],
  };
  return `<!-- route-product-schema-start -->
<script type="application/ld+json">
${JSON.stringify(schema, null, 2)}
</script>
<!-- route-product-schema-end -->`;
}

function replaceMarked(html, marker, rendered) {
  const pattern = new RegExp(`<!-- ${marker}-start -->[\\s\\S]*?<!-- ${marker}-end -->`);
  if (!pattern.test(html)) throw new Error(`Missing marker: ${marker}`);
  return html.replace(pattern, rendered);
}

function replaceOrInsertScenes(html, rendered) {
  const pattern = /<!-- real-scenes-start -->[\s\S]*?<!-- real-scenes-end -->/;
  if (pattern.test(html)) return html.replace(pattern, rendered);
  const anchor = "<!-- route-day-plan-end -->";
  if (!html.includes(anchor)) throw new Error("Missing route-day-plan-end anchor");
  return html.replace(anchor, `${anchor}\n    ${rendered}`);
}

function fixStaleDurations(html, destination, locale) {
  if (destination === "dunhuang") {
    const pairs = {
      en: [["5-6 days", "6 days"], ["Five to six days", "Six days"]],
      zh: [["5-6 日", "6 日"]],
      ja: [["5-6日間", "6日間"]],
      ko: [["5-6일", "6일"]],
      th: [["5-6 วัน", "6 วัน"]],
    }[locale];
    for (const [from, to] of pairs) html = html.replaceAll(from, to);
  }
  if (destination === "northeast") {
    const pairs = {
      en: [["6-7 days", "7 days"]],
      zh: [["6-7 日", "7 日"]],
      ja: [["6-7日間", "7日間"]],
      ko: [["6-7일", "7일"]],
      th: [["6-7 วัน", "7 วัน"]],
    }[locale];
    for (const [from, to] of pairs) html = html.replaceAll(from, to);
  }
  return html;
}

const targets = [];
for (const destination of destinations) {
  targets.push({ destination, locale: "en", file: `${destination}.html`, rootEnglish: true });
  for (const locale of ["en", "zh", "ja", "ko", "th"]) {
    targets.push({ destination, locale, file: `${locale}/${destination}/index.html`, rootEnglish: false });
  }
}

for (const target of targets) {
  const abs = path.join(root, target.file);
  let html = await fs.readFile(abs, "utf8");
  html = replaceMarked(html, "standard-route", renderStandard(target.destination, target.locale));
  html = replaceMarked(html, "route-day-plan", renderDayPlan(target.destination, target.locale));
  html = replaceOrInsertScenes(html, renderScenes(target.destination, target.locale));
  html = replaceMarked(html, "route-product-schema", renderProductSchema(target.destination, target.locale, target.rootEnglish));
  html = fixStaleDurations(html, target.destination, target.locale);
  html = html.replace(/<meta property="og:image" content="[^"]+">/, `<meta property="og:image" content="https://bluehourchina.com${product[target.destination].mainImage}">`);
  await fs.writeFile(abs, html);
  console.log(`updated ${target.file}`);
}

console.log(`Completed ${targets.length} destination product pages.`);
