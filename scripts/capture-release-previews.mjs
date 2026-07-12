import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const moduleDir = process.env.NODE_MODULE_DIR || path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = require(path.join(moduleDir, "playwright"));

const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:8787";
const outputDir = path.resolve(
  process.cwd(),
  process.env.PREVIEW_OUTPUT_DIR || "output/playwright/release-copy-ux-final"
);
const executablePath = process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const allRoutes = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast", "xian", "tibet", "zhangjiajie"];
const routeFilter = (process.env.PREVIEW_ROUTES || "").split(",").filter(Boolean);
const routes = routeFilter.length ? allRoutes.filter((route) => routeFilter.includes(route)) : allRoutes;
const allViewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 },
];
const viewportFilter = process.env.PREVIEW_VIEWPORT || "";
const viewports = allViewports.filter((viewport) => !viewportFilter || viewport.name === viewportFilter);
const captureHome = process.env.PREVIEW_HOME !== "0";
const supportPages = [
  { slug: "about", path: "/about.html", section: "#apply" },
  { slug: "faq", path: "/faq.html", section: ".questions" },
  { slug: "wechat", path: "/zh/before-china/wechat-pay-visa-mastercard/", section: "#visual-guide" },
  { slug: "consult", path: "/zh.html", section: "#plan-trip", top: false },
];
let captureCount = 0;

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext();
const page = await context.newPage();

async function settleVisibleImages(locator) {
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluateAll((elements) => Promise.all(
    elements.flatMap((element) => [...element.querySelectorAll("img")])
      .filter((image) => image.currentSrc)
      .map((image) => image.decode().catch(() => undefined))
  ));
}

async function captureSection(locator, filename) {
  await settleVisibleImages(locator);
  await page.waitForTimeout(250);
  const chromeMask = await page.addStyleTag({ content: ".nav,.mobile-lang,.sticky-review{visibility:hidden!important}" });
  try {
    await locator.screenshot({ path: path.join(outputDir, filename) });
  } finally {
    await chromeMask.evaluate((element) => element.remove());
  }
  captureCount += 1;
}

try {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    if (captureHome) {
      await page.goto(new URL("/zh.html", origin).toString(), { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(outputDir, `zh-home-${viewport.name}.png`) });
      captureCount += 1;
      const care = page.locator("#care.service-band").first();
      if (await care.count()) {
        await captureSection(care, `zh-home-care-${viewport.name}.png`);
      }
      const guides = page.locator(".compact-guides").first();
      if (await guides.count()) {
        await captureSection(guides, `zh-home-guides-${viewport.name}.png`);
      }
      const destinationMap = page.locator(".destination-map-band").first();
      if (await destinationMap.count()) {
        await destinationMap.scrollIntoViewIfNeeded();
        await page.waitForTimeout(900);
        await captureSection(destinationMap, `zh-home-map-${viewport.name}.png`);
      }

      await page.goto(new URL("/zh/stories/", origin).toString(), { waitUntil: "networkidle", timeout: 30000 });
      const journals = page.locator("#journey-journals").first();
      await captureSection(journals, `zh-stories-journals-${viewport.name}.png`);

      for (const support of supportPages) {
        await page.goto(new URL(support.path, origin).toString(), { waitUntil: "networkidle", timeout: 30000 });
        await page.waitForTimeout(350);
        if (support.top !== false) {
          await page.screenshot({ path: path.join(outputDir, `${support.slug}-top-${viewport.name}.png`) });
          captureCount += 1;
        }
        const section = page.locator(support.section).first();
        if (await section.count()) {
          await captureSection(section, `${support.slug}-section-${viewport.name}.png`);
        }
      }
    }

    for (const route of routes) {
      await page.goto(new URL(`/zh/${route}/`, origin).toString(), { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(outputDir, `${route}-hero-${viewport.name}.png`) });
      captureCount += 1;
      for (const [name, selector] of [["overview", ".visual-route-overview"], ["route", ".standard-route-band"], ["days", ".route-day-plan-band"], ["scenes", ".material-notes-band"]]) {
        const locator = page.locator(selector).first();
        if (await locator.count()) {
          await captureSection(locator, `${route}-${name}-${viewport.name}.png`);
        }
      }
    }
  }
} finally {
  await browser.close();
}

console.log(`Captured ${captureCount} release previews in ${outputDir}`);
