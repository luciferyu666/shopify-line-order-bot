# ✅ Shopify 訂單串接 LINE 官方帳號查詢系統

![alt text](image.png)

📦 專案名稱：`shopify-line-order-bot`  
📅 最後更新：2024-03-04  
🚀 開發技術：Node.js, Express, Shopify API, LINE Messaging API, Redis, JWT

---

## 📌 專案簡介

本專案負責 串接 Shopify 訂單查詢功能至 LINE 官方帳號，讓消費者能夠透過 Email 或手機號碼 查詢 訂單狀態，提升購物體驗。

---

## 🎯 功能列表

✅ LINE 訂單查詢：消費者可透過 LINE 官方帳號 查詢 Shopify 訂單  
✅ Shopify API 整合：透過 Shopify API 查詢 訂單編號、狀態、物流資訊  
✅ Redis 快取：減少 API 負擔，提高查詢速度  
✅ JWT 身份驗證：確保 API 安全性  
✅ 錯誤處理 & 日誌系統：穩定運作，方便除錯  
✅ Webhook 事件處理：支援 LINE Webhook

---

## 🏗 專案架構

```
shopify-line-order-bot/
│── src/                      # 應用程式主目錄
│   ├── controllers/          # 控制器 (處理業務邏輯)
│   ├── services/             # 服務層 (與 API/DB 互動)
│   ├── routes/               # 路由定義
│   ├── middlewares/          # 中介層 (請求驗證、錯誤處理等)
│   ├── utils/                # 工具函數
│   ├── config/               # 設定檔
│   ├── app.js                # Express 應用程式入口
│   ├── server.js             # 啟動 HTTP 伺服器
│── tests/                    # 測試目錄
│── logs/                     # 日誌目錄
│── .env                      # 環境變數
│── package.json              # 依賴管理
│── README.md                 # 專案說明文件
│── Dockerfile                # Docker 部署設定
│── .gitignore                # 忽略 Git 版本控制的檔案
```

---

## 🛠 安裝與執行

### 📥 1. 安裝必要套件

```bash
npm install
```

### 🔧 2. 設定環境變數

建立 `.env` 檔案，填入 Shopify、LINE、Redis 相關設定：

```ini
NODE_ENV=development
PORT=3000
SHOPIFY_SHOP_NAME=your-shop-name
SHOPIFY_ACCESS_TOKEN=your-shopify-access-token
LINE_ACCESS_TOKEN=your-line-access-token
LINE_CHANNEL_SECRET=your-line-channel-secret
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=1h
```

### 🚀 3. 啟動伺服器

```bash
node src/server.js
```

### 🔍 4. 測試 API

使用 `Postman` 或 `cURL` 測試：

```bash
curl -X GET http://localhost:3000/api/orders/email/test@example.com
```

---

## 📡 API 端點

### 🔹 LINE Webhook

| 方法   | 端點                | 描述                            |
| ------ | ------------------- | ------------------------------- |
| `POST` | `/api/line/webhook` | 接收 LINE 官方帳號 Webhook 事件 |

### 🔹 訂單查詢

| 方法  | 端點                       | 描述                 |
| ----- | -------------------------- | -------------------- |
| `GET` | `/api/orders/email/:email` | 透過 Email 查詢訂單  |
| `GET` | `/api/orders/phone/:phone` | 透過手機號碼查詢訂單 |

---

## ✅ 測試

### 📦 運行測試

```bash
npm test
```

### 🔹 測試案例

- ✅ `lineController.test.js` - 測試 LINE 訊息處理
- ✅ `orderController.test.js` - 測試 Shopify 訂單查詢
- ✅ `shopifyService.test.js` - 測試 Shopify API 整合
- ✅ `cacheService.test.js` - 測試 Redis 快取

---

## 🐳 Docker 部署

```bash
docker build -t shopify-line-bot .
docker run -p 3000:3000 --env-file .env shopify-line-bot
```

---

## 📜 授權

本專案使用 MIT 授權 - 歡迎自由使用與修改 🎉
