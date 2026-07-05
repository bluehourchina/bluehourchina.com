import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputDir = path.join(root, "outputs");

const checks = [
  {
    locale: "en",
    files: [
      "index.html",
      "en.html",
      "en/index.html",
      "china-travel/index.html",
      "yunnan.html",
      "xinjiang.html",
      "dunhuang.html",
      "sanya.html",
      "northeast.html",
      "en/yunnan/index.html",
      "en/xinjiang/index.html",
      "en/dunhuang/index.html",
      "en/sanya/index.html",
      "en/northeast/index.html",
    ],
    requiredOnDestinationPages: /US\$/,
    forbidden: [/\bNT\$/i, /\bTWD\b/i, /\bJPY\b/i, /\bRMB\b/i, /\bCNY\b/i, /人民幣/],
  },
  {
    locale: "zh",
    files: [
      "zh.html",
      "zh/index.html",
      "zh/yunnan/index.html",
      "zh/xinjiang/index.html",
      "zh/dunhuang/index.html",
      "zh/sanya/index.html",
      "zh/northeast/index.html",
    ],
    requiredOnDestinationPages: /\bRMB\b/,
    forbidden: [/\bNT\$/i, /\bTWD\b/i, /\bJPY\b/i, /\bUSD\b/i, /US\$/],
  },
  {
    locale: "ja",
    files: [
      "ja.html",
      "ja/index.html",
      "ja/yunnan/index.html",
      "ja/xinjiang/index.html",
      "ja/dunhuang/index.html",
      "ja/sanya/index.html",
      "ja/northeast/index.html",
    ],
    requiredOnDestinationPages: /\bJPY\b/,
    forbidden: [/\bNT\$/i, /\bTWD\b/i, /\bRMB\b/i, /\bCNY\b/i, /US\$/],
  },
  {
    locale: "ko",
    files: [
      "ko.html",
      "ko/index.html",
      "ko/yunnan/index.html",
      "ko/xinjiang/index.html",
      "ko/dunhuang/index.html",
      "ko/sanya/index.html",
      "ko/northeast/index.html",
    ],
    requiredOnDestinationPages: /\bKRW\b/,
    forbidden: [/\bNT\$/i, /\bTWD\b/i, /\bRMB\b/i, /\bCNY\b/i, /\bJPY\b/i, /US\$/],
  },
  {
    locale: "th",
    files: [
      "th.html",
      "th/index.html",
      "th/yunnan/index.html",
      "th/xinjiang/index.html",
      "th/dunhuang/index.html",
      "th/sanya/index.html",
      "th/northeast/index.html",
    ],
    requiredOnDestinationPages: /\bTHB\b/,
    forbidden: [/\bNT\$/i, /\bTWD\b/i, /\bRMB\b/i, /\bCNY\b/i, /\bJPY\b/i, /US\$/],
  },
];

function isDestination(file) {
  return /(?:^|\/)(yunnan|xinjiang|dunhuang|sanya|northeast)(?:\.html|\/index\.html)$/.test(file);
}

async function readIfExists(file) {
  try {
    return await fs.readFile(path.join(root, file), "utf8");
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

const issues = [];
const checked = [];

for (const check of checks) {
  for (const file of check.files) {
    const html = await readIfExists(file);
    if (html === null) {
      issues.push(`${check.locale} ${file}: missing file`);
      continue;
    }
    checked.push(file);
    for (const forbidden of check.forbidden) {
      if (forbidden.test(html)) {
        issues.push(`${check.locale} ${file}: forbidden currency pattern ${forbidden}`);
      }
    }
    if (isDestination(file) && !check.requiredOnDestinationPages.test(html)) {
      issues.push(`${check.locale} ${file}: missing expected destination currency ${check.requiredOnDestinationPages}`);
    }
  }
}

const summary = {
  checkedAt: new Date().toISOString(),
  fileCount: checked.length,
  issueCount: issues.length,
  issues,
};

await fs.mkdir(outputDir, { recursive: true });
await fs.writeFile(path.join(outputDir, "locale-pricing-audit.json"), JSON.stringify(summary, null, 2));

console.log(`Locale pricing audit checked ${checked.length} files`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues.slice(0, 80)) console.log(`ISSUE ${issue}`);

if (issues.length) process.exitCode = 1;
