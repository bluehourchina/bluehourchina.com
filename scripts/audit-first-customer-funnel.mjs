import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputPath = path.join(root, "outputs", "first-customer-funnel-audit.json");
const dateKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const seedDate = "2026-07-05";

async function preferTodayFile(prefix, ext) {
  const today = path.join(root, "ops", `${prefix}-${dateKey}.${ext}`);
  try {
    await fs.access(today);
    return today;
  } catch {
    return path.join(root, "ops", `${prefix}-${seedDate}.${ext}`);
  }
}

const files = {
  execution: await preferTodayFile("first-customer-execution-log", "csv"),
  replies: await preferTodayFile("first-customer-reply-log", "csv"),
  leads: path.join(root, "ops", "first-customer-lead-inbox.csv"),
};

const highIntentLinks = {
  natural_wonders_15d: "/china-travel/china-natural-wonders-15-days/",
  zhangjiajie_senior_route: "/china-travel/zhangjiajie-senior-friendly-route/",
  guangzhou_luxury_family: "/china-travel/guangzhou-luxury-hotel-family/",
};

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (lines.length <= 1) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]));
  });
}

function angleFromUrl(url) {
  try {
    return new URL(url).searchParams.get("angle") || "";
  } catch {
    return "";
  }
}

async function localPageExists(url) {
  try {
    const parsed = new URL(url);
    let pathname = parsed.pathname;
    if (pathname.endsWith("/")) pathname += "index.html";
    else if (!path.extname(pathname)) pathname += ".html";
    await fs.access(path.join(root, pathname.replace(/^\//, "")));
    return true;
  } catch {
    return false;
  }
}

const execution = parseCsv(await fs.readFile(files.execution, "utf8"));
const replies = parseCsv(await fs.readFile(files.replies, "utf8"));
const leads = parseCsv(await fs.readFile(files.leads, "utf8"));

const awaitingApproval = execution.filter((row) => /awaiting_user_approval_to_post/.test(row.status));
const readyNotPosted = execution.filter((row) => /ready_not_posted|ready_not_sent|needs_login/.test(row.status));
const posted = execution.filter(
  (row) =>
    row.posting_url?.trim() &&
    !/awaiting_user_approval_to_post|ready_not_posted|ready_not_sent|needs_login|hold_low_priority/.test(row.status)
);
const qualifiedLeads = leads.filter((row) => row.lead_stage === "qualified" || row.lead_stage === "quoted" || row.lead_stage === "won");

const linkChecks = [];
const internalFileChecks = [];
for (const row of [...execution, ...replies]) {
  const link = row.tracking_link;
  if (!link || !/^https:\/\/bluehourchina\.com/.test(link)) continue;
  const angle = angleFromUrl(link);
  const expectedPath = highIntentLinks[angle];
  const exists = await localPageExists(link);
  linkChecks.push({
    title: row.title || row.action || row.asset_or_copy || "",
    angle,
    tracking_link: link,
    exists,
    high_intent_aligned: expectedPath ? new URL(link).pathname === expectedPath : true,
  });
}
for (const row of execution) {
  const rowText = Object.values(row).join(" ");
  const matches = rowText.match(/ops\/[A-Za-z0-9._/-]+\.(?:md|csv|html|json)/g) || [];
  for (const opsPath of matches) {
    const fullPath = path.join(root, opsPath);
    try {
      await fs.access(fullPath);
      internalFileChecks.push({ path: opsPath, exists: true });
    } catch {
      internalFileChecks.push({ path: opsPath, exists: false });
    }
  }
}

const issues = [];
for (const check of linkChecks) {
  if (!check.exists) issues.push(`Missing local target for ${check.tracking_link}`);
  if (!check.high_intent_aligned) issues.push(`High-intent angle ${check.angle} is not using its decision page: ${check.tracking_link}`);
}
for (const check of internalFileChecks) {
  if (!check.exists) issues.push(`Missing internal ops file referenced by execution log: ${check.path}`);
}
if (!leads.length) issues.push("No lead rows yet; first customer goal is not complete.");
if (awaitingApproval.length) issues.push(`${awaitingApproval.length} public Tripadvisor actions are still awaiting explicit user approval.`);
if (!posted.length) issues.push("No public/social post URL has been logged yet.");

const summary = {
  checkedAt: new Date().toISOString(),
  dateKey,
  executionFile: path.relative(root, files.execution),
  replyFile: path.relative(root, files.replies),
  executionRows: execution.length,
  replyRows: replies.length,
  leadRows: leads.length,
  qualifiedLeadRows: qualifiedLeads.length,
  awaitingApprovalRows: awaitingApproval.length,
  readyNotPostedRows: readyNotPosted.length,
  postedRows: posted.length,
  issueCount: issues.length,
  issues,
  internalFileChecks,
  awaitingApproval: awaitingApproval.map((row) => ({
    channel: row.channel,
    action: row.action,
    url: row.posting_url,
    tracking_link: row.tracking_link,
    status: row.status,
  })),
  linkChecks,
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(summary, null, 2));

console.log(`Execution rows: ${summary.executionRows}`);
console.log(`Execution file: ${summary.executionFile}`);
console.log(`Reply rows: ${summary.replyRows}`);
console.log(`Reply file: ${summary.replyFile}`);
console.log(`Lead rows: ${summary.leadRows}`);
console.log(`Qualified leads: ${summary.qualifiedLeadRows}`);
console.log(`Awaiting approval: ${summary.awaitingApprovalRows}`);
console.log(`Posted URLs logged: ${summary.postedRows}`);
console.log(`Issues: ${summary.issueCount}`);
for (const issue of issues) console.log(`ISSUE ${issue}`);

if (issues.some((issue) => /^Missing local target|^High-intent angle/.test(issue))) {
  process.exitCode = 1;
}
