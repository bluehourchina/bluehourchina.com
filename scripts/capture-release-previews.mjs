import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const moduleDir = process.env.NODE_MODULE_DIR || path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = require(path.join(moduleDir, "playwright"));

const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:8787";
const outputDir = path.join(process.cwd(), "outputs", "release-previews-20260711-routes-final");
const executablePath = process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const allRoutes = ["yunnan", "xinjiang", "dunhuang", "inner-mongolia", "sanya", "northeast"];
const routeFilter = (process.env.PREVIEW_ROUTES || "").split(",").filter(Boolean);
const routes = routeFilter.length ? allRoutes.filter((route) => routeFilter.includes(route)) : allRoutes;
const allViewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 },
];
const viewportFilter = process.env.PREVIEW_VIEWPORT || "";
const viewports = allViewports.filter((viewport) => !viewportFilter || viewport.name === viewportFilter);
const captureHome = process.env.PREVIEW_HOME !== "0";

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

try {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    if (captureHome) {
      await page.goto(new URL("/zh.html", origin).toString(), { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(outputDir, `zh-home-${viewport.name}.png`) });
    }

    for (const route of routes) {
      await page.goto(new URL(`/zh/${route}/`, origin).toString(), { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(outputDir, `${route}-hero-${viewport.name}.png`) });
      for (const [name, selector] of [["route", ".standard-route-band"], ["scenes", ".material-notes-band"]]) {
        const locator = page.locator(selector).first();
        if (await locator.count()) {
          await settleVisibleImages(locator);
          await page.waitForTimeout(250);
          await locator.screenshot({ path: path.join(outputDir, `${route}-${name}-${viewport.name}.png`) });
        }
      }
    }
  }
} finally {
  await browser.close();
}

console.log(`Captured ${viewports.length * (captureHome ? 1 : 0) + routes.length * viewports.length * 3} release previews in ${outputDir}`);
