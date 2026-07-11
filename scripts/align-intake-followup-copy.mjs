import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const intakePages = [
  "interest.html",
  "interest/index.html",
  "en/interest/index.html",
  "consult/index.html",
  "en/consult/index.html",
  "apply/index.html",
  "review/index.html",
  "journey-review/index.html",
  "zh/interest/index.html",
  "zh/consult/index.html",
  "ja/interest/index.html",
  "ja/consult/index.html",
  "ko/interest/index.html",
  "ko/consult/index.html",
  "th/interest/index.html",
  "th/consult/index.html",
];

const copy = {
  en: {
    intro: "After you submit, we prepare a short route note in the mood of a travel journal, then add a starting quote and the next questions needed to refine it.",
    proof: [
      "Route note and starting quote",
      "A route note first, then a quote",
      "We turn your answers into a concise China route note: why the destination fits, what the days might feel like, and the starting quote for the first plan.",
      ["Route note", "Starting quote", "1-business-day reply", "No payment required"],
    ],
    button: "Get a route note and quote",
    success: "Thank you. We received your request and will reply with a route note and a starting quote.",
    nextStep: "Prepare route note, starting quote and follow-up questions",
  },
  zh: {
    intro: "填完後，我們會先整理一份像遊記一樣好讀的路線建議，再附上初步方案報價與需要確認的細節",
    proof: [
      "路線筆記與初步報價",
      "先給一份路線筆記，再給初步報價",
      "我們會把你的季節、人數與舒適需求整理成一份短短的中國路線筆記：為什麼適合、每天大概怎麼感受、價格從哪裡開始",
      ["路線筆記", "初步報價", "1 個工作日內回覆", "此頁無需付款"],
    ],
    button: "送出需求，取得路線建議與報價",
    success: "已收到，若青中國旅策會回覆一份路線筆記式建議與初步方案報價",
    nextStep: "準備路線筆記式建議、初步方案報價與下一輪確認問題",
  },
  ja: {
    intro: "送信後、旅の記録のように読める短いルートノートと、最初のお見積り、次に確認したいことをお送りします",
    proof: [
      "ルートノートと最初のお見積り",
      "まず旅のノートを、その後に見積りを",
      "季節、人数、快適さへの希望を読み、中国のどの風景が合うのか、数日がどんな感触になるのか、最初の価格感まで整えます",
      ["ルートノート", "最初の見積り", "1営業日以内に返信", "このページで支払い不要"],
    ],
    button: "ルートノートと見積りを受け取る",
    success: "受け取りました。旅のノートと最初のお見積りをお送りします。",
    nextStep: "旅のルートノート、最初の見積り、追加確認事項を準備",
  },
  ko: {
    intro: "보내주시면 여행기처럼 읽히는 짧은 루트 노트와 시작 견적, 다음에 확인할 질문을 정리해드립니다.",
    proof: [
      "루트 노트와 시작 견적",
      "먼저 루트 노트, 그다음 시작 견적",
      "계절, 인원, 편안함에 대한 요청을 읽고 어떤 중국 풍경이 맞는지, 하루하루가 어떤 느낌일지, 첫 가격대를 정리합니다.",
      ["루트 노트", "시작 견적", "1영업일 이내 답장", "결제 필요 없음"],
    ],
    button: "루트 노트와 견적 받기",
    success: "문의가 접수되었습니다. 루트 노트와 시작 견적을 보내드립니다.",
    nextStep: "루트 노트, 시작 견적, 추가 확인 질문 준비",
  },
  th: {
    intro: "หลังส่งแบบฟอร์ม เราจะเตรียมบันทึกเส้นทางสั้น ๆ ที่อ่านเหมือนบันทึกการเดินทาง พร้อมราคาเริ่มต้นและคำถามถัดไปที่ต้องยืนยัน",
    proof: [
      "บันทึกเส้นทางและราคาเริ่มต้น",
      "เริ่มจากบันทึกเส้นทาง แล้วตามด้วยราคา",
      "เราจะเปลี่ยนคำตอบของคุณเป็นบันทึกเส้นทางจีนสั้น ๆ ว่าทำไมจุดหมายนี้เหมาะ วันเดินทางจะรู้สึกอย่างไร และราคาเริ่มจากตรงไหน",
      ["บันทึกเส้นทาง", "ราคาเริ่มต้น", "ตอบภายใน 1 วันทำการ", "ไม่ต้องชำระเงิน"],
    ],
    button: "รับบันทึกเส้นทางและราคา",
    success: "เราได้รับคำขอแล้ว จะตอบกลับพร้อมบันทึกเส้นทางและราคาเริ่มต้น",
    nextStep: "เตรียมบันทึกเส้นทาง ราคาเริ่มต้น และคำถามติดตาม",
  },
};

