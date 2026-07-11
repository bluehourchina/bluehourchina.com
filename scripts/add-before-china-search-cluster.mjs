import fs from "node:fs/promises";
import path from "node:path";

const pages = [
  {
    lang: "en",
    file: "before-china/wechat-pay-visa-mastercard/index.html",
    canonical: "https://bluehourchina.com/before-china/wechat-pay-visa-mastercard/",
    alternate: "https://bluehourchina.com/zh/before-china/wechat-pay-visa-mastercard/",
    title: "WeChat Pay Visa Mastercard in China｜Foreigner Setup Guide｜Bluehour China",
    description: "Can foreigners use WeChat Pay with Visa or Mastercard in China? A practical pre-trip setup guide with limits, backup payment advice and route support.",
    keywords: "WeChat Pay Visa Mastercard China, WeChat Pay foreign card, how to use WeChat Pay in China foreigner, China travel payment, China mobile payment for tourists",
    ogTitle: "WeChat Pay with Visa or Mastercard in China",
    headline: "WeChat Pay with Visa or Mastercard in China",
    eyebrow: "Before China · Payment",
    h1: "Set up WeChat Pay before the beautiful part begins",
    lead: "For many foreign travellers, China becomes easy only after the quiet payment layer works. Prepare the app before landing, then keep a backup plan.",
    navCurrent: "Before China",
    navBack: "Before China",
    navBackHref: "/before-china/",
    ctaText: "Ask us to check your route",
    ctaHref: "/interest.html?utm_source=wechat_pay_guide&utm_medium=site&utm_campaign=before_china_search_cluster",
    sections: [
      {
        id: "answer",
        eyebrow: "Short answer",
        title: "Yes, but treat it as travel payment, not a full local wallet",
        paragraphs: [
          "Beijing's official English service page says WeChat Pay supports several overseas credit cards, including JCB, Visa and Mastercard. It also says travellers without mainland bank cards may bind Visa, Mastercard or JCB for supported consumption scenarios.",
          "The same page notes an important limit: this setup is for consumption and may not support general transfers or red packets. For travel, that means WeChat Pay can be useful, but it should not be your only payment method."
        ]
      },
      {
        id: "steps",
        eyebrow: "Setup sequence",
        title: "What to prepare before departure",
        list: [
          "Install or update WeChat while you still have stable access to your usual phone number.",
          "Prepare your passport name, card details and billing information.",
          "Keep the phone number tied to the card reachable for SMS verification.",
          "Follow the in-app payment wallet path. Official guidance describes Me, Wallet, Bank Card, then Add a New Bank Card, though labels may vary by region and app version.",
          "Create the payment password when prompted.",
          "After arrival, test a small payment before relying on it for a full travel day."
        ]
      },
      {
        id: "backup",
        eyebrow: "Backup",
        title: "Do not arrive with only one way to pay",
        paragraphs: [
          "China's payment environment is convenient once it works, but a traveller should still carry redundancy: a second card, a small cash layer, saved hotel details and a working data plan.",
          "This matters more outside Beijing and Shanghai. A beautiful Yunnan or Xinjiang route can become tense if payment, ticketing, driver contact or hotel communication fails on a transfer day."
        ]
      },
      {
        id: "route",
        eyebrow: "Route support",
        title: "Payment is part of route comfort",
        paragraphs: [
          "For regional China, we review practical readiness together with the route: arrival time, hotel location, long drives, language handoff, payment backup and whether a local provider should hold key moments.",
          "If you already know your travel month, group size and destination, send us the brief. We will reply with a route note and starting quote before any local-provider matching."
        ],
        cta: true
      }
    ],
    faq: [
      ["Can foreigners use WeChat Pay with Visa or Mastercard in China?", "Official Beijing guidance says WeChat Pay supports several overseas credit cards including JCB, Visa and Mastercard for supported consumption scenarios."],
      ["Can I use WeChat Pay for transfers?", "The official Beijing page notes the foreign-card setup may not support general transfers or red packets. Treat it as a travel consumption tool."],
      ["Should I still bring cash?", "Yes. Carry a small cash backup and a second card in case app setup, network, issuer or merchant acceptance fails."],
      ["Why does this matter for private China travel?", "Outside the largest cities, payment and phone readiness affect ticketing, transport, hotel communication and daily comfort."]
    ]
  },
  {
    lang: "en",
    file: "before-china/china-payment-checklist/index.html",
    canonical: "https://bluehourchina.com/before-china/china-payment-checklist/",
    alternate: "https://bluehourchina.com/zh/before-china/china-payment-checklist/",
    title: "China Travel Payment Checklist｜WeChat Pay, Alipay, Card and Cash｜Bluehour China",
    description: "A practical China travel payment checklist for foreign visitors: mobile payment, WeChat Pay, Alipay, backup cards, cash and route-specific payment risks.",
    keywords: "China travel payment checklist, Alipay China foreigner, WeChat Pay tourist China, Visa Mastercard China travel, China payment for foreigners",
    ogTitle: "China Travel Payment Checklist",
    headline: "China Travel Payment Checklist",
    eyebrow: "Before China · Payment",
    h1: "Prepare layers, not one perfect payment method",
    lead: "A calm trip is rarely built on a single app. Before China, prepare mobile payment, cards, cash and the small details that keep transfer days quiet.",
    navCurrent: "Before China",
    navBack: "Before China",
    navBackHref: "/before-china/",
    ctaText: "Check my route",
    ctaHref: "/interest.html?utm_source=payment_checklist&utm_medium=site&utm_campaign=before_china_search_cluster",
    sections: [
      {
        id: "answer",
        eyebrow: "Short answer",
        title: "Use mobile payment, but keep a second layer",
        paragraphs: [
          "The Chinese Embassy in the UK describes several payment options for visitors to China, including bank cards, mobile payment, cash, bank account and e-CNY. For a foreign traveller, the practical conclusion is simple: prepare more than one layer.",
          "Mobile payment is the everyday default in many places, but cards, cash and phone verification still matter when an app, issuer or merchant does not behave as expected."
        ]
      },
      {
        id: "checklist",
        eyebrow: "Checklist",
        title: "The payment setup we would check first",
        list: [
          "Set up WeChat Pay or Alipay where available before departure.",
          "Keep at least one international card as backup.",
          "Carry a small amount of RMB cash for edge cases.",
          "Confirm your phone can receive SMS verification.",
          "Save hotel names, addresses and phone numbers in Chinese.",
          "Avoid planning tight transfer days before you have tested payments locally."
        ]
      },
      {
        id: "where",
        eyebrow: "Regional travel",
        title: "Payment friction is not the same everywhere",
        paragraphs: [
          "In Beijing and Shanghai, many mistakes are absorbed by infrastructure and English-language exposure. In Yunnan, Xinjiang, Dunhuang or winter Northeast China, a small payment issue can affect car timing, ticket pickup, hotel check-in or dinner after a long transfer.",
          "This is why we place payment readiness inside route planning rather than treating it as a separate travel tip."
        ]
      },
      {
        id: "support",
        eyebrow: "Private check",
        title: "Let the route decide how much support you need",
        paragraphs: [
          "A resort stay in Sanya needs a different practical plan from a long road across Xinjiang or a quiet Yunnan route through smaller towns. Tell us your season, route, group size and comfort level, and we will flag the practical gaps before they become expensive."
        ],
        cta: true
      }
    ],
    faq: [
      ["What payment methods should I prepare for China?", "Prepare mobile payment where available, at least one backup card, a small cash layer and reliable phone verification."],
      ["Is Alipay or WeChat Pay better for foreigners?", "Availability can depend on app version, card issuer, phone number and merchant. Many travellers prepare both when possible, then test after arrival."],
      ["Can I use only Visa or Mastercard in China?", "Do not rely on card acceptance alone. China is highly mobile-payment oriented, and acceptance varies by city, merchant and scenario."],
      ["What should I do before leaving the airport?", "Confirm data works, test payment with a small purchase, and save hotel details in Chinese before the first transfer."]
    ]
  },
  {
    lang: "en",
    file: "before-china/china-travel-apps-before-trip/index.html",
    canonical: "https://bluehourchina.com/before-china/china-travel-apps-before-trip/",
    alternate: "https://bluehourchina.com/zh/before-china/china-travel-apps-before-trip/",
    title: "China Travel Apps Before Your Trip｜Payment, Data, Maps and Translation｜Bluehour China",
    description: "Which China travel apps and phone basics should foreign travellers prepare before landing: payment, data, SMS, maps, translation, hotel addresses and route support.",
    keywords: "China travel apps before trip, apps needed for China travel, China eSIM SMS verification, China travel preparation, China maps translation payment apps",
    ogTitle: "China Travel Apps Before Your Trip",
    headline: "China Travel Apps Before Your Trip",
    eyebrow: "Before China · Phone setup",
    h1: "Make your phone useful before the road gets quiet",
    lead: "The most stressful China travel moments often happen before the scenery: verification codes, hotel addresses, ride pickup points, maps and translation.",
    navCurrent: "Before China",
    navBack: "Before China",
    navBackHref: "/before-china/",
    ctaText: "Check my practical route gaps",
    ctaHref: "/interest.html?utm_source=travel_apps_guide&utm_medium=site&utm_campaign=before_china_search_cluster",
    sections: [
      {
        id: "answer",
        eyebrow: "Short answer",
        title: "Prepare the phone layer before you need it",
        paragraphs: [
          "Before travelling to China, prepare payment apps, mobile data, SMS verification, maps, translation and offline hotel details. None of this is glamorous. All of it affects the first day.",
          "The deeper the route goes beyond Beijing and Shanghai, the more these small operations decide whether the journey feels calm."
        ]
      },
      {
        id: "apps",
        eyebrow: "Core setup",
        title: "The app and phone checklist",
        list: [
          "Payment: prepare WeChat Pay or Alipay where available and keep a backup card.",
          "Data: arrange roaming, eSIM or a local SIM plan before arrival.",
          "SMS: make sure the number tied to payment and bookings can receive verification codes.",
          "Maps: save hotel addresses and key pickup points in Chinese.",
          "Translation: prepare a translation app or Chinese phrases for hotel, driver and restaurant moments.",
          "Documents: keep passport, booking confirmations and emergency contacts available offline."
        ]
      },
      {
        id: "route",
        eyebrow: "Route reality",
        title: "Apps cannot repair an overpacked route",
        paragraphs: [
          "A good app setup helps, but it cannot make a rushed route comfortable. If the day already has a long drive, a late arrival, a language-sensitive handoff and a payment uncertainty, the risk compounds.",
          "For Yunnan, Xinjiang, Dunhuang, Sanya and Northeast China, we review the practical layer together with route mood and comfort level."
        ]
      },
      {
        id: "next",
        eyebrow: "Next step",
        title: "Send us the route before booking everything",
        paragraphs: [
          "Share travel month, group size, places under consideration, language needs and comfort expectations. We will reply with the places where the plan feels easy, and the points that need local support."
        ],
        cta: true
      }
    ],
    faq: [
      ["What apps do foreigners need before travelling to China?", "At minimum, prepare mobile payment, data/SMS access, maps, translation and offline booking details."],
      ["Do I need SMS verification in China?", "Often yes. Payment setup, bookings and account checks may require a reachable phone number, so confirm this before departure."],
      ["Should I save hotel addresses in Chinese?", "Yes. Save the Chinese address and phone number offline before each transfer day."],
      ["Can Bluehour China set up my apps for me?", "We do not operate personal accounts, but we can plan routes that account for payment, language, phone and local-support friction."]
    ]
  },
  {
    lang: "zh",
    file: "zh/before-china/wechat-pay-visa-mastercard/index.html",
    canonical: "https://bluehourchina.com/zh/before-china/wechat-pay-visa-mastercard/",
    alternate: "https://bluehourchina.com/before-china/wechat-pay-visa-mastercard/",
    title: "外國人微信支付綁 Visa / Mastercard｜出發中國前準備｜若青中國旅策",
    description: "外國旅客來中國前，如何理解微信支付綁 Visa / Mastercard 的可用場景、限制、備用付款與深度中國路線準備。",
    keywords: "外國人 微信支付 Visa Mastercard, 微信支付 綁海外卡, 外國人來中國支付, 中國旅遊支付準備, 微信支付 外國信用卡",
    ogTitle: "外國人微信支付綁 Visa / Mastercard",
    headline: "外國人微信支付綁 Visa / Mastercard",
    eyebrow: "出發中國前 · 支付",
    h1: "先讓支付安靜，再讓旅程開始",
    lead: "很多外國旅客來中國，真正先卡住的不是風景，而是支付、簡訊驗證、網路與第一段接送。",
    navCurrent: "出發準備",
    navBack: "出發準備",
    navBackHref: "/zh/before-china/",
    ctaText: "開始路線諮詢",
    ctaHref: "/zh/interest/?utm_source=wechat_pay_guide&utm_medium=site&utm_campaign=before_china_search_cluster",
    sections: [
      {
        id: "answer",
        eyebrow: "先說結論",
        title: "可以準備，但不要把它當成完整本地錢包",
        paragraphs: [
          "北京市英文官方服務頁說明，微信支付支援部分海外信用卡，包括 JCB、Visa 與 Mastercard。官方頁也提到，沒有中國大陸銀行卡的旅客，可以透過一般綁卡方式綁定 Visa、Mastercard 或 JCB，在支援場景中消費。",
          "同一頁也提醒，海外卡綁定主要用於消費，不一定支援一般轉帳或紅包。對旅客來說，它是重要工具，但不應該是唯一工具。"
        ]
      },
      {
        id: "steps",
        eyebrow: "設定順序",
        title: "出發前先準備這幾件事",
        list: [
          "在仍能穩定使用原手機號碼時，先安裝或更新微信。",
          "準備護照姓名、卡片資料與帳單資訊。",
          "確認綁卡手機號碼能收到簡訊驗證。",
          "依 App 裡的支付錢包路徑進入綁卡區。官方說明為 Me、Wallet、Bank Card、Add a New Bank Card；實際文字可能因版本或地區不同。",
          "依提示建立支付密碼。",
          "抵達後先測小額付款，再把它放進完整行程。"
        ]
      },
      {
        id: "backup",
        eyebrow: "備案",
        title: "不要只帶一種付款方式進中國",
        paragraphs: [
          "支付成功後，中國旅行會變得很順；但實務上仍應保留第二張卡、少量現金、住宿中文地址與可用網路。",
          "這一點在北京上海之外更重要。雲南或新疆的長移動日，如果支付、票務、司機聯絡或飯店溝通卡住，整天的節奏都會被影響。"
        ]
      },
      {
        id: "route",
        eyebrow: "路線照應",
        title: "支付也是路線舒適度的一部分",
        paragraphs: [
          "我們看深度中國路線時，會一起看抵達時間、住宿位置、車程、語言交接、付款備案，以及哪些關鍵時刻需要在地服務商照應。",
          "如果你已經知道月份、人數與想去地區，可以把需求交給我們。我們會先回一份路線筆記與起始報價方向。"
        ],
        cta: true
      }
    ],
    faq: [
      ["外國人可以用 Visa 或 Mastercard 綁微信支付嗎？", "北京市英文官方頁說明，微信支付支援部分海外信用卡，包括 JCB、Visa 與 Mastercard，並可用於支援的消費場景。"],
      ["可以用來轉帳或發紅包嗎？", "官方頁提醒，海外卡綁定主要支援消費，不一定支援一般轉帳或紅包。"],
      ["還需要現金嗎？", "需要少量備案。當 App、網路、發卡行或商戶端出問題時，現金可以降低風險。"],
      ["為什麼這跟旅遊路線有關？", "北京上海之外，支付與手機可用性會影響票務、接送、住宿溝通與每天的舒適度。"]
    ]
  },
  {
    lang: "zh",
    file: "zh/before-china/china-payment-checklist/index.html",
    canonical: "https://bluehourchina.com/zh/before-china/china-payment-checklist/",
    alternate: "https://bluehourchina.com/before-china/china-payment-checklist/",
    title: "外國人來中國支付準備清單｜微信、支付寶、卡片與現金｜若青中國旅策",
    description: "外國旅客出發中國前的支付準備清單：微信支付、支付寶、Visa / Mastercard、備用卡、少量現金與區域旅行支付風險。",
    keywords: "外國人來中國支付, 中國旅遊支付準備, 支付寶 外國人, 微信支付 外國人, Visa Mastercard 中國旅行",
    ogTitle: "外國人來中國支付準備清單",
    headline: "外國人來中國支付準備清單",
    eyebrow: "出發中國前 · 支付",
    h1: "不要押注一種完美支付方式",
    lead: "舒服的中國旅行，不是只靠一個 App，而是把行動支付、卡片、現金、手機驗證與路線節奏都先放好。",
    navCurrent: "出發準備",
    navBack: "出發準備",
    navBackHref: "/zh/before-china/",
    ctaText: "開始路線諮詢",
    ctaHref: "/zh/interest/?utm_source=payment_checklist&utm_medium=site&utm_campaign=before_china_search_cluster",
    sections: [
      {
        id: "answer",
        eyebrow: "先說結論",
        title: "行動支付要準備，第二層備案也要有",
        paragraphs: [
          "中國駐英國大使館的支付服務指南列出多種旅客支付方式，包括銀行卡、行動支付、現金、銀行帳戶與數字人民幣。對外國旅客來說，實務答案不是選一個，而是準備幾層。",
          "很多地方日常消費以行動支付為主，但 App、發卡行、手機驗證與商戶端接受度仍可能影響當天體驗。"
        ]
      },
      {
        id: "checklist",
        eyebrow: "清單",
        title: "我們會先檢查的支付準備",
        list: [
          "能設定微信支付或支付寶，就在出發前先設定。",
          "至少保留一張國際卡片作為備案。",
          "準備少量人民幣現金應對邊界情況。",
          "確認手機能收到簡訊驗證。",
          "把住宿名稱、中文地址與電話存離線。",
          "不要在付款方式尚未測試前，安排過緊的轉場日。"
        ]
      },
      {
        id: "where",
        eyebrow: "區域旅行",
        title: "支付摩擦在每個地方不一樣",
        paragraphs: [
          "北京與上海會吸收很多錯誤；到了雲南、新疆、敦煌或東北冬季路線，小小的付款問題可能牽動車程、票務、入住或長途移動後的晚餐。",
          "所以我們不把支付準備當成孤立提醒，而是放進整體路線判斷。"
        ]
      },
      {
        id: "support",
        eyebrow: "私人初談",
        title: "讓路線決定需要多少照應",
        paragraphs: [
          "三亞的度假型停留，跟新疆長路線、雲南古鎮慢路線，需要的準備不一樣。把季節、人數、地點與舒適需求交給我們，我們會先指出哪些地方容易卡住。"
        ],
        cta: true
      }
    ],
    faq: [
      ["外國人來中國應該準備哪些支付方式？", "先準備行動支付，再保留備用卡、少量現金與可用手機驗證。"],
      ["支付寶或微信支付哪個比較適合外國人？", "會受到 App 版本、發卡行、手機號碼與商戶場景影響。若可行，兩者都先準備，抵達後再測試。"],
      ["只帶 Visa 或 Mastercard 可以嗎？", "不建議只靠實體卡。中國日常支付高度依賴行動支付，接受度會因城市與場景不同。"],
      ["離開機場前要確認什麼？", "先確認網路可用、付款能測小額交易，並把住宿中文地址保存好。"]
    ]
  },
  {
    lang: "zh",
    file: "zh/before-china/china-travel-apps-before-trip/index.html",
    canonical: "https://bluehourchina.com/zh/before-china/china-travel-apps-before-trip/",
    alternate: "https://bluehourchina.com/before-china/china-travel-apps-before-trip/",
    title: "出發中國前必備 App 與手機準備｜支付、網路、地圖、翻譯｜若青中國旅策",
    description: "外國旅客出發中國前應先準備的 App 與手機操作：支付、網路、簡訊驗證、地圖、翻譯、住宿中文地址與路線照應。",
    keywords: "出發中國前 App, 中國旅遊必備 App, 外國人 中國 eSIM 簡訊驗證, 中國旅遊手機準備, 中國旅行 地圖 翻譯 支付",
    ogTitle: "出發中國前必備 App 與手機準備",
    headline: "出發中國前必備 App 與手機準備",
    eyebrow: "出發中國前 · 手機設定",
    h1: "先讓手機能用，再去看遠方",
    lead: "中國旅行最容易緊張的時刻，常常不是景點，而是驗證碼、住宿地址、接送定位、地圖與翻譯。",
    navCurrent: "出發準備",
    navBack: "出發準備",
    navBackHref: "/zh/before-china/",
    ctaText: "開始路線諮詢",
    ctaHref: "/zh/interest/?utm_source=travel_apps_guide&utm_medium=site&utm_campaign=before_china_search_cluster",
    sections: [
      {
        id: "answer",
        eyebrow: "先說結論",
        title: "手機準備要在需要之前完成",
        paragraphs: [
          "出發中國前，先準備支付 App、行動網路、簡訊驗證、地圖、翻譯與離線住宿資料。這些不漂亮，但它們決定第一天是否安靜。",
          "旅程越離開北京上海，這些小操作越會影響整趟路線的舒適感。"
        ]
      },
      {
        id: "apps",
        eyebrow: "核心設定",
        title: "App 與手機準備清單",
        list: [
          "支付：能設定微信支付或支付寶就先設定，並保留備用卡。",
          "網路：先決定漫遊、eSIM 或當地 SIM。",
          "簡訊：確認支付與訂房綁定的手機號碼能收驗證碼。",
          "地圖：把住宿地址與接送點中文資訊存好。",
          "翻譯：準備翻譯 App 或飯店、司機、餐廳常用句。",
          "文件：護照、訂單、緊急聯絡方式要能離線查看。"
        ]
      },
      {
        id: "route",
        eyebrow: "路線現實",
        title: "App 不能修復過度壓縮的行程",
        paragraphs: [
          "好的手機準備可以降低摩擦，但不能讓過趕的路線變舒服。如果一天裡同時有長車程、晚抵達、語言交接與支付不確定，風險會疊加。",
          "雲南、新疆、敦煌、三亞與東北路線，我們會把手機、支付、語言與在地照應一起看。"
        ]
      },
      {
        id: "next",
        eyebrow: "下一步",
        title: "把路線先交給我們看一次",
        paragraphs: [
          "留下月份、人數、想去地點、語言需求與舒適期待。我們會先回覆哪些地方容易、哪些地方需要在地照應。"
        ],
        cta: true
      }
    ],
    faq: [
      ["外國人來中國前需要準備哪些 App？", "至少先準備行動支付、網路與簡訊、地圖、翻譯，以及離線訂房資料。"],
      ["中國旅行一定需要簡訊驗證嗎？", "很多支付、訂單與帳號檢查可能需要手機驗證，建議出發前確認。"],
      ["住宿中文地址需要保存嗎？", "需要。每次轉場前都應保存中文地址與電話，尤其夜間抵達時。"],
      ["若青中國可以幫忙設定 App 嗎？", "我們不代操作個人帳號；我們協助的是把支付、手機、語言與路線風險放進行程判斷。"]
    ]
  }
];

