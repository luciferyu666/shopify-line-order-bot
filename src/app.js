require("dotenv").config(); // 載入 .env 環境變數
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config/config");
const logger = require("./utils/logger");

// 路由
const lineRoutes = require("./routes/lineRoutes");
const orderRoutes = require("./routes/orderRoutes");

// 中介軟體
const errorHandler = require("./middlewares/errorHandler");

// 建立 Express 應用程式
const app = express();

// 設定中介軟體
app.use(bodyParser.json()); // 解析 JSON 請求
app.use(bodyParser.urlencoded({ extended: true })); // 解析 URL 編碼數據
app.use(cors()); // 允許跨來源請求

// 掛載路由
app.use("/api/line", lineRoutes); // LINE Webhook 端點
app.use("/api/orders", orderRoutes); // 訂單查詢 API

// 根目錄測試路由
app.get("/", (req, res) => {
  res.send("Shopify 訂單查詢服務運行中 🚀");
});

// 掛載錯誤處理
app.use(errorHandler.errorHandler);

// 啟動伺服器
const PORT = config.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 伺服器運行中: http://localhost:${PORT}`);
});

module.exports = app;
