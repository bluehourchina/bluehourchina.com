import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const bundledNodeModules =
  process.env.NODE_MODULE_DIR ||
  "/Users/jojo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const { chromium } = require(path.join(bundledNodeModules, "playwright"));

const root = process.cwd();
const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:8787";
const outputDir = path.join(root, "outputs");
const chromeExecutable =
  process.env.CHROME_EXECUTABLE ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const pages = [
  {
    path: "/before-china/wechat-pay-paypal-china-2026/",
    formName: "bluehour-before-china-en-paypal_wechat_pay_2026",
    values: {
      name: "Codex Lead Event Test",
      email: "codex-test@example.com",
      contact: "+1 555 0100 WhatsApp",
      country: "United States",
      destination: "yunnan",
      travel_window: "Within 3-6 months",
      group_size: "2 travellers",
      message: "Testing payment and route-check lead event without external submission."
    }
  },
  {
    path: "/zh/before-china/wechat-pay-paypal-china-2026/",
    formName: "bluehour-before-china-zh-paypal_wechat_pay_2026",
    values: {
      name: "Codex 表單事件測試",
      email: "codex-test@example.com",
      contact: "LINE codex-test",
      country: "台灣",
      destination: "yunnan",
      travel_window: "3-6 個月內",
      group_size: "2 位旅客",
      message: "測試支付頁路線初談表單事件，不送出到外部服務。"
    }
  },
  {
    path: "/route-note/",
    formName: "bluehour-china-route-note-en",
    values: {
      name: "Codex Route Note Test",
      email: "codex-test@example.com",
      contact: "+1 555 0199 WhatsApp",
      country: "United States",
      destination: "zhangjiajie",
      travel_window: "Within 1-3 months",
      route_days: "About one week",
      group_size: "Travelling with seniors",
      comfort_level: "Senior or child comfort matters most",
      budget: "US$2,500-4,000",
      visited_china_before: "Yes, Beijing or Shanghai",
      message: "Testing the 24-hour route note lead event without external submission."
    }
  },
  {
    path: "/payment-rescue/",
    formName: "bluehour-payment-rescue-en",
    values: {
      name: "Codex Payment Rescue Test",
      email: "codex-test@example.com",
      contact: "+1 555 0188 WhatsApp",
      current_city: "Shanghai",
      next_city_or_region: "Yunnan",
      urgency: "Within 2-3 days",
      payment_issue: "Alipay setup or payment failed",
      group_size: "2 travellers",
      message: "Testing the payment rescue route-check lead event without external submission."
    }
  },
  {
    path: "/before-china/china-first-day-arrival-checklist/",
    formName: "bluehour-before-china-en-arrival_day_setup",
    values: {
      name: "Codex Arrival Day Test",
      email: "codex-test@example.com",
      contact: "+1 555 0177 WhatsApp",
      country: "United States",
      destination: "multi-region",
      travel_window: "Within 1-3 months",
      group_size: "2 travellers",
      message: "Testing arrival-day payment, hotel address and first-transfer route-check lead event without external submission."
    }
  },
  {
    path: "/quick/china/",
    formName: "bluehour-china-quick-route-check-en",
    values: {
      name: "Codex Quick China Test",
      contact: "+1 555 0144 WhatsApp",
      destination: "Dunhuang",
      travel_window: "Within 3-6 months",
      route_days: "About one week",
      group_size: "2 travellers",
      message: "Testing the short social route-check form without external submission."
    }
  }
];

function urlFor(pagePath) {
  return new URL(pagePath, origin).toString();
}

async function fillForm(form, values) {
  for (const [name, value] of Object.entries(values)) {
    const field = form.locator(`[name="${name}"]`).first();
    if ((await field.count()) === 0) continue;
    const tagName = await field.evaluate((element) => element.tagName.toLowerCase());
    if (tagName === "select") {
      await field.selectOption(value);
    } else {
      await field.fill(value);
    }
  }
}

async function auditPage(browser, config) {
  const events = [];
  const fetches = [];
  const context = await browser.newContext();
  await context.exposeFunction("recordBluehourLeadEvent", (detail) => {
    events.push(detail);
  });
  await context.exposeFunction("recordBluehourFetch", (detail) => {
    fetches.push(detail);
  });
  await context.addInitScript(() => {
    const summarizeBody = (body) => {
      if (!body || typeof body.entries !== "function") return [];
      return Array.from(body.entries()).map(([key, value]) => [key, String(value)]);
    };
    window.addEventListener("bluehour:generate_lead", (event) => {
      window.recordBluehourLeadEvent(event.detail);
    });
    window.fetch = async (input, init = {}) => {
      window.recordBluehourFetch({
        url: String(input),
        method: init.method || "GET",
        mode: init.mode || "cors",
        fields: summarizeBody(init.body)
      });
      return new Response("", { status: 200 });
    };
  });

  const page = await context.newPage();
  const url = urlFor(config.path);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const form = page.locator(`form[name="${config.formName}"]`).first();
    const formCount = await form.count();
    if (!formCount) {
      return { path: config.path, ok: false, reason: "form not found", events, fetches };
    }
    await form.scrollIntoViewIfNeeded();
    await fillForm(form, config.values);
    await form.locator('button[type="submit"]').click();
    await page.waitForFunction(() => document.body.textContent.includes("Thank you") || document.body.textContent.includes("已收到"), null, { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(250);

    const fetchFields = fetches[0]?.fields || [];
    const fieldMap = Object.fromEntries(fetchFields);
    const event = events[0] || null;
    const sheetPost = fetches.find((fetch) => /script\.google\.com\/macros\/s\//i.test(fetch.url));
    const emailCopyPost = fetches.find((fetch) => /formsubmit\.co/i.test(fetch.url));
    const ok =
      events.length === 1 &&
      fetches.length >= 2 &&
      sheetPost?.mode === "no-cors" &&
      emailCopyPost?.mode === "no-cors" &&
      fieldMap.campaign === "private_route_consultation" &&
      fieldMap.name === config.values.name &&
      fieldMap.contact === config.values.contact &&
      event?.campaign &&
      event?.items?.[0]?.item_category === "Private China travel consultation";

    return {
      path: config.path,
      formName: config.formName,
      ok,
      eventCount: events.length,
      fetchCount: fetches.length,
      campaign: fieldMap.campaign || "",
      intakeProvider: fieldMap.intake_provider || "",
      sheetPostMode: sheetPost?.mode || "",
      emailCopyPostMode: emailCopyPost?.mode || "",
      destination: fieldMap.destination || "",
      eventProvider: event?.intake_provider || "",
      eventCampaign: event?.campaign || "",
      fieldNames: fetchFields.map(([key]) => key)
    };
  } finally {
    await context.close();
  }
}

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });
const results = [];
try {
  for (const config of pages) {
    results.push(await auditPage(browser, config));
  }
} finally {
  await browser.close();
}

const issues = results
  .filter((result) => !result.ok)
  .map((result) => `${result.path}: ${result.reason || "lead event audit failed"}`);

const summary = {
  checkedAt: new Date().toISOString(),
  origin,
  issueCount: issues.length,
  issues,
  results
};

await fs.writeFile(path.join(outputDir, "lead-form-event-audit.json"), JSON.stringify(summary, null, 2));

console.log(`Lead form event audit checked ${results.length} forms`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues) console.log(`ISSUE ${issue}`);

if (issues.length) process.exitCode = 1;
