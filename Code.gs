var token = "<bot token>";
var teleUrl = "https://api.telegram.org/bot" + token;
var webApp = "<web app url>"

function setWebhook() {
  var webHookUrl = teleUrl + "/setWebhook?url=" + webApp;
  var response = UrlFetchApp.fetch(webHookUrl);
}
function sendMessage(userId, message,keyBoard) {
  var data = {
    method: 'post',
    payload: {
      method: 'sendMessage',
      chat_id: String(userId),
      text: message,
      parse_mode: 'HTML',
      reply_markup: JSON.stringify(keyBoard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}

function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  var ssId = "<sheet ID>";
  var sheet = SpreadsheetApp.openById(ssId).getSheetByName("Transactions");

  if (contents.callback_query) {
    var userId = contents.callback_query.from.id;
    var data = contents.callback_query.data;
    var month = Utilities.formatDate(new Date(), "GMT+8", "MM");

    if (data == 'expenses') {
      sheet.getDataRange().getCell(3,10).setValue(month);
      var totalExpenses = sheet.getDataRange().getCell(3,12).getValue();
      return sendMessage(userId, 'Your expenses for this month: RM' + totalExpenses);
    } else if (data == 'balance') {
      sheet.getDataRange().getCell(4,10).setValue(month);
      var totalExpenses = sheet.getDataRange().getCell(4,12).getValue();
      return sendMessage(userId, 'Your remaining balance for this month: RM' + totalExpenses);
    }
  } else if (contents.message) {
    var fname = contents.message.from.first_name
    var userId = contents.message.from.id;
    var text = contents.message.text;
    
    if (text.includes('-')) {
      var dateNow = Utilities.formatDate(new Date(), "GMT+8", "MM-dd-yyyy");
      var timeNow = Utilities.formatDate(new Date(), "GMT+8", "HH:mm");
      var monthNow = Utilities.formatDate(new Date(), "GMT+8", "MM");
      var tokens = text.split('-');
      var account = tokens[0];
      var items = tokens[1];
      var category = tokens[2];
      var price = tokens[3];

      sheet.appendRow([dateNow, monthNow, timeNow, account, category, items, price]);
      return sendMessage(userId, 'Transaction saved!');
    } else {
        var keyBoard = {
          "inline_keyboard": [
            [{"text": "Expenses", "callback_data": "expenses"}],
            [{"text": "Balance", "callback_data": "balance"}]
          ]
        };
        return sendMessage(userId, 'Hello, ' + fname + '! Use this format for new transactions:\n\n[account]-[item]-[category]-[price]\n\nOr select any options below:', keyBoard);
    }
  }
}
