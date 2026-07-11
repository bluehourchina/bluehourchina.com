import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const sheetEndpoint = "https://script.google.com/macros/s/AKfycbxCxsA5x0zzq_5pqI2MNJcki0MC9R236i_e3oRtu_0QPl7osg9CDHnaOzsSW_sZiRrh/exec";
const emailEndpoint = "https://formsubmit.co/67d31e8a5231a5944bbb8f18952a58df";

const locales = {
  en: {
    homeFiles: ["index.html", "en.html", "en/index.html"],
    homeUrl: "/",
    interest: "/route-note/",
    language: "English",
    currency: "USD",
    navCta: "Plan my trip",
    heroEyebrow: "Private China journeys beyond the mega cities",
    heroTitle: "See a deeper China, without travelling the hard way",
    heroLead: "Private routes through Yunnan, Xinjiang, the Qinghai-Gansu Grand Loop, Inner Mongolia, Hainan and Northeast China, shaped around your dates, pace and comfort.",
    heroPrimary: "Explore sample journeys",
    heroSecondary: "Plan my private trip",
    heroProof: ["Private from 2 travellers", "Clear starting prices", "Reply within 1 business day"],
    routesEyebrow: "Sample private journeys",
    routesTitle: "Choose a route to begin with",
    routesIntro: "Each journey shows the days, route, starting price and minimum group before you contact us. We tailor it after we understand who is travelling.",
    fromLabel: "From",
    groupLabel: "Private group",
    routeLabel: "Route",
    groupText: "From 2 travellers · best for 2-6",
    viewRoute: "View itinerary",
    processEyebrow: "How it works",
    processTitle: "Three steps from an idea to a route",
    process: [
      ["01", "Choose a starting route", "See how the days flow and which places deserve more time."],
      ["02", "Send dates and group details", "Tell us the month, travellers, days and what comfort means to you."],
      ["03", "Receive a route shaped around you", "A human planner replies within one business day with what fits, what to adjust and the clearest next step."],
    ],
    careEyebrow: "What the starting estimate covers",
    careTitle: "Know what is included before you enquire",
    careIntro: "Each price is a land-arrangement estimate. Final inclusions depend on season, room category and route.",
    care: [
      ["Private movement", "Airport or station pickup and the main transfers shown in the route."],
      ["Stay standard", "Quality local stays or upgraded rooms, confirmed for your season."],
      ["Language and booking", "Chinese coordination for key reservations and route details."],
      ["Daily pacing", "One clear focus each day, with rest and transfer buffers built in."],
    ],
    guidesEyebrow: "Before China",
    guidesTitle: "Practical answers before the flight",
    guidesIntro: "Useful preparation earns trust before a traveller is ready to request a private route.",
    guides: [
      ["Payment", "Set up WeChat Pay, Alipay and card backups", "/before-china/china-payment-checklist/", "Read the payment checklist"],
      ["Phone", "Prepare data, maps, translation and hotel addresses", "/before-china/china-travel-apps-before-trip/", "Check the essential apps"],
      ["Arrival", "Make the first day in China calmer", "/before-china/china-first-day-arrival-checklist/", "See the arrival checklist"],
    ],
    formEyebrow: "Private route request",
    formTitle: "Tell us what you want from China",
    formIntro: "Share your dates, days, group size and budget. We reply with a route direction and starting quote.",
    responseNote: "Human reply within 1 business day",
    placeholders: { name: "Name", contact: "Email / WhatsApp / WeChat", destination: "Destination", window: "Travel window", days: "Trip length", group: "Travellers", budget: "Budget per traveller", note: "Anything we should know about pace, hotels, children, seniors or food?" },
    submit: "Request my private route",
    sending: "Sending...",
    success: "Thank you. We received your request and will reply with a route direction and starting quote.",
    error: "The form did not send. Please email us directly.",
    consent: "We use these details only to reply to your travel inquiry. No payment is taken here.",
    windowOptions: ["Within 1-3 months", "Within 3-6 months", "Next spring or summer", "Next autumn or winter", "Still exploring"],
    dayOptions: ["5-6 days", "About one week", "8-12 days", "13 days or more", "Still deciding"],
    groupOptions: ["2 travellers", "3-4 travellers", "5-6 travellers", "Family with children", "Travelling with seniors", "Solo traveller"],
    budgetOptions: ["Under US$1,500", "US$1,500-2,500", "US$2,500-4,000", "US$4,000+", "Not sure yet"],
  },
  zh: {
    homeFiles: ["zh.html"], homeUrl: "/zh.html", interest: "/zh/interest/", language: "Traditional Chinese", currency: "CNY", navCta: "規劃私人旅程",
    heroEyebrow: "走出一線城市的中國私人旅行",
    heroTitle: ["看見更深的中國", "不必把旅行變得辛苦"],
    heroLead: "雲南、新疆、青甘大環線、內蒙古、海南與東北。依出發月份、人數、步調與舒適需求，安排 2 人起的私人路線。",
    heroPrimary: "看標準路線", heroSecondary: "開始規劃私人旅程",
    heroProof: ["2 人起私人成行", "先看路線與起價", "1 個工作日內人工回覆"],
    routesEyebrow: "標準私人方案", routesTitle: ["先看標準路線", "再為同行的人調整"],
    routesIntro: "每一條方案先公開天數、路線、起價與最低人數。留下需求後，再依季節、房型與同行者調整。",
    fromLabel: "起價", groupLabel: "私人成行", routeLabel: "路線", groupText: "2 人起 · 建議 2-6 人", viewRoute: "看每日行程",
    processEyebrow: "如何開始", processTitle: ["三個步驟", "把想法整理成路線"],
    process: [["01", "先選標準路線", "先看每天怎麼走，哪些地方值得多留一點時間。"], ["02", "留下日期與同行資訊", "告訴我們月份、人數、天數與在意的舒適細節。"], ["03", "收到適合你的路線", "人工旅策會在 1 個工作日內回覆適合的走法、調整建議與下一步。"]],
    careEyebrow: "參考起價包含什麼", careTitle: ["先看包含內容", "再決定是否詢問"], careIntro: "每個價格都是地接安排參考起價，會依季節、房型與路線確認。",
    care: [["私人移動", "機場或車站接送，以及路線內的主要移動。"], ["住宿層級", "品質旅宿或升級房型，依出發季節確認。"], ["語言與預訂", "協助中文確認重要預訂與路線細節。"], ["每日節奏", "每天一個重點，保留休息與交通緩衝。"]],
    guidesEyebrow: "出發中國前", guidesTitle: ["先把基本操作準備好", "旅行才有餘裕"], guidesIntro: "支付、手機與抵達日是外國旅人最常搜尋，也最容易建立信任的內容。",
    guides: [["支付", "微信、支付寶、信用卡與備用現金", "/zh/before-china/wechat-pay-visa-mastercard/", "看支付準備"], ["手機", "網路、地圖、翻譯與飯店地址", "/zh/before-china/china-travel-apps-before-trip/", "看必要 App"], ["抵達", "把中國第一天安排得更安穩", "/before-china/china-first-day-arrival-checklist/", "看抵達清單"]],
    formEyebrow: "私人路線需求", formTitle: ["告訴我們", "想怎麼感受中國"], formIntro: "留下日期、人數、天數與預算。我們回覆路線方向與參考起價。", responseNote: "1 個工作日內人工回覆",
    placeholders: { name: "姓名", contact: "Email / WhatsApp / 微信 / LINE", destination: "想去的地區", window: "出發時間", days: "旅程天數", group: "同行人數", budget: "每人預算", note: "步調、住宿、孩子、長輩或餐食，有什麼需要先知道？" },
    submit: "索取私人路線建議", sending: "送出中...", success: "已收到。我們會回覆路線方向與初步起價。", error: "表單暫時沒有送出，請直接寄信給我們。", consent: "資料只用於回覆這次旅遊諮詢；此頁不會收取任何費用。",
    windowOptions: ["1-3 個月內", "3-6 個月內", "明年春夏", "明年秋冬", "還在比較"], dayOptions: ["5-6 天", "約一週", "8-12 天", "13 天以上", "還沒決定"], groupOptions: ["2 人", "3-4 人", "5-6 人", "親子同行", "長輩同行", "一人旅行"], budgetOptions: ["RMB 10,000 以下", "RMB 10,000-18,000", "RMB 18,000-30,000", "RMB 30,000 以上", "還沒決定"],
  },
  ja: {
    homeFiles: ["ja.html"], homeUrl: "/ja.html", interest: "/ja/interest/", language: "Japanese", currency: "JPY", navCta: "旅を相談する",
    heroEyebrow: "大都市の先へ行く中国のプライベート旅行", heroTitle: ["もっと深い中国へ", "旅を難しくせずに"], heroLead: "雲南、新疆、青海・甘粛大環状線、内モンゴル、海南島、東北。季節、人数、ペース、快適さに合わせた2名様からの個別ルートです。", heroPrimary: "モデルルートを見る", heroSecondary: "旅を相談する", heroProof: ["2名様から個別手配", "日程と料金目安を公開", "1営業日以内に返信"],
    routesEyebrow: "モデルプライベート旅行", routesTitle: ["まず一つの旅を選び", "あなたに合わせて整える"], routesIntro: "日数、ルート、料金目安、最少人数を先に確認できます。季節と同行者に合わせて最終調整します。", fromLabel: "料金目安", groupLabel: "人数", routeLabel: "ルート", groupText: "2名様から · おすすめ2-6名様", viewRoute: "日程を見る",
    processEyebrow: "ご相談の流れ", processTitle: ["三つのステップで", "思いを旅のルートへ"], process: [["01", "モデルルートを選ぶ", "毎日の流れと、ゆっくり過ごしたい場所を確認します。"], ["02", "日程と人数を送る", "旅行月、人数、日数と、大切にしたい快適さを教えてください。"], ["03", "あなたに合うルートを受け取る", "担当者が1営業日以内に、合う進み方と調整点をご連絡します。"]],
    careEyebrow: "参考料金に含まれるもの", careTitle: ["内容を確認してから", "相談できます"], careIntro: "料金は現地手配の目安です。季節、部屋、ルートによって最終確認します。", care: [["専用移動", "空港・駅の送迎とルート内の主な移動。"], ["宿の水準", "質のよい地域の宿またはアップグレード客室。"], ["言葉と予約", "重要な予約とルート詳細を中国語で確認。"], ["一日のペース", "一日一つの軸に、休息と移動の余白を確保。"]],
    guidesEyebrow: "中国へ行く前に", guidesTitle: "出発前の実用ガイド", guidesIntro: "支払い、スマートフォン、到着日の準備を先に整えます。", guides: [["支払い", "WeChat Pay、Alipay、カードの予備", "/before-china/china-payment-checklist/", "支払いガイド"], ["スマートフォン", "通信、地図、翻訳、ホテル住所", "/before-china/china-travel-apps-before-trip/", "必要アプリを見る"], ["到着", "中国での初日を穏やかに", "/before-china/china-first-day-arrival-checklist/", "到着チェックリスト"]],
    formEyebrow: "個別ルート相談", formTitle: ["どんな中国を", "感じたいですか"], formIntro: "時期、日数、人数、予算を送ると、ルートと料金目安をお返しします。", responseNote: "1営業日以内に担当者が返信", placeholders: { name: "お名前", contact: "メール / WhatsApp / WeChat / LINE", destination: "希望地域", window: "旅行時期", days: "旅行日数", group: "人数", budget: "1名様あたり予算", note: "ペース、ホテル、お子様、ご家族、食事について教えてください" }, submit: "個別ルートを相談する", sending: "送信中...", success: "受け取りました。ルートと料金目安をご連絡します。", error: "送信できませんでした。メールでご連絡ください。", consent: "情報は今回の旅行相談への返信にのみ使用します。ここで支払いは発生しません。", windowOptions: ["1-3か月以内", "3-6か月以内", "次の春または夏", "次の秋または冬", "検討中"], dayOptions: ["5-6日", "約1週間", "8-12日", "13日以上", "未定"], groupOptions: ["2名", "3-4名", "5-6名", "子ども連れ", "ご家族・シニア同行", "一人旅"], budgetOptions: ["JPY 200,000 未満", "JPY 200,000-350,000", "JPY 350,000-600,000", "JPY 600,000 以上", "未定"],
  },
  ko: {
    homeFiles: ["ko.html"], homeUrl: "/ko.html", interest: "/ko/interest/", language: "Korean", currency: "KRW", navCta: "개인 여행 상담",
    heroEyebrow: "대도시 너머 중국 개인 여행", heroTitle: ["더 깊은 중국을", "힘들지 않게 만나는 방법"], heroLead: "윈난, 신장, 칭하이-간쑤 대순환, 내몽골, 하이난, 동북. 계절, 인원, 속도와 편안함에 맞춘 2명부터의 개인 루트입니다.", heroPrimary: "표준 루트 보기", heroSecondary: "개인 여행 상담", heroProof: ["2명부터 개인 일정", "일정과 시작가 공개", "1영업일 이내 답변"],
    routesEyebrow: "표준 개인 여행", routesTitle: ["먼저 하나의 루트를 고르고", "여행자에게 맞게 조정합니다"], routesIntro: "일수, 루트, 시작가, 최소 인원을 먼저 확인하세요. 계절과 동행자에 맞춰 최종 조정합니다.", fromLabel: "시작가", groupLabel: "인원", routeLabel: "루트", groupText: "2명부터 · 추천 2-6명", viewRoute: "일정 보기",
    processEyebrow: "진행 방식", processTitle: ["세 단계로", "생각을 여행 경로로 정리합니다"], process: [["01", "표준 루트 선택", "매일의 흐름과 더 오래 머물고 싶은 장소를 확인합니다."], ["02", "날짜와 인원 전달", "여행 월, 인원, 일수와 중요하게 생각하는 편안함을 알려 주세요."], ["03", "나에게 맞는 경로 받기", "담당자가 1영업일 이내에 어울리는 진행 방식과 조정점을 답변합니다."]],
    careEyebrow: "시작 견적 포함 항목", careTitle: ["포함 내용을 먼저 보고", "문의를 결정하세요"], careIntro: "현지 일정 참고가이며 계절, 객실과 루트에 따라 최종 확인합니다.", care: [["전용 이동", "공항 또는 역 픽업과 루트 내 주요 이동."], ["숙소 수준", "품질 좋은 현지 숙소 또는 업그레이드 객실."], ["언어와 예약", "중요 예약과 루트 세부 사항의 중국어 확인."], ["하루의 속도", "하루 한 가지 중심에 휴식과 이동 여유를 포함."]],
    guidesEyebrow: "중국 출발 전", guidesTitle: "출발 전 실용 준비", guidesIntro: "결제, 휴대폰, 도착 첫날을 미리 준비합니다.", guides: [["결제", "WeChat Pay, Alipay, 카드 백업", "/before-china/china-payment-checklist/", "결제 체크리스트"], ["휴대폰", "데이터, 지도, 번역, 호텔 주소", "/before-china/china-travel-apps-before-trip/", "필수 앱 보기"], ["도착", "중국 첫날을 더 편안하게", "/before-china/china-first-day-arrival-checklist/", "도착 체크리스트"]],
    formEyebrow: "개인 루트 문의", formTitle: ["어떤 중국을", "느끼고 싶은지 알려 주세요"], formIntro: "시기, 일수, 인원과 예산을 보내면 루트와 시작 견적을 답변합니다.", responseNote: "1영업일 이내 담당자 답변", placeholders: { name: "이름", contact: "이메일 / WhatsApp / WeChat / LINE", destination: "희망 지역", window: "여행 시기", days: "여행 일수", group: "인원", budget: "1인 예산", note: "속도, 호텔, 어린이, 부모님, 식사 관련 요청" }, submit: "개인 루트 요청", sending: "보내는 중...", success: "문의가 접수되었습니다. 루트와 시작 견적을 보내드립니다.", error: "전송되지 않았습니다. 이메일로 연락해 주세요.", consent: "정보는 이번 여행 문의에 답변하기 위해서만 사용합니다. 이 페이지에서 결제하지 않습니다.", windowOptions: ["1-3개월 이내", "3-6개월 이내", "다음 봄 또는 여름", "다음 가을 또는 겨울", "검토 중"], dayOptions: ["5-6일", "약 1주", "8-12일", "13일 이상", "미정"], groupOptions: ["2명", "3-4명", "5-6명", "아이와 함께", "부모님 또는 시니어 동행", "혼자 여행"], budgetOptions: ["KRW 2,000,000 미만", "KRW 2,000,000-3,500,000", "KRW 3,500,000-6,000,000", "KRW 6,000,000 이상", "미정"],
  },
  th: {
    homeFiles: ["th.html"], homeUrl: "/th.html", interest: "/th/interest/", language: "Thai", currency: "THB", navCta: "วางแผนทริปส่วนตัว",
    heroEyebrow: "ทริปจีนส่วนตัวนอกเมืองใหญ่", heroTitle: "เห็นจีนที่ลึกขึ้น โดยไม่ทำให้การเดินทางยาก", heroLead: "ยูนนาน ซินเจียง วงแหวนชิงไห่–กานซู่ มองโกเลียใน ไหหลำ และภาคตะวันออกเฉียงเหนือ ออกแบบเส้นทางส่วนตัวตั้งแต่ 2 ท่านตามฤดูกาล จังหวะ และความสบาย", heroPrimary: "ดูเส้นทางตัวอย่าง", heroSecondary: "วางแผนทริปส่วนตัว", heroProof: ["เริ่มส่วนตัว 2 ท่าน", "เห็นเส้นทางและราคาเริ่มต้น", "ตอบโดยคนจริงใน 1 วันทำการ"],
    routesEyebrow: "ตัวอย่างทริปส่วนตัว", routesTitle: "เลือกเส้นทางตั้งต้นก่อนปรับให้เป็นของคุณ", routesIntro: "ดูจำนวนวัน เส้นทาง ราคาเริ่มต้น และจำนวนขั้นต่ำก่อนติดต่อ แล้วค่อยปรับตามฤดูกาลและผู้เดินทาง", fromLabel: "ราคาเริ่มต้น", groupLabel: "กลุ่มส่วนตัว", routeLabel: "เส้นทาง", groupText: "เริ่ม 2 ท่าน · เหมาะกับ 2-6 ท่าน", viewRoute: "ดูแผนรายวัน",
    processEyebrow: "วิธีเริ่ม", processTitle: "สามขั้นตอน จากความคิดสู่เส้นทางที่เหมาะกับคุณ", process: [["01", "เลือกเส้นทางตัวอย่าง", "ดูจังหวะของแต่ละวันและสถานที่ที่อยากใช้เวลาให้นานขึ้น"], ["02", "ส่งวันและข้อมูลกลุ่ม", "บอกเดือน จำนวนวัน ผู้ร่วมทาง และความสบายที่สำคัญกับคุณ"], ["03", "รับเส้นทางที่เหมาะกับคุณ", "ผู้วางแผนตอบภายใน 1 วันทำการ พร้อมแนวทางและจุดที่ควรปรับให้เข้ากับคุณ"]],
    careEyebrow: "ราคาเริ่มต้นรวมอะไร", careTitle: "ดูสิ่งที่รวมก่อนส่งคำขอ", careIntro: "เป็นราคาอ้างอิงบริการภาคพื้นดิน ยืนยันอีกครั้งตามฤดูกาล ห้องพัก และเส้นทาง", care: [["รถส่วนตัว", "รับส่งสนามบินหรือสถานีและการเดินทางหลักในเส้นทาง"], ["ระดับที่พัก", "ที่พักท้องถิ่นคุณภาพดีหรือห้องอัปเกรด"], ["ภาษาและการจอง", "ประสานภาษาจีนสำหรับการจองและรายละเอียดสำคัญ"], ["จังหวะแต่ละวัน", "หนึ่งจุดสำคัญต่อวัน พร้อมเวลาพักและเวลาเผื่อเดินทาง"]],
    guidesEyebrow: "ก่อนเดินทางจีน", guidesTitle: "เตรียมเรื่องจำเป็นก่อนบิน", guidesIntro: "การจ่ายเงิน โทรศัพท์ และวันแรกช่วยให้เดินทางสบายขึ้น", guides: [["การจ่ายเงิน", "WeChat Pay, Alipay และบัตรสำรอง", "/before-china/china-payment-checklist/", "ดูรายการชำระเงิน"], ["โทรศัพท์", "อินเทอร์เน็ต แผนที่ แปลภาษา ที่อยู่โรงแรม", "/before-china/china-travel-apps-before-trip/", "ดูแอปที่จำเป็น"], ["วันแรก", "ทำให้วันแรกในจีนสงบขึ้น", "/before-china/china-first-day-arrival-checklist/", "ดูรายการวันแรก"]],
    formEyebrow: "ขอเส้นทางส่วนตัว", formTitle: "บอกเราว่าคุณอยากสัมผัสจีนแบบไหน", formIntro: "ส่งช่วงเดินทาง จำนวนวัน ผู้เดินทาง และงบประมาณ แล้วเราจะตอบพร้อมเส้นทางและราคาเริ่มต้น", responseNote: "ตอบโดยคนจริงภายใน 1 วันทำการ", placeholders: { name: "ชื่อ", contact: "อีเมล / WhatsApp / WeChat / LINE", destination: "พื้นที่ที่สนใจ", window: "ช่วงเดินทาง", days: "จำนวนวัน", group: "จำนวนคน", budget: "งบต่อท่าน", note: "จังหวะ โรงแรม เด็ก ผู้สูงอายุ หรืออาหารที่ควรรู้" }, submit: "ขอเส้นทางส่วนตัว", sending: "กำลังส่ง...", success: "เราได้รับคำขอแล้ว จะตอบพร้อมเส้นทางและราคาเริ่มต้น", error: "ส่งไม่สำเร็จ กรุณาอีเมลถึงเรา", consent: "ใช้ข้อมูลเพื่อตอบคำถามทริปนี้เท่านั้น ไม่มีการชำระเงินในหน้านี้", windowOptions: ["ภายใน 1-3 เดือน", "ภายใน 3-6 เดือน", "ฤดูใบไม้ผลิหรือฤดูร้อนหน้า", "ฤดูใบไม้ร่วงหรือฤดูหนาวหน้า", "กำลังดูข้อมูล"], dayOptions: ["5-6 วัน", "ประมาณหนึ่งสัปดาห์", "8-12 วัน", "13 วันขึ้นไป", "ยังไม่แน่ใจ"], groupOptions: ["2 ท่าน", "3-4 ท่าน", "5-6 ท่าน", "ครอบครัวมีเด็ก", "เดินทางกับผู้สูงอายุ", "เดินทางคนเดียว"], budgetOptions: ["ต่ำกว่า THB 50,000", "THB 50,000-90,000", "THB 90,000-140,000", "THB 140,000 ขึ้นไป", "ยังไม่แน่ใจ"],
  },
};

