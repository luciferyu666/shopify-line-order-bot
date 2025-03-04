const lineService = require("../services/lineService");
const orderController = require("./orderController");
const responseFormatter = require("../utils/responseFormatter");
const logger = require("../utils/logger");

/**
 * 處理 LINE Webhook 事件
 */
exports.handleWebhookEvent = async (req, res) => {
  try {
    const events = req.body.events; // 取得 LINE 傳送的事件陣列
    if (!events || events.length === 0) {
      return res.status(200).send("No events received.");
    }

    // 逐一處理每個事件
    for (let event of events) {
      if (event.type === "message" && event.message.type === "text") {
        await handleTextMessage(event);
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    logger.error("LINE Webhook 處理失敗", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * 處理使用者傳送的文字訊息
 */
const handleTextMessage = async (event) => {
  const userMessage = event.message.text.trim();
  const replyToken = event.replyToken;
  const userId = event.source.userId;

  logger.info(`收到 LINE 訊息: ${userMessage} (來自: ${userId})`);

  // 驗證輸入是否為 Email 或手機號碼
  const isEmail = validateEmail(userMessage);
  const isPhone = validatePhone(userMessage);

  if (!isEmail && !isPhone) {
    return await lineService.replyMessage(
      replyToken,
      "請輸入有效的 Email 或手機號碼來查詢訂單。"
    );
  }

  // 查詢 Shopify 訂單
  try {
    const orderData = await orderController.getOrder(userMessage);

    if (!orderData) {
      return await lineService.replyMessage(
        replyToken,
        "查無相關訂單，請確認輸入的 Email 或手機號碼是否正確。"
      );
    }

    // 格式化訂單資訊
    const formattedMessage = responseFormatter.formatOrderResponse(orderData);
    await lineService.replyMessage(replyToken, formattedMessage);
  } catch (error) {
    logger.error("查詢訂單發生錯誤", error);
    await lineService.replyMessage(replyToken, "系統錯誤，請稍後再試。");
  }
};

/**
 * 驗證 Email 格式
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 驗證手機號碼格式（支援台灣手機號碼）
 */
const validatePhone = (phone) => {
  const phoneRegex = /^09\d{8}$/; // 台灣手機號碼格式
  return phoneRegex.test(phone);
};
