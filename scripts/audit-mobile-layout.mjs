import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nodeModuleCandidates = [
  process.env.NODE_MODULE_DIR,
  path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
  "/Users/jojo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
].filter(Boolean);

let chromium;
let lastPlaywrightError;
for (const nodeModulesDir of nodeModuleCandidates) {
  try {
    ({ chromium } = require(path.join(nodeModulesDir, "playwright")));
    break;
  } catch (error) {
    lastPlaywrightError = error;
  }
}
if (!chromium) {
  try {
    ({ chromium } = require("playwright"));
  } catch (error) {
    lastPlaywrightError = error;
  }
}
if (!chromium) throw lastPlaywrightError;

const root = process.cwd();
const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:8787";
const outputDir = path.join(root, "outputs");
const chromeExecutable =
  process.env.CHROME_EXECUTABLE ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const destinationSlugs = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet", "zhangjiajie"];
const multilingualPages = [
  "/",
  "/interest.html",
  ...destinationSlugs.map((slug) => `/${slug}.html`),
  "/en.html",
  "/en/interest/",
  ...destinationSlugs.map((slug) => `/en/${slug}/`),
  "/zh.html",
  "/zh/interest/",
  ...destinationSlugs.map((slug) => `/zh/${slug}/`),
  "/ja.html",
  "/ja/interest/",
  ...destinationSlugs.map((slug) => `/ja/${slug}/`),
  "/ko.html",
  "/ko/interest/",
  ...destinationSlugs.map((slug) => `/ko/${slug}/`),
  "/th.html",
  "/th/interest/",
  ...destinationSlugs.map((slug) => `/th/${slug}/`),
  "/ru.html",
  "/ru/interest/",
  ...destinationSlugs.map((slug) => `/ru/${slug}/`),
];

const allPages = [...new Set([
  ...multilingualPages,
  "/before-china/",
  "/before-china/wechat-pay-visa-mastercard/",
  "/before-china/wechat-pay-paypal-china-2026/",
  "/before-china/china-payment-checklist/",
  "/before-china/china-travel-apps-before-trip/",
  "/before-china/china-first-day-arrival-checklist/",
  "/china-travel/",
  "/china-travel/china-natural-wonders-15-days/",
  "/china-travel/zhangjiajie-senior-friendly-route/",
  "/china-travel/guangzhou-luxury-hotel-family/",
  "/yunnan-grand-loop/",
  "/stories.html",
  "/en/stories/",
  "/zh/stories/",
  "/ja/stories/",
  "/ko/stories/",
  "/th/stories/",
  "/ru/stories/",
  "/route-note/",
  "/about.html",
  "/faq.html",
  "/payment-rescue/",
  "/refer/",
  "/consult/",
  "/quick/",
  "/quick/en/",
  "/quick/china/",
  "/zh/before-china/",
  "/zh/before-china/wechat-pay-visa-mastercard/",
  "/zh/before-china/wechat-pay-paypal-china-2026/",
  "/zh/before-china/china-payment-checklist/",
  "/zh/before-china/china-travel-apps-before-trip/",
  "/zh/before-china/china-first-day-arrival-checklist/",
  "/zh/yunnan-grand-loop/",
])];

const pathFilter = process.env.AUDIT_PATH_FILTER || "";
const pathPattern = pathFilter ? new RegExp(pathFilter) : null;
const pages = allPages.filter((pagePath) => !pathPattern || pathPattern.test(pagePath));
const outputSuffix = (process.env.AUDIT_OUTPUT_SUFFIX || "").replace(/[^a-z0-9_-]/gi, "");

const allViewports = [
  { name: "mobile", width: 390, height: 844, isMobile: true },
  { name: "desktop", width: 1440, height: 1100, isMobile: false },
];
const viewportFilter = process.env.AUDIT_VIEWPORT || "";
const viewports = allViewports.filter((viewport) => !viewportFilter || viewport.name === viewportFilter);

function urlFor(pagePath) {
  return new URL(pagePath, origin).toString();
}

async function auditPage(page, pagePath, viewport) {
  const url = urlFor(pagePath);
  const response = await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
  const status = response?.status() || 0;
  const mobileMenus = { site: false, language: false, siteWithinViewport: false, languageWithinViewport: false };
  if (viewport.isMobile) {
    for (const [key, selector, optionsSelector] of [
      ["site", ".mobile-lang details.site-menu", ".site-options"],
      ["language", ".mobile-lang details.language-menu", ".language-options"],
    ]) {
      const menu = page.locator(selector).first();
      if (await menu.count()) {
        await menu.locator("summary").click();
        const state = await menu.evaluate((element, childSelector) => {
          const options = element.querySelector(childSelector);
          if (!element.open || !options) return { visible: false, withinViewport: false };
          const rect = options.getBoundingClientRect();
          const style = getComputedStyle(options);
          return {
            visible: rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden",
            withinViewport: rect.left >= -2 && rect.right <= innerWidth + 2,
          };
        }, optionsSelector);
        mobileMenus[key] = state.visible;
        mobileMenus[`${key}WithinViewport`] = state.withinViewport;
        await menu.locator("summary").click();
      }
    }
  }
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
      .some((element) =>
        element.tagName === "BUTTON" ||
        /consult|start|plan|route|tell us|諮詢|詢問|評估|開始|規劃|相談|問い合わせ|문의|상담|ปรึกษา|วางแผน|ประเมิน|คำแนะนำ|ส่ง|маршрут|план|расчёт|предлож|запрос/i.test(element.textContent || "")
      );

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

  return { path: pagePath, viewport: viewport.name, status, mobileMenus, ...metrics };
}

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });
const context = await browser.newContext();
await context.route(/player\.bilibili\.com/, (route) => route.abort());
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
  if (result.viewport === "mobile") {
    if (!result.mobileMenus.site || !result.mobileMenus.siteWithinViewport) {
      issues.push(`${result.viewport} ${result.path}: mobile site menu missing, closed or outside viewport`);
    }
    if (!result.mobileMenus.language || !result.mobileMenus.languageWithinViewport) {
      issues.push(`${result.viewport} ${result.path}: mobile language menu missing, closed or outside viewport`);
    }
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

const outputName = `mobile-layout-audit${outputSuffix ? `-${outputSuffix}` : ""}.json`;
await fs.writeFile(path.join(outputDir, outputName), JSON.stringify(summary, null, 2));

console.log(`Mobile layout audit checked ${pages.length} pages across ${viewports.length} viewports`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues.slice(0, 80)) console.log(`ISSUE ${issue}`);

if (issues.length) process.exitCode = 1;
