const lineController = require("./lineController");
const logger = require("../utils/logger");

/**
 * 處理 LINE Webhook 事件
 * @param {Object} req - Express 請求物件
 * @param {Object} res - Express 回應物件
 */
exports.handleWebhook = async (req, res) => {
  try {
    const events = req.body.events; // 取得來自 LINE 的事件陣列

    if (!events || events.length === 0) {
      logger.warn("收到空的 Webhook 事件");
      return res.status(200).send("No events received.");
    }

    logger.info(`收到 ${events.length} 筆 LINE 事件`);

    // 處理每個事件
    for (const event of events) {
      switch (event.type) {
        case "message":
          if (event.message.type === "text") {
            await lineController.handleWebhookEvent(req, res);
          }
          break;
        case "follow":
          await handleFollowEvent(event);
          break;
        case "unfollow":
          await handleUnfollowEvent(event);
          break;
        default:
          logger.warn(`未處理的事件類型: ${event.type}`);
      }
    }

    res.status(200).send("OK");
  } catch (error) {
    logger.error("Webhook 處理失敗", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * 處理使用者加好友事件 (follow)
 * @param {Object} event - LINE 事件物件
 */
const handleFollowEvent = async (event) => {
  logger.info(`使用者 ${event.source.userId} 加入好友`);
  // 這裡可以傳送歡迎訊息
};

/**
 * 處理使用者封鎖事件 (unfollow)
 * @param {Object} event - LINE 事件物件
 */
const handleUnfollowEvent = async (event) => {
  logger.info(`使用者 ${event.source.userId} 解除關注`);
  // 這裡可移除使用者相關紀錄（如訂單通知）
};
