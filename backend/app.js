const express = require('express');
const app = express();
const path = require('path');
const fileUpload = require('express-fileupload');
const corsMiddleware = require('./middleware/cors');
// 路由导入
const adminRouter = require('./routes/admin');
const userRouter = require('./routes/user');
const uploadRouter = require('./routes/upload');

// 服务端口（和前端api/index.js的baseURL端口一致）
const PORT = process.env.PORT || 3001;

// 注册核心中间件
app.use(corsMiddleware); // 跨域中间件
app.use(express.json()); // 解析json请求体
app.use(express.urlencoded({ extended: true })); // 解析form-data请求体
app.use(fileUpload({ createParentPath: true })); // 文件上传中间件

// 托管静态资源：uploads文件夹（前端可直接访问图片）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 注册路由：所有接口统一添加/api前缀（和前端api/index.js的baseURL一致）
app.use('/api/admin', adminRouter);
app.use('/api/user', userRouter);
app.use('/api/admin', uploadRouter); // 图片上传归到管理员接口

// 404接口处理
app.use('*', (req, res) => {
  res.json({ code: 404, message: '接口不存在' });
});

// 启动服务
app.listen(PORT, '0.0.0.0', () => {
  console.log('✅ 问卷调查后端服务启动成功');
  console.log(`✅ 后端服务地址：http://139.217.73.140:${PORT}`);
  console.log(`✅ 后端接口地址：http://139.217.73.140:${PORT}/api`);
  console.log(`✅ 管理员后台地址：http://139.217.73.140:8080/#/admin/login`);
  console.log(`✅ 用户端访问地址：http://139.217.73.140:8080`);
});

module.exports = app;