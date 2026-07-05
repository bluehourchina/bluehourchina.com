import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const bundledNodeModules =
  process.env.NODE_MODULE_DIR ||
  "/Users/jojo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = require(path.join(bundledNodeModules, "playwright"));

const root = process.cwd();
const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:8787";
const outputDir = path.join(root, "outputs");
const chromeExecutable =
  process.env.CHROME_EXECUTABLE ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const pages = [
  "/",
  "/before-china/",
  "/before-china/wechat-pay-visa-mastercard/",
  "/before-china/wechat-pay-paypal-china-2026/",
  "/before-china/china-payment-checklist/",
  "/before-china/china-travel-apps-before-trip/",
  "/china-travel/",
  "/china-travel/china-natural-wonders-15-days/",
  "/china-travel/zhangjiajie-senior-friendly-route/",
  "/china-travel/guangzhou-luxury-hotel-family/",
  "/yunnan.html",
  "/xinjiang.html",
  "/dunhuang.html",
  "/sanya.html",
  "/northeast.html",
  "/stories.html",
  "/interest.html",
  "/route-note/",
  "/consult/",
  "/quick/",
  "/quick/en/",
  "/zh.html",
  "/zh/before-china/",
  "/zh/before-china/wechat-pay-visa-mastercard/",
  "/zh/before-china/china-payment-checklist/",
  "/zh/before-china/china-travel-apps-before-trip/",
  "/zh/yunnan/",
  "/zh/xinjiang/",
  "/zh/dunhuang/",
  "/zh/sanya/",
  "/zh/northeast/",
  "/zh/interest/",
  "/ja.html",
  "/ja/yunnan/",
  "/ja/xinjiang/",
  "/ja/dunhuang/",
  "/ja/sanya/",
  "/ja/northeast/",
  "/ja/interest/",
];

const viewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "desktop", width: 1440, height: 1100, isMobile: false },
];

function urlFor(pagePath) {
  return new URL(pagePath, origin).toString();
}

async function auditPage(page, pagePath, viewport) {
  const url = urlFor(pagePath);
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  const status = response?.status() || 0;
  const metrics = await page.evaluate(() => {
    const visible = (element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    };

    const bodyWidth = document.body.scrollWidth;
    const docWidth = document.documentElement.scrollWidth;
    const viewportWidth = window.innerWidth;
    const offenders = [...document.querySelectorAll("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || "",
          className: String(element.className || "").slice(0, 120),
          text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 90),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter((item) => item.width > 0 && (item.left < -2 || item.right > viewportWidth + 2))
      .slice(0, 12);

    const brokenImages = [...document.images]
      .filter((img) => img.currentSrc && img.naturalWidth === 0)
      .map((img) => img.currentSrc);

    const requiredFields = [...document.querySelectorAll("[required]")].length;
    const hasLeadForm = Boolean(document.querySelector(".lead-form, form[name*='tour'], form[name*='journey'], form[action*='formsubmit']"));
    const hasVisibleForm = [...document.querySelectorAll("form")].some(visible);
    const hasVisibleCta = [...document.querySelectorAll("a,button")]
      .filter(visible)
      .some((element) => /consult|start|route|tell us|諮詢|開始|相談|문의|ปรึกษา/i.test(element.textContent || ""));

    return {
      title: document.title,
      viewportWidth,
      scrollWidth: Math.max(bodyWidth, docWidth),
      overflowPx: Math.max(bodyWidth, docWidth) - viewportWidth,
      offenders,
      brokenImages,
      hasLeadForm,
      hasVisibleForm,
      requiredFields,
      hasVisibleCta,
    };
  });

  return { path: pagePath, viewport: viewport.name, status, ...metrics };
}

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });
const context = await browser.newContext();
const results = [];

try {
  const page = await context.newPage();
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const pagePath of pages) {
      results.push(await auditPage(page, pagePath, viewport));
    }
  }
} finally {
  await browser.close();
}

const issues = [];
for (const result of results) {
  if (result.status < 200 || result.status >= 400) {
    issues.push(`${result.viewport} ${result.path}: HTTP ${result.status}`);
  }
  if (result.overflowPx > 2) {
    issues.push(`${result.viewport} ${result.path}: horizontal overflow ${result.overflowPx}px`);
  }
  if (result.overflowPx > 2 && result.offenders.length) {
    issues.push(`${result.viewport} ${result.path}: overflow offenders ${JSON.stringify(result.offenders.slice(0, 3))}`);
  }
  if (result.brokenImages.length) {
    issues.push(`${result.viewport} ${result.path}: broken images ${result.brokenImages.join(", ")}`);
  }
  if (/interest|consult|quick/.test(result.path) && !result.hasVisibleForm) {
    issues.push(`${result.viewport} ${result.path}: consultation form not visible`);
  }
  if (/interest|consult|quick/.test(result.path) && result.requiredFields < 4) {
    issues.push(`${result.viewport} ${result.path}: too few required fields (${result.requiredFields})`);
  }
  if (!result.hasVisibleCta) {
    issues.push(`${result.viewport} ${result.path}: no visible consultation CTA`);
  }
}

const summary = {
  checkedAt: new Date().toISOString(),
  origin,
  pageCount: pages.length,
  viewportCount: viewports.length,
  issueCount: issues.length,
  issues,
  results,
};

await fs.writeFile(path.join(outputDir, "mobile-layout-audit.json"), JSON.stringify(summary, null, 2));

console.log(`Mobile layout audit checked ${pages.length} pages across ${viewports.length} viewports`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues.slice(0, 80)) console.log(`ISSUE ${issue}`);

if (issues.length) process.exitCode = 1;
