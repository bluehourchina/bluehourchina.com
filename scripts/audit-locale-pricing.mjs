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
      "inner-mongolia.html",
      "sanya.html",
      "northeast.html",
      "en/yunnan/index.html",
      "en/xinjiang/index.html",
      "en/dunhuang/index.html",
      "en/inner-mongolia/index.html",
      "en/sanya/index.html",
      "en/northeast/index.html",
      "interest.html",
      "interest/index.html",
      "en/interest/index.html",
      "consult/index.html",
      "en/consult/index.html",
    ],
    requiredOnDestinationPages: /US\$/,
    requiredOnBudgetPages: /US\$/,
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
      "zh/inner-mongolia/index.html",
      "zh/sanya/index.html",
      "zh/northeast/index.html",
      "zh/interest/index.html",
      "zh/consult/index.html",
    ],
    requiredOnDestinationPages: /\bRMB\b/,
    requiredOnBudgetPages: /\bRMB\b/,
    forbidden: [/\bNT\$/i, /\bTWD\b/i, /\bJPY\b/i, /\bUSD\b/i, /US\$/],
    fileOverrides: {
      "zh.html": {
        forbidden: [/\bJPY\b/i, /\bUSD\b/i, /US\$/],
      },
      "zh/index.html": {
        forbidden: [/\bJPY\b/i, /\bUSD\b/i, /US\$/],
      },
      "zh/yunnan/index.html": {
        requiredOnDestinationPages: /NT\$/i,
        requiredOnBudgetPages: /NT\$/i,
        forbidden: [/\bJPY\b/i, /\bUSD\b/i, /US\$/],
      },
    },
  },
  {
    locale: "ja",
    files: [
      "ja.html",
      "ja/index.html",
      "ja/yunnan/index.html",
      "ja/xinjiang/index.html",
      "ja/dunhuang/index.html",
      "ja/inner-mongolia/index.html",
      "ja/sanya/index.html",
      "ja/northeast/index.html",
      "ja/interest/index.html",
      "ja/consult/index.html",
    ],
    requiredOnDestinationPages: /\bJPY\b/,
    requiredOnBudgetPages: /\bJPY\b/,
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
      "ko/inner-mongolia/index.html",
      "ko/sanya/index.html",
      "ko/northeast/index.html",
      "ko/interest/index.html",
      "ko/consult/index.html",
    ],
    requiredOnDestinationPages: /\bKRW\b/,
    requiredOnBudgetPages: /\bKRW\b/,
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
      "th/inner-mongolia/index.html",
      "th/sanya/index.html",
      "th/northeast/index.html",
      "th/interest/index.html",
      "th/consult/index.html",
    ],
    requiredOnDestinationPages: /\bTHB\b/,
    requiredOnBudgetPages: /\bTHB\b/,
    forbidden: [/\bNT\$/i, /\bTWD\b/i, /\bRMB\b/i, /\bCNY\b/i, /\bJPY\b/i, /US\$/],
  },
  {
    locale: "ru",
    files: [
      "ru.html",
      "ru/index.html",
      "ru/yunnan/index.html",
      "ru/xinjiang/index.html",
      "ru/dunhuang/index.html",
      "ru/inner-mongolia/index.html",
      "ru/sanya/index.html",
      "ru/northeast/index.html",
      "ru/interest/index.html",
    ],
    requiredOnDestinationPages: /(?:\bRUB\b|₽)/,
    requiredOnBudgetPages: /(?:\bRUB\b|₽)/,
    forbidden: [/\bNT\$/i, /\bTWD\b/i, /\bRMB\b/i, /\bCNY\b/i, /\bJPY\b/i, /\bKRW\b/i, /\bTHB\b/i, /US\$/],
  },
];

function isDestination(file) {
  return /(?:^|\/)(yunnan|xinjiang|dunhuang|inner-mongolia|sanya|northeast)(?:\.html|\/index\.html)$/.test(file);
}

function hasBudgetSelect(html) {
  return /<select\b[^>]*name=["']budget["'][\s\S]*?<\/select>/i.test(html);
}

function visibleTextHtml(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
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
    const visibleHtml = visibleTextHtml(html);
    const rules = Object.assign({}, check, check.fileOverrides?.[file] || {});
    for (const forbidden of rules.forbidden) {
      if (forbidden.test(visibleHtml)) {
        issues.push(`${check.locale} ${file}: forbidden currency pattern ${forbidden}`);
      }
    }
    if (isDestination(file) && !rules.requiredOnDestinationPages.test(visibleHtml)) {
      issues.push(`${check.locale} ${file}: missing expected destination currency ${rules.requiredOnDestinationPages}`);
    }
    if (hasBudgetSelect(visibleHtml) && rules.requiredOnBudgetPages && !rules.requiredOnBudgetPages.test(visibleHtml)) {
      issues.push(`${check.locale} ${file}: missing expected budget form currency ${rules.requiredOnBudgetPages}`);
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
