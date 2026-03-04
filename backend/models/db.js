const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 确保db文件夹存在
const dbDir = path.join(__dirname, '../db');
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir);

// 连接SQLite数据库，自动生成survey.db文件
const db = new sqlite3.Database(path.join(dbDir, 'survey.db'), (err) => {
  if (err) {
    console.error('数据库连接失败：', err.message);
    throw err;
  }
  // 开启外键约束【新增这行】
  db.run("PRAGMA foreign_keys = ON;", (err) => {
    if (err) console.error('开启外键约束失败：', err.message);
  });
  console.log('✅ SQLite数据库连接成功（已开启外键约束）');
  // 创建所有表（不存在则创建）
  createTables();
});

// 创表语句：问卷/题目/选项/结果规则/验证码（核心表，无冗余）
function createTables() {
  // 问卷表：存储问卷名称
  db.run(`CREATE TABLE IF NOT EXISTS surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // 题目表：关联问卷ID
  db.run(`CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
  )`);

  // 选项表：关联题目ID，option_key为A/B/C/D
  db.run(`CREATE TABLE IF NOT EXISTS options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    option_key TEXT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
  )`);

  // 结果规则表：关联问卷ID，存储选项组合-结果映射，支持图片
  db.run(`CREATE TABLE IF NOT EXISTS result_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL,
    option_combination TEXT NOT NULL, -- 例：A,B,C 或 1A,2B,3C
    result_name TEXT NOT NULL,
    result_content TEXT NOT NULL,
    result_image TEXT,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE,
    UNIQUE(survey_id, option_combination) -- 同一问卷的组合唯一
  )`);

  // 验证码表：核心，存储验证码-问卷绑定、使用次数、过期状态
  db.run(`CREATE TABLE IF NOT EXISTS verification_codes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE, -- 6位唯一验证码
    survey_id INTEGER NOT NULL,
    use_count INTEGER DEFAULT 0, -- 使用次数，最大2
    is_expired INTEGER DEFAULT 0, -- 是否过期：0-未过期 1-已过期
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (survey_id) REFERENCES surveys(id) ON DELETE CASCADE
  )`);

  console.log('✅ 所有数据库表初始化完成（不存在则创建）');
}

// 封装sqlite3的get/run/all方法为Promise，避免回调地狱（新手友好）
db.getAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

db.runAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

db.allAsync = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

module.exports = db;