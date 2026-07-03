const SPREADSHEET_ID = "PASTE_BLUEHOUR_LEAD_CRM_SPREADSHEET_ID_HERE";
const SHEET_NAME = "Leads CRM";

function doPost(event) {
  const params = readPayload_(event);
  if (params["bot-field"]) {
    return json_({ ok: true, skipped: "bot-field" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) throw new Error("Missing sheet: " + SHEET_NAME);

    const receivedAt = params.submitted_at ? new Date(params.submitted_at) : new Date();
    const leadId = "BHC-" + Utilities.formatDate(receivedAt, "Asia/Taipei", "yyyyMMdd-HHmmss") + "-" + Utilities.getUuid().slice(0, 4).toUpperCase();
    const source = params.utm_source || "site";
    const medium = params.utm_medium || "website";

    const row = [
      leadId,
      receivedAt,
      params.status || "New",
      params.priority || "Medium",
      params.name || "",
      params.contact || "",
      params.email || "",
      params.messenger || "",
      params.country || "",
      params.language || params.language_needs || "",
      params.destination || "",
      params.travel_window || params.month || "",
      params.group_size || "",
      params.comfort_level || "",
      params.budget || "",
      params.visited_china_before || "",
      params.message || "",
      params.page_url || "",
      params.utm_campaign || "",
      params.owner || "Bluehour",
      "Source: " + source + " / " + medium,
      params.next_step || "",
      "",
      "",
      "",
      ""
    ];

    writeLeadRow_(sheet, row);
    return json_({ ok: true, leadId });
  } catch (error) {
    return json_({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function writeLeadRow_(sheet, row) {
  const firstDataRow = 2;
  const leadIds = sheet
    .getRange(firstDataRow, 1, Math.max(sheet.getMaxRows() - firstDataRow + 1, 1), 1)
    .getDisplayValues();
  let targetRow = firstDataRow;

  for (let index = leadIds.length - 1; index >= 0; index--) {
    if (String(leadIds[index][0] || "").trim()) {
      targetRow = firstDataRow + index + 1;
      break;
    }
  }

  if (targetRow > sheet.getMaxRows()) {
    sheet.insertRowsAfter(sheet.getMaxRows(), targetRow - sheet.getMaxRows());
  }

  sheet.getRange(targetRow, 1, 1, row.length).setValues([row]);
}

function doGet() {
  return json_({ ok: true, service: "Bluehour China Leads Webhook" });
}

function readPayload_(event) {
  const params = event && event.parameter ? Object.assign({}, event.parameter) : {};
  const contents = event && event.postData && event.postData.contents ? event.postData.contents : "";

  if (!contents) return params;

  if (contents.charAt(0) === "{") {
    try {
      return Object.assign(params, JSON.parse(contents));
    } catch (error) {
      params.payload_parse_error = String(error);
      return params;
    }
  }

  contents.split("&").forEach(function(pair) {
    if (!pair) return;
    const parts = pair.split("=");
    const key = decodeURIComponent((parts.shift() || "").replace(/\+/g, " "));
    const value = decodeURIComponent(parts.join("=").replace(/\+/g, " "));
    if (key && params[key] === undefined) params[key] = value;
  });

  return params;
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
