# First Customer Content Funnel Decision — 2026-07-05

## Decision

Use practical "Before China" content as the main search and social entry, but do not build a general travel guide site.

The first-customer path should be:

1. Traveller searches or sees a practical problem: WeChat Pay, Alipay, Visa/Mastercard, data, SMS, apps, visa-free entry, hotel address, train or transfer friction.
2. The content answers the immediate problem calmly and conservatively.
3. The page reframes the problem: if the trip goes beyond Beijing and Shanghai, these are route-quality issues, not isolated tips.
4. The call to action is the 24-hour route note form.
5. The thank-you page asks for fixed dates, flights, hotels, mobility needs or language needs when the trip is close.

## Why This Is More Likely To Bring The First Customer

Scenery content creates desire, but it is broad and slow. Payment, data, apps and route-friction questions appear when someone is already preparing or close to booking. That intent is stronger.

The right customer is not only asking "where is beautiful in China?" They are asking:

- Can I pay when I get there?
- Will my phone and apps work?
- Is this route realistic outside Beijing and Shanghai?
- How do I avoid exhausting my parents, partner or family?
- Which local parts need support?

Those questions can become a paid route-planning conversation.

## Content Rules

- Answer the practical question first. Do not sound like an ad in the first paragraph.
- Do not promise to operate payment accounts, guarantee app approval or guarantee entry rules.
- Always connect practical prep to route quality: distance, comfort, language, timing and local-provider matching.
- Every article should have one clear route-note CTA.
- Every social reply should ask for one qualifying detail before sending a link when possible.

## Priority Content Cluster

1. Payment setup: WeChat Pay, Alipay, Visa/Mastercard, PayPal-related China payment updates, backup cash.
2. Phone readiness: data, SMS verification, translation, maps, hotel addresses in Chinese.
3. Regional route friction: Yunnan, Zhangjiajie, Dunhuang, Xinjiang, Northeast winter, Sanya.
4. Comfort filters: family, senior travellers, boutique hotels, private transfers, language support.

## Conversion Offer

The core offer is not "free tips." It is:

Send your month, group size, days outside Beijing/Shanghai, comfort level and destination. We reply with a 24-hour route note: destination fit, pacing risk, starting quote direction and the next questions before a formal proposal.

## 2026-07-05 Site Alignment

- English homepage primary CTAs now point to `/route-note/`.
- `/en/` mirror CTAs now point to `/route-note/`.
- `/china-travel/` now positions the first step as a route note rather than a sales consultation.
- `/china-travel/` now links practical setup topics directly to the focused Before China pages:
  - `/before-china/china-payment-checklist/`
  - `/before-china/wechat-pay-visa-mastercard/`
  - `/before-china/china-travel-apps-before-trip/`
- `llms.txt` and `llms-full.txt` now tell AI systems that the preferred first-customer path is the 24-hour route note.

## 2026-07-07 Search-Intent Upgrade

- `/before-china/` now contains a visible search-question map for the exact problems travellers search before China:
  - WeChat Pay with Visa or Mastercard
  - payment methods and backup layers
  - apps, eSIM, SMS, maps and hotel addresses
  - card, Alipay or WeChat Pay failure after arrival
  - route realism beyond Beijing and Shanghai
- `/before-china/` now exposes the same map as structured `ItemList` data so search engines and AI answer systems can understand which page answers which question.
- `/before-china/wechat-pay-visa-mastercard/` now includes `HowTo` structured data for the cautious WeChat Pay preparation sequence.
- `llms.txt`, `llms-full.txt` and `sitemap.xml` were updated so AI search and crawlers see the new query-routing logic.
- QA result: JSON-LD parsing passed, static lead-form completeness passed for the main route forms, and the full mobile/desktop layout audit checked 67 pages with 0 issues. The first-customer funnel still has 0 real lead rows; this is a distribution problem, not a website-form problem.

## Distribution Rule For This Week

Do not publish general "China travel tips" without a route-note bridge. Every public reply, warm DM or short post should end in one of three ways:

1. Ask one qualifying detail: month, group size, days, destination or comfort level.
2. Send the focused article only when it directly answers the question.
3. Move qualified travellers to `/route-note/` once they show real travel intent.

## First Customer KPI

A real first-customer lead must include:

- A usable contact method
- Travel month or approximate timing
- Group size
- Destination or route idea
- Comfort, budget, family, mobility or language context

Until those details exist, the goal is not complete.
