import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const routes = [
  ["Yunnan Soft Landing", "8 days / 7 nights", "Kunming · Dali · Lijiang", "5,680", "/yunnan.html"],
  ["Xinjiang Ili Route", "9 days / 8 nights", "Urumqi · Kuitun · Sayram Lake · Yining · Tekes · Nalati", "14,800", "/xinjiang.html"],
  ["Qinghai-Gansu Grand Loop", "9 days / 8 nights", "Xining · Qinghai Lake · Chaka · Dachaidan · Dunhuang · Jiayuguan · Zhangye", "5,980", "/dunhuang.html"],
  ["Inner Mongolia Grassland and Desert", "6 days / 5 nights", "Hohhot · Huitengxile · Kubuqi · Ordos", "9,500", "/inner-mongolia.html"],
  ["Hainan East Coast and Sanya", "7 days / 6 nights", "Haikou · Qionghai · Wanning · Lingshui · Sanya", "14,200", "/sanya.html"],
  ["Northeast Winter Rail", "7 days / 6 nights", "Harbin · Yabuli · Snow Town · Harbin", "16,700", "/northeast.html"],
  ["Xi'an Ancient Capital", "5 days / 4 nights", "Xi'an old city · Lintong · Xi'an", "6,800", "/xian.html"],
  ["Tibet Lhasa to Shigatse", "8 days / 7 nights", "Lhasa · Yamdrok Lake · Gyantse · Shigatse · Lhasa", "18,800", "/tibet.html"],
  ["Zhangjiajie and Western Hunan", "6 days / 5 nights", "Zhangjiajie · Wulingyuan · Tianmen Mountain · Furong Town · Fenghuang", "7,980", "/zhangjiajie.html"],
];

const routeLines = routes.map(([name, duration, route, price, url]) => `- ${name}: ${duration}; ${route}; from RMB ${price} per traveller based on 6 travellers; ${url}`).join("\n");

const concise = `# Bluehour China Journeys / 若青中國旅策

Bluehour China Journeys plans private trips beyond Beijing and Shanghai for international travellers who want China's landscapes and regional culture without a rushed group-tour pace.

## Public Route Facts
${routeLines}

- Private journeys can start from 2 travellers. Public starting prices use the 6-traveller basis shown on each route page; prices for other group sizes are provided after enquiry.
- Prices are land-arrangement references in RMB and exclude international flights.
- The formal proposal lists accommodation, transport, pickup, reservations, language support and anything not included.

## How Enquiry Works
- The main form is available on the homepage: https://bluehourchina.com/#plan-trip
- It takes about 2 minutes and requires no payment.
- A travel planner replies within 1 business day with a route direction, starting estimate and next step.
- Enquiry details are used only to answer the travel request. Privacy: https://bluehourchina.com/privacy.html
- Bluehour China confirms the route and travel brief before departure. Actual reception is provided by local service teams, with included services and key contacts listed in the formal proposal.

## Languages
English, Traditional Chinese, Japanese, Korean, Thai and Russian.

## Practical China Guides
- Before China: https://bluehourchina.com/before-china/
- WeChat Pay with Visa or Mastercard: https://bluehourchina.com/before-china/wechat-pay-visa-mastercard/
- China travel apps: https://bluehourchina.com/before-china/china-travel-apps-before-trip/
- First day after arrival: https://bluehourchina.com/before-china/china-first-day-arrival-checklist/

## Content Accuracy
- Destination pages publish route length, daily plan, starting price, group basis, photography and enquiry link.
- Journey stories are editorial route journals or clearly labelled scenario stories. They are not presented as verified customer reviews.
- Current visa, entry, payment and Tibet-document requirements must be checked for the traveller's passport and departure date.
`;

const full = `${concise}
## Who The Journeys Suit

Couples, families and close friends who have already visited major Chinese cities and want a second or deeper trip. The route design gives priority to realistic driving time, good room locations, consecutive-night stays, language needs and recovery time.

## Destination Character

- Yunnan: a softer first step into deeper China, with Kunming, Dali, Bai culture, Lijiang villages and snow-mountain scenery.
- Xinjiang: alpine lakes, grasslands, bazaars and long roads that need careful pacing.
- Qinghai and Gansu: Silk Road history, highland lakes, desert light, Mogao Caves, Jiayuguan and Zhangye in one continuous loop.
- Inner Mongolia: Hohhot context, grassland lodging, Kubuqi Desert and Ordos.
- Hainan: Haikou and east-coast towns before a comfortable Sanya finish.
- Northeast: Harbin, winter rail movement, forest or snow stays and warm-room recovery.
- Xi'an: city walls, the Terracotta Army, museums, pagodas and local food over five unhurried days.
- Tibet: a slower first 48 hours in Lhasa before Yamdrok Lake, Gyantse and Shigatse; current entry documents are confirmed before travel.
- Zhangjiajie: three nights beside Wulingyuan before Tianmen Mountain, Furong Town and the riverside old city of Fenghuang.

## Price And Booking Clarity

The public starting price is not a final verbal quote. The formal proposal confirms travel dates, room category, vehicle, pickup, guiding, important tickets, language support, payment schedule, cancellation terms and excluded items. No payment is taken on the enquiry form.

## Traveller Questions

- Fixed tour or private route: the published route is a clear starting plan and can be adjusted around dates, group size and comfort.
- Language: key moments such as pickup, hotel check-in, drivers, tickets and food needs are prepared in advance; included language support is stated in the proposal.
- Hotels and transport: choices begin with location, room comfort and daily driving time.
- Visa and documents: travellers remain responsible for passport, visa and entry eligibility; Tibet requires additional current documents through an eligible local team.
- Safety and altitude: routes include driving and rest buffers; high-altitude medical advice, medication and insurance should be confirmed with qualified professionals.
- Reply time: within 1 business day after a complete enquiry.

## Canonical Pages

- Homepage: https://bluehourchina.com/
- Traditional Chinese: https://bluehourchina.com/zh.html
- Japanese: https://bluehourchina.com/ja.html
- Korean: https://bluehourchina.com/ko.html
- Thai: https://bluehourchina.com/th.html
- Russian: https://bluehourchina.com/ru.html
- Traveller FAQ: https://bluehourchina.com/faq.html
- About and service boundary: https://bluehourchina.com/about.html
- AI-readable reference: https://bluehourchina.com/ai/
- Sitemap: https://bluehourchina.com/sitemap.xml

Updated: 2026-07-12
`;

await fs.writeFile(path.join(root, "llms.txt"), concise);
await fs.writeFile(path.join(root, "llms-full.txt"), full);
console.log("Customer-facing LLM summaries rewritten.");
