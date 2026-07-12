import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const siteOrigin = "https://bluehourchina.com";
const currentLuxuryCssVersions = ["v=20260711-rhythm9", "v=20260712-zhangjiajie1"];
const htmlFiles = [];
const issues = [];
const warnings = [];

const skipDirs = new Set([".git", "outputs", "node_modules"]);
const skipHrefPrefixes = ["mailto:", "tel:", "javascript:", "data:", "#", "sms:", "whatsapp:"];
const internalInstructionPatterns = [/先收\s*10/, /前\s*10\s*(位|份)/, /10\s*(位|份).*評估/];

async function walk(dir = root) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      htmlFiles.push(path.relative(root, full));
    }
  }
}

async function exists(file) {
  try {
    await fs.access(path.join(root, file));
    return true;
  } catch {
    return false;
  }
}

function readAttr(tag, name) {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*["']([^"']*)["']`, "i"));
  return match ? match[1] : "";
}

function tags(html, tagName) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) || [];
}

function cssUrls(text) {
  return [...text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)]
    .map((match) => match[1].trim())
    .filter(Boolean);
}

function cssTexts(html) {
  const styles = (html.match(/<style\b[^>]*>[\s\S]*?<\/style>/gi) || [])
    .map((block) => block.replace(/^<style\b[^>]*>/i, "").replace(/<\/style>$/i, ""));
  const styleAttrs = [...html.matchAll(/\sstyle\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]);
  return [...styles, ...styleAttrs];
}

function isIndexable(html) {
  if (/google-site-verification/i.test(html)) return false;
  const robots = html.match(/<meta\b[^>]*name=["']robots["'][^>]*>/i)?.[0] || "";
  return !/noindex/i.test(robots);
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function resolveInternalRef(ref, fromFile) {
  if (!ref) return null;
  let value = ref.trim();
  if (!value || skipHrefPrefixes.some((prefix) => value.toLowerCase().startsWith(prefix))) return null;
  if (value.startsWith("//")) return null;

  if (/^https?:\/\//i.test(value)) {
    let url;
    try {
      url = new URL(value);
    } catch {
      return null;
    }
    if (url.origin !== siteOrigin) return null;
    value = url.pathname + url.search + url.hash;
  }

  value = value.split("#")[0].split("?")[0];
  if (!value || value === "/") return "index.html";

  let normalized;
  if (value.startsWith("/")) {
    normalized = value.slice(1);
  } else {
    normalized = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), value));
  }
  if (!normalized || normalized === ".") return "index.html";
  return normalized;
}

async function resolvesToFile(ref, fromFile) {
  const normalized = resolveInternalRef(ref, fromFile);
  if (!normalized) return true;
  const candidates = [];

  if (normalized.endsWith("/")) {
    candidates.push(path.posix.join(normalized, "index.html"));
  } else {
    candidates.push(normalized);
    if (!path.posix.extname(normalized)) {
      candidates.push(`${normalized}.html`);
      candidates.push(path.posix.join(normalized, "index.html"));
    }
  }

  for (const candidate of candidates) {
    if (await exists(candidate)) return true;
  }
  return false;
}

function report(kind, file, message) {
  const bucket = kind === "warning" ? warnings : issues;
  bucket.push({ file, message });
}

async function auditFile(file) {
  const html = await fs.readFile(path.join(root, file), "utf8");
  const indexable = isIndexable(html);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || "";
  const description = html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']+)["'][^>]*>/i)?.[1]?.trim() || "";
  const canonical = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i)?.[1]?.trim() || "";
  const visibleText = stripHtml(html);

  if (indexable && !title) report("issue", file, "missing <title>");
  if (indexable && !description) report("issue", file, "indexable page missing meta description");
  if (indexable && !canonical) report("warning", file, "indexable page missing canonical");
  if (indexable && title.length > 90) report("warning", file, `title is long (${title.length} chars)`);
  if (indexable && description && (description.length < 45 || description.length > 180)) {
    report("warning", file, `meta description length may be weak (${description.length} chars)`);
  }
  if (indexable && internalInstructionPatterns.some((pattern) => pattern.test(visibleText))) {
    report("issue", file, "indexable page appears to contain internal campaign wording about 10 leads/reviews");
  }

  for (const link of tags(html, "link")) {
    const href = readAttr(link, "href");
    if (!href) continue;
    if (href.includes("luxury-multilang.css") && !currentLuxuryCssVersions.some((version) => href.includes(version))) {
      report("issue", file, "luxury CSS link is missing current cache-busting version");
    }
    if (!(await resolvesToFile(href, file))) report("issue", file, `broken local link asset: ${href}`);
  }

  for (const script of tags(html, "script")) {
    const src = readAttr(script, "src");
    if (src && !(await resolvesToFile(src, file))) report("issue", file, `broken script source: ${src}`);
  }

  for (const img of tags(html, "img")) {
    const src = readAttr(img, "src");
    if (!src) report("warning", file, "image tag missing src");
    if (src && !(await resolvesToFile(src, file))) report("issue", file, `broken image source: ${src}`);
    if (indexable && !/alt\s*=/.test(img)) report("warning", file, `image missing alt: ${src}`);
  }

  for (const source of tags(html, "source")) {
    const src = readAttr(source, "src") || readAttr(source, "srcset");
    if (src && !(await resolvesToFile(src.split(/\s+/)[0], file))) report("issue", file, `broken source media: ${src}`);
  }

  for (const cssText of cssTexts(html)) {
    for (const url of cssUrls(cssText)) {
      if (!(await resolvesToFile(url, file))) report("issue", file, `broken CSS url reference: ${url}`);
    }
  }

  for (const anchor of tags(html, "a")) {
    const href = readAttr(anchor, "href");
    if (href && !(await resolvesToFile(href, file))) report("issue", file, `broken internal link: ${href}`);
  }

  const forms = html.match(/<form\b[\s\S]*?<\/form>/gi) || [];
  for (const form of forms) {
    const action = readAttr(form.match(/<form\b[^>]*>/i)?.[0] || "", "action");
    const name = readAttr(form.match(/<form\b[^>]*>/i)?.[0] || "", "name");
    if (/lead-form|bluehour-china-journey-review/.test(form)) {
      if (!action) report("warning", file, `lead form${name ? ` ${name}` : ""} missing action`);
      if (!/name=["']name["'][^>]*required/i.test(form)) report("issue", file, "lead form missing required name field");
      if (!/name=["']contact["'][^>]*required/i.test(form)) report("issue", file, "lead form missing required contact field");
      if (!/<input\b[^>]*name=["']campaign["'][^>]*value=["']private_route_consultation["'][^>]*>/i.test(form)) {
        report("issue", file, "lead form missing private_route_consultation hidden campaign");
      }
      if (!/mailto:bluehourchina@gmail.com/.test(form)) report("warning", file, "lead form missing email fallback");
      if (/google_sheet_webapp/.test(form) && !/data-sheet-endpoint=/.test(form)) {
        report("warning", file, "lead form is labelled Google Sheet but has no data-sheet-endpoint yet");
      }
    }
  }
}

await walk();
htmlFiles.sort();

for (const file of htmlFiles) await auditFile(file);

const summary = {
  checkedAt: new Date().toISOString(),
  htmlFiles: htmlFiles.length,
  issueCount: issues.length,
  warningCount: warnings.length,
  issues,
  warnings,
};

await fs.mkdir(path.join(root, "outputs"), { recursive: true });
await fs.writeFile(path.join(root, "outputs", "site-quality-audit.json"), JSON.stringify(summary, null, 2));

console.log(`Site quality audit checked ${htmlFiles.length} HTML files`);
console.log(`Issues: ${issues.length}`);
console.log(`Warnings: ${warnings.length}`);

for (const item of issues.slice(0, 80)) {
  console.log(`ISSUE ${item.file}: ${item.message}`);
}
for (const item of warnings.slice(0, 80)) {
  console.log(`WARN ${item.file}: ${item.message}`);
}

if (issues.length) process.exitCode = 1;
