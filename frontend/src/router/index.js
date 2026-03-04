import Vue from 'vue'
import VueRouter from 'vue-router'
import { Message } from 'element-ui'

Vue.use(VueRouter)

// 路由懒加载，优化访问性能
const routes = [
  // 重定向：默认跳验证码页
  {
    path: '/',
    redirect: '/verify'
  },
  // 用户端路由
  {
    path: '/verify',
    name: 'Verify',
    component: () => import('../pages/user/Verify.vue'),
    meta: { title: '输入兑换码' }
  },
  {
    path: '/survey-intro',
    name: 'SurveyIntro',
    component: () => import('../pages/user/SurveyIntro.vue'),
    meta: { title: '问卷介绍', requireCode: true }
  },
  {
    path: '/survey',
    name: 'Survey',
    component: () => import('../pages/user/Survey.vue'),
    meta: { title: '填写问卷', requireCode: true }
  },
  {
    path: '/result',
    name: 'Result',
    component: () => import('../pages/user/Result.vue'),
    meta: { title: '问卷结果', requireCode: true }
  },
  // 管理员端路由
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('../pages/admin/Login.vue'),
    meta: { title: '管理员登录' }
  },
  {
    path: '/admin/survey',
    name: 'AdminSurvey',
    component: () => import('../pages/admin/SurveyManage.vue'),
    meta: { title: '问卷管理', requireAuth: true }
  },
  {
    path: '/admin/survey/config/:id',
    name: 'AdminSurveyConfig',
    component: () => import('../pages/admin/SurveyConfig.vue'),
    meta: { title: '问卷配置', requireAuth: true }
  },
  {
    path: '/admin/code',
    name: 'AdminCode',
    component: () => import('../pages/admin/CodeGenerate.vue'),
    meta: { title: '生成验证码', requireAuth: true }
  },
  // 404页面
  {
    path: '*',
    name: '404',
    component: () => import('../pages/404.vue'),
    meta: { title: '页面不存在' }
  }
]

const router = new VueRouter({
  mode: 'hash', // 生产环境用hash模式，避免Nginx额外配置
  base: process.env.BASE_URL,
  routes
})

// 路由守卫：全局前置守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title || '问卷调查系统'
  // 1. 判断是否需要管理员登录
  if (to.meta.requireAuth) {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      Message.warning('请先登录管理员后台')
      next({ path: '/admin/login' })
      return
    }
  }
  // 2. 判断是否需要有效验证码
  if (to.meta.requireCode) {
    const validCode = localStorage.getItem('validCode')
    const surveyInfo = localStorage.getItem('surveyInfo')
    if (!validCode || !surveyInfo) {
      Message.warning('请先输入有效的兑换码')
      next({ path: '/verify' })
      return
    }
  }
  next()
})

export default router