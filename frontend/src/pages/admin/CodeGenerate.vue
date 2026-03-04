<template>
  <Layout title="生成验证码">
    <div class="code-generate-page">
      <el-card class="generate-card" style="max-width: 800px; margin: 0 auto;">
        <h3 class="generate-title">生成问卷兑换码</h3>
        <el-form
          ref="generateFormRef"
          :model="generateForm"
          :rules="generateRules"
          label-width="100px"
          class="generate-form"
        >
          <el-form-item label="选择绑定问卷" prop="surveyId">
            <el-select
              v-model="generateForm.surveyId"
              placeholder="请选择要绑定的问卷"
              clearable
              style="width: 100%;"
            >
              <el-option
                v-for="survey in surveyList"
                :key="survey.id"
                :label="survey.name"
                :value="survey.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="large"
              icon="el-icon-generate"
              :loading="loading"
              @click="handleGenerateCode"
            >
              生成兑换码
            </el-button>
            <el-button
              size="large"
              icon="el-icon-generate"
              :loading="loading"
              @click="goBack"
            >
              返回管理首页
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 生成结果 -->
        <div class="generate-result" v-if="generateResult">
          <h4 class="result-title">生成成功</h4>
          <el-divider />
          <el-form label-width="80px" class="result-form">
            <el-form-item label="绑定问卷">
              {{ surveyList.find(item => item.id === generateForm.surveyId)?.name || '未知' }}
            </el-form-item>
            <el-form-item label="兑换码">
              <el-tag type="primary" size="large">{{ generateResult.code }}</el-tag>
            </el-form-item>
            <el-form-item label="过期时间">
              {{ generateResult.expireTime }}
            </el-form-item>
          </el-form>
          <el-divider />
          <h4 class="copy-title">可复制文案（含用户时区问候语）</h4>
          <el-input
            v-model="generateResult.copyText"
            type="textarea"
            rows="10"
            readonly
            class="copy-textarea"
          />
          <el-button
            type="success"
            icon="el-icon-copy-document"
            @click="handleCopy"
            style="margin-top: 10px;"
          >
            一键复制文案
          </el-button>
        </div>
      </el-card>
    </div>
  </Layout>
</template>

<script>
import { getSurveyList, generateCode } from '../../api/admin'
import { Message } from 'element-ui'

export default {
  name: 'CodeGenerate',
  data() {
    return {
      surveyList: [], // 问卷列表
      loading: false,
      generateForm: {
        surveyId: ''
      },
      generateRules: {
        surveyId: [
          { required: true, message: '请选择绑定的问卷', trigger: 'change' }
        ],
      },
      generateResult: null // 生成结果：code/expireTime/copyText
    }
  },
  mounted() {
    // 获取问卷列表
    this.getSurveyListData()
  },
  methods: {
    // 获取问卷列表
    async getSurveyListData() {
      try {
        const res = await getSurveyList()
        this.surveyList = res.data
        if (this.surveyList.length === 0) {
          Message.warning('暂无问卷，请先创建问卷再生成兑换码')
        }
      } catch (error) {
        console.error('获取问卷列表失败：', error)
      }
    },
    // 生成验证码
    async handleGenerateCode() {
      this.$refs.generateFormRef.validate(async (valid) => {
        if (!valid) return
        this.loading = true
        try {
          const res = await generateCode({ surveyId: this.generateForm.surveyId })
          this.generateResult = res.data
          this.$message.success('兑换码生成成功')
        } catch (error) {
          console.error('生成兑换码失败：', error)
        } finally {
          this.loading = false
        }
      })
    },
    // 一键复制文案
    handleCopy() {
      // 创建临时文本框
      const input = document.createElement('input')
      input.value = this.generateResult.copyText
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      this.$message.success('文案复制成功')
    },
    goBack() {
      this.$router.push('/admin/survey');
    }
  }
}
</script>

<style scoped>
.code-generate-page {
  padding: 20px 0;
}
.generate-card {
  padding: 30px !important;
}
.generate-title {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
.generate-form {
  margin-bottom: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}
.generate-result {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}
.result-title {
  font-size: 16px;
  font-weight: 500;
  color: #67c23a;
  margin-bottom: 15px;
}
.result-form {
  margin-bottom: 20px;
}
.copy-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 15px;
}
.copy-textarea {
  width: 100%;
  border-radius: 8px;
  background-color: #f5f7fa;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .generate-card {
    padding: 20px 15px !important;
  }
  .generate-title {
    font-size: 16px;
  }
  .generate-form {
    width: 100%;
  }
}
</style>