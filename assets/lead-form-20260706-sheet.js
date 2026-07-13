(() => {
  const measurementId = (() => {
    const currentScript = document.currentScript;
    const scriptValue = currentScript?.hasAttribute("data-ga4-measurement-id")
      ? currentScript.dataset.ga4MeasurementId
      : undefined;
    const configured = scriptValue !== undefined
      ? scriptValue
      : document.querySelector('meta[name="bluehour-ga4-measurement-id"]')?.content ||
        window.BLUEHOUR_GA4_MEASUREMENT_ID ||
        "G-G1EB0T35KR";
    return /^G-[A-Z0-9]+$/i.test(configured.trim()) ? configured.trim().toUpperCase() : "";
  })();

  function ensureGa4Script() {
    if (!measurementId) return;
    const selector = 'script[src*="googletagmanager.com/gtag/js?id=' + measurementId + '"]';
    if (document.querySelector(selector)) return;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(measurementId);
    document.head.appendChild(script);
  }

  let ga4Started = false;
  function startGa4() {
    if (ga4Started || !measurementId || typeof window.gtag !== "function") return;
    ga4Started = true;
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
    ensureGa4Script();
  }

  const consentStorageKey = "bluehour_ga4_consent";
  const readConsent = () => {
    try {
      const value = window.localStorage.getItem(consentStorageKey);
      return value === "granted" || value === "denied" ? value : "";
    } catch (error) {
      return "";
    }
  };
  let consentState = readConsent();

  const setConsent = (value) => {
    consentState = value === "granted" ? "granted" : "denied";
    try {
      window.localStorage.setItem(consentStorageKey, consentState);
    } catch (error) {
      // Consent still applies for this page when storage is unavailable.
    }
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        analytics_storage: consentState,
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied"
      });
    }
    if (consentState === "granted") startGa4();
    if (window.BluehourAnalytics) window.BluehourAnalytics.consent = consentState;
    document.getElementById("bluehour-analytics-consent")?.remove();
  };

  const showConsentBanner = () => {
    if (!document.body || consentState || document.getElementById("bluehour-analytics-consent")) return;
    const lang = (document.documentElement.lang || "en").slice(0, 2);
    const copy = {
      en: ["Help us improve this site with privacy-focused analytics?", "Allow analytics", "No thanks"],
      zh: ["允許我們使用隱私優先的網站分析來改善體驗嗎？", "允許分析", "不允許"],
      ja: ["プライバシーに配慮した分析でサイトを改善してもよいですか？", "許可する", "許可しない"],
      ko: ["개인정보 보호 중심 분석으로 사이트를 개선해도 될까요?", "분석 허용", "허용 안 함"],
      th: ["อนุญาตให้เราใช้การวิเคราะห์ที่คำนึงถึงความเป็นส่วนตัวเพื่อปรับปรุงเว็บไซต์ได้ไหม", "อนุญาต", "ไม่อนุญาต"],
      ru: ["Разрешить конфиденциальную аналитику для улучшения сайта?", "Разрешить", "Нет, спасибо"]
    }[lang] || ["Help us improve this site with privacy-focused analytics?", "Allow analytics", "No thanks"];
    const banner = document.createElement("aside");
    banner.id = "bluehour-analytics-consent";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Analytics preferences");
    banner.style.cssText = "position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;max-width:720px;margin:auto;padding:14px 16px;border:1px solid #d8d2c5;border-radius:12px;background:#fff;color:#25211c;box-shadow:0 8px 30px rgba(0,0,0,.16);font:14px/1.45 system-ui,sans-serif";
    banner.innerHTML = '<p style="margin:0 0 10px">' + copy[0] + ' <a href="/privacy.html" style="color:inherit">Privacy</a></p><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" data-consent="granted" style="padding:8px 12px;border:0;border-radius:999px;background:#315b52;color:#fff;cursor:pointer">' + copy[1] + '</button><button type="button" data-consent="denied" style="padding:8px 12px;border:1px solid #9a9388;border-radius:999px;background:#fff;color:inherit;cursor:pointer">' + copy[2] + "</button></div>";
    banner.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-consent]");
      if (button) setConsent(button.dataset.consent);
    });
    document.body.appendChild(banner);
  };

  const configureGa4 = () => {
    if (!measurementId) return false;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () {
      window.dataLayer.push(arguments);
    };
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      wait_for_update: 500
    });
    if (consentState === "granted") setConsent("granted");
    if (!consentState) window.setTimeout(showConsentBanner, 0);
    return true;
  };

  window.BluehourAnalytics = Object.assign({}, window.BluehourAnalytics, {
    configured: configureGa4(),
    measurementId,
    consent: consentState,
    setConsent
  });

  const leadFieldValue = (form, name) => {
    const field = form.querySelector('[name="' + name + '"]');
    return field && field.value ? field.value.trim() : "";
  };

  const looksLikeLeadSpam = (form) => {
    if (leadFieldValue(form, "bot-field")) return true;

    const values = [
      "country",
      "destination",
      "travel_window",
      "route_days",
      "group_size",
      "comfort_level",
      "budget",
      "visited_china_before",
      "message",
      "itinerary_text"
    ]
      .map((name) => leadFieldValue(form, name))
      .filter(Boolean);
    const normalizedCounts = new Map();

    values.forEach((value) => {
      if (value.length < 60) return;
      const normalized = value.toLowerCase().replace(/\s+/g, " ").trim();
      normalizedCounts.set(normalized, (normalizedCounts.get(normalized) || 0) + 1);
    });

    if ([...normalizedCounts.values()].some((count) => count >= 3)) return true;

    const combined = values.join(" ");
    return /\b(?:conversion rate optimization|search engine optimization|seo services?|web development services?|backlinks?|guest posts?|lead generation services?|boost your customer acquisition|my team specializes in)\b/i.test(combined);
  };

  const quietlyRejectSpam = (form, event) => {
    if (!looksLikeLeadSpam(form)) return false;
    event.preventDefault();
    const status = getStatus(form);
    status.className = "form-status success";
    status.textContent = form.dataset.successMessage || message(form).success;
    form.reset();
    setHiddenFields(form);
    return true;
  };

  const leadTrackingPayload = (form, overrides = {}) => {
    const destination = leadFieldValue(form, "destination") || "private-china-route";
    const source = leadFieldValue(form, "utm_source") || "site";
    const medium = leadFieldValue(form, "utm_medium") || "website";
    const campaign = leadFieldValue(form, "utm_campaign") || leadFieldValue(form, "campaign") || "private_route_consultation";
    const intentAngle = leadFieldValue(form, "intent_angle");
    const sourcePath = leadFieldValue(form, "source_path");
    const sourceContent = leadFieldValue(form, "source_content");
    const utmContent = leadFieldValue(form, "utm_content");
    const language =
      leadFieldValue(form, "language") ||
      leadFieldValue(form, "language_needs") ||
      document.documentElement.lang ||
      "";
    const itemName =
      destination === "private-china-route"
        ? "Private China route consultation"
        : "Private China route consultation - " + destination;
    const value = Number(form.dataset.leadValue || leadFieldValue(form, "lead_value") || "");
    const payload = {
      lead_source: source + " / " + medium,
      form_name: form.getAttribute("name") || "",
      destination,
      language,
      campaign,
      source,
      medium,
      intent_angle: intentAngle || undefined,
      source_path: sourcePath || undefined,
      source_content: sourceContent || undefined,
      utm_content: utmContent || undefined,
      intake_provider:
        overrides.intakeProvider ||
        leadFieldValue(form, "intake_provider") ||
        (form.dataset.sheetEndpoint ? "google_sheet_webapp" : "formsubmit_email"),
      page_location: window.location.origin + window.location.pathname,
      items: [
        {
          item_id: destination,
          item_name: itemName,
          item_category: "Private China travel consultation"
        }
      ]
    };

    if (Number.isFinite(value) && value > 0) {
      payload.value = value;
      payload.currency = form.dataset.leadCurrency || leadFieldValue(form, "lead_currency") || "USD";
    }

    return Object.assign(payload, overrides.payload || {});
  };

  const dispatchLeadEvent = (form, eventName, payload = {}) => {
    const eventPayload = Object.assign(leadTrackingPayload(form), payload);
    if (consentState === "granted" && typeof window.gtag === "function") {
      window.gtag("event", eventName, eventPayload);
    }
    window.dispatchEvent(new CustomEvent("bluehour:" + eventName, { detail: eventPayload }));
    return eventPayload;
  };

  const pushLeadEvent = (form, overrides = {}) => {
    const grade = String(overrides.grade || "").trim().toUpperCase();
    const qualificationReason =
      overrides.qualificationReason || overrides.payload?.qualification_reason || "";
    const isTest = overrides.isTest ?? /^(?:1|true|yes)$/i.test(leadFieldValue(form, "is_test"));
    if ((grade !== "A" && grade !== "B") || isTest || /duplicate/i.test(qualificationReason)) {
      return null;
    }

    const now = Date.now();
    const lastTrackedAt = Number(form.dataset.generateLeadTrackedAt || 0);
    if (now - lastTrackedAt < 4000) return null;
    form.dataset.generateLeadTrackedAt = String(now);

    return dispatchLeadEvent(form, "generate_lead", Object.assign({}, overrides.payload, {
      intake_provider: overrides.intakeProvider || "google_sheet_webapp",
      lead_id: overrides.leadId || "",
      grade
    }));
  };

  window.BluehourLeadTracking = Object.assign({}, window.BluehourLeadTracking, {
    event: dispatchLeadEvent,
    generateLead: pushLeadEvent,
    payload: leadTrackingPayload
  });

  const forms = document.querySelectorAll(".lead-form");
  if (!forms.length) return;

  const copy = {
    en: {
      sending: "Sending...",
      success: "Thank you. We received your request and will reply with a route note and a starting quote.",
      privacy:
        'By submitting, you agree that Bluehour China Journeys may use these details to reply to your inquiry and prepare a route note. See <a href="/privacy.html">Privacy Notice</a>.',
      fallback: "The form did not send. Please email us directly."
    },
    zh: {
      sending: "送出中...",
      success: "已收到，若青中國旅策會回覆一份路線筆記式建議與初步方案報價。",
      privacy:
        '送出後，若青中國旅策會使用這些資料回覆你的諮詢、整理路線筆記與初步報價。請閱讀 <a href="/privacy.html">隱私告知</a>。',
      fallback: "表單暫時沒有送出，請直接寄信給我們。"
    },
    ja: {
      sending: "送信中...",
      success: "受け取りました。旅のノートと最初のお見積りをお送りします。",
      privacy:
        '送信後、Bluehour China Journeys はご相談への返信、旅のノート、最初のお見積りのために情報を使用します。<a href="/privacy.html">Privacy Notice</a> をご確認ください。',
      fallback: "フォームを送信できませんでした。直接メールでご連絡ください。"
    },
    ko: {
      sending: "보내는 중...",
      success: "문의가 접수되었습니다. 루트 노트와 시작 견적을 보내드립니다.",
      privacy:
        '제출하신 정보는 상담 답변, 루트 노트, 시작 견적 준비에 사용됩니다. <a href="/privacy.html">Privacy Notice</a>를 확인해 주세요.',
      fallback: "양식 전송이 되지 않았습니다. 이메일로 직접 연락해 주세요."
    },
    th: {
      sending: "กำลังส่ง...",
      success: "เราได้รับคำขอแล้ว จะตอบกลับพร้อมบันทึกเส้นทางและราคาเริ่มต้น",
      privacy:
        'หลังส่งแบบฟอร์ม Bluehour China Journeys จะใช้ข้อมูลนี้เพื่อตอบกลับ จัดทำบันทึกเส้นทาง และราคาเริ่มต้น โปรดอ่าน <a href="/privacy.html">Privacy Notice</a>',
      fallback: "ส่งแบบฟอร์มไม่สำเร็จ กรุณาอีเมลถึงเราโดยตรง"
    }
  };

  const langKey = (form) =>
    (form.dataset.formLang || document.documentElement.lang || "en").slice(0, 2);

  const message = (form) => copy[langKey(form)] || copy.en;

  const createSubmissionId = () => {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "lead-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 12);
  };

  const fieldValues = (form) => {
    const params = new URLSearchParams(window.location.search);
    const values = {
      submission_id: leadFieldValue(form, "submission_id") || createSubmissionId(),
      is_test:
        /^(?:1|true|yes)$/i.test(params.get("is_test") || "") ||
        /^(?:1|true|yes)$/i.test(leadFieldValue(form, "is_test"))
          ? "true"
          : "false",
      submitted_at: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer || "",
      language:
        leadFieldValue(form, "language") ||
        form.dataset.formLang ||
        document.documentElement.lang ||
        "",
      intent_angle:
        params.get("angle") ||
        params.get("intent_angle") ||
        params.get("video") ||
        leadFieldValue(form, "intent_angle") ||
        "",
      source_path:
        params.get("source_path") ||
        params.get("source_page") ||
        leadFieldValue(form, "source_path") ||
        window.location.pathname,
      utm_source: params.get("utm_source") || leadFieldValue(form, "utm_source") || "site",
      utm_medium: params.get("utm_medium") || leadFieldValue(form, "utm_medium") || "multilingual",
      utm_campaign: params.get("utm_campaign") || leadFieldValue(form, "utm_campaign") || "private_route_consultation",
      utm_content: params.get("utm_content") || params.get("content") || leadFieldValue(form, "utm_content") || "",
      utm_term: params.get("utm_term") || leadFieldValue(form, "utm_term") || "",
      utm_id: params.get("utm_id") || leadFieldValue(form, "utm_id") || "",
      utm_source_platform: params.get("utm_source_platform") || leadFieldValue(form, "utm_source_platform") || "",
      utm_creative_format: params.get("utm_creative_format") || leadFieldValue(form, "utm_creative_format") || "",
      utm_marketing_tactic: params.get("utm_marketing_tactic") || leadFieldValue(form, "utm_marketing_tactic") || ""
    };

    params.forEach((value, name) => {
      if (/^utm_[a-z0-9_]+$/i.test(name) && !(name in values)) values[name] = value;
    });
    return values;
  };

  const renewSubmissionId = (form) => {
    const field = form.querySelector('[name="submission_id"]');
    if (field) field.value = createSubmissionId();
  };

  const setHiddenFields = (form) => {
    Object.entries(fieldValues(form)).forEach(([name, value]) => {
      let input = form.querySelector('[name="' + name + '"]');
      if (!input) {
        input = document.createElement("input");
        input.type = "hidden";
        input.name = name;
        form.appendChild(input);
      }
      if (input) input.value = value;
    });
  };

  const setUrlSelectDefaults = (form) => {
    const params = new URLSearchParams(window.location.search);
    ["destination"].forEach((name) => {
      const value = params.get(name);
      if (!value) return;
      const field = form.querySelector('select[name="' + name + '"]');
      if (!field || field.value) return;
      if ([...field.options].some((option) => option.value === value)) {
        field.value = value;
      }
    });
  };

  const ensurePrivacyNotice = (form) => {
    if (form.querySelector(".form-consent")) return;
    const notice = document.createElement("p");
    notice.className = "form-consent";
    notice.innerHTML = message(form).privacy;
    const fallback = form.querySelector(".form-fallback");
    if (fallback) fallback.insertAdjacentElement("beforebegin", notice);
    else form.appendChild(notice);
  };

  const getStatus = (form) => {
    let status = form.querySelector(".form-status");
    if (!status) {
      status = document.createElement("p");
      status.className = "form-status";
      const button = form.querySelector('button[type="submit"]');
      if (button) button.insertAdjacentElement("afterend", status);
      else form.appendChild(status);
    }
    return status;
  };

  const fallbackSubmit = (form) => {
    HTMLFormElement.prototype.submit.call(form);
  };

  const setIntakeProvider = (form, value) => {
    let input = form.querySelector('[name="intake_provider"]');
    if (!input) {
      input = document.createElement("input");
      input.type = "hidden";
      input.name = "intake_provider";
      form.appendChild(input);
    }
    input.value = value;
  };

  const formBody = (form, intakeProvider) => {
    setHiddenFields(form);
    setIntakeProvider(form, intakeProvider);
    const body = new URLSearchParams();
    new FormData(form).forEach((value, key) => body.append(key, value));
    return body;
  };

  const postToSheet = async (url, body) => {
    const response = await fetch(url, {
      method: "POST",
      body,
      redirect: "follow",
      keepalive: true
    });
    let result;
    try {
      result = await response.json();
    } catch (error) {
      throw new Error("invalid_json_response");
    }
    if (!response.ok || result?.ok !== true) {
      throw new Error(result?.error || "intake_not_confirmed");
    }
    return result;
  };

  const trackOnce = (form, eventName) => {
    const key = "tracked" + eventName
      .split("_")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    if (form.dataset[key]) return;
    form.dataset[key] = "true";
    dispatchLeadEvent(form, eventName);
  };

  const registerFormAnalytics = (form) => {
    const markViewed = () => trackOnce(form, "lead_form_view");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        markViewed();
        observer.disconnect();
      }, { threshold: 0.1 });
      observer.observe(form);
    } else {
      markViewed();
    }

    form.addEventListener("focusin", (event) => {
      if (!event.target.matches("input:not([type=hidden]), select, textarea")) return;
      trackOnce(form, "lead_form_start");
    });
  };

  const enableButton = (button, originalLabel) => {
    if (!button) return;
    button.disabled = false;
    button.textContent = originalLabel;
  };

  const handleSheetSubmit = (form) => {
    form.addEventListener("submit", async (event) => {
      if (quietlyRejectSpam(form, event)) return;
      event.preventDefault();

      const endpoint = form.dataset.sheetEndpoint || "";
      const status = getStatus(form);
      const button = form.querySelector('button[type="submit"]');
      const originalLabel = button ? button.textContent : "";
      const copyText = message(form);
      const fallbackMessage = form.dataset.errorMessage || copyText.fallback;

      status.className = "form-status";
      status.textContent = "";
      if (button) {
        button.disabled = true;
        button.textContent = form.dataset.sendingMessage || copyText.sending;
      }

      dispatchLeadEvent(form, "lead_submit_attempt", {
        submission_id: leadFieldValue(form, "submission_id")
      });

      if (!endpoint.startsWith("https://")) {
        dispatchLeadEvent(form, "lead_submit_error", { error_code: "invalid_sheet_endpoint" });
        if (/formsubmit\.co/i.test(form.action || "")) {
          setIntakeProvider(form, "formsubmit_email_fallback");
          fallbackSubmit(form);
          return;
        }
        status.className = "form-status error";
        status.innerHTML = fallbackMessage;
        enableButton(button, originalLabel);
        return;
      }

      try {
        const result = await postToSheet(endpoint, formBody(form, "google_sheet_webapp"));
        const responsePayload = {
          intake_provider: "google_sheet_webapp",
          submission_id: leadFieldValue(form, "submission_id"),
          is_test: leadFieldValue(form, "is_test"),
          lead_id: result.lead_id || "",
          grade: String(result.grade || "").toUpperCase(),
          qualification_reason: result.qualification_reason || "",
          schema: result.schema || ""
        };
        dispatchLeadEvent(form, "lead_received", responsePayload);
        pushLeadEvent(form, {
          intakeProvider: "google_sheet_webapp",
          leadId: responsePayload.lead_id,
          grade: responsePayload.grade,
          qualificationReason: responsePayload.qualification_reason,
          isTest: responsePayload.is_test === "true",
          payload: responsePayload
        });
        status.className = "form-status success";
        status.textContent = form.dataset.successMessage || copyText.success;
        form.reset();
        renewSubmissionId(form);
        setHiddenFields(form);
        setIntakeProvider(form, "google_sheet_webapp");
        enableButton(button, originalLabel);
      } catch (error) {
        dispatchLeadEvent(form, "lead_submit_error", {
          submission_id: leadFieldValue(form, "submission_id"),
          error_code: error?.message || "intake_request_failed"
        });
        if (/formsubmit\.co/i.test(form.action || "")) {
          setIntakeProvider(form, "formsubmit_email_fallback");
          fallbackSubmit(form);
          return;
        }
        status.className = "form-status error";
        status.innerHTML =
          fallbackMessage +
          ' <a href="mailto:bluehourchina@gmail.com?subject=Bluehour%20China%20journey%20review">bluehourchina@gmail.com</a>';
        enableButton(button, originalLabel);
      }
    });
  };

  forms.forEach((form) => {
    setUrlSelectDefaults(form);
    setHiddenFields(form);
    ensurePrivacyNotice(form);
    registerFormAnalytics(form);

    if (form.dataset.sheetEndpoint) {
      setIntakeProvider(form, "google_sheet_webapp");
      handleSheetSubmit(form);
      return;
    }
    if (!/formsubmit\.co/i.test(form.action || "")) return;

    form.addEventListener("submit", (event) => {
      if (quietlyRejectSpam(form, event)) return;
      setHiddenFields(form);
      setIntakeProvider(form, "formsubmit_email_fallback");
      dispatchLeadEvent(form, "lead_submit_attempt", {
        submission_id: leadFieldValue(form, "submission_id")
      });
    });
  });
})();
