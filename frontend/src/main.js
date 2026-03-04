import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI, { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from './api'
import Layout from './components/Layout'
import UploadImage from './components/UploadImage'
import ResultImage from './components/ResultImage'

// 全局注册 Element-UI，设置组件默认大小
Vue.use(ElementUI, { size: 'medium' })

// 全局注册常用组件
Vue.component('Layout', Layout)
Vue.component('UploadImage', UploadImage)
Vue.component('ResultImage', ResultImage)

// 全局挂载 axios
Vue.prototype.$axios = axios

// --- 修复点：给 $message 提供一个带默认配置的封装 ---
// 这样既保留了 this.$message(...) 的调用方式，也给出了默认的 duration / showClose
Vue.prototype.$message = function (options) {
  if (typeof options === 'string') {
    options = { message: options }
  }
  // 合并默认项
  return Message(Object.assign({ duration: 2000, showClose: true }, options))
}
// 保留常用快捷方法（success/error/info/warning）
Vue.prototype.$message.success = (msg) => Message({ message: msg, type: 'success', duration: 2000, showClose: true })
Vue.prototype.$message.error = (msg) => Message({ message: msg, type: 'error', duration: 2000, showClose: true })
Vue.prototype.$message.info = (msg) => Message({ message: msg, type: 'info', duration: 2000, showClose: true })
Vue.prototype.$message.warning = (msg) => Message({ message: msg, type: 'warning', duration: 2000, showClose: true })
Vue.prototype.$message.closeAll = Message.closeAll

// --- confirm/alert 封装（Element UI 的 MessageBox 提供 confirm/alert） ---
Vue.prototype.$confirm = function (message, title = '提示', options = {}) {
  return MessageBox.confirm(message, title, Object.assign({ confirmButtonText: '确认', cancelButtonText: '取消' }, options))
}
Vue.prototype.$alert = function (message, title = '提示', options = {}) {
  return MessageBox.alert(message, title, Object.assign({ confirmButtonText: '确认' }, options))
}
Vue.prototype.$messageBox = MessageBox

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')