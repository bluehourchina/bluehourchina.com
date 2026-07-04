(() => {
  const leadFieldValue = (form, name) =>
    form.querySelector('[name="' + name + '"]')?.value?.trim() || "";

  const leadTrackingPayload = (form, overrides = {}) => {
    const destination = leadFieldValue(form, "destination") || "private-china-route";
    const source = leadFieldValue(form, "utm_source") || "site";
    const medium = leadFieldValue(form, "utm_medium") || "website";
    const campaign = leadFieldValue(form, "utm_campaign") || leadFieldValue(form, "campaign") || "private_route_consultation";
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
      privacy:
        'By submitting, you agree that Bluehour China Journeys may use these details to reply to your inquiry and prepare a route note. See <a href="/privacy.html">Privacy Notice</a>.',
      fallback: "The form did not send. Please email us directly."
    },
    zh: {
      sending: "送出中...",
      privacy:
        '送出後，若青中國旅策會使用這些資料回覆你的諮詢、整理路線筆記與初步報價。請閱讀 <a href="/privacy.html">隱私告知</a>。',
      fallback: "表單暫時沒有送出，請直接寄信給我們。"
    },
    ja: {
      sending: "送信中...",
      privacy:
        '送信後、Bluehour China Journeys はご相談への返信、旅のノート、最初のお見積りのために情報を使用します。<a href="/privacy.html">Privacy Notice</a> をご確認ください。',
      fallback: "フォームを送信できませんでした。直接メールでご連絡ください。"
    },
    ko: {
      sending: "보내는 중...",
      privacy:
        '제출하신 정보는 상담 답변, 루트 노트, 시작 견적 준비에 사용됩니다. <a href="/privacy.html">Privacy Notice</a>를 확인해 주세요.',
      fallback: "양식 전송이 되지 않았습니다. 이메일로 직접 연락해 주세요."
    },
    th: {
      sending: "กำลังส่ง...",
      privacy:
        'หลังส่งแบบฟอร์ม Bluehour China Journeys จะใช้ข้อมูลนี้เพื่อตอบกลับ จัดทำบันทึกเส้นทาง และราคาเริ่มต้น โปรดอ่าน <a href="/privacy.html">Privacy Notice</a>',
      fallback: "ส่งแบบฟอร์มไม่สำเร็จ กรุณาอีเมลถึงเราโดยตรง"
    }
  };

  const langKey = (form) =>
    (form.dataset.formLang || document.documentElement.lang || "en").slice(0, 2);

  const message = (form) => copy[langKey(form)] || copy.en;

  const fieldValues = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      submitted_at: new Date().toISOString(),
      page_url: window.location.href,
      referrer: document.referrer || "",
      utm_source: params.get("utm_source") || "site",
      utm_medium: params.get("utm_medium") || "multilingual",
      utm_campaign: params.get("utm_campaign") || "private_route_consultation"
    };
  };

  const setHiddenFields = (form) => {
    Object.entries(fieldValues()).forEach(([name, value]) => {
      const input = form.querySelector('[name="' + name + '"]');
      if (input) input.value = value;
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

  forms.forEach((form) => {
    setHiddenFields(form);
    ensurePrivacyNotice(form);

    if (form.dataset.sheetEndpoint) return;
    if (!/formsubmit\.co/i.test(form.action || "")) return;

    form.addEventListener("submit", async (event) => {
      if (form.querySelector('[name="bot-field"]')?.value) return;
      event.preventDefault();

      setHiddenFields(form);
      const status = getStatus(form);
      const button = form.querySelector('button[type="submit"]');
      const originalLabel = button ? button.textContent : "";
      const nextUrl = form.querySelector('[name="_next"]')?.value || "/thanks.html";
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
