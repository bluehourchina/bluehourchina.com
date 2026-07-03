const apiKey = process.env.TALLY_API_KEY;
const workspaceId = process.env.TALLY_WORKSPACE_ID;
const apiBase = "https://api.tally.so";
const siteUrl = "https://bluehourchina.com";
const replyTo = "bluehourchina@gmail.com";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");

function uuid() {
  return crypto.randomUUID();
}

function richText(html) {
  return { html, mentions: [] };
}

function block(type, groupType, payload, groupUuid = uuid()) {
  return {
    uuid: uuid(),
    type,
    groupUuid,
    groupType,
    payload,
  };
}

function question(title, type, payload) {
  const groupUuid = uuid();
  return [
    block("TITLE", "QUESTION", { html: title }, groupUuid),
    block(type, "QUESTION", payload, groupUuid),
  ];
}

function textQuestion(title, name, placeholder, isRequired = true) {
  return question(title, "INPUT_TEXT", {
    name,
    isRequired,
    placeholder,
  });
}

function emailQuestion(title, name, placeholder, isRequired = false) {
  return question(title, "INPUT_EMAIL", {
    name,
    isRequired,
    placeholder,
  });
}

function longQuestion(title, name, placeholder, isRequired = false) {
  return question(title, "TEXTAREA", {
    name,
    isRequired,
    placeholder,
  });
}

function createPayload() {
  const hiddenFieldNames = [
    "originPage",
    "page_url",
    "referrer",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "campaign",
    "language",
    "destination",
    "destination_prefilled",
    "intake_provider",
  ];

  const blocks = [
    block("FORM_TITLE", "FORM_TITLE", {
      html: "Bluehour China Route Consultation",
      logo: `${siteUrl}/assets/bluehourchina-icon-a.png`,
      cover: `${siteUrl}/assets/ai/bluehour-china-hero-luxury-lake-v2.jpg`,
      coverSettings: { objectPositionYPercent: 48 },
    }),
    ...textQuestion("Name", "name", "Your name"),
    ...emailQuestion("Email", "email", "Email address"),
    ...textQuestion("Preferred contact", "contact", "WhatsApp / WeChat / LINE / other contact"),
    ...textQuestion("Country or region", "country", "Where are you based?"),
    ...textQuestion("Destination or mood", "destination_interest", "Yunnan, Xinjiang, Dunhuang, Sanya, Northeast, or not sure yet"),
    ...textQuestion("Travel window", "travel_window", "When are you hoping to travel?"),
    ...textQuestion("Travellers", "group_size", "Number of travellers and who is joining"),
    ...textQuestion("Language support", "language_needs", "English, Chinese-English, Japanese, Korean, Thai, or other needs"),
    ...textQuestion("Comfort level", "comfort_level", "Boutique, high-end, family comfort, affordable premium, or still deciding"),
    ...textQuestion("Estimated budget", "budget", "Approximate budget per traveller, if known", false),
    ...textQuestion("China travel history", "visited_china_before", "Have you visited mainland China before?", false),
    ...longQuestion(
      "What kind of China do you want to feel?",
      "message",
      "Tell us about places, pace, hotel expectations, concerns, and what would make the journey feel safe and comfortable.",
      false
    ),
    block("HIDDEN_FIELDS", "HIDDEN_FIELDS", {
      hiddenFields: hiddenFieldNames.map((name) => ({ uuid: uuid(), name })),
    }),
  ];

  const payload = {
    status: "PUBLISHED",
    blocks,
    settings: {
      language: "en",
      redirectOnCompletion: richText(`${siteUrl}/thanks.html`),
      hasSelfEmailNotifications: true,
      selfEmailTo: richText(replyTo),
      selfEmailReplyTo: richText(replyTo),
      selfEmailSubject: richText("New Bluehour China route consultation"),
      selfEmailFromName: richText("Bluehour China"),
      selfEmailBody: richText("A new Bluehour China route consultation request has arrived. Open the Tally dashboard to review the full submission."),
      hasProgressBar: false,
      saveForLater: true,
    },
  };

  if (workspaceId) payload.workspaceId = workspaceId;
  return payload;
}

function formUrls(id) {
  return {
    publicUrl: `https://tally.so/r/${id}`,
    embedUrl: `https://tally.so/embed/${id}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`,
  };
}

async function main() {
  const payload = createPayload();

  if (dryRun) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  if (!apiKey) {
    console.error("Missing TALLY_API_KEY. Create a Tally API key, then run:");
    console.error("TALLY_API_KEY=... node scripts/create-tally-intake-form.mjs");
    process.exit(1);
  }

  const response = await fetch(`${apiBase}/forms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { raw: text };
  }

  if (!response.ok) {
    console.error(`Tally form creation failed: ${response.status}`);
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }

  const urls = formUrls(result.id);
  console.log(JSON.stringify({ ...result, ...urls }, null, 2));
  console.error("");
  console.error("Next step:");
  console.error(`TALLY_FORM_ID=${result.id} node scripts/apply-tally-backend.mjs`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
