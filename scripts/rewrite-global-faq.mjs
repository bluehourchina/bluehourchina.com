import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const questions = [
  [
    "Are these fixed package tours?",
    "No. Each published journey is a clear starting route with days, places and an RMB starting price. Dates, room level and daily pace are refined around your group.",
  ],
  [
    "What does the starting price include?",
    "It is a land-arrangement reference for the group size shown on the route page. Your proposal lists accommodation, private transport, pickup, reservations and language support separately, together with anything not included.",
  ],
  [
    "When do I pay, and what happens if plans change?",
    "There is no payment on the enquiry form. Deposit timing, balance date and the cancellation terms for rooms, vehicles and tickets are shown in the formal proposal before you confirm.",
  ],
  [
    "Do I need a visa or special travel document?",
    "Entry requirements depend on your passport and current policy. Tibet also requires additional travel documents arranged through an eligible local team. We confirm what is needed before the route is accepted; travellers remain responsible for passports, visas and entry eligibility.",
  ],
  [
    "Can I travel without speaking Chinese?",
    "Yes. We plan the moments where language matters most: pickup, hotel check-in, drivers, tickets, food needs and schedule changes. Your proposal states the language support included in the route.",
  ],
  [
    "How are hotels and transport chosen?",
    "We start with location, room comfort and daily driving time. Private vehicles are used where the route requires them, and important train or flight connections are confirmed with enough transfer time.",
  ],
  [
    "How do you handle safety, altitude and travel insurance?",
    "Routes include realistic driving and rest buffers. For high-altitude journeys, the first days remain lighter. Medical advice, personal medication and suitable travel insurance should be confirmed with qualified professionals before departure.",
  ],
  [
    "What happens after I send the form?",
    "The form takes about two minutes and requires no payment. A travel planner replies within one business day with a route direction, an RMB starting estimate and the next details to confirm. Your information is used only for this enquiry.",
  ],
  [
    "Who provides the actual travel services?",
    "Bluehour China prepares the route and confirms the travel brief before departure. Actual reception is provided by local service teams, with accommodation, transport, guiding and key contacts listed in the formal proposal.",
  ],
];

function render(canonical) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  };
  const cards = questions.map(([name, text]) => `<article class="question"><h2>${name}</h2><p>${text}</p></article>`).join("\n        ");
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <title>China Private Travel Questions | Bluehour China</title>
  <meta name="description" content="Clear answers about China private routes, RMB starting prices, payment, cancellation, visas, language, hotels, transport, safety and response times.">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" type="image/svg+xml" href="/assets/ruoqing-avatar.svg">
  <script type="application/ld+json">${JSON.stringify(faqSchema)}</script>
  <link rel="stylesheet" href="/assets/deep-journey.css">
  <link rel="stylesheet" href="/assets/heading-polish.css?v=20260711-rhythm9">
  <style>
    .questions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:1px;border:1px solid var(--line);background:var(--line)}
    .question{min-height:240px;padding:clamp(24px,4vw,42px);background:rgba(255,250,241,.72)}
    .question h2{max-width:18ch;margin:0;font-size:clamp(24px,3vw,38px);line-height:1.12}
    .question p{max-width:66ch;margin:16px 0 0;color:var(--muted);font-size:16px;line-height:1.72}
    @media(max-width:720px){.questions{grid-template-columns:1fr}.question{min-height:0}.question h2{font-size:28px}}
  </style>
</head>
<body style="--hero-image:url('/assets/china-depth-hero.png');--cta-image:url('/assets/wechat-reference-20260709/wechat-yunnan-dali-lakeside-table-08.jpg')">
  <nav class="nav" aria-label="Primary navigation"><a class="brand" href="/"><img src="/assets/ruoqing-avatar.svg" alt="" aria-hidden="true"><span><strong>Bluehour China</strong><span>若青中國旅策</span></span></a><div class="nav-links"><a href="/#places">Destinations</a><a href="/stories.html">Stories</a><a href="/before-china/">Before China</a><a class="nav-cta" href="/#plan-trip">Plan a private journey</a></div></nav>
  <main>
    <section class="hero"><div class="wrap hero-inner"><p class="eyebrow">Private travel questions</p><h1>What you need to know before planning</h1><p class="lead">Straight answers about price, payment, documents, comfort and what happens after you enquire.</p></div></section>
    <section class="section"><div class="wrap questions">${cards}</div></section>
    <section class="next"><div class="wrap"><p class="eyebrow">Your next step</p><h2>Start with dates, travellers and the landscape you want</h2><p>It takes about two minutes. No payment is required, and a travel planner replies within one business day.</p><div class="hero-actions"><a class="btn primary" href="/#plan-trip">Plan a private journey</a><a class="btn" href="/#places">View sample routes</a></div></div></section>
  </main>
  <footer class="footer"><div class="wrap"><span>Bluehour China Journeys | 若青中國旅策</span><span><a href="/privacy.html">Privacy</a> · <a href="/llms.txt">AI-readable summary</a></span></div></footer>
</body>
</html>`;
}

await fs.writeFile(path.join(root, "faq.html"), render("https://bluehourchina.com/faq.html"));
await fs.mkdir(path.join(root, "faq"), { recursive: true });
await fs.writeFile(path.join(root, "faq/index.html"), render("https://bluehourchina.com/faq/"));
console.log("Global traveller FAQ rewritten.");
