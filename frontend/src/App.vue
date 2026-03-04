<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}
a {
  text-decoration: none;
  color: #409eff;
}
ul, li {
  list-style: none;
}
/* Element-UI卡片样式优化，更年轻化 */
.el-card {
  border-radius: 12px !important;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.05) !important;
  border: none !important;
}
/* Element-UI按钮样式优化 */
.el-button {
  border-radius: 8px !important;
}
.el-button--primary {
  background-color: #409eff !important;
  border-color: #409eff !important;
}
/* Element-UI输入框样式优化 */
.el-input__inner {
  border-radius: 8px !important;
  border: 1px solid #eaeaea !important;
}
.el-input__inner:focus {
  border-color: #409eff !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1) !important;
}
/* 手机端适配：所有元素禁止缩放 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
    -webkit-text-size-adjust: 100%;
    -ms-text-size-adjust: 100%;
  }
}
</style>