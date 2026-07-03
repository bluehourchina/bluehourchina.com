import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const today = "2026-07-02";
const campaign = "private_route_consultation";

const languages = {
  en: {
    siteName: "Bluehour China Journeys",
    home: ["/", "index.html", "en.html", "en/index.html"],
    interest: "/interest.html",
    interestFiles: ["interest.html", "interest/index.html", "en/interest/index.html"],
    stories: ["/stories.html", "stories.html", "en/stories/index.html"],
    consultFiles: ["consult/index.html", "en/consult/index.html", "apply/index.html", "review/index.html", "journey-review/index.html"],
    consultUrl: "/consult/",
    langTag: "en",
    title: "Private China route consultation",
    description: "A calm first consultation for travellers planning a deeper China journey beyond Beijing and Shanghai.",
    eyebrow: "Private route consultation",
    h2: "Tell us the China landscape you want to move toward",
    lead: "For serious travellers, we read your season, route, comfort needs and concerns, then return an honest first direction. No package pressure, just a calm next step.",
    formTitle: "A route note first, then a quote",
    formLead: "We turn your answers into a concise China route note: why the destination fits, what the days might feel like, and the starting quote for the first plan.",
    fallback: "If the form does not send, write directly to",
    cta: "Begin a private consultation",
    sticky: "Begin a private consultation",
    secondary: "How consultation works",
    steps: [
      ["01", "Share the landscape", "Yunnan, Xinjiang, Dunhuang, Sanya, Northeast, or simply the mood you want."],
      ["02", "We check the fit", "Season, distance, comfort level, language needs and whether the route is becoming too rushed."],
      ["03", "You decide calmly", "If it fits, we can match suitable local providers. If it does not, we will say so."],
    ],
    proof: ["Manual reply", "Usually within 24 hours", "No forced package", "Suitable local matching"],
  },
  zh: {
    siteName: "若青中國旅策",
    home: ["/zh.html", "zh.html", "zh/index.html"],
    interest: "/zh/interest/",
    interestFiles: ["zh/interest/index.html"],
    stories: ["/zh/stories/", "zh/stories/index.html"],
    consultFiles: ["zh/consult/index.html"],
    consultUrl: "/zh/consult/",
    langTag: "zh-Hant",
    title: "中國深度路線初談",
    description: "若青中國旅策先理解你想靠近的中國風景，人工判斷目的地、季節、舒適度與在地照應。",
    eyebrow: "私人路線初談",
    h2: "先理解你想靠近的中國風景",
    lead: "這不是廉價促銷，也不是制式行程。你留下季節、人數、舒適需求與擔心的地方，我們人工判斷路線是否適合、哪裡太趕、需要什麼在地照應。",
    formTitle: "先給一份路線遊記，再給初步報價",
    formLead: "我們會把你的季節、人數與舒適需求整理成一份短短的中國路線筆記：為什麼適合、每天大概怎麼感受、價格從哪裡開始",
    fallback: "如果表單無法送出，也可以直接寄到",
    cta: "開始路線初談",
    sticky: "開始路線初談",
    secondary: "了解顧問方式",
    steps: [
      ["01", "說出你想靠近的風景", "雲南、新疆、敦煌、三亞、東北，或只是先說你想要的空氣。"],
      ["02", "我們判斷是否適合", "季節、距離、住宿舒適、語言需求與同行者體力，一起放進路線裡看。"],
      ["03", "你再安靜決定", "適合才往下媒合當地服務商；不適合，我們也會直接說。"],
    ],
    proof: ["人工回覆", "通常 24 小時內", "不強迫套裝", "合適才媒合在地"],
  },
  ja: {
    siteName: "Bluehour China Journeys",
    home: ["/ja.html", "ja.html", "ja/index.html"],
    interest: "/ja/interest/",
    interestFiles: ["ja/interest/index.html"],
    stories: ["/ja/stories/", "ja/stories/index.html"],
    consultFiles: ["ja/consult/index.html"],
    consultUrl: "/ja/consult/",
    langTag: "ja",
    title: "静かな初回相談",
    description: "北京・上海の次に中国を深く旅したい方へ、静かに最初の方向を整えます。",
    eyebrow: "個別相談",
    h2: "中国をもう少し深く旅したい方へ、個別相談を丁寧に拝見します",
    lead: "送信後、旅の記録のように読める短いルートノートと、最初のお見積り、次に確認したいことをお送りします",
    formTitle: "まず旅のノートを、その後に見積りを",
    formLead: "季節、人数、快適さへの希望を読み、中国のどの風景が合うのか、数日がどんな感触になるのか、最初の価格感まで整えます",
    fallback: "フォームが送信できない場合は、こちらへ直接ご連絡ください",
    cta: "最初の相談をする",
    sticky: "相談を始める",
    secondary: "個別相談",
    steps: [
      ["01", "風景を伝える", "雲南、新疆、敦煌、三亜、東北、または旅で感じたい空気だけでも大丈夫です。"],
      ["02", "相性を見る", "季節、距離、宿の質感、言語サポート、同行者の体力を含めて判断します。"],
      ["03", "落ち着いて決める", "合う場合だけ、ふさわしい現地パートナーへ進みます。"],
    ],
    proof: ["人が返信", "通常24時間以内", "押し売りなし", "合う場合だけ現地紹介"],
  },
  ko: {
    siteName: "Bluehour China Journeys",
    home: ["/ko.html", "ko.html", "ko/index.html"],
    interest: "/ko/interest/",
    interestFiles: ["ko/interest/index.html"],
    stories: ["/ko/stories/", "ko/stories/index.html"],
    consultFiles: ["ko/consult/index.html"],
    consultUrl: "/ko/consult/",
    langTag: "ko",
    title: "조용한 첫 상담",
    description: "베이징과 상하이 이후의 중국을 더 깊게 여행하려는 분들을 위해 루트 노트와 시작 견적을 정리합니다.",
    eyebrow: "첫 상담",
    h2: "중국을 더 깊게 여행하려는 분들을 위해 루트 노트와 견적을 정리합니다",
    lead: "보내주시면 여행기처럼 읽히는 짧은 루트 노트와 시작 견적, 다음에 확인할 질문을 정리해드립니다.",
    formTitle: "먼저 루트 노트, 그다음 시작 견적",
    formLead: "계절, 인원, 편안함에 대한 요청을 읽고 어떤 중국 풍경이 맞는지, 하루하루가 어떤 느낌일지, 첫 가격대를 정리합니다.",
    fallback: "양식 전송이 어렵다면 여기로 직접 보내주세요",
    cta: "조용한 상담 시작",
    sticky: "상담 시작",
    secondary: "첫 상담",
    steps: [
      ["01", "원하는 풍경을 남깁니다", "윈난, 신장, 둔황, 싼야, 동북, 또는 원하는 분위기만 적어도 됩니다."],
      ["02", "여정의 적합성을 봅니다", "계절, 거리, 숙소 감각, 언어 지원, 동행자의 체력을 함께 봅니다."],
      ["03", "차분히 결정합니다", "맞는 경우에만 알맞은 현지 파트너 연결로 이어집니다."],
    ],
    proof: ["직접 답장", "보통 24시간 내", "강요 없음", "맞을 때만 현지 연결"],
  },
  th: {
    siteName: "Bluehour China Journeys",
    home: ["/th.html", "th.html", "th/index.html"],
    interest: "/th/interest/",
    interestFiles: ["th/interest/index.html"],
    stories: ["/th/stories/", "th/stories/index.html"],
    consultFiles: ["th/consult/index.html"],
    consultUrl: "/th/consult/",
    langTag: "th",
    title: "การปรึกษาเส้นทางจีนแบบส่วนตัว",
    description: "สำหรับคนที่อยากเห็นจีนให้ลึกกว่าเมืองใหญ่ เราจะเตรียมบันทึกเส้นทางและราคาเริ่มต้นอย่างเป็นส่วนตัว",
    eyebrow: "การปรึกษาเส้นทางส่วนตัว",
    h2: "บอกภูมิทัศน์ของจีนที่คุณอยากเข้าใกล้",
    lead: "หลังส่งแบบฟอร์ม เราจะเตรียมบันทึกเส้นทางสั้น ๆ ที่อ่านเหมือนบันทึกการเดินทาง พร้อมราคาเริ่มต้นและคำถามถัดไปที่ต้องยืนยัน",
    formTitle: "เริ่มจากบันทึกเส้นทาง แล้วตามด้วยราคา",
    formLead: "เราจะเปลี่ยนคำตอบของคุณเป็นบันทึกเส้นทางจีนสั้น ๆ ว่าทำไมจุดหมายนี้เหมาะ วันเดินทางจะรู้สึกอย่างไร และราคาเริ่มจากตรงไหน",
    fallback: "หากส่งแบบฟอร์มไม่ได้ สามารถส่งอีเมลมาได้ที่",
    cta: "ขอคำแนะนำแรก",
    sticky: "เริ่มปรึกษาเส้นทาง",
    secondary: "วิธีการปรึกษา",
    steps: [
      ["01", "บอกภูมิทัศน์ที่อยากเห็น", "ยูนนาน ซินเจียง ตุนหวง ซานย่า ตะวันออกเฉียงเหนือ หรือแค่อารมณ์ของทริปก็ได้"],
      ["02", "เราดูความเหมาะสม", "ฤดูกาล ระยะทาง ที่พัก ภาษา และแรงของผู้ร่วมทริปจะถูกนำมาพิจารณา"],
      ["03", "คุณค่อยตัดสินใจ", "ถ้าเหมาะ เราจึงค่อยแนะนำผู้ให้บริการท้องถิ่นที่เข้ากัน"],
    ],
    proof: ["คนจริงตอบ", "มักตอบใน 24 ชม.", "ไม่บังคับซื้อแพ็กเกจ", "เหมาะจึงแนะนำในพื้นที่"],
  },
};

