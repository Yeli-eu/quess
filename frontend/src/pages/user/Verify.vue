<template>
  <Layout :showHeader="false" :showFooter="false">
    <div class="verify-page">
      <el-card class="verify-card">
        <h2 class="verify-title">请输入兑换码</h2>
        <el-input
          v-model="code"
          placeholder="请输入6位兑换码"
          maxlength="6"
          show-word-limit
          class="code-input"
          @keyup.enter="handleVerify"
        />
        <el-button
          type="primary"
          class="verify-btn"
          @click="handleVerify"
          :loading="loading"
        >
          进入问卷
        </el-button>
        <p class="verify-tip">兑换码可使用2次，3天内有效</p>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { verifyCode } from '../../api/user'

export default {
  name: 'Verify',
  data() {
    return {
      code: '',
      loading: false
    }
  },
  methods: {
    // 验证验证码
    async handleVerify() {
      if (!this.code) {
        this.$message.warning('请输入6位兑换码')
        return
      }
      if (this.code.length !== 6) {
        this.$message.warning('兑换码为6位，请检查后重新输入')
        return
      }
      this.loading = true
      try {
        const res = await verifyCode({ code: this.code.trim() })
        // 验证成功：存储验证码和问卷信息到localStorage
        localStorage.setItem('validCode', this.code.trim())
        localStorage.setItem('surveyInfo', JSON.stringify(res.data))
        this.$message.success('验证成功，即将进入问卷')
        // 跳问卷介绍页
        this.$router.push('/survey-intro')
      } catch (error) {
        console.error('验证码验证失败：', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.verify-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}
.verify-card {
  width: 100%;
  max-width: 500px;
  padding: 40px 30px !important;
}
.verify-title {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 30px;
}
.code-input {
  margin-bottom: 20px;
}
.verify-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
}
.verify-tip {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-top: 20px;
  margin-bottom: 0;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .verify-card {
    padding: 30px 20px !important;
  }
  .verify-title {
    font-size: 20px;
  }
  .verify-btn {
    height: 44px;
    font-size: 15px;
  }
}
</style>