const sources = [
  {
    href: "https://english.beijing.gov.cn/livinginbeijing/finance/mobilepaymentlist/202005/t20200516_1899230.html",
    en: "Beijing Municipal Government English service page on WeChat Pay for foreigners",
    zh: "北京市英文官方服務頁：外國人如何使用微信支付"
  },
  {
    href: "https://gb.china-embassy.gov.cn/eng/lqfw/202403/t20240317_11261639.htm",
    en: "Chinese Embassy in the UK guide to payment services in China",
    zh: "中國駐英國大使館：中國支付服務指南"
  },
  {
    href: "https://en.nia.gov.cn/n147418/n147463/c183390/content.html",
    en: "National Immigration Administration visa-exemption country list",
    zh: "中國國家移民管理局：單方面免簽國家名單"
  }
];

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function jsonLd(page) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${page.canonical}#article`,
        headline: page.headline,
        description: page.description,
        inLanguage: page.lang === "zh" ? "zh-Hant" : "en",
        datePublished: "2026-07-05",
        dateModified: "2026-07-05",
        author: { "@id": "https://bluehourchina.com/#organization" },
        publisher: { "@id": "https://bluehourchina.com/#organization" },
        mainEntityOfPage: page.canonical,
        citation: sources.map((source) => source.href),
        about: page.keywords.split(",").map((item) => item.trim()).filter(Boolean)
      },
      {
        "@type": "Organization",
        "@id": "https://bluehourchina.com/#organization",
        name: page.lang === "zh" ? "若青中國旅策" : "Bluehour China Journeys",
        alternateName: page.lang === "zh" ? ["Bluehour China Journeys", "Ruoqing China"] : ["若青中國旅策", "Ruoqing China"],
        url: "https://bluehourchina.com/",
        description: page.lang === "zh"
          ? "服務外國旅客前往北京上海之外的中國深度風景目的地，提供私人路線建議與在地服務商媒合。"
          : "A private China travel advisory and local-provider matching brand for international travellers seeking landscapes beyond Beijing and Shanghai."
      },
      {
        "@type": "FAQPage",
        "@id": `${page.canonical}#faq`,
        mainEntity: page.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer
          }
        }))
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${page.canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: page.lang === "zh" ? "首頁" : "Home",
            item: page.lang === "zh" ? "https://bluehourchina.com/zh.html" : "https://bluehourchina.com/"
          },
          {
            "@type": "ListItem",
            position: 2,
            name: page.lang === "zh" ? "出發中國前" : "Before China",
            item: page.lang === "zh" ? "https://bluehourchina.com/zh/before-china/" : "https://bluehourchina.com/before-china/"
          },
          {
            "@type": "ListItem",
            position: 3,
            name: page.headline,
            item: page.canonical
          }
        ]
      }
    ]
  }, null, 2);
}