const destinationKeys = ["yunnan", "xinjiang", "dunhuang", "sanya", "northeast"];
const englishDestinationFiles = {
  yunnan: ["yunnan.html", "en/yunnan/index.html"],
  xinjiang: ["xinjiang.html", "en/xinjiang/index.html"],
  dunhuang: ["dunhuang.html", "en/dunhuang/index.html"],
  sanya: ["sanya.html", "en/sanya/index.html"],
  northeast: ["northeast.html", "en/northeast/index.html"],
};

function escapeHtml(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

async function read(file) {
  return fs.readFile(path.join(root, file), "utf8");
}

async function write(file, content) {
  const target = path.join(root, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content.replace(/[ \t]+$/gm, ""));
}

function cleanManaged(html) {
  return html
    .replace(/\n?\s*<!-- conversion-start -->[\s\S]*?<!-- conversion-end -->/g, "")
    .replace(/\n?\s*<!-- sticky-review-start -->[\s\S]*?<!-- sticky-review-end -->/g, "")
    .replace(/\n?\s*<!-- form-proof-start -->[\s\S]*?<!-- form-proof-end -->/g, "")
    .replace(/\n?\s*<!-- form-fallback-start -->[\s\S]*?<!-- form-fallback-end -->/g, "");
}

function reviewUrl(lang, source, destination = "") {
  const config = languages[lang];
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: "site",
    utm_campaign: campaign,
  });
  if (destination) params.set("destination", destination);
  return `${config.interest}?${params.toString()}`;
}

