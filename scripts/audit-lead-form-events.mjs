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
    path: "/zh.html",
    formName: "bluehour-china-home-zh",
    expectedDestination: "xian",
    expectedSuccess: "1 個工作日內回覆",
    expectNotificationFallback: true,
    responseReason: "qualified_departure_within_3_months;notification_fallback_required",
    query: {
      is_test: "true",
      utm_source: "audit_source",
      utm_medium: "audit_medium",
      utm_campaign: "audit_campaign",
      utm_content: "audit_content",
      utm_term: "audit_term",
      utm_id: "audit_id",
      utm_source_platform: "audit_platform",
      utm_creative_format: "audit_format",
      utm_marketing_tactic: "audit_tactic"
    },
    values: {
      name: "Codex 中文首頁表單測試",
      contact: "LINE codex-home-test",
      destination: "xian",
      travel_window: "3-6 個月內",
      route_days: "約一週",
      group_size: "5-6 人",
      budget: "RMB 10,000-18,000",
      message: "測試首頁西安私人路線諮詢，不送出到外部服務。"
    }
  },
  {
    path: "/zh/yunnan/",
    formName: "bluehour-yunnan-product-zh",
    values: {
      name: "Codex 雲南表單測試",
      contact: "+81 90 0000 0000 WhatsApp",
      travel_window: "3-6 個月內",
      group_size: "2 人",
      comfort_level: "精品舒適",
      budget: "RMB 8,000-15,000",
      message: "測試繁中雲南頁的站內詢價表單，不送出到外部服務。"
    }
  },
  {
    path: "/yunnan-itinerary-check.html",
    formName: "yunnan-private-tour-zh",
    responseGrade: "B",
    expectedDestination: "yunnan",
    expectedTravelWindow: "Within 3-6 months",
    expectedRouteDays: "About one week",
    expectedGroupSize: "2 travellers",
    expectedBudget: "RMB 8,000-15,000",
    expectedCanonical: "https://bluehourchina.com/yunnan-itinerary-check.html",
    expectedConsent: "yes",
    expectRequiredUncheckedConsent: true,
    query: {
      utm_source: "youtube",
      utm_medium: "social",
      utm_campaign: "shaxi_video",
      utm_content: "shaxi_itinerary_check"
    },
    values: {
      name: "Codex 沙溪影片表單測試",
      contact: "+886 912 345 678 LINE",
      group_size: "2 travellers",
      travel_window: "Within 3-6 months",
      route_days: "About one week",
      budget: "RMB 8,000-15,000",
      readiness: "正在比較旅行社與私旅",
      style: "住宿位置與舒適度",
      consent_to_contact: true,
      itinerary_text: "測試從 YouTube 沙溪影片進入後的雲南行程比較，不送出到外部服務。"
    }
  },
  {
    path: "/yunnan.html",
    formName: "bluehour-yunnan-product-en",
    responseGrade: "B",
    expectedDestination: "yunnan",
    expectedTravelWindow: "Within 3-6 months",
    expectedRouteDays: "8 days / 7 nights",
    expectedGroupSize: "2 travellers",
    expectedBudget: "RMB 8,000-15,000",
    expectedCanonical: "https://bluehourchina.com/yunnan.html",
    expectedConsent: "yes",
    expectRequiredUncheckedConsent: true,
    query: {
      utm_source: "facebook",
      utm_medium: "travel_group_post",
      utm_campaign: "first_qualified_inquiry",
      utm_content: "yunnan_8_day_price"
    },
    values: {
      name: "Codex Yunnan Product Test",
      contact: "+1 555 0118 WhatsApp",
      travel_window: "Within 3-6 months",
      group_size: "2 travellers",
      comfort_level: "Boutique comfort",
      budget: "RMB 8,000-15,000",
      consent_to_contact: true,
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
      budget: "RMB 8,000-15,000",
      consent_to_contact: true,
      message: "My team specializes in conversion rate optimization, SEO services and web development services to boost your customer acquisition."
    }
  },
  {
    path: "/interest.html",
    formName: "bluehour-china-journey-review-en",
    responseGrade: "B",
    expectedRouteDays: "About one week",
    values: {
      name: "Codex Journey Review Test",
      email: "codex-test@example.com",
      contact: "+1 555 0120 WhatsApp",
      country: "United States",
      destination: "yunnan-grand-loop",
      travel_window: "Within 3-6 months",
      route_days: "About one week",
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
    responseReason: "qualified_complete_request;duplicate_30d",
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
      budget: "RMB 8,000-15,000",
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
      budget: "RMB 15,000-25,000",
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
    path: "/before-china/xinjiang-private-driver-quote-checklist/",
    formName: "bluehour-before-china-en-xinjiang_private_driver_quote",
    responseGrade: "B",
    expectedDestination: "xinjiang-altay-kanas-yining",
    expectedRouteDays: "8-12 days",
    query: {
      utm_source: "audit_source",
      utm_medium: "audit_medium",
      utm_campaign: "audit_campaign",
      utm_content: "audit_content"
    },
    values: {
      name: "Codex Xinjiang Transport Fit Test",
      email: "codex-test@example.com",
      contact: "+1 555 0166 WhatsApp",
      country: "United States",
      destination: "xinjiang-altay-kanas-yining",
      travel_window: "Within 3-6 months",
      group_size: "2 travellers",
      route_days: "8-12 days",
      comfort_level: "Boutique and comfortable",
      consent_to_contact: true,
      message: "Testing the Xinjiang private-driver quote checklist without external submission."
    }
  },
  {
    path: "/quick/china/",
    formName: "bluehour-china-quick-route-check-en",
    expectFallback: true,
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

function urlFor(pagePath, query = {}) {
  const url = new URL(pagePath, origin);
  for (const [name, value] of Object.entries(query)) url.searchParams.set(name, value);
  return url.toString();
}

async function fillForm(form, values) {
  for (const [name, value] of Object.entries(values)) {
    const field = form.locator(`[name="${name}"]`).first();
    if ((await field.count()) === 0) continue;
    const tagName = await field.evaluate((element) => element.tagName.toLowerCase());
    const type = (await field.getAttribute("type") || "").toLowerCase();
    if (tagName === "input" && type === "checkbox") {
      if (value) await field.check();
      else await field.uncheck();
    } else if (tagName === "select") {
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
  const nativeSubmits = [];
  const context = await browser.newContext();
  await context.route("https://www.googletagmanager.com/**", (route) => {
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  await context.exposeFunction("recordBluehourLeadEvent", (event) => {
    events.push(event);
  });
  await context.exposeFunction("recordBluehourFetch", (detail) => {
    fetches.push(detail);
  });
  await context.exposeFunction("recordBluehourNativeSubmit", (detail) => {
    nativeSubmits.push(detail);
  });
  const mockResult = config.expectFallback
    ? { ok: false, error: "mock_intake_failure" }
    : {
        ok: true,
        lead_id: "LEAD-AUDIT-001",
        grade: config.responseGrade || "A",
        qualification_reason: config.responseReason || "audit fixture",
        schema: "lead-intake-v1"
      };
  await context.addInitScript((responseBody) => {
    window.localStorage.setItem("bluehour_ga4_consent", "granted");
    const summarizeBody = (body) => {
      if (!body || typeof body.entries !== "function") return [];
      return Array.from(body.entries()).map(([key, value]) => [key, String(value)]);
    };
    for (const eventName of [
      "lead_form_view",
      "lead_form_start",
      "lead_submit_attempt",
      "lead_submit_error",
      "lead_received",
      "generate_lead"
    ]) {
      window.addEventListener("bluehour:" + eventName, (event) => {
        window.recordBluehourLeadEvent({ name: eventName, detail: event.detail });
      });
    }
    window.fetch = async (input, init = {}) => {
      window.recordBluehourFetch({
        url: String(input),
        method: init.method || "GET",
        mode: init.mode || "cors",
        fields: summarizeBody(init.body)
      });
      return new Response(JSON.stringify(responseBody), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    };
    HTMLFormElement.prototype.submit = function () {
      window.recordBluehourNativeSubmit({
        action: this.action,
        fields: summarizeBody(new FormData(this))
      });
    };
  }, mockResult);

  const page = await context.newPage();
  const url = urlFor(config.path, config.query);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });
    const form = page.locator(`form[name="${config.formName}"]`).first();
    const formCount = await form.count();
    if (!formCount) {
      return { path: config.path, ok: false, reason: "form not found", events, fetches };
    }
    const canonicalHref = config.expectedCanonical
      ? await page.locator('link[rel="canonical"]').first().getAttribute("href").catch(() => "")
      : "";
    const initialConsent = config.expectRequiredUncheckedConsent
      ? await form.locator('[name="consent_to_contact"]').first().evaluate((element) => ({
          checked: element.checked,
          required: element.required,
          type: element.type
        })).catch(() => null)
      : null;
    await form.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await fillForm(form, config.values);
    await form.locator('button[type="submit"]').click();
    await page.waitForTimeout(500);

    const sheetPost = fetches.find((fetch) => /script\.google\.com\/macros\/s\//i.test(fetch.url));
    const fetchFields = sheetPost?.fields || [];
    const fieldMap = Object.fromEntries(fetchFields);
    const successText = await form.locator(".form-status.success").textContent().catch(() => "");
    const eventNames = events.map((event) => event.name);
    const received = events.find((event) => event.name === "lead_received")?.detail;
    const generated = events.find((event) => event.name === "generate_lead")?.detail;
    const nativeSubmit = nativeSubmits[0];
    const nativeFields = Object.fromEntries(nativeSubmit?.fields || []);
    const analytics = await page.evaluate(() => ({
      configured: window.BluehourAnalytics?.configured,
      measurementId: window.BluehourAnalytics?.measurementId,
      consent: window.BluehourAnalytics?.consent,
      hasGtag: typeof window.gtag === "function"
    }));
    const hasLifecycleStart = eventNames.includes("lead_form_view") && eventNames.includes("lead_form_start");
    const hasCompleteUtm = !config.query || Object.entries(config.query)
      .filter(([name]) => name.startsWith("utm_"))
      .every(([name, value]) => fieldMap[name] === value);
    const expectedAnalyticsLocation = new URL(config.path, origin);
    let ok;
    if (config.expectSpam) {
      ok = hasLifecycleStart &&
        fetches.length === 0 &&
        !eventNames.includes("lead_submit_attempt") &&
        !eventNames.includes("lead_received") &&
        !eventNames.includes("generate_lead");
    } else if (config.expectFallback) {
      ok = hasLifecycleStart &&
        eventNames.includes("lead_submit_attempt") &&
        eventNames.includes("lead_submit_error") &&
        !eventNames.includes("lead_received") &&
        !eventNames.includes("generate_lead") &&
        sheetPost?.mode === "cors" &&
        nativeSubmits.length === 1 &&
        /formsubmit\.co/i.test(nativeSubmit?.action || "") &&
        nativeFields.submission_id === fieldMap.submission_id &&
        nativeFields.intake_provider === "formsubmit_email_fallback";
    } else {
      const grade = config.responseGrade || "A";
      const shouldGenerate =
        (grade === "A" || grade === "B") &&
        config.query?.is_test !== "true" &&
        !/duplicate/i.test(config.responseReason || "");
      ok = hasLifecycleStart &&
        eventNames.includes("lead_submit_attempt") &&
        eventNames.includes("lead_received") &&
        eventNames.includes("generate_lead") === shouldGenerate &&
        !eventNames.includes("lead_submit_error") &&
        fetches.length === 1 &&
        sheetPost?.mode === "cors" &&
        fieldMap.campaign === "private_route_consultation" &&
        fieldMap.name === config.values.name &&
        fieldMap.contact === config.values.contact &&
        Boolean(fieldMap.submission_id) &&
        fieldMap.is_test === (config.query?.is_test === "true" ? "true" : "false") &&
        hasCompleteUtm &&
        received?.page_location === expectedAnalyticsLocation.origin + expectedAnalyticsLocation.pathname &&
        (config.expectNotificationFallback
          ? nativeSubmits.length === 1 &&
            /formsubmit\.co/i.test(nativeSubmit?.action || "") &&
            nativeFields.submission_id === fieldMap.submission_id &&
            nativeFields.intake_provider === "formsubmit_email_fallback" &&
            received?.notification_provider === "formsubmit_email_fallback"
          : nativeSubmits.length === 0) &&
        (!config.expectedDestination || fieldMap.destination === config.expectedDestination) &&
        (!config.expectedTravelWindow || fieldMap.travel_window === config.expectedTravelWindow) &&
        (!config.expectedRouteDays || fieldMap.route_days === config.expectedRouteDays) &&
        (!config.expectedGroupSize || fieldMap.group_size === config.expectedGroupSize) &&
        (!config.expectedBudget || fieldMap.budget === config.expectedBudget) &&
        (!config.expectedCanonical || canonicalHref === config.expectedCanonical) &&
        (!config.expectedConsent || fieldMap.consent_to_contact === config.expectedConsent) &&
        (!config.expectRequiredUncheckedConsent ||
          (initialConsent?.type === "checkbox" && initialConsent.required && !initialConsent.checked)) &&
        (!config.expectedSuccess || successText.includes(config.expectedSuccess)) &&
        received?.lead_id === "LEAD-AUDIT-001" &&
        received?.grade === grade &&
        (!shouldGenerate || generated?.grade === grade);
    }
    ok = ok &&
      analytics.configured === true &&
      analytics.measurementId === "G-G1EB0T35KR" &&
      analytics.consent === "granted" &&
      analytics.hasGtag;

    return {
      path: config.path,
      formName: config.formName,
      ok,
      expectedSpam: Boolean(config.expectSpam),
      expectedFallback: Boolean(config.expectFallback),
      eventNames,
      fetchCount: fetches.length,
      nativeSubmitCount: nativeSubmits.length,
      campaign: fieldMap.campaign || "",
      intakeProvider: fieldMap.intake_provider || "",
      sheetPostMode: sheetPost?.mode || "",
      submissionId: fieldMap.submission_id || "",
      isTest: fieldMap.is_test || "",
      destination: fieldMap.destination || "",
      travelWindow: fieldMap.travel_window || "",
      groupSize: fieldMap.group_size || "",
      budget: fieldMap.budget || "",
      consentToContact: fieldMap.consent_to_contact || "",
      canonicalHref,
      initialConsent,
      successText,
      responseGrade: received?.grade || "",
      generatedGrade: generated?.grade || "",
      analytics,
      fieldNames: fetchFields.map(([key]) => key)
    };
  } finally {
    await context.close();
  }
}

async function auditDisabledGa4(browser) {
  const page = await browser.newPage();
  try {
    await page.goto(urlFor("/privacy.html"), { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.evaluate((assetUrl) => new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = assetUrl;
      script.setAttribute("data-ga4-measurement-id", "");
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }), urlFor("/assets/lead-form-20260706-sheet.js"));
    const state = await page.evaluate(() => ({
      configured: window.BluehourAnalytics?.configured,
      measurementId: window.BluehourAnalytics?.measurementId,
      hasGtag: typeof window.gtag === "function",
      hasDataLayer: Array.isArray(window.dataLayer)
    }));
    return {
      ok: state.configured === false && state.measurementId === "" && !state.hasGtag && !state.hasDataLayer,
      ...state
    };
  } finally {
    await page.close();
  }
}

async function auditConsentBanner(browser) {
  const context = await browser.newContext();
  await context.route("https://www.googletagmanager.com/**", (route) => {
    route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });
  const page = await context.newPage();
  try {
    await page.goto(urlFor("/privacy.html"), { waitUntil: "domcontentloaded", timeout: 30000 });
    await page.evaluate(() => window.localStorage.removeItem("bluehour_ga4_consent"));
    await page.evaluate((assetUrl) => new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = assetUrl;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }), urlFor("/assets/lead-form-20260706-sheet.js"));
    const banner = page.locator("#bluehour-analytics-consent");
    await banner.waitFor({ state: "visible" });
    const initial = await page.evaluate(() => ({
      consent: window.BluehourAnalytics?.consent,
      tagLoaded: Boolean(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')),
      commands: (window.dataLayer || []).map((item) => Array.from(item))
    }));
    await banner.locator('[data-consent="granted"]').click();
    const accepted = await page.evaluate(() => ({
      consent: window.BluehourAnalytics?.consent,
      stored: window.localStorage.getItem("bluehour_ga4_consent"),
      bannerExists: Boolean(document.getElementById("bluehour-analytics-consent")),
      tagLoaded: Boolean(document.querySelector('script[src*="googletagmanager.com/gtag/js"]')),
      commands: (window.dataLayer || []).map((item) => Array.from(item))
    }));
    const defaultDenied = initial.commands.some((command) =>
      command[0] === "consent" &&
      command[1] === "default" &&
      command[2]?.analytics_storage === "denied" &&
      command[2]?.ad_storage === "denied"
    );
    const updatedGranted = accepted.commands.some((command) =>
      command[0] === "consent" &&
      command[1] === "update" &&
      command[2]?.analytics_storage === "granted" &&
      command[2]?.ad_storage === "denied"
    );
    return {
      ok: initial.consent === "" && !initial.tagLoaded && defaultDenied && updatedGranted &&
        accepted.consent === "granted" && accepted.stored === "granted" &&
        accepted.tagLoaded && !accepted.bannerExists,
      defaultDenied,
      updatedGranted,
      accepted
    };
  } finally {
    await context.close();
  }
}

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath: chromeExecutable });
const results = [];
let disabledGa4;
let consentBanner;
try {
  for (const config of pages) {
    results.push(await auditPage(browser, config));
  }
  disabledGa4 = await auditDisabledGa4(browser);
  consentBanner = await auditConsentBanner(browser);
} finally {
  await browser.close();
}

const issues = results
  .filter((result) => !result.ok)
  .map((result) => `${result.path}: ${result.reason || "lead event audit failed"}`);
if (!disabledGa4?.ok) issues.push("GA4 loader creates analytics globals when explicitly unconfigured");
if (!consentBanner?.ok) issues.push("GA4 consent banner does not default to denied and persist explicit consent");

const summary = {
  checkedAt: new Date().toISOString(),
  origin,
  issueCount: issues.length,
  issues,
  disabledGa4,
  consentBanner,
  results
};

await fs.writeFile(path.join(outputDir, "lead-form-event-audit.json"), JSON.stringify(summary, null, 2));

console.log(`Lead form event audit checked ${results.length} forms`);
console.log(`Issues: ${issues.length}`);
for (const issue of issues) console.log(`ISSUE ${issue}`);

if (issues.length) process.exitCode = 1;
