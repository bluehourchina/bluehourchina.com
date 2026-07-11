import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nodeModules = process.env.NODE_MODULE_DIR || path.join(process.env.HOME, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = require(path.join(nodeModules, "playwright"));
const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:8787";
const output = path.join(process.cwd(), "outputs", "release-previews-20260711");
const executablePath = process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath });

async function capture({ file, url, viewport, selector, openMenu = false }) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.route(/player\.bilibili\.com|bilibili\.com/, (route) => route.abort());
  await page.goto(new URL(url, origin).toString(), { waitUntil: "networkidle" });
  if (openMenu) await page.locator(".nav .language-menu summary").click();
  const target = selector ? page.locator(selector).first() : page;
  await target.screenshot({ path: path.join(output, file), animations: "disabled" });
  await context.close();
}

await capture({ file: "zh-home-routes-desktop.png", url: "/zh.html", viewport: { width: 1440, height: 1000 }, selector: ".product-routes-band" });
await capture({ file: "zh-grand-yunnan-price.png", url: "/zh/yunnan/", viewport: { width: 1440, height: 1000 }, selector: ".route-extension" });
await capture({ file: "zh-home-mobile.png", url: "/zh.html", viewport: { width: 390, height: 844 }, selector: ".product-routes-band" });
await capture({ file: "ja-dunhuang-card-mobile.png", url: "/ja.html", viewport: { width: 320, height: 812 }, selector: ".product-route-card:nth-child(3)" });
await capture({ file: "zh-language-menu.png", url: "/zh.html", viewport: { width: 1280, height: 800 }, openMenu: true });
await capture({ file: "ru-interest-mobile.png", url: "/ru/interest/", viewport: { width: 390, height: 844 }, selector: ".interest-page" });

await browser.close();
console.log(`Saved release previews to ${output}`);
