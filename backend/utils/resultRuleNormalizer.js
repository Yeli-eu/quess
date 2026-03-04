// 统一标准化结果规则组合：固定转为「题号+选项」格式（如：1A,2B,3C）
const normalizeOptionCombination = (optionCombination = '') => {
  const tokens = String(optionCombination)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

  return tokens
    .map((token, idx) => {
      const match = token.match(/^\d+(.+)$/);
      const optionKey = match ? match[1] : token;
      return `${idx + 1}${optionKey}`;
    })
    .join(',');
};

// 根据题目顺序和答题结果生成标准组合串（如：1A,2B,3C）
const buildStandardOptionCombination = (questions = [], answer = {}) => {
  const rawCombination = questions
    .map((question, idx) => `${idx + 1}${answer[question.id] || ''}`)
    .join(',');

  return normalizeOptionCombination(rawCombination);
};


module.exports = {
  normalizeOptionCombination,
  buildStandardOptionCombination
};