import fs from "node:fs";

const yunnanBaseImage = "/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg";
const fieldTrainImage = "/assets/wechat-reference-20260709/wechat-yunnan-dali-field-train-11.jpg";
const snowImage = "/assets/wechat-reference-20260709/wechat-yunnan-snow-mountain-meadow-05.jpg";
const dyeImage = "/assets/wechat-reference-20260709/wechat-yunnan-dali-blue-dye-craft-10.jpg";
const lijiangImage = "/assets/real-yunnan/lijiang-old-town-web.jpg";

const localePages = [
  {
    lang: "en",
    files: ["yunnan.html", "en/yunnan/index.html"],
    cjk: false,
    canonical: "https://bluehourchina.com/yunnan.html",
    title: "Yunnan Soft Landing Route",
    metaDescription:
      "Private Yunnan travel for international travellers: an 8-day Kunming, Dali and Lijiang route with public price tiers, plus a 13-day deeper Yunnan loop.",
    productDescription:
      "8-day / 7-night private Yunnan land arrangement through Kunming, Dali and Lijiang, with public starting prices by group size.",
    priceCurrency: "USD",
    schemaPrice: "545",
    duration: "8 days / 7 nights",
    strongPrice: "From US$545 pp",
    priceNote: "Reference starting price for 6 travellers; 2 travellers from US$1,180 pp.",
    tiers: [
      ["2 travellers", "US$1,180 pp"],
      ["4 travellers", "US$695 pp"],
      ["6 travellers", "US$545 pp"],
    ],
    eyebrow: "Standard route",
    intro:
      "A concrete first deep-China route: arrive softly in Kunming, move by rail to Dali, then finish with Lijiang villages, Blue Moon Valley and one carefully paced snow-mountain day.",
    points: [
      ["Route", "Kunming · Dali · Lijiang"],
      ["Pace", "Flower market, wetland light, Erhai sunrise, Bai craft and one mountain day"],
      ["Best for", "Second-time China travellers who want beauty with less friction"],
      ["First review", "Season, altitude comfort, room style, language support"],
    ],
    mapTitle: "Route shape",
    map: ["Kunming old street and flower market", "Laoyuhe wetland, then rail to Dali", "Erhai sunrise, Xizhou and tie-dye", "Lijiang villages and snow-mountain day"],
    note:
      "Public prices are reference land-arrangement starting prices. Flights, unlisted meals, personal expenses and requested upgrades are not included.",
    cta: "Ask about this route",
    terms: {
      days: "Days",
      from: "From",
      group: "Group",
      groupText: "Private route from 2 travellers; most comfortable for 2-6.",
      includesTitle: "Usually included",
      quoteTitle: "Confirmed before quote",
      includes: [
        "Private vehicle coordination for the core route",
        "Selected hotel reference and room-level discussion",
        "Listed tickets and local experiences such as Dounan Flower Market, Laoyuhe Wetland, Xizhou tie-dye, Yunxiang Mountain, Yunshanping and Blue Moon Valley",
        "Driver-guide coordination, insurance and formal local travel contract where applicable",
      ],
      quoteChecks: [
        "Exact travel dates, arrival city, flight or rail times",
        "Hotel level, room type, dietary needs and walking comfort",
        "Altitude comfort, weather buffer and whether to add a slower rest day",
      ],
      priceFootnote:
        "Final quote changes with season, hotel level, ticket availability, vehicle needs and confirmed room, vehicle and ticket details.",
    },
    days: [
      ["Day 1", "Arrive in Kunming", "Private pickup, hotel check-in and a quiet first evening. The goal is to remove arrival friction before the route begins.", "Stay: Kunming"],
      ["Day 2", "Dounan flowers, Laoyuhe wetland and rail to Dali", "Dounan Flower Market in the morning, Laoyuhe Wetland near Dianchi, then high-speed rail to Dali and a quieter Erhai-side evening.", "Stay: Dali"],
      ["Day 3", "Longkan sunrise, Erhai S Bend and Xizhou craft", "A soft sunrise at Longkan Pier, slow time around Erhai S Bend, then Xizhou Old Town and Bai tie-dye so the day has texture, not only views.", "Stay: Dali"],
      ["Day 4", "Dali Old Town, Ideal Garden and Yunxiang Mountain sunset", "Begin with Dali Old Town, move to the garden-and-resort mood of Ideal Garden, then save Yunxiang Mountain for sunset light.", "Stay: Dali"],
      ["Day 5", "Dali to Lijiang, Hou Niao Wan Wetland and Tinghua Valley", "Transfer to Lijiang, then use Hou Niao Wan Wetland and Tinghua Valley as a softer bridge before entering the old-town rhythm.", "Stay: Lijiang"],
      ["Day 6", "Yunshanping, Blue Moon Valley and Shuhe Old Town", "Yulong Snow Mountain area without rushing: Yunshanping meadow, Blue Moon Valley water, then Shuhe for a quieter Naxi evening.", "Stay: Lijiang"],
      ["Day 7", "Baisha Old Town, Yuhu Village and rail back to Kunming", "Baisha murals and old streets, Yuhu Village below the snow mountain, then return to Kunming by rail for a lower-stress departure.", "Stay: Kunming"],
      ["Day 8", "Wake slowly and depart", "Breakfast without hurry and private airport transfer according to the flight time.", "Departure day"],
    ],
    extension: {
      price: "From US$765 pp",
      tiers: [
        ["2 travellers", "US$1,290 pp"],
        ["4 travellers", "US$895 pp"],
        ["6 travellers", "US$765 pp"],
      ],
      meta: ["13 days / 12 nights", "From US$765 pp", "Private route from 2 travellers", "Dali · Lijiang · Xishuangbanna · Tengchong · Mangshi"],
    },
  },
  {
    lang: "zh-Hant",
    files: ["zh/yunnan/index.html"],
    cjk: true,
    canonical: "https://bluehourchina.com/zh/yunnan/",
    title: "昆明大理麗江 8天7晚",
    metaDescription:
      "雲南私人旅遊規劃：8 天 7 晚昆明、大理、麗江標準方案，公開 2/4/6 人起價，並可延伸 13 天雲南全境慢線。",
    productDescription:
      "8 天 7 晚雲南私人地接方案，串起昆明、大理與麗江，公開 2/4/6 人參考起價。",
    priceCurrency: "CNY",
    schemaPrice: "3917",
    duration: "8 天 7 晚",
    strongPrice: "RMB 3,917/人起",
    priceNote: "6 人成行參考；2 人 RMB 8,500/人起。",
    tiers: [
      ["2 人", "RMB 8,500/人起"],
      ["4 人", "RMB 5,000/人起"],
      ["6 人", "RMB 3,917/人起"],
    ],
    eyebrow: "標準方案",
    intro:
      "這是一條可以直接想像的雲南基本盤：先在昆明安定落地，動車進大理湖邊與手作，最後把麗江村落、藍月谷與玉龍雪山放在不趕的位置。",
    points: [
      ["路線", "昆明 · 大理 · 麗江"],
      ["節奏", "花市濕地、洱海日出、白族手作與一個雪山日"],
      ["適合", "第二次來中國，想看自然風景但不想被行程推著走"],
      ["初談", "先確認季節、海拔舒適度、住宿感與語言需求"],
    ],
    mapTitle: "路線形狀",
    map: ["昆明老街與斗南花市", "撈魚河濕地後動車至大理", "龍龕日出、洱海 S 灣與喜洲扎染", "麗江村落、藍月谷與雪山日"],
    note:
      "公開價格為地接安排參考起價；不含國際/國內機票、未列明正餐、個人消費與指定升級。",
    cta: "詢問這條路線",
    terms: {
      days: "天數",
      from: "起價",
      group: "成團",
      groupText: "2 人起私人成行；建議 2-6 人。",
      includesTitle: "通常包含",
      quoteTitle: "正式報價前確認",
      includes: [
        "核心路線日私人用車協調",
        "住宿參考與房型級別討論",
        "斗南花市、撈魚河、喜洲扎染、理想的花園、雲想山、雲杉坪、藍月谷等列明體驗",
        "司機兼向導協調、保險，以及適用情況下的正式當地旅遊合同",
      ],
      quoteChecks: [
        "實際出發日期、抵達城市、航班或高鐵時間",
        "住宿級別、房型、餐食需求與步行舒適度",
        "海拔舒適度、天氣緩衝，以及是否加一天慢下來",
      ],
      priceFootnote:
        "正式價格會依季節、住宿級別、票務與車輛需求確認。",
    },
    days: [
      ["第 1 天", "抵達昆明", "私人接機或接站，入住後保留一個安靜晚上。第一天先把語言、入住與移動摩擦降下來。", "住宿：昆明"],
      ["第 2 天", "斗南花市、撈魚河濕地，動車至大理", "上午走斗南花市，看春城最有生命力的顏色；再到撈魚河濕地看滇池邊的水光，下午動車前往大理。", "住宿：大理"],
      ["第 3 天", "龍龕碼頭、洱海 S 灣與喜洲古鎮", "清晨看龍龕碼頭日出，慢走或騎行洱海 S 灣；下午到喜洲古鎮，安排白族非遺扎染。", "住宿：大理"],
      ["第 4 天", "大理古城、理想的花園與雲想山日落", "上午大理古城，下午到理想的花園感受度假感，傍晚把雲想山留給日落與大理全景。", "住宿：大理"],
      ["第 5 天", "大理至麗江，候鳥灣濕地與聽花谷", "從大理前往麗江，以候鳥灣濕地與聽花谷作為柔和轉場，先不急著把麗江塞滿。", "住宿：麗江"],
      ["第 6 天", "雲杉坪、藍月谷與束河古鎮", "玉龍雪山景區以雲杉坪與藍月谷為主，下午到束河古鎮，留一個比大研更安靜的納西夜晚。", "住宿：麗江"],
      ["第 7 天", "白沙古鎮、玉湖村與動車返昆", "白沙古鎮看納西壁畫與老街，玉湖村看雪山腳下的村落感，下午動車返回昆明。", "住宿：昆明"],
      ["第 8 天", "自然醒，根據航班送機", "早上自然醒，早餐後依航班時間安排私人送機，結束昆大麗 8 天路線。", "離開日"],
    ],
    extension: {
      price: "RMB 5,490/人起",
      tiers: [
        ["2 人", "RMB 9,275/人起"],
        ["4 人", "RMB 6,438/人起"],
        ["6 人", "RMB 5,490/人起"],
      ],
      meta: ["13 天 12 晚", "RMB 5,490/人起", "2 人起私人成行", "大理 · 麗江 · 西雙版納 · 騰衝 · 芒市"],
    },
  },
  {
    lang: "ja",
    files: ["ja/yunnan/index.html"],
    cjk: true,
    canonical: "https://bluehourchina.com/ja/yunnan/",
    title: "昆明・大理・麗江 8日間",
    metaDescription:
      "雲南プライベート旅行：昆明、大理、麗江をめぐる8日7泊の標準ルート。2/4/6名の目安料金と13日間の雲南周遊プラン。",
    productDescription:
      "昆明、大理、麗江をめぐる8日7泊の雲南プライベート現地手配ルート。",
    priceCurrency: "JPY",
    schemaPrice: "86000",
    duration: "8日間 / 7泊",
    strongPrice: "JPY 86,000 から",
    priceNote: "6名様の場合の目安。2名様は JPY 187,000 から。",
    tiers: [
      ["2名", "JPY 187,000/名から"],
      ["4名", "JPY 110,000/名から"],
      ["6名", "JPY 86,000/名から"],
    ],
    eyebrow: "標準プラン",
    intro:
      "昆明で静かに入り、鉄道で大理へ。湖、白族の手仕事、麗江の村、藍月谷と玉龍雪山を急がせない位置に置く基本形です。",
    points: [
      ["ルート", "昆明 · 大理 · 麗江"],
      ["ペース", "花市場、湿地、洱海の日の出、手仕事、雪山の一日"],
      ["おすすめ", "二度目の中国で自然と快適さを求める方"],
      ["初回確認", "季節、標高、宿の好み、言語サポート"],
    ],
    mapTitle: "ルートの形",
    map: ["昆明老街と花市場", "湿地から鉄道で大理へ", "洱海の日の出と喜洲の手仕事", "麗江の村と雪山の日"],
    note: "料金は現地手配の目安です。航空券、記載外の食事、個人費用、指定アップグレードは含みません。",
    cta: "このルートを相談する",
    terms: {
      days: "日数",
      from: "料金目安",
      group: "人数",
      groupText: "2名様から個別手配。おすすめは2-6名様。",
      includesTitle: "通常含まれるもの",
      quoteTitle: "正式見積り前の確認",
      includes: ["主要日の専用車調整", "宿泊候補と部屋水準の確認", "記載された入場券と体験", "保険と現地契約の確認"],
      quoteChecks: ["旅行日、到着地、交通時間", "宿泊水準、部屋タイプ、食事、歩く量", "標高、天候の余白、休息日の有無"],
      priceFootnote: "正式料金は季節、宿泊水準、チケット、車両、現地手配先により変わります。",
    },
    days: [
      ["1日目", "昆明に到着", "専用送迎とチェックイン。初日は移動の疲れを整える静かな夜にします。", "宿泊：昆明"],
      ["2日目", "斗南花市、撈魚河湿地、鉄道で大理へ", "朝は花市場、昼は滇池近くの湿地、午後は鉄道で大理へ移動します。", "宿泊：大理"],
      ["3日目", "龍龕碼頭、洱海S湾、喜洲古鎮", "洱海の日の出、湖畔の道、喜洲の古い町と白族の藍染め体験。", "宿泊：大理"],
      ["4日目", "大理古城、理想的花園、雲想山の夕日", "古城、リゾート感のある庭園、夕方は雲想山の光へ。", "宿泊：大理"],
      ["5日目", "大理から麗江へ", "候鳥湾湿地と聴花谷を入れ、麗江に入る前に柔らかい余白を作ります。", "宿泊：麗江"],
      ["6日目", "雲杉坪、藍月谷、束河古鎮", "玉龍雪山エリアは雲杉坪と藍月谷を中心に、午後は束河で静かな夜へ。", "宿泊：麗江"],
      ["7日目", "白沙古鎮、玉湖村、鉄道で昆明へ", "白沙の古い道、玉湖村の雪山麓の風景を見て、午後は昆明へ戻ります。", "宿泊：昆明"],
      ["8日目", "自然に起きて出発", "朝は急がず、フライトに合わせて専用送迎。", "出発日"],
    ],
    extension: {
      price: "JPY 121,000 から",
      tiers: [
        ["2名", "JPY 204,000/名から"],
        ["4名", "JPY 142,000/名から"],
        ["6名", "JPY 121,000/名から"],
      ],
      meta: ["13日間 / 12泊", "JPY 121,000 から", "2名様から個別手配", "大理 · 麗江 · シーサンパンナ · 騰衝 · 芒市"],
    },
  },
  {
    lang: "ko",
    files: ["ko/yunnan/index.html"],
    cjk: true,
    canonical: "https://bluehourchina.com/ko/yunnan/",
    title: "쿤밍 · 다리 · 리장 8일",
    metaDescription:
      "윈난 개인 여행: 쿤밍, 다리, 리장을 잇는 8일 7박 표준 루트와 2/4/6명 기준 시작가, 13일 윈난 확장 루트.",
    productDescription: "쿤밍, 다리, 리장을 잇는 8일 7박 윈난 개인 현지 일정.",
    priceCurrency: "KRW",
    schemaPrice: "745000",
    duration: "8일 / 7박",
    strongPrice: "KRW 745,000 부터",
    priceNote: "6명 기준 참고가. 2명은 KRW 1,615,000 부터.",
    tiers: [
      ["2명", "KRW 1,615,000/인부터"],
      ["4명", "KRW 950,000/인부터"],
      ["6명", "KRW 745,000/인부터"],
    ],
    eyebrow: "표준 상품",
    intro: "쿤밍에서 부드럽게 시작해 기차로 다리로 이동하고, 호수와 공예, 리장 마을과 설산 하루로 이어지는 기본 일정입니다.",
    points: [
      ["루트", "쿤밍 · 다리 · 리장"],
      ["속도", "꽃시장, 습지, 얼하이 일출, 공예, 설산 하루"],
      ["추천", "두 번째 중국에서 자연과 편안함을 원하는 여행자"],
      ["첫 확인", "계절, 고도, 숙소 취향, 언어 지원"],
    ],
    mapTitle: "루트 형태",
    map: ["쿤밍 옛 거리와 꽃시장", "습지 후 기차로 다리 이동", "얼하이 일출과 시저우 공예", "리장 마을과 설산 하루"],
    note: "현지 일정 참고가입니다. 항공권, 미기재 식사, 개인 비용, 요청 업그레이드는 포함되지 않습니다.",
    cta: "이 루트 상담하기",
    terms: {
      days: "일수",
      from: "시작가",
      group: "인원",
      groupText: "2명부터 개인 일정 가능. 추천 2-6명.",
      includesTitle: "보통 포함",
      quoteTitle: "견적 전 확인",
      includes: ["핵심 일정의 전용 차량 조율", "숙소 후보와 객실 수준 논의", "기재된 입장권과 체험", "보험 및 현지 계약 확인"],
      quoteChecks: ["여행 날짜, 도착지, 이동 시간", "숙소 수준, 객실, 식사, 걷는 정도", "고도, 날씨 여유, 휴식일 필요"],
      priceFootnote: "최종 가격은 계절, 숙소, 티켓, 차량, 객실, 차량, 티켓 가능 여부에 따라 달라집니다.",
    },
    days: [
      ["1일차", "쿤밍 도착", "전용 픽업과 체크인. 첫날은 이동 피로를 낮추는 조용한 밤으로 시작합니다.", "숙박: 쿤밍"],
      ["2일차", "두난 꽃시장, 라오위허 습지, 기차로 다리", "아침 꽃시장, 낮에는 뎬츠 근처 습지, 오후에는 고속철로 다리 이동.", "숙박: 다리"],
      ["3일차", "롱칸 부두, 얼하이 S Bend, 시저우", "얼하이 일출, 호숫가 길, 시저우 옛 마을과 바이족 염색 체험.", "숙박: 다리"],
      ["4일차", "다리 고성, 이상적인 정원, 윈샹산 일몰", "고성, 휴양지 같은 정원, 저녁에는 윈샹산의 일몰.", "숙박: 다리"],
      ["5일차", "다리에서 리장으로", "후냐오완 습지와 팅화구를 넣어 리장으로 가는 전환을 부드럽게 만듭니다.", "숙박: 리장"],
      ["6일차", "윈산핑, 블루문밸리, 수허 고성", "설산 구역은 윈산핑과 블루문밸리를 중심으로, 오후는 수허에서 조용히.", "숙박: 리장"],
      ["7일차", "바이샤, 위후촌, 기차로 쿤밍", "바이샤 옛 거리와 위후촌을 본 뒤 오후에는 쿤밍으로 돌아옵니다.", "숙박: 쿤밍"],
      ["8일차", "여유롭게 출발", "아침은 서두르지 않고 항공편 시간에 맞춰 전용 이동.", "출발일"],
    ],
    extension: {
      price: "KRW 1,043,000 부터",
      tiers: [
        ["2명", "KRW 1,762,000/인부터"],
        ["4명", "KRW 1,223,000/인부터"],
        ["6명", "KRW 1,043,000/인부터"],
      ],
      meta: ["13일 / 12박", "KRW 1,043,000 부터", "2명부터 개인 일정", "다리 · 리장 · 시솽반나 · 텅충 · 망시"],
    },
  },
  {
    lang: "th",
    files: ["th/yunnan/index.html"],
    cjk: false,
    canonical: "https://bluehourchina.com/th/yunnan/",
    title: "Kunming · Dali · Lijiang in 8 days",
    metaDescription:
      "Private Yunnan route in Thai: 8 days through Kunming, Dali and Lijiang with 2/4/6 traveller starting prices and a 13-day deeper Yunnan option.",
    productDescription: "8-day private Yunnan land route through Kunming, Dali and Lijiang.",
    priceCurrency: "THB",
    schemaPrice: "17700",
    duration: "8 วัน / 7 คืน",
    strongPrice: "เริ่มที่ THB 17,700",
    priceNote: "อ้างอิงสำหรับ 6 ท่าน; 2 ท่านเริ่มที่ THB 38,300.",
    tiers: [
      ["2 ท่าน", "THB 38,300/ท่าน"],
      ["4 ท่าน", "THB 22,500/ท่าน"],
      ["6 ท่าน", "THB 17,700/ท่าน"],
    ],
    eyebrow: "เส้นทางมาตรฐาน",
    intro:
      "A practical Yunnan route: begin softly in Kunming, take the train to Dali, then end with Lijiang villages, Blue Moon Valley and one carefully paced snow-mountain day.",
    points: [
      ["Route", "Kunming · Dali · Lijiang"],
      ["Pace", "Flower market, wetland, Erhai sunrise, craft, one mountain day"],
      ["Best for", "Second-time China travellers who want nature and comfort"],
      ["First review", "Season, altitude, hotel style and language help"],
    ],
    mapTitle: "Route shape",
    map: ["Kunming old street and flowers", "Wetland, then rail to Dali", "Erhai sunrise and Xizhou craft", "Lijiang villages and snow mountain"],
    note: "Starting prices are land-arrangement references. Flights, unlisted meals, personal expenses and upgrades are not included.",
    cta: "Ask about this route",
    terms: {
      days: "วัน",
      from: "ราคาเริ่มต้น",
      group: "กลุ่ม",
      groupText: "เริ่มจัดแบบส่วนตัวตั้งแต่ 2 ท่าน แนะนำ 2-6 ท่าน",
      includesTitle: "โดยทั่วไปครอบคลุม",
      quoteTitle: "ยืนยันก่อนเสนอราคา",
      includes: ["รถส่วนตัวในวันหลัก", "หารือที่พักและระดับห้อง", "บัตรและประสบการณ์ที่ระบุ", "ประกันและสัญญาท้องถิ่นเมื่อเหมาะสม"],
      quoteChecks: ["วันที่เดินทาง เมืองที่มาถึง เวลาเดินทาง", "ระดับที่พัก ห้อง อาหาร และการเดิน", "ความสบายเรื่องความสูง อากาศ และวันพัก"],
      priceFootnote: "ราคาจริงขึ้นอยู่กับฤดูกาล ที่พัก บัตร รถ และทีมบริการในพื้นที่",
    },
    days: [
      ["Day 1", "Arrive in Kunming", "Private pickup, check-in and a quiet first evening.", "Stay: Kunming"],
      ["Day 2", "Dounan flowers, Laoyuhe wetland and rail to Dali", "Flower market, wetland light near Dianchi, then rail to Dali.", "Stay: Dali"],
      ["Day 3", "Longkan sunrise, Erhai S Bend and Xizhou", "Lake sunrise, Erhai road and Xizhou tie-dye craft.", "Stay: Dali"],
      ["Day 4", "Dali Old Town, Ideal Garden and Yunxiang sunset", "Old town, resort garden mood and Yunxiang Mountain sunset.", "Stay: Dali"],
      ["Day 5", "Dali to Lijiang", "Hou Niao Wan Wetland and Tinghua Valley as a soft bridge into Lijiang.", "Stay: Lijiang"],
      ["Day 6", "Yunshanping, Blue Moon Valley and Shuhe", "Snow-mountain area, blue water and a quieter Naxi evening in Shuhe.", "Stay: Lijiang"],
      ["Day 7", "Baisha, Yuhu Village and rail to Kunming", "Baisha Old Town, Yuhu Village below the mountain, then rail back to Kunming.", "Stay: Kunming"],
      ["Day 8", "Private departure", "Wake slowly and transfer privately according to flight time.", "Departure day"],
    ],
    extension: {
      price: "เริ่มที่ THB 24,700",
      tiers: [
        ["2 ท่าน", "THB 41,700/ท่าน"],
        ["4 ท่าน", "THB 29,000/ท่าน"],
        ["6 ท่าน", "THB 24,700/ท่าน"],
      ],
      meta: ["13 วัน / 12 คืน", "เริ่มที่ THB 24,700", "เริ่มจัดแบบส่วนตัวตั้งแต่ 2 ท่าน", "Dali · Lijiang · Xishuangbanna · Tengchong · Mangshi"],
    },
  },
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cjkTitle(page, text) {
  if (!page.cjk) return esc(text);
  const durationBreak = String(text).match(/^(.*)\s+(\d.*)$/);
  if (durationBreak) {
    return durationBreak.slice(1).map((part) => `<span class="title-line">${esc(part)}</span>`).join("");
  }
  return `<span class="title-line">${esc(text)}</span>`;
}

function replaceBetween(html, start, end, replacement, file) {
  const pattern = new RegExp(`${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`);
  if (!pattern.test(html)) throw new Error(`Missing block ${start} in ${file}`);
  return html.replace(pattern, `${start}\n${replacement}\n${end}`);
}

function moveBlockAfterHero(html, start, end, file) {
  const blockPattern = new RegExp(`[\\t ]*${start.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\s\\S]*?${end.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[\\t ]*`);
  const matchedBlock = html.match(blockPattern)?.[0];
  if (!matchedBlock) throw new Error(`Missing movable block ${start} in ${file}`);
  const block = matchedBlock.trim();
  const withoutBlock = html.replace(blockPattern, "");
  const heroStart = withoutBlock.indexOf('<section class="hero destination-hero">');
  const heroEnd = withoutBlock.indexOf("</section>", heroStart);
  if (heroStart < 0 || heroEnd < 0) throw new Error(`Missing destination hero in ${file}`);
  const insertAt = heroEnd + "</section>".length;
  return `${withoutBlock.slice(0, insertAt)}\n\n    ${block}${withoutBlock.slice(insertAt)}`;
}

function setMeta(html, name, content) {
  const pattern = new RegExp(`<meta name="${name}" content="[^"]*">`);
  return html.replace(pattern, `<meta name="${name}" content="${esc(content)}">`);
}

function setOg(html, property, content) {
  const pattern = new RegExp(`<meta property="${property}" content="[^"]*">`);
  return html.replace(pattern, `<meta property="${property}" content="${esc(content)}">`);
}

function productSchema(page) {
  return `<script type="application/ld+json">
${JSON.stringify(
  {
    "@context": "https://schema.org",
    "@type": "Product",
    name: page.title,
    brand: { "@type": "Brand", name: "Bluehour China Journeys" },
    category: "Private China travel planning",
    inLanguage: page.lang,
    description: page.productDescription,
    image: `https://bluehourchina.com${yunnanBaseImage}`,
    url: page.canonical,
    offers: {
      "@type": "Offer",
      priceCurrency: page.priceCurrency,
      price: page.schemaPrice,
      url: page.canonical,
      availability: "https://schema.org/InStock",
    },
    additionalProperty: [
      { "@type": "PropertyValue", name: "Duration", value: page.duration },
      { "@type": "PropertyValue", name: "Route", value: page.points[0][1] },
      { "@type": "PropertyValue", name: "Minimum private group", value: "2 travellers" },
      { "@type": "PropertyValue", name: "Starting price tiers", value: page.tiers.map((tier) => tier.join(" ")).join(" · ") },
    ],
  },
  null,
  2,
)}
</script>`;
}

function visualRouteCopy(page) {
  const shared = {
    images: [fieldTrainImage, yunnanBaseImage, lijiangImage, snowImage],
    dayPairs: [
      [page.days[0], page.days[1]],
      [page.days[2], page.days[3]],
      [page.days[4], page.days[5]],
      [page.days[6], page.days[7]],
    ],
  };

  if (page.lang === "zh-Hant") {
    return {
      ...shared,
      eyebrow: "全程路線圖",
      title: "8 天怎麼走 一眼先看懂",
      intro: "先看城市與轉場，再看每天的細節。這條線從昆明落地，往西進大理與麗江，最後回昆明離境。",
      path: "昆明 → 大理 → 麗江 → 昆明",
      days: ["第 1–2 天", "第 3–4 天", "第 5–6 天", "第 7–8 天"],
      cities: ["昆明 → 大理", "大理", "大理 → 麗江", "麗江 → 昆明"],
      modes: ["接機 · 動車", "洱海周邊私人用車", "私人轉場 · 雪山區用車", "動車返昆 · 送機"],
    };
  }

  if (page.lang === "ja") {
    return {
      ...shared,
      eyebrow: "全行程マップ",
      title: "8日間の流れをひと目で",
      intro: "まず都市間の移動を見て、その後に毎日の詳細へ。昆明から大理、麗江へ進み、昆明に戻ります。",
      path: "昆明 → 大理 → 麗江 → 昆明",
      days: ["1–2日目", "3–4日目", "5–6日目", "7–8日目"],
      cities: ["昆明 → 大理", "大理", "大理 → 麗江", "麗江 → 昆明"],
      modes: ["到着送迎 · 高速鉄道", "洱海周辺の専用車", "専用車移動 · 雪山エリア", "高速鉄道 · 空港送迎"],
    };
  }

  if (page.lang === "ko") {
    return {
      ...shared,
      eyebrow: "전체 루트 맵",
      title: "8일의 이동을 한눈에",
      intro: "도시 이동을 먼저 보고 하루 일정으로 내려갑니다. 쿤밍에서 다리와 리장으로 이동한 뒤 쿤밍으로 돌아옵니다.",
      path: "쿤밍 → 다리 → 리장 → 쿤밍",
      days: ["1–2일차", "3–4일차", "5–6일차", "7–8일차"],
      cities: ["쿤밍 → 다리", "다리", "다리 → 리장", "리장 → 쿤밍"],
      modes: ["도착 픽업 · 고속철", "얼하이 전용 차량", "전용 이동 · 설산 구역", "고속철 · 공항 이동"],
    };
  }

  if (page.lang === "th") {
    return {
      ...shared,
      eyebrow: "แผนที่เส้นทางทั้งหมด",
      title: "See the full 8-day flow at a glance",
      intro: "Start with the city sequence, then open the daily detail: Kunming to Dali and Lijiang, returning to Kunming for departure.",
      path: "Kunming → Dali → Lijiang → Kunming",
      days: ["Days 1–2", "Days 3–4", "Days 5–6", "Days 7–8"],
      cities: ["Kunming → Dali", "Dali", "Dali → Lijiang", "Lijiang → Kunming"],
      modes: ["Arrival pickup · high-speed rail", "Private vehicle around Erhai", "Private transfer · mountain vehicle", "Rail return · airport transfer"],
    };
  }

  return {
    ...shared,
    eyebrow: "Full route map",
    title: "See the whole 8-day journey first",
    intro: "Start with the city sequence, then open the daily detail: land in Kunming, move west through Dali and Lijiang, then return to Kunming for departure.",
    path: "Kunming → Dali → Lijiang → Kunming",
    days: ["Days 1–2", "Days 3–4", "Days 5–6", "Days 7–8"],
    cities: ["Kunming → Dali", "Dali", "Dali → Lijiang", "Lijiang → Kunming"],
    modes: ["Arrival pickup · high-speed rail", "Private vehicle around Erhai", "Private transfer · mountain vehicle", "Rail return · airport transfer"],
  };
}

function visualRoute(page) {
  const route = visualRouteCopy(page);
  const stages = route.dayPairs
    .map(
      (pair, index) => `<article class="visual-route-stage">
        <figure>
          <img src="${route.images[index]}" alt="${esc(`${route.days[index]} ${route.cities[index]}`)}">
          <figcaption><span>${esc(route.days[index])}</span><strong>${esc(route.cities[index])}</strong></figcaption>
        </figure>
        <div class="visual-route-stage-copy">
          <b>${esc(route.modes[index])}</b>
          <ul><li>${esc(pair[0][1])}</li><li>${esc(pair[1][1])}</li></ul>
        </div>
      </article>`,
    )
    .join("");
  const stops = route.cities
    .map((city, index) => `<li><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(city)}</strong><small>${esc(route.days[index])}</small></li>`)
    .join("");

  return `<section class="visual-route-overview" id="route-map" aria-label="${esc(route.eyebrow)}">
    <div class="visual-route-heading">
      <div><p class="eyebrow">${esc(route.eyebrow)}</p><h3>${esc(route.title)}</h3></div>
      <div>
        <p>${esc(route.intro)}</p>
        <strong class="visual-route-path">${esc(route.path)}</strong>
        <div class="visual-route-offer"><span>${esc(page.duration)}</span><strong>${esc(page.strongPrice)}</strong><small>${esc(page.terms.groupText)}</small></div>
      </div>
    </div>
    <ol class="visual-route-rail">${stops}</ol>
    <div class="visual-route-grid">${stages}</div>
  </section>`;
}

function extensionStages(page) {
  if (page.lang === "zh-Hant") {
    return [
      ["D1-2", "大理", "湖邊節奏、田野小火車、村路與柔和落地。"],
      ["D3-4", "麗江", "雲杉坪、藍月谷與古鎮夜晚，依海拔安排節奏。"],
      ["D5-7", "西雙版納", "雨林、傣族文化、植物園與熱帶餐桌。"],
      ["D8-10", "騰衝", "濕地、溫泉、火山地貌與和順手作。"],
      ["D11-13", "芒市", "佛塔光線、邊地文化與私人送機。"],
    ];
  }
  if (page.lang === "ja") {
    return [
      ["D1-2", "大理", "湖畔、田園列車、村道から静かに始めます。"],
      ["D3-4", "麗江", "雲杉坪、藍月谷、古城の夜を標高に合わせて。"],
      ["D5-7", "シーサンパンナ", "熱帯雨林、タイ族文化、植物園と食卓。"],
      ["D8-10", "騰衝", "湿地、温泉、火山景観と和順の手仕事。"],
      ["D11-13", "芒市", "仏塔の光、国境文化、専用送迎で出発。"],
    ];
  }
  if (page.lang === "ko") {
    return [
      ["D1-2", "다리", "호숫가, 들판 열차, 마을길로 부드럽게 시작합니다."],
      ["D3-4", "리장", "윈산핑, 블루문밸리, 고성의 밤을 고도에 맞춥니다."],
      ["D5-7", "시솽반나", "열대우림, 다이족 문화, 식물원과 현지 식사."],
      ["D8-10", "텅충", "습지, 온천, 화산 지형과 허순의 공예."],
      ["D11-13", "망시", "불탑의 빛, 국경 문화, 전용 출발 이동."],
    ];
  }
  if (page.lang === "th") {
    return [
      ["D1-2", "Dali", "จังหวะริมทะเลสาบ รถไฟกลางทุ่ง ถนนหมู่บ้าน และการเริ่มต้นอย่างนุ่มนวล"],
      ["D3-4", "Lijiang", "Yunshanping, Blue Moon Valley และค่ำคืนในเมืองเก่า โดยคำนึงถึงระดับความสูง"],
      ["D5-7", "Xishuangbanna", "ป่าฝน วัฒนธรรมไท สวนพฤกษศาสตร์ และอาหารเขตร้อน"],
      ["D8-10", "Tengchong", "พื้นที่ชุ่มน้ำ น้ำพุร้อน ภูมิประเทศภูเขาไฟ และงานฝีมือเหอซุ่น"],
      ["D11-13", "Mangshi", "แสงจากเจดีย์ วัฒนธรรมชายแดน และรถรับส่งส่วนตัวในวันเดินทางกลับ"],
    ];
  }
  return [
    ["D1-2", "Dali", "Lake rhythm, field train, village roads and a softer landing."],
    ["D3-4", "Lijiang", "Yunshanping, Blue Moon Valley and old-town evenings paced around altitude."],
    ["D5-7", "Xishuangbanna", "Rainforest, Dai culture, botanical garden and tropical meals."],
    ["D8-10", "Tengchong", "Wetland, hot springs, volcano landscape and Heshun craft time."],
    ["D11-13", "Mangshi", "Pagoda light, borderland texture and private departure transfer."],
  ];
}

function standardRoute(page, file) {
  const ctaHref = file.startsWith("zh/") || file.includes("/zh/")
    ? "/zh/interest/?utm_source=standard_route&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=yunnan"
    : file.startsWith("ja/") || file.includes("/ja/")
      ? "/ja/interest/?utm_source=standard_route&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=yunnan"
      : file.startsWith("ko/") || file.includes("/ko/")
        ? "/ko/interest/?utm_source=standard_route&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=yunnan"
        : file.startsWith("th/") || file.includes("/th/")
          ? "/th/interest/?utm_source=standard_route&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=yunnan"
          : "/interest.html?utm_source=standard_route&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=yunnan";
  return `
    <section class="section standard-route-band" id="standard-route">
      <div class="wrap">
      ${visualRoute(page)}
      <div class="route-showcase">
        <div class="route-copy">
          <p class="eyebrow">${esc(page.eyebrow)}</p>
          <h2${page.cjk ? ' class="cjk-title"' : ""}>${cjkTitle(page, page.title)}</h2>
          <p>${esc(page.intro)}</p>
          <div class="route-price">
            <span>${esc(page.duration)}</span>
            <strong>${esc(page.strongPrice)}</strong>
            <small>${esc(page.priceNote)}</small>
            <div class="route-price-tiers">${page.tiers
              .map((tier) => `<div><b>${esc(tier[0])}</b><span>${esc(tier[1])}</span></div>`)
              .join("")}</div>
          </div>
          <div class="route-points">${page.points
            .map((point) => `<div><b>${esc(point[0])}</b><span>${esc(point[1])}</span></div>`)
            .join("")}</div>
          <p class="route-note">${esc(page.note)}</p>
          <div class="route-meta"><span>Kunming</span><span>Dali</span><span>Lijiang</span></div>
          <div class="hero-actions">
            <a class="btn primary dark-gold" href="${ctaHref}">${esc(page.cta)}</a>
          </div>
        </div>
        <div class="route-card" aria-label="${esc(page.title)}">
          <div class="route-image"><img src="${yunnanBaseImage}" alt="${esc(page.title)}"></div>
          <div class="route-map route-photo-caption">
            <h3>${esc(page.mapTitle)}</h3>
            <p>${esc(page.map[2])}</p>
          </div>
        </div>
      </div>
      </div>
    </section>`;
}

function dayPlan(page, file) {
  const localePrefix = file.startsWith("zh/") || file.includes("/zh/")
    ? "/zh"
    : file.startsWith("ja/") || file.includes("/ja/")
      ? "/ja"
      : file.startsWith("ko/") || file.includes("/ko/")
        ? "/ko"
        : file.startsWith("th/") || file.includes("/th/")
          ? "/th"
          : "";
  const interest = `${localePrefix}/interest/`.replace("//", "/");
  const loopHref = localePrefix === "/zh" ? "/zh/yunnan-grand-loop/" : "/yunnan-grand-loop/";
  const extensionItems = extensionStages(page)
    .map((stage) => `<article><b>${esc(stage[0])}</b><h3>${esc(stage[1])}</h3><p>${esc(stage[2])}</p></article>`)
    .join("");
  const dayItems = page.days
    .map(
      (day) => `<article class="route-day-item">
        <div class="route-day-index">${esc(day[0])}</div>
        <div class="route-day-copy">
          <h3>${esc(day[1])}</h3>
          <p>${esc(day[2])}</p>
          <span>${esc(day[3])}</span>
        </div>
      </article>`,
    )
    .join("");
  return `
    <section class="section route-day-plan-band" id="day-plan">
      <div class="wrap route-day-plan-wrap">
        <div class="route-day-head">
          <div>
            <p class="eyebrow">${page.lang === "zh-Hant" ? "標準方案日程" : page.lang === "ja" ? "標準日程" : page.lang === "ko" ? "표준 일정" : page.lang === "th" ? "แผนรายวันมาตรฐาน" : "Standard day plan"}</p>
            <h2${page.cjk ? ' class="cjk-title"' : ""}>${cjkTitle(page, page.title)}</h2>
            <p>${esc(page.terms.priceFootnote)}</p>
          </div>
          <div class="route-terms">
            <div><b>${esc(page.terms.days)}</b><span>${esc(page.duration)}</span></div>
            <div><b>${esc(page.terms.from)}</b><span>${esc(page.strongPrice)}</span></div>
            <div><b>${esc(page.terms.group)}</b><span>${esc(page.terms.groupText)}</span></div>
          </div>
        </div>
        <div class="route-day-layout">
          <div class="route-day-list">${dayItems}</div>
          <aside class="route-visual-panel" aria-label="${esc(page.mapTitle)}">
            <figure>
              <img src="${yunnanBaseImage}" alt="${esc(page.title)}">
              <figcaption>${esc(page.map.join(" · "))}</figcaption>
            </figure>
            <ul class="route-visual-notes"><li><b>01</b><span>${esc(page.map[0])}</span></li><li><b>02</b><span>${esc(page.map[2])}</span></li><li><b>03</b><span>${esc(page.map[3])}</span></li></ul>
            <div class="route-inclusion-grid">
              <section>
                <h3>${esc(page.terms.includesTitle)}</h3>
                <ul>${page.terms.includes.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
              </section>
              <section>
                <h3>${esc(page.terms.quoteTitle)}</h3>
                <ul>${page.terms.quoteChecks.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
              </section>
            </div>
            <p class="route-note">${esc(page.note)}</p>
            <a class="btn primary dark-gold" href="${interest}?utm_source=route_day_plan&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=yunnan">${esc(page.cta)}</a>
          </aside>
        </div>
        <section class="route-extension">
          <div class="route-extension-copy">
            <p class="eyebrow">${page.lang === "zh-Hant" ? "延伸方案" : page.lang === "ja" ? "延長プラン" : page.lang === "ko" ? "확장 옵션" : page.lang === "th" ? "ตัวเลือกเชิงลึก" : "Deeper Yunnan option"}</p>
            <h2>${page.lang === "zh-Hant" ? "雲南全境慢線" : "Grand Yunnan Loop"}</h2>
            <p>${page.lang === "zh-Hant" ? "13 天 12 晚加入西雙版納、騰衝與芒市，適合不想把雲南停在大理麗江的旅人。" : "A 13-day route that adds Xishuangbanna, Tengchong and Mangshi for travellers who want Yunnan to feel complete."}</p>
            <div class="route-extension-meta">${page.extension.meta.map((item) => `<span>${esc(item)}</span>`).join("")}</div>
          </div>
          <div class="route-extension-price-visual">
            <figure>
              <img src="${fieldTrainImage}" alt="${esc(page.lang === "zh-Hant" ? "雲南全境慢線" : "Grand Yunnan Loop")}">
              <figcaption><span>${esc(page.extension.price)}</span><strong>${esc(page.lang === "zh-Hant" ? "雲南全境慢線" : "Grand Yunnan Loop")}</strong></figcaption>
            </figure>
            <div class="route-extension-price-overlay">${page.extension.tiers
              .map((tier) => `<div><b>${esc(tier[0])}</b><span>${esc(tier[1])}</span></div>`)
              .join("")}</div>
            <div class="route-extension-gallery"><figure><img src="${snowImage}" alt="Yunnan snow mountain"></figure><figure><img src="${yunnanBaseImage}" alt="Dali lakeside table"></figure><figure><img src="${dyeImage}" alt="Yunnan craft"></figure></div>
          </div>
          <div class="route-extension-grid">${extensionItems}</div>
          <div class="route-extension-actions"><a class="btn primary dark-gold" href="${loopHref}">${page.lang === "zh-Hant" ? "看完整 13 天方案" : "See the full 13-day route"}</a><a class="btn" href="${interest}?utm_source=route_extension&amp;utm_medium=site&amp;utm_campaign=private_route_consultation&amp;destination=yunnan-grand-loop">${esc(page.cta)}</a></div>
        </section>
      </div>
    </section>`;
}

function updateYunnanPage(file, page) {
  let html = fs.readFileSync(file, "utf8");
  html = setMeta(html, "description", page.metaDescription);
  html = setOg(html, "og:description", page.metaDescription);
  html = replaceBetween(html, "<!-- route-product-schema-start -->", "<!-- route-product-schema-end -->", productSchema(page), file);
  html = replaceBetween(html, "<!-- standard-route-start -->", "<!-- standard-route-end -->", standardRoute(page, file), file);
  html = replaceBetween(html, "<!-- route-day-plan-start -->", "<!-- route-day-plan-end -->", dayPlan(page, file), file);
  html = moveBlockAfterHero(html, "<!-- standard-route-start -->", "<!-- standard-route-end -->", file);
  html = html.replaceAll("7-day Dali, Shaxi and Lijiang", "8-day Kunming, Dali and Lijiang");
  html = html.replaceAll("一週大理、沙溪、麗江", "8 天 7 晚昆明、大理、麗江");
  html = html.replaceAll("大理、沙溪、麗江或白沙", "昆明、大理、麗江");
  html = html.replaceAll("Dali, Shaxi and Lijiang or Baisha", "Kunming, Dali and Lijiang");
  html = cleanOldYunnanStory(html, file);
  html = html.replace(/[ \t]+$/gm, "");
  fs.writeFileSync(file, html);
  console.log(`deepened ${file}`);
}

function cleanOldYunnanStory(html, file) {
  if (file.includes("zh/yunnan")) {
    html = html.replaceAll(
      "一週的時間，先給洱海的風，再給沙溪的夜，最後把玉龍雪山放在遠處，不急著佔有。",
      "8 天 7 晚，先讓昆明把旅人安放好，再進大理的湖與手作，最後把麗江雪山留給天氣與體力都剛好的那一天。",
    );
    html = html.replaceAll(
      '<div class="facts"><div class="fact"><b>湖光</b><span>大理與洱海的清晨</span></div><div class="fact"><b>古鎮</b><span>沙溪留一個夜晚</span></div><div class="fact"><b>雪線</b><span>麗江或白沙遠望雪山</span></div></div>',
      '<div class="facts"><div class="fact"><b>花市</b><span>昆明與斗南的第一天</span></div><div class="fact"><b>湖光</b><span>大理與洱海日出</span></div><div class="fact"><b>雪線</b><span>麗江、白沙與玉湖村</span></div></div>',
    );
    html = html.replaceAll(
      '<div class="copy-stack"><article class="copy-block"><b>清晨</b><h3>大理從水與風裡醒來</h3><p>好的雲南路線不該一早趕路。它要留給湖面、村路與一間偶然遇見的咖啡館。</p></article><article class="copy-block"><b>夜晚</b><h3>沙溪最好留到人潮退去之後</h3><p>住得近一些，才能慢慢走回去。那種小而暖的古意，不適合匆匆看完。</p></article><article class="copy-block"><b>遠方</b><h3>雪山應該在地平線上</h3><p>麗江與白沙要有克制：一個清楚的遠望，一頓好飯，足夠的時間，不把山變成清單。</p></article></div>',
      '<div class="copy-stack"><article class="copy-block"><b>抵達</b><h3>昆明先把旅人安放好</h3><p>花市、老街與濕地，不是為了填滿第一天，而是讓外國旅人先適應中國的節奏。</p></article><article class="copy-block"><b>湖邊</b><h3>大理要有日出與手作</h3><p>龍龕、洱海 S 灣與喜洲扎染，把風景從照片變成可以帶走的觸感。</p></article><article class="copy-block"><b>遠方</b><h3>雪山日必須留有餘地</h3><p>雲杉坪、藍月谷、白沙與玉湖村都要看天氣與體力，不把山排成硬清單。</p></article></div>',
    );
    html = html.replaceAll(
      "公開路線先給一個清楚形狀：一週，大理 · 沙溪 · 麗江或白沙，RMB 5,680 起。真正重要的是判斷這個形狀是否適合同行的人。",
      "公開路線先給一個清楚形狀：8 天 7 晚，昆明 · 大理 · 麗江，6 人 RMB 3,917/人起，2 人 RMB 8,500/人起。真正重要的是判斷這個形狀是否適合同行的人。",
    );
    html = html.replaceAll(
      "大理、沙溪、麗江是否都要放入，還是保留更慢的空白。",
      "昆明、大理、麗江三段是否剛好，或是否要加一日緩衝。",
    );
    html = html.replaceAll(
      "一週是乾淨的起點。大理、沙溪、麗江或白沙可以有完整節奏，太短會把最迷人的夜晚刪掉。",
      "8 天 7 晚是更穩的起點。昆明、大理、麗江可以把抵達、湖邊、手作、雪山與返程排得比較舒服。",
    );
    html = html.replaceAll("確認雲南慢路線前", "確認昆大麗 8 天路線前");
    html = html.replaceAll(
      "一週是乾淨的起點。昆明、大理、麗江可以有完整節奏，太短會把最迷人的夜晚刪掉。",
      "8 天 7 晚是更穩的起點。昆明、大理、麗江可以把抵達、湖邊、手作、雪山與返程排得比較舒服。",
    );
  } else if (file.includes("ja/yunnan")) {
    html = html.replaceAll(
      "洱海の風、沙溪の夜、麗江の外に見える雪の線。急がず、触れすぎず、余韻を残す旅です。",
      "昆明で整え、大理の湖と手仕事へ進み、麗江の村と雪山を最後に置く8日間です。",
    );
    html = html.replaceAll("沙溪に一泊する", "喜洲の手仕事");
    html = html.replaceAll(
      '<div class="copy-stack"><article class="copy-block"><b>朝</b><h3>大理は水と風から始まる</h3><p>よい雲南の旅は、朝から急ぎません。湖、村道、偶然見つけた店のために余白を残します。</p></article><article class="copy-block"><b>夜</b><h3>沙溪は人波が去ったあとが美しい</h3><p>近くに泊まるから、ゆっくり歩いて帰れる。小さく、あたたかく、古い時間が残ります。</p></article><article class="copy-block"><b>遠景</b><h3>雪山は地平線に置いておく</h3><p>麗江と白沙は控えめに。一つの眺め、一つの食事、山をリストにしない時間。</p></article></div>',
      '<div class="copy-stack"><article class="copy-block"><b>到着</b><h3>昆明で旅の摩擦を下げる</h3><p>花市場、古い通り、湿地の光で、中国に着いたばかりの身体を静かに整えます。</p></article><article class="copy-block"><b>湖畔</b><h3>大理は朝と手仕事で記憶に残る</h3><p>龍龕、洱海S湾、喜洲の藍染めが、景色を写真ではなく手触りに変えます。</p></article><article class="copy-block"><b>遠景</b><h3>雪山の日には余白がいる</h3><p>雲杉坪、藍月谷、白沙、玉湖村は、天候と体力に合わせて静かに置きます。</p></article></div>',
    );
    html = html.replaceAll("7日間がよい出発点です。大理、沙溪、麗江または白沙を急がずにつなげられます。", "8日間がよい出発点です。昆明、大理、麗江を無理なくつなげられます。");
    html = html.replaceAll("公開ルートは最初の形です。7日間、大理 · 沙溪 · 麗江または白沙、JPY 205,000 から。本当に大切なのは、その形が旅する人に合うかどうかです。", "公開ルートは最初の形です。8日間、昆明 · 大理 · 麗江、JPY 86,000 から。本当に大切なのは、その形が旅する人に合うかどうかです。");
    html = html.replaceAll("大理、沙溪、麗江をすべて入れるか、もっとゆっくり残すか。", "昆明、大理、麗江をこのままつなぐか、予備日を加えるか。");
    html = html.replaceAll("雲南スロー・ルートを決める前に", "昆明・大理・麗江 8日間を決める前に");
  } else {
    html = html.replaceAll("Reference from price", "Reference starting price");
    html = html.replaceAll("One quiet night in Shaxi", "Xizhou craft and lake sunrise");
    html = html.replaceAll("Shaxi is best after the tour buses leave", "Xizhou craft makes the route tangible");
    html = html.replaceAll("Stay close enough to walk back slowly. The feeling is small, warm and quietly ancient.", "The point is not to add another stop. It is to let Bai craft, lake light and old lanes become something the traveller can remember.");
    html = html.replaceAll(
      "The public route gives the shape: 7 days, Dali · Shaxi · Lijiang or Baisha, from US$1,250 per traveller for land arrangements. The real work is deciding whether that shape fits the people travelling.",
      "The public route gives the shape: 8 days / 7 nights, Kunming · Dali · Lijiang, from US$545 pp for 6 travellers and from US$1,180 pp for 2 travellers. The real work is deciding whether that shape fits the people travelling.",
    );
    html = html.replaceAll(
      "Whether Dali, Shaxi and Lijiang should all be included, or whether the route should stay slower.",
      "Whether Kunming, Dali and Lijiang should stay at this pace, or whether the group needs a buffer day.",
    );
    html = html.replaceAll("What we would check before confirming Yunnan Slow Road", "What we would check before confirming the Yunnan Soft Landing Route");
    html = html.replaceAll(
      "Seven days is a clean starting point for Kunming, Dali and Lijiang. Shorter routes feel possible but lose the quiet night that makes Yunnan memorable.",
      "Eight days and seven nights is the steadier starting point for Kunming, Dali and Lijiang, with room for arrival, lake time, craft, one mountain day and an unhurried return.",
    );
    html = html.replaceAll("윈난 슬로우 루트 확정 전", "쿤밍 · 다리 · 리장 8일 확정 전");
    html = html.replaceAll("เส้นทางช้าในยูนนาน", "Kunming · Dali · Lijiang in 8 days");
  }
  return html;
}

for (const page of localePages) {
  for (const file of page.files) updateYunnanPage(file, page);
}

function updateGrandLoop(file, replacements) {
  let html = fs.readFileSync(file, "utf8");
  for (const [from, to] of replacements) {
    html = html.replaceAll(from, to);
  }
  fs.writeFileSync(file, html);
  console.log(`priced ${file}`);
}

updateGrandLoop("yunnan-grand-loop/index.html", [
  ["from US$1,350 per traveller for two travellers", "from US$765 per traveller for six travellers; US$1,290 pp for two travellers"],
  ["US$1,350 pp for 2 travellers", "US$1,290 pp for 2 travellers"],
  ["US$1,350 pp", "US$1,290 pp"],
  ["US$1,075 pp", "US$895 pp"],
  ["US$950 pp", "US$765 pp"],
]);

updateGrandLoop("zh/yunnan-grand-loop/index.html", [
  ["2 人 RMB 9,800/人起，4 人 RMB 7,800/人起，6 人 RMB 6,900/人起", "2 人 RMB 9,275/人起，4 人 RMB 6,438/人起，6 人 RMB 5,490/人起"],
  ["2 人 RMB 9,800/人起", "2 人 RMB 9,275/人起"],
  ["RMB 9,800/人起", "RMB 9,275/人起"],
  ["RMB 7,800/人起", "RMB 6,438/人起"],
  ["RMB 6,900/人起", "RMB 5,490/人起"],
]);
