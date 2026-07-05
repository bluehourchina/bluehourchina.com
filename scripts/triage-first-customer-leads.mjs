import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inboxPath = path.join(root, "ops", "first-customer-lead-inbox.csv");
const outputPath = path.join(root, "outputs", "first-customer-lead-triage.json");

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

function score(row) {
  const fields = ["travel_month", "group_size", "route_days", "budget_or_comfort", "contact_method"];
  return fields.reduce((sum, field) => sum + (row[field]?.trim() ? 1 : 0), 0);
}

function nextAction(row, scoreValue) {
  if (scoreValue >= 4 && row.contact_method) return "Send route note and starting quote within 12 hours";
  if (scoreValue >= 3) return "Ask for contact method and one missing route field";
  if (/quote|budget|price/i.test(row.first_message || "")) return "Ask for month, group size and comfort level before quoting";
  return "Ask the five qualification fields before counting as a lead";
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

const text = await fs.readFile(inboxPath, "utf8");
const rows = parseCsv(text);
const triage = rows.map((row) => {
  const qualificationScore = score(row);
  return {
    source: row.source,
    platform: row.platform,
    handle_or_name: row.handle_or_name,
    profile_or_thread_url: row.profile_or_thread_url,
    lead_stage: row.lead_stage,
    qualification_score: qualificationScore,
    is_qualified: qualificationScore >= 4 && Boolean(row.contact_method),
    next_action: nextAction(row, qualificationScore),
  };
});

const summary = {
  checkedAt: new Date().toISOString(),
  totalRows: rows.length,
  qualified: triage.filter((item) => item.is_qualified).length,
  warm: triage.filter((item) => item.qualification_score >= 3 && !item.is_qualified).length,
  needsQualification: triage.filter((item) => item.qualification_score < 3).length,
  triage,
};

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, JSON.stringify(summary, null, 2));

console.log(`Lead triage rows: ${summary.totalRows}`);
console.log(`Qualified: ${summary.qualified}`);
console.log(`Warm: ${summary.warm}`);
console.log(`Needs qualification: ${summary.needsQualification}`);
