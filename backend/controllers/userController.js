const db = require('../models/db');
const { validateVerificationCode, incrementCodeUseCount } = require('../utils/codeGenerator');
const { buildStandardOptionCombination } = require('../utils/resultRuleNormalizer');

// 验证验证码有效性，返回绑定的问卷信息
const verifyCode = async (req, res) => {
  try {
    const { code } = req.body;
    // 验证验证码
    const codeInfo = await validateVerificationCode(code);
    if (!codeInfo) {
      return res.json({ code: 400, message: '验证码无效/已过期/使用次数已达上限' });
    }
    // 获取验证码绑定的问卷信息
    const survey = await db.getAsync(`SELECT id, name FROM surveys WHERE id = ?`, [codeInfo.survey_id]);
    if (!survey) {
      return res.json({ code: 400, message: '验证码绑定的问卷不存在' });
    }
    // 验证成功，返回问卷信息（前端存储到localStorage）
    res.json({ code: 200, message: '验证码验证成功', data: survey });
  } catch (error) {
    console.error('验证码验证失败：', error);
    res.json({ code: 500, message: '验证码验证失败，请重试' });
  }
};

// 根据问卷ID获取问卷详情：题目+选项（按题目顺序排列）
const getSurvey = async (req, res) => {
  try {
    const { surveyId } = req.body;
    // 获取该问卷的所有题目
    const questions = await db.allAsync(`
      SELECT id, content FROM questions 
      WHERE survey_id = ? 
      ORDER BY create_time ASC
    `, [surveyId]);
    if (questions.length === 0) {
      return res.json({ code: 400, message: '该问卷暂无题目配置' });
    }
    // 为每个题目拼接选项
    const questionList = await Promise.all(questions.map(async (question) => {
      const options = await db.allAsync(`
        SELECT id, content, option_key FROM options 
        WHERE question_id = ? 
        ORDER BY create_time ASC
      `, [question.id]);
      return { ...question, options };
    }));
    // 返回问卷详情（题目+选项）
    res.json({ code: 200, data: questionList });
  } catch (error) {
    console.error('获取问卷详情失败：', error);
    res.json({ code: 500, message: '获取问卷详情失败' });
  }
};

// 提交答题结果，匹配个性化结果（**仅临时计算，不存储任何用户数据**）
const matchResult = async (req, res) => {
  try {
    const { surveyId, answer } = req.body;
    // answer格式：{questionId: optionKey, ...}，前端提交的答题结果
    if (Object.keys(answer).length === 0) {
      return res.json({ code: 400, message: '请完成所有题目后提交' });
    }

    // 步骤1：将答题结果转换为「选项组合字符串」（和result_rules的option_combination格式一致）
    // 先获取该问卷的题目顺序，保证组合顺序和配置一致
    const questions = await db.allAsync(`
      SELECT id FROM questions 
      WHERE survey_id = ? 
      ORDER BY create_time ASC
    `, [surveyId]);
       // 按题目顺序拼接为标准格式：1A,2B,3C
    const standardOptionCombination = buildStandardOptionCombination(questions, answer);

    // 步骤2：根据「问卷ID+标准格式选项组合」匹配结果规则
    const resultRule = await db.getAsync(`
      SELECT result_name, result_content, result_image FROM result_rules 
      WHERE survey_id = ? AND option_combination = ?
     `, [surveyId, standardOptionCombination]);

    if (!resultRule) {
      return res.json({ code: 400, message: '暂无匹配的结果规则，请联系管理员配置' });
    }

    // 步骤3：**增加验证码使用次数**（核心：用户完成答题后才算一次使用）
    const validCode = req.headers['x-valid-code']; // 前端请求头传递有效验证码
    //非空校验
    if (validCode && validCode.trim() !== '') {
      await incrementCodeUseCount(validCode);
    }

    // 步骤4：返回个性化结果（仅临时返回，不存储任何答题/用户数据）
    res.json({ code: 200, data: resultRule });
  } catch (error) {
    console.error('匹配结果失败：', error);
    res.json({ code: 500, message: '匹配结果失败，请重试' });
  }
};

module.exports = { verifyCode, getSurvey, matchResult };