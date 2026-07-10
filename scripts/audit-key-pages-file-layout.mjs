import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nodeModuleCandidates = [
  process.env.NODE_MODULE_DIR,
  path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
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
if (!chromium) throw lastPlaywrightError;

const root = process.cwd();
const outputDir = path.join(root, "outputs");
const chromeExecutable =
  process.env.CHROME_EXECUTABLE ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const pages = [
  "yunnan.html",
  "en/yunnan/index.html",
  "zh/yunnan/index.html",
  "ja/yunnan/index.html",
  "ko/yunnan/index.html",
  "th/yunnan/index.html",
  "yunnan-grand-loop/index.html",
  "zh/yunnan-grand-loop/index.html",
];

const viewports = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1440, height: 1100 },
];

function localizeHtml(html) {
  const rootUrl = pathToFileURL(root + path.sep).href.replace(/\/$/, "");
  return html
    .replaceAll('href="/', `href="${rootUrl}/`)
    .replaceAll('src="/', `src="${rootUrl}/`)
    .replaceAll("url('/", `url('${rootUrl}/`)
    .replaceAll('url("/', `url("${rootUrl}/`);
}

async function auditRenderedPage(page, file, viewport) {
  await page.setViewportSize({ width: viewport.width, height: viewport.height });
  const html = localizeHtml(await fs.readFile(path.join(root, file), "utf8"));
  await page.setContent(html, { waitUntil: "networkidle", timeout: 30000 });
  const metrics = await page.evaluate(() => {
    const viewportWidth = window.innerWidth;
    const scrollWidth = Math.max(document.body.scrollWidth, document.documentElement.scrollWidth);
    const offenders = [...document.querySelectorAll("body *")]
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          tag: element.tagName.toLowerCase(),
          id: element.id || "",
          className: String(element.className || "").slice(0, 80),
          text: (element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80),
          left: Math.round(rect.left),
          right: Math.round(rect.right),
          width: Math.round(rect.width),
        };
      })
      .filter((item) => item.width > 0 && (item.left < -2 || item.right > viewportWidth + 2))
      .slice(0, 8);
    const brokenImages = [...document.images]
      .filter((img) => img.currentSrc && img.naturalWidth === 0)
      .map((img) => img.getAttribute("src") || img.currentSrc)
      .slice(0, 8);
    return {
      title: document.title,
      scrollWidth,
      viewportWidth,
      overflowPx: scrollWidth - viewportWidth,
      brokenImages,
      offenders,
    };
  });

  if (viewport.name === "mobile" && /(?:^|\/)(zh\/yunnan|yunnan\.html|yunnan-grand-loop)/.test(file)) {
    const safe = file.replaceAll("/", "-").replaceAll(".", "-");
    await page.screenshot({
      path: path.join(outputDir, `file-layout-${safe}-${viewport.name}.png`),
      fullPage: true,
    });
  }

  return { file, viewport: viewport.name, ...metrics };
}

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });
const context = await browser.newContext();
const page = await context.newPage();
const results = [];

try {
  for (const viewport of viewports) {
    for (const file of pages) {
      results.push(await auditRenderedPage(page, file, viewport));
    }
  }
} finally {
  await browser.close();
}

const issues = [];
for (const result of results) {
  if (result.overflowPx > 2) {
    issues.push(`${result.viewport} ${result.file}: horizontal overflow ${result.overflowPx}px`);
    if (result.offenders.length) {
      issues.push(`${result.viewport} ${result.file}: offenders ${JSON.stringify(result.offenders.slice(0, 3))}`);
    }
  }
  if (result.brokenImages.length) {
    issues.push(`${result.viewport} ${result.file}: broken images ${result.brokenImages.join(", ")}`);
  }
}

const summary = {
  checkedAt: new Date().toISOString(),
  fileCount: pages.length,
  viewportCount: viewports.length,
  issueCount: issues.length,
  issues,
  results,
};

await fs.writeFile(path.join(outputDir, "key-pages-file-layout-audit.json"), JSON.stringify(summary, null, 2));

console.log(`File layout audit checked ${pages.length} files across ${viewports.length} viewports`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues.slice(0, 80)) console.log(`ISSUE ${issue}`);

if (issues.length) process.exitCode = 1;
