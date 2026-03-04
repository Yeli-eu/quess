<template>
  <Layout title="问卷结果">
    <div class="result-page">
      <el-card class="result-card">
        <!-- 结果名称 -->
        <h2 class="result-name">{{ resultInfo.resultName }}</h2>
        <!-- 结果图片 -->
        <ResultImage :image-url="resultInfo.resultImage" />
        <!-- 结果内容 -->
        <div class="result-content" v-html="resultInfo.resultContent"></div>
        <!-- 重新测试按钮 -->
        <el-button
          type="primary"
          size="large"
          class="retest-btn"
          @click="handleRetest"
        >
          重新测试
        </el-button>
        <!-- 提示语 -->
        <p class="result-tip">我们不会保存你的任何信息，请截图保存结果哟~</p>
      </el-card>
    </div>
  </Layout>
</template>

<script>
export default {
  name: 'Result',
  data() {
    return {
      resultInfo: {}
    }
  },
  mounted() {
    // 获取localStorage中的结果信息
    const resultInfo = localStorage.getItem('surveyResult')
    if (resultInfo) {
      this.resultInfo = JSON.parse(resultInfo)
    } else {
      this.$message.warning('结果不存在，请重新答题')
      this.$router.push('/survey')
    }
  },
  methods: {
    // 重新测试：清空localStorage，跳验证码页
    handleRetest() {
      this.$confirm('确定要重新测试吗？将清空当前结果，需重新输入兑换码', '提示', {
        type: 'info'
      }).then(() => {
        // 清空localStorage中的验证码、问卷信息、结果
        localStorage.removeItem('validCode')
        localStorage.removeItem('surveyInfo')
        localStorage.removeItem('surveyResult')
        this.$router.push('/verify')
      }).catch(() => {
        this.$message.info('已取消重新测试')
      })
    }
  }
}
</script>

<style scoped>
.result-page {
  padding: 20px 0;
}
.result-card {
  padding: 40px 30px !important;
  text-align: center;
}
.result-name {
  font-size: 28px;
  font-weight: 600;
  color: #409eff;
  margin-bottom: 20px;
}
.result-content {
  font-size: 16px;
  color: #333;
  line-height: 2;
  text-align: left;
  margin: 20px 0;
  white-space: pre-line;
}
.retest-btn {
  width: 200px;
  height: 50px;
  font-size: 16px;
  margin: 20px 0;
}
.result-tip {
  font-size: 14px;
  color: #999;
  margin-bottom: 0;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .result-card {
    padding: 30px 20px !important;
  }
  .result-name {
    font-size: 24px;
  }
  .result-content {
    font-size: 15px;
  }
  .retest-btn {
    width: 180px;
    height: 44px;
  }
}
</style>