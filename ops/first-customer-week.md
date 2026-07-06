# First Customer Week

Internal operating sheet for getting the first qualified consultation from social traffic.

## Goal

- Window: 7 days after launch.
- Business goal: 1 qualified travel consultation.
- Funnel target: 300 social profile visits, 30 landing-page clicks, 3 form submissions, 1 qualified reply.
- Execution scripts: `ops/first-customer-social-scripts.md`
- Mobile launch board: `ops/first-customer-launch.html`
- Public reply queue: `ops/first-customer-public-reply-queue.md`
- Platform-ready posts: `ops/first-customer-platform-posts.md`
- Lead inbox: `ops/first-customer-lead-inbox.csv`
- Lead scoring and reply rules: `ops/first-customer-lead-inbox.md`
- Today launch pack: `ops/first-customer-today-launch-pack.md`
- Outreach board: `ops/first-customer-outreach-board.md`
- Outreach targets: `ops/first-customer-outreach-targets.csv`
- Today live targets: `ops/first-customer-live-targets-2026-07-05.md`
- Today reply log: `ops/first-customer-reply-log-2026-07-05.csv`
- Daily tracker import file: `ops/first-customer-week-tracker.csv`
- Funnel audit: `scripts/audit-first-customer-funnel.mjs`
- 24-hour first customer close board: `ops/first-customer-24h-close-board-2026-07-06.html`
- Real partner target CSV: `ops/first-customer-real-partner-targets-2026-07-06.csv`
- Real partner dispatch board: `ops/first-customer-partner-dispatch-2026-07-06.html`
- Partner entry check CSV: `ops/first-customer-partner-entry-check-2026-07-06.csv`
- Top 7 partner send packet: `ops/first-customer-partner-send-packet-2026-07-06.html`
- Zero-link first-touch board: `ops/first-customer-zero-link-sprint-2026-07-06.html`
- Payment/App first-touch sprint: `ops/first-customer-payment-sprint-2026-07-06.html`
- Next-action generator: `scripts/next-first-customer-actions.mjs`
- Current next actions: `ops/first-customer-next-actions-2026-07-06.md`
- Current next actions 2026-07-07: `ops/first-customer-next-actions-2026-07-07.md`
- Day 2 sprint: `ops/first-customer-day2-sprint-2026-07-06.md`
- Before-China launch pack: `ops/first-customer-before-china-launch-pack-2026-07-06.md`
- Before-China launch pack 2026-07-07: `ops/first-customer-before-china-launch-pack-2026-07-07.md`
- Execution log 2026-07-07: `ops/first-customer-execution-log-2026-07-07.csv`
- Zero-link sprint 2026-07-07: `ops/first-customer-zero-link-sprint-2026-07-07.md`
- Verified reply 2026-07-07: `ops/first-customer-verified-reply-2026-07-07.md`
- Approved public replies manual page: `ops/first-customer-approved-public-replies-2026-07-06.html`
- Search insight angles: `ops/first-customer-search-insights-2026-07-05.md`
- Content funnel decision: `ops/first-customer-content-funnel-decision-2026-07-05.md`
- Mobile action board: `ops/first-customer-mobile-action.html`
- 2026-07-07 15-minute send-now console: `ops/first-customer-2026-07-07-15min-send-now.html`
- 2026-07-07 high-intent reply board: `ops/first-customer-2026-07-07-high-intent-reply-board.html`
- 2026-07-07 30-minute live room: `ops/first-customer-2026-07-07-30min-live-room.html`
- 2026-07-07 target desk: `ops/first-customer-2026-07-07-target-desk.html`
- 2026-07-07 live send console: `ops/first-customer-2026-07-07-live-send-console.html`
- 2026-07-07 social close sprint: `ops/first-customer-2026-07-07-social-close-sprint.html`
- Partner outreach board: `ops/first-customer-partner-outreach.html`
- Partner target CSV: `ops/first-customer-partner-targets-2026-07-06.csv`
- Lead triage board: `ops/first-customer-lead-triage.html`

## Current Gate

Updated 2026-07-07:

