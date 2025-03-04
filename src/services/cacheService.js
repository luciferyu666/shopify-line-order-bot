const redis = require("redis");
const util = require("util");
const config = require("../config/config");
const logger = require("../utils/logger");

// 建立 Redis 連線
const redisClient = redis.createClient({
  host: config.REDIS_HOST || "127.0.0.1",
  port: config.REDIS_PORT || 6379,
  password: config.REDIS_PASSWORD || null,
});

// 轉換 Redis 方法為 Promise 版本
redisClient.get = util.promisify(redisClient.get);
redisClient.setex = util.promisify(redisClient.setex);
redisClient.del = util.promisify(redisClient.del);

// 監聽 Redis 連線狀態
redisClient.on("error", (error) => {
  logger.error("Redis 連線錯誤", error);
});

/**
 * 設定快取
 * @param {string} key - 快取鍵值 (通常為 Email 或手機號碼)
 * @param {Object} data - 要存入 Redis 的資料
 * @param {number} ttl - 存活時間 (秒)
 */
exports.setCache = async (key, data, ttl = 600) => {
  try {
    const jsonData = JSON.stringify(data);
    await redisClient.setex(key, ttl, jsonData);
    logger.info(`快取設定成功: ${key}, 存活時間: ${ttl} 秒`);
  } catch (error) {
    logger.error("快取寫入失敗", error);
  }
};

/**
 * 取得快取
 * @param {string} key - 快取鍵值
 * @returns {Promise<Object|null>} 快取資料
 */
exports.getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error("快取讀取失敗", error);
    return null;
  }
};

/**
 * 刪除快取
 * @param {string} key - 要刪除的快取鍵值
 */
exports.deleteCache = async (key) => {
  try {
    await redisClient.del(key);
    logger.info(`快取刪除成功: ${key}`);
  } catch (error) {
    logger.error("快取刪除失敗", error);
  }
};
