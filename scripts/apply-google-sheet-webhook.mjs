import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const endpoint = process.env.LEADS_WEBHOOK_URL || "";

const pages = [
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

const messages = {
  en: {
    sending: "Sending...",
    success: "Thank you. We received your request and will reply with a calm first direction.",
    error: "The form did not send. Please email us directly."
  },
  zh: {
    sending: "送出中...",
    success: "已收到。若青中國旅策會先安靜判斷，再回覆你一個方向。",
    error: "表單暫時沒有送出，請直接寄信給我們。"
  },
  ja: {
    sending: "送信中...",
    success: "受け取りました。若青中國旅策が落ち着いて確認し、最初の方向性をお返事します。",
    error: "フォームを送信できませんでした。直接メールでご連絡ください。"
  },
  ko: {
    sending: "보내는 중...",
    success: "문의가 접수되었습니다. Ruoqing China Journeys가 조용히 검토한 뒤 첫 방향을 보내드립니다.",
    error: "양식 전송이 되지 않았습니다. 이메일로 직접 연락해 주세요."
  },
  th: {
    sending: "กำลังส่ง...",
    success: "เราได้รับคำขอของคุณแล้ว ทีม Ruoqing China Journeys จะตอบกลับพร้อมทิศทางแรกอย่างใจเย็น",
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

function sheetIntakeScript() {
  return `
  <!-- sheet-intake-start -->
  <script>
    (() => {
      const messages = {
        en: { sending: "Sending...", success: "Thank you. We received your request and will reply with a calm first direction.", error: "The form did not send. Please email us directly." },
        zh: { sending: "送出中...", success: "已收到。若青中國旅策會先安靜判斷，再回覆你一個方向。", error: "表單暫時沒有送出，請直接寄信給我們。" },
        ja: { sending: "送信中...", success: "受け取りました。若青中國旅策が落ち着いて確認し、最初の方向性をお返事します。", error: "フォームを送信できませんでした。直接メールでご連絡ください。" },
        ko: { sending: "보내는 중...", success: "문의가 접수되었습니다. Ruoqing China Journeys가 조용히 검토한 뒤 첫 방향을 보내드립니다.", error: "양식 전송이 되지 않았습니다. 이메일로 직접 연락해 주세요." },
        th: { sending: "กำลังส่ง...", success: "เราได้รับคำขอของคุณแล้ว ทีม Ruoqing China Journeys จะตอบกลับพร้อมทิศทางแรกอย่างใจเย็น", error: "ส่งแบบฟอร์มไม่สำเร็จ กรุณาอีเมลถึงเราโดยตรง" }
      };

      const fieldValues = () => {
        const params = new URLSearchParams(window.location.search);
        return {
          submitted_at: new Date().toISOString(),
          page_url: window.location.href,
          referrer: document.referrer || "",
          utm_source: params.get("utm_source") || "site",
          utm_medium: params.get("utm_medium") || "multilingual",
          utm_campaign: params.get("utm_campaign") || "private_route_consultation"
        };
      };

      const setHiddenFields = (form) => {
        Object.entries(fieldValues()).forEach(([name, value]) => {
          const input = form.querySelector('[name="' + name + '"]');
          if (input) input.value = value;
        });
      };

      const getStatus = (form) => {
        let status = form.querySelector(".form-status");
        if (!status) {
          status = document.createElement("p");
          status.className = "form-status";
          const button = form.querySelector('button[type="submit"]');
          if (button) button.insertAdjacentElement("afterend", status);
          else form.appendChild(status);
        }
        return status;
      };

      document.querySelectorAll(".lead-form[data-sheet-endpoint]").forEach((form) => {
        const endpoint = form.dataset.sheetEndpoint || "";
        if (!endpoint.startsWith("https://")) return;
        const lang = (form.dataset.formLang || document.documentElement.lang || "en").slice(0, 2);
        const copy = messages[lang] || messages.en;
        setHiddenFields(form);

        form.addEventListener("submit", async (event) => {
          event.preventDefault();
          if (form.querySelector('[name="bot-field"]')?.value) return;

          setHiddenFields(form);
          const data = new FormData(form);
          data.set("intake_provider", "google_sheet_webapp");
          const body = new URLSearchParams();
          data.forEach((value, key) => body.append(key, value));

          const status = getStatus(form);
          const button = form.querySelector('button[type="submit"]');
          const originalLabel = button ? button.textContent : "";
          status.className = "form-status";
          status.textContent = "";
          if (button) {
            button.disabled = true;
            button.textContent = form.dataset.sendingMessage || copy.sending;
          }

          try {
            await fetch(endpoint, {
              method: "POST",
              body,
              mode: "no-cors",
              keepalive: true,
              headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }
            });
            status.className = "form-status success";
            status.textContent = form.dataset.successMessage || copy.success;
            form.reset();
            setHiddenFields(form);
          } catch (error) {
            status.className = "form-status error";
            const fallback = form.dataset.errorMessage || copy.error;
            status.innerHTML = fallback + ' <a href="mailto:bluehourchina@gmail.com?subject=Bluehour%20China%20journey%20review">bluehourchina@gmail.com</a>';
          } finally {
            if (button) {
              button.disabled = false;
              button.textContent = originalLabel;
            }
          }
        });
      });
    })();
  </script>
  <!-- sheet-intake-end -->`;
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
    /<form class="lead-form"/g,
    `<form class="lead-form" data-sheet-endpoint="${escapeAttr(endpoint)}" data-form-lang="${lang}" data-sending-message="${escapeAttr(copy.sending)}" data-success-message="${escapeAttr(copy.success)}" data-error-message="${escapeAttr(copy.error)}"`
  );
  next = next.replace(/name="intake_provider" value="[^"]*"/g, `name="intake_provider" value="google_sheet_webapp"`);
  if (!next.includes("sheet-intake-start")) {
    next = next.replace("</body>", `${sheetIntakeScript()}\n</body>`);
  }
  return next;
}

async function main() {
  if (!endpoint.startsWith("https://")) {
    console.error("Missing LEADS_WEBHOOK_URL.");
    console.error("Example: LEADS_WEBHOOK_URL=https://script.google.com/macros/s/.../exec node scripts/apply-google-sheet-webhook.mjs");
    process.exit(1);
  }

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

  console.log(`Applied native Google Sheet intake to ${changed.length} page(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
