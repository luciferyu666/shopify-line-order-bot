const logger = require("../utils/logger");

/**
 * 全局錯誤處理 Middleware
 * @param {Object} err - 錯誤物件
 * @param {Object} req - Express 請求物件
 * @param {Object} res - Express 回應物件
 * @param {Function} next - Express 下一個 middleware
 */
exports.errorHandler = (err, req, res, next) => {
  logger.error("系統錯誤", err);

  // 設定 HTTP 狀態碼
  const statusCode = err.status || 500;

  // 統一回應格式
  res.status(statusCode).json({
    success: false,
    message: err.message || "伺服器發生錯誤，請稍後再試",
    error: process.env.NODE_ENV === "development" ? err.stack : undefined, // 僅在開發模式顯示錯誤細節
  });
};
