const axios = require("axios");
const shopifyService = require("../src/services/shopifyService");
const shopifyConfig = require("../src/config/shopifyConfig");

// Mock `axios`，避免實際請求 Shopify API
jest.mock("axios");

describe("Shopify API 整合測試", () => {
  const mockShopifyResponse = {
    data: {
      orders: [
        {
          id: 12345,
          order_number: "1001",
          financial_status: "paid",
          fulfillment_status: "shipped",
          total_price: "1500",
          currency: "TWD",
          created_at: "2024-03-04T12:00:00Z",
          line_items: [
            { name: "商品 A", quantity: 1, price: "500" },
            { name: "商品 B", quantity: 2, price: "500" },
          ],
          fulfillments: [
            {
              tracking_number: "ABC123",
              tracking_url: "https://tracking.example.com/ABC123",
            },
          ],
        },
      ],
    },
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("應該透過 Email 查詢 Shopify 訂單", async () => {
    axios.get.mockResolvedValue(mockShopifyResponse);

    const orders = await shopifyService.getOrdersByEmail("test@example.com");

    expect(axios.get).toHaveBeenCalledWith(
      `${shopifyConfig.SHOPIFY_API_URL}/orders.json?email=test@example.com`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyConfig.SHOPIFY_ACCESS_TOKEN,
        },
      }
    );
    expect(orders).toHaveLength(1);
    expect(orders[0].orderNumber).toBe("1001");
  });

  test("應該透過手機號碼查詢 Shopify 訂單", async () => {
    axios.get.mockResolvedValue(mockShopifyResponse);

    const orders = await shopifyService.getOrdersByPhone("0912345678");

    expect(axios.get).toHaveBeenCalledWith(
      `${shopifyConfig.SHOPIFY_API_URL}/orders.json?status=any`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": shopifyConfig.SHOPIFY_ACCESS_TOKEN,
        },
      }
    );
    expect(orders).toHaveLength(1);
    expect(orders[0].orderNumber).toBe("1001");
  });

  test("應該回傳空陣列當 Shopify 無訂單", async () => {
    axios.get.mockResolvedValue({ data: { orders: [] } });

    const orders = await shopifyService.getOrdersByEmail(
      "notfound@example.com"
    );

    expect(orders).toEqual([]);
  });

  test("應該處理 Shopify API 失敗回應", async () => {
    axios.get.mockRejectedValue(new Error("Shopify API 失敗"));

    await expect(
      shopifyService.getOrdersByEmail("error@example.com")
    ).rejects.toThrow("無法查詢 Shopify 訂單，請稍後再試");
  });
});
