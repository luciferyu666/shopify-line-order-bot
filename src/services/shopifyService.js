const axios = require("axios");
const config = require("../config/shopifyConfig");
const logger = require("../utils/logger");

const SHOPIFY_API_URL = `https://${config.SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/2023-01/orders.json`;
const HEADERS = {
  "Content-Type": "application/json",
  "X-Shopify-Access-Token": config.SHOPIFY_ACCESS_TOKEN,
};

/**
 * 透過 Email 查詢 Shopify 訂單
 * @param {string} email - 使用者 Email
 * @returns {Promise<Array>} 訂單列表
 */
exports.getOrdersByEmail = async (email) => {
  try {
    const url = `${SHOPIFY_API_URL}?email=${email}`;
    const response = await axios.get(url, { headers: HEADERS });

    if (response.data && response.data.orders.length > 0) {
      logger.info(
        `查詢 Shopify 訂單成功 (Email: ${email})，共 ${response.data.orders.length} 筆`
      );
      return response.data.orders;
    } else {
      logger.warn(`未找到訂單 (Email: ${email})`);
      return [];
    }
  } catch (error) {
    handleShopifyError(error);
  }
};

/**
 * 透過手機號碼查詢 Shopify 訂單 (需篩選 phone 欄位)
 * @param {string} phone - 使用者手機號碼
 * @returns {Promise<Array>} 訂單列表
 */
exports.getOrdersByPhone = async (phone) => {
  try {
    // 先查詢所有訂單，然後過濾 phone 欄位 (Shopify API 不支援直接用 phone 查詢)
    const url = `${SHOPIFY_API_URL}?status=any`;
    const response = await axios.get(url, { headers: HEADERS });

    if (response.data && response.data.orders.length > 0) {
      const orders = response.data.orders.filter(
        (order) => order.phone === phone
      );
      logger.info(
        `查詢 Shopify 訂單成功 (手機: ${phone})，共 ${orders.length} 筆`
      );
      return orders;
    } else {
      logger.warn(`未找到訂單 (手機: ${phone})`);
      return [];
    }
  } catch (error) {
    handleShopifyError(error);
  }
};

/**
 * 處理 Shopify API 錯誤
 * @param {Object} error - 錯誤物件
 */
const handleShopifyError = (error) => {
  if (error.response) {
    logger.error(
      `Shopify API 回應錯誤 (${error.response.status}):`,
      error.response.data
    );
  } else if (error.request) {
    logger.error("Shopify API 無回應:", error.request);
  } else {
    logger.error("Shopify API 發生錯誤:", error.message);
  }
  throw new Error("無法查詢 Shopify 訂單，請稍後再試。");
};
