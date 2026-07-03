import fs from "node:fs";

const root = new URL("../", import.meta.url);

const destinations = {
  yunnan: {
    file: "yunnan",
    image: "/assets/ai/bluehour-yunnan-luxury-shaxi-courtyard.jpg",
    en: {
      eyebrow: "Standard route",
      title: "Yunnan Slow Road",
      intro: "A clear first route for guests who want Yunnan to feel calm, beautiful and manageable: lake wind in Dali, one quiet night in Shaxi, then Lijiang or Baisha with the snow mountain kept at a respectful distance.",
      days: "7 days",
      price: "From NT$39,800",
      priceNote: "per traveller, land arrangement from price",
      points: [
        ["Route", "Dali · Shaxi · Lijiang or Baisha"],
        ["Pace", "Old towns, lake mornings and a soft snow-mountain finish"],
        ["Best for", "Couples, families and friends who want a gentle second China"],
        ["First review", "Season, group size, room style and language needs"],
      ],
      mapTitle: "Route shape",
      map: ["Dali and Erhai mornings", "Shaxi old-town night", "Lijiang or Baisha snow view", "Private route review"],
      note: "Price excludes international flights and may change with season, hotel level, group size, vehicle needs and local-provider availability.",
      cta: "Ask about this route",
      tags: ["Lake", "Old town", "Snow mountain"],
    },
    zh: {
      eyebrow: "標準路線",
      title: "雲南慢路線",
      intro: "給第一次走進深度雲南的客人一個清楚基本盤：大理的湖風、沙溪的一個夜晚，再把麗江或白沙的雪山放在遠處。",
      days: "一週",
      price: "NT$39,800 起",
      priceNote: "每人，地接安排起價",
      points: [
        ["路線", "大理 · 沙溪 · 麗江或白沙"],
        ["節奏", "湖邊清晨、古鎮夜晚、雪山遠望"],
        ["適合", "情侶、家庭、朋友小團的第二次中國"],
        ["初談", "先確認季節、人數、住宿感與語言需求"],
      ],
      mapTitle: "路線形狀",
      map: ["大理與洱海清晨", "沙溪古鎮留宿", "麗江或白沙遠望雪山", "私人路線初談"],
      note: "價格不含國際機票；正式價格依季節、住宿級別、人數、車輛需求與當地服務商承接狀況調整。",
      cta: "詢問這條路線",
      tags: ["湖光", "古鎮", "雪山"],
    },
    ja: {
      eyebrow: "標準ルート",
      title: "雲南スロー・ルート",
      intro: "雲南を穏やかに感じるための基本形です。大理の湖風、沙溪の一泊、そして麗江または白沙から望む雪山へ。",
      days: "7日間",
      price: "NT$39,800 から",
      priceNote: "1名様あたり、現地手配の目安",
      points: [
        ["ルート", "大理 · 沙溪 · 麗江または白沙"],
        ["ペース", "湖の朝、古い町の夜、雪山の遠景"],
        ["おすすめ", "カップル、家族、親しい友人の小さな旅"],
        ["初回確認", "季節、人数、宿、言語サポート"],
      ],
      mapTitle: "ルートの形",
      map: ["大理と洱海の朝", "沙溪の古鎮に一泊", "麗江または白沙の雪山", "個別ルート相談"],
      note: "国際航空券は含みません。正式料金は季節、宿泊水準、人数、車両、現地パートナーの状況により変わります。",
      cta: "このルートを相談する",
      tags: ["湖", "古鎮", "雪山"],
    },
    ko: {
      eyebrow: "표준 루트",
      title: "윈난 슬로우 루트",
      intro: "윈난을 차분하게 느끼기 위한 기본 여정입니다. 다리의 호수 바람, 샤시의 하룻밤, 그리고 리장 또는 바이샤의 설산 전망으로 이어집니다.",
      days: "7일",
      price: "NT$39,800 부터",
      priceNote: "1인 기준, 현지 일정 시작가",
      points: [
        ["루트", "다리 · 샤시 · 리장 또는 바이샤"],
        ["속도", "호수의 아침, 옛 마을의 밤, 설산 전망"],
        ["추천", "커플, 가족, 가까운 친구들의 작은 여행"],
        ["첫 확인", "계절, 인원, 숙소 감각, 언어 지원"],
      ],
      mapTitle: "루트 형태",
      map: ["다리와 얼하이 아침", "샤시 옛 마을 숙박", "리장 또는 바이샤 설산", "개인 루트 상담"],
      note: "국제선 항공권은 포함되지 않습니다. 최종 가격은 계절, 숙소 등급, 인원, 차량, 현지 파트너 상황에 따라 달라집니다.",
      cta: "이 루트 상담하기",
      tags: ["호수", "옛 마을", "설산"],
    },
    th: {
      eyebrow: "เส้นทางมาตรฐาน",
      title: "เส้นทางช้าในยูนนาน",
      intro: "เส้นทางพื้นฐานสำหรับผู้ที่อยากสัมผัสยูนนานอย่างสงบ: ลมริมทะเลสาบต้าหลี่ หนึ่งคืนที่ซาซี แล้วไปมองภูเขาหิมะจากลี่เจียงหรือไป๋ซา",
      days: "7 วัน",
      price: "เริ่มที่ NT$39,800",
      priceNote: "ต่อท่าน ราคาเริ่มต้นเฉพาะบริการในพื้นที่",
      points: [
        ["เส้นทาง", "ต้าหลี่ · ซาซี · ลี่เจียงหรือไป๋ซา"],
        ["จังหวะ", "เช้าริมทะเลสาบ คืนเมืองเก่า และวิวภูเขาหิมะ"],
        ["เหมาะกับ", "คู่รัก ครอบครัว และกลุ่มเพื่อนเล็ก ๆ"],
        ["ตรวจครั้งแรก", "ฤดูกาล จำนวนคน ที่พัก และภาษา"],
      ],
      mapTitle: "รูปทรงของเส้นทาง",
      map: ["เช้าของต้าหลี่และเอ๋อร์ไห่", "พักในเมืองเก่าซาซี", "ภูเขาหิมะจากลี่เจียงหรือไป๋ซา", "ปรึกษาเส้นทางส่วนตัว"],
      note: "ไม่รวมตั๋วเครื่องบินระหว่างประเทศ ราคาจริงขึ้นอยู่กับฤดูกาล ระดับที่พัก จำนวนคน รถ และผู้ให้บริการท้องถิ่น",
      cta: "สอบถามเส้นทางนี้",
      tags: ["ทะเลสาบ", "เมืองเก่า", "ภูเขาหิมะ"],
    },
  },
  xinjiang: {
    file: "xinjiang",
    image: "/assets/ai/bluehour-xinjiang-luxury-lake-v1.jpg",
    en: {
      eyebrow: "Standard route",
      title: "Xinjiang Sky Road",
      intro: "A wider route for guests who want the scale of inland China without turning every day into a transfer. We begin from Urumqi, then shape the lake, grassland or oasis days around the season.",
      days: "8-9 days",
      price: "From NT$58,800",
      priceNote: "per traveller, land arrangement from price",
      points: [
        ["Route", "Urumqi · Sayram Lake or Ili · grassland or bazaar"],
        ["Pace", "Long roads planned with air, weather and rest"],
        ["Best for", "Travellers who want big landscapes and careful pacing"],
        ["First review", "Season, driving tolerance, room style and cultural comfort"],
      ],
      mapTitle: "Route shape",
      map: ["Arrive through Urumqi", "Lake or grassland season route", "Bazaar and local table", "Private route review"],
      note: "Price excludes international flights and may change with season, hotel level, group size, vehicle needs and local-provider availability.",
      cta: "Ask about this route",
      tags: ["Sky", "Lake", "Long road"],
    },
    zh: {
      eyebrow: "標準路線",
      title: "新疆天山大路線",
      intro: "給想感受中國內陸尺度的客人一條清楚路線。從烏魯木齊進入，再依季節選擇湖泊、草原、巴扎與較舒服的車程節奏。",
      days: "8-9 日",
      price: "NT$58,800 起",
      priceNote: "每人，地接安排起價",
      points: [
        ["路線", "烏魯木齊 · 賽里木湖或伊犁 · 草原或巴扎"],
        ["節奏", "長距離移動保留天氣、休息與留白"],
        ["適合", "想看大風景，也在意舒適節奏的旅人"],
        ["初談", "先確認季節、拉車接受度、住宿感與文化舒適度"],
      ],
      mapTitle: "路線形狀",
      map: ["烏魯木齊進入", "湖泊或草原季節線", "巴扎與在地餐桌", "私人路線初談"],
      note: "價格不含國際機票；正式價格依季節、住宿級別、人數、車輛需求與當地服務商承接狀況調整。",
      cta: "詢問這條路線",
      tags: ["天空", "湖泊", "長路"],
    },
    ja: {
      eyebrow: "標準ルート",
      title: "新疆スカイ・ロード",
      intro: "中国内陸の大きさを、無理なく感じるための基本形です。ウルムチから入り、季節に合わせて湖、草原、バザールを組み立てます。",
      days: "8-9日間",
      price: "NT$58,800 から",
      priceNote: "1名様あたり、現地手配の目安",
      points: [
        ["ルート", "ウルムチ · サイラム湖またはイリ · 草原またはバザール"],
        ["ペース", "長距離移動に休息と天候の余白を持たせる"],
        ["おすすめ", "大きな風景と快適なペースを両方求める方"],
        ["初回確認", "季節、移動時間、宿、文化的な安心感"],
      ],
      mapTitle: "ルートの形",
      map: ["ウルムチから入る", "湖または草原の季節ルート", "バザールと食卓", "個別ルート相談"],
      note: "国際航空券は含みません。正式料金は季節、宿泊水準、人数、車両、現地パートナーの状況により変わります。",
      cta: "このルートを相談する",
      tags: ["空", "湖", "長い道"],
    },
    ko: {
      eyebrow: "표준 루트",
      title: "신장 스카이 로드",
      intro: "중국 내륙의 넓이를 무리 없이 느끼기 위한 기본 여정입니다. 우루무치에서 시작해 계절에 맞춰 호수, 초원, 바자를 정합니다.",
      days: "8-9일",
      price: "NT$58,800 부터",
      priceNote: "1인 기준, 현지 일정 시작가",
      points: [
        ["루트", "우루무치 · 싸이리무 호수 또는 이리 · 초원 또는 바자"],
        ["속도", "긴 이동에 날씨와 휴식을 위한 여백을 둡니다"],
        ["추천", "큰 풍경과 편안한 속도를 함께 원하는 여행자"],
        ["첫 확인", "계절, 장거리 이동, 숙소, 문화적 편안함"],
      ],
      mapTitle: "루트 형태",
      map: ["우루무치 도착", "호수 또는 초원 계절 루트", "바자와 현지 식탁", "개인 루트 상담"],
      note: "국제선 항공권은 포함되지 않습니다. 최종 가격은 계절, 숙소 등급, 인원, 차량, 현지 파트너 상황에 따라 달라집니다.",
      cta: "이 루트 상담하기",
      tags: ["하늘", "호수", "긴 길"],
    },
    th: {
      eyebrow: "เส้นทางมาตรฐาน",
      title: "เส้นทางฟ้ากว้างซินเจียง",
      intro: "เส้นทางพื้นฐานสำหรับคนที่อยากเห็นความกว้างของจีนแผ่นดินใน โดยไม่ให้ทุกวันกลายเป็นแค่การนั่งรถ เริ่มจากอุรุมชี แล้วเลือกทะเลสาบ ทุ่งหญ้า หรือตลาดตามฤดูกาล",
      days: "8-9 วัน",
      price: "เริ่มที่ NT$58,800",
      priceNote: "ต่อท่าน ราคาเริ่มต้นเฉพาะบริการในพื้นที่",
      points: [
        ["เส้นทาง", "อุรุมชี · ทะเลสาบไซหลี่มู่หรืออีหลี · ทุ่งหญ้าหรือตลาด"],
        ["จังหวะ", "ถนนยาวที่มีเวลาให้พักและดูอากาศ"],
        ["เหมาะกับ", "นักเดินทางที่อยากเห็นภูมิทัศน์ใหญ่และไม่เร่งเกินไป"],
        ["ตรวจครั้งแรก", "ฤดูกาล การนั่งรถ ที่พัก และความสบายทางวัฒนธรรม"],
      ],
      mapTitle: "รูปทรงของเส้นทาง",
      map: ["เข้าเมืองผ่านอุรุมชี", "ทะเลสาบหรือทุ่งหญ้าตามฤดูกาล", "ตลาดและโต๊ะอาหารท้องถิ่น", "ปรึกษาเส้นทางส่วนตัว"],
      note: "ไม่รวมตั๋วเครื่องบินระหว่างประเทศ ราคาจริงขึ้นอยู่กับฤดูกาล ระดับที่พัก จำนวนคน รถ และผู้ให้บริการท้องถิ่น",
      cta: "สอบถามเส้นทางนี้",
      tags: ["ฟ้า", "ทะเลสาบ", "ถนนยาว"],
    },
  },
  dunhuang: {
    file: "dunhuang",
    image: "/assets/ai/bluehour-dunhuang-luxury-desert-v1.jpg",
    en: {
      eyebrow: "Standard route",
      title: "Dunhuang Silk Road Light",
      intro: "A compact route for guests who want desert light, Mogao Caves and oasis evenings without treating Dunhuang as a single photo stop.",
      days: "5-6 days",
      price: "From NT$45,800",
      priceNote: "per traveller, land arrangement from price",
      points: [
        ["Route", "Dunhuang · Mogao Caves · Mingsha dunes · oasis evening"],
        ["Pace", "Museum, cave timing and desert hours kept unhurried"],
        ["Best for", "Travellers who want history, light and silence"],
        ["First review", "Cave tickets, season, heat tolerance and extension needs"],
      ],
      mapTitle: "Route shape",
      map: ["Arrive in Dunhuang", "Mogao Caves with context", "Dunes at the right hour", "Optional Jiayuguan extension"],
      note: "Price excludes international flights and may change with season, hotel level, group size, vehicle needs and local-provider availability.",
      cta: "Ask about this route",
      tags: ["Desert", "Mogao", "Oasis"],
    },
    zh: {
      eyebrow: "標準路線",
      title: "敦煌絲路光線",
      intro: "給想看沙漠、莫高窟與綠洲夜色的客人一條不趕的短線。不把敦煌做成一個拍照點，而是保留歷史與光線的重量。",
      days: "5-6 日",
      price: "NT$45,800 起",
      priceNote: "每人，地接安排起價",
      points: [
        ["路線", "敦煌 · 莫高窟 · 鳴沙山月牙泉 · 綠洲夜晚"],
        ["節奏", "博物館、洞窟時段與沙漠黃昏都不硬趕"],
        ["適合", "想看歷史、光線與安靜感的旅人"],
        ["初談", "先確認洞窟票務、季節、耐熱度與延伸需求"],
      ],
      mapTitle: "路線形狀",
      map: ["抵達敦煌", "莫高窟與背景理解", "對的時間進沙漠", "可延伸嘉峪關"],
      note: "價格不含國際機票；正式價格依季節、住宿級別、人數、車輛需求與當地服務商承接狀況調整。",
      cta: "詢問這條路線",
      tags: ["沙漠", "莫高窟", "綠洲"],
    },
    ja: {
      eyebrow: "標準ルート",
      title: "敦煌シルクロードの光",
      intro: "砂漠の光、莫高窟、オアシスの夜を、写真だけで終わらせないための短い基本ルートです。",
      days: "5-6日間",
      price: "NT$45,800 から",
      priceNote: "1名様あたり、現地手配の目安",
      points: [
        ["ルート", "敦煌 · 莫高窟 · 鳴沙山月牙泉 · オアシスの夜"],
        ["ペース", "博物館、洞窟、砂漠の時間を急がない"],
        ["おすすめ", "歴史、光、静けさを求める方"],
        ["初回確認", "洞窟予約、季節、暑さ、延泊の希望"],
      ],
      mapTitle: "ルートの形",
      map: ["敦煌に到着", "莫高窟を文脈とともに", "よい時間の砂丘", "嘉峪関延長も可能"],
      note: "国際航空券は含みません。正式料金は季節、宿泊水準、人数、車両、現地パートナーの状況により変わります。",
      cta: "このルートを相談する",
      tags: ["砂漠", "莫高窟", "オアシス"],
    },
    ko: {
      eyebrow: "표준 루트",
      title: "둔황 실크로드 빛",
      intro: "사막의 빛, 막고굴, 오아시스의 밤을 사진 한 장으로 끝내지 않기 위한 짧고 깊은 기본 여정입니다.",
      days: "5-6일",
      price: "NT$45,800 부터",
      priceNote: "1인 기준, 현지 일정 시작가",
      points: [
        ["루트", "둔황 · 막고굴 · 명사산 월아천 · 오아시스의 밤"],
        ["속도", "박물관, 동굴, 사막 시간을 서두르지 않습니다"],
        ["추천", "역사, 빛, 고요함을 원하는 여행자"],
        ["첫 확인", "동굴 예약, 계절, 더위, 연장 일정"],
      ],
      mapTitle: "루트 형태",
      map: ["둔황 도착", "막고굴을 맥락과 함께", "좋은 시간의 사구", "자위관 연장 가능"],
      note: "국제선 항공권은 포함되지 않습니다. 최종 가격은 계절, 숙소 등급, 인원, 차량, 현지 파트너 상황에 따라 달라집니다.",
      cta: "이 루트 상담하기",
      tags: ["사막", "막고굴", "오아시스"],
    },
    th: {
      eyebrow: "เส้นทางมาตรฐาน",
      title: "แสงเส้นทางสายไหมตุนหวง",
      intro: "เส้นทางสั้นที่ไม่เร่ง สำหรับคนที่อยากเห็นแสงทะเลทราย ถ้ำม่อเกา และค่ำคืนโอเอซิส โดยไม่ทำให้ตุนหวงเหลือแค่จุดถ่ายรูป",
      days: "5-6 วัน",
      price: "เริ่มที่ NT$45,800",
      priceNote: "ต่อท่าน ราคาเริ่มต้นเฉพาะบริการในพื้นที่",
      points: [
        ["เส้นทาง", "ตุนหวง · ถ้ำม่อเกา · หมิงซาซานเย่ว์หยาฉวน · ค่ำคืนโอเอซิส"],
        ["จังหวะ", "พิพิธภัณฑ์ ถ้ำ และเวลาทะเลทรายไม่เร่งเกินไป"],
        ["เหมาะกับ", "ผู้ที่อยากได้ประวัติศาสตร์ แสง และความสงบ"],
        ["ตรวจครั้งแรก", "บัตรถ้ำ ฤดูกาล ความร้อน และการต่อเส้นทาง"],
      ],
      mapTitle: "รูปทรงของเส้นทาง",
      map: ["ถึงตุนหวง", "ถ้ำม่อเกาพร้อมบริบท", "เนินทรายในเวลาที่เหมาะ", "ต่อไปเจียยู่กวนได้"],
      note: "ไม่รวมตั๋วเครื่องบินระหว่างประเทศ ราคาจริงขึ้นอยู่กับฤดูกาล ระดับที่พัก จำนวนคน รถ และผู้ให้บริการท้องถิ่น",
      cta: "สอบถามเส้นทางนี้",
      tags: ["ทะเลทราย", "ม่อเกา", "โอเอซิส"],
    },
  },
  sanya: {
    file: "sanya",
    image: "/assets/ai/bluehour-sanya-luxury-coast-v1.jpg",
    en: {
      eyebrow: "Standard route",
      title: "Sanya Coastal Ease",
      intro: "A resort-led China route for guests who want warm water, good rooms and a softer cultural edge, with enough open time for the stay itself to matter.",
      days: "5 days",
      price: "From NT$42,800",
      priceNote: "per traveller, land arrangement from price",
      points: [
        ["Route", "Sanya resort stay · coastal day · gentle local moment"],
        ["Pace", "Slow mornings, one curated outing and generous rest"],
        ["Best for", "Travellers who want China with resort comfort"],
        ["First review", "Hotel level, privacy, food needs and activity appetite"],
      ],
      mapTitle: "Route shape",
      map: ["Arrive by the coast", "Slow resort morning", "One gentle local day", "Private route review"],
      note: "Price excludes international flights and may change with season, hotel level, group size, vehicle needs and local-provider availability.",
      cta: "Ask about this route",
      tags: ["Sea", "Resort", "Ease"],
    },
    zh: {
      eyebrow: "標準路線",
      title: "三亞海岸慢休日",
      intro: "給想要海、好房間與柔和中國感的客人一條度假主導路線。行程不塞滿，讓住宿本身成為旅程的一部分。",
      days: "5 日",
      price: "NT$42,800 起",
      priceNote: "每人，地接安排起價",
      points: [
        ["路線", "三亞度假酒店 · 海岸日 · 柔和在地半日"],
        ["節奏", "慢清晨、一個精選外出日與足夠休息"],
        ["適合", "想要中國風景，也重視度假舒適的旅人"],
        ["初談", "先確認酒店級別、私密性、餐食需求與活動強度"],
      ],
      mapTitle: "路線形狀",
      map: ["抵達海岸", "度假酒店慢清晨", "一個柔和在地日", "私人路線初談"],
      note: "價格不含國際機票；正式價格依季節、住宿級別、人數、車輛需求與當地服務商承接狀況調整。",
      cta: "詢問這條路線",
      tags: ["海岸", "度假", "舒適"],
    },
    ja: {
      eyebrow: "標準ルート",
      title: "三亜コースタル・イーズ",
      intro: "海、よい部屋、やわらかな中国らしさを求める方のためのリゾート中心ルートです。滞在そのものが旅になります。",
      days: "5日間",
      price: "NT$42,800 から",
      priceNote: "1名様あたり、現地手配の目安",
      points: [
        ["ルート", "三亜リゾート滞在 · 海岸の日 · 軽いローカル体験"],
        ["ペース", "ゆっくりした朝、一つの外出、十分な休息"],
        ["おすすめ", "リゾートの快適さと中国の空気を両方求める方"],
        ["初回確認", "ホテル水準、プライバシー、食事、活動量"],
      ],
      mapTitle: "ルートの形",
      map: ["海辺に到着", "リゾートの朝", "やわらかな現地の一日", "個別ルート相談"],
      note: "国際航空券は含みません。正式料金は季節、宿泊水準、人数、車両、現地パートナーの状況により変わります。",
      cta: "このルートを相談する",
      tags: ["海", "リゾート", "快適"],
    },
    ko: {
      eyebrow: "표준 루트",
      title: "싼야 코스털 이즈",
      intro: "따뜻한 바다, 좋은 객실, 부드러운 중국의 분위기를 원하는 분을 위한 리조트 중심 여정입니다. 숙소 자체가 여행의 일부가 됩니다.",
      days: "5일",
      price: "NT$42,800 부터",
      priceNote: "1인 기준, 현지 일정 시작가",
      points: [
        ["루트", "싼야 리조트 숙박 · 해안의 하루 · 부드러운 현지 시간"],
        ["속도", "느린 아침, 선별된 외출, 충분한 휴식"],
        ["추천", "리조트 편안함과 중국의 공기를 함께 원하는 여행자"],
        ["첫 확인", "호텔 등급, 프라이버시, 식사, 활동 강도"],
      ],
      mapTitle: "루트 형태",
      map: ["해안 도착", "리조트의 느린 아침", "부드러운 현지의 하루", "개인 루트 상담"],
      note: "국제선 항공권은 포함되지 않습니다. 최종 가격은 계절, 숙소 등급, 인원, 차량, 현지 파트너 상황에 따라 달라집니다.",
      cta: "이 루트 상담하기",
      tags: ["바다", "리조트", "휴식"],
    },
    th: {
      eyebrow: "เส้นทางมาตรฐาน",
      title: "วันพักช้าริมทะเลซานย่า",
      intro: "เส้นทางรีสอร์ตสำหรับคนที่อยากได้ทะเล ห้องพักดี และความรู้สึกจีนที่นุ่มลง ให้ที่พักเป็นส่วนหนึ่งของทริปจริง ๆ",
      days: "5 วัน",
      price: "เริ่มที่ NT$42,800",
      priceNote: "ต่อท่าน ราคาเริ่มต้นเฉพาะบริการในพื้นที่",
      points: [
        ["เส้นทาง", "พักรีสอร์ตซานย่า · วันริมทะเล · ครึ่งวันท้องถิ่นเบา ๆ"],
        ["จังหวะ", "เช้าช้า ๆ หนึ่งวันออกไปข้างนอก และเวลาพักมากพอ"],
        ["เหมาะกับ", "ผู้ที่อยากได้จีนในจังหวะรีสอร์ตสบาย ๆ"],
        ["ตรวจครั้งแรก", "ระดับโรงแรม ความเป็นส่วนตัว อาหาร และกิจกรรม"],
      ],
      mapTitle: "รูปทรงของเส้นทาง",
      map: ["ถึงริมทะเล", "เช้าช้า ๆ ในรีสอร์ต", "หนึ่งวันท้องถิ่นเบา ๆ", "ปรึกษาเส้นทางส่วนตัว"],
      note: "ไม่รวมตั๋วเครื่องบินระหว่างประเทศ ราคาจริงขึ้นอยู่กับฤดูกาล ระดับที่พัก จำนวนคน รถ และผู้ให้บริการท้องถิ่น",
      cta: "สอบถามเส้นทางนี้",
      tags: ["ทะเล", "รีสอร์ต", "สบาย"],
    },
  },
  northeast: {
    file: "northeast",
    image: "/assets/ai/bluehour-northeast-winter-lodge-v1.jpg",
    en: {
      eyebrow: "Standard route",
      title: "Northeast Winter Rail",
      intro: "A winter route for guests who want snow, rail movement, forest air and warm rooms, planned around cold-weather comfort rather than endurance.",
      days: "6-7 days",
      price: "From NT$49,800",
      priceNote: "per traveller, land arrangement from price",
      points: [
        ["Route", "Harbin · snow or forest stay · winter rail movement"],
        ["Pace", "Cold air outside, warm rooms and meals inside"],
        ["Best for", "Travellers who want cinematic winter without chaos"],
        ["First review", "Winter clothing, room warmth, rail timing and food needs"],
      ],
      mapTitle: "Route shape",
      map: ["Arrive through Harbin", "Snowfield or forest stay", "Railway winter movement", "Private route review"],
      note: "Price excludes international flights and may change with season, hotel level, group size, vehicle needs and local-provider availability.",
      cta: "Ask about this route",
      tags: ["Snow", "Rail", "Warm room"],
    },
    zh: {
      eyebrow: "標準路線",
      title: "東北雪線暖房",
      intro: "給想看雪、鐵路、森林空氣與溫暖房間的客人一條冬季線。重點不是忍耐寒冷，而是把冷空氣與室內溫暖都安排好。",
      days: "6-7 日",
      price: "NT$49,800 起",
      priceNote: "每人，地接安排起價",
      points: [
        ["路線", "哈爾濱 · 雪地或森林住宿 · 冬季鐵路移動"],
        ["節奏", "外面有冷空氣，裡面有暖房與熱食"],
        ["適合", "想看電影感冬天，但不想混亂折騰的旅人"],
        ["初談", "先確認禦寒、房間暖度、鐵路時間與餐食需求"],
      ],
      mapTitle: "路線形狀",
      map: ["哈爾濱進入", "雪地或森林住宿", "冬季鐵路移動", "私人路線初談"],
      note: "價格不含國際機票；正式價格依季節、住宿級別、人數、車輛需求與當地服務商承接狀況調整。",
      cta: "詢問這條路線",
      tags: ["雪", "鐵路", "暖房"],
    },
    ja: {
      eyebrow: "標準ルート",
      title: "東北ウィンター・レール",
      intro: "雪、列車、森の空気、あたたかい部屋を楽しむ冬の基本ルートです。寒さに耐える旅ではなく、外の冷気と室内の温かさを整えます。",
      days: "6-7日間",
      price: "NT$49,800 から",
      priceNote: "1名様あたり、現地手配の目安",
      points: [
        ["ルート", "ハルビン · 雪原または森の滞在 · 冬の鉄道"],
        ["ペース", "外は冷気、内側は温かい部屋と食事"],
        ["おすすめ", "映画のような冬を穏やかに見たい方"],
        ["初回確認", "防寒、部屋の暖かさ、鉄道時間、食事"],
      ],
      mapTitle: "ルートの形",
      map: ["ハルビンから入る", "雪原または森に滞在", "冬の鉄道移動", "個別ルート相談"],
      note: "国際航空券は含みません。正式料金は季節、宿泊水準、人数、車両、現地パートナーの状況により変わります。",
      cta: "このルートを相談する",
      tags: ["雪", "鉄道", "暖かい部屋"],
    },
    ko: {
      eyebrow: "표준 루트",
      title: "동북 윈터 레일",
      intro: "눈, 기차, 숲의 공기, 따뜻한 방을 위한 겨울 기본 여정입니다. 추위를 견디는 여행이 아니라, 바깥의 차가움과 안쪽의 따뜻함을 함께 준비합니다.",
      days: "6-7일",
      price: "NT$49,800 부터",
      priceNote: "1인 기준, 현지 일정 시작가",
      points: [
        ["루트", "하얼빈 · 설원 또는 숲 숙박 · 겨울 철도 이동"],
        ["속도", "밖은 차가운 공기, 안은 따뜻한 방과 음식"],
        ["추천", "영화 같은 겨울을 차분하게 보고 싶은 여행자"],
        ["첫 확인", "방한, 객실 온기, 철도 시간, 식사"],
      ],
      mapTitle: "루트 형태",
      map: ["하얼빈 도착", "설원 또는 숲 숙박", "겨울 철도 이동", "개인 루트 상담"],
      note: "국제선 항공권은 포함되지 않습니다. 최종 가격은 계절, 숙소 등급, 인원, 차량, 현지 파트너 상황에 따라 달라집니다.",
      cta: "이 루트 상담하기",
      tags: ["눈", "철도", "따뜻한 방"],
    },
    th: {
      eyebrow: "เส้นทางมาตรฐาน",
      title: "รถไฟฤดูหนาวภาคตะวันออกเฉียงเหนือ",
      intro: "เส้นทางฤดูหนาวสำหรับคนที่อยากเห็นหิมะ รถไฟ อากาศป่า และห้องพักอุ่น ๆ ไม่ใช่ทริปทนหนาว แต่เป็นทริปที่จัดความเย็นและความอุ่นให้พอดี",
      days: "6-7 วัน",
      price: "เริ่มที่ NT$49,800",
      priceNote: "ต่อท่าน ราคาเริ่มต้นเฉพาะบริการในพื้นที่",
      points: [
        ["เส้นทาง", "ฮาร์บิน · พักในหิมะหรือป่า · รถไฟฤดูหนาว"],
        ["จังหวะ", "ข้างนอกคืออากาศหนาว ข้างในคือห้องอุ่นและอาหารร้อน"],
        ["เหมาะกับ", "คนที่อยากเห็นฤดูหนาวแบบภาพยนตร์แต่ไม่วุ่นวาย"],
        ["ตรวจครั้งแรก", "เสื้อกันหนาว ความอุ่นของห้อง เวลาเดินรถไฟ และอาหาร"],
      ],
      mapTitle: "รูปทรงของเส้นทาง",
      map: ["เข้าเมืองผ่านฮาร์บิน", "พักในหิมะหรือป่า", "เคลื่อนที่ด้วยรถไฟฤดูหนาว", "ปรึกษาเส้นทางส่วนตัว"],
      note: "ไม่รวมตั๋วเครื่องบินระหว่างประเทศ ราคาจริงขึ้นอยู่กับฤดูกาล ระดับที่พัก จำนวนคน รถ และผู้ให้บริการท้องถิ่น",
      cta: "สอบถามเส้นทางนี้",
      tags: ["หิมะ", "รถไฟ", "ห้องอุ่น"],
    },
  },
};

