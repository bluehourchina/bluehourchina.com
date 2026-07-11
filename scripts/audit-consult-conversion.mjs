import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const campaign = "private_route_consultation";
const destinations = ["yunnan", "xinjiang", "dunhuang", "sanya", "northeast"];

const languages = {
  en: {
    homes: ["index.html", "en.html", "en/index.html"],
    stories: ["stories.html", "en/stories/index.html"],
    interests: ["interest.html", "interest/index.html", "en/interest/index.html"],
    consults: ["consult/index.html", "en/consult/index.html"],
    destFiles: (dest) => [`${dest}.html`, `en/${dest}/index.html`],
  },
  zh: {
    homes: ["zh.html", "zh/index.html"],
    stories: ["zh/stories/index.html"],
    interests: ["zh/interest/index.html"],
    consults: ["zh/consult/index.html"],
    destFiles: (dest) => [`zh/${dest}/index.html`],
  },
  ja: {
    homes: ["ja.html", "ja/index.html"],
    stories: ["ja/stories/index.html"],
    interests: ["ja/interest/index.html"],
    consults: ["ja/consult/index.html"],
    destFiles: (dest) => [`ja/${dest}/index.html`],
  },
  ko: {
    homes: ["ko.html", "ko/index.html"],
    stories: ["ko/stories/index.html"],
    interests: ["ko/interest/index.html"],
    consults: ["ko/consult/index.html"],
    destFiles: (dest) => [`ko/${dest}/index.html`],
  },
  th: {
    homes: ["th.html", "th/index.html"],
    stories: ["th/stories/index.html"],
    interests: ["th/interest/index.html"],
    consults: ["th/consult/index.html"],
    destFiles: (dest) => [`th/${dest}/index.html`],
  },
};

const failures = [];

async function read(file) {
  return fs.readFile(path.join(root, file), "utf8");
}

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function checkFile(file, checks) {
  let html = "";
  try {
    html = await read(file);
  } catch {
    failures.push(`${file}: missing file`);
    return;
  }

  for (const [label, test] of checks) {
    check(test(html), `${file}: ${label}`);
  }
}

const bareInterestLink = /href="\/(?:interest\.html|zh\/interest\/|ja\/interest\/|ko\/interest\/|th\/interest\/)"/;
const routedPageChecks = [
  ["missing campaign", (html) => html.includes(campaign)],
  ["missing UTM medium", (html) => html.includes("utm_medium=site")],
  ["has bare inquiry link without tracking", (html) => !bareInterestLink.test(html)],
];
const sheetPrimaryFormChecks = [
  ["missing Formsubmit action", (html) => html.includes("https://formsubmit.co/67d31e8a5231a5944bbb8f18952a58df")],
  ["missing campaign hidden field", (html) => html.includes(`name="campaign" value="${campaign}"`)],
  ["missing Google Sheet primary intake provider", (html) => html.includes('name="intake_provider" value="google_sheet_webapp"')],
  ["missing Sheet endpoint", (html) => html.includes("data-sheet-endpoint") && html.includes("script.google.com/macros/s/")],
  ["missing email fallback", (html) => html.includes("form-fallback") && html.includes("mailto:bluehourchina@gmail.com")],
  ["still has Google Sheet id", (html) => !html.includes("crm_sheet_id")],
  ["missing lead form handler", (html) => html.includes("/assets/lead-form-20260706-sheet.js")],
];