function sectionHtml(section, lang, ctaText, ctaHref) {
  const body = [];
  if (section.paragraphs) {
    for (const paragraph of section.paragraphs) body.push(`            <p>${esc(paragraph)}</p>`);
  }
  if (section.list) {
    body.push("            <ol>");
    for (const item of section.list) body.push(`              <li>${esc(item)}</li>`);
    body.push("            </ol>");
  }
  if (section.cta) {
    body.push(`            <div class="hero-actions"><a class="btn primary dark-gold" href="${ctaHref}">${esc(ctaText)}</a><a class="btn dark" href="${lang === "zh" ? "/zh/before-china/" : "/before-china/"}">${lang === "zh" ? "回到出發準備總覽" : "Back to Before China"}</a></div>`);
  }
  const h2Class = lang === "zh" ? ' class="cjk-title"' : "";
  return `          <section id="${section.id}">
            <p class="eyebrow">${esc(section.eyebrow)}</p>
            <h2${h2Class}>${esc(section.title)}</h2>
${body.join("\n")}
          </section>`;
}

function pageHtml(page) {
  const isZh = page.lang === "zh";
  const htmlLang = isZh ? "zh-Hant" : "en";
  const otherLang = isZh ? "en" : "zh-Hant";
  const brandName = isZh ? "若青中國" : "Bluehour China";
  const brandSub = isZh ? "Bluehour China" : "若青中國旅策";
  const homeHref = isZh ? "/zh.html" : "/";
  const interestHref = isZh ? "/zh/interest/?utm_source=before_china_article_nav&utm_medium=site&utm_campaign=before_china_search_cluster" : "/interest.html?utm_source=before_china_article_nav&utm_medium=site&utm_campaign=before_china_search_cluster";
  const sourcesTitle = isZh ? "本頁參考來源" : "Sources used for this guide";
  const sourcesEyebrow = isZh ? "資料確認 · 2026-07-05" : "Last checked · 2026-07-05";
  const faqTitle = isZh ? "常見問題" : "Questions travellers search";
  const faqEyebrow = isZh ? "FAQ" : "FAQ";
  const sideTitle = isZh ? "本頁重點" : "In this guide";
  const sections = page.sections.map((section) => sectionHtml(section, page.lang, page.ctaText, page.ctaHref)).join("\n\n");
  const faq = page.faq.map(([question, answer]) => `              <article class="prep-card">
                <h3>${esc(question)}</h3>
                <p>${esc(answer)}</p>
              </article>`).join("\n");
  const sourceItems = sources.map((source) => `              <p><a href="${source.href}">${esc(isZh ? source.zh : source.en)}</a></p>`).join("\n");
  const asideLinks = page.sections.map((section) => `          <a href="#${section.id}">${esc(section.title)}</a>`).join("\n");
  const h1 = isZh ? `<h1 class="cjk-title">${esc(page.h1)}</h1>` : `<h1>${esc(page.h1)}</h1>`;

  return `<!doctype html>
<html lang="${htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="googlebot" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1">
  <meta name="audience" content="international travellers">
  <meta name="language" content="${isZh ? "Traditional Chinese" : "English"}">
  <meta http-equiv="content-language" content="${htmlLang}">
  <title>${esc(page.title)}</title>
  <meta name="description" content="${esc(page.description)}">
  <meta name="keywords" content="${esc(page.keywords)}">
  <meta name="application-name" content="${isZh ? "若青中國旅策" : "Bluehour China Journeys"}">
  <link rel="canonical" href="${page.canonical}">
  <link rel="alternate" hreflang="${htmlLang}" href="${page.canonical}">
  <link rel="alternate" hreflang="${otherLang}" href="${page.alternate}">
  <link rel="alternate" hreflang="x-default" href="${isZh ? page.alternate : page.canonical}">
  <link rel="alternate" type="text/plain" href="https://bluehourchina.com/llms.txt">
  <link rel="alternate" type="text/plain" href="https://bluehourchina.com/llms-full.txt">
  <link rel="icon" type="image/svg+xml" href="/assets/ruoqing-avatar.svg">
  <meta property="og:title" content="${esc(page.ogTitle)}">
  <meta property="og:description" content="${esc(page.description)}">
  <meta property="og:type" content="article">
  <meta property="og:site_name" content="${isZh ? "若青中國旅策" : "Bluehour China Journeys"}">
  <meta property="og:url" content="${page.canonical}">
  <meta property="og:image" content="https://bluehourchina.com/assets/ai/bluehour-china-hero-luxury-lake-v2.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <script type="application/ld+json">
  ${jsonLd(page)}
  </script>
  <link rel="stylesheet" href="/assets/luxury-multilang.css?v=20260711-care6">
  <style>
    .prep-hero {
      min-height: 70vh;
      color: var(--ivory);
      background:
        linear-gradient(90deg, rgba(7,17,15,.86), rgba(7,17,15,.46) 58%, rgba(7,17,15,.12)),
        linear-gradient(180deg, rgba(7,17,15,.08), rgba(7,17,15,.56)),
        url("/assets/ai/bluehour-china-hero-luxury-lake-v2.jpg") center / cover no-repeat;
    }
    .prep-hero .hero-inner {
      padding-top: clamp(110px, 10vw, 148px);
      padding-bottom: clamp(62px, 8vw, 94px);
    }
    .prep-hero h1 {
      max-width: 940px;
      font-size: clamp(42px, 5.8vw, 78px);
      line-height: 1.04;
    }
    .prep-body { background: #f4efe6; }
    .prep-grid {
      display: grid;
      grid-template-columns: minmax(0, .9fr) minmax(290px, .42fr);
      gap: clamp(30px, 6vw, 76px);
      align-items: start;
    }
    .prep-copy { display: grid; gap: 46px; min-width: 0; }
    .prep-copy h2 {
      max-width: 790px;
      font-size: clamp(32px, 4.3vw, 58px);
      line-height: 1.1;
    }
    .prep-copy p,
    .prep-copy li {
      color: var(--muted);
      font-size: 17px;
      line-height: 1.86;
    }
    .prep-copy p + p { margin-top: 14px; }
    .prep-copy ol {
      display: grid;
      gap: 10px;
      margin: 18px 0 0;
      padding-left: 22px;
    }
    .prep-faq {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
      margin-top: 22px;
    }
    .prep-card {
      padding: 26px;
      border: 1px solid var(--line);
      background: rgba(255,250,241,.68);
    }
    .prep-card h3 {
      font-size: 25px;
      line-height: 1.22;
    }
    .prep-card p {
      margin-top: 12px;
      font-size: 15px;
      line-height: 1.76;
    }
    .prep-panel {
      position: sticky;
      top: 88px;
      padding: 28px;
      border: 1px solid var(--line);
      background: rgba(255,250,241,.74);
    }
    .prep-panel a {
      display: block;
      padding: 14px 0;
      border-bottom: 1px solid var(--line);
      font-weight: 850;
    }
    .prep-panel a:last-child { border-bottom: 0; }
    .source-list {
      display: grid;
      gap: 10px;
      margin-top: 18px;
    }
    .source-list a {
      border-bottom: 1px solid rgba(23,32,28,.22);
      color: var(--ink);
      font-weight: 800;
    }
    .dark-gold { border-color: var(--gold); color: #14221d; background: var(--gold); }
    @media (max-width: 860px) {
      .prep-grid,
      .prep-faq { grid-template-columns: 1fr; }
      .prep-panel { position: static; }
    }
    @media (max-width: 760px) {
      .prep-hero h1 {
        font-size: clamp(34px, 9.4vw, 46px);
        line-height: 1.12;
      }
      .prep-copy h2 { font-size: clamp(30px, 8.4vw, 42px); }
      .prep-card,
      .prep-panel { padding: 22px; }
    }
  </style>
</head>
<body>
  <nav class="nav" aria-label="${isZh ? "主導覽" : "Primary navigation"}">
    <a class="brand" href="${homeHref}">
      <img src="/assets/ruoqing-avatar.svg" alt="" aria-hidden="true">
      <span><strong>${brandName}</strong><span>${brandSub}</span></span>
    </a>
    <div class="nav-links">
      <a href="${isZh ? "/zh.html#places" : "/#places"}">${isZh ? "目的地" : "Places"}</a>
      <a href="${page.navBackHref}" aria-current="page">${page.navCurrent}</a>
      <a href="${isZh ? "/zh/stories/" : "/stories.html"}">${isZh ? "故事" : "Stories"}</a>
      <span class="language-switch" aria-label="Language switcher"><a href="${isZh ? page.alternate : page.canonical}"${isZh ? "" : " aria-current=\"page\""}>EN</a><a href="${isZh ? page.canonical : page.alternate}"${isZh ? " aria-current=\"page\"" : ""}>中</a></span>
      <a class="nav-cta" href="${interestHref}">${isZh ? "開始諮詢" : "Start quietly"}</a>
    </div>
  </nav>
  <div class="mobile-lang" aria-label="Mobile language switcher"><a href="${isZh ? page.alternate : page.canonical}"${isZh ? "" : " aria-current=\"page\""}>EN</a><a href="${isZh ? page.canonical : page.alternate}"${isZh ? " aria-current=\"page\"" : ""}>中</a></div>

  <main>
    <section class="hero prep-hero">
      <div class="wrap hero-inner">
        <p class="eyebrow">${esc(page.eyebrow)}</p>
        ${h1}
        <p class="lead">${esc(page.lead)}</p>
        <div class="hero-actions">
          <a class="btn primary" href="#answer">${isZh ? "先看結論" : "Start with the answer"}</a>
          <a class="btn" href="${page.ctaHref}">${esc(page.ctaText)}</a>
        </div>
      </div>
    </section>

    <section class="section prep-body">
      <div class="wrap prep-grid">
        <article class="prep-copy">
${sections}

          <section id="faq">
            <p class="eyebrow">${faqEyebrow}</p>
            <h2${isZh ? ' class="cjk-title"' : ""}>${faqTitle}</h2>
            <div class="prep-faq">
${faq}
            </div>
          </section>

          <section id="sources">
            <p class="eyebrow">${sourcesEyebrow}</p>
            <h2${isZh ? ' class="cjk-title"' : ""}>${sourcesTitle}</h2>
            <div class="source-list">
${sourceItems}
            </div>
          </section>
        </article>

        <aside class="prep-panel" aria-label="${sideTitle}">
          <p class="eyebrow">${sideTitle}</p>
${asideLinks}
          <a href="#faq">FAQ</a>
          <a href="#sources">${isZh ? "官方來源" : "Official sources"}</a>
        </aside>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="wrap"><span>${isZh ? "若青中國旅策｜Bluehour China Journeys" : "Bluehour China Journeys｜若青中國旅策"}</span><span><a href="/privacy.html">Privacy</a> · <a href="/llms.txt">AI-readable summary</a></span></div>
  </footer>
</body>
</html>
`;
}

for (const page of pages) {
  const target = path.join(process.cwd(), page.file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, pageHtml(page), "utf8");
  console.log(`wrote ${page.file}`);
}
