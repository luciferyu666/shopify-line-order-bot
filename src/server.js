const app = require("./app"); // 載入 Express 應用程式
const config = require("./config/config");
const logger = require("./utils/logger");

// 啟動 HTTP 伺服器
const server = app.listen(config.PORT, () => {
  logger.info(`🚀 伺服器運行中: http://localhost:${config.PORT}`);
});

// 捕獲未捕捉的例外錯誤
process.on("uncaughtException", (err) => {
  logger.error("未捕獲的例外錯誤:", err);
  process.exit(1); // 退出進程
});

// 捕獲未處理的 Promise 拒絕錯誤
process.on("unhandledRejection", (reason, promise) => {
  logger.error("未處理的 Promise 拒絕:", reason);
});

// 監聽終止訊號，優雅關閉伺服器
const shutdown = () => {
  logger.info("⚠️ 伺服器即將關閉...");
  server.close(() => {
    logger.info("✅ 伺服器已成功關閉");
    process.exit(0);
  });
};

// 處理 `Ctrl + C` (SIGINT) & `docker stop` (SIGTERM)
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
