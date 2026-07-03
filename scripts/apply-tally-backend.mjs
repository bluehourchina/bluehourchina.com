import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const campaign = "private_route_consultation";
const tallyFormId = process.env.TALLY_FORM_ID || extractId(process.env.TALLY_FORM_URL || "");

const pages = [
  { file: "interest.html", lang: "en", label: "Open the inquiry form" },
  { file: "interest/index.html", lang: "en", label: "Open the inquiry form" },
  { file: "en/interest/index.html", lang: "en", label: "Open the inquiry form" },
  { file: "consult/index.html", lang: "en", label: "Open the inquiry form" },
  { file: "en/consult/index.html", lang: "en", label: "Open the inquiry form" },
  { file: "apply/index.html", lang: "en", label: "Open the inquiry form" },
  { file: "review/index.html", lang: "en", label: "Open the inquiry form" },
  { file: "journey-review/index.html", lang: "en", label: "Open the inquiry form" },
  { file: "zh/interest/index.html", lang: "zh-Hant", label: "開啟詢問表單" },
  { file: "zh/consult/index.html", lang: "zh-Hant", label: "開啟詢問表單" },
  { file: "ja/interest/index.html", lang: "ja", label: "問い合わせフォームを開く" },
  { file: "ja/consult/index.html", lang: "ja", label: "問い合わせフォームを開く" },
  { file: "ko/interest/index.html", lang: "ko", label: "문의 양식 열기" },
  { file: "ko/consult/index.html", lang: "ko", label: "문의 양식 열기" },
  { file: "th/interest/index.html", lang: "th", label: "เปิดแบบฟอร์ม" },
  { file: "th/consult/index.html", lang: "th", label: "เปิดแบบฟอร์ม" },
];

function extractId(value) {
  const match = String(value).match(/tally\.so\/(?:r|embed)\/([A-Za-z0-9]+)/);
  return match ? match[1] : "";
}

function embedUrl(page) {
  const params = new URLSearchParams({
    alignLeft: "1",
    hideTitle: "1",
    transparentBackground: "1",
    dynamicHeight: "1",
    utm_source: "site_embed",
    utm_medium: "site",
    utm_campaign: campaign,
    campaign,
    language: page.lang,
    intake_provider: "tally_embed",
  });
  return `https://tally.so/embed/${tallyFormId}?${params.toString()}`;
}

function publicUrl(page) {
  const params = new URLSearchParams({
    utm_source: "site_embed_fallback",
    utm_medium: "site",
    utm_campaign: campaign,
    campaign,
    language: page.lang,
    intake_provider: "tally_direct",
  });
  return `https://tally.so/r/${tallyFormId}?${params.toString()}`;
}

function managedEmbed(page) {
  return `
      <!-- tally-backend-start -->
      <div class="tally-backend" data-provider="tally">
        <iframe
          data-tally-src="${embedUrl(page)}"
          loading="lazy"
          width="100%"
          height="620"
          frameborder="0"
          marginheight="0"
          marginwidth="0"
          title="Bluehour China route consultation"></iframe>
        <p class="form-fallback"><a href="${publicUrl(page)}">${page.label}</a></p>
      </div>
      <details class="email-backup-form">
        <summary>Email backup form</summary>
      <!-- tally-backend-end -->`;
}

function closeBackupMarker() {
  return `
      <!-- tally-backup-end -->
      </details>`;
}

function removeManagedBlocks(html) {
  return html
    .replace(/\n\s*<!-- tally-backend-start -->[\s\S]*?<!-- tally-backend-end -->/g, "")
    .replace(/\n\s*<!-- tally-backup-end -->\s*<\/details>/g, "")
    .replace(/\n\s*<!-- tally-script-start -->[\s\S]*?<!-- tally-script-end -->/g, "");
}

function applyEmbed(html, page) {
  html = removeManagedBlocks(html);
  html = html.replace('<form class="lead-form"', `${managedEmbed(page)}\n      <form class="lead-form"`);
  html = html.replace("</form>", `</form>${closeBackupMarker()}`);

  const script = `
  <!-- tally-script-start -->
  <script src="https://tally.so/widgets/embed.js"></script>
  <script>if (window.Tally) window.Tally.loadEmbeds();</script>
  <!-- tally-script-end -->`;

  if (!html.includes("https://tally.so/widgets/embed.js")) {
    html = html.replace("</body>", `${script}\n</body>`);
  }

  return html;
}

async function read(file) {
  return fs.readFile(path.join(root, file), "utf8");
}

async function write(file, content) {
  await fs.writeFile(path.join(root, file), content.replace(/[ \t]+$/gm, ""));
}

async function main() {
  if (!tallyFormId) {
    console.error("Missing TALLY_FORM_ID or TALLY_FORM_URL.");
    console.error("Example: TALLY_FORM_ID=abc123 node scripts/apply-tally-backend.mjs");
    process.exit(1);
  }

  const changed = [];
  for (const page of pages) {
    const html = await read(page.file);
    const next = applyEmbed(html, page);
    if (next !== html) {
      await write(page.file, next);
      changed.push(page.file);
    }
  }

  console.log(`Applied Tally backend to ${changed.length} page(s).`);
  console.log(`Public form: https://tally.so/r/${tallyFormId}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
