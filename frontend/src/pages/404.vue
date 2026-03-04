<template>
  <Layout title="页面不存在" :showFooter="false">
    <div class="not-found">
      <el-card class="not-found-card">
        <h1 class="not-found-title">404</h1>
        <p class="not-found-desc">你访问的页面不存在~</p>
        <el-button type="primary" @click="$router.push('/verify')">返回首页</el-button>
      </el-card>
    </div>
  </Layout>
</template>

<script>
export default {
  name: 'NotFound'
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.not-found-card {
  width: 100%;
  max-width: 400px;
  text-align: center;
  padding: 40px 20px !important;
}
.not-found-title {
  font-size: 80px;
  color: #409eff;
  margin-bottom: 20px;
}
.not-found-desc {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}
</style>