<template>
  <Layout :showHeader="false" :showFooter="false">
    <div class="admin-login-page">
      <el-card class="admin-login-card">
        <h2 class="login-title">管理员后台</h2>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          label-width="80px"
        >
          <el-form-item label="账号" prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入管理员账号" />
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入管理员密码"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>
          <el-form-item class="login-btn-item">
            <el-button
              type="primary"
              class="login-btn"
              :loading="loading"
              @click="handleLogin"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { adminLogin } from '../../api/admin'

export default {
  name: 'AdminLogin',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    // 管理员登录
    async handleLogin() {
      // 表单校验
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        this.loading = true
        try {
          const res = await adminLogin(this.loginForm)
          // 登录成功：存储token到localStorage
          localStorage.setItem('adminToken', res.data.token)
          this.$message.success('登录成功，即将进入后台')
          // 跳问卷管理页
          this.$router.push('/admin/survey')
        } catch (error) {
          console.error('管理员登录失败：', error)
        } finally {
          this.loading = false
        }
      })
    }
  }
}
</script>

<style scoped>
.admin-login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
}
.admin-login-card {
  width: 100%;
  max-width: 450px;
  padding: 40px 30px !important;
}
.login-title {
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 30px;
}
.login-form {
  margin-top: 20px;
}
.login-btn-item {
  text-align: center;
  margin-bottom: 0;
}
.login-btn {
  width: 80%;
  height: 48px;
  font-size: 16px;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .admin-login-card {
    padding: 30px 20px !important;
  }
  .login-title {
    font-size: 20px;
  }
  .login-btn {
    height: 44px;
    font-size: 15px;
  }
}
</style>