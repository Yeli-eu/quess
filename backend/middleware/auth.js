const jwt = require('jsonwebtoken');
const { Error } = require('sqlite3');

// token秘钥（可自定义，生产环境建议改复杂一点）
const JWT_SECRET = 'survey_admin_2025_secret_key';
// token过期时间：7天（后台无需频繁登录）
const JWT_EXPIRES_IN = '7d';

// 生成token（登录成功后调用）
const generateToken = (userInfo) => {
  return jwt.sign(userInfo, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// 验证token（管理员路由中间件）
const verifyToken = (req, res, next) => {
  try {
    // 从请求头获取token：Bearer xxx
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.json({ code: 401, message: '未登录，请先登录管理员后台' });
    }
    // 验证token
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ code: 401, message: '登录已过期，请重新登录' });
      }
      // 解析后的用户信息挂载到req，供后续接口使用
      req.adminInfo = decoded;
      next();
    });
  } catch (error) {
    res.json({ code: 500, message: 'token验证失败' });
  }
};

module.exports = { generateToken, verifyToken };