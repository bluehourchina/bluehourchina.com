import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const endpoint = process.env.LEADS_WEBHOOK_URL || "";

const messages = {
  en: {
    sending: "Sending...",
    success: "Thank you. We received your request and will reply with a route note and a starting quote.",
    error: "The form did not send. Please email us directly."
  },
  zh: {
    sending: "送出中...",
    success: "已收到，若青中國旅策會回覆一份路線遊記式建議與初步方案報價",
    error: "表單暫時沒有送出，請直接寄信給我們。"
  },
  ja: {
    sending: "送信中...",
    success: "受け取りました。旅のノートと最初のお見積りをお送りします。",
    error: "フォームを送信できませんでした。直接メールでご連絡ください。"
  },
  ko: {
    sending: "보내는 중...",
    success: "문의가 접수되었습니다. 루트 노트와 시작 견적을 보내드립니다.",
    error: "양식 전송이 되지 않았습니다. 이메일로 직접 연락해 주세요."
  },
  th: {
    sending: "กำลังส่ง...",
    success: "เราได้รับคำขอแล้ว จะตอบกลับพร้อมบันทึกเส้นทางและราคาเริ่มต้น",
    error: "ส่งแบบฟอร์มไม่สำเร็จ กรุณาอีเมลถึงเราโดยตรง"
  }
};

function escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function inferLang(html, file) {
  const match = html.match(/<html[^>]*\blang="([^"]+)"/i);
  if (match) return match[1].slice(0, 2).toLowerCase();
  if (file.startsWith("zh/")) return "zh";
  if (file.startsWith("ja/")) return "ja";
  if (file.startsWith("ko/")) return "ko";
  if (file.startsWith("th/")) return "th";
  return "en";
}

function stripManaged(html) {
  return html
    .replace(/\s*data-sheet-endpoint="[^"]*"/g, "")
    .replace(/\s*data-form-lang="[^"]*"/g, "")
    .replace(/\s*data-sending-message="[^"]*"/g, "")
    .replace(/\s*data-success-message="[^"]*"/g, "")
    .replace(/\s*data-error-message="[^"]*"/g, "")
    .replace(/\n\s*<!-- sheet-backup-start -->[\s\S]*?<!-- sheet-backup-end -->/g, "")
    .replace(/\n\s*<!-- sheet-intake-start -->[\s\S]*?<!-- sheet-intake-end -->/g, "");
}

function apply(html, file) {
  let next = stripManaged(html);
  const lang = inferLang(next, file);
  const copy = messages[lang] || messages.en;
  next = next.replace(
    /<form class="([^"]*\blead-form\b[^"]*)"/g,
    `<form class="$1" data-sheet-endpoint="${escapeAttr(endpoint)}" data-form-lang="${lang}" data-sending-message="${escapeAttr(copy.sending)}" data-success-message="${escapeAttr(copy.success)}" data-error-message="${escapeAttr(copy.error)}"`
  );
  next = next.replace(/name="intake_provider" value="[^"]*"/g, `name="intake_provider" value="google_sheet_webapp"`);
  return next;
}

async function discoverPages(dir = root) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const pages = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relative = path.relative(root, fullPath);
    if (
      entry.name.startsWith(".") ||
      ["node_modules", ".git", "outputs", "ops"].includes(relative.split(path.sep)[0])
    ) {
      continue;
    }

    if (entry.isDirectory()) {
      pages.push(...(await discoverPages(fullPath)));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".html")) continue;
    if (relative === "netlify-forms.html") continue;

    const html = await fs.readFile(fullPath, "utf8");
    if (/<form\s+class="[^"]*\blead-form\b[^"]*"/.test(html)) pages.push(relative);
  }

  return pages.sort();
}

async function main() {
  if (!endpoint.startsWith("https://")) {
    console.error("Missing LEADS_WEBHOOK_URL.");
    console.error("Example: LEADS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec node scripts/apply-google-sheet-webhook.mjs");
    process.exit(1);
  }

  const pages = await discoverPages();
  const changed = [];
  for (const file of pages) {
    const fullPath = path.join(root, file);
    const html = await fs.readFile(fullPath, "utf8");
    const next = apply(html, file);
    if (next !== html) {
      await fs.writeFile(fullPath, next.replace(/[ \t]+$/gm, ""));
      changed.push(file);
    }
  }

  console.log(`Applied native Google Sheet intake to ${changed.length} of ${pages.length} lead-form page(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