function alternateLinks(type = "consult") {
  const lines = Object.entries(languages).map(([lang, config]) => {
    const href = type === "consult" ? config.consultUrl : config.interest;
    const hreflang = lang === "zh" ? "zh-Hant" : lang;
    return `  <link rel="alternate" hreflang="${hreflang}" href="https://bluehourchina.com${href}">`;
  });
  lines.push(`  <link rel="alternate" hreflang="x-default" href="https://bluehourchina.com/consult/">`);
  return lines.join("\n");
}

function consultLanguageSwitch(activeLang) {
  return Object.entries(languages).map(([lang, config]) => {
    const label = lang === "zh" ? "中" : lang === "en" ? "EN" : lang === "ja" ? "JP" : lang.toUpperCase();
    const current = lang === activeLang ? ' aria-current="page"' : "";
    return `<a href="${config.consultUrl}"${current}>${label}</a>`;
  }).join("");
}

function conversionSection(lang, source, destination = "") {
  const c = languages[lang];
  return `
    <!-- conversion-start -->
    <section class="section conversion-band" id="review">
      <div class="wrap conversion-wrap">
        <div class="conversion-copy">
          <p class="eyebrow">${escapeHtml(c.eyebrow)}</p>
          <h2>${escapeHtml(c.h2)}</h2>
          <p>${escapeHtml(c.lead)}</p>
          <div class="hero-actions">
            <a class="btn primary dark-gold" href="${reviewUrl(lang, source, destination)}">${escapeHtml(c.cta)}</a>
            <a class="btn dark" href="${c.consultUrl}">${escapeHtml(c.secondary)}</a>
          </div>
        </div>
        <div class="conversion-steps">
          ${c.steps.map(([num, title, body]) => `<article><b>${escapeHtml(num)}</b><h3>${escapeHtml(title)}</h3><p>${escapeHtml(body)}</p></article>`).join("")}
        </div>
      </div>
    </section>
    <!-- conversion-end -->`;
}

