(() => {
  const leadFieldValue = (form, name) => {
    const field = form.querySelector('[name="' + name + '"]');
    return field && field.value ? field.value.trim() : "";
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
      page_location: window.location.href,
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

  const pushLeadEvent = (form, overrides = {}) => {
    const now = Date.now();
    const lastTrackedAt = Number(form.dataset.generateLeadTrackedAt || 0);
    if (now - lastTrackedAt < 4000) return null;
    form.dataset.generateLeadTrackedAt = String(now);

    const payload = leadTrackingPayload(form, overrides);
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", payload);
    } else {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: "generate_lead" }, payload));
    }
    window.dispatchEvent(new CustomEvent("bluehour:generate_lead", { detail: payload }));
    return payload;
  };

  window.BluehourLeadTracking = Object.assign({}, window.BluehourLeadTracking, {
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
      success: "已收到，若青中國旅策會回覆一份路線遊記式建議與初步方案報價。",
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

  const fieldValues = (form) => {
    const params = new URLSearchParams(window.location.search);
    return {
      submitted_at: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer || "",
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
      utm_content: params.get("utm_content") || params.get("content") || leadFieldValue(form, "utm_content") || ""
    };
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

  const enableButton = (button, originalLabel) => {
    if (!button) return;
    button.disabled = false;
    button.textContent = originalLabel;
  };

  const handleSheetSubmit = (form) => {
    form.addEventListener("submit", async (event) => {
      if (leadFieldValue(form, "bot-field")) {
        event.preventDefault();
        return;
      }
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

      if (!endpoint.startsWith("https://")) {
        status.className = "form-status error";
        status.innerHTML =
          fallbackMessage +
          ' <a href="mailto:bluehourchina@gmail.com?subject=Bluehour%20China%20journey%20review">bluehourchina@gmail.com</a>';
        enableButton(button, originalLabel);
        return;
      }

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formBody(form, "google_sheet_webapp"),
          redirect: "follow",
          keepalive: true
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.ok === false) {
          throw new Error(result.error || "Google Sheet intake failed");
        }
        pushLeadEvent(form, { intakeProvider: "google_sheet_webapp" });
        status.className = "form-status success";
        status.textContent = form.dataset.successMessage || copyText.success;
        form.reset();
        setHiddenFields(form);
        setIntakeProvider(form, "google_sheet_webapp");
        enableButton(button, originalLabel);
      } catch (error) {
        if (/formsubmit\.co/i.test(form.action || "")) {
          setIntakeProvider(form, "formsubmit_email_fallback");
          pushLeadEvent(form, { intakeProvider: "formsubmit_email_fallback" });
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

    if (form.dataset.sheetEndpoint) {
      setIntakeProvider(form, "google_sheet_webapp");
      handleSheetSubmit(form);
      return;
    }
    if (!/formsubmit\.co/i.test(form.action || "")) return;

    form.addEventListener("submit", async (event) => {
      if (leadFieldValue(form, "bot-field")) return;
      event.preventDefault();

      setHiddenFields(form);
      const status = getStatus(form);
      const button = form.querySelector('button[type="submit"]');
      const originalLabel = button ? button.textContent : "";
      const nextUrl = leadFieldValue(form, "_next") || "/thanks.html";
      const fallbackMessage = form.dataset.errorMessage || message(form).fallback;

      status.className = "form-status";
      status.textContent = "";
      if (button) {
        button.disabled = true;
        button.textContent = form.dataset.sendingMessage || message(form).sending;
      }

      try {
        await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          mode: "no-cors",
          keepalive: true
        });
        pushLeadEvent(form, { intakeProvider: "formsubmit_email" });
        window.location.href = nextUrl;
      } catch (error) {
        status.className = "form-status error";
        status.innerHTML =
          fallbackMessage +
          ' <a href="mailto:bluehourchina@gmail.com?subject=Bluehour%20China%20journey%20review">bluehourchina@gmail.com</a>';
        if (button) {
          button.disabled = false;
          button.textContent = originalLabel;
        }
        pushLeadEvent(form, { intakeProvider: "formsubmit_email_fallback" });
        fallbackSubmit(form);
      }
    });
  });
})();
