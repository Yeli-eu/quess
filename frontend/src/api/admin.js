import axios from './index'

// 管理员登录
export function adminLogin(data) {
  return axios({
    url: '/admin/login',
    method: 'post',
    data
  })
}

// 问卷增删改查
export function getSurveyList() {
  return axios({
    url: '/admin/survey/list',
    method: 'get'
  })
}
export function addSurvey(data) {
  return axios({
    url: '/admin/survey/add',
    method: 'post',
    data
  })
}
export function editSurvey(data) {
  return axios({
    url: '/admin/survey/edit',
    method: 'post',
    data
  })
}
export function deleteSurvey(data) {
  return axios({
    url: '/admin/survey/delete',
    method: 'post',
    data
  })
}

// 题目增删改查
export function getQuestionList(data) {
  return axios({
    url: '/admin/question/list',
    method: 'post',
    data
  })
}
export function addQuestion(data) {
  return axios({
    url: '/admin/question/add',
    method: 'post',
    data
  })
}
export function editQuestion(data) {
  return axios({
    url: '/admin/question/edit',
    method: 'post',
    data
  })
}
export function deleteQuestion(data) {
  return axios({
    url: '/admin/question/delete',
    method: 'post',
    data
  })
}

// 选项增删改查
export function getOptionList(data) {
  return axios({
    url: '/admin/option/list',
    method: 'post',
    data
  })
}
export function addOption(data) {
  return axios({
    url: '/admin/option/add',
    method: 'post',
    data
  })
}
export function editOption(data) {
  return axios({
    url: '/admin/option/edit',
    method: 'post',
    data
  })
}
export function deleteOption(data) {
  return axios({
    url: '/admin/option/delete',
    method: 'post',
    data
  })
}

// 结果规则增删改查
export function getResultRuleList(data) {
  return axios({
    url: '/admin/result-rule/list',
    method: 'post',
    data
  })
}
export function addResultRule(data) {
  return axios({
    url: '/admin/result-rule/add',
    method: 'post',
    data
  })
}
export function editResultRule(data) {
  return axios({
    url: '/admin/result-rule/edit',
    method: 'post',
    data
  })
}
export function deleteResultRule(data) {
  return axios({
    url: '/admin/result-rule/delete',
    method: 'post',
    data
  })
}

// 生成验证码（绑定问卷）
export function generateCode(data) {
  return axios({
    url: '/admin/generate-code',
    method: 'post',
    data
  })
}

// 图片上传（结果页图案）
export function uploadImage(data) {
  return axios({
    url: '/admin/upload-image',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}