function stickyReview(lang, source, destination = "") {
  return `
  <!-- sticky-review-start -->
  <a class="sticky-review" href="${reviewUrl(lang, source, destination)}">${escapeHtml(languages[lang].sticky)}</a>
  <!-- sticky-review-end -->`;
}

function formProof(lang) {
  const config = languages[lang];
  return `
      <!-- form-proof-start -->
      <div class="form-proof">
        <p class="eyebrow">${escapeHtml(config.eyebrow)}</p>
        <h3>${escapeHtml(config.formTitle)}</h3>
        <p>${escapeHtml(config.formLead)}</p>
        <div>${config.proof.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>
      </div>
      <!-- form-proof-end -->`;
}

function formFallback(lang) {
  const config = languages[lang];
  const subject = encodeURIComponent("Bluehour China route consultation");
  return `
        <!-- form-fallback-start -->
        <p class="form-fallback">${escapeHtml(config.fallback)} <a href="mailto:bluehourchina@gmail.com?subject=${subject}">bluehourchina@gmail.com</a></p>
        <!-- form-fallback-end -->`;
}

function removeGoogleSheetBackend(html) {
  return html
    .replace(/\sdata-sheet-endpoint="[^"]*"/g, "")
    .replace(/\n\s*<input type="hidden" name="crm_sheet_id" value="[^"]*">/g, "")
    .replace(/\n\s*const endpoint = leadForm\.dataset\.sheetEndpoint;[\s\S]*?\n\s*}\n\s*}\n\s*<\/script>/, "\n    }\n  </script>");
}

function replaceUrl(html, from, to) {
  return html.split(`href="${from}"`).join(`href="${to}"`);
}

function addSticky(html, lang, source, destination = "") {
  if (html.includes("<!-- sticky-review-start -->")) return html;
  return html.replace("</body>", `${stickyReview(lang, source, destination)}\n</body>`);
}

function enhanceHome(html, lang) {
  const config = languages[lang];
  html = cleanManaged(html);
  html = html.replace(new RegExp(`class="nav-cta" href="${config.interest.replaceAll("/", "\\/")}"`, "g"), `class="nav-cta" href="${reviewUrl(lang, "nav")}"`);
  html = replaceUrl(html, config.interest, reviewUrl(lang, "home_cta"));
  html = html.replace('<section class="section service-band" id="care">', `${conversionSection(lang, "home_mid")}\n    <section class="section service-band" id="care">`);
  return addSticky(html, lang, "sticky_home");
}

function enhanceDestination(html, lang, destination) {
  const config = languages[lang];
  html = cleanManaged(html);
  html = html.replace(new RegExp(`class="nav-cta" href="${config.interest.replaceAll("/", "\\/")}"`, "g"), `class="nav-cta" href="${reviewUrl(lang, "nav", destination)}"`);
  html = replaceUrl(html, `${config.interest}?destination=${destination}`, reviewUrl(lang, "destination_cta", destination));
  html = html.replace('<section class="next">', `${conversionSection(lang, "destination_mid", destination)}\n    <section class="next">`);
  return addSticky(html, lang, "sticky_destination", destination);
}

