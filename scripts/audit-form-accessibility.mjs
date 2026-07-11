import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const excluded = new Set([".git", "node_modules", "output", "outputs", "public"]);
const ignoredInputTypes = new Set(["hidden", "submit", "button", "reset", "image"]);

function attributes(tag) {
  const values = new Map();
  const pattern = /\s([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const match of tag.matchAll(pattern)) {
    values.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4] ?? "");
  }
  return values;
}

function plainText(value) {
  return value
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function descriptiveChoiceLabel(value) {
  const normalized = plainText(value).toLowerCase().replace(/[\s:：,.，。!?！？;；()（）]/g, "");
  const generic = new Set([
    "agree", "iagree", "consent", "yes", "accept", "confirm",
    "同意", "我同意", "確認", "接受", "はい", "同意する", "동의", "동의함",
    "ยินยอม", "ตกลง", "согласен", "согласна", "согласие",
  ]);
  if (!normalized || generic.has(normalized)) return false;
  return [...normalized].length >= 5;
}

function isVisibleControl(tagName, attrs) {
  if (attrs.has("hidden") || attrs.get("aria-hidden")?.toLowerCase() === "true") return false;
  const style = attrs.get("style")?.toLowerCase() || "";
  if (/display\s*:\s*none|visibility\s*:\s*hidden/.test(style)) return false;
  if (attrs.get("name") === "bot-field") return false;
  if (tagName === "input" && ignoredInputTypes.has((attrs.get("type") || "text").toLowerCase())) return false;
  return true;
}

function labelBlocks(form) {
  const blocks = [];
  for (const match of form.matchAll(/<label\b[^>]*>[\s\S]*?<\/label>/gi)) {
    const open = match[0].match(/^<label\b[^>]*>/i)?.[0] || "";
    blocks.push({
      start: match.index,
      end: match.index + match[0].length,
      attrs: attributes(open),
      text: plainText(match[0]),
    });
  }
  return blocks;
}

function idHasText(html, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`<([a-z][\\w:-]*)\\b[^>]*\\bid=(?:"${escaped}"|'${escaped}')[^>]*>[\\s\\S]*?<\\/\\1>`, "i"));
  return Boolean(match && plainText(match[0]));
}

function accessibleName({ html, form, control, controlIndex, labels, requireExplicitAssociation = false }) {
  const attrs = control.attrs;
  const ariaLabel = attrs.get("aria-label")?.trim();
  if (ariaLabel) return ariaLabel;

  const labelledBy = attrs.get("aria-labelledby")?.trim();
  if (labelledBy) {
    const valid = labelledBy.split(/\s+/).every((id) => idHasText(html, id));
    if (valid) return labelledBy;
  }

  const id = attrs.get("id")?.trim();
  if (id) {
    const label = labels.find((item) => item.attrs.get("for") === id && item.text);
    if (label) return label.text;
  }

  if (requireExplicitAssociation) return "";
  const wrapper = labels.find((item) => item.start < controlIndex && item.end > controlIndex && item.text);
  return wrapper?.text || "";
}

function auditHtml(html, relativePath) {
  const findings = [];
  let formCount = 0;
  let controlCount = 0;
  for (const formMatch of html.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/gi)) {
    const open = formMatch[0].match(/^<form\b[^>]*>/i)?.[0] || "";
    const formAttrs = attributes(open);
    const classes = (formAttrs.get("class") || "").split(/\s+/);
    if (!classes.includes("lead-form")) continue;

    formCount += 1;
    const form = formMatch[0];
    const labels = labelBlocks(form);
    for (const controlMatch of form.matchAll(/<(input|select|textarea)\b[^>]*>/gi)) {
      const tagName = controlMatch[1].toLowerCase();
      const attrs = attributes(controlMatch[0]);
      if (!isVisibleControl(tagName, attrs)) continue;
      controlCount += 1;

      const name = attrs.get("name") || attrs.get("id") || `${tagName}#${controlCount}`;
      const type = (attrs.get("type") || "").toLowerCase();
      const isChoice = type === "checkbox" || type === "radio";
      const label = accessibleName({
        html,
        form,
        control: { attrs },
        controlIndex: controlMatch.index,
        labels,
        // Require an explicit association for consent controls. This is stricter than
        // an implicit wrapper and is more reliable for voice input and regenerated HTML.
        requireExplicitAssociation: isChoice,
      });
      if (!label) {
        const absoluteIndex = formMatch.index + controlMatch.index;
        const line = html.slice(0, absoluteIndex).split("\n").length;
        findings.push(`${relativePath}:${line} ${tagName}[name="${name}"] has no programmatic label`);
        continue;
      }

      if (isChoice && !descriptiveChoiceLabel(label)) {
        const absoluteIndex = formMatch.index + controlMatch.index;
        const line = html.slice(0, absoluteIndex).split("\n").length;
        findings.push(`${relativePath}:${line} ${tagName}[name="${name}"] has a non-descriptive choice label`);
      }
    }
  }
  return { findings, formCount, controlCount };
}

async function walk(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excluded.has(entry.name)) continue;
    if (entry.name.startsWith(".") && entry.name !== ".github") continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

if (process.argv.includes("--negative-test")) {
  const sample = `<!doctype html><html><body><form class="lead-form"><textarea name="message" placeholder="Tell us more"></textarea><label><input type="checkbox" name="consent"> Agree</label></form></body></html>`;
  const result = auditHtml(sample, "virtual-placeholder-only-form.html");
  if (result.findings.length === 2) {
    console.error("Form accessibility audit blocked the negative fixture: placeholder-only textarea and generic consent label are invalid.");
    for (const finding of result.findings) console.error(`- ${finding}`);
    process.exit(1);
  }
  console.error(`Negative fixture was not blocked as expected (${result.findings.length} findings).`);
  process.exit(2);
}

const findings = [];
let formCount = 0;
let controlCount = 0;
const files = await walk(root);
for (const file of files) {
  const html = await fs.readFile(file, "utf8");
  const result = auditHtml(html, path.relative(root, file));
  findings.push(...result.findings);
  formCount += result.formCount;
  controlCount += result.controlCount;
}

if (findings.length) {
  console.error(`Form accessibility audit failed: ${formCount} lead forms, ${controlCount} visible controls, ${findings.length} issue(s).`);
  for (const finding of findings) console.error(`- ${finding}`);
  process.exit(1);
}

console.log(`Form accessibility audit passed: ${files.length} HTML files, ${formCount} lead forms, ${controlCount} visible controls, 0 unlabelled controls.`);
