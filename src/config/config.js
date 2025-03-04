require("dotenv").config(); // 載入 .env 檔案

module.exports = {
  // 服務設定
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 3000,

  // Shopify 設定
  SHOPIFY_SHOP_NAME: process.env.SHOPIFY_SHOP_NAME,
  SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,

  // LINE 設定
  LINE_ACCESS_TOKEN: process.env.LINE_ACCESS_TOKEN,
  LINE_CHANNEL_SECRET: process.env.LINE_CHANNEL_SECRET,

  // Redis 設定
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || null,

  // JWT 設定
  JWT_SECRET: process.env.JWT_SECRET || "your-secret-key",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
};
