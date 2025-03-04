const shopifyService = require("../services/shopifyService");
const cacheService = require("../services/cacheService");
const logger = require("../utils/logger");

/**
 * 查詢 Shopify 訂單
 * @param {string} userInput - Email 或手機號碼
 * @returns {Promise<Object|null>} 訂單資訊
 */
exports.getOrder = async (userInput) => {
  try {
    // 先檢查 Redis 快取，避免頻繁請求 Shopify API
    const cachedOrder = await cacheService.getCache(userInput);
    if (cachedOrder) {
      logger.info(`從快取取得訂單資訊: ${userInput}`);
      return cachedOrder;
    }

    // 呼叫 Shopify API 查詢訂單
    let orders;
    if (validateEmail(userInput)) {
      orders = await shopifyService.getOrdersByEmail(userInput);
    } else if (validatePhone(userInput)) {
      orders = await shopifyService.getOrdersByPhone(userInput);
    } else {
      logger.warn(`無效的查詢格式: ${userInput}`);
      return null;
    }

    if (!orders || orders.length === 0) {
      logger.info(`查無訂單: ${userInput}`);
      return null;
    }

    // 只回傳最近的一筆訂單
    const latestOrder = formatOrderData(orders[0]);

    // 存入快取（有效時間 10 分鐘）
    await cacheService.setCache(userInput, latestOrder, 600);

    return latestOrder;
  } catch (error) {
    logger.error("查詢 Shopify 訂單失敗", error);
    throw new Error("查詢訂單失敗，請稍後再試");
  }
};

/**
 * 格式化 Shopify 訂單資訊
 * @param {Object} order - Shopify 訂單 API 回應
 * @returns {Object} 整理後的訂單資訊
 */
const formatOrderData = (order) => {
  return {
    orderId: order.id,
    orderNumber: order.order_number,
    status: order.financial_status, // 付款狀態: paid, pending
    fulfillmentStatus: order.fulfillment_status || "未出貨",
    totalPrice: order.total_price,
    currency: order.currency,
    createdAt: order.created_at,
    lineItems: order.line_items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    trackingNumber:
      order.fulfillments.length > 0
        ? order.fulfillments[0].tracking_number
        : "無物流資訊",
    trackingUrl:
      order.fulfillments.length > 0 ? order.fulfillments[0].tracking_url : null,
  };
};

/**
 * 驗證 Email 格式
 */
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 驗證手機號碼格式（支援台灣手機號碼）
 */
const validatePhone = (phone) => {
  const phoneRegex = /^09\d{8}$/; // 台灣手機號碼格式
  return phoneRegex.test(phone);
};
