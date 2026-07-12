import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excludedDirectories = new Set([".git", "node_modules", "output", "outputs", "public"]);

async function collectHtml(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtml(absolute));
    else if (entry.isFile() && entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

function addClass(attributes, className) {
  const classMatch = attributes.match(/\sclass=(["'])(.*?)\1/);
  if (!classMatch) return `${attributes} class="${className}"`;
  const nextClasses = `${classMatch[2]} ${className}`.trim();
  return attributes.replace(classMatch[0], ` class=${classMatch[1]}${nextClasses}${classMatch[1]}`);
}

let fileCount = 0;
let priceCount = 0;
const directPrice = /<(strong|b|span)([^>]*)>([^<>]*(?:RMB|CNY)[^<>]*?)\s*起<\/\1>/g;
const priceCssHref = "/assets/heading-polish.css?v=20260712-price1";

for (const file of await collectHtml(root)) {
  const html = await fs.readFile(file, "utf8");
  let replacements = 0;
  let updated = html.replace(directPrice, (match, tag, attributes, amount) => {
    if (/\bprice-with-suffix\b/.test(attributes)) return match;
    replacements += 1;
    return `<${tag}${addClass(attributes, "price-with-suffix")}>${amount.trimEnd()}<span class="price-suffix">起</span></${tag}>`;
  });
  if (updated.includes("price-with-suffix")) {
    updated = updated.replace(/\/assets\/heading-polish\.css\?v=[^"']+/, priceCssHref);
  }
  if (updated === html) continue;
  await fs.writeFile(file, updated);
  fileCount += 1;
  priceCount += replacements;
}

console.log(`Normalized ${priceCount} visible starting-price suffixes across ${fileCount} HTML files`);
