const orderController = require("../src/controllers/orderController");
const shopifyService = require("../src/services/shopifyService");
const cacheService = require("../src/services/cacheService");

// Mock 服務，避免實際請求 Shopify API & Redis
jest.mock("../src/services/shopifyService");
jest.mock("../src/services/cacheService");

describe("Shopify 訂單查詢測試", () => {
  const mockOrderData = {
    orderId: 12345,
    orderNumber: "1001",
    status: "paid",
    fulfillmentStatus: "shipped",
    totalPrice: "1500",
    currency: "TWD",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("應該成功透過 Email 查詢訂單", async () => {
    cacheService.getCache.mockResolvedValue(null); // 模擬快取無資料
    shopifyService.getOrdersByEmail.mockResolvedValue([mockOrderData]);

    const order = await orderController.getOrder("test@example.com");

    expect(cacheService.getCache).toHaveBeenCalledWith("test@example.com");
    expect(shopifyService.getOrdersByEmail).toHaveBeenCalledWith(
      "test@example.com"
    );
    expect(cacheService.setCache).toHaveBeenCalledWith(
      "test@example.com",
      mockOrderData,
      600
    );
    expect(order).toEqual(mockOrderData);
  });

  test("應該成功透過手機號碼查詢訂單", async () => {
    cacheService.getCache.mockResolvedValue(null);
    shopifyService.getOrdersByPhone.mockResolvedValue([mockOrderData]);

    const order = await orderController.getOrder("0912345678");

    expect(cacheService.getCache).toHaveBeenCalledWith("0912345678");
    expect(shopifyService.getOrdersByPhone).toHaveBeenCalledWith("0912345678");
    expect(cacheService.setCache).toHaveBeenCalledWith(
      "0912345678",
      mockOrderData,
      600
    );
    expect(order).toEqual(mockOrderData);
  });

  test("應該回應 '查無訂單' 當 Shopify 無回應資料", async () => {
    cacheService.getCache.mockResolvedValue(null);
    shopifyService.getOrdersByEmail.mockResolvedValue([]);

    const order = await orderController.getOrder("notfound@example.com");

    expect(order).toBeNull();
    expect(shopifyService.getOrdersByEmail).toHaveBeenCalledWith(
      "notfound@example.com"
    );
  });

  test("應該回應 '查無訂單' 當快取有無效資料", async () => {
    cacheService.getCache.mockResolvedValue(null);
    shopifyService.getOrdersByPhone.mockResolvedValue([]);

    const order = await orderController.getOrder("0999999999");

    expect(order).toBeNull();
    expect(shopifyService.getOrdersByPhone).toHaveBeenCalledWith("0999999999");
  });

  test("應該從快取回傳訂單，避免請求 Shopify API", async () => {
    cacheService.getCache.mockResolvedValue(mockOrderData);

    const order = await orderController.getOrder("cached@example.com");

    expect(order).toEqual(mockOrderData);
    expect(shopifyService.getOrdersByEmail).not.toHaveBeenCalled();
  });

  test("應該處理 Shopify API 錯誤", async () => {
    cacheService.getCache.mockResolvedValue(null);
    shopifyService.getOrdersByEmail.mockRejectedValue(
      new Error("Shopify API 錯誤")
    );

    await expect(orderController.getOrder("error@example.com")).rejects.toThrow(
      "查詢訂單失敗，請稍後再試"
    );

    expect(shopifyService.getOrdersByEmail).toHaveBeenCalledWith(
      "error@example.com"
    );
  });
});
