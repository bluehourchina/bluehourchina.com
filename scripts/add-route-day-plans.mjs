import fs from "node:fs";

const root = new URL("../", import.meta.url);

const locales = {
  en: {
    homeFiles: ["index.html", "en.html", "en/index.html"],
    interest: "/route-note/",
    cjk: false,
    routesEyebrow: "Standard routes",
    routesTitle: "Know the shape before you ask for a quote",
    routesIntro:
      "These are not rigid group tours. They are public starting routes so travellers can see the days, starting price and minimum private-group size before sending a brief.",
    routeLabel: "Route",
    fromLabel: "From",
    groupLabel: "Group",
    daysLabel: "Days",
    groupText: "Private route from 2 travellers; best for 2-6.",
    viewText: "See the day plan",
    dayEyebrow: "Standard day plan",
    dayIntro:
      "This is the practical route shape we would begin from. The final version changes with season, hotel level, group stamina, room configuration and language needs.",
    priceNote:
      "Starting price is per traveller for land arrangements once the private group reaches the minimum size. International flights are not included.",
    visualTitle: "Image notes",
    includesTitle: "What the starting route usually covers",
    excludesTitle: "Before a formal quote",
    includes: [
      "Daily route, accommodation, transport and itinerary note",
      "Private transfers or driver coordination for core route days",
      "Hotel atmosphere and room-level discussion before confirmation",
      "Language support expectations clarified before booking",
    ],
    quoteChecks: [
      "Travel month, group size and exact number of nights",
      "Hotel level, room type, dietary needs and walking comfort",
      "Whether the route should move faster, slower or add a buffer day",
    ],
  },
  zh: {
    homeFiles: ["zh.html"],
    interest: "/zh/interest/",
    cjk: true,
    routesEyebrow: "標準方案",
    routesTitle: ["先看到怎麼走", "再決定要不要諮詢"],
    routesIntro:
      "這些不是僵硬團體行程，而是公開的基本方案：先讓旅人知道天數、起價、幾人成行與每日路線，再留下需求做正式判斷。",
    routeLabel: "路線",
    fromLabel: "起價",
    groupLabel: "成團",
    daysLabel: "天數",
    groupText: "2 人起私人成行；建議 2-6 人。",
    viewText: "看每日路線",
    dayEyebrow: "標準方案日程",
    dayIntro:
      "這是我們會拿來做初步報價的基本路線形狀。正式版本會依季節、住宿級別、同行者體力、房型與語言需求調整。",
    priceNote:
      "起價為達到最低成行人數後的每人地接安排參考價；不含國際機票。",
    visualTitle: "圖片解說",
    includesTitle: "基本方案通常包含",
    excludesTitle: "正式報價前會再確認",
    includes: [
      "路線設計、在地旅程規劃與行程筆記",
      "核心路線日的私人接送或司機協調",
      "住宿氛圍與房型級別確認",
      "語言協助需求在預訂前先說清楚",
    ],
    quoteChecks: [
      "出發月份、人數與實際晚數",
      "住宿級別、房型、餐食需求與步行舒適度",
      "路線要更快、更慢，或加一天緩衝",
    ],
  },
  ja: {
    homeFiles: ["ja.html"],
    interest: "/ja/interest/",
    cjk: true,
    routesEyebrow: "標準プラン",
    routesTitle: ["まず旅の形を見て", "相談するか決める"],
    routesIntro:
      "固定された団体ツアーではありません。日数、目安料金、最少催行人数、毎日の流れを先に見てから、個別相談へ進めます。",
    routeLabel: "ルート",
    fromLabel: "料金目安",
    groupLabel: "人数",
    daysLabel: "日数",
    groupText: "2名様から個別手配。おすすめは2-6名様。",
    viewText: "日程を見る",
    dayEyebrow: "標準日程",
    dayIntro:
      "最初の見積りに使う基本形です。季節、宿泊水準、体力、部屋タイプ、言語サポートによって調整します。",
    priceNote:
      "料金は最少人数到達時の1名様あたり現地手配目安です。国際航空券は含みません。",
    visualTitle: "写真の見方",
    includesTitle: "基本形に含まれる考え方",
    excludesTitle: "正式見積り前の確認",
    includes: [
      "ルート設計、現地手配先の確認、旅程メモ",
      "主要日の専用車または移動調整",
      "宿の雰囲気と部屋水準の確認",
      "言語サポートの必要度を事前に整理",
    ],
    quoteChecks: [
      "旅行月、人数、実際の宿泊数",
      "宿泊水準、部屋タイプ、食事、歩く量",
      "もっと速く、遅く、または予備日を加えるか",
    ],
  },
  ko: {
    homeFiles: ["ko.html"],
    interest: "/ko/interest/",
    cjk: true,
    routesEyebrow: "표준 상품",
    routesTitle: ["어떻게 이동하는지 먼저 보고", "상담 여부를 결정하세요"],
    routesIntro:
      "고정 단체 투어가 아닙니다. 날짜, 시작가, 최소 인원, 매일의 흐름을 먼저 보여 주고 그다음 개인 상담으로 조정합니다.",
    routeLabel: "루트",
    fromLabel: "시작가",
    groupLabel: "인원",
    daysLabel: "일수",
    groupText: "2명부터 개인 일정 가능. 추천 2-6명.",
    viewText: "일별 일정 보기",
    dayEyebrow: "표준 일정",
    dayIntro:
      "첫 견적의 기준이 되는 기본 형태입니다. 계절, 숙소 수준, 체력, 객실 구성, 언어 지원에 따라 조정됩니다.",
    priceNote:
      "시작가는 최소 인원 기준 1인 현지 일정 참고가입니다. 국제선 항공권은 포함되지 않습니다.",
    visualTitle: "이미지 설명",
    includesTitle: "기본 일정에 들어가는 요소",
    excludesTitle: "정식 견적 전 확인",
    includes: [
      "일자별 루트, 숙소·교통·예약 확인",
      "핵심 일정일의 전용 이동 또는 기사 조율",
      "숙소 분위기와 객실 수준 논의",
      "언어 지원 필요 수준 사전 확인",
    ],
    quoteChecks: [
      "여행 월, 인원, 실제 숙박 일수",
      "숙소 수준, 객실 구성, 식사, 걷는 정도",
      "더 빠르게, 더 느리게, 또는 버퍼데이를 넣을지",
    ],
  },
  th: {
    homeFiles: ["th.html"],
    interest: "/th/interest/",
    cjk: false,
    routesEyebrow: "เส้นทางมาตรฐาน",
    routesTitle: "เห็นรูปทรงของทริปก่อนคุยราคา",
    routesIntro:
      "นี่ไม่ใช่กรุ๊ปทัวร์ตายตัว แต่เป็นเส้นทางตั้งต้นให้เห็นจำนวนวัน ราคาเริ่มต้น จำนวนคนขั้นต่ำ และภาพรวมแต่ละวันก่อนส่งคำขอส่วนตัว",
    routeLabel: "เส้นทาง",
    fromLabel: "ราคาเริ่มต้น",
    groupLabel: "กลุ่ม",
    daysLabel: "วัน",
    groupText: "เริ่มจัดแบบส่วนตัวตั้งแต่ 2 ท่าน แนะนำ 2-6 ท่าน",
    viewText: "ดูแผนรายวัน",
    dayEyebrow: "แผนรายวันมาตรฐาน",
    dayIntro:
      "นี่คือรูปทรงพื้นฐานสำหรับประเมินราคาเบื้องต้น รายละเอียดจริงจะปรับตามฤดูกาล ระดับที่พัก ความสบายของกลุ่ม ห้องพัก และภาษา",
    priceNote:
      "ราคาเริ่มต้นเป็นราคาต่อท่านสำหรับบริการในพื้นที่เมื่อถึงจำนวนขั้นต่ำ ไม่รวมตั๋วเครื่องบินระหว่างประเทศ",
    visualTitle: "คำอธิบายภาพ",
    includesTitle: "โดยทั่วไปเส้นทางตั้งต้นครอบคลุม",
    excludesTitle: "ก่อนเสนอราคาจริงต้องยืนยัน",
    includes: [
      "แผนรายวัน ที่พัก การเดินทาง และบันทึกทริป",
      "รถส่วนตัวหรือการประสานคนขับสำหรับวันหลัก",
      "หารือบรรยากาศที่พักและระดับห้อง",
      "ยืนยันความต้องการด้านภาษาให้ชัดก่อนจอง",
    ],
    quoteChecks: [
      "เดือนเดินทาง จำนวนคน และจำนวนคืนจริง",
      "ระดับที่พัก ประเภทห้อง อาหาร และการเดิน",
      "ต้องการให้เส้นทางเร็วขึ้น ช้าลง หรือมีวันเผื่อ",
    ],
  },
};

