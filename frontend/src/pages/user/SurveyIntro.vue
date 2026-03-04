<template>
  <Layout title="问卷介绍">
    <div class="survey-intro-page">
      <el-card class="survey-intro-card">
        <h2 class="survey-name">{{ surveyInfo.name }}</h2>
        <p class="survey-tip">请仔细阅读题目，按真实想法选择，完成后将为你生成个性化结果</p>
        <el-button
          type="primary"
          size="large"
          class="start-btn"
          @click="$router.push('/survey')"
        >
          开始答题
        </el-button>
      </el-card>
    </div>
  </Layout>
</template>

<script>
export default {
  name: 'SurveyIntro',
  data() {
    return {
      surveyInfo: {}
    }
  },
  mounted() {
    // 获取localStorage中的问卷信息
    const surveyInfo = localStorage.getItem('surveyInfo')
    if (surveyInfo) {
      this.surveyInfo = JSON.parse(surveyInfo)
    }
  }
}
</script>

<style scoped>
.survey-intro-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
}
.survey-intro-card {
  width: 100%;
  max-width: 600px;
  padding: 40px 30px !important;
  text-align: center;
}
.survey-name {
  font-size: 24px;
  font-weight: 500;
  color: #333;
  margin-bottom: 30px;
}
.survey-tip {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 40px;
  padding: 0 20px;
}
.start-btn {
  width: 200px;
  height: 50px;
  font-size: 16px;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .survey-intro-card {
    padding: 30px 20px !important;
  }
  .survey-name {
    font-size: 20px;
  }
  .survey-tip {
    font-size: 14px;
    padding: 0;
  }
  .start-btn {
    width: 180px;
    height: 44px;
  }
}
</style>