# First Customer Lead Inbox Rules

Purpose: decide quickly whether a social reply is only interest or a real first-customer opportunity.

## Lead Stages

- `new_interest`: liked, commented or replied, but has not answered route details.
- `warm_reply`: answered at least 3 qualification fields.
- `form_submitted`: submitted `/quick/` or another lead form.
- `qualified`: has contact method plus at least 4 qualification fields.
- `quoted`: received a first route note and starting quote.
- `won`: paid deposit or confirmed paid route-consultation/service path.
- `lost`: not a fit, no budget, no reply after follow-up, or trip cancelled.

## Qualification Score

Score 1 point for each confirmed item:

- Travel month or rough season
- Group size
- Route days
- Budget range or comfort priority
- Reachable contact method

Use this rule:

- `0-2`: do not quote yet. Ask missing fields.
- `3`: warm lead. Ask for contact method and one missing field.
- `4-5`: qualified lead. Send route note and starting quote within 12 hours.

## What Counts As A Real Lead

Count as a real lead only if one of these is true:

- They submitted a website form.
- They gave email, WhatsApp, LINE or WeChat and at least 3 route details.
- They asked for a quote and answered month, group size and comfort/budget.

Do not count generic likes, saves, "nice", "interested" or "how much" as a lead until they answer the missing fields.

## First Reply: Missing Fields

```text
可以，我先不直接報固定套裝，因為雲南價格和舒適度會被季節、人數、住宿和車程影響。

我先確認 5 件事：
1. 大概哪個月份出發？
2. 幾位同行？有長輩或小孩嗎？
3. 想走一週，還是一週多一點？
4. 預算接近 RMB 8,800/人起，還是更重視住宿舒適？
5. Email / WhatsApp / LINE / 微信 哪個方便？

有這些資訊後，我們可以先回一份初步路線方向與起價判斷。
```

## First Reply: Qualified Yunnan Lead

```text
您好，謝謝你留下資訊。我先用目前條件判斷：如果是雲南一週左右，路線不要每天換城市會更舒服。大理留湖邊和早晨，沙溪留一晚，麗江或白沙留雪山遠景。

初步價格可以先抓 RMB 8,800/人起，國際機票另計。正式價格會依季節、住宿等級、房型、人數、車輛、語言支援與當地接待資源再確認。

我接下來需要再確認：
1. 你們比較重視住宿舒適、拍照風景，還是少走路少折騰？
2. 是否需要英文、日文或其他語言支援？
3. 可接受每天車程大約多久？

如果方向接近，我們再整理一份更完整的路線筆記與正式報價。
```

## English First Reply: Qualified Yunnan Lead

```text
Thank you for the details. For a first Yunnan route, I would keep the week slower instead of changing cities every day: Dali for lake and morning pace, Shaxi for one quiet night, then Lijiang or Baisha for the snow-mountain side.

The public starting point is RMB 8,800 per traveller for land arrangements, excluding international flights. Final pricing depends on season, hotel level, room setup, group size, vehicle needs, language support and local-provider availability.

To refine this properly, I would confirm three points:
1. Do you care more about hotel comfort, scenery/photo moments, or less walking and less friction?
2. What language support would you prefer?
3. How much driving time per day feels comfortable for your group?

If this direction feels close, we can prepare a more complete route note and formal quote.
```

## 12-Hour Follow-Up If They Do Not Reply

```text
我先幫你留著這個方向。雲南一週慢路線最重要的是不要排太滿，否則大理、沙溪、麗江會都變成路過。

你方便時只要回月份、人數和預算感，我們就能先判斷是否適合，再回初步路線方向。
```

## Daily Operating Rule

Every night, update these three files:

- `ops/first-customer-lead-inbox.csv`: every meaningful person or thread.
- `ops/first-customer-week-tracker.csv`: channel-level numbers.
- `ops/first-customer-week.md`: if the next day's action changes.
