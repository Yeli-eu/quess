const db = require('../models/db');
const moment = require('moment');
const { generateToken } = require('../middleware/auth');
const { generateUniqueCode } = require('../utils/codeGenerator');
const { normalizeOptionCombination } = require('../utils/resultRuleNormalizer');

// 管理员登录：固定账号admin，密码12345678
const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    // 固定账号密码校验
    if (username === 'admin' && password === '12345678') {
      // 生成token，返回给前端
      const token = generateToken({ username: 'admin', role: 'super_admin' });
      res.json({ code: 200, message: '登录成功', data: { token } });
    } else {
      res.json({ code: 400, message: '账号或密码错误' });
    }
  } catch (error) {
    console.error('管理员登录失败：', error);
    res.json({ code: 500, message: '服务器异常，登录失败' });
  }
};

// ---------------------- 问卷相关接口 ----------------------
// 获取问卷列表
const getSurveyList = async (req, res) => {
  try {
    const surveys = await db.allAsync(`SELECT id, name, create_time FROM surveys ORDER BY create_time DESC`);
    res.json({ code: 200, data: surveys });
  } catch (error) {
    console.error('获取问卷列表失败：', error);
    res.json({ code: 500, message: '获取问卷列表失败' });
  }
};

// 新增问卷
const addSurvey = async (req, res) => {
  try {
    const { name } = req.body;
    // 校验问卷名称是否重复
    const exist = await db.getAsync(`SELECT id FROM surveys WHERE name = ?`, [name]);
    if (exist) {
      return res.json({ code: 400, message: '问卷名称已存在，请更换' });
    }
    await db.runAsync(`INSERT INTO surveys (name) VALUES (?)`, [name]);
    res.json({ code: 200, message: '问卷新增成功' });
  } catch (error) {
    console.error('新增问卷失败：', error);
    res.json({ code: 500, message: '新增问卷失败' });
  }
};

// 编辑问卷
const editSurvey = async (req, res) => {
  try {
    const { id, name } = req.body;
    // 校验问卷名称是否重复（排除自身）
    const exist = await db.getAsync(`SELECT id FROM surveys WHERE name = ? AND id != ?`, [name, id]);
    if (exist) {
      return res.json({ code: 400, message: '问卷名称已存在，请更换' });
    }
    await db.runAsync(`UPDATE surveys SET name = ? WHERE id = ?`, [name, id]);
    res.json({ code: 200, message: '问卷编辑成功' });
  } catch (error) {
    console.error('编辑问卷失败：', error);
    res.json({ code: 500, message: '编辑问卷失败' });
  }
};

// 删除问卷（级联删除题目/选项/结果规则/验证码）
const deleteSurvey = async (req, res) => {
  try {
    const { id } = req.body;
    await db.runAsync(`DELETE FROM surveys WHERE id = ?`, [id]);
    res.json({ code: 200, message: '问卷删除成功' });
  } catch (error) {
    console.error('删除问卷失败：', error);
    res.json({ code: 500, message: '删除问卷失败' });
  }
};

// ---------------------- 题目相关接口 ----------------------
// 获取题目列表（按问卷ID）
const getQuestionList = async (req, res) => {
  try {
    let { surveyId } = req.body;
    // 新增：参数类型校验【所有数字ID接口都加此逻辑】
    surveyId = Number(surveyId);
    if (isNaN(surveyId) || surveyId <= 0) {
      return res.json({ code: 400, message: '问卷ID无效' });
    }
    const questions = await db.allAsync(`
      SELECT id, survey_id, content, create_time 
      FROM questions 
      WHERE survey_id = ? 
      ORDER BY create_time ASC
    `, [surveyId]);
    res.json({ code: 200, data: questions });
  } catch (error) {
    console.error('获取题目列表失败：', error);
    res.json({ code: 500, message: '获取题目列表失败' });
  }
};

// 新增题目
const addQuestion = async (req, res) => {
  try {
    const { survey_id, content } = req.body;
    await db.runAsync(`INSERT INTO questions (survey_id, content) VALUES (?, ?)`, [survey_id, content]);
    res.json({ code: 200, message: '题目新增成功' });
  } catch (error) {
    console.error('新增题目失败：', error);
    res.json({ code: 500, message: '新增题目失败' });
  }
};

