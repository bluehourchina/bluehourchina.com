import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const ignoredDirectories = new Set([".git", "node_modules", "output", "outputs", "public"]);
const canonicalEndpoint = "https://script.google.com/macros/s/AKfycbxCxsA5x0zzq_5pqI2MNJcki0MC9R236i_e3oRtu_0QPl7osg9CDHnaOzsSW_sZiRrh/exec";
const sharedAsset = "/assets/lead-form-20260706-sheet.js";

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(absolute));
    else if (entry.name.endsWith(".html")) files.push(absolute);
  }
  return files;
}

const issues = [];
let formCount = 0;
let analyticsPageCount = 0;
for (const file of await htmlFiles(root)) {
  const html = await fs.readFile(file, "utf8");
  const relative = path.relative(root, file);
  if (html.includes(sharedAsset) || html.includes("/assets/language-menu.js")) {
    analyticsPageCount += 1;
  }
  const forms = html.match(/<form\b[^>]*class=(?:"[^"]*\blead-form\b[^"]*"|'[^']*\blead-form\b[^']*')[^>]*>/gi) || [];
  if (!forms.length) continue;
  formCount += forms.length;
  if (!html.includes(sharedAsset)) issues.push(`${relative}: missing ${sharedAsset}`);
  for (const form of forms) {
    if (!form.includes(`data-sheet-endpoint="${canonicalEndpoint}"`)) {
      issues.push(`${relative}: lead form is not connected to the canonical Apps Script release`);
    }
    if (!/action="https:\/\/formsubmit\.co\//i.test(form)) {
      issues.push(`${relative}: lead form is missing the native FormSubmit fallback`);
    }
  }
}

const assetPath = path.join(root, "assets/lead-form-20260706-sheet.js");
const asset = await fs.readFile(assetPath, "utf8");
const languageMenu = await fs.readFile(path.join(root, "assets/language-menu.js"), "utf8");
if (!languageMenu.includes(sharedAsset)) {
  issues.push("assets/language-menu.js: multilingual pages do not bootstrap the analytics asset");
}
for (const forbidden of ["no-cors", "google_sheet_webapp_email_copy"]) {
  if (asset.includes(forbidden)) issues.push(`assets/lead-form-20260706-sheet.js: forbidden legacy path ${forbidden}`);
}
for (const required of [
  "G-G1EB0T35KR",
  'analytics_storage: "denied"',
  "allow_google_signals: false",
  "bluehour_ga4_consent",
  'consentState === "granted"',
  "window.location.origin + window.location.pathname",
  "submission_id",
  "is_test",
  "utm_source_platform",
  "utm_creative_format",
  "utm_marketing_tactic",
  "lead_form_view",
  "lead_form_start",
  "lead_submit_attempt",
  "lead_submit_error",
  "lead_received",
  "generate_lead"
]) {
  if (!asset.includes(required)) issues.push(`assets/lead-form-20260706-sheet.js: missing ${required}`);
}

if (formCount !== 86) issues.push(`expected 86 lead forms, found ${formCount}`);
if (analyticsPageCount < 170) {
  issues.push(`expected analytics coverage on at least 170 HTML pages, found ${analyticsPageCount}`);
}

if (issues.length) {
  console.error(`Lead intake contract audit failed: ${formCount} forms, ${issues.length} issue(s).`);
  for (const issue of issues) console.error(`- ${issue}`);
  process.exit(1);
}

console.log(`Lead intake contract audit passed: ${formCount} forms use one Apps Script release with native FormSubmit fallback; analytics covers ${analyticsPageCount} HTML pages.`);