const langFiles = [
  { lang: "en", base: "", interest: "/interest.html" },
  { lang: "en", base: "en", interest: "/en/interest/" },
  { lang: "zh", base: "zh", interest: "/zh/interest/" },
  { lang: "ja", base: "ja", interest: "/ja/interest/" },
  { lang: "ko", base: "ko", interest: "/ko/interest/" },
  { lang: "th", base: "th", interest: "/th/interest/" },
];

function esc(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function filePath(dest, base) {
  if (!base) return new URL(`${dest.file}.html`, root);
  return new URL(`${base}/${dest.file}/index.html`, root);
}

function interestUrl(baseUrl, slug) {
  const separator = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${separator}utm_source=standard_route&utm_medium=site&utm_campaign=private_route_consultation&destination=${slug}`;
}

function renderSection(destKey, dest, lang, interest) {
  const copy = dest[lang];
  const cjkClass = ["zh", "ja", "ko"].includes(lang) ? " class=\"cjk-title\"" : "";
  const points = copy.points
    .map(([label, text]) => `<div><b>${esc(label)}</b><span>${esc(text)}</span></div>`)
    .join("");
  const map = copy.map.map((item) => `<span>${esc(item)}</span>`).join("");
  const tags = copy.tags.map((tag) => `<span>${esc(tag)}</span>`).join("");
  const ctaUrl = interestUrl(interest, destKey);

  return `
    <!-- standard-route-start -->
    <section class="section standard-route-band" id="standard-route">
      <div class="wrap route-showcase">
        <div class="route-copy">
          <p class="eyebrow">${esc(copy.eyebrow)}</p>
          <h2${cjkClass}>${esc(copy.title)}</h2>
          <p>${esc(copy.intro)}</p>
          <div class="route-price">
            <span>${esc(copy.days)}</span>
            <strong>${esc(copy.price)}</strong>
            <small>${esc(copy.priceNote)}</small>
          </div>
          <div class="route-points">${points}</div>
          <p class="route-note">${esc(copy.note)}</p>
          <div class="route-meta">${tags}</div>
          <div class="hero-actions">
            <a class="btn primary dark-gold" href="${esc(ctaUrl)}">${esc(copy.cta)}</a>
          </div>
        </div>
        <div class="route-card" aria-label="${esc(copy.title)}">
          <div class="route-image"><img src="${esc(dest.image)}" alt="${esc(copy.title)}"></div>
          <div class="route-map">
            <h3>${esc(copy.mapTitle)}</h3>
            <div class="map-line">${map}</div>
          </div>
        </div>
      </div>
    </section>
    <!-- standard-route-end -->`;
}

let touched = 0;
for (const [destKey, dest] of Object.entries(destinations)) {
  for (const { lang, base, interest } of langFiles) {
    const path = filePath(dest, base);
    if (!fs.existsSync(path)) continue;
    let html = fs.readFileSync(path, "utf8");
    html = html.replace(/\n\s*<!-- standard-route-start -->[\s\S]*?<!-- standard-route-end -->\n?/g, "\n");
    const section = renderSection(destKey, dest, lang, interest);
    const marker = `    <section class="section care-band" id="care">`;
    if (!html.includes(marker)) {
      throw new Error(`Missing care marker in ${path.pathname}`);
    }
    html = html.replace(marker, `${section}\n${marker}`);
    fs.writeFileSync(path, html);
    touched += 1;
  }
}

console.log(`standard-route-pages-updated ${touched}`);
