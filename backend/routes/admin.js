const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken } = require('../middleware/auth');

// 管理员登录（无需token）
router.post('/login', adminController.adminLogin);

// 所有后续管理员接口都需要token验证
router.use(verifyToken);

// 问卷相关路由
router.get('/survey/list', adminController.getSurveyList);
router.post('/survey/add', adminController.addSurvey);
router.post('/survey/edit', adminController.editSurvey);
router.post('/survey/delete', adminController.deleteSurvey);

// 题目相关路由
router.post('/question/list', adminController.getQuestionList);
router.post('/question/add', adminController.addQuestion);
router.post('/question/edit', adminController.editQuestion);
router.post('/question/delete', adminController.deleteQuestion);

// 选项相关路由
router.post('/option/list', adminController.getOptionList);
router.post('/option/add', adminController.addOption);
router.post('/option/edit', adminController.editOption);
router.post('/option/delete', adminController.deleteOption);

// 结果规则相关路由
router.post('/result-rule/list', adminController.getResultRuleList);
router.post('/result-rule/add', adminController.addResultRule);
router.post('/result-rule/edit', adminController.editResultRule);
router.post('/result-rule/delete', adminController.deleteResultRule);

// 生成验证码路由
router.post('/generate-code', adminController.generateCode);

module.exports = router;