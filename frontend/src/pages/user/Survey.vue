<template>
  <Layout title="填写问卷">
    <div class="survey-page">
      <el-card class="survey-card">
        <h3 class="survey-title">{{ surveyInfo.name }}</h3>
        <!-- 问卷题目列表 -->
        <div class="question-list" v-if="questionList.length > 0">
          <div class="question-item" v-for="(question, qIndex) in questionList" :key="question.id">
            <p class="question-content">{{ qIndex + 1 }}、{{ question.content }}</p>
            <el-radio-group
              v-model="answer[question.id]"
              class="option-group"
              @change="handleOptionChange"
            >
              <el-radio
                v-for="option in question.options"
                :key="option.id"
                :label="option.option_key"
                class="option-item"
              >
                {{ option.option_key }}、{{ option.content }}
              </el-radio>
            </el-radio-group>
          </div>
        </div>
        <!-- 加载中 -->
        <div class="loading" v-else>
          <el-loading-spinner />
          <p>加载问卷中...</p>
        </div>
        <!-- 提交按钮 -->
        <el-button
          type="primary"
          size="large"
          class="submit-btn"
          :disabled="!isAllAnswered"
          :loading="loading"
          @click="handleSubmit"
        >
          提交结果
        </el-button>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { getSurvey, matchResult } from '../../api/user'

export default {
  name: 'Survey',
  data() {
    return {
      surveyInfo: {},
      questionList: [], // 题目列表（含选项）
      answer: {}, // 用户答题结果：{questionId: optionKey}
      isAllAnswered: false, // 是否全部答题
      loading: false
    }
  },
  mounted() {
    // 获取问卷信息和问卷详情
    this.getSurveyInfo()
    this.getSurveyDetail()
  },
  methods: {
    // 获取localStorage中的问卷信息
    getSurveyInfo() {
      const surveyInfo = localStorage.getItem('surveyInfo')
      if (surveyInfo) {
        this.surveyInfo = JSON.parse(surveyInfo)
      }
    },
    // 获取问卷详情（题目+选项）
    async getSurveyDetail() {
      try {
        const res = await getSurvey({ surveyId: this.surveyInfo.id })
        this.questionList = res.data
        // 初始化答题结果对象
        this.questionList.forEach(question => {
          this.$set(this.answer, question.id, '')
        })
      } catch (error) {
        console.error('获取问卷详情失败：', error)
        this.$router.push('/verify')
      }
    },
    // 选项改变，判断是否全部答题
    handleOptionChange() {
      // 检查所有题目是否都有选择
      this.isAllAnswered = Object.values(this.answer).every(val => val !== '')
    },
    // 提交答题结果，匹配个性化结果
    async handleSubmit() {
      this.loading = true
      try {
        // 构造提交参数：surveyId + 答题结果
        const submitData = {
          surveyId: this.surveyInfo.id,
          answer: this.answer
        }
        const res = await matchResult(submitData)
        // 临时存储结果到localStorage，跳结果页（不存储答题数据）
        localStorage.setItem('surveyResult', JSON.stringify(res.data))
        this.$router.push('/result')
      } catch (error) {
        console.error('匹配结果失败：', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.survey-page {
  padding: 20px 0;
}
.survey-card {
  padding: 30px !important;
}
.survey-title {
  font-size: 20px;
  font-weight: 500;
  color: #333;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}
.question-list {
  margin-bottom: 40px;
}
.question-item {
  margin-bottom: 30px;
}
.question-content {
  font-size: 16px;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.6;
}
.option-group {
  padding-left: 10px;
}
.option-item {
  display: block !important;
  margin-bottom: 10px !important;
  font-size: 15px;
  color: #666;
}
.submit-btn {
  display: block;
  margin: 0 auto;
  width: 200px;
  height: 50px;
  font-size: 16px;
}
.loading {
  text-align: center;
  padding: 50px 0;
  color: #666;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .survey-card {
    padding: 20px 15px !important;
  }
  .survey-title {
    font-size: 18px;
  }
  .question-content {
    font-size: 15px;
  }
  .option-item {
    font-size: 14px;
  }
  .submit-btn {
    width: 180px;
    height: 44px;
  }
}
</style>