const destinations = {
  yunnan: {
    path: "yunnan",
    image: "/assets/ai/bluehour-yunnan-luxury-shaxi-courtyard.jpg",
    prices: { en: "From RMB 5,680", zh: "RMB 5,680 起", ja: "RMB 5,680 から", ko: "RMB 5,680부터", th: "เริ่มที่ RMB 5,680" },
    daysLabel: { en: "7 days", zh: "一週", ja: "7日間", ko: "7일", th: "7 วัน" },
    route: {
      en: "Dali · Shaxi · Lijiang or Baisha",
      zh: "大理 · 沙溪 · 麗江或白沙",
      ja: "大理 · 沙溪 · 麗江または白沙",
      ko: "다리 · 샤시 · 리장 또는 바이샤",
      th: "ต้าหลี่ · ซาซี · ลี่เจียงหรือไป๋ซา",
    },
    name: { en: "Yunnan", zh: "雲南", ja: "雲南", ko: "윈난", th: "ยูนนาน" },
    title: { en: "Yunnan Slow Road", zh: "雲南慢路線", ja: "雲南スロー・ルート", ko: "윈난 슬로우 루트", th: "เส้นทางช้าในยูนนาน" },
    homeDays: {
      en: ["D1-2 Dali lake mornings", "D3-4 Shaxi old-town night", "D5-7 Lijiang or Baisha snow view"],
      zh: ["D1-2 大理與洱海清晨", "D3-4 沙溪古鎮留宿", "D5-7 麗江或白沙遠望雪山"],
      ja: ["D1-2 大理と洱海の朝", "D3-4 沙溪の古鎮に一泊", "D5-7 麗江または白沙の雪山"],
      ko: ["D1-2 다리와 얼하이 아침", "D3-4 샤시 옛 마을 숙박", "D5-7 리장 또는 바이샤 설산"],
      th: ["D1-2 เช้าที่ต้าหลี่และเอ๋อร์ไห่", "D3-4 พักเมืองเก่าซาซี", "D5-7 ลี่เจียงหรือไป๋ซาและภูเขาหิมะ"],
    },
    days: {
      en: [
        ["Day 1", "Arrive in Dali", "Airport or rail pickup, hotel check-in and a soft Erhai lakeside evening. The first day is designed to remove travel friction, not to chase sights.", "Stay: Dali"],
        ["Day 2", "Erhai villages and Bai courtyard rhythm", "A slow lake morning, village lanes, tea or coffee time and a first look at Bai courtyard life. No early marathon.", "Stay: Dali"],
        ["Day 3", "Dali to Shaxi", "Private transfer toward Shaxi with room for a meal stop and the feeling of the old Tea Horse Road beginning to appear.", "Stay: Shaxi"],
        ["Day 4", "Shaxi after the crowds leave", "Market texture, old theatre and a free late afternoon. The value is the quiet night, not one more attraction.", "Stay: Shaxi"],
        ["Day 5", "Shaxi to Lijiang or Baisha", "Move toward Naxi villages and snow-mountain views, keeping the afternoon lighter so altitude and road time feel comfortable.", "Stay: Lijiang or Baisha"],
        ["Day 6", "Snow mountain, old town, good table", "A restrained day around the snow line, craft or music texture and a better dinner. The mountain remains a horizon, not a checklist.", "Stay: Lijiang or Baisha"],
        ["Day 7", "Depart or extend to Shangri-La", "Private transfer to airport or rail station. If the group has more time, we can discuss a slower Shangri-La extension.", "Departure day"],
      ],
      zh: [
        ["第 1 天", "抵達大理", "機場或車站接送，入住後留給洱海一個柔和傍晚。第一天的任務不是趕景點，而是把旅途摩擦降下來。", "住宿：大理"],
        ["第 2 天", "洱海村路與白族院落", "湖邊清晨、村路、茶或咖啡時間，再慢慢接近白族院落的生活感。不安排一早狂奔。", "住宿：大理"],
        ["第 3 天", "大理前往沙溪", "私人車前往沙溪，中途留吃飯與停頓，讓茶馬古道的氣味慢慢出現。", "住宿：沙溪"],
        ["第 4 天", "人潮退去後的沙溪", "市集、古戲台、老街與自由下午。這一天的價值是留下夜晚，不是多塞一個景點。", "住宿：沙溪"],
        ["第 5 天", "沙溪前往麗江或白沙", "往納西村落與雪山視野移動，下午放輕，讓海拔與車程都舒服一點。", "住宿：麗江或白沙"],
        ["第 6 天", "雪山、古城與一頓好飯", "圍繞雪線、工藝或古樂做一個克制的日子。雪山留在遠處，旅人不用被清單推著走。", "住宿：麗江或白沙"],
        ["第 7 天", "離開或延伸香格里拉", "私人接送到機場或車站。若時間更長，可再討論更慢的香格里拉延伸。", "離開日"],
      ],
      ja: [
        ["1日目", "大理に到着", "空港または駅でお迎えし、宿へ。初日は洱海の夕方に余白を残し、移動の疲れを整えます。", "宿泊：大理"],
        ["2日目", "洱海と白族の中庭", "湖の朝、村の道、茶やコーヒーの時間。早朝から詰め込む日にはしません。", "宿泊：大理"],
        ["3日目", "大理から沙溪へ", "専用車で沙溪へ。食事や小さな停車を入れ、茶馬古道の気配に近づきます。", "宿泊：沙溪"],
        ["4日目", "人が引いた後の沙溪", "市場、古い劇場、午後の自由時間。価値は静かな夜にあります。", "宿泊：沙溪"],
        ["5日目", "沙溪から麗江または白沙へ", "納西の村と雪山の遠景へ。標高と移動を考え、午後は軽めにします。", "宿泊：麗江または白沙"],
        ["6日目", "雪山、古い町、よい食卓", "雪線、手仕事、音楽の気配を一日にまとめます。山を急がせません。", "宿泊：麗江または白沙"],
        ["7日目", "出発または香格里拉延長", "空港または駅へ専用送迎。余裕があれば香格里拉延長も検討できます。", "出発日"],
      ],
      ko: [
        ["1일차", "다리 도착", "공항 또는 역 픽업 후 체크인, 얼하이의 부드러운 저녁으로 시작합니다.", "숙박: 다리"],
        ["2일차", "얼하이와 바이족 마을", "호수의 아침, 마을 길, 차나 커피 시간으로 윈난의 속도를 맞춥니다.", "숙박: 다리"],
        ["3일차", "다리에서 샤시로", "전용 차량으로 샤시 이동. 식사와 작은 정차를 넣어 옛길의 분위기를 느낍니다.", "숙박: 샤시"],
        ["4일차", "사람이 빠진 뒤의 샤시", "시장, 옛 극장, 자유 오후. 이 날의 가치는 조용한 밤입니다.", "숙박: 샤시"],
        ["5일차", "샤시에서 리장 또는 바이샤로", "나시 마을과 설산 전망으로 이동하되, 고도와 이동 시간을 부드럽게 조절합니다.", "숙박: 리장 또는 바이샤"],
        ["6일차", "설산, 옛 마을, 좋은 식사", "설산 전망, 공예나 음악의 결을 담고 저녁은 여유 있게 둡니다.", "숙박: 리장 또는 바이샤"],
        ["7일차", "출발 또는 샹그릴라 연장", "공항 또는 역으로 전용 이동. 시간이 있으면 샹그릴라 연장을 검토합니다.", "출발일"],
      ],
      th: [
        ["วันที่ 1", "ถึงต้าหลี่", "รับจากสนามบินหรือสถานี เช็กอิน แล้วปล่อยเย็นแรกให้เอ๋อร์ไห่อย่างนุ่มนวล", "พัก: ต้าหลี่"],
        ["วันที่ 2", "เอ๋อร์ไห่และหมู่บ้านไป๋", "เช้าริมทะเลสาบ ถนนหมู่บ้าน ชาหรือกาแฟ และจังหวะชีวิตของบ้านลานไป๋", "พัก: ต้าหลี่"],
        ["วันที่ 3", "ต้าหลี่สู่ซาซี", "รถส่วนตัวไปซาซี มีเวลาหยุดกินและหยุดหายใจ ไม่เร่งเข้าเมืองเก่า", "พัก: ซาซี"],
        ["วันที่ 4", "ซาซีหลังคนบางลง", "ตลาด โรงละครเก่า ถนนหิน และบ่ายที่ไม่ต้องรีบ คุณค่าคือคืนที่เงียบ", "พัก: ซาซี"],
        ["วันที่ 5", "ซาซีสู่ลี่เจียงหรือไป๋ซา", "เดินทางสู่หมู่บ้านน่าซีและวิวภูเขาหิมะ จัดช่วงบ่ายให้เบา", "พัก: ลี่เจียงหรือไป๋ซา"],
        ["วันที่ 6", "ภูเขาหิมะ เมืองเก่า และอาหารดี", "ดูเส้นหิมะ งานฝีมือหรือดนตรี และทิ้งเวลาสำหรับมื้อเย็นที่ดี", "พัก: ลี่เจียงหรือไป๋ซา"],
        ["วันที่ 7", "ออกเดินทางหรือขยายไปแชงกรีล่า", "รถส่วนตัวไปสนามบินหรือสถานี หากมีเวลา สามารถคุยเรื่องต่อเส้นทางช้ากว่าเดิม", "วันออกเดินทาง"],
      ],
    },
    visuals: {
      en: ["The courtyard image explains the pace: the route protects mornings, evenings and a room worth returning to.", "The lake and old-town days are not filler; they make Yunnan feel lived-in rather than consumed.", "Snow-mountain views are arranged with restraint so altitude and road time stay comfortable."],
      zh: ["這張院落圖說明的是節奏：保護早晨、夜晚，以及一間值得回去的房間。", "湖邊與古鎮日不是填空，而是讓雲南像生活，不像消費景點。", "雪山視野要克制安排，讓海拔、車程與同行者體力都舒服。"],
      ja: ["中庭の写真は、朝と夜、戻りたくなる部屋を守る旅のペースを示しています。", "湖と古い町の日は余白ではなく、雲南を生活として感じる時間です。", "雪山は控えめに組み込み、標高と移動を無理なく整えます。"],
      ko: ["마당 이미지는 아침과 밤, 돌아가고 싶은 방을 지키는 속도를 보여 줍니다.", "호수와 옛 마을의 날은 빈 시간이 아니라 윈난을 생활처럼 느끼는 시간입니다.", "설산은 절제해서 넣어 고도와 이동 부담을 줄입니다."],
      th: ["ภาพลานบ้านบอกจังหวะของทริป: รักษาเช้า เย็น และห้องที่อยากกลับไปพัก", "วันริมทะเลสาบและเมืองเก่าไม่ใช่เวลาว่าง แต่ทำให้ยูนนานเหมือนชีวิตจริง", "วิวภูเขาหิมะต้องจัดอย่างพอดี เพื่อให้ความสูงและการเดินทางสบาย"],
    },
    extension: {
      eyebrow: {
        en: "Deeper Yunnan option",
        zh: "延伸方案",
        ja: "雲南延長プラン",
        ko: "윈난 확장 옵션",
        th: "ตัวเลือกยูนนานเชิงลึก",
      },
      title: {
        en: "Grand Yunnan Loop",
        zh: "雲南全境慢線",
        ja: "雲南グランド・ループ",
        ko: "그랜드 윈난 루프",
        th: "แกรนด์ยูนนานลูป",
      },
      detailUrl: {
        en: "/yunnan-grand-loop/",
        zh: "/zh/yunnan-grand-loop/",
        ja: "/yunnan-grand-loop/",
        ko: "/yunnan-grand-loop/",
        th: "/yunnan-grand-loop/",
      },
      detailText: {
        en: "See the full 13-day route",
        zh: "看完整 13 天方案",
        ja: "13日間の詳細を見る",
        ko: "13일 전체 일정 보기",
        th: "ดูเส้นทาง 13 วัน",
      },
      intro: {
        en: "For travellers who do not want Yunnan to stop at Dali and Lijiang. This longer route adds rainforest, hot springs, borderland pagodas, local craft and a clearer view of why Yunnan needs careful pacing.",
        zh: "給不想把雲南停在大理麗江的旅人。這條更長的路線加入雨林、溫泉、邊地佛塔、在地手作與更完整的節奏判斷。",
        ja: "大理と麗江だけで終わらせたくない方向け。熱帯雨林、温泉、辺境の仏塔、手仕事を加え、雲南の広さを無理なく見ます。",
        ko: "다리와 리장에서 끝내고 싶지 않은 여행자를 위한 긴 루트입니다. 우림, 온천, 국경 지역의 탑, 공예를 더해 윈난의 넓이를 조심스럽게 봅니다.",
        th: "สำหรับคนที่ไม่อยากให้ยูนนานจบแค่ต้าหลี่และลี่เจียง เส้นทางยาวขึ้นพร้อมป่าฝน น้ำพุร้อน เจดีย์ชายแดน และงานฝีมือท้องถิ่น",
      },
      price: {
        en: "From RMB 9,800",
        zh: "RMB 9,800 起",
        ja: "RMB 9,800 から",
        ko: "RMB 9,800 부터",
        th: "เริ่มที่ RMB 9,800",
      },
      duration: {
        en: "13 days / 12 nights",
        zh: "13 天 12 晚",
        ja: "13日間 / 12泊",
        ko: "13일 / 12박",
        th: "13 วัน / 12 คืน",
      },
      group: {
        en: "Private route from 2 travellers",
        zh: "2 人起私人成行",
        ja: "2名様から個別手配",
        ko: "2명부터 개인 일정",
        th: "เริ่มจัดแบบส่วนตัว 2 ท่าน",
      },
      groupPrices: {
        en: [["2 travellers", "RMB 9,800 pp"], ["4 travellers", "RMB 7,800 pp"], ["6 travellers", "RMB 6,900 pp"]],
        zh: [["2 人", "RMB 9,800/人起"], ["4 人", "RMB 7,800/人起"], ["6 人", "RMB 6,900/人起"]],
        ja: [["2名", "RMB 9,800/名から"], ["4名", "RMB 7,800/名から"], ["6名", "RMB 6,900/名から"]],
        ko: [["2명", "RMB 9,800/인부터"], ["4명", "RMB 7,800/인부터"], ["6명", "RMB 6,900/인부터"]],
        th: [["2 ท่าน", "RMB 9,800/ท่าน"], ["4 ท่าน", "RMB 7,800/ท่าน"], ["6 ท่าน", "RMB 6,900/ท่าน"]],
      },
      route: {
        en: "Dali · Lijiang · Xishuangbanna · Tengchong · Mangshi",
        zh: "大理 · 麗江 · 西雙版納 · 騰衝 · 芒市",
        ja: "大理 · 麗江 · シーサンパンナ · 騰衝 · 芒市",
        ko: "다리 · 리장 · 시솽반나 · 텅충 · 망시",
        th: "ต้าหลี่ · ลี่เจียง · สิบสองปันนา · เถิงชง · หมางซื่อ",
      },
      segments: {
        en: [
          ["D1-2", "Dali and Shuanglang", "Lake-view afternoon tea, field train, Bai village rhythm and a first soft landing."],
          ["D3-4", "Lijiang and Yulong Snow Mountain", "Yunshanping, Blue Moon Valley and old-town evenings paced around altitude and weather."],
          ["D5-7", "Xishuangbanna rainforest and Dai culture", "Wild Elephant Valley, botanical garden, Dai Garden, Manting Park and a warm tropical table."],
          ["D8-10", "Tengchong hot springs and Heshun", "Wetland bamboo raft, Rehai, volcano landscape and Heshun old-town craft time."],
          ["D11-13", "Mangshi and borderland pagoda light", "Golden Pagoda, Silver Pagoda, tree-wrapped pagoda, Wa village texture and return transfer."],
        ],
        zh: [
          ["D1-2", "大理與雙廊", "湖景下午茶、稻田小火車、白族村路與第一個柔和落地。"],
          ["D3-4", "麗江與玉龍雪山", "雲杉坪、藍月谷與古城夜晚，依海拔與天氣控制節奏。"],
          ["D5-7", "西雙版納雨林與傣族文化", "野象谷、中科植物園、傣族園、曼聽公園與熱帶餐桌。"],
          ["D8-10", "騰衝溫泉與和順", "北海濕地竹筏、熱海、火山地貌與和順古鎮手作時間。"],
          ["D11-13", "芒市與邊地佛塔光線", "勐煥大金塔、銀塔、樹包塔、佤族古寨與返程安排。"],
        ],
        ja: [
          ["D1-2", "大理と双廊", "湖を望む午後茶、田園列車、白族の村道からゆっくり入ります。"],
          ["D3-4", "麗江と玉龍雪山", "雲杉坪、藍月谷、古い町の夜を標高と天候に合わせます。"],
          ["D5-7", "シーサンパンナの雨林とタイ族文化", "野象谷、植物園、タイ族園、曼聴公園と熱帯の食卓。"],
          ["D8-10", "騰衝の温泉と和順", "湿地の竹筏、熱海、火山地形、和順古鎮の手仕事。"],
          ["D11-13", "芒市と辺境の仏塔", "金塔、銀塔、木を抱く塔、ワ族の村、帰路の調整。"],
        ],
        ko: [
          ["D1-2", "다리와 솽랑", "호수 전망 애프터눈티, 들판 열차, 바이족 마을 리듬으로 부드럽게 시작합니다."],
          ["D3-4", "리장과 위룽설산", "윈산핑, 블루문밸리, 옛 마을의 밤을 고도와 날씨에 맞춥니다."],
          ["D5-7", "시솽반나 우림과 다이 문화", "야생 코끼리 계곡, 식물원, 다이 정원, 만팅 공원과 열대 식탁."],
          ["D8-10", "텅충 온천과 허순", "베이하이 습지 대나무 뗏목, 러하이, 화산 지형, 허순 공예 시간."],
          ["D11-13", "망시와 국경 지역의 탑", "황금탑, 은탑, 나무가 감싼 탑, 와족 마을과 귀로 조율."],
        ],
        th: [
          ["D1-2", "ต้าหลี่และซวงหลาง", "น้ำชายามบ่ายริมทะเลสาบ รถไฟทุ่งนา และหมู่บ้านไป๋อย่างนุ่มนวล"],
          ["D3-4", "ลี่เจียงและภูเขาหิมะยู่หลง", "หยุนซานผิง หุบเขาพระจันทร์สีน้ำเงิน และเมืองเก่าตามจังหวะความสูง"],
          ["D5-7", "ป่าฝนสิบสองปันนาและวัฒนธรรมไต", "หุบเขาช้าง สวนพฤกษศาสตร์ หมู่บ้านไต สวนม่านทิง และมื้ออาหารเขตร้อน"],
          ["D8-10", "น้ำพุร้อนเถิงชงและเหอซุ่น", "แพไม้ไผ่พื้นที่ชุ่มน้ำ เร่อไห่ ภูเขาไฟ และงานฝีมือในเมืองเก่า"],
          ["D11-13", "หมางซื่อและแสงเจดีย์ชายแดน", "เจดีย์ทอง เจดีย์เงิน ต้นไม้โอบเจดีย์ หมู่บ้านว้า และเดินทางกลับ"],
        ],
      },
      includes: {
        en: ["Full-route vehicle coordination", "Selected hotels and core tickets", "Driver-guide coordination", "Insurance and formal local travel contract where applicable"],
        zh: ["全程用車協調", "住宿與核心門票", "司機兼向導協調", "保險與適用情況下的正式旅遊合同"],
        ja: ["全行程の車両調整", "宿泊と主要入場券", "ドライバー兼ガイド調整", "保険と必要に応じた正式な現地旅行契約"],
        ko: ["전 일정 차량 조율", "숙소와 핵심 입장권", "드라이버 겸 가이드 조율", "보험 및 해당 시 공식 현지 여행 계약"],
        th: ["ประสานรถตลอดเส้นทาง", "ที่พักและบัตรเข้าหลัก", "ประสานคนขับ/ไกด์", "ประกันและสัญญาท่องเที่ยวท้องถิ่นตามเงื่อนไข"],
      },
      excludes: {
        en: ["International or domestic flights", "Main meals unless listed", "Personal expenses", "Invoice taxes or unlisted items"],
        zh: ["國際或國內機票", "未列明的正餐", "個人消費", "發票稅點與未列明項目"],
        ja: ["国際線または国内線航空券", "記載のない食事", "個人費用", "請求書税金と未記載項目"],
        ko: ["국제선 또는 국내선 항공권", "명시되지 않은 식사", "개인 지출", "세금계산서 비용 및 미기재 항목"],
        th: ["ตั๋วเครื่องบินระหว่างประเทศหรือในประเทศ", "มื้อหลักที่ไม่ได้ระบุ", "ค่าใช้จ่ายส่วนตัว", "ภาษีใบกำกับหรือรายการที่ไม่ได้ระบุ"],
      },
      gallery: [
        "/assets/wechat-reference-20260709/wechat-yunnan-dali-field-train-11.jpg",
        "/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg",
        "/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg",
        "/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg",
      ],
    },
  },
  xinjiang: {
    path: "xinjiang",
    image: "/assets/ai/bluehour-xinjiang-luxury-lake-v1.jpg",
    prices: { en: "From US$1,850", zh: "RMB 12,800 起", ja: "JPY 300,000 から", ko: "KRW 2,850,000 부터", th: "เริ่มที่ THB 62,000" },
    daysLabel: { en: "8-9 days", zh: "8-9 日", ja: "8-9日間", ko: "8-9일", th: "8-9 วัน" },
    route: { en: "Urumqi · Sayram Lake or Ili · grassland or bazaar", zh: "烏魯木齊 · 賽里木湖或伊犁 · 草原或巴扎", ja: "ウルムチ · サイラム湖またはイリ · 草原またはバザール", ko: "우루무치 · 싸이리무 호수 또는 이리 · 초원 또는 바자", th: "อุรุมชี · ทะเลสาบไซหลี่มู่หรืออีหลี · ทุ่งหญ้าหรือตลาด" },
    name: { en: "Xinjiang", zh: "新疆", ja: "新疆", ko: "신장", th: "ซินเจียง" },
    title: { en: "Xinjiang Sky Road", zh: "新疆天山大路線", ja: "新疆スカイ・ロード", ko: "신장 스카이 로드", th: "เส้นทางฟ้ากว้างซินเจียง" },
    homeDays: {
      en: ["D1-2 Urumqi arrival and context", "D3-5 lake or grassland season route", "D6-9 bazaar, long-road buffer and return"],
      zh: ["D1-2 烏魯木齊抵達與背景", "D3-5 湖泊或草原季節線", "D6-9 巴扎、長路緩衝與返回"],
      ja: ["D1-2 ウルムチ到着と文脈", "D3-5 湖または草原の季節ルート", "D6-9 バザール、移動の余白、戻り"],
      ko: ["D1-2 우루무치 도착과 이해", "D3-5 호수 또는 초원 계절 루트", "D6-9 바자, 장거리 버퍼, 복귀"],
      th: ["D1-2 ถึงอุรุมชีและปรับจังหวะ", "D3-5 ทะเลสาบหรือทุ่งหญ้าตามฤดูกาล", "D6-9 ตลาด วันเผื่อ และกลับ"],
    },
    days: {
      en: [
        ["Day 1", "Arrive in Urumqi", "Pickup, check-in and a low-pressure first meal. The route begins by reducing distance anxiety.", "Stay: Urumqi"],
        ["Day 2", "Bazaar, food and route briefing", "A softer city day for market texture, local table and confirming the long-road plan before leaving the city.", "Stay: Urumqi"],
        ["Day 3", "Toward Sayram Lake or Ili", "Begin the seasonal landscape route. The day is planned around road comfort, weather and good arrival light.", "Stay: Lake or Ili area"],
        ["Day 4", "Lake or grassland day", "A fuller landscape day without over-scheduling. The road, weather and light decide the exact rhythm.", "Stay: Lake or grassland area"],
        ["Day 5", "Village, pasture or softer local table", "A day that lets Xinjiang feel human, not only vast: food, local rhythm and enough rest.", "Stay: Ili or route town"],
        ["Day 6", "Long-road recovery and return direction", "Move back in a way that does not punish the group. We protect a better room or earlier evening where possible.", "Stay: route town"],
        ["Day 7", "Bazaar, oasis or buffer day", "A flexible day for culture, weather adjustment or a quieter return toward Urumqi.", "Stay: Urumqi or route town"],
        ["Day 8", "Departure or final Urumqi night", "Depart if timing works; otherwise keep one more night so the route does not end in a rush.", "Departure or Urumqi"],
        ["Day 9", "Optional comfort buffer", "Used when flight times, weather, older travellers or remote hotels make a buffer smarter than a heroic schedule.", "Optional"],
      ],
      zh: [
        ["第 1 天", "抵達烏魯木齊", "接送、入住與一頓低壓力的第一餐。新疆路線先處理距離焦慮，不急著遠行。", "住宿：烏魯木齊"],
        ["第 2 天", "巴扎、食物與路線說明", "用一個柔和城市日理解市場、餐桌與接下來的長路，不直接把人丟進遠方。", "住宿：烏魯木齊"],
        ["第 3 天", "前往賽里木湖或伊犁方向", "開始季節風景線。這天以車程舒適、天氣與抵達光線為核心安排。", "住宿：湖區或伊犁方向"],
        ["第 4 天", "湖泊或草原日", "完整看大風景，但不塞滿。道路、天氣與光線決定當天真正節奏。", "住宿：湖泊或草原周邊"],
        ["第 5 天", "村落、牧場或在地餐桌", "讓新疆不只有巨大，也有人味：食物、地方節奏與足夠休息。", "住宿：伊犁或路線城鎮"],
        ["第 6 天", "長路恢復與返回方向", "往回移動，但不把車程變成懲罰。能安排更好房間或更早晚上就保護下來。", "住宿：路線城鎮"],
        ["第 7 天", "巴扎、綠洲或緩衝日", "保留彈性給文化、天氣調整，或更安靜地回到烏魯木齊方向。", "住宿：烏魯木齊或路線城鎮"],
        ["第 8 天", "離開或烏魯木齊最後一晚", "班機合適就離開；不合適則留一晚，避免旅程最後變成趕路。", "離開或烏魯木齊"],
        ["第 9 天", "可選舒適緩衝", "當班機、天氣、年長旅伴或偏遠住宿讓緩衝更聰明時使用。", "可選"],
      ],
    },
    visuals: {
      en: ["The lake image signals scale; Xinjiang should feel wide, not rushed.", "Long-road days need weather and rest buffers, otherwise the scenery becomes fatigue.", "The bazaar and food layer matters because it makes the route human, not only panoramic."],
      zh: ["湖泊圖說明的是尺度：新疆要做得寬，不是做得趕。", "長路日必須留天氣與休息緩衝，否則風景會變成疲勞。", "巴扎與餐桌很重要，因為它讓路線有人味，而不只是大景。"],
      ja: ["湖の写真は新疆のスケールを示します。広く感じるべきで、急ぐ場所ではありません。", "長距離移動には天候と休息の余白が必要です。", "バザールと食は、風景だけでなく人の気配を加えます。"],
      ko: ["호수 이미지는 신장의 규모를 보여 줍니다. 넓게 느껴져야지 급하면 안 됩니다.", "장거리 이동에는 날씨와 휴식 버퍼가 필요합니다.", "바자와 음식은 큰 풍경에 사람의 결을 더합니다."],
      th: ["ภาพทะเลสาบบอกขนาดของซินเจียง: ควรกว้าง ไม่ควรเร่ง", "วันนั่งรถยาวต้องมีเวลาเผื่ออากาศและพัก", "ตลาดและอาหารทำให้เส้นทางมีคน มีชีวิต ไม่ใช่แค่วิวใหญ่"],
    },
  },
  dunhuang: {
    path: "dunhuang",
    image: "/assets/ai/bluehour-dunhuang-luxury-desert-v1.jpg",
    prices: { en: "From US$1,450", zh: "RMB 9,800 起", ja: "JPY 235,000 から", ko: "KRW 2,200,000 부터", th: "เริ่มที่ THB 48,000" },
    daysLabel: { en: "5-6 days", zh: "5-6 日", ja: "5-6日間", ko: "5-6일", th: "5-6 วัน" },
    route: { en: "Dunhuang · Mogao Caves · Mingsha dunes · oasis evening", zh: "敦煌 · 莫高窟 · 鳴沙山月牙泉 · 綠洲夜晚", ja: "敦煌 · 莫高窟 · 鳴沙山月牙泉 · オアシスの夜", ko: "둔황 · 막고굴 · 명사산 월아천 · 오아시스의 밤", th: "ตุนหวง · ถ้ำม่อเกา · หมิงซาซานเย่ว์หยาฉวน · ค่ำคืนโอเอซิส" },
    name: { en: "Dunhuang", zh: "敦煌", ja: "敦煌", ko: "둔황", th: "ตุนหวง" },
    title: { en: "Dunhuang Silk Road Light", zh: "敦煌絲路光線", ja: "敦煌シルクロードの光", ko: "둔황 실크로드 빛", th: "แสงเส้นทางสายไหมตุนหวง" },
    homeDays: {
      en: ["D1 arrive and settle", "D2-3 Mogao Caves with context", "D4-6 dunes, oasis and optional extension"],
      zh: ["D1 抵達與安頓", "D2-3 莫高窟與背景理解", "D4-6 沙丘、綠洲與可選延伸"],
      ja: ["D1 到着と休息", "D2-3 莫高窟を文脈とともに", "D4-6 砂丘、オアシス、延長"],
      ko: ["D1 도착과 휴식", "D2-3 막고굴과 맥락", "D4-6 사구, 오아시스, 선택 연장"],
      th: ["D1 ถึงและพัก", "D2-3 ถ้ำม่อเกาพร้อมบริบท", "D4-6 เนินทราย โอเอซิส และต่อเส้นทาง"],
    },
    days: {
      en: [
        ["Day 1", "Arrive in Dunhuang", "Pickup, check-in and a quiet first evening so the desert city is not reduced to a transfer stop.", "Stay: Dunhuang"],
        ["Day 2", "Mogao context before the caves", "Museum, guide briefing or reading time before the cave visit. The point is to enter with context, not only a camera.", "Stay: Dunhuang"],
        ["Day 3", "Mogao Caves and slow oasis evening", "Use the reserved cave timing well, then keep the evening simple and grounded.", "Stay: Dunhuang"],
        ["Day 4", "Mingsha dunes at the right hour", "Arrange the desert for light and temperature, not for convenience alone. The day avoids the harshest rhythm.", "Stay: Dunhuang"],
        ["Day 5", "Oasis, market or departure", "A softer local layer, rest and transfer. If guests are ready, depart without squeezing another heavy stop.", "Departure or Dunhuang"],
        ["Day 6", "Optional Jiayuguan or Zhangye extension", "For guests who want a wider Silk Road line, we discuss whether extension adds meaning or only distance.", "Optional"],
      ],
      zh: [
        ["第 1 天", "抵達敦煌", "接送、入住與安靜第一晚，讓沙漠城市不是單純中轉點。", "住宿：敦煌"],
        ["第 2 天", "進洞窟前先理解莫高窟", "用博物館、導覽說明或閱讀時間墊底。重點是帶著背景進入，不只是帶相機。", "住宿：敦煌"],
        ["第 3 天", "莫高窟與綠洲慢夜", "好好使用預約好的洞窟時段，晚上留得簡單、安靜、落地。", "住宿：敦煌"],
        ["第 4 天", "對的時間進鳴沙山", "沙漠要看光線與溫度，不只看方便。這天避開最粗暴的節奏。", "住宿：敦煌"],
        ["第 5 天", "綠洲、市場或離開", "放一層柔和在地時間、休息與接送。若旅人準備好，就不硬塞另一個重點。", "離開或敦煌"],
        ["第 6 天", "可選嘉峪關或張掖延伸", "想拉寬絲路線時，再判斷延伸是在增加意義，還是只增加距離。", "可選"],
      ],
    },
    visuals: {
      en: ["The desert image should be read as timing: light, heat and silence matter as much as the landmark.", "Mogao days need context before access, otherwise the site becomes too thin.", "A good Dunhuang route protects evenings so the desert does not become only a photo stop."],
      zh: ["沙漠圖真正說明的是時間：光線、熱度與安靜，和景點本身一樣重要。", "莫高窟日需要先鋪背景，不然重量會被看薄。", "好的敦煌路線會保護夜晚，讓沙漠不是一個拍照點。"],
      ja: ["砂漠の写真は時間を示します。光、暑さ、静けさが重要です。", "莫高窟は文脈を持って入ることで薄くなりません。", "よい敦煌の旅は夜を守り、砂漠を写真だけにしません。"],
      ko: ["사막 이미지는 시간의 중요성을 말합니다. 빛, 더위, 고요함이 핵심입니다.", "막고굴은 들어가기 전 맥락이 있어야 얇아지지 않습니다.", "좋은 둔황 일정은 밤을 지켜 사막을 사진 한 장으로 만들지 않습니다."],
      th: ["ภาพทะเลทรายพูดถึงเวลา: แสง ความร้อน และความเงียบสำคัญพอ ๆ กับสถานที่", "ถ้ำม่อเกาต้องมีบริบทก่อนเข้า มิฉะนั้นจะบางเกินไป", "เส้นทางตุนหวงที่ดีต้องรักษาเวลาเย็น ไม่ให้ทะเลทรายเหลือแค่รูปถ่าย"],
    },
  },
  sanya: {
    path: "sanya",
    image: "/assets/ai/bluehour-sanya-luxury-coast-v1.jpg",
    prices: { en: "From US$1,350", zh: "RMB 9,200 起", ja: "JPY 220,000 から", ko: "KRW 2,100,000 부터", th: "เริ่มที่ THB 45,000" },
    daysLabel: { en: "5 days", zh: "5 日", ja: "5日間", ko: "5일", th: "5 วัน" },
    route: { en: "Sanya resort stay · coastal day · gentle local moment", zh: "三亞度假酒店 · 海岸日 · 柔和在地半日", ja: "三亜リゾート滞在 · 海岸の日 · 軽いローカル体験", ko: "싼야 리조트 숙박 · 해안의 하루 · 부드러운 현지 시간", th: "พักรีสอร์ตซานย่า · วันริมทะเล · ครึ่งวันท้องถิ่นเบา ๆ" },
    name: { en: "Sanya", zh: "三亞", ja: "三亜", ko: "싼야", th: "ซานย่า" },
    title: { en: "Sanya Coastal Ease", zh: "三亞海岸慢休日", ja: "三亜コースタル・イーズ", ko: "싼야 코스털 이즈", th: "วันพักช้าริมทะเลซานย่า" },
    homeDays: {
      en: ["D1 arrive and settle by the coast", "D2-3 resort rhythm and one local day", "D4-5 open rest, private dinner and departure"],
      zh: ["D1 抵達海岸與入住", "D2-3 度假節奏與一個在地日", "D4-5 開放休息、私人晚餐與離開"],
      ja: ["D1 海辺に到着", "D2-3 リゾート時間と現地の一日", "D4-5 休息、夕食、出発"],
      ko: ["D1 해안 도착과 체크인", "D2-3 리조트 리듬과 현지 하루", "D4-5 휴식, 저녁, 출발"],
      th: ["D1 ถึงริมทะเลและเช็กอิน", "D2-3 รีสอร์ตและหนึ่งวันท้องถิ่น", "D4-5 พัก อาหารเย็นส่วนตัว และออกเดินทาง"],
    },
    days: {
      en: [
        ["Day 1", "Arrive by the coast", "Private transfer, check-in and no heavy programming. The room and the sea do the first work.", "Stay: Sanya"],
        ["Day 2", "Slow resort morning", "Breakfast, beach or pool time, and only one light planned moment if the group wants it.", "Stay: Sanya"],
        ["Day 3", "Gentle local day", "A curated coastal, village, market or tropical-table experience that does not break the resort rhythm.", "Stay: Sanya"],
        ["Day 4", "Open rest and private dinner", "A flexible day for families, couples or parents to rest, swim and close the trip with one better meal.", "Stay: Sanya"],
        ["Day 5", "Depart or extend", "Private transfer to airport. If Sanya is the rest layer after another China route, an extra night may be smarter.", "Departure day"],
      ],
      zh: [
        ["第 1 天", "抵達海岸", "私人接送、入住，不安排重行程。第一天讓房間與海先工作。", "住宿：三亞"],
        ["第 2 天", "度假酒店慢清晨", "早餐、海灘或泳池，如果同行者想外出，只放一個很輕的安排。", "住宿：三亞"],
        ["第 3 天", "柔和在地日", "安排一個海岸、村落、市場或熱帶餐桌體驗，但不破壞度假節奏。", "住宿：三亞"],
        ["第 4 天", "開放休息與私人晚餐", "給家庭、情侶或父母同行者休息、游泳、散步，再用一頓好飯收束。", "住宿：三亞"],
        ["第 5 天", "離開或延住", "私人接送到機場。若三亞是另一條中國路線後的休息層，多一晚可能更聰明。", "離開日"],
      ],
    },
    visuals: {
      en: ["The coast image explains why hotel choice is part of the route, not decoration.", "Sanya sells badly when overfilled; its value is rest with one or two local notes.", "For families or parents, transfer ease and room comfort matter more than more attractions."],
      zh: ["海岸圖說明為什麼酒店選擇本身就是路線，不是裝飾。", "三亞最怕被塞滿；它的價值是休息，再加一兩個在地片段。", "家庭或父母同行時，接送簡單與房間舒服，比更多景點更重要。"],
      ja: ["海の写真は、ホテル選びが旅そのものだと示しています。", "三亜は詰め込みすぎると弱くなります。価値は休息と少しの現地感です。", "家族や親との旅では、移動と部屋の快適さが大切です。"],
      ko: ["해안 이미지는 호텔 선택이 장식이 아니라 루트의 일부임을 말합니다.", "싼야는 너무 채우면 약해집니다. 가치는 휴식과 작은 현지 경험입니다.", "가족이나 부모와 함께라면 이동 편함과 객실이 더 중요합니다."],
      th: ["ภาพชายฝั่งบอกว่าโรงแรมเป็นส่วนหนึ่งของเส้นทาง ไม่ใช่แค่ฉาก", "ซานย่าไม่ควรใส่กิจกรรมแน่นเกินไป คุณค่าคือพักและมีท้องถิ่นเล็กน้อย", "สำหรับครอบครัวหรือพ่อแม่ ความง่ายของรถและห้องพักสำคัญกว่าสถานที่เพิ่ม"],
    },
  },
  northeast: {
    path: "northeast",
    image: "/assets/ai/bluehour-northeast-winter-lodge-v1.jpg",
    prices: { en: "From US$1,600", zh: "RMB 10,800 起", ja: "JPY 255,000 から", ko: "KRW 2,400,000 부터", th: "เริ่มที่ THB 52,000" },
    daysLabel: { en: "6-7 days", zh: "6-7 日", ja: "6-7日間", ko: "6-7일", th: "6-7 วัน" },
    route: { en: "Harbin · snow or forest stay · winter rail movement", zh: "哈爾濱 · 雪地或森林住宿 · 冬季鐵路移動", ja: "ハルビン · 雪原または森の滞在 · 冬の鉄道", ko: "하얼빈 · 설원 또는 숲 숙박 · 겨울 철도 이동", th: "ฮาร์บิน · พักในหิมะหรือป่า · รถไฟฤดูหนาว" },
    name: { en: "Northeast", zh: "東北", ja: "東北", ko: "동북", th: "ตะวันออกเฉียงเหนือ" },
    title: { en: "Northeast Winter Rail", zh: "東北雪線暖房", ja: "東北ウィンター・レール", ko: "동북 윈터 레일", th: "รถไฟฤดูหนาวภาคตะวันออกเฉียงเหนือ" },
    homeDays: {
      en: ["D1-2 Harbin winter entry", "D3-4 snow or forest stay", "D5-7 rail movement, warm rooms and return"],
      zh: ["D1-2 哈爾濱冬日進入", "D3-4 雪地或森林住宿", "D5-7 鐵路移動、暖房與返回"],
      ja: ["D1-2 ハルビン冬の入口", "D3-4 雪または森の滞在", "D5-7 鉄道、暖かい部屋、戻り"],
      ko: ["D1-2 하얼빈 겨울 시작", "D3-4 눈 또는 숲 숙박", "D5-7 철도, 따뜻한 방, 복귀"],
      th: ["D1-2 เริ่มฤดูหนาวที่ฮาร์บิน", "D3-4 พักในหิมะหรือป่า", "D5-7 รถไฟ ห้องอุ่น และกลับ"],
    },
    days: {
      en: [
        ["Day 1", "Arrive in Harbin", "Pickup, warm check-in and first hot meal. The first promise is comfort in the cold.", "Stay: Harbin"],
        ["Day 2", "Harbin winter architecture and ice season", "A paced city day around architecture, winter light and seasonal ice or snow experiences without staying outside too long.", "Stay: Harbin"],
        ["Day 3", "Snowfield or forest stay", "Transfer to a snow or forest stay with warm-room standards checked before confirmation.", "Stay: snow or forest lodge"],
        ["Day 4", "Controlled outdoor winter day", "Shorter outdoor blocks, hot meals and room recovery. The goal is cinematic winter, not endurance.", "Stay: snow or forest lodge"],
        ["Day 5", "Winter rail or return movement", "Use rail or private transfer in a way that feels romantic rather than exhausting.", "Stay: Harbin or route town"],
        ["Day 6", "Departure or warm city buffer", "Depart if timing works; otherwise keep a warm buffer day for weather, shopping or a slower meal.", "Departure or Harbin"],
        ["Day 7", "Optional borderland or forest extension", "For travellers who love winter and have stamina, we can discuss a wider snow line.", "Optional"],
      ],
      zh: [
        ["第 1 天", "抵達哈爾濱", "接送、暖房入住與第一頓熱食。東北冬天的第一個承諾是舒服，而不是硬撐。", "住宿：哈爾濱"],
        ["第 2 天", "哈爾濱建築與冰雪季節", "圍繞建築、冬光、季節冰雪活動做一個有節制城市日，不讓人在戶外凍太久。", "住宿：哈爾濱"],
        ["第 3 天", "雪地或森林住宿", "前往雪地或森林住宿，正式確認前先看房間暖度與舒適標準。", "住宿：雪地或森林旅宿"],
        ["第 4 天", "可控制的戶外冬日", "短戶外段、熱食與房間恢復。目標是電影感冬天，不是耐寒比賽。", "住宿：雪地或森林旅宿"],
        ["第 5 天", "冬季鐵路或返回移動", "用鐵路或私人車把移動做得浪漫，而不是疲憊。", "住宿：哈爾濱或路線城鎮"],
        ["第 6 天", "離開或暖城緩衝", "班機合適就離開；不合適則留一個暖房緩衝日給天氣、購物或一頓慢飯。", "離開或哈爾濱"],
        ["第 7 天", "可選邊地或森林延伸", "若旅人喜歡冬天且體力足夠，再討論更遠的雪線。", "可選"],
      ],
    },
    visuals: {
      en: ["The winter-lodge image explains the route promise: cold outside, warm rooms inside.", "Outdoor time is designed in shorter blocks so winter remains beautiful, not punishing.", "Rail and transfer days need backup timing because weather is part of the destination."],
      zh: ["雪地旅宿圖說明的是承諾：外面冷，裡面要暖。", "戶外時間要切成短段，冬天才是美，而不是懲罰。", "鐵路與移動日需要備案，因為天氣本身就是目的地的一部分。"],
      ja: ["冬の宿の写真は、外の寒さと室内の温かさを両方整える約束を示しています。", "屋外時間は短く区切り、冬を罰ではなく美しさにします。", "鉄道や移動日は天候を前提に余白を作ります。"],
      ko: ["겨울 숙소 이미지는 밖은 차갑고 안은 따뜻해야 한다는 약속입니다.", "야외 시간은 짧게 나누어 겨울이 고통이 아니라 아름다움이 되게 합니다.", "철도와 이동일에는 날씨를 고려한 버퍼가 필요합니다."],
      th: ["ภาพที่พักฤดูหนาวบอกคำสัญญา: ข้างนอกหนาว แต่ข้างในต้องอุ่น", "เวลาออกนอกอาคารต้องสั้น เพื่อให้ฤดูหนาวสวย ไม่ใช่ทรมาน", "วันรถไฟและเดินทางต้องมีเวลาเผื่อ เพราะอากาศคือส่วนหนึ่งของปลายทาง"],
    },
  },
};