// 编辑题目
const editQuestion = async (req, res) => {
  try {
    const { id, content } = req.body;
    await db.runAsync(`UPDATE questions SET content = ? WHERE id = ?`, [content, id]);
    res.json({ code: 200, message: '题目编辑成功' });
  } catch (error) {
    console.error('编辑题目失败：', error);
    res.json({ code: 500, message: '编辑题目失败' });
  }
};

// 删除题目
const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.body;
    await db.runAsync(`DELETE FROM questions WHERE id = ?`, [id]);
    res.json({ code: 200, message: '题目删除成功' });
  } catch (error) {
    console.error('删除题目失败：', error);
    res.json({ code: 500, message: '删除题目失败' });
  }
};

// ---------------------- 选项相关接口 ----------------------
// 获取选项列表（按题目ID）
const getOptionList = async (req, res) => {
  try {
    const { questionId } = req.body;
    const options = await db.allAsync(`
      SELECT id, question_id, content, option_key, create_time 
      FROM options 
      WHERE question_id = ? 
      ORDER BY create_time ASC
    `, [questionId]);
    res.json({ code: 200, data: options });
  } catch (error) {
    console.error('获取选项列表失败：', error);
    res.json({ code: 500, message: '获取选项列表失败' });
  }
};

// 新增选项
const addOption = async (req, res) => {
  try {
    const { question_id, content, option_key } = req.body;
    await db.runAsync(`INSERT INTO options (question_id, content, option_key) VALUES (?, ?, ?)`, [question_id, content, option_key]);
    res.json({ code: 200, message: '选项新增成功' });
  } catch (error) {
    console.error('新增选项失败：', error);
    res.json({ code: 500, message: '新增选项失败' });
  }
};

// 编辑选项
const editOption = async (req, res) => {
  try {
    const { id, content } = req.body;
    await db.runAsync(`UPDATE options SET content = ? WHERE id = ?`, [content, id]);
    res.json({ code: 200, message: '选项编辑成功' });
  } catch (error) {
    console.error('编辑选项失败：', error);
    res.json({ code: 500, message: '编辑选项失败' });
  }
};

// 删除选项
const deleteOption = async (req, res) => {
  try {
    const { id } = req.body;
    await db.runAsync(`DELETE FROM options WHERE id = ?`, [id]);
    res.json({ code: 200, message: '选项删除成功' });
  } catch (error) {
    console.error('删除选项失败：', error);
    res.json({ code: 500, message: '删除选项失败' });
  }
};

// ---------------------- 结果规则相关接口 ----------------------
// 获取结果规则列表（按问卷ID）
const getResultRuleList = async (req, res) => {
  try {
    const { surveyId } = req.body;
    const rules = await db.allAsync(`
      SELECT id, survey_id, option_combination, result_name, result_content, result_image, create_time 
      FROM result_rules 
      WHERE survey_id = ? 
      ORDER BY create_time ASC
    `, [surveyId]);
    res.json({ code: 200, data: rules });
  } catch (error) {
    console.error('获取结果规则列表失败：', error);
    res.json({ code: 500, message: '获取结果规则列表失败' });
  }
};

// 新增结果规则
const addResultRule = async (req, res) => {
  try {
    const { survey_id, option_combination, result_name, result_content, result_image } = req.body;
    const normalizedOptionCombination = normalizeOptionCombination(option_combination);
    // 校验组合是否重复（同一问卷）
    const exist = await db.getAsync(`
      SELECT id FROM result_rules 
      WHERE survey_id = ? AND option_combination = ?
    `, [survey_id, normalizedOptionCombination]);
    if (exist) {
      return res.json({ code: 400, message: '该选项组合已存在，请更换' });
    }
    await db.runAsync(`
      INSERT INTO result_rules (survey_id, option_combination, result_name, result_content, result_image) 
      VALUES (?, ?, ?, ?, ?)
       `, [survey_id, normalizedOptionCombination, result_name, result_content, result_image || '']);
    res.json({ code: 200, message: '结果规则新增成功' });
  } catch (error) {
    console.error('新增结果规则失败：', error);
    res.json({ code: 500, message: '新增结果规则失败' });
  }
};

