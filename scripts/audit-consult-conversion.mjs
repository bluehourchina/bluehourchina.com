import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const campaign = "ten_calm_reviews";
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
      ["missing Formsubmit action", (html) => html.includes("https://formsubmit.co/bluehourchina@gmail.com")],
      ["missing campaign hidden field", (html) => html.includes(`name="campaign" value="${campaign}"`)],
      ["missing UTM capture script", (html) => html.includes(`utm_campaign: params.get("utm_campaign") || "${campaign}"`)],
      ["missing trust proof", (html) => html.includes("form-proof")],
    ]);
  }

  for (const file of config.consults) {
    await checkFile(file, [
      ["missing canonical", (html) => html.includes('rel="canonical"')],
      ["missing hreflang alternates", (html) => html.includes('hreflang="x-default"')],
      ["missing consultation form", (html) => html.includes("https://formsubmit.co/bluehourchina@gmail.com")],
      ["missing campaign hidden field", (html) => html.includes(`name="campaign" value="${campaign}"`)],
      ["missing tracked nav CTA", (html) => html.includes("utm_source=consult_nav") && html.includes(campaign)],
      ["language label should use JP", (html) => !html.includes(">JA<") && html.includes(">JP<")],
    ]);
  }

  for (const destination of destinations) {
    for (const file of config.destFiles(destination)) {
      await checkFile(file, [
        ...routedPageChecks,
        ["missing destination tracking", (html) => html.includes(`destination=${destination}`)],
        ["missing destination conversion band", (html) => html.includes("conversion-band")],
        ["missing destination sticky review", (html) => html.includes("sticky-review")],
      ]);
    }
  }
}

for (const file of ["apply/index.html", "review/index.html", "journey-review/index.html"]) {
  await checkFile(file, [
    ["missing consultation content", (html) => html.includes("consult") || html.includes("journey review")],
    ["missing campaign", (html) => html.includes(campaign)],
  ]);
}

await checkFile("sitemap.xml", [
  ["missing /consult/", (xml) => xml.includes("https://bluehourchina.com/consult/")],
  ["missing /zh/consult/", (xml) => xml.includes("https://bluehourchina.com/zh/consult/")],
  ["missing /apply/", (xml) => xml.includes("https://bluehourchina.com/apply/")],
  ["missing /review/", (xml) => xml.includes("https://bluehourchina.com/review/")],
  ["missing /journey-review/", (xml) => xml.includes("https://bluehourchina.com/journey-review/")],
]);

await checkFile("llms-full.txt", [
  ["missing AI search conversion note", (text) => text.includes("First 10 Calm Journey Reviews") && text.includes(campaign)],
]);

if (failures.length) {
  console.error(`Consult conversion audit failed: ${failures.length} issue(s)`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exitCode = 1;
} else {
  console.log("Consult conversion audit passed");
}
