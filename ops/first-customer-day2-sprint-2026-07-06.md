# First Customer Day 2 Sprint — 2026-07-06

## Current State

- Lead rows: 0
- Qualified leads: 0
- Posted or sent proof rows: 0
- Public Tripadvisor replies awaiting explicit approval: 0
- Approved Tripadvisor replies requiring manual posting: 5
- Highest-leverage available action without public-posting approval: warm referrals and partner referrals.

## Day 2 Objective

Create at least one real qualified route inquiry by the end of the day.

A qualified inquiry requires:

- Contact method
- Travel month or rough season
- Group size
- Route days
- Budget or comfort priority
- Destination or route idea

## Today KPI

- 20 warm referral messages sent.
- 15 partner referral messages sent.
- 10 helpful public or community replies prepared or posted where account access and rules allow.
- 3 warm lead rows added to `ops/first-customer-lead-inbox.csv`.
- 1 qualified lead row added to `ops/first-customer-lead-inbox.csv`.
- Any serious reply triaged within 12 hours using `/ops/first-customer-lead-triage.html`.

## Execution Order

1. Open `/ops/first-customer-mobile-action.html`.
2. Send 20 warm referral messages to people who may know foreign travellers.
3. Generate and save the `manual_send_batch_20` execution row.
4. Open `/ops/first-customer-partner-outreach.html`.
5. Send 15 partner messages to travel, education, expat/business, hospitality and overseas-Chinese connectors.
6. Generate and save the `manual_partner_batch_15` execution row.
7. For every reply with travel intent, open `/ops/first-customer-lead-triage.html`.
8. Copy the generated lead inbox row into `ops/first-customer-lead-inbox.csv`.
9. If the lead is qualified, send the generated reply and prepare a route note within 12 hours.

## Who To Contact First

Prioritize people who can introduce multiple travellers:

1. Travel advisor or independent itinerary planner.
2. Chinese teacher, language school, study-abroad consultant or international student contact.
3. Expat, foreign-company, cross-border business or relocation contact.
4. Hotel, homestay, restaurant or local-service friend who meets foreign visitors.
5. Overseas Chinese friend with foreign friends, partner or colleagues.

## Message Rule

Do not ask for vague support. Ask the contact to identify one person:

> "Do you know anyone planning China beyond Beijing and Shanghai this year or next year?"

If they say yes, send the route-note link:

`https://bluehourchina.com/route-note/?utm_source=direct_reply&utm_medium=qualified_conversation&utm_campaign=first_customer_week&angle=route_note_24h`

## Triage Rule

Use `/ops/first-customer-lead-triage.html` for every meaningful reply.

- Score 0-2: ask missing fields.
- Score 3-4: warm lead; ask contact method or one missing route field.
- Score 5-6 plus contact method: qualified; send route note and starting quote direction within 12 hours.

## Manual Posting Rule

Public Tripadvisor replies have been approved, but Chrome automation was blocked by Tripadvisor. Use the manual posting page:

`https://bluehourchina.com/ops/first-customer-approved-public-replies-2026-07-06.html`

Open each original thread, paste the no-link reply manually, then log the live reply URL or screenshot. Until a posted URL exists, owned-network outreach and partner referrals remain the main executable path.
