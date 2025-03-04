const jwt = require("jsonwebtoken");
const config = require("../config/config");
const logger = require("../utils/logger");

/**
 * API Token 驗證 Middleware
 * @param {Object} req - Express 請求物件
 * @param {Object} res - Express 回應物件
 * @param {Function} next - Express 下一個 middleware
 */
exports.verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("未提供有效的 Token");
      return res.status(401).json({ message: "未授權，請提供 Token" });
    }

    const token = authHeader.split(" ")[1];
    jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.warn("無效的 Token");
        return res.status(401).json({ message: "無效的 Token" });
      }

      // Token 驗證成功，將解碼的用戶資訊存入 req
      req.user = decoded;
      next();
    });
  } catch (error) {
    logger.error("身份驗證失敗", error);
    return res.status(500).json({ message: "身份驗證失敗" });
  }
};
