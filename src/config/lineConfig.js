require("dotenv").config(); // 載入 .env 環境變數

module.exports = {
  // LINE API 金鑰
  LINE_ACCESS_TOKEN: process.env.LINE_ACCESS_TOKEN,
  LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET,

  // LINE API URL
  LINE_MESSAGING_API_URL: "https://api.line.me/v2/bot/message",
  LINE_WEBHOOK_URL:
    process.env.LINE_WEBHOOK_URL || "https://your-webhook-url.com/webhook",
};
