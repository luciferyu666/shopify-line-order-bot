const fs = require("fs");
const path = require("path");
const util = require("util");

// 確保 logs 目錄存在
const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

// 建立日誌檔案
const logFile = path.join(logDirectory, "app.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });

// 格式化時間
const getTimeStamp = () => new Date().toISOString();

/**
 * 記錄 INFO 訊息
 * @param  {...any} args - 訊息內容
 */
const info = (...args) => {
  log("INFO", args);
};

/**
 * 記錄 WARN 訊息
 * @param  {...any} args - 訊息內容
 */
const warn = (...args) => {
  log("WARN", args);
};

/**
 * 記錄 ERROR 訊息
 * @param  {...any} args - 訊息內容
 */
const error = (...args) => {
  log("ERROR", args);
};

/**
 * 通用日誌記錄
 * @param {string} level - 日誌等級 (INFO, WARN, ERROR)
 * @param {Array} messages - 訊息內容
 */
const log = (level, messages) => {
  const formattedMessage = `[${getTimeStamp()}] [${level}] ${util.format(
    ...messages
  )}`;

  // 輸出到 console
  console.log(formattedMessage);

  // 寫入到日誌檔案
  logStream.write(formattedMessage + "\n");
};

// 匯出模組
module.exports = {
  info,
  warn,
  error,
};
