var token = "<bot token>";
var teleUrl = "https://api.telegram.org/bot" + token;
var webApp = "<web app url>"

function setWebhook() {
  var webHookUrl = teleUrl + "/setWebhook?url=" + webApp;
  var response = UrlFetchApp.fetch(webHookUrl);
}

function sendMessage(userId, message) {
  var messageUrl = teleUrl + "/sendMessage?chat_id=" + userId + "&text=" + message;
  var response = UrlFetchApp.fetch(messageUrl);
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var userId = contents.message.from.id;
  var text = contents.message.text;

  sendMessage(userId, "dapat bos!");
  var sheetId = "<sheet ID>";
  var sheet = SpreadsheetApp.openById(sheetId).getSheetByName("Transactions");
  var dateNow = Utilities.formatDate(new Date(), "GMT+8", "dd-MM-yyyy");
  var timeNow = Utilities.formatDate(new Date(), "GMT+8", "HH:mm");

  sheet.appendRow([dateNow, timeNow,, text]);
}
