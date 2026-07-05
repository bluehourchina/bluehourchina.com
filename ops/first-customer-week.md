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

## Current Gate

Updated 2026-07-05:

- Lead inbox is still empty; the first-customer goal is not complete.
- The site now has high-intent decision pages for natural China routes, Zhangjiajie senior pacing and Guangzhou luxury family hotels.
- Four Tripadvisor replies are prepared but still awaiting explicit user approval before public posting.
- Priority is public distribution and reply logging, not more page production.

Next required action:

- Get approval to post the first four no-link public replies.
- After posting, log live URLs in `ops/first-customer-execution-log-2026-07-05.csv`.
- Run `node scripts/audit-first-customer-funnel.mjs` every day until the first qualified lead appears.

## Tracking Links

- Instagram pain-point reel: `https://bluehourchina.com/g/mistake/?utm_source=instagram&utm_medium=reel&utm_campaign=first_customer_week&video=mistake`
- YouTube Shorts route note: `https://bluehourchina.com/g/route/?utm_source=youtube&utm_medium=shorts&utm_campaign=first_customer_week&video=route`
- TikTok private-route value: `https://bluehourchina.com/g/private/?utm_source=tiktok&utm_medium=short_video&utm_campaign=first_customer_week&video=private`
- LINE / direct share: `https://bluehourchina.com/g/partner/?utm_source=line&utm_medium=chat&utm_campaign=first_customer_week&video=partner`

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

If website clicks are low, improve the video opening and pinned comment. If clicks are high but forms are low, use the direct `/quick/` link and mention that the form is only for an initial route direction, not immediate payment.

If there are no clicks after the first 24 hours, increase active outreach before producing more content: 10 public replies, 20 warm DMs and 3 direct route conversations.

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