function enhanceStories(html, lang) {
  const config = languages[lang];
  html = cleanManaged(html);
  html = html.replace(new RegExp(`class="nav-cta" href="${config.interest.replaceAll("/", "\\/")}"`, "g"), `class="nav-cta" href="${reviewUrl(lang, "nav_stories")}"`);
  html = replaceUrl(html, config.interest, reviewUrl(lang, "stories"));
  return addSticky(html, lang, "sticky_stories");
}

function enhanceInterest(html, lang) {
  html = removeGoogleSheetBackend(cleanManaged(html));
  html = html.replace('<form class="lead-form"', `${formProof(lang)}\n      <form class="lead-form"`);
  if (!html.includes('name="campaign"')) {
    html = html.replace('<input type="hidden" name="priority" value="Medium">', `<input type="hidden" name="priority" value="Medium">\n        <input type="hidden" name="campaign" value="${campaign}">`);
  }
  if (!html.includes('name="intake_provider"')) {
    html = html.replace(`<input type="hidden" name="campaign" value="${campaign}">`, `<input type="hidden" name="campaign" value="${campaign}">\n        <input type="hidden" name="intake_provider" value="formsubmit_email">`);
  }
  if (!html.includes("<!-- form-fallback-start -->")) {
    html = html.replace("</form>", `${formFallback(lang)}\n      </form>`);
  }
  html = html.replace(/utm_campaign: params\.get\("utm_campaign"\) \|\| "[^"]+"/g, `utm_campaign: params.get("utm_campaign") || "${campaign}"`);
  return html;
}

function consultPageFromInterest(html, lang) {
  const config = languages[lang];
  html = enhanceInterest(cleanManaged(html), lang);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(config.title)}｜${escapeHtml(config.siteName)}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${escapeHtml(config.description)}">`);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="https://bluehourchina.com${config.consultUrl}">`);
  html = html.replace(/(?:  <link rel="alternate" hreflang="[^"]+" href="[^"]+">\n?)+/, `${alternateLinks("consult")}\n`);
  html = html.replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${escapeHtml(config.title)}｜${escapeHtml(config.siteName)}">`);
  html = html.replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${escapeHtml(config.description)}">`);
  html = html.replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="https://bluehourchina.com${config.consultUrl}">`);
  html = html.replace(/<span class="language-switch" aria-label="Language switcher">[\s\S]*?<\/span>/, `<span class="language-switch" aria-label="Language switcher">${consultLanguageSwitch(lang)}</span>`);
  html = html.replace(/<div class="mobile-lang" aria-label="Mobile language switcher">[\s\S]*?<\/div>/, `<div class="mobile-lang" aria-label="Mobile language switcher">${consultLanguageSwitch(lang)}</div>`);
  html = html.replace(new RegExp(`class="nav-cta" href="${config.interest.replaceAll("/", "\\/")}"`, "g"), `class="nav-cta" href="${reviewUrl(lang, "consult_nav")}"`);
  html = html.replace(/<section class="interest-story"><div><p class="eyebrow">[\s\S]*?<\/p><h1>[\s\S]*?<\/h1><p class="lead">[\s\S]*?<\/p><\/div>/, `<section class="interest-story"><div><p class="eyebrow">${escapeHtml(config.eyebrow)}</p><h1>${escapeHtml(config.h2)}</h1><p class="lead">${escapeHtml(config.lead)}</p></div>`);
  return html;
}

function appendCss(css) {
  css = css.replace(/\n?\/\* conversion-optimization-start \*\/[\s\S]*?\/\* conversion-optimization-end \*\//g, "");
  return `${css.trim()}

