# 使用輕量版 Node.js 官方映像檔
FROM node:18-alpine

# 設定工作目錄
WORKDIR /app

# 複製 package.json 和 package-lock.json，並安裝依賴
COPY package*.json ./
RUN npm install --only=production

# 複製專案所有檔案
COPY . .

# 暴露應用程式埠號
EXPOSE 3000

# 設定環境變數（可透過 .env 覆寫）
ENV NODE_ENV=production
ENV PORT=3000

# 啟動應用程式
CMD ["node", "src/server.js"]