const routes = [
  { slug: "yunnan", image: "/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg", days: { en: "8 days", zh: "8 天 7 晚", ja: "8日間", ko: "8일", th: "8 วัน" }, name: { en: "Yunnan", zh: "雲南", ja: "雲南", ko: "윈난", th: "ยูนนาน" }, title: { en: "Yunnan Lake & Mountain Route", zh: "雲南湖光雪山線", ja: "雲南 湖と雪山ルート", ko: "윈난 호수와 설산 루트", th: "เส้นทางทะเลสาบและภูเขาหิมะยูนนาน" }, price: { en: "US$545 pp", zh: "RMB 3,917/人", ja: "JPY 86,000/名", ko: "KRW 745,000/인", th: "THB 17,700/ท่าน" }, route: { en: "Kunming · Dali · Lijiang", zh: "昆明 · 大理 · 麗江", ja: "昆明 · 大理 · 麗江", ko: "쿤밍 · 다리 · 리장", th: "คุนหมิง · ต้าหลี่ · ลี่เจียง" }, daysShort: { en: ["D1-2 Kunming arrival", "D3-5 Dali and Erhai", "D6-8 Lijiang and snow mountain"], zh: ["D1-2 昆明落地", "D3-5 大理與洱海", "D6-8 麗江與雪山"], ja: ["D1-2 昆明", "D3-5 大理と洱海", "D6-8 麗江と雪山"], ko: ["D1-2 쿤밍", "D3-5 다리와 얼하이", "D6-8 리장과 설산"], th: ["D1-2 คุนหมิง", "D3-5 ต้าหลี่และเอ๋อร์ไห่", "D6-8 ลี่เจียงและภูเขาหิมะ"] } },
  { slug: "xinjiang", image: "/assets/ai/bluehour-xinjiang-luxury-lake-v1.jpg", days: { en: "8-9 days", zh: "8-9 天", ja: "8-9日間", ko: "8-9일", th: "8-9 วัน" }, name: { en: "Xinjiang", zh: "新疆", ja: "新疆", ko: "신장", th: "ซินเจียง" }, title: { en: "Xinjiang Sky Road", zh: "新疆天山大路線", ja: "新疆スカイロード", ko: "신장 스카이 로드", th: "เส้นทางฟ้ากว้างซินเจียง" }, price: { en: "US$1,850 pp", zh: "RMB 12,800/人", ja: "JPY 300,000/名", ko: "KRW 2,850,000/인", th: "THB 62,000/ท่าน" }, route: { en: "Urumqi · Sayram Lake · Ili", zh: "烏魯木齊 · 賽里木湖 · 伊犁", ja: "ウルムチ · サイラム湖 · イリ", ko: "우루무치 · 싸이리무 호수 · 이리", th: "อุรุมชี · ทะเลสาบไซหลี่มู่ · อีหลี" }, daysShort: { en: ["D1-2 Urumqi", "D3-6 lake and grassland", "D7-9 bazaar and return"], zh: ["D1-2 烏魯木齊", "D3-6 湖泊與草原", "D7-9 巴扎與返回"], ja: ["D1-2 ウルムチ", "D3-6 湖と草原", "D7-9 バザールと帰路"], ko: ["D1-2 우루무치", "D3-6 호수와 초원", "D7-9 바자와 귀로"], th: ["D1-2 อุรุมชี", "D3-6 ทะเลสาบและทุ่งหญ้า", "D7-9 ตลาดและกลับ"] } },
  { slug: "dunhuang", image: "/assets/ai/bluehour-dunhuang-luxury-desert-v1.jpg", days: { en: "5-6 days", zh: "5-6 天", ja: "5-6日間", ko: "5-6일", th: "5-6 วัน" }, name: { en: "Dunhuang", zh: "敦煌", ja: "敦煌", ko: "둔황", th: "ตุนหวง" }, title: { en: "Dunhuang Silk Road Light", zh: "敦煌絲路光線", ja: "敦煌 シルクロードの光", ko: "둔황 실크로드 빛", th: "แสงเส้นทางสายไหมตุนหวง" }, price: { en: "US$1,450 pp", zh: "RMB 9,800/人", ja: "JPY 235,000/名", ko: "KRW 2,200,000/인", th: "THB 48,000/ท่าน" }, route: { en: "Mogao Caves · Mingsha dunes · oasis", zh: "莫高窟 · 鳴沙山 · 綠洲", ja: "莫高窟 · 鳴沙山 · オアシス", ko: "막고굴 · 명사산 · 오아시스", th: "ถ้ำม่อเกา · หมิงซาซาน · โอเอซิส" }, daysShort: { en: ["D1 settle in Dunhuang", "D2-3 Mogao with context", "D4-6 dunes and extension"], zh: ["D1 抵達敦煌", "D2-3 莫高窟", "D4-6 沙漠與延伸"], ja: ["D1 敦煌到着", "D2-3 莫高窟", "D4-6 砂漠と延長"], ko: ["D1 둔황 도착", "D2-3 막고굴", "D4-6 사막과 연장"], th: ["D1 ถึงตุนหวง", "D2-3 ถ้ำม่อเกา", "D4-6 ทะเลทรายและต่อเส้นทาง"] } },
  { slug: "inner-mongolia", image: "/assets/ai/bluehour-inner-mongolia-grassland-v1.jpg", days: { en: "6 days", zh: "6 天 5 晚", ja: "6日間", ko: "6일", th: "6 วัน" }, name: { en: "Inner Mongolia", zh: "內蒙古", ja: "内モンゴル", ko: "내몽골", th: "มองโกเลียใน" }, title: { en: "Inner Mongolia Grassland & Desert", zh: "內蒙古草原沙漠線", ja: "内モンゴル 草原と砂漠", ko: "내몽골 초원과 사막", th: "มองโกเลียใน ทุ่งหญ้าและทะเลทราย" }, price: { en: "US$850 pp", zh: "RMB 6,150/人", ja: "JPY 136,000/名", ko: "KRW 1,180,000/인", th: "THB 28,000/ท่าน" }, route: { en: "Hohhot · Huitengxile · Kubuqi · Ordos", zh: "呼和浩特 · 輝騰錫勒 · 庫布齊 · 鄂爾多斯", ja: "フフホト · フイトンシレ · クブチ · オルドス", ko: "후허하오터 · 후이텅시러 · 쿠부치 · 오르도스", th: "ฮูฮอต · ฮุยเถิงซีเล่อ · คูปู้ฉี · ออร์ดอส" }, daysShort: { en: ["D1-2 Hohhot", "D3-4 grassland lodge", "D5-6 Kubuqi and Ordos"], zh: ["D1-2 呼和浩特", "D3-4 草原旅宿", "D5-6 庫布齊與鄂爾多斯"], ja: ["D1-2 フフホト", "D3-4 草原の宿", "D5-6 クブチとオルドス"], ko: ["D1-2 후허하오터", "D3-4 초원 숙소", "D5-6 쿠부치와 오르도스"], th: ["D1-2 ฮูฮอต", "D3-4 ที่พักทุ่งหญ้า", "D5-6 คูปู้ฉีและออร์ดอส"] } },
  { slug: "sanya", image: "/assets/ai/bluehour-sanya-luxury-coast-v1.jpg", days: { en: "5 days", zh: "5 天", ja: "5日間", ko: "5일", th: "5 วัน" }, name: { en: "Sanya", zh: "三亞", ja: "三亜", ko: "싼야", th: "ซานย่า" }, title: { en: "Sanya Coastal Ease", zh: "三亞海岸慢休日", ja: "三亜 コースタル・イーズ", ko: "싼야 코스털 이즈", th: "วันพักช้าริมทะเลซานย่า" }, price: { en: "US$1,350 pp", zh: "RMB 9,200/人", ja: "JPY 220,000/名", ko: "KRW 2,100,000/인", th: "THB 45,000/ท่าน" }, route: { en: "Resort stay · coast · one local day", zh: "度假酒店 · 海岸 · 一個在地日", ja: "リゾート · 海岸 · 現地の一日", ko: "리조트 · 해안 · 현지 하루", th: "รีสอร์ต · ชายฝั่ง · หนึ่งวันท้องถิ่น" }, daysShort: { en: ["D1 arrive by the coast", "D2-3 resort and local day", "D4-5 rest and departure"], zh: ["D1 抵達海岸", "D2-3 度假與在地日", "D4-5 休息與離開"], ja: ["D1 海辺に到着", "D2-3 リゾートと現地", "D4-5 休息と出発"], ko: ["D1 해안 도착", "D2-3 리조트와 현지", "D4-5 휴식과 출발"], th: ["D1 ถึงชายฝั่ง", "D2-3 รีสอร์ตและท้องถิ่น", "D4-5 พักและออกเดินทาง"] } },
  { slug: "northeast", image: "/assets/ai/bluehour-northeast-winter-lodge-v1.jpg", days: { en: "6-7 days", zh: "6-7 天", ja: "6-7日間", ko: "6-7일", th: "6-7 วัน" }, name: { en: "Northeast China", zh: "中國東北", ja: "中国東北", ko: "중국 동북", th: "จีนตะวันออกเฉียงเหนือ" }, title: { en: "Northeast Winter Rail", zh: "東北雪線暖房", ja: "東北 ウィンター・レール", ko: "동북 윈터 레일", th: "รถไฟฤดูหนาวภาคตะวันออกเฉียงเหนือ" }, price: { en: "US$1,600 pp", zh: "RMB 10,800/人", ja: "JPY 255,000/名", ko: "KRW 2,400,000/인", th: "THB 52,000/ท่าน" }, route: { en: "Harbin · snow lodge · winter rail", zh: "哈爾濱 · 雪地旅宿 · 冬季鐵路", ja: "ハルビン · 雪の宿 · 冬の鉄道", ko: "하얼빈 · 눈 숙소 · 겨울 철도", th: "ฮาร์บิน · ที่พักหิมะ · รถไฟฤดูหนาว" }, daysShort: { en: ["D1-2 Harbin", "D3-4 snow or forest stay", "D5-7 rail and warm rooms"], zh: ["D1-2 哈爾濱", "D3-4 雪地或森林", "D5-7 鐵路與暖房"], ja: ["D1-2 ハルビン", "D3-4 雪または森", "D5-7 鉄道と暖かい部屋"], ko: ["D1-2 하얼빈", "D3-4 눈 또는 숲", "D5-7 철도와 따뜻한 방"], th: ["D1-2 ฮาร์บิน", "D3-4 หิมะหรือป่า", "D5-7 รถไฟและห้องอุ่น"] } },
];

