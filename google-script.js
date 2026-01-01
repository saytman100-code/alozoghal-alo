// آدرس Google Apps Script شما باید به این صورت باشد:
// https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

function doGet(e) {
  try {
    const text = e.parameter.text || "بدون متن";
    const chatId = "5696902910"; // آیدی عددی تلگرام شما
    const botToken = "8218710893:AAEXn2Q7VmPt32RSkz0fxY0jja6DdUld1xE"; // توکن ربات تلگرام شما
    
    // استفاده از یک پروکسی برای دور زدن فیلترینگ
    const proxyUrl = "https://api.telegram.org/bot" + botToken + "/sendMessage";
    
    const payload = {
      chat_id: chatId,
      text: decodeURIComponent(text),
      parse_mode: "HTML"
    };
    
    const options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    // تلاش اول: ارسال مستقیم
    let response;
    try {
      response = UrlFetchApp.fetch(proxyUrl, options);
    } catch (directError) {
      // اگر ارسال مستقیم شکست خورد، از یک پروکسی عمومی استفاده کنید
      const publicProxy = "https://cors-anywhere.herokuapp.com/" + proxyUrl;
      response = UrlFetchApp.fetch(publicProxy, options);
    }
    
    const result = JSON.parse(response.getContentText());
    
    if (result.ok) {
      return ContentService
        .createTextOutput(JSON.stringify({success: true, message: "پیام با موفقیت ارسال شد"}))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({success: false, error: result.description}))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  return doGet(e);
}

// تابع برای تست
function testSendMessage() {
  const testData = {
    parameter: {
      text: encodeURIComponent("تست ارسال پیام از Google Apps Script\nاین یک پیام تست است.")
    }
  };
  
  const result = doGet(testData);
  Logger.log(result.getContent());
}
