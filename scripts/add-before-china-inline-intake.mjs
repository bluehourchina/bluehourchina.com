import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const today = "2026-07-06";

const pages = [
  {
    file: "before-china/index.html",
    lang: "en",
    angle: "before_china_setup",
    sourceContent: "before-china-checklist",
    title: "Want us to check the route behind these details?",
    intro:
      "Send the month, group size and what feels uncertain. We will reply with a calm first route note and a starting quote direction.",
  },
  {
    file: "before-china/wechat-pay-visa-mastercard/index.html",
    lang: "en",
    angle: "wechat_pay_setup",
    sourceContent: "wechat-pay-visa-mastercard-guide",
    title: "If payment is the worry, let the route absorb it.",
    intro:
      "Tell us where you may go in China. We will flag payment, phone, transfer and language risks before the itinerary becomes fixed.",
  },
  {
    file: "before-china/wechat-pay-paypal-china-2026/index.html",
    lang: "en",
    angle: "paypal_wechat_pay_2026",
    sourceContent: "wechat-pay-paypal-china-2026-guide",
    title: "Do not let one payment question decide the whole trip.",
    intro:
      "Share your route idea and we will reply with the practical gaps, where a backup matters and the starting quote direction.",
  },
  {
    file: "before-china/china-payment-checklist/index.html",
    lang: "en",
    angle: "payment_readiness",
    sourceContent: "china-payment-checklist-guide",
    title: "Ask us to check the payment-sensitive parts of your route.",
    intro:
      "This is useful if you are choosing Yunnan, Xinjiang, Dunhuang, Sanya, Zhangjiajie or winter Northeast China beyond the first cities.",
  },
  {
    file: "before-china/china-travel-apps-before-trip/index.html",
    lang: "en",
    angle: "app_phone_setup",
    sourceContent: "china-travel-apps-before-trip-guide",
    title: "A phone setup is only useful if the route is realistic.",
    intro:
      "Send the places and dates you are considering. We will connect app, payment, hotel-address and route timing into one first note.",
  },
  {
    file: "zh/before-china/index.html",
    lang: "zh",
    angle: "before_china_setup",
    sourceContent: "zh-before-china-checklist",
    title: "如果你想去的是更深處的中國，我們可以先幫你看路線",
    intro:
      "留下月份、人數、想去的地方與你擔心的細節。若青中國旅策會先回覆一份路線筆記與初步報價方向。",
  },
  {
    file: "zh/before-china/wechat-pay-visa-mastercard/index.html",
    lang: "zh",
    angle: "wechat_pay_setup",
    sourceContent: "zh-wechat-pay-visa-mastercard-guide",
    title: "支付只是第一層，真正要安靜的是整條路線",
    intro:
      "如果外國旅客想去雲南、新疆、敦煌、三亞或東北，我們可以先判斷支付、手機、交通與語言支援是否足夠。",
  },
  {
    file: "zh/before-china/china-payment-checklist/index.html",
    lang: "zh",
    angle: "payment_readiness",
    sourceContent: "zh-china-payment-checklist-guide",
    title: "把支付風險放回路線裡一起看",
    intro:
      "不是只看能不能綁卡，而是看旅客到小城、長途移動、飯店入住與司機銜接時，整體是否舒服。",
  },
  {
    file: "zh/before-china/china-travel-apps-before-trip/index.html",
    lang: "zh",
    angle: "app_phone_setup",
    sourceContent: "zh-china-travel-apps-before-trip-guide",
    title: "App 裝好以後，還要確認這條路走起來是否舒服",
    intro:
      "留下季節、人數、地區與舒適需求，我們會先回覆路線節奏、風險與起價方向。",
  },
];

