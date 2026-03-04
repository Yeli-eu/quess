const cors = require('cors');

// 跨域配置：允许所有源（开发/生产均适用，单虚拟机部署无安全问题）
const corsMiddleware = cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

module.exports = corsMiddleware;