const extensionTermLabels = {
  en: { includes: "Usually included", excludes: "Not included" },
  zh: { includes: "此方案通常包含", excludes: "此方案不包含" },
  ja: { includes: "通常含まれるもの", excludes: "含まれないもの" },
  ko: { includes: "보통 포함", excludes: "불포함" },
  th: { includes: "โดยทั่วไปครอบคลุม", excludes: "ไม่รวม" },
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function titleHtml(value, locale) {
  if (Array.isArray(value)) {
    return `<h2 class="cjk-title">${value.map((line) => `<span class="title-line">${esc(line)}</span>`).join("")}</h2>`;
  }
  return `<h2${locale.cjk ? ' class="cjk-title"' : ""}>${esc(value)}</h2>`;
}

function pagePath(dest, lang) {
  if (lang === "en") {
    return [new URL(`${dest.path}.html`, root), new URL(`en/${dest.path}/index.html`, root)];
  }
  return [new URL(`${lang}/${dest.path}/index.html`, root)];
}

function destUrl(slug, lang) {
  if (lang === "en") return `/${slug}.html`;
  return `/${lang}/${slug}/`;
}

function interestUrl(base, slug) {
  const separator = base.includes("?") ? "&" : "?";
  return `${base}${separator}utm_source=route_day_plan&utm_medium=site&utm_campaign=private_route_consultation&destination=${slug}`;
}

function renderExtension(dest, lang) {
  if (!dest.extension) return "";
  const ext = dest.extension;
  const segments = ext.segments[lang]
    .map(
      ([days, title, body]) => `<article>
        <b>${esc(days)}</b>
        <h3>${esc(title)}</h3>
        <p>${esc(body)}</p>
      </article>`,
    )
    .join("");
  const includes = ext.includes[lang].map((item) => `<li>${esc(item)}</li>`).join("");
  const excludes = ext.excludes[lang].map((item) => `<li>${esc(item)}</li>`).join("");
  const prices = ext.groupPrices[lang]
    .map(([group, price]) => `<div><b>${esc(group)}</b><span>${esc(price)}</span></div>`)
    .join("");
  const gallery = ext.gallery
    .slice(1)
    .map((src, index) => `<figure><img src="${esc(src)}" alt="${esc(ext.title[lang])} ${index + 1}"></figure>`)
    .join("");
  const detailCta =
    ext.detailUrl && ext.detailText
      ? `<div class="route-extension-actions"><a class="btn primary dark-gold" href="${esc(ext.detailUrl[lang])}">${esc(ext.detailText[lang])}</a><a class="btn" href="${esc(interestUrl(locales[lang].interest, dest.path))}">${esc(locales[lang].viewText)}</a></div>`
      : "";

  return `<section class="route-extension">
    <div class="route-extension-copy">
      <p class="eyebrow">${esc(ext.eyebrow[lang])}</p>
      <h2>${esc(ext.title[lang])}</h2>
      <p>${esc(ext.intro[lang])}</p>
      <div class="route-extension-meta">
        <span>${esc(ext.duration[lang])}</span>
        <span>${esc(ext.price[lang])}</span>
        <span>${esc(ext.group[lang])}</span>
        <span>${esc(ext.route[lang])}</span>
      </div>
    </div>
    <div class="route-extension-price-visual">
      <figure>
        <img src="${esc(ext.gallery[0])}" alt="${esc(ext.title[lang])}">
        <figcaption>
          <span>${esc(ext.duration[lang])}</span>
          <strong>${esc(ext.title[lang])}</strong>
        </figcaption>
      </figure>
      <div class="route-extension-price-overlay">${prices}</div>
      <div class="route-extension-gallery">${gallery}</div>
    </div>
    <div class="route-extension-grid">${segments}</div>
    <div class="route-extension-terms">
      <section>
        <h3>${esc(extensionTermLabels[lang].includes)}</h3>
        <ul>${includes}</ul>
      </section>
      <section>
        <h3>${esc(extensionTermLabels[lang].excludes)}</h3>
        <ul>${excludes}</ul>
      </section>
    </div>
    ${detailCta}
  </section>`;
}

function renderHomeSection(lang) {
  const locale = locales[lang];
  const cards = Object.entries(destinations)
    .map(([slug, dest]) => {
      const miniDays = dest.homeDays[lang].map((item) => `<li>${esc(item)}</li>`).join("");
      return `<article class="product-route-card">
        <a class="product-route-image" href="${esc(destUrl(slug, lang))}">
          <img src="${esc(dest.image)}" alt="${esc(dest.name[lang])}">
          <span>${esc(dest.daysLabel[lang])}</span>
        </a>
        <div class="product-route-copy">
          <p class="eyebrow">${esc(dest.name[lang])}</p>
          <h3>${esc(dest.title[lang])}</h3>
          <dl class="product-route-meta">
            <div><dt>${esc(locale.fromLabel)}</dt><dd>${esc(dest.prices[lang])}</dd></div>
            <div><dt>${esc(locale.groupLabel)}</dt><dd>${esc(locale.groupText)}</dd></div>
            <div><dt>${esc(locale.routeLabel)}</dt><dd>${esc(dest.route[lang])}</dd></div>
          </dl>
          <ol class="mini-days">${miniDays}</ol>
          <a class="text-link" href="${esc(destUrl(slug, lang))}#day-plan">${esc(locale.viewText)}</a>
        </div>
      </article>`;
    })
    .join("");

  return `
    <!-- product-routes-start -->
    <section class="section product-routes-band" id="standard-routes">
      <div class="wrap">
        <div class="section-head">
          <div><p class="eyebrow">${esc(locale.routesEyebrow)}</p>${titleHtml(locale.routesTitle, locale)}</div>
          <p>${esc(locale.routesIntro)}</p>
        </div>
        <div class="product-route-grid">${cards}</div>
      </div>
    </section>
    <!-- product-routes-end -->`;
}

function renderDayPlan(slug, dest, lang) {
  const locale = locales[lang];
  const cta = interestUrl(locale.interest, slug);
  const days = (dest.days[lang] || dest.days.en)
    .map(
      ([label, title, body, stay]) => `<article class="route-day-item">
        <div class="route-day-index">${esc(label)}</div>
        <div class="route-day-copy">
          <h3>${esc(title)}</h3>
          <p>${esc(body)}</p>
          <span>${esc(stay)}</span>
        </div>
      </article>`,
    )
    .join("");
  const visualNotes = dest.visuals[lang].map((note, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${esc(note)}</span></li>`).join("");
  const includes = locale.includes.map((item) => `<li>${esc(item)}</li>`).join("");
  const checks = locale.quoteChecks.map((item) => `<li>${esc(item)}</li>`).join("");

  return `
    <!-- route-day-plan-start -->
    <section class="section route-day-plan-band" id="day-plan">
      <div class="wrap route-day-plan-wrap">
        <div class="route-day-head">
          <div>
            <p class="eyebrow">${esc(locale.dayEyebrow)}</p>
            ${titleHtml(dest.title[lang], locale)}
            <p>${esc(locale.dayIntro)}</p>
          </div>
          <div class="route-terms">
            <div><b>${esc(locale.daysLabel)}</b><span>${esc(dest.daysLabel[lang])}</span></div>
            <div><b>${esc(locale.fromLabel)}</b><span>${esc(dest.prices[lang])}</span></div>
            <div><b>${esc(locale.groupLabel)}</b><span>${esc(locale.groupText)}</span></div>
          </div>
        </div>
        <div class="route-day-layout">
          <div class="route-day-list">${days}</div>
          <aside class="route-visual-panel" aria-label="${esc(locale.visualTitle)}">
            <figure>
              <img src="${esc(dest.image)}" alt="${esc(dest.title[lang])}">
              <figcaption>${esc(locale.visualTitle)} · ${esc(dest.route[lang])}</figcaption>
            </figure>
            <ul class="route-visual-notes">${visualNotes}</ul>
            <div class="route-inclusion-grid">
              <section>
                <h3>${esc(locale.includesTitle)}</h3>
                <ul>${includes}</ul>
              </section>
              <section>
                <h3>${esc(locale.excludesTitle)}</h3>
                <ul>${checks}</ul>
              </section>
            </div>
            <p class="route-note">${esc(locale.priceNote)}</p>
            <a class="btn primary dark-gold" href="${esc(cta)}">${esc(locales[lang].viewText)}</a>
          </aside>
        </div>
        ${renderExtension(dest, lang)}
      </div>
    </section>
    <!-- route-day-plan-end -->`;
}

let touched = 0;

for (const [lang, locale] of Object.entries(locales)) {
  for (const home of locale.homeFiles) {
    const path = new URL(home, root);
    if (!fs.existsSync(path)) continue;
    let html = fs.readFileSync(path, "utf8");
    html = html.replace(/\n\s*<!-- product-routes-start -->[\s\S]*?<!-- product-routes-end -->\n?/g, "\n");
    const marker = "    <!-- content-95-start -->";
    if (!html.includes(marker)) throw new Error(`Missing content marker in ${home}`);
    html = html.replace(marker, `${renderHomeSection(lang)}\n${marker}`);
    fs.writeFileSync(path, html);
    touched += 1;
  }

  for (const [slug, dest] of Object.entries(destinations)) {
    for (const path of pagePath(dest, lang)) {
      if (!fs.existsSync(path)) continue;
      let html = fs.readFileSync(path, "utf8");
      html = html.replace(/\n\s*<!-- route-day-plan-start -->[\s\S]*?<!-- route-day-plan-end -->\n?/g, "\n");
      const marker = "    <!-- content-95-start -->";
      if (!html.includes(marker)) throw new Error(`Missing content marker in ${path.pathname}`);
      html = html.replace(marker, `${renderDayPlan(slug, dest, lang)}\n${marker}`);
      fs.writeFileSync(path, html);
      touched += 1;
    }
  }
}

console.log(`route-day-plans-updated ${touched}`);