Object.assign(routes.find((route) => route.slug === "dunhuang"), {
  image: "/assets/real-qinggan/qinghai-lake-sunset-cc-by.jpg",
  days: { en: "9 days · 8 nights", zh: "9 天 8 晚", ja: "9日間・8泊", ko: "9일 · 8박", th: "9 วัน · 8 คืน" },
  name: { en: "Qinghai & Gansu", zh: "青甘", ja: "青海・甘粛", ko: "칭하이·간쑤", th: "ชิงไห่–กานซู่" },
  title: { en: "Qinghai-Gansu Grand Loop", zh: "青甘大環線", ja: "青海・甘粛大環状線", ko: "칭하이-간쑤 대순환", th: "วงแหวนชิงไห่–กานซู่" },
  price: { en: "RMB 4,980", zh: "RMB 4,980", ja: "RMB 4,980", ko: "RMB 4,980", th: "RMB 4,980" },
  route: { en: "Xining · Qinghai Lake · Dunhuang · Zhangye", zh: "西寧 · 青海湖 · 敦煌 · 張掖", ja: "西寧 · 青海湖 · 敦煌 · 張掖", ko: "시닝 · 칭하이호 · 둔황 · 장예", th: "ซีหนิง · ชิงไห่ · ตุนหวง · จางเย่" },
  daysShort: { en: ["D1-3 plateau lakes", "D4-6 desert and Dunhuang", "D7-9 Jiayuguan and Zhangye"], zh: ["D1-3 高原湖泊", "D4-6 戈壁與敦煌", "D7-9 嘉峪關與張掖"], ja: ["D1-3 高原の湖", "D4-6 砂漠と敦煌", "D7-9 嘉峪関と張掖"], ko: ["D1-3 고원 호수", "D4-6 사막과 둔황", "D7-9 자위관과 장예"], th: ["D1-3 ทะเลสาบที่ราบสูง", "D4-6 ทะเลทรายและตุนหวง", "D7-9 เจียยวี่กวนและจางเย่"] },
});
routes.find((route) => route.slug === "northeast").name.zh = "東北";
Object.assign(routes.find((route) => route.slug === "sanya"), {
  image: "/assets/real-hainan/shimei-bay-wanning-cc-by-sa.jpg",
  days: { en: "7 days · 6 nights", zh: "7 天 6 晚", ja: "7日間・6泊", ko: "7일 · 6박", th: "7 วัน · 6 คืน" },
  name: { en: "Hainan & Sanya", zh: "海南與三亞", ja: "海南島・三亜", ko: "하이난·싼야", th: "ไหหลำ–ซานย่า" },
  title: { en: "Hainan East Coast & Sanya", zh: "海南東海岸與三亞", ja: "海南島東海岸と三亜", ko: "하이난 동해안과 싼야", th: "ชายฝั่งตะวันออกไหหลำและซานย่า" },
  price: { en: "RMB 14,200", zh: "RMB 14,200", ja: "RMB 14,200", ko: "RMB 14,200", th: "RMB 14,200" },
  route: { en: "Haikou · Qionghai · Wanning · Sanya", zh: "海口 · 瓊海 · 萬寧 · 三亞", ja: "海口 · 瓊海 · 万寧 · 三亜", ko: "하이커우 · 충하이 · 완닝 · 싼야", th: "ไหโข่ว · ฉงไห่ · ว่านหนิง · ซานย่า" },
  daysShort: { en: ["D1-2 Haikou and Qionghai", "D3-4 Wanning coast", "D5-7 Sanya"], zh: ["D1-2 海口與瓊海", "D3-4 萬寧海岸", "D5-7 三亞"], ja: ["D1-2 海口と瓊海", "D3-4 万寧の海岸", "D5-7 三亜"], ko: ["D1-2 하이커우와 충하이", "D3-4 완닝 해안", "D5-7 싼야"], th: ["D1-2 ไหโข่วและฉงไห่", "D3-4 ชายฝั่งว่านหนิง", "D5-7 ซานย่า"] },
});

