import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dateKey = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Taipei",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());
const seedDate = "2026-07-05";
const seedNextDate = "2026-07-06";
const nextDateKey = (() => {
  const date = new Date(`${dateKey}T00:00:00+08:00`);
  date.setDate(date.getDate() + 1);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
})();

const files = {
  execution: path.join(root, "ops", `first-customer-execution-log-${dateKey}.csv`),
  leads: path.join(root, "ops", "first-customer-lead-inbox.csv"),
  nextActions: path.join(root, "ops", `first-customer-next-actions-${dateKey}.md`),
};
const seedFiles = {
  execution: path.join(root, "ops", `first-customer-execution-log-${seedDate}.csv`),
};
const companionFiles = [
  "first-customer-before-china-launch-pack",
  "first-customer-zero-link-sprint",
  "first-customer-partner-targets",
  "first-customer-verified-reply",
];

function shiftSeedDates(text) {
  return text
    .replaceAll(seedNextDate, "__NEXT_DATE__")
    .replaceAll(seedDate, dateKey)
    .replaceAll("__NEXT_DATE__", nextDateKey);
}

async function ensureTodayExecutionFile() {
  try {
    await fs.access(files.execution);
  } catch {
    const seed = await fs.readFile(seedFiles.execution, "utf8");
    await fs.writeFile(files.execution, shiftSeedDates(seed));
  }
}

async function ensureTodayCompanionFiles() {
  for (const name of companionFiles) {
    const ext = name === "first-customer-partner-targets" ? "csv" : "md";
    const today = path.join(root, "ops", `${name}-${dateKey}.${ext}`);
    try {
      await fs.access(today);
    } catch {
      const seed = path.join(root, "ops", `${name}-${seedDate}.${ext}`);
      const text = await fs.readFile(seed, "utf8");
      await fs.writeFile(today, shiftSeedDates(text));
    }
  }
}

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

function firstRows(rows, predicate, limit) {
  return rows.filter(predicate).slice(0, limit);
}

function mdTable(rows) {
  if (!rows.length) return "_None._";
  return [
    "| Priority | Channel | Action | Status | Tracking link |",
    "| --- | --- | --- | --- | --- |",
    ...rows.map((row, index) => (
      `| ${index + 1} | ${row.channel || ""} | ${row.action || ""} | ${row.status || ""} | ${row.tracking_link || ""} |`
    )),
  ].join("\n");
}

function partnerQueueTable() {
  return [
    "| Priority | Partner | Contact | Status | Next action |",
    "| --- | --- | --- | --- | --- |",
    "| 1 | Black Sesame Kitchen | blacksesamekitchenteam@gmail.com | ready_not_sent | Send the cooking-class route-extension referral first; this is the cleanest public-email next step. |",
    "| 2 | Cook In Shanghai | cherry@cookinshanghai.com | send_unconfirmed_timeout | Check Bluehour Gmail Sent Mail before counting or resending. Do not duplicate-send unless no sent record exists. |",
    "| 3 | Shanghai Young Bakers | communication@shanghaiyoungbakers.com | hold_lower_priority | Hold for later community visibility; not a direct first-customer acquisition channel. |",
  ].join("\n");
}

await ensureTodayExecutionFile();
await ensureTodayCompanionFiles();

const execution = parseCsv(await fs.readFile(files.execution, "utf8"));
const leads = parseCsv(await fs.readFile(files.leads, "utf8"));

function isCompletedDistribution(status) {
  return /posted|sent|published|manual_posted|completed/i.test(status || "")
    && !/ready|awaiting|approved_manual|needs_login|hold|blocked|research|created|attempt/i.test(status || "");
}

const posted = execution.filter((row) => row.posting_url?.trim() && isCompletedDistribution(row.status));
const awaitingApproval = execution.filter((row) => row.status === "awaiting_user_approval_to_post");
const approvedManualPending = execution.filter((row) => row.status === "approved_manual_post_required");
const highIntentActions = firstRows(
  execution,
  (row) => /high-intent|high intent|12 high-intent/i.test(`${row.action || ""} ${row.asset_or_copy || ""}`),
  2
);
const ownedWarmActions = firstRows(
  execution,
  (row) => /LINE|WhatsApp|Email/i.test(row.channel) && /ready_not_sent/.test(row.status),
  5
);
const publicReady = firstRows(
  execution,
  (row) => /ready_not_posted|needs_login/.test(row.status) && !/LINE|WhatsApp|Email/i.test(row.channel),
  6
);
const qualified = leads.filter((row) => /qualified|quoted|won/.test(row.lead_stage || ""));
const warm = leads.filter((row) => /warm|qualified|quoted|won/.test(row.lead_stage || ""));

