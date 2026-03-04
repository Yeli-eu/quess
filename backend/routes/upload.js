const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { verifyToken } = require('../middleware/auth');

// 仅管理员可上传图片
router.use(verifyToken);
// 图片上传接口
router.post('/upload-image', uploadController.uploadImage);

module.exports = router;