const innerDays = {
  en: [["Day 1", "Arrive in Hohhot", "Private pickup, check-in and a light first evening. Begin with a good room and a warm meal.", "Stay: Hohhot"], ["Day 2", "Hohhot history and local table", "Inner Mongolia Museum, Dazhao area and a paced introduction to the region before the long landscapes begin.", "Stay: Hohhot"], ["Day 3", "Huitengxile grassland", "Private transfer to the grassland, a refined lodge or upgraded yurt and time outside after the day crowds thin.", "Stay: grassland lodge"], ["Day 4", "Grassland morning, culture without theatre", "A calm morning, optional gentle riding and a respectful local cultural layer rather than a packed performance checklist.", "Stay: Hohhot or route lodge"], ["Day 5", "Kubuqi Desert", "Move from grassland to desert. Keep the dune experience around light, temperature and comfort, with optional activities discussed in advance.", "Stay: desert or Ordos"], ["Day 6", "Ordos and departure", "A slower morning, private airport transfer and enough buffer for the route to end without stress.", "Departure day"]],
  zh: [["第 1 天", "抵達呼和浩特", "私人接送、入住與一頓溫暖晚餐。第一天先讓旅人安穩落地。", "住宿：呼和浩特"], ["第 2 天", "城市歷史與在地餐桌", "內蒙古博物院、大召周邊與克制的城市理解，先讀懂地方再進入大風景。", "住宿：呼和浩特"], ["第 3 天", "輝騰錫勒草原", "私人車前往草原，安排品質較好的旅宿或升級蒙古包，等日間人潮變少後再感受風。", "住宿：草原旅宿"], ["第 4 天", "草原清晨與不表演化的文化", "保留清晨，可選輕度騎馬與尊重地方的文化片段，不把一天塞成表演清單。", "住宿：呼和浩特或路線旅宿"], ["第 5 天", "庫布齊沙漠", "從草原走向沙漠。依光線、溫度與舒適度安排沙丘，額外活動先說清楚再選。", "住宿：沙漠或鄂爾多斯"], ["第 6 天", "鄂爾多斯與返程", "保留一個不趕的早晨，私人送機並預留交通緩衝。", "離開日"]],
  ja: [["1日目", "フフホトに到着", "専用車でお迎えし、宿へ。最初の夜はよい部屋と温かい食事で静かに整えます。", "宿泊：フフホト"], ["2日目", "フフホトの歴史と食卓", "内モンゴル博物院と大召周辺を歩き、大きな風景へ入る前に土地の背景を知ります。", "宿泊：フフホト"], ["3日目", "フイトンシレ草原", "専用車で草原へ。上質なロッジまたは設備のよいゲルを選び、人が少なくなる時間を残します。", "宿泊：草原の宿"], ["4日目", "草原の朝と穏やかな文化体験", "朝の余白、希望に応じた軽い乗馬、演出しすぎない地域文化を組み合わせます。", "宿泊：フフホトまたは途中の宿"], ["5日目", "クブチ砂漠", "草原から砂漠へ。光、気温、快適さを見て砂丘の時間を決め、追加体験は事前に選びます。", "宿泊：砂漠またはオルドス"], ["6日目", "オルドスから帰路へ", "急がない朝と専用送迎。空港まで十分な余白を持たせます。", "出発日"]],
  ko: [["1일차", "후허하오터 도착", "전용 픽업과 체크인 후 따뜻한 식사로 여행을 부드럽게 시작합니다.", "숙박: 후허하오터"], ["2일차", "도시의 역사와 현지 식탁", "내몽골 박물관과 다자오 일대를 천천히 보며 큰 풍경에 들어가기 전 지역을 이해합니다.", "숙박: 후허하오터"], ["3일차", "후이텅시러 초원", "전용 차량으로 초원 이동. 객실 수준이 좋은 로지나 업그레이드 게르를 선택하고 한적한 시간을 남깁니다.", "숙박: 초원 숙소"], ["4일차", "초원의 아침과 절제된 문화 체험", "여유로운 아침, 선택형 가벼운 승마와 과하게 연출하지 않은 현지 문화를 담습니다.", "숙박: 후허하오터 또는 루트 숙소"], ["5일차", "쿠부치 사막", "초원에서 사막으로 이동합니다. 빛, 기온, 편안함에 맞춰 사구 시간을 정하고 추가 활동은 미리 선택합니다.", "숙박: 사막 또는 오르도스"], ["6일차", "오르도스와 출발", "서두르지 않는 아침과 전용 공항 이동, 충분한 교통 버퍼를 둡니다.", "출발일"]],
  th: [["วันที่ 1", "ถึงฮูฮอต", "รถส่วนตัวรับ เช็กอิน และมื้อเย็นอุ่น ๆ เริ่มทริปอย่างสบาย", "พัก: ฮูฮอต"], ["วันที่ 2", "ประวัติศาสตร์เมืองและโต๊ะอาหารท้องถิ่น", "พิพิธภัณฑ์มองโกเลียในและย่านวัดต้าเจา เพื่อเข้าใจพื้นที่ก่อนออกสู่ภูมิทัศน์ใหญ่", "พัก: ฮูฮอต"], ["วันที่ 3", "ทุ่งหญ้าฮุยเถิงซีเล่อ", "รถส่วนตัวสู่ทุ่งหญ้า เลือกที่พักคุณภาพหรือเกอร์ที่อัปเกรด และมีเวลาหลังกลุ่มกลางวันกลับ", "พัก: ที่พักทุ่งหญ้า"], ["วันที่ 4", "เช้าบนทุ่งหญ้าและวัฒนธรรมอย่างพอดี", "เช้าที่ไม่รีบ ขี่ม้าเบา ๆ หากต้องการ และประสบการณ์วัฒนธรรมที่ไม่จัดฉากเกินไป", "พัก: ฮูฮอตหรือที่พักระหว่างทาง"], ["วันที่ 5", "ทะเลทรายคูปู้ฉี", "เดินทางจากทุ่งหญ้าสู่ทะเลทราย จัดเวลาเนินทรายตามแสง อุณหภูมิ และความสบาย", "พัก: ทะเลทรายหรือออร์ดอส"], ["วันที่ 6", "ออร์ดอสและเดินทางกลับ", "เช้าที่ไม่เร่ง รถส่วนตัวไปสนามบิน และเผื่อเวลาการเดินทาง", "วันออกเดินทาง"]],
};