const globalReplacements = [
  ["Thank you. We received your request and will reply with a calm first direction.", copy.en.success],
  ["已收到。若青中國旅策會先安靜判斷，再回覆你一個方向。", copy.zh.success],
  ["受け取りました。若青中國旅策が落ち着いて確認し、最初の方向性をお返事します。", copy.ja.success],
  ["문의가 접수되었습니다. Ruoqing China Journeys가 조용히 검토한 뒤 첫 방향을 보내드립니다.", copy.ko.success],
  ["เราได้รับคำขอของคุณแล้ว ทีม Ruoqing China Journeys จะตอบกลับพร้อมทิศทางแรกอย่างใจเย็น", copy.th.success],
  ["The first reply is not a hard sell. It is a calm direction: what fits, what feels rushed, and what kind of local care may be needed.", copy.en.intro],
  ["第一封回覆不是硬推銷，而是一個安靜的方向：哪裡適合、哪裡太趕、需要什麼在地照應。", copy.zh.intro],
  ["強い営業ではありません。季節、人数、快適さ、不安を読み、合う場所、急ぎすぎる場所、必要な現地サポートを静かに整理します。", copy.ja.intro],
  ["강한 판매가 아닙니다. 계절, 인원, 편안함, 걱정거리를 읽고 어디가 맞는지, 어디가 빠듯한지, 어떤 현지 케어가 필요한지 정리합니다.", copy.ko.intro],
  ["นี่ไม่ใช่การขายแพ็กเกจแรง ๆ แต่เป็นการดูฤดูกาล จำนวนคน ความสบาย และความกังวลของคุณ แล้วตอบทิศทางแรกอย่างตรงไปตรงมา", copy.th.intro],
  ["First direction within 24 hours", "Route note and first quote"],
  ["24 小時內先回方向", "回覆路線筆記與報價"],
  ["24時間以内に最初の方向を返信", "ルートノートと見積りを返信"],
  ["24시간 안에 첫 방향 제안", "루트 노트와 견적 답장"],
  ["ตอบทิศทางแรกภายใน 24 ชั่วโมง", "ตอบด้วยบันทึกเส้นทางและราคา"],
  ["We will return a calm first direction for the route, pace and level of care that fits.", "We will reply with a route note, a starting quote and the next questions needed to refine the plan."],
  ["若青中國旅策會回覆一個不催促、但可執行的第一方向。", "若青中國旅策會回覆一份路線筆記式建議、初步方案報價與下一輪確認問題"],
  ["若青中國旅策會先回覆安靜的方向。", "若青中國旅策會回覆路線筆記與初步報價"],
  ["我們先回一個安靜方向", "我們先回路線筆記與初步報價"],
  ["We will read your destination, season, travellers, language needs and comfort expectations, then return a calm first direction.", "We will read your destination, season, travellers, language needs and comfort expectations, then prepare a route note, a starting quote and the next questions needed to refine the plan."],
  ["Month, travellers, comfort level and the feeling you want. We reply with a calm first direction.", "Month, travellers, comfort level and the feeling you want. We reply with a route note and a starting quote."],
  ["A quieter first conversation", "A route note first, then a quote"],
  ["更像私人顧問的第一步", "先給一份路線筆記，再給初步報價"],
  ["より私的な最初の相談", "まず旅のノートを、その後に見積りを"],
  ["더 개인적인 첫 상담", "먼저 루트 노트, 그다음 시작 견적"],
  ["บทสนทนาแรกที่เป็นส่วนตัวกว่า", "เริ่มจากบันทึกเส้นทาง แล้วตามด้วยราคา"],
  ["We read your season, pace and comfort needs, then reply with a direction that feels suitable to begin.", copy.en.proof[2]],
  ["我們會先讀你的季節、節奏與舒適需求，再回覆一個適合開始討論的方向。", copy.zh.proof[2]],
  ["季節、ペース、快適さへの希望を丁寧に読み、最初の方向を整えます。", copy.ja.proof[2]],
  ["계절, 속도, 편안함에 대한 요청을 직접 읽고 첫 방향을 정리합니다.", copy.ko.proof[2]],
  ["เราจะอ่านฤดูกาล จังหวะ และความสบายที่คุณต้องการ แล้วตอบทิศทางแรกที่เหมาะกับการเริ่มต้น", copy.th.proof[2]],
  ["중국을 더 깊게 여행하려는 분들을 위해 첫 방향을 차분히 정리합니다", "중국을 더 깊게 여행하려는 분들을 위해 루트 노트와 견적을 정리합니다"],
  ["베이징과 상하이 이후의 중국을 더 깊게 여행하려는 분들을 위해 차분히 첫 방향을 정리합니다.", "베이징과 상하이 이후의 중국을 더 깊게 여행하려는 분들을 위해 루트 노트와 시작 견적을 정리합니다."],
  ["동선과 속도, 필요한 현지 케어의 첫 방향을 차분히 보내드립니다.", "루트 노트와 시작 견적, 필요한 현지 케어를 차분히 보내드립니다."],
  ["สำหรับคนที่อยากเห็นจีนให้ลึกกว่าเมืองใหญ่ เราจะอ่านฤดูกาล ความสบาย และความกังวลของคุณ แล้วตอบทิศทางแรกอย่างตรงไปตรงมา", "สำหรับคนที่อยากเห็นจีนให้ลึกกว่าเมืองใหญ่ เราจะเตรียมบันทึกเส้นทางและราคาเริ่มต้นอย่างเป็นส่วนตัว"],
  ["First reply promise: a calm first direction, usually within 24 hours, about what fits, what feels rushed and what kind of local care may be needed.", "First reply promise: a travel-journal style route note, a starting quote and follow-up questions, usually within 24 hours when the brief is complete."],
  ["then replies with a calm first direction.", "then replies with a route note, a starting quote and follow-up questions."],
  ["then replies with a calm first direction", "then replies with a route note, a starting quote and follow-up questions"],
  ["replies with a calm first direction before the next planning step.", "replies with a travel-journal style route note, a starting quote and follow-up questions before the next planning step."],
];

