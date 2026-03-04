import axios from './index'

// 验证验证码有效性
export function verifyCode(data) {
  return axios({
    url: '/user/verify-code',
    method: 'post',
    data
  })
}

// 根据问卷ID获取问卷详情（题目+选项）
export function getSurvey(data) {
  return axios({
    url: '/user/get-survey',
    method: 'post',
    data
  })
}

// 提交答题结果，匹配个性化结果（临时计算，不入库）
export function matchResult(data) {
  return axios({
    url: '/user/match-result',
    method: 'post',
    data
  })
}