const innerLabels = {
  en: { routes: "Routes", before: "Before China", pace: "Pace", paceValue: "City context · grassland stay · desert light", check: "First check", checkValue: "Season · room type · riding comfort · food", note: "Indicative land-arrangement prices. Flights, optional activities and unlisted upgrades are confirmed separately.", visual: ["Grassland stays are chosen for room comfort and quiet, not only appearance.", "Horse riding and desert activities remain optional and are discussed before booking.", "Road time and weather buffers are part of the route design."] },
  zh: { routes: "標準路線", before: "出發中國前", pace: "節奏", paceValue: "城市理解 · 草原住宿 · 沙漠光線", check: "先確認", checkValue: "季節 · 房型 · 騎馬接受度 · 餐食", note: "此為地接安排參考價；機票、可選活動與未列明升級會另行確認。", visual: ["草原住宿先看房間舒適與安靜，不只看外觀。", "騎馬與沙漠活動都是可選項，預訂前先說清楚。", "車程與天氣緩衝本來就是路線設計的一部分。"] },
  ja: { routes: "モデルルート", before: "中国へ行く前に", pace: "ペース", paceValue: "都市の背景 · 草原の宿 · 砂漠の光", check: "最初の確認", checkValue: "季節 · 部屋 · 乗馬 · 食事", note: "現地手配の参考料金です。航空券、追加体験、記載外のアップグレードは別途確認します。", visual: ["草原の宿は見た目だけでなく、部屋の快適さと静けさで選びます。", "乗馬と砂漠の活動は任意で、予約前に相談します。", "移動時間と天候の余白も旅程の一部です。"] },
  ko: { routes: "표준 루트", before: "중국 출발 전", pace: "속도", paceValue: "도시 맥락 · 초원 숙소 · 사막의 빛", check: "첫 확인", checkValue: "계절 · 객실 · 승마 · 식사", note: "현지 일정 참고가입니다. 항공권, 선택 활동, 미기재 업그레이드는 별도 확인합니다.", visual: ["초원 숙소는 외관뿐 아니라 객실의 편안함과 고요함으로 고릅니다.", "승마와 사막 활동은 선택 사항이며 예약 전에 논의합니다.", "이동 시간과 날씨 버퍼도 루트 설계의 일부입니다."] },
  th: { routes: "เส้นทางตัวอย่าง", before: "ก่อนเดินทางจีน", pace: "จังหวะ", paceValue: "เข้าใจเมือง · พักทุ่งหญ้า · แสงทะเลทราย", check: "ตรวจครั้งแรก", checkValue: "ฤดูกาล · ห้องพัก · ขี่ม้า · อาหาร", note: "เป็นราคาอ้างอิงบริการในพื้นที่ ไม่รวมเที่ยวบิน กิจกรรมเสริม และการอัปเกรดที่ไม่ได้ระบุ", visual: ["เลือกที่พักทุ่งหญ้าจากความสบายและความเงียบ ไม่ใช่แค่รูปลักษณ์", "ขี่ม้าและกิจกรรมทะเลทรายเป็นตัวเลือกและคุยก่อนจอง", "เวลาเดินทางและเวลาเผื่ออากาศเป็นส่วนหนึ่งของการออกแบบเส้นทาง"] },
};

