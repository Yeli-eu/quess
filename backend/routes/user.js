const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 验证验证码
router.post('/verify-code', userController.verifyCode);
// 获取问卷详情
router.post('/get-survey', userController.getSurvey);
// 提交答题，匹配结果
router.post('/match-result', userController.matchResult);

module.exports = router;