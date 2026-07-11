import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excluded = new Set([".git", "node_modules", "output", "outputs", "public"]);

const copy = {
  en: {
    assurance: "About 2 minutes to complete. No payment is required. A travel planner replies within 1 business day with a route direction, starting estimate and next step. Details are used only for this enquiry.",
    privacy: "Privacy",
    success: "Thank you. We received your request and will reply within 1 business day with a route direction, starting estimate and next step.",
  },
  zh: {
    assurance: "約 2 分鐘即可填完。此頁無需付款；專人會在 1 個工作日內回覆路線方向、參考起價與下一步。資料只用於本次旅遊諮詢。",
    privacy: "隱私說明",
    success: "已收到。我們會在 1 個工作日內回覆路線方向、參考起價與下一步。",
  },
  ja: {
    assurance: "入力は約2分です。このページで支払いは発生しません。担当者が1営業日以内に、ルート案、参考料金、次の確認事項を返信します。情報は今回の相談にのみ使用します。",
    privacy: "プライバシー",
    success: "受け取りました。1営業日以内にルート案、参考料金、次の確認事項をお送りします。",
  },
  ko: {
    assurance: "작성에는 약 2분이 걸립니다. 이 페이지에서 결제하지 않습니다. 담당자가 1영업일 이내에 루트 방향, 시작 견적, 다음 확인 사항을 답변합니다. 정보는 이번 문의에만 사용합니다.",
    privacy: "개인정보",
    success: "문의가 접수되었습니다. 1영업일 이내에 루트 방향, 시작 견적, 다음 확인 사항을 보내드립니다.",
  },
  th: {
    assurance: "ใช้เวลาประมาณ 2 นาทีและไม่ต้องชำระเงินในหน้านี้ ผู้วางแผนจะตอบภายใน 1 วันทำการพร้อมแนวทางเส้นทาง ราคาเริ่มต้น และขั้นตอนถัดไป ข้อมูลใช้สำหรับคำขอนี้เท่านั้น",
    privacy: "ความเป็นส่วนตัว",
    success: "เราได้รับคำขอแล้ว และจะตอบภายใน 1 วันทำการพร้อมแนวทางเส้นทาง ราคาเริ่มต้น และขั้นตอนถัดไป",
  },
  ru: {
    assurance: "Заполнение занимает около 2 минут. Оплата на этой странице не требуется. Специалист ответит в течение 1 рабочего дня: предложит направление маршрута, стартовую стоимость и следующий шаг. Данные используются только для этого запроса.",
    privacy: "Конфиденциальность",
    success: "Запрос получен. В течение 1 рабочего дня мы ответим с направлением маршрута, стартовой стоимостью и следующим шагом.",
  },
};

function localeFor(html) {
  const language = html.match(/<html\b[^>]*\blang="([^"]+)"/i)?.[1]?.toLowerCase() || "en";
  if (language.startsWith("zh")) return "zh";
  if (language.startsWith("ja")) return "ja";
  if (language.startsWith("ko")) return "ko";
  if (language.startsWith("th")) return "th";
  if (language.startsWith("ru")) return "ru";
  return "en";
}

function normalizeForm(block, locale) {
  const text = copy[locale];
  const assurance = `<p class="form-consent form-ux-assurance">${text.assurance} <a class="form-privacy-link" href="/privacy.html" style="white-space:nowrap">${text.privacy}</a></p>`;
  let updated = block
    .replace(/\s*<p class="[^"]*form-ux-assurance[^"]*">[\s\S]*?<\/p>/g, "")
    .replace(/\s*<p class="form-consent">[\s\S]*?<\/p>/g, "")
    .replace(/\s*<p class="submit-note">[\s\S]*?<\/p>/g, "")
    .replace(/data-success-message="[^"]*"/, `data-success-message="${text.success}"`);
  if (/<button\b[^>]*type="submit"[^>]*>[\s\S]*?<\/button>/i.test(updated)) {
    updated = updated.replace(/(<button\b[^>]*type="submit"[^>]*>[\s\S]*?<\/button>)/i, `$1${assurance}`);
  } else {
    updated = updated.replace(/<\/form>$/, `${assurance}</form>`);
  }
  return updated;
}

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excluded.has(entry.name)) continue;
    if (entry.name.startsWith(".") && entry.name !== ".github") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

let changed = 0;
for (const file of await walk(root)) {
  const original = await fs.readFile(file, "utf8");
  if (!original.includes("lead-form")) continue;
  const locale = localeFor(original);
  const updated = original.replace(/<form\b[^>]*class="[^"]*\blead-form\b[^"]*"[^>]*>[\s\S]*?<\/form>/g, (block) => normalizeForm(block, locale));
  if (updated !== original) {
    await fs.writeFile(file, updated);
    changed += 1;
  }
}

console.log(`Normalized customer-facing form copy in ${changed} files.`);
