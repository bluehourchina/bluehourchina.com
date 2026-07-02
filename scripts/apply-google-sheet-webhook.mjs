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

function sheetBackupScript() {
  return `
  <!-- sheet-backup-start -->
  <script>
    document.querySelectorAll(".lead-form[data-sheet-endpoint]").forEach((form) => {
      const endpoint = form.dataset.sheetEndpoint || "";
      if (!endpoint.startsWith("https://")) return;
      form.addEventListener("submit", () => {
        const data = new FormData(form);
        data.set("intake_provider", "google_sheet_and_email_backup");
        const body = new URLSearchParams();
        data.forEach((value, key) => body.append(key, value));
        if (navigator.sendBeacon) {
          const sent = navigator.sendBeacon(endpoint, body);
          if (sent) return;
        }
        fetch(endpoint, {
          method: "POST",
          body,
          mode: "no-cors",
          keepalive: true,
          headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" }
        }).catch(() => {});
      });
    });
  </script>
  <!-- sheet-backup-end -->`;
}

function stripManaged(html) {
  return html
    .replace(/\s*data-sheet-endpoint="[^"]*"/g, "")
    .replace(/\n\s*<!-- sheet-backup-start -->[\s\S]*?<!-- sheet-backup-end -->/g, "");
}

function apply(html) {
  let next = stripManaged(html);
  next = next.replace(/<form class="lead-form"/g, `<form class="lead-form" data-sheet-endpoint="${endpoint}"`);
  if (!next.includes("sheet-backup-start")) {
    next = next.replace("</body>", `${sheetBackupScript()}\n</body>`);
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
    const next = apply(html);
    if (next !== html) {
      await fs.writeFile(fullPath, next.replace(/[ \t]+$/gm, ""));
      changed.push(file);
    }
  }

  console.log(`Applied Google Sheet webhook backup to ${changed.length} page(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
