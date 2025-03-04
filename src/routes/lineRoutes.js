const express = require("express");
const router = express.Router();
const webhookController = require("../controllers/webhookController");

// 設定 LINE Webhook 路由
router.post("/webhook", webhookController.handleWebhook);

module.exports = router;
