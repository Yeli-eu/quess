const moment = require('moment');
const db = require('../models/db');

// 生成6位混合大小写字母的验证码（结合时间戳保证唯一性，打乱顺序保证随机性）
const generateCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  // 时间戳后3位转字符 + 3位随机字符，避免纯随机重复
  const timestamp = Date.now().toString().slice(-3);
  const timestampChars = timestamp.split('').map(num => chars[parseInt(num) % chars.length]);
  const randomChars = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]);
  // 打乱数组，保证随机性
  return [...timestampChars, ...randomChars].sort(() => Math.random() - 0.5).join('');
};

// 生成**唯一**的6位验证码（防止数据库重复）
const generateUniqueCode = async () => {
  let code = '';
  let isUnique = false;
  // 循环生成，直到验证码唯一
  while (!isUnique) {
    code = generateCode();
    const row = await db.getAsync(`SELECT code FROM verification_codes WHERE code = ?`, [code]);
    isUnique = !row;
  }
  return code;
};

// 验证验证码有效性：未过期、未达2次使用、未标记过期
const validateVerificationCode = async (code) => {
  // 3天前的时间戳，判断是否过期
  const threeDaysAgo = moment().subtract(3, 'days').toISOString();
  const codeInfo = await db.getAsync(`
    SELECT * FROM verification_codes 
    WHERE code = ? AND is_expired = 0 AND use_count < 2 AND create_time >= ?
  `, [code, threeDaysAgo]);
  return codeInfo; // 返回验证码信息（含survey_id），无则为无效
};

// 增加验证码使用次数，达2次则标记为过期
const incrementCodeUseCount = async (code) => {
  // 先增加使用次数
  await db.runAsync(`UPDATE verification_codes SET use_count = use_count + 1 WHERE code = ?`, [code]);
  // 查询当前使用次数
  const row = await db.getAsync(`SELECT use_count FROM verification_codes WHERE code = ?`, [code]);
  // 达2次则标记过期
  if (row?.use_count >= 2) {
    await db.runAsync(`UPDATE verification_codes SET is_expired = 1 WHERE code = ?`, [code]);
  }
};

// 定时清理失效验证码：每天凌晨执行，彻底删除已过期+达2次使用的验证码（最小化存储）
const clearExpiredCodes = async () => {
  // 新增：服务启动后，立即执行一次清理【必加】
  const threeDaysAgo = moment().subtract(3, 'days').toISOString();
  await db.runAsync(`
    UPDATE verification_codes SET is_expired = 1 
    WHERE create_time < ? OR use_count >= 2
  `, [threeDaysAgo]);
  await db.runAsync(`DELETE FROM verification_codes WHERE is_expired = 1`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ✅ 服务启动，立即清理失效验证码完成`);

  // 原有循环逻辑不变
  setInterval(async () => {
    const threeDaysAgo = moment().subtract(3, 'days').toISOString();
    await db.runAsync(`
      UPDATE verification_codes SET is_expired = 1 
      WHERE create_time < ? OR use_count >= 2
    `, [threeDaysAgo]);
    await db.runAsync(`DELETE FROM verification_codes WHERE is_expired = 1`);
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ✅ 定时清理失效验证码完成`);
  }, 24 * 60 * 60 * 1000); // 24小时执行一次
};

// 初始化定时任务
clearExpiredCodes();

module.exports = {
  generateUniqueCode,
  validateVerificationCode,
  incrementCodeUseCount
};