- Lead inbox is still empty; the first-customer goal is not complete.
- The site now has high-intent decision pages for natural China routes, Zhangjiajie senior pacing and Guangzhou luxury family hotels.
- English homepage, `/en/` and `/china-travel/` now route high-intent traffic to `/route-note/` first.
- Cold social and warm-referral traffic should use `/quick/china/` first. It is the lowest-friction 60-second route check.
- If the user has 15 minutes, open `ops/first-customer-2026-07-07-15min-send-now.html` first: publish one payment-comfort social post, send five partner follow-ups, send eight warm referral DMs, then log proof.
- If the user can do public replies today, open `ops/first-customer-2026-07-07-high-intent-reply-board.html` first: complete 4 known high-intent forum replies, 4 social search replies and 4 warm referral messages, then log proof.
- If the user has 30 minutes, open `ops/first-customer-2026-07-07-30min-live-room.html` next: post five approved Tripadvisor replies, publish the PayPal / WeChat social post, send 12 warm referral DMs, then log proof.
- Today execution starts from `ops/first-customer-2026-07-07-target-desk.html`: 20 targets, exact copy, quick-form links and execution-row generator.
- Before China practical content is used as a conversion bridge, not as a standalone travel-tips library.
- Five Tripadvisor replies are approved for public posting, but not yet posted.
- User approved public posting on 2026-07-06, but Chrome automation hit Tripadvisor temporary access restriction. Use `ops/first-customer-approved-public-replies-2026-07-06.html` to post the no-link replies manually.
- 2026-07-07 execution log has 0 posted URLs and 0 lead rows. The first-customer goal is still not complete.
- Gmail SMTP is blocked with a 535 BadCredentials response. Do not retry SMTP; use Gmail web, mailto, or manual sending for partner follow-ups.
- Hutong / That's Mandarin web form automation is blocked by a country-field validation. Do not count it as sent; use the one-tap partner follow-up page or manual Gmail web send.
- Priority is public distribution and reply logging, not more page production.
- If links look risky on any platform, use zero-link first-touch replies first and move only warm replies to tracked forms.
- If a traveller is asking about payment, WeChat Pay, Alipay, eSIM, SMS, maps, translation apps or hotel addresses, use the Payment/App sprint board before route selling. These questions usually mean the trip is real enough to qualify.
- Today social angle should lead with PayPal / WeChat Pay 2026 payment news when posting to Threads, Instagram or Facebook, then convert the anxiety into a 60-second route check for regional China.
- 2026-07-07 live search check: Reddit JSON/search endpoints can be blocked by network security, but Google search can still surface recent r/travelchina payment questions. Prioritize Google searches for `WeChat Pay Visa Alipay China travel` in the past week before generic Yunnan itinerary searches.
- Payment-problem replies should now route warm users to `/payment-rescue/?utm_source=direct_reply&utm_medium=qualified_conversation&utm_campaign=first_customer_week&angle=payment_rescue`, then ask for city, next destination and contact method before quoting.

Next required action:

- If working from a phone, open `/ops/first-customer-mobile-action.html`, then open the 15-minute send-now console from the first button.
- If working from a phone and public posting is possible, open `/ops/first-customer-2026-07-07-high-intent-reply-board.html` before making more website edits.
- If the user has one focused block today, start at `/ops/first-customer-2026-07-07-15min-send-now.html` and finish its four steps before making more content.
- If working from desktop, start with `/ops/first-customer-2026-07-07-target-desk.html` and execute the 20 targets in priority order.
- If the user has only one execution window today, open `/ops/first-customer-24h-close-board-2026-07-06.html` first and finish the 35 direct sends before redesigning anything.
- If owned-network contacts are limited, open `/ops/first-customer-partner-dispatch-2026-07-06.html` and send the top 7 named partner connector messages before posting more generic content.
- Before sending the top 7 partner messages, check `ops/first-customer-partner-entry-check-2026-07-06.csv`, then use `ops/first-customer-partner-send-packet-2026-07-06.html` for exact subject and message. Do not post GoKunming forum/classified promotion; use its contact/advertiser route. Use directory/listing language for SmartShanghai and That's Mags.
- If direct traveller contacts are limited, open `/ops/first-customer-partner-outreach.html` and send 15 partner referral messages to people who can introduce travellers.
- Manually post the five approved no-link Tripadvisor replies using `ops/first-customer-approved-public-replies-2026-07-06.html`.
- After posting or sending, log live URLs or manual send batches in `ops/first-customer-execution-log-2026-07-07.csv`.
- Run the zero-link sprint board across Reddit, Facebook, Instagram/Threads comments, warm DMs or forums where links look promotional.
- Use the practical setup angle only when it answers the question directly: payment, WeChat Pay, Alipay, eSIM, SMS, apps, hotel addresses or route friction.
- Use the Payment/App sprint board to turn practical setup questions into route-note conversations only after the traveller shares month, group size, days, destination or comfort needs.
- For cold social posts, use the PayPal / WeChat Pay 2026 copy in `/ops/first-customer-2026-07-07-social-close-sprint.html`, because it is timely and less sales-like than a generic route-planning post.
- Run `node scripts/audit-first-customer-funnel.mjs` every day until the first qualified lead appears.
- Run `node scripts/next-first-customer-actions.mjs` before each execution block; if posted URLs are still 0, distribution actions outrank website redesign.
- Any serious reply should be pasted into `/ops/first-customer-lead-triage.html` before quoting. The board generates the next reply and the lead inbox CSV row.

