import axios from 'axios'
import { Message } from 'element-ui'

// 创建axios实例，基础地址对接后端（本地开发用localhost:3001，生产环境改虚拟机IP/域名）
const service = axios.create({
  baseURL: 'http://localhost:3001/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器：添加管理员token
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器：统一处理响应结果、错误提示
service.interceptors.response.use(
  response => {
    const res = response.data
    // 后端返回code=200为成功，否则为失败
    if (res.code !== 200) {
      Message.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    console.error('响应错误：', error)
    Message.error(error.message || '服务器异常，请稍后再试')
    return Promise.reject(error)
  }
)

export default service