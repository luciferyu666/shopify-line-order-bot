const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

/**
 * 透過 Email 查詢訂單
 * GET /orders/email/:email
 */
router.get("/email/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const orders = await orderController.getOrder(email);

    if (!orders) {
      return res
        .status(404)
        .json({ message: "查無訂單，請確認 Email 是否正確" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "查詢失敗", error: error.message });
  }
});

/**
 * 透過手機號碼查詢訂單
 * GET /orders/phone/:phone
 */
router.get("/phone/:phone", async (req, res) => {
  try {
    const { phone } = req.params;
    const orders = await orderController.getOrder(phone);

    if (!orders) {
      return res
        .status(404)
        .json({ message: "查無訂單，請確認手機號碼是否正確" });
    }

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "查詢失敗", error: error.message });
  }
});

module.exports = router;
