<template>
  <div class="layout-container">
    <!-- 顶部导航（可选，简约设计） -->
    <div class="layout-header" v-if="showHeader">
      <h1 class="header-title">{{ title || '问卷调查系统' }}</h1>
    </div>
    <!-- 主内容区 -->
    <div class="layout-main">
      <slot />
    </div>
    <!-- 底部（可选） -->
    <div class="layout-footer" v-if="showFooter">
      <p>© 2025 问卷调查系统 | 全程不保存任何用户信息</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  props: {
    title: {
      type: String,
      default: ''
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}
.layout-header {
  height: 60px;
  line-height: 60px;
  text-align: center;
  background-color: #409eff;
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.header-title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
}
.layout-main {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}
.layout-footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #eaeaea;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .layout-header {
    height: 50px;
    line-height: 50px;
  }
  .header-title {
    font-size: 16px;
  }
  .layout-main {
    padding: 15px 10px;
  }
  .layout-footer {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
  }
}
</style>