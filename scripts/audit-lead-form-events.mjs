import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const nodeModuleCandidates = [
  process.env.NODE_MODULE_DIR,
  path.join(process.env.HOME || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules"),
  "/Users/jojo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
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
if (!chromium) {
  try {
    ({ chromium } = require("playwright"));
  } catch (error) {
    lastPlaywrightError = error;
  }
}
if (!chromium) throw lastPlaywrightError;

const root = process.cwd();
const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:8787";
const outputDir = path.join(root, "outputs");
const chromeExecutable =
  process.env.CHROME_EXECUTABLE ||
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const pages = [
  {
    path: "/zh/yunnan/",
    formName: "bluehour-yunnan-product-tw",
    values: {
      name: "Codex 台灣雲南表單測試",
      contact: "LINE codex-taiwan-test",
      travel_window: "3-6 個月內",
      group_size: "2 人",
      comfort_level: "精品舒適",
      budget: "NT$35,000-50,000",
      message: "測試台灣出發雲南頁的站內詢價表單，不送出到外部服務。"
    }
  },
  {
    path: "/yunnan.html",
    formName: "bluehour-yunnan-product-en",
    values: {
      name: "Codex Yunnan Product Test",
      contact: "+1 555 0118 WhatsApp",
      travel_window: "Within 3-6 months",
      group_size: "2 travellers",
      comfort_level: "Boutique comfort",
      budget: "US$1,500-2,500",
      message: "Testing the inline Yunnan quote form without external submission."
    }
  },
  {
    path: "/yunnan.html",
    formName: "bluehour-yunnan-product-en",
    expectSpam: true,
    values: {
      name: "Danish",
      contact: "spam-check@example.com",
      travel_window: "Within 3-6 months",
      group_size: "2 travellers",
      comfort_level: "Boutique comfort",
      budget: "US$1,500-2,500",
      message: "My team specializes in conversion rate optimization, SEO services and web development services to boost your customer acquisition."
    }
  },
  {
    path: "/interest.html",
    formName: "bluehour-china-journey-review-en",
    values: {
      name: "Codex Journey Review Test",
      email: "codex-test@example.com",
      contact: "+1 555 0120 WhatsApp",
      country: "United States",
      destination: "yunnan-grand-loop",
      travel_window: "Within 3-6 months",
      group_size: "2 travellers",
      language_needs: "English support preferred",
      comfort_level: "Boutique and comfortable",
      message: "Testing the main private China inquiry form without external submission."
    }
  },
  {
    path: "/zh/interest/",
    formName: "bluehour-china-journey-review-zh",
    values: {
      name: "Codex 私人路線測試",
      email: "codex-test@example.com",
      contact: "微信 codex-test",
      country: "台灣",
      destination: "yunnan-grand-loop",
      travel_window: "3-6 個月內",
      group_size: "2 位旅人",
      language_needs: "偏好中英支援",
      comfort_level: "精品舒適",
      message: "測試繁中主詢問表單，不送出到外部服務。"
    }
  },
  {
    path: "/ja/interest/",
    formName: "bluehour-china-journey-review-ja",
    values: {
      name: "Codex 日本語フォームテスト",
      email: "codex-test@example.com",
      contact: "LINE codex-test",
      country: "日本",
      destination: "yunnan-grand-loop",
      travel_window: "3-6か月以内",
      group_size: "5-6名",
      language_needs: "日本語サポート希望",
      comfort_level: "ブティックで快適",
      message: "日本語の問い合わせフォームを外部送信せずにテストします。"
    }
  },
  {
    path: "/ko/interest/",
    formName: "bluehour-china-journey-review-ko",
    values: {
      name: "Codex 한국어 양식 테스트",
      email: "codex-test@example.com",
      contact: "Kakao codex-test",
      country: "대한민국",
      destination: "inner-mongolia",
      travel_window: "3-6개월 이내",
      group_size: "5-6명",
      language_needs: "중국어-영어 지원 선호",
      comfort_level: "부티크하고 편안하게",
      message: "외부 전송 없이 한국어 문의 양식을 테스트합니다."
    }
  },
  {
    path: "/th/interest/",
    formName: "bluehour-china-journey-review-th",
    values: {
      name: "Codex ทดสอบแบบฟอร์มไทย",
      email: "codex-test@example.com",
      contact: "LINE codex-test",
      country: "ประเทศไทย",
      destination: "dunhuang",
      travel_window: "ภายใน 3-6 เดือน",
      group_size: "5-6 คน",
      language_needs: "ต้องการจีน-อังกฤษ",
      comfort_level: "บูติกและสบาย",
      message: "ทดสอบแบบฟอร์มภาษาไทยโดยไม่ส่งข้อมูลออกภายนอก"
    }
  },
  {
    path: "/ru/interest/",
    formName: "bluehour-china-interest-ru",
    values: {
      name: "Codex тест русской формы",
      contact: "Telegram codex-test",
      destination: "xinjiang",
      travel_window: "3-6 months",
      route_days: "7-9",
      group_size: "5-6",
      budget: "RUB 120000-200000",
      message: "Тест русской формы без внешней отправки."
    }
  },
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
      const matched = await field.evaluate((element, wanted) => {
        const option = [...element.options].find(
          (item) => item.value === wanted || item.textContent.trim() === wanted
        );
        if (!option) return false;
        element.value = option.value;
        element.dispatchEvent(new Event("input", { bubbles: true }));
        element.dispatchEvent(new Event("change", { bubbles: true }));
        return true;
      }, value);
      if (!matched) {
        throw new Error(`No select option for ${name}: ${value}`);
      }
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
    await page.waitForTimeout(500);

    const fetchFields = fetches[0]?.fields || [];
    const fieldMap = Object.fromEntries(fetchFields);
    const event = events[0] || null;
    const sheetPost = fetches.find((fetch) => /script\.google\.com\/macros\/s\//i.test(fetch.url));
    const emailCopyPost = fetches.find((fetch) => /formsubmit\.co/i.test(fetch.url));
    const ok = config.expectSpam
      ? events.length === 0 && fetches.length === 0
      : events.length === 1 &&
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
      expectedSpam: Boolean(config.expectSpam),
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
