require("dotenv").config(); // 載入 .env 環境變數

module.exports = {
  // Shopify API 設定
  SHOPIFY_SHOP_NAME: process.env.SHOPIFY_SHOP_NAME,
  SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN,

  // Shopify API 基礎 URL
  SHOPIFY_API_URL: `https://${process.env.SHOPIFY_SHOP_NAME}.myshopify.com/admin/api/2023-01`,
};