const copy = {
  en: {
    eyebrow: "Private route check",
    proof: ["Route note in 24 hours", "Starting quote direction", "Payment, phone and language risks"],
    name: "Name",
    email: "Email",
    contact: "WhatsApp / WeChat / LINE",
    country: "Country / region",
    destination: "Destination you are considering",
    destinations: [
      ["yunnan", "Yunnan"],
      ["zhangjiajie", "Zhangjiajie"],
      ["xinjiang", "Xinjiang"],
      ["dunhuang", "Dunhuang"],
      ["sanya", "Sanya"],
      ["northeast", "Northeast winter"],
      ["multi-region", "Multiple regions"],
      ["not-sure", "Not sure yet"],
    ],
    window: "Travel window",
    windows: ["Within 1-3 months", "Within 3-6 months", "Next spring or summer", "Next autumn or winter", "Still exploring"],
    group: "Travellers",
    groups: ["Solo traveller", "2 travellers", "3-4 travellers", "Family with children", "Travelling with seniors"],
    message:
      "What worries you most: payment, apps, language, hotels, transfer days, parents or children, or choosing the right region?",
    button: "Send my route check",
    note:
      "We reply with a concise route note and starting quote direction before any local-provider matching.",
    fallback: "If the form does not send, write directly to",
    success: "Thank you. We received your request and will reply with a route note and a starting quote.",
    sending: "Sending...",
    error: "The form did not send. Please email us directly.",
    language: "English",
  },
  zh: {
    eyebrow: "私人路線初談",
    proof: ["24 小時內回覆路線筆記", "先給初步報價方向", "一起看支付、手機、語言與移動風險"],
    name: "姓名",
    email: "Email",
    contact: "WhatsApp / LINE / 微信",
    country: "旅客來自哪裡",
    destination: "正在考慮的目的地",
    destinations: [
      ["yunnan", "雲南"],
      ["zhangjiajie", "張家界"],
      ["xinjiang", "新疆"],
      ["dunhuang", "敦煌"],
      ["sanya", "三亞"],
      ["northeast", "東北冬季"],
      ["multi-region", "多個地區"],
      ["not-sure", "還不確定"],
    ],
    window: "大概出發時間",
    windows: ["1-3 個月內", "3-6 個月內", "明年春夏", "明年秋冬", "仍在研究"],
    group: "旅客人數",
    groups: ["一位旅客", "2 位旅客", "3-4 位旅客", "親子家庭", "有長輩同行"],
    message: "最擔心什麼：支付、App、語言、飯店、移動天數、長輩小孩，或是不知道去哪個地區？",
    button: "送出路線初談",
    note: "我們會先回覆一份路線筆記與初步報價方向，再判斷是否需要媒合當地服務商。",
    fallback: "如果表單無法送出，也可以直接寄到",
    success: "已收到，若青中國旅策會回覆一份路線筆記與初步方案報價",
    sending: "送出中...",
    error: "表單暫時沒有送出，請直接寄信給我們。",
    language: "Traditional Chinese",
  },
};

function optionList(items, placeholder) {
  return [
    `<option value="" disabled selected>${placeholder}</option>`,
    ...items.map((item) => {
      if (Array.isArray(item)) return `<option value="${item[0]}">${item[1]}</option>`;
      return `<option value="${item}">${item}</option>`;
    }),
  ].join("");
}