for (const config of Object.values(languages)) {
  for (const file of config.homes) {
    await checkFile(file, [
      ...routedPageChecks,
      ["missing conversion band", (html) => html.includes("conversion-band")],
      ["missing mobile sticky review", (html) => html.includes("sticky-review")],
    ]);
  }

  for (const file of config.stories) {
    await checkFile(file, [
      ...routedPageChecks,
      ["missing story sticky review", (html) => html.includes("sticky-review")],
    ]);
  }

  for (const file of config.interests) {
    await checkFile(file, [
      ...sheetPrimaryFormChecks,
      ["missing UTM capture script", (html) => html.includes(`utm_campaign: params.get("utm_campaign") || "${campaign}"`)],
      ["missing trust proof", (html) => html.includes("form-proof")],
    ]);
  }

  for (const file of config.consults) {
    await checkFile(file, [
      ["missing canonical", (html) => html.includes('rel="canonical"')],
      ["missing hreflang alternates", (html) => html.includes('hreflang="x-default"')],
      ...sheetPrimaryFormChecks,
      ["missing tracked nav CTA", (html) => html.includes("utm_source=consult_nav") && html.includes(campaign)],
      ["Japanese language option missing", (html) => html.includes('lang="ja"') && html.includes("日本語")],
    ]);
  }

  for (const destination of destinations) {
    for (const file of config.destFiles(destination)) {
      await checkFile(file, [
        ...routedPageChecks,
        ["missing destination tracking", (html) => html.includes(`destination=${destination}`)],
        ["missing destination conversion path", (html) => html.includes("conversion-band") || html.includes("home-intake-band")],
        ["missing destination sticky review", (html) => html.includes("sticky-review")],
      ]);
    }
  }
}

for (const file of ["apply/index.html", "review/index.html", "journey-review/index.html"]) {
  await checkFile(file, [
    ["missing consultation content", (html) => html.includes("consult") || html.includes("route consultation")],
    ["missing campaign", (html) => html.includes(campaign)],
  ]);
}

await checkFile("sitemap.xml", [
  ["missing /consult/", (xml) => xml.includes("https://bluehourchina.com/consult/")],
  ["missing /zh/consult/", (xml) => xml.includes("https://bluehourchina.com/zh/consult/")],
  ["canonical sitemap should not submit consult aliases", (xml) => !xml.includes("https://bluehourchina.com/apply/") && !xml.includes("https://bluehourchina.com/review/") && !xml.includes("https://bluehourchina.com/journey-review/")],
]);

await checkFile("llms-full.txt", [
  ["missing AI search conversion note", (text) => text.includes("Private China Route Consultation") && text.includes(campaign)],
]);

await checkFile("scripts/create-tally-intake-form.mjs", [
  ["missing Tally API endpoint", (text) => text.includes("https://api.tally.so") && text.includes("/forms")],
  ["missing hidden lead attribution fields", (text) => text.includes("HIDDEN_FIELDS") && text.includes("utm_source") && text.includes("originPage")],
  ["missing Bluehour notification email", (text) => text.includes("bluehourchina@gmail.com")],
]);

await checkFile("scripts/apply-tally-backend.mjs", [
  ["missing Tally embed integration", (text) => text.includes("data-tally-src") && text.includes("https://tally.so/widgets/embed.js")],
  ["missing Formsubmit fallback wrapper", (text) => text.includes("email-backup-form") && text.includes("site_embed_fallback")],
]);

await checkFile("index.html", [
  ["homepage should be English canonical", (html) => html.includes('<html lang="en">') && html.includes("<title>") && html.includes("Bluehour China")],
  ["homepage missing English language meta", (html) => html.includes('http-equiv="content-language" content="en"') && html.includes('name="language" content="English"')],
  ["homepage missing international traveller signal", (html) => html.includes('name="audience" content="international travellers"')],
]);

await checkFile("sitemap.xml", [
  ["sitemap should keep English homepage first", (xml) => xml.includes("<loc>https://bluehourchina.com/</loc>")],
  ["sitemap should include English destinations", (xml) => xml.includes("https://bluehourchina.com/northeast.html") && xml.includes("https://bluehourchina.com/yunnan.html")],
  ["sitemap should not submit old Chinese campaign pages", (xml) => !xml.includes("yunnan-onepage.html") && !xml.includes("journal-yunnan.html") && !xml.includes("social.html")],
]);

await checkFile("yunnan-onepage.html", [
  ["legacy Chinese campaign page should be noindex", (html) => html.includes('name="robots" content="noindex,follow"')],
]);

if (failures.length) {
  console.error(`Consult conversion audit failed: ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Consult conversion audit passed");
}