/* conversion-optimization-start */
.conversion-band{background:linear-gradient(180deg,#f7f2e8,#e8eee9);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.conversion-wrap{display:grid;grid-template-columns:minmax(0,.85fr) minmax(320px,.9fr);gap:clamp(26px,5vw,72px);align-items:start}
.conversion-copy h2{max-width:760px;font-size:clamp(36px,5vw,66px);line-height:1.07}.conversion-copy p{max-width:660px;margin-top:20px;color:var(--muted);font-size:17px;line-height:1.82}
.conversion-steps{display:grid;gap:12px}.conversion-steps article{padding:26px;border:1px solid var(--line);background:rgba(255,250,241,.7)}.conversion-steps b{display:block;color:var(--gold);font-size:12px;letter-spacing:.14em;text-transform:uppercase}.conversion-steps h3{margin-top:12px;font-size:30px;line-height:1.12}.conversion-steps p{margin-top:12px;color:var(--muted);line-height:1.72}
.dark-gold{box-shadow:0 16px 36px rgba(93,63,31,.16)}.form-proof{margin:20px 0 22px;padding:18px;border:1px solid rgba(255,250,241,.2);background:rgba(255,250,241,.08)}.form-proof h3{margin-top:8px;font-size:24px;line-height:1.16}.form-proof p{margin:10px 0 14px}.form-proof div{display:flex;flex-wrap:wrap;gap:8px}.form-proof span{display:inline-flex;align-items:center;min-height:30px;padding:0 10px;border:1px solid rgba(255,250,241,.2);color:rgba(255,250,241,.76);font-size:12px}.form-fallback{margin:8px 0 0;color:rgba(255,250,241,.62);font-size:12px;line-height:1.5}.form-fallback a{color:rgba(255,250,241,.9);border-bottom:1px solid rgba(255,250,241,.32)}
.tally-backend{margin-top:18px}.tally-backend iframe{display:block;min-height:620px;border:0;background:transparent}.email-backup-form{margin-top:14px;border-top:1px solid rgba(255,250,241,.16);padding-top:12px}.email-backup-form summary{cursor:pointer;color:rgba(255,250,241,.72);font-size:12px;font-weight:850;letter-spacing:.08em;text-transform:uppercase}.email-backup-form[open] summary{margin-bottom:12px}
.interest-story h1{max-width:min(100%,780px);overflow-wrap:break-word}.interest-story .lead{max-width:min(100%,650px)}
.sticky-review{position:fixed;left:50%;bottom:18px;z-index:40;transform:translateX(-50%);display:none;align-items:center;justify-content:center;min-height:48px;width:min(360px,calc(100% - 36px));padding:0 18px;background:var(--gold);color:#10231d;font-weight:850;box-shadow:0 16px 36px rgba(0,0,0,.28)}
@media(max-width:900px){.conversion-wrap{grid-template-columns:1fr}.conversion-steps h3{font-size:26px}.sticky-review{display:flex}.footer{padding-bottom:92px}.interest-body .sticky-review{display:none}}
@media(max-width:760px){.hero-inner{padding-bottom:118px}.home-hero .hero-actions a[href*="utm_source=home_cta"]{display:none}.interest-page{display:block;width:100vw;max-width:100vw;overflow:hidden}.interest-story{width:100vw;max-width:100vw;overflow:hidden}.interest-story h1{width:calc(100vw - 44px);max-width:calc(100vw - 44px);font-size:clamp(32px,8.5vw,40px);line-height:1.12;text-wrap:wrap;overflow-wrap:anywhere;line-break:anywhere}.interest-story .lead{width:calc(100vw - 44px);max-width:calc(100vw - 44px);overflow-wrap:anywhere}.sticky-review{bottom:14px}}
/* conversion-optimization-end */
`;
}

async function updateSitemap() {
  const sitemapFile = "sitemap.xml";
  const xml = await read(sitemapFile);
  const paths = new Set([...xml.matchAll(/<loc>https:\/\/bluehourchina\.com([^<]*)<\/loc>/g)].map((match) => match[1] || "/"));
  for (const config of Object.values(languages)) paths.add(config.consultUrl);
  paths.delete("/apply/");
  paths.delete("/review/");
  paths.delete("/journey-review/");
  const lowPriorityLegacy = new Set([
    "/yunnan-onepage.html",
    "/journal-yunnan.html",
    "/yunnan-route-compare.html",
    "/yunnan-price-compare.html",
    "/yunnan-agency-compare.html",
    "/yunnan-budget-fit.html",
    "/yunnan-pilot.html",
    "/yunnan-first-trip-guide.html",
    "/yunnan-quick-start.html",
    "/yunnan-referral-invite.html",
    "/yunnan-itinerary-check.html",
    "/yunnan-trust-video.html",
    "/social.html",
  ]);
  for (const item of lowPriorityLegacy) paths.delete(item);
  const priorityFor = (u) => {
    if (u === "/") return "1.0";
    if (u.includes("consult") || u.includes("apply") || u.includes("review") || u.includes("interest")) return "0.9";
    return "0.8";
  };
  const body = [...paths].map((u) => `  <url>
    <loc>https://bluehourchina.com${u}</loc>
    <lastmod>${today}</lastmod>
    <priority>${priorityFor(u)}</priority>
  </url>`).join("\n");
  await write(sitemapFile, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`);
}

async function updateRedirects() {
  const file = "_redirects";
  let text = await read(file);
  const catchAll = "/*     /index.html                   200";
  text = text.replace(catchAll, "").trimEnd();
  const additions = [
    "/consult /consult/                  200",
    "/apply /consult/                    200",
    "/review /consult/                   200",
    "/journey-review /consult/           200",
  ];
  for (const line of additions) {
    const from = line.trim().split(/\s+/)[0];
    if (!text.split(/\r?\n/).some((row) => row.trim().startsWith(`${from} `))) text += `\n${line}`;
  }
  await write(file, `${text}\n${catchAll}\n`);
}

async function updateLlms() {
  let shortText = await read("llms.txt");
  if (!shortText.includes("/consult/")) {
    shortText += `

## Lead Capture Campaign
- [Private China route consultation](/consult/)
- The consultation path is designed to collect serious private inquiries and route them to localized inquiry pages with UTM tracking.
`;
  }
  await write("llms.txt", shortText.trimEnd() + "\n");

  let fullText = await read("llms-full.txt");
  if (!fullText.includes("Private China Route Consultation")) {
    fullText += `

## Private China Route Consultation

The current conversion goal is to obtain serious consultation leads through a careful, high-trust route consultation. Users are invited to share destination interest, timing, group size, comfort expectations, language needs, budget range and prior China travel experience. Every homepage, story page and destination page can route to the localized inquiry form with UTM campaign ${campaign}.

Primary consultation URLs:
- /consult/
- /zh/consult/
- /ja/consult/
- /ko/consult/
- /th/consult/

Conversion language should emphasize manual reply, usually within 24 hours, no forced package and suitable local-provider matching only when the route fits.
`;
  }
  await write("llms-full.txt", fullText.trimEnd() + "\n");
}

for (const [lang, config] of Object.entries(languages)) {
  for (const file of config.home.slice(1)) {
    await write(file, enhanceHome(await read(file), lang));
  }
  for (const file of config.stories.slice(1)) {
    await write(file, enhanceStories(await read(file), lang));
  }
  for (const file of config.interestFiles) {
    await write(file, enhanceInterest(await read(file), lang));
  }
  const baseInterest = await read(config.interestFiles[0]);
  for (const file of config.consultFiles) {
    await write(file, consultPageFromInterest(baseInterest, lang));
  }
}

for (const [destination, files] of Object.entries(englishDestinationFiles)) {
  for (const file of files) {
    await write(file, enhanceDestination(await read(file), "en", destination));
  }
}
for (const lang of ["zh", "ja", "ko", "th"]) {
  for (const destination of destinationKeys) {
    const file = `${lang}/${destination}/index.html`;
    await write(file, enhanceDestination(await read(file), lang, destination));
  }
}

await write("assets/luxury-multilang.css", appendCss(await read("assets/luxury-multilang.css")));
await updateSitemap();
await updateRedirects();
await updateLlms();

console.log("conversion optimization complete");