function inferLang(file, html) {
  const lang = html.match(/<html[^>]*lang="([^"]+)"/i)?.[1]?.slice(0, 2).toLowerCase();
  if (lang && copy[lang]) return lang;
  if (file.startsWith("zh/")) return "zh";
  if (file.startsWith("ja/")) return "ja";
  if (file.startsWith("ko/")) return "ko";
  if (file.startsWith("th/")) return "th";
  return "en";
}

function proofBlock(lang) {
  const [eyebrow, title, body, tags] = copy[lang].proof;
  return `      <!-- form-proof-start -->
      <div class="form-proof">
        <p class="eyebrow">${eyebrow}</p>
        <h3>${title}</h3>
        <p>${body}</p>
        <div>${tags.map((tag) => `<span>${tag}</span>`).join("")}</div>
      </div>
      <!-- form-proof-end -->`;
}

function setFormAttributes(html, lang) {
  return html.replace(/<form class="lead-form"([^>]*)>/g, (match, rest) => {
    let next = rest
      .replace(/\sdata-success-message="[^"]*"/, ` data-success-message="${copy[lang].success}"`)
      .replace(/\sdata-sending-message="[^"]*"/, (value) => value);
    if (!/\sdata-success-message=/.test(next)) {
      next += ` data-success-message="${copy[lang].success}"`;
    }
    return `<form class="lead-form"${next}>`;
  });
}

function ensureNextStep(html, lang) {
  if (html.includes('name="next_step"')) return html;
  return html.replace(
    /(<input type="hidden" name="campaign" value="private_route_consultation">\n)/,
    `$1        <input type="hidden" name="next_step" value="${copy[lang].nextStep}">\n`
  );
}

function setButtons(html, lang) {
  const labels = [
    "Begin a private consultation",
    "送出初步需求",
    "最初の相談を送る",
    "조용한 상담 보내기",
    "ส่งคำขอเบื้องต้น",
  ];
  for (const label of labels) {
    html = html.replace(new RegExp(`<button type="submit">${escapeRegExp(label)}</button>`, "g"), `<button type="submit">${copy[lang].button}</button>`);
  }
  return html;
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function walk(dir) {
  const entries = await fs.readdir(path.join(root, dir), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "outputs" || entry.name === "assets" || entry.name === "downloads") continue;
    const child = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(child));
    else if (child !== "scripts/align-intake-followup-copy.mjs" && /\.(html|txt|mjs|gs)$/.test(entry.name)) files.push(child);
  }
  return files;
}

const allFiles = await walk(".");
for (const file of allFiles) {
  const target = path.join(root, file);
  let html = await fs.readFile(target, "utf8");
  const original = html;
  for (const [from, to] of globalReplacements) {
    html = html.replaceAll(from, to);
  }

  if (intakePages.includes(file.replace(/^\.\//, ""))) {
    const lang = inferLang(file, html);
    html = html.replace(/\s*<!-- form-proof-start -->[\s\S]*?<!-- form-proof-end -->/, `\n${proofBlock(lang)}`);
    html = setFormAttributes(html, lang);
    html = ensureNextStep(html, lang);
    html = setButtons(html, lang);
  }

  if (html !== original) {
    await fs.writeFile(target, html.replace(/[ \t]+$/gm, ""));
  }
}
