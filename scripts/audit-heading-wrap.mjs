import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const moduleCandidates = [
  process.env.NODE_MODULE_DIR,
  path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
  "/Users/jojo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
].filter(Boolean);

let chromium;
let lastError;
for (const directory of moduleCandidates) {
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
const outputDir = path.join(root, "outputs");
const chromeExecutable = process.env.CHROME_EXECUTABLE || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const excludedDirectories = new Set([".git", "node_modules", "output", "outputs"]);
const fixedArtworkPaths = new Set([
  "/video/yunnan-promo.html",
  "/yunnan-conversion-cards.html",
  "/yunnan-diagnosis-card.html",
]);

async function collectHtml(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(absolute));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

function pagePath(file) {
  const relative = path.relative(root, file).split(path.sep).join("/");
  if (relative === "index.html") return "/";
  if (relative.endsWith("/index.html")) return `/${relative.slice(0, -"index.html".length)}`;
  return `/${relative}`;
}

const filter = process.env.AUDIT_PATH_FILTER || "";
const pattern = filter ? new RegExp(filter) : null;
const pages = (await collectHtml(root))
  .map(pagePath)
  .filter((item) => !fixedArtworkPaths.has(item))
  .filter((item) => !pattern || pattern.test(item))
  .sort();
const allViewports = [
  { name: "phone-320", width: 320, height: 760 },
  { name: "phone-390", width: 390, height: 844 },
];
const viewportFilter = process.env.AUDIT_VIEWPORT || "";
const viewports = allViewports.filter((viewport) => !viewportFilter || viewport.name === viewportFilter);
const outputSuffix = (process.env.AUDIT_OUTPUT_SUFFIX || "").replace(/[^a-z0-9_-]/gi, "");

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });
const context = await browser.newContext();
await context.route(/player\.bilibili\.com/, (route) => route.abort());
const page = await context.newPage();
const results = [];

try {
  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const pathname of pages) {
      const response = await page.goto(new URL(pathname, origin).toString(), { waitUntil: "networkidle", timeout: 30000 });
      await page.evaluate(() => document.fonts?.ready || Promise.resolve());
      const metrics = await page.evaluate(() => {
        const visible = (element) => {
          const rect = element.getBoundingClientRect();
          const style = getComputedStyle(element);
          return rect.width > 0 && rect.height > 0 && style.display !== "none" && style.visibility !== "hidden";
        };
        const graphemeCount = (text) => {
          if (typeof Intl?.Segmenter !== "function") return Array.from(text).length;
          return [...new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text)].length;
        };
        const lineMetrics = (element) => {
          const characters = [];
          const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
          while (walker.nextNode()) {
            const node = walker.currentNode;
            let offset = 0;
            for (const character of Array.from(node.data || "")) {
              const nextOffset = offset + character.length;
              const range = document.createRange();
              range.setStart(node, offset);
              range.setEnd(node, nextOffset);
              const rect = range.getBoundingClientRect();
              if (rect.width > 0 && rect.height > 0) characters.push({ character, top: rect.top, left: rect.left, right: rect.right });
              offset = nextOffset;
            }
          }
          const lines = [];
          for (const character of characters) {
            let line = lines.find((candidate) => Math.abs(candidate.top - character.top) <= 2);
            if (!line) {
              line = { top: character.top, left: character.left, right: character.right, text: "" };
              lines.push(line);
            }
            line.left = Math.min(line.left, character.left);
            line.right = Math.max(line.right, character.right);
            line.text += character.character;
          }
          return lines.sort((a, b) => a.top - b.top).map((line) => ({
            text: line.text.trim(),
            width: Math.round(line.right - line.left),
          })).filter((line) => line.text);
        };

        const candidates = [...document.querySelectorAll(".title-line, h1:not(.cjk-title), h2:not(.cjk-title), h3:not(.cjk-title), p:not(.eyebrow)")].filter(visible);
        const headingIssues = [];
        for (const element of candidates) {
          const text = (element.textContent || "").replace(/\s+/g, " ").trim();
          if (!text) continue;
          const lines = lineMetrics(element);
          const maxWidth = Math.max(0, ...lines.map((line) => line.width));
          const last = lines.at(-1);
          const elementRect = element.getBoundingClientRect();
          const textOverflows = lines.some((line) => line.width > elementRect.width + 3);
          const lastCount = last ? graphemeCount(last.text.replace(/[\s.,，。！？!?、:：;；·|｜—–-]+$/u, "")) : 0;
          const isHeading = element.matches(".title-line, h1, h2, h3");
          const weakLastLine = lines.length > 1 && last && (lastCount <= 1 || (isHeading && lastCount <= 3 && last.width < maxWidth * 0.28));
          if (textOverflows || weakLastLine) {
            headingIssues.push({
              tag: element.tagName.toLowerCase(),
              className: String(element.className || "").slice(0, 100),
              text: text.slice(0, 120),
              lines,
              reason: textOverflows ? "text-overflow" : "orphan-line",
            });
          }
        }

        const viewportWidth = innerWidth;
        const scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
        return { title: document.title, scrollWidth, overflowPx: scrollWidth - viewportWidth, headingIssues };
      });
      results.push({ pathname, viewport: viewport.name, status: response?.status() || 0, ...metrics });
    }
  }
} finally {
  await browser.close();
}

const issues = [];
for (const result of results) {
  if (result.status < 200 || result.status >= 400) issues.push(`${result.viewport} ${result.pathname}: HTTP ${result.status}`);
  if (result.overflowPx > 2) issues.push(`${result.viewport} ${result.pathname}: horizontal overflow ${result.overflowPx}px`);
  for (const heading of result.headingIssues) issues.push(`${result.viewport} ${result.pathname}: ${heading.reason} ${JSON.stringify(heading)}`);
}

await fs.mkdir(outputDir, { recursive: true });
const outputName = `heading-wrap-audit${outputSuffix ? `-${outputSuffix}` : ""}.json`;
await fs.writeFile(path.join(outputDir, outputName), JSON.stringify({
  checkedAt: new Date().toISOString(),
  origin,
  pageCount: pages.length,
  excludedFixedArtwork: [...fixedArtworkPaths],
  viewportCount: viewports.length,
  issueCount: issues.length,
  issues,
  results,
}, null, 2));

console.log(`Heading wrap audit checked ${pages.length} HTML pages across ${viewports.length} phone widths`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues.slice(0, 100)) console.log(`ISSUE ${issue}`);
if (issues.length) process.exitCode = 1;
