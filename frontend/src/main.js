import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './api'
import Layout from './components/Layout'
import UploadImage from './components/UploadImage'
import ResultImage from './components/ResultImage'

// 全局注册Element-UI
Vue.use(ElementUI, {
  size: 'medium' // 组件默认大小，适配多端
})
// 全局注册公共组件
Vue.component('Layout', Layout)
Vue.component('UploadImage', UploadImage)
Vue.component('ResultImage', ResultImage)
// 全局挂载axios
Vue.prototype.$axios = axios
// 全局配置Element-UI消息提示
Vue.prototype.$message.config({
  duration: 2000,
  showClose: true
})
// 全局配置Element-UI弹框
Vue.prototype.$confirm.config({
  confirmButtonText: '确认',
  cancelButtonText: '取消'
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')