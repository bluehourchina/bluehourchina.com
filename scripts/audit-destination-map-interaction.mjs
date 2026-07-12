import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const moduleDirectories = [
  process.env.NODE_MODULE_DIR,
  path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
].filter(Boolean);

let chromium;
let lastError;
for (const directory of moduleDirectories) {
  try {
    ({ chromium } = require(path.join(directory, "playwright")));
    break;
  } catch (error) {
    lastError = error;
  }
}
if (!chromium) throw lastError;

const root = process.cwd();
const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:8787";
const outputDir = path.join(root, "output", "playwright", process.env.AUDIT_OUTPUT_SUFFIX || "illustrated-map-audit");
const executablePath = process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const pages = ["/", "/zh.html", "/ja.html", "/ko.html", "/th.html", "/ru.html"];
const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1000 },
];
const expectedStops = { yunnan: 5, xinjiang: 6, dunhuang: 7, "inner-mongolia": 4, sanya: 5, northeast: 4, xian: 3, tibet: 5 };
const expectedVisibleNodes = { yunnan: 4, xinjiang: 6, dunhuang: 7, "inner-mongolia": 4, sanya: 5, northeast: 3, xian: 2, tibet: 4 };
const findings = [];
let interactionCount = 0;

await fs.mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });
const context = await browser.newContext();
const page = await context.newPage();

try {
  for (const viewport of viewports) {
    await page.setViewportSize(viewport);
    for (const pathname of pages) {
      const response = await page.goto(new URL(pathname, origin).toString(), { waitUntil: "networkidle", timeout: 30000 });
      if (!response || response.status() >= 400) {
        findings.push(`${viewport.name} ${pathname}: HTTP ${response?.status() || 0}`);
        continue;
      }
      const rootLocator = page.locator("[data-destination-map]");
      const stage = rootLocator.locator(".destination-map-stage");
      await stage.scrollIntoViewIfNeeded();
      const initial = await rootLocator.evaluate((element) => {
        const svg = element.querySelector(".destination-map-svg");
        const reset = element.querySelector("[data-map-reset]");
        const stageElement = element.querySelector(".destination-map-stage");
        const resetRect = reset?.getBoundingClientRect();
        const stageRect = stageElement?.getBoundingClientRect();
        return {
          hasSvg: Boolean(svg),
          viewBox: svg?.getAttribute("viewBox") || "",
          focused: element.classList.contains("is-route-focused"),
          routeNodes: element.querySelectorAll(".map-route-stop").length,
          legendItems: element.querySelectorAll("[data-map-stops] li").length,
          mapAria: svg?.getAttribute("aria-label") || "",
          resetInside: Boolean(resetRect && stageRect && resetRect.left >= stageRect.left - 1 && resetRect.right <= stageRect.right + 1),
          overflow: Math.max(document.body.scrollWidth, document.documentElement.scrollWidth) - innerWidth,
        };
      });
      if (!initial.hasSvg || !initial.mapAria) findings.push(`${viewport.name} ${pathname}: illustrated SVG or localized accessible name missing`);
      if (!initial.focused || initial.routeNodes !== expectedVisibleNodes.yunnan || initial.legendItems !== expectedStops.yunnan) findings.push(`${viewport.name} ${pathname}: default Yunnan loop not rendered`);
      if (!initial.resetInside) findings.push(`${viewport.name} ${pathname}: reset control protrudes outside the map stage`);
      if (initial.overflow > 2) findings.push(`${viewport.name} ${pathname}: horizontal overflow ${initial.overflow}px`);

      const buttons = rootLocator.locator("[data-map-destination]");
      for (let index = 0; index < await buttons.count(); index += 1) {
        const button = buttons.nth(index);
        const slug = await button.getAttribute("data-map-destination");
        await button.click();
        const state = await rootLocator.evaluate((element) => ({
          active: element.querySelector('[data-map-destination][aria-pressed="true"]')?.getAttribute("data-map-destination") || "",
          routeNodes: element.querySelectorAll(".map-route-stop").length,
          legendItems: element.querySelectorAll("[data-map-stops] li").length,
          routeText: element.querySelector("[data-map-route]")?.textContent?.trim() || "",
          href: element.querySelector("[data-map-link]")?.getAttribute("href") || "",
          focused: element.classList.contains("is-route-focused"),
        }));
        interactionCount += 1;
        if (state.active !== slug || !state.focused) findings.push(`${viewport.name} ${pathname}: ${slug} did not become active`);
        if (state.routeNodes !== expectedVisibleNodes[slug] || state.legendItems !== expectedStops[slug]) findings.push(`${viewport.name} ${pathname}: ${slug} route nodes or legend mismatch`);
        if (!state.routeText || !state.href) findings.push(`${viewport.name} ${pathname}: ${slug} route details missing`);
      }

      await rootLocator.locator("[data-map-reset]").click();
      const resetState = await rootLocator.evaluate((element) => ({
        focused: element.classList.contains("is-route-focused"),
        viewBox: element.querySelector(".destination-map-svg")?.getAttribute("viewBox") || "",
      }));
      if (resetState.focused || resetState.viewBox !== "35.0 35.0 930.0 545.0") findings.push(`${viewport.name} ${pathname}: all-China reset did not restore the overview`);

      if (["/zh.html", "/ja.html"].includes(pathname)) {
        const slug = pathname === "/zh.html" ? "zh" : "ja";
        await rootLocator.locator('[data-map-destination="yunnan"]').click();
        await rootLocator.screenshot({ path: path.join(outputDir, `${slug}-yunnan-${viewport.name}.png`) });
        await rootLocator.locator("[data-map-reset]").click();
        await rootLocator.screenshot({ path: path.join(outputDir, `${slug}-all-china-${viewport.name}.png`) });
      }
    }
  }
} finally {
  await browser.close();
}

if (findings.length) {
  console.error(`Destination map interaction audit failed with ${findings.length} issue(s):`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Destination map interaction audit passed: ${pages.length} languages, ${viewports.length} viewports, ${interactionCount} route selections, reset contained, 0 overflow.`);