const genericChoices = {
  en: { multi: "Multiple regions", unsure: "Not sure yet" },
  zh: { multi: "多個地區", unsure: "還不確定" },
  ja: { multi: "複数地域", unsure: "まだ決めていない" },
  ko: { multi: "여러 지역", unsure: "아직 정하지 않음" },
  th: { multi: "หลายพื้นที่", unsure: "ยังไม่แน่ใจ" },
};

function esc(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function title(value, level = "h2") {
  if (!Array.isArray(value)) return `<${level}>${esc(value)}</${level}>`;
  return `<${level} class="cjk-title">${value.map((line) => `<span class="title-line">${esc(line)}</span>`).join("")}</${level}>`;
}

function routeUrl(slug, lang) {
  return lang === "en" ? `/${slug}.html` : `/${lang}/${slug}/`;
}

function options(placeholder, values) {
  return `<option value="" disabled selected>${esc(placeholder)}</option>${values.map((value) => `<option value="${esc(value)}">${esc(value)}</option>`).join("")}`;
}

function routeCards(lang, locale) {
  return routes.map((route) => `<article class="product-route-card">
        <a class="product-route-image" href="${routeUrl(route.slug, lang)}"><img loading="lazy" src="${route.image}" alt="${esc(route.name[lang])}"><span>${esc(route.days[lang])}</span></a>
        <div class="product-route-copy"><p class="eyebrow">${esc(route.name[lang])}</p><h3>${esc(route.title[lang])}</h3>
          <dl class="product-route-meta"><div><dt>${esc(locale.fromLabel)}</dt><dd>${esc(route.price[lang])}</dd></div><div><dt>${esc(locale.groupLabel)}</dt><dd>${esc(locale.groupText)}</dd></div><div><dt>${esc(locale.routeLabel)}</dt><dd>${esc(route.route[lang])}</dd></div></dl>
          <ol class="mini-days">${route.daysShort[lang].map((item) => `<li>${esc(item)}</li>`).join("")}</ol><a class="text-link" href="${routeUrl(route.slug, lang)}#day-plan">${esc(locale.viewRoute)}</a>
        </div></article>`).join("");
}

function leadForm(lang, locale) {
  const destinationOptions = routes.map((route) => `<option value="${route.slug}">${esc(route.name[lang])}</option>`).join("");
  const choices = genericChoices[lang];
  return `<form class="lead-form home-lead-form" data-sheet-endpoint="${sheetEndpoint}" data-form-lang="${lang}" data-sending-message="${esc(locale.sending)}" data-success-message="${esc(locale.success)}" data-error-message="${esc(locale.error)}" data-lead-value="1200" data-lead-currency="${locale.currency}" name="bluehour-china-home-${lang}" method="POST" action="${emailEndpoint}">
          <input type="hidden" name="_next" value="https://bluehourchina.com/thanks.html?source=home_inline&amp;angle=private_route">
          <input type="hidden" name="_subject" value="Bluehour China private route inquiry">
          <input type="hidden" name="_template" value="table"><input type="hidden" name="_captcha" value="false"><input type="hidden" name="form-name" value="bluehour-china-home-${lang}">
          <input type="hidden" name="submitted_at" value=""><input type="hidden" name="status" value="New"><input type="hidden" name="priority" value="High"><input type="hidden" name="campaign" value="private_route_consultation"><input type="hidden" name="next_step" value="Prepare route direction and starting quote"><input type="hidden" name="intake_provider" value="google_sheet_webapp"><input type="hidden" name="language" value="${esc(locale.language)}"><input type="hidden" name="page_url" value=""><input type="hidden" name="referrer" value=""><input type="hidden" name="utm_source" value="home"><input type="hidden" name="utm_medium" value="website"><input type="hidden" name="utm_campaign" value="private_route_consultation"><input type="hidden" name="intent_angle" value="home_inline_private_route"><input type="hidden" name="source_path" value="${locale.homeUrl}"><input type="hidden" name="source_content" value="private-journey-home-form"><input type="hidden" name="lead_currency" value="${locale.currency}">
          <div class="hp-field" aria-hidden="true"><label>Leave this field empty<input type="text" name="bot-field" tabindex="-1" autocomplete="off"></label></div>
          <input type="text" name="name" placeholder="${esc(locale.placeholders.name)}" aria-label="${esc(locale.placeholders.name)}" autocomplete="name" required>
          <input type="text" name="contact" placeholder="${esc(locale.placeholders.contact)}" aria-label="${esc(locale.placeholders.contact)}" autocomplete="email" required>
          <select name="destination" aria-label="${esc(locale.placeholders.destination)}" required>${options(locale.placeholders.destination, [])}${destinationOptions}<option value="multi-region">${esc(choices.multi)}</option><option value="not-sure">${esc(choices.unsure)}</option></select>
          <select name="travel_window" aria-label="${esc(locale.placeholders.window)}" required>${options(locale.placeholders.window, locale.windowOptions)}</select>
          <select name="route_days" aria-label="${esc(locale.placeholders.days)}" required>${options(locale.placeholders.days, locale.dayOptions)}</select>
          <select name="group_size" aria-label="${esc(locale.placeholders.group)}" required>${options(locale.placeholders.group, locale.groupOptions)}</select>
          <select name="budget" aria-label="${esc(locale.placeholders.budget)}" required>${options(locale.placeholders.budget, locale.budgetOptions)}</select>
          <textarea name="message" placeholder="${esc(locale.placeholders.note)}" aria-label="${esc(locale.placeholders.note)}"></textarea>
          <button type="submit">${esc(locale.submit)}</button><p class="form-consent">${esc(locale.consent)} <a href="/privacy.html">Privacy</a></p><p class="form-fallback">${esc(locale.error)} <a href="mailto:bluehourchina@gmail.com">bluehourchina@gmail.com</a></p>
        </form>`;
}

function renderMain(lang, locale) {
  return `<main>
    <section class="hero home-hero"><div class="hero-media" aria-hidden="true"><div class="hero-scene lake"></div><div class="hero-scene yunnan"></div><div class="hero-scene sanya"></div></div><div class="wrap hero-inner"><p class="eyebrow">${esc(locale.heroEyebrow)}</p>${title(locale.heroTitle, "h1")}<p class="lead">${esc(locale.heroLead)}</p><div class="hero-actions"><a class="btn primary" href="#places">${esc(locale.heroPrimary)}</a><a class="btn" href="#plan-trip">${esc(locale.heroSecondary)}</a></div><div class="hero-proofline">${locale.heroProof.map((item) => `<span>${esc(item)}</span>`).join("")}</div></div></section>
    <section class="section product-routes-band" id="places"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${esc(locale.routesEyebrow)}</p>${title(locale.routesTitle)}</div><p>${esc(locale.routesIntro)}</p></div><div class="product-route-grid">${routeCards(lang, locale)}</div></div></section>
    <section class="section conversion-band" id="process"><div class="wrap conversion-wrap"><div class="conversion-copy"><p class="eyebrow">${esc(locale.processEyebrow)}</p>${title(locale.processTitle)}<div class="hero-actions"><a class="btn primary dark-gold" href="#plan-trip">${esc(locale.heroSecondary)}</a></div></div><div class="conversion-steps">${locale.process.map(([n, heading, body]) => `<article><b>${esc(n)}</b><h3>${esc(heading)}</h3><p>${esc(body)}</p></article>`).join("")}</div></div></section>
    <section class="section service-band" id="care"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${esc(locale.careEyebrow)}</p>${title(locale.careTitle)}</div><p>${esc(locale.careIntro)}</p></div><div class="promise-grid">${locale.care.map(([heading, body]) => `<article class="promise"><h3>${esc(heading)}</h3><p>${esc(body)}</p></article>`).join("")}</div></div></section>
    <section class="section search-intent-band compact-guides" id="stories"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${esc(locale.guidesEyebrow)}</p>${title(locale.guidesTitle)}</div><p>${esc(locale.guidesIntro)}</p></div><div class="search-intent-grid">${locale.guides.map(([label, heading, href, link]) => `<article class="search-intent-card"><b>${esc(label)}</b><h3>${esc(heading)}</h3><a href="${href}">${esc(link)}</a></article>`).join("")}</div></div></section>
    <section class="section home-intake-band" id="plan-trip"><div class="wrap home-intake-grid"><div class="home-intake-copy"><p class="eyebrow">${esc(locale.formEyebrow)}</p>${title(locale.formTitle)}<p>${esc(locale.formIntro)}</p><strong>${esc(locale.responseNote)}</strong></div>${leadForm(lang, locale)}</div></section>
  </main>`;
}

function renderRouteCare(locale) {
  return `<section class="section care-band" id="care">
      <div class="wrap">
        <div class="section-head"><div><p class="eyebrow">${esc(locale.careEyebrow)}</p>${title(locale.careTitle)}</div><p>${esc(locale.careIntro)}</p></div>
        <div class="care-grid">${locale.care.map(([heading, body]) => `<article class="care"><h3>${esc(heading)}</h3><p>${esc(body)}</p></article>`).join("")}</div>
      </div>
    </section>`;
}

function updateHome(file, lang, locale) {
  const url = new URL(file, root);
  const planHref = `${locale.homeUrl}?utm_source=home_cta&utm_medium=site&utm_campaign=private_route_consultation#plan-trip`;
  let html = fs.readFileSync(url, "utf8");
  html = html.replace(/<main>[\s\S]*?<\/main>/, renderMain(lang, locale));
  html = html.replace(/(<a class="nav-cta" href=")[^"]*("[^>]*>)[^<]*(<\/a>)/, `$1#plan-trip$2${locale.navCta}$3`);
  html = html.replace(/(<a class="sticky-review" href=")[^"]*("[^>]*>)[^<]*(<\/a>)/, `$1#plan-trip$2${locale.navCta}$3`);
  html = html.replaceAll('href="#plan-trip"', `href="${planHref}"`);
  if (!html.includes("/assets/lead-form-20260706-sheet.js")) html = html.replace("</body>", "  <script src=\"/assets/lead-form-20260706-sheet.js\" defer></script>\n</body>");
  fs.writeFileSync(url, html);
}

function innerPage(lang, locale) {
  const route = routes.find((item) => item.slug === "inner-mongolia");
  const labels = innerLabels[lang];
  const descriptions = { en: "A 6-day private Inner Mongolia route through Hohhot, Huitengxile grassland, Kubuqi Desert and Ordos, with one public starting price based on 6 travellers.", zh: "6 天 5 晚內蒙古私人路線，串起呼和浩特、輝騰錫勒草原、庫布齊沙漠與鄂爾多斯，公開 6 人同行參考起價。", ja: "フフホト、フイトンシレ草原、クブチ砂漠、オルドスを巡る6日間の内モンゴル個別ルート。公開料金は6名利用時の最低料金です。", ko: "후허하오터, 후이텅시러 초원, 쿠부치 사막, 오르도스를 잇는 6일 내몽골 개인 루트입니다. 공개 최저가는 6명 기준입니다.", th: "เส้นทางส่วนตัว 6 วันในมองโกเลียใน ผ่านฮูฮอต ทุ่งหญ้าฮุยเถิงซีเล่อ ทะเลทรายคูปู้ฉี และออร์ดอส โดยแสดงราคาเริ่มต้นสำหรับ 6 ท่านเพียงราคาเดียว" };
  const leads = { en: "Grassland wind, a refined lodge, desert light and private transfers in one clear route.", zh: "草原的風、品質旅宿、沙漠光線與私人接送，收進一條看得懂的 6 天路線。", ja: "草原の風、上質な宿、砂漠の光、専用車を一つの明確な旅へ。", ko: "초원의 바람, 좋은 숙소, 사막의 빛, 전용 이동을 한 루트에 담았습니다.", th: "ลมทุ่งหญ้า ที่พักคุณภาพ แสงทะเลทราย และรถส่วนตัวในเส้นทางที่ชัดเจน" };
  const tiers = { en: [["6 travellers", "US$850 pp"]], zh: [["6 人", "RMB 6,150/人"]], ja: [["6名", "JPY 136,000/名"]], ko: [["6명", "KRW 1,180,000/인"]], th: [["6 ท่าน", "THB 28,000/ท่าน"]] };
  const pageDays = innerDays[lang] || innerDays.en;
  const dayHtml = pageDays.map(([label, heading, body, stay]) => `<article class="route-day-item"><div class="route-day-index">${esc(label)}</div><div class="route-day-copy"><h3>${esc(heading)}</h3><p>${esc(body)}</p><span>${esc(stay)}</span></div></article>`).join("");
  const tierHtml = tiers[lang].map(([group, price]) => `<div><b>${esc(group)}</b><span>${esc(price)}</span></div>`).join("");
  const canonical = lang === "en" ? "https://bluehourchina.com/inner-mongolia.html" : `https://bluehourchina.com/${lang}/inner-mongolia/`;
  const cta = `${locale.interest}?utm_source=inner_mongolia&utm_medium=site&utm_campaign=private_route_consultation&destination=inner-mongolia`;
  const metaCurrency = locale.currency;
  const low = tiers[lang][tiers[lang].length - 1][1].replace(/[^0-9,]/g, "").replaceAll(",", "");
  const high = tiers[lang][0][1].replace(/[^0-9,]/g, "").replaceAll(",", "");
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1"><title>${esc(route.title[lang])}｜Bluehour China</title><meta name="description" content="${esc(descriptions[lang])}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="en" href="https://bluehourchina.com/inner-mongolia.html"><link rel="alternate" hreflang="zh-Hant" href="https://bluehourchina.com/zh/inner-mongolia/"><link rel="alternate" hreflang="ja" href="https://bluehourchina.com/ja/inner-mongolia/"><link rel="alternate" hreflang="ko" href="https://bluehourchina.com/ko/inner-mongolia/"><link rel="alternate" hreflang="th" href="https://bluehourchina.com/th/inner-mongolia/"><link rel="alternate" hreflang="x-default" href="https://bluehourchina.com/inner-mongolia.html"><link rel="icon" type="image/svg+xml" href="/assets/ruoqing-avatar.svg"><meta property="og:title" content="${esc(route.title[lang])}｜Bluehour China"><meta property="og:description" content="${esc(leads[lang])}"><meta property="og:type" content="website"><meta property="og:url" content="${canonical}"><meta property="og:image" content="https://bluehourchina.com${route.image}"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "Product", name: route.title[lang], brand: { "@type": "Brand", name: "Bluehour China Journeys" }, description: descriptions[lang], image: `https://bluehourchina.com${route.image}`, offers: { "@type": "AggregateOffer", priceCurrency: metaCurrency, lowPrice: low, highPrice: high, offerCount: "3", url: canonical }, additionalProperty: [{ "@type": "PropertyValue", name: locale.routeLabel, value: route.route[lang] }, { "@type": "PropertyValue", name: "Duration", value: route.days[lang] }, { "@type": "PropertyValue", name: locale.groupLabel, value: locale.groupText }, { "@type": "PropertyValue", name: "Price tiers", value: tiers[lang].map(([group, price]) => `${group}: ${price}`).join(" · ") }] })}</script><link rel="stylesheet" href="/assets/luxury-multilang.css?v=20260711-routes5"><link rel="stylesheet" href="/assets/heading-polish.css?v=20260711-routes5"></head>
  <body style="--hero-image:url('${route.image}');--cta-image:url('${route.image}')"><nav class="nav" aria-label="Primary navigation"><a class="brand" href="${locale.homeUrl}"><img src="/assets/ruoqing-avatar.svg" alt="" aria-hidden="true"><span><strong>Bluehour China</strong><span>若青中國旅策</span></span></a><div class="nav-links"><a href="${locale.homeUrl}#places">${esc(labels.routes)}</a><a href="/before-china/">${esc(labels.before)}</a><a class="nav-cta" href="${cta}">${esc(locale.navCta)}</a></div></nav>
  <main><section class="hero destination-hero"><div class="wrap hero-inner"><p class="eyebrow">${esc(route.days[lang])} · ${esc(route.name[lang])}</p><h1>${esc(route.title[lang])}</h1><p class="lead">${esc(leads[lang])}</p><div class="hero-actions"><a class="btn primary" href="${cta}">${esc(locale.heroSecondary)}</a><a class="btn" href="${locale.homeUrl}#places">${esc(locale.heroPrimary)}</a></div><div class="facts"><div class="fact"><b>${esc(locale.fromLabel)}</b><span>${esc(route.price[lang])}</span></div><div class="fact"><b>${esc(locale.groupLabel)}</b><span>${esc(locale.groupText)}</span></div><div class="fact"><b>${esc(locale.routeLabel)}</b><span>${esc(route.route[lang])}</span></div></div></div></section>
    <section class="section standard-route-band"><div class="wrap route-showcase"><div class="route-copy"><p class="eyebrow">${esc(locale.routesEyebrow)}</p><h2>${esc(route.title[lang])}</h2><p>${esc(descriptions[lang])}</p><div class="route-price"><span>${esc(route.days[lang])}</span><strong>${esc(route.price[lang])}</strong><small>${esc(locale.groupText)}</small><div class="route-price-tiers">${tierHtml}</div></div><div class="route-points"><div><b>${esc(locale.routeLabel)}</b><span>${esc(route.route[lang])}</span></div><div><b>${esc(labels.pace)}</b><span>${esc(labels.paceValue)}</span></div><div><b>${esc(locale.groupLabel)}</b><span>${esc(locale.groupText)}</span></div><div><b>${esc(labels.check)}</b><span>${esc(labels.checkValue)}</span></div></div><p class="route-note">${esc(labels.note)}</p></div><div class="route-card"><div class="route-image"><img src="${route.image}" alt="${esc(route.title[lang])}"></div><div class="route-map"><h3>${esc(locale.routeLabel)}</h3><div class="map-line">${route.daysShort[lang].map((item) => `<span>${esc(item)}</span>`).join("")}</div></div></div></div></section>
    <section class="section route-day-plan-band" id="day-plan"><div class="wrap route-day-plan-wrap"><div class="route-day-head"><div><p class="eyebrow">${esc(locale.routesEyebrow)}</p><h2>${esc(route.title[lang])}</h2><p>${esc(locale.routesIntro)}</p></div><div class="route-terms"><div><b>${esc(locale.fromLabel)}</b><span>${esc(route.price[lang])}</span></div><div><b>${esc(locale.groupLabel)}</b><span>${esc(locale.groupText)}</span></div></div></div><div class="route-day-layout"><div class="route-day-list">${dayHtml}</div><aside class="route-visual-panel"><figure><img src="${route.image}" alt="${esc(route.title[lang])}"><figcaption>${esc(route.route[lang])}</figcaption></figure><ul class="route-visual-notes">${labels.visual.map((item, index) => `<li><b>${String(index + 1).padStart(2, "0")}</b><span>${esc(item)}</span></li>`).join("")}</ul><a class="btn primary dark-gold" href="${cta}">${esc(locale.heroSecondary)}</a></aside></div></div></section>
    <section class="section service-band" id="care"><div class="wrap"><div class="section-head"><div><p class="eyebrow">${esc(locale.careEyebrow)}</p>${title(locale.careTitle)}</div><p>${esc(locale.careIntro)}</p></div><div class="promise-grid">${locale.care.map(([heading, body]) => `<article class="promise"><h3>${esc(heading)}</h3><p>${esc(body)}</p></article>`).join("")}</div></div></section>
    <section class="cta"><div class="wrap"><p class="eyebrow">${esc(locale.formEyebrow)}</p>${title(locale.formTitle)}<p>${esc(locale.formIntro)}</p><div class="hero-actions"><a class="btn primary" href="${cta}">${esc(locale.heroSecondary)}</a><a class="btn" href="${locale.homeUrl}#places">${esc(locale.heroPrimary)}</a></div></div></section></main><footer class="footer"><div class="wrap"><span>Bluehour China Journeys｜若青中國旅策</span><span><a href="/credits.html">Image credits</a> · <a href="/privacy.html">Privacy</a> · <a href="/llms.txt">AI-readable summary</a></span></div></footer><a class="sticky-review" href="${cta}">${esc(locale.navCta)}</a></body></html>`;
}

for (const [lang, locale] of Object.entries(locales)) {
  for (const file of locale.homeFiles) updateHome(file, lang, locale);
  const pageFiles = lang === "en" ? ["inner-mongolia.html", "en/inner-mongolia/index.html"] : [`${lang}/inner-mongolia/index.html`];
  for (const file of pageFiles) {
    const url = new URL(file, root);
    fs.mkdirSync(path.dirname(fileURLToPath(url)), { recursive: true });
    let html = innerPage(lang, locale);
    if (lang === "zh") {
      html = html.replace(
        "<strong>Bluehour China</strong><span>若青中國旅策</span>",
        "<strong>若青中國</strong><span>BLUEHOUR CHINA</span>",
      );
    }
    fs.writeFileSync(url, html);
  }
  const routeFiles = routes
    .filter((route) => route.slug !== "inner-mongolia")
    .flatMap((route) => lang === "en" ? [`${route.slug}.html`, `en/${route.slug}/index.html`] : [`${lang}/${route.slug}/index.html`]);
  for (const file of routeFiles) {
    const url = new URL(file, root);
    if (!fs.existsSync(url)) continue;
    let html = fs.readFileSync(url, "utf8");
    html = html.replace(/<section class="section care-band" id="care">[\s\S]*?<\/section>/, renderRouteCare(locale));
    fs.writeFileSync(url, html);
  }
}

for (const file of ["route-note/index.html", "interest.html", "en/interest/index.html", "zh/interest/index.html", "ja/interest/index.html", "ko/interest/index.html", "th/interest/index.html"]) {
  const url = new URL(file, root);
  if (!fs.existsSync(url)) continue;
  let html = fs.readFileSync(url, "utf8");
  const lang = html.match(/<html lang="([^"]+)/)?.[1]?.slice(0, 2) || "en";
  const label = routes.find((route) => route.slug === "inner-mongolia")?.name[lang] || "Inner Mongolia";
  if (!html.includes('value="inner-mongolia"')) html = html.replace(/(<option value="northeast"[^>]*>[^<]*<\/option>)/, `$1<option value="inner-mongolia">${esc(label)}</option>`);
  fs.writeFileSync(url, html);
}

const sitemapUrl = new URL("sitemap.xml", root);
let sitemap = fs.readFileSync(sitemapUrl, "utf8");
const sitemapEntries = ["https://bluehourchina.com/inner-mongolia.html", "https://bluehourchina.com/en/inner-mongolia/", "https://bluehourchina.com/zh/inner-mongolia/", "https://bluehourchina.com/ja/inner-mongolia/", "https://bluehourchina.com/ko/inner-mongolia/", "https://bluehourchina.com/th/inner-mongolia/"];
for (const loc of sitemapEntries) if (!sitemap.includes(`<loc>${loc}</loc>`)) sitemap = sitemap.replace("</urlset>", `  <url><loc>${loc}</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>\n</urlset>`);
fs.writeFileSync(sitemapUrl, sitemap);

for (const file of ["llms.txt", "llms-full.txt"]) {
  const url = new URL(file, root);
  let text = fs.readFileSync(url, "utf8");
  if (!text.includes("inner-mongolia.html")) text += `\n- Inner Mongolia private route: https://bluehourchina.com/inner-mongolia.html (6 days, Hohhot, Huitengxile grassland, Kubuqi Desert and Ordos; private from 2 travellers).\n`;
  fs.writeFileSync(url, text);
}

console.log("private-journey-funnel-refined");
await import("./sync-home-route-products.mjs");
await import("./expand-destination-photo-galleries.mjs");
await import("./normalize-home-destination-copy.mjs");
// Always finish generated pages with the site's single-currency retail policy.
await import("./apply-retail-margin-prices.mjs");