## Tracking Links

- Instagram pain-point reel: `https://bluehourchina.com/route-note/?utm_source=instagram&utm_medium=pinned_comment&utm_campaign=first_customer_week&angle=yunnan_slow_route`
- YouTube Shorts route note: `https://bluehourchina.com/route-note/?utm_source=youtube&utm_medium=shorts&utm_campaign=first_customer_week&angle=route_note_24h`
- TikTok private-route value: `https://bluehourchina.com/route-note/?utm_source=tiktok&utm_medium=short_video&utm_campaign=first_customer_week&angle=private_route_value`
- LINE / direct share: `https://bluehourchina.com/refer/?utm_source=line&utm_medium=chat&utm_campaign=first_customer_week&angle=warm_referral`

## Daily Actions

Day 1-2:
Publish the pain-point angle. The opening should be direct: "第一次去雲南，不要把一週排成每天換城市." Reply to comments with the route link, not a hard sell.

For Day 1, use `ops/first-customer-today-launch-pack.md` directly. It contains the caption, pinned comment, story copy, DM copy and the six-hour follow-up sequence.

Day 3-4:
Publish the route-shape angle. Explain why Dali, Shaxi and Lijiang each need a different pace. CTA: "有月份、人數與預算感，就先留下條件."

Day 5:
Publish the private-route value angle. Explain that private planning reduces mistakes in vehicle time, lodging location, language and the pace of older travellers or families.

Final two days:
Publish the partner-share angle. Ask viewers to send the reel to the person they may travel with. CTA: "先一起確認想要的風景和預算感."

If there are already comments, likes or profile visits by then, do not only publish new content. Reply to every relevant comment and send a soft DM to warm users who asked about route, price, days or travel style.

Do not rely only on algorithmic reach. Every day, use the outreach board to find current itinerary questions on Reddit, Facebook groups, Threads/Instagram search, 背包客棧, Dcard or LINE warm network. A useful reply to an active question is higher intent than a cold brand post.

## Daily Scoreboard

Track these numbers every night:

- Views by platform
- Profile visits
- Website clicks
- Form submissions
- Qualified leads
- Replies sent within 12 hours
- Public helpful replies posted
- Warm DMs / LINE shares sent
- New rows added to `ops/first-customer-lead-inbox.csv`
- Leads with score 4-5 that need a quote within 12 hours

If website clicks are low, improve the video opening and pinned comment. If clicks are high but forms are low, use the direct `/route-note/` link and mention that the form is only for a first route note and quote direction, not immediate payment.

If there are no clicks after the first 24 hours, increase active outreach before producing more content: 10 public replies, 20 warm DMs and 3 direct route conversations.

Hard gate:

- If posted URLs are still 0, distribution is the bottleneck.
- If warm referral sends are still 0, owned-network execution is the bottleneck.
- If there are clicks but no form submissions, use `/route-note/` instead of a general consultation page and make the CTA lower-pressure: "receive a route note and starting quote direction."

Mobile execution rule:

- Send the warm referral message to 20 people who may know foreign travellers.
- Send the partner referral message to 15 people who may know travellers through work, school, hospitality or expat networks.
- When finished, use `/ops/first-customer-mobile-action.html` to generate the `manual_send_batch_20` execution row.
- When partner messages are finished, use `/ops/first-customer-partner-outreach.html` to generate the `manual_partner_batch_15` execution row.
- Any reply with a month, group size, travel days, destination, budget/comfort need or contact method must be copied into `ops/first-customer-lead-inbox.csv`.
- Use `/ops/first-customer-lead-triage.html` to classify replies as `needs_qualification`, `warm` or `qualified`.

## Lead Qualification

A qualified inquiry has at least:

- Travel month or rough season
- Group size
- Route days
- Budget range or comfort priority
- A reachable contact method

If these are missing, first reply should ask for the missing fields before quoting.

## First Reply SLA

Reply within 12 hours. The first reply should include:

- A short route note
- Starting price range
- One reason the route fits
- One risk or pacing concern
- Three next questions