function formSnippet(page) {
  const c = copy[page.lang];
  const subject = page.lang === "zh" ? "Bluehour China 路線初談" : "Bluehour China route check";
  const sourcePath = "/" + page.file.replace(/index\.html$/, "");
  return `
          <section id="route-check" class="inline-lead-section">
            <div class="inline-lead-head">
              <div>
                <p class="eyebrow">${c.eyebrow}</p>
                <h2>${page.title}</h2>
                <p>${page.intro}</p>
              </div>
              <div class="inline-lead-proof" aria-label="${c.eyebrow}">
                ${c.proof.map((item) => `<span>${item}</span>`).join("\n                ")}
              </div>
            </div>
            <form class="lead-form inline-lead-form" data-form-lang="${page.lang}" data-lead-value="8500" data-lead-currency="CNY" data-sending-message="${c.sending}" data-success-message="${c.success}" data-error-message="${c.error}" name="bluehour-before-china-${page.lang}-${page.angle}" method="POST" action="https://formsubmit.co/67d31e8a5231a5944bbb8f18952a58df">
              <input type="hidden" name="_next" value="https://bluehourchina.com/thanks.html?source=before_china&angle=${page.angle}">
              <input type="hidden" name="_subject" value="${subject}">
              <input type="hidden" name="_template" value="table">
              <input type="hidden" name="_captcha" value="false">
              <input type="hidden" name="form-name" value="bluehour-before-china-${page.lang}-${page.angle}">
              <input type="hidden" name="bot-field">
              <input type="hidden" name="submitted_at" value="">
              <input type="hidden" name="status" value="New">
              <input type="hidden" name="priority" value="High">
              <input type="hidden" name="campaign" value="private_route_consultation">
              <input type="hidden" name="next_step" value="Prepare route note, starting quote direction and practical setup risks">
              <input type="hidden" name="intake_provider" value="formsubmit_email">
              <input type="hidden" name="language" value="${c.language}">
              <input type="hidden" name="page_url" value="">
              <input type="hidden" name="referrer" value="">
              <input type="hidden" name="utm_source" value="before_china">
              <input type="hidden" name="utm_medium" value="website">
              <input type="hidden" name="utm_campaign" value="before_china_search_cluster">
              <input type="hidden" name="intent_angle" value="${page.angle}">
              <input type="hidden" name="source_path" value="${sourcePath}">
              <input type="hidden" name="source_content" value="${page.sourceContent}">
              <input type="hidden" name="lead_currency" value="CNY">
              <input type="text" name="name" placeholder="${c.name}" aria-label="${c.name}" required>
              <input type="email" name="email" placeholder="${c.email}" aria-label="${c.email}">
              <input type="text" name="contact" placeholder="${c.contact}" aria-label="${c.contact}" required>
              <input type="text" name="country" placeholder="${c.country}" aria-label="${c.country}" required>
              <select name="destination" aria-label="${c.destination}" required>${optionList(c.destinations, c.destination)}</select>
              <select name="travel_window" aria-label="${c.window}" required>${optionList(c.windows, c.window)}</select>
              <select name="group_size" aria-label="${c.group}" required>${optionList(c.groups, c.group)}</select>
              <textarea name="message" placeholder="${c.message}" aria-label="${c.message}"></textarea>
              <button type="submit">${c.button}</button>
              <p class="note">${c.note}</p>
              <p class="form-fallback">${c.fallback} <a href="mailto:bluehourchina@gmail.com?subject=${encodeURIComponent(subject)}">bluehourchina@gmail.com</a></p>
            </form>
          </section>
`;
}

function ensureScript(html) {
  if (/assets\/lead-form-20260706-sheet\.js/.test(html)) return html;
  return html.replace(/\n<\/body>/, '\n  <script src="/assets/lead-form-20260706-sheet.js" defer></script>\n</body>');
}

function updateDates(html) {
  return html
    .replace(/"dateModified": "2026-07-05"/g, `"dateModified": "${today}"`)
    .replace(/Last checked · 2026-07-05/g, `Last checked · ${today}`);
}

const updated = [];

for (const page of pages) {
  const fullPath = path.join(root, page.file);
  let html = await fs.readFile(fullPath, "utf8");
  let next = html;
  const sourcePath = "/" + page.file.replace(/index\.html$/, "");
  next = updateDates(next);
  if (!/id="route-check"/.test(next)) {
    next = next.replace(/\n\s*<section id="sources">/, `${formSnippet(page)}\n          <section id="sources">`);
  }
  next = next.replace(
    /<input type="hidden" name="source_path" value="[^"]*">/,
    `<input type="hidden" name="source_path" value="${sourcePath}">`
  );
  next = next.replace(
    /<input type="hidden" name="campaign" value="[^"]*">/,
    '<input type="hidden" name="campaign" value="private_route_consultation">'
  );
  next = next
    .replace(/data-lead-value="[^"]*"/, 'data-lead-value="8500"')
    .replace(/data-lead-currency="[^"]*"/, 'data-lead-currency="CNY"')
    .replace(/<input type="hidden" name="lead_currency" value="[^"]*">/, '<input type="hidden" name="lead_currency" value="CNY">');
  next = ensureScript(next);
  if (next !== html) {
    await fs.writeFile(fullPath, next.replace(/[ \t]+$/gm, ""));
    updated.push(page.file);
  }
}

console.log(`before-china-inline-intake ${updated.length}`);
for (const file of updated) console.log(file);
