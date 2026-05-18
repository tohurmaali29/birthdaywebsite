const SHEET_NAME = "Sheet1";

function doPost(e) {
  try {
    Logger.log("doPost called");
    Logger.log("Raw postData: %s", e && e.postData ? e.postData.contents : "NO_POST_DATA");

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      throw new Error("Sheet not found: " + SHEET_NAME);
    }

    const payload = JSON.parse(e.postData.contents || "{}");
    const wish = payload.wish || "";
    const submittedAt = payload.submittedAt || new Date().toISOString();

    Logger.log("Parsed payload submittedAt=%s wish=%s", submittedAt, wish);

    sheet.appendRow([submittedAt, wish]);
    Logger.log("Row appended successfully to %s", SHEET_NAME);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    Logger.log("doPost error: %s", error && error.stack ? error.stack : String(error));
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(error) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