const curatedImmediateActions = [
  {
    channel: "Phone close sprint",
    action: "send Black Sesame Kitchen, 8 warm referrals and 1 payment-rescue public post",
    status: "ready_to_execute",
    tracking_link: "https://bluehourchina.com/ops/first-customer-2026-07-07-phone-close.html",
  },
  {
    channel: "Social + warm network",
    action: "post/send 13 before-China search-intent items, including first-day-after-landing setup",
    status: "ready_to_copy_or_share",
    tracking_link: "https://bluehourchina.com/ops/first-customer-2026-07-07-before-china-social-push.html",
  },
  {
    channel: "Social + Australia/English trend",
    action: "post/send Australia payment-to-route trend push",
    status: "ready_to_copy_or_share",
    tracking_link: "https://bluehourchina.com/ops/first-customer-2026-07-07-australia-payment-push.html",
  },
  {
    channel: "Partner wave 2",
    action: "send Black Sesame Kitchen first, then confirm Cook In Shanghai before duplicate send",
    status: "prepared_in_sheet",
    tracking_link: "https://bluehourchina.com/ops/first-customer-2026-07-07-partner-wave2.html",
  },
  {
    channel: "Public forums + warm network",
    action: "complete 12 high-intent replies",
    status: "ready_not_posted",
    tracking_link: "https://bluehourchina.com/route-note/?utm_source=high_intent_reply&utm_medium=manual&utm_campaign=first_customer_week&angle=route_note_24h",
  },
  {
    channel: "Google search + Reddit-visible results",
    action: "prioritize recent payment questions",
    status: "ready_not_posted",
    tracking_link: "https://bluehourchina.com/payment-rescue/?utm_source=payment_search_reply&utm_medium=manual&utm_campaign=first_customer_week&angle=payment_rescue",
  },
];

const seenImmediate = new Set();
function uniqueAction(row) {
  const key = `${row.channel || ""}::${row.action || ""}::${row.tracking_link || ""}`;
  if (seenImmediate.has(key)) return false;
  seenImmediate.add(key);
  return true;
}

const immediateActions = [
  ...curatedImmediateActions,
  ...highIntentActions,
  ...ownedWarmActions,
  ...publicReady,
].filter(uniqueAction).slice(0, 12);

const md = `# First Customer Next Actions — ${dateKey}

Generated by \`scripts/next-first-customer-actions.mjs\`.

## Current Scoreboard

- Posted URLs logged: ${posted.length}
- Lead rows: ${leads.length}
- Warm leads: ${warm.length}
- Qualified leads: ${qualified.length}
- Public actions awaiting explicit approval: ${awaitingApproval.length}
- Approved public actions requiring manual posting: ${approvedManualPending.length}

## Today KPI Gate

- Minimum public/social URLs to log: 5
- Warm referral sends to complete: 20
- Partner referral messages to complete: 15
- Helpful public replies to complete: 10
- Warm lead rows needed: 3
- Qualified lead rows needed: 1
- Reply SLA after any serious response: 12 hours
- Phone execution board: https://bluehourchina.com/ops/first-customer-mobile-action.html
- Fastest phone close board: https://bluehourchina.com/ops/first-customer-2026-07-07-phone-close.html
- 13 before-China social push board: https://bluehourchina.com/ops/first-customer-2026-07-07-before-china-social-push.html
- Target desk: https://bluehourchina.com/ops/first-customer-2026-07-07-target-desk.html
- 12 high-intent reply board: https://bluehourchina.com/ops/first-customer-2026-07-07-high-intent-reply-board.html
- Lead triage board: https://bluehourchina.com/ops/first-customer-lead-triage.html
- Execution log: https://bluehourchina.com/ops/first-customer-execution-log-${dateKey}.csv

## Immediate Actions Not Requiring Public Posting Approval

${mdTable(immediateActions)}

## New High-Fit Partner Queue

${partnerQueueTable()}

## Approval-Gated Actions

These should not be posted until the user explicitly approves public posting.

${mdTable(awaitingApproval)}

## Approved Manual Public Actions

These have approval, but the browser could not post them automatically. Open each original thread, paste the no-link reply manually, then log the live reply URL.

${mdTable(approvedManualPending)}

## Operating Rule

If no posted URL exists, the acquisition goal is still at the distribution stage. Do not redesign the website first. Publish or send, then log the URL or send count, then move every serious reply into \`ops/first-customer-lead-inbox.csv\`.

If working from a phone, use \`/ops/first-customer-2026-07-07-phone-close.html\` first. It compresses the current best path into one Black Sesame partner email, 8 warm referrals and 1 payment-rescue post. For a broader public push, open \`/ops/first-customer-2026-07-07-before-china-social-push.html\`, use the one-tap share links, then copy the execution row or send proof back for logging.

If public posting is possible, use \`/ops/first-customer-2026-07-07-high-intent-reply-board.html\` before producing more content. It compresses the work into 4 known forum replies, 4 social search replies and 4 warm referrals.

If any person replies with travel intent, paste the reply into \`/ops/first-customer-lead-triage.html\` before quoting. Qualified means contact method plus at least 5 route fields.
`;

await fs.writeFile(files.nextActions, md);

console.log(`Posted URLs logged: ${posted.length}`);
console.log(`Lead rows: ${leads.length}`);
console.log(`Warm leads: ${warm.length}`);
console.log(`Qualified leads: ${qualified.length}`);
console.log(`Awaiting approval: ${awaitingApproval.length}`);
console.log(`Approved manual pending: ${approvedManualPending.length}`);
console.log(`Immediate actions: ${immediateActions.length}`);
console.log(`Wrote ${path.relative(root, files.nextActions)}`);
