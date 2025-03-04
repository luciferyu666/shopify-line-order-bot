const request = require("supertest");
const app = require("../src/app"); // Express 應用程式
const lineService = require("../src/services/lineService");
const orderController = require("../src/controllers/orderController");
const lineController = require("../src/controllers/lineController");

// 模擬 `lineService.replyMessage`，避免實際發送 API
jest.mock("../src/services/lineService");

// 模擬 `orderController.getOrder`，避免實際查詢 Shopify API
jest.mock("../src/controllers/orderController");

describe("LINE 訊息處理測試", () => {
  let mockEvent;

  beforeEach(() => {
    mockEvent = {
      replyToken: "test-reply-token",
      source: { userId: "test-user-id" },
      message: { type: "text", text: "test@example.com" },
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("應該成功回應訂單資訊 (使用 Email 查詢)", async () => {
    const mockOrderData = {
      orderId: 12345,
      orderNumber: "1001",
      status: "paid",
      fulfillmentStatus: "shipped",
      totalPrice: "1500",
      currency: "TWD",
    };

    orderController.getOrder.mockResolvedValue(mockOrderData);
    await lineController.handleTextMessage(mockEvent);

    expect(orderController.getOrder).toHaveBeenCalledWith("test@example.com");
    expect(lineService.replyMessage).toHaveBeenCalledWith(
      "test-reply-token",
      expect.stringContaining("訂單編號: 1001")
    );
  });

  test("應該回應 '查無訂單' 訊息", async () => {
    orderController.getOrder.mockResolvedValue(null);
    await lineController.handleTextMessage(mockEvent);

    expect(orderController.getOrder).toHaveBeenCalledWith("test@example.com");
    expect(lineService.replyMessage).toHaveBeenCalledWith(
      "test-reply-token",
      expect.stringContaining("查無相關訂單")
    );
  });

  test("應該回應 '請輸入有效的 Email 或手機號碼'", async () => {
    mockEvent.message.text = "invalid-input";
    await lineController.handleTextMessage(mockEvent);

    expect(lineService.replyMessage).toHaveBeenCalledWith(
      "test-reply-token",
      "請輸入有效的 Email 或手機號碼來查詢訂單。"
    );
  });

  test("應該處理發生的錯誤", async () => {
    orderController.getOrder.mockRejectedValue(new Error("API 連線失敗"));
    await lineController.handleTextMessage(mockEvent);

    expect(lineService.replyMessage).toHaveBeenCalledWith(
      "test-reply-token",
      "系統錯誤，請稍後再試。"
    );
  });
});
