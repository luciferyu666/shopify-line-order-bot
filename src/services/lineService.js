const axios = require("axios");
const config = require("../config/lineConfig");
const logger = require("../utils/logger");

const LINE_API_URL = "https://api.line.me/v2/bot/message/reply";
const LINE_PUSH_URL = "https://api.line.me/v2/bot/message/push";
const HEADERS = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${config.LINE_ACCESS_TOKEN}`,
};

/**
 * 透過 replyToken 回應使用者訊息
 * @param {string} replyToken - 來自 LINE Webhook 的回應 Token
 * @param {string|Object} message - 訊息內容，可為文字或 Flex Message
 */
exports.replyMessage = async (replyToken, message) => {
  try {
    const body = {
      replyToken: replyToken,
      messages: Array.isArray(message)
        ? message
        : [{ type: "text", text: message }],
    };

    await axios.post(LINE_API_URL, body, { headers: HEADERS });
    logger.info("成功回應 LINE 訊息");
  } catch (error) {
    handleLineApiError(error);
  }
};

/**
 * 透過 User ID 主動推送訊息
 * @param {string} userId - LINE 使用者 ID
 * @param {string|Object} message - 訊息內容，可為文字或 Flex Message
 */
exports.pushMessage = async (userId, message) => {
  try {
    const body = {
      to: userId,
      messages: Array.isArray(message)
        ? message
        : [{ type: "text", text: message }],
    };

    await axios.post(LINE_PUSH_URL, body, { headers: HEADERS });
    logger.info(`成功推送訊息至 User ID: ${userId}`);
  } catch (error) {
    handleLineApiError(error);
  }
};

/**
 * 處理 LINE API 錯誤
 * @param {Object} error - 錯誤物件
 */
const handleLineApiError = (error) => {
  if (error.response) {
    logger.error(
      `LINE API 回應錯誤 (${error.response.status}):`,
      error.response.data
    );
  } else if (error.request) {
    logger.error("LINE API 無回應:", error.request);
  } else {
    logger.error("LINE API 發生錯誤:", error.message);
  }
};