// 编辑结果规则
const editResultRule = async (req, res) => {
  try {
    const { id, option_combination, result_name, result_content, result_image } = req.body;
    const normalizedOptionCombination = normalizeOptionCombination(option_combination);
    // 获取当前规则的问卷ID
    const rule = await db.getAsync(`SELECT survey_id FROM result_rules WHERE id = ?`, [id]);
    // 校验组合是否重复（排除自身）
    const exist = await db.getAsync(`
      SELECT id FROM result_rules 
      WHERE survey_id = ? AND option_combination = ? AND id != ?
    `, [rule.survey_id, normalizedOptionCombination, id]);
    if (exist) {
      return res.json({ code: 400, message: '该选项组合已存在，请更换' });
    }
    await db.runAsync(`
      UPDATE result_rules 
      SET option_combination = ?, result_name = ?, result_content = ?, result_image = ?
      WHERE id = ?
    `, [normalizedOptionCombination, result_name, result_content, result_image || '', id]);
    res.json({ code: 200, message: '结果规则编辑成功' });
  } catch (error) {
    console.error('编辑结果规则失败：', error);
    res.json({ code: 500, message: '编辑结果规则失败' });
  }
};

// 删除结果规则
const deleteResultRule = async (req, res) => {
  try {
    const { id } = req.body;
    await db.runAsync(`DELETE FROM result_rules WHERE id = ?`, [id]);
    res.json({ code: 200, message: '结果规则删除成功' });
  } catch (error) {
    console.error('删除结果规则失败：', error);
    res.json({ code: 500, message: '删除结果规则失败' });
  }
};

// ---------------------- 生成验证码接口（核心） ----------------------
// 生成绑定问卷的6位验证码，输出**用户指定的文案**
const generateCode = async (req, res) => {
  try {
    const { surveyId } = req.body;
    // 校验问卷是否存在
    const survey = await db.getAsync(`SELECT id, name FROM surveys WHERE id = ?`, [surveyId]);
    if (!survey) {
      return res.json({ code: 400, message: '绑定的问卷不存在，请重新选择' });
    }
    // 生成唯一6位验证码
    const code = await generateUniqueCode();
    // 验证码过期时间：3天后
    const expireTime = moment().add(3, 'days').format('YYYY-MM-DD HH:mm:ss');
    // 插入验证码表，绑定问卷ID
    await db.runAsync(`INSERT INTO verification_codes (code, survey_id) VALUES (?, ?)`, [code, surveyId]);
    // 生成**用户指定的文案**：含时区问候语、访问链接、验证码、过期时间
    const hour = new Date().getHours();
    const greeting = hour < 12 ? '早上' : hour < 18 ? '下午' : '晚上'; // 时区问候语
    const accessLink = `http://localhost:8080`; // 前端访问地址（生产环境改虚拟机IP/域名）
    // 按用户要求的文案格式拼接
    const copyText = `宝宝${greeting}好，感谢您的购买，请复制下面的链接到浏览器打开（请使用自带的浏览器！！）

${accessLink}

兑换码：
${code}
（兑换码可以重复使用两次，将于${expireTime}过期）
我们不会保存您的任何信息，包括问卷结果，记得截图保存哟！`;
    // 返回结果：验证码、过期时间、可复制文案
    res.json({
      code: 200,
      message: '验证码生成成功',
      data: { code, expireTime, copyText }
    });
  } catch (error) {
    console.error('生成验证码失败：', error);
    res.json({ code: 500, message: '生成验证码失败，请重试' });
  }
};

module.exports = {
  adminLogin,
  // 问卷
  getSurveyList, addSurvey, editSurvey, deleteSurvey,
  // 题目
  getQuestionList, addQuestion, editQuestion, deleteQuestion,
  // 选项
  getOptionList, addOption, editOption, deleteOption,
  // 结果规则
  getResultRuleList, addResultRule, editResultRule, deleteResultRule,
  // 生成验证码
  generateCode
};