/**
 * 格式化成功回應
 * @param {Object} data - 回應資料
 * @param {string} message - 自訂訊息 (可選)
 * @returns {Object} 統一格式的 API 回應
 */
exports.success = (data, message = "請求成功") => {
  return {
    success: true,
    status: 200,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
};

/**
 * 格式化失敗回應
 * @param {string} message - 錯誤訊息
 * @param {number} statusCode - HTTP 狀態碼 (預設 400)
 * @param {Object} error - 錯誤內容 (可選)
 * @returns {Object} 統一格式的 API 錯誤回應
 */
exports.error = (message, statusCode = 400, error = null) => {
  return {
    success: false,
    status: statusCode,
    message,
    error: process.env.NODE_ENV === "development" ? error : undefined, // 只有開發模式回傳錯誤細節
    timestamp: new Date().toISOString(),
  };
};
