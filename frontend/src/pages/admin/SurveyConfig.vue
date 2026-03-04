<template>
  <Layout :title="`问卷配置 - 问卷ID：${$route.params.id}`">
    <div class="survey-config-page">
      <!-- 操作栏 -->
      <div class="operate-bar">
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          @click="$router.back()"
        >
          返回
        </el-button>
        <el-button
          type="success"
          icon="el-icon-plus"
          @click="handleAddQuestion"
          :disabled="questionList.length >= 10"
        >
          新增题目
          <span v-if="questionList.length >= 10" style="color: #f56c6c; margin-left: 5px;">(最多10题)</span>
        </el-button>
      </div>

      <!-- 题目配置区域 -->
      <el-card class="config-card" style="margin-top: 20px;">
        <h3 class="config-title">题目配置（2-10题）</h3>
        <!-- 题目列表 -->
        <div class="question-config-list" v-if="questionList.length > 0">
          <div
            class="question-config-item"
            v-for="(question, qIndex) in questionList"
            :key="question.id"
            :class="{ 'border-primary': currentQuestionId === question.id }"
            @click="handleSelectQuestion(question.id)"
          >
            <p class="question-index">{{ qIndex + 1 }}、</p>
            <p class="question-content">{{ question.content || '未编辑题目' }}</p>
            <el-button
              type="text"
              icon="el-icon-edit"
              class="edit-btn"
              @click.stop="handleEditQuestion(question)"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              icon="el-icon-delete"
              class="delete-btn"
              @click.stop="handleDeleteQuestion(question.id)"
            >
              删除
            </el-button>
          </div>
        </div>
        <!-- 空题目提示 -->
        <div class="empty-tip" v-else>
          <el-empty description="暂无题目，请点击新增题目" />
        </div>
      </el-card>

      <!-- 选项配置区域 -->
      <el-card class="config-card" style="margin-top: 20px;" v-if="currentQuestionId">
        <h3 class="config-title">选项配置（2-4个）</h3>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="handleAddOption"
          :disabled="optionList.length >= 4"
          style="margin-bottom: 20px;"
        >
          新增选项
          <span v-if="optionList.length >= 4" style="color: #f56c6c; margin-left: 5px;">(最多4个)</span>
        </el-button>
        <!-- 选项列表 -->
        <el-table
          :data="optionList"
          border
          stripe
          style="width: 100%"
          v-loading="optionLoading"
        >
          <el-table-column
            prop="option_key"
            label="选项标识"
            align="center"
            width="100"
          />
          <el-table-column
            prop="content"
            label="选项内容"
            align="center"
          />
          <el-table-column
            label="操作"
            align="center"
            width="150"
          >
            <template #default="scope">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-edit"
                @click="handleEditOption(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="handleDeleteOption(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 空选项提示 -->
        <div class="empty-tip" v-if="optionList.length === 0 && !optionLoading">
          <el-empty description="暂无选项，请点击新增选项" />
        </div>
      </el-card>

      <!-- 结果规则配置区域 -->
      <el-card class="config-card" style="margin-top: 20px;">
        <h3 class="config-title">结果规则配置（不同选择组合匹配不同结果）</h3>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="handleAddResultRule"
          style="margin-bottom: 20px;"
        >
          新增结果规则
        </el-button>
        <!-- 结果规则列表 -->
        <el-table
          :data="resultRuleList"
          border
          stripe
          style="width: 100%"
          v-loading="resultRuleLoading"
        >
          <el-table-column
            prop="option_combination"
            label="选择组合"
            align="center"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            prop="result_name"
            label="结果名称"
            align="center"
            min-width="150"
          />
          <el-table-column
            prop="result_content"
            label="结果内容"
            align="center"
            min-width="200"
            show-overflow-tooltip
          />
          <el-table-column
            label="结果图片"
            align="center"
            width="100"
          >
            <template #default="scope">
              <el-image
                v-if="scope.row.result_image"
                :src="scope.row.result_image"
                width="60"
                height="60"
                fit="cover"
                preview-src-list="[scope.row.result_image]"
              />
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="200"
          >
            <template #default="scope">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-edit"
                @click="handleEditResultRule(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="handleDeleteResultRule(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 空结果规则提示 -->
        <div class="empty-tip" v-if="resultRuleList.length === 0 && !resultRuleLoading">
          <el-empty description="暂无结果规则，请点击新增结果规则" />
        </div>
      </el-card>
    </div>

    <!-- 题目弹框 -->
    <el-dialog
      :title="questionDialogTitle"
      :visible.sync="questionDialogVisible"
      width="500px"
      @close="handleQuestionDialogClose"
    >
      <el-form
        ref="questionFormRef"
        :model="questionForm"
        :rules="questionRules"
        label-width="80px"
      >
        <el-form-item label="题目内容" prop="content">
          <el-input
            v-model="questionForm.content"
            type="textarea"
            rows="3"
            placeholder="请输入题目内容（2-50字）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="questionDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="questionDialogLoading"
          @click="handleSaveQuestion"
        >
          确认
        </el-button>
      </template>
    </el-dialog>

    <!-- 选项弹框 -->
    <el-dialog
      :title="optionDialogTitle"
      :visible.sync="optionDialogVisible"
      width="400px"
      @close="handleOptionDialogClose"
    >
      <el-form
        ref="optionFormRef"
        :model="optionForm"
        :rules="optionRules"
        label-width="80px"
      >
        <el-form-item label="选项内容" prop="content">
          <el-input v-model="optionForm.content" placeholder="请输入选项内容（2-20字）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="optionDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="optionDialogLoading"
          @click="handleSaveOption"
        >
          确认
        </el-button>
      </template>
    </el-dialog>

    <!-- 结果规则弹框 -->
    <el-dialog
      :title="resultRuleDialogTitle"
      :visible.sync="resultRuleDialogVisible"
      width="600px"
      @close="handleResultRuleDialogClose"
    >
      <el-form
        ref="resultRuleFormRef"
        :model="resultRuleForm"
        :rules="resultRuleRules"
        label-width="100px"
      >
        <el-form-item label="选择组合" prop="option_combination">
          <el-input
            v-model="resultRuleForm.option_combination"
            placeholder="例：A1,B2,C3（题目1选A，题目2选B，题目3选C）"
            show-word-limit
            maxlength="50"
          />
          <div class="tip-text">提示：按「题目索引+选项标识」组合，多个组合用英文逗号分隔</div>
        </el-form-item>
        <el-form-item label="结果名称" prop="result_name">
          <el-input
            v-model="resultRuleForm.result_name"
            placeholder="请输入结果名称（2-20字）"
            show-word-limit
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="结果内容" prop="result_content">
          <el-input
            v-model="resultRuleForm.result_content"
            type="textarea"
            rows="4"
            placeholder="请输入结果内容（2-500字）"
            show-word-limit
            maxlength="500"
          />
        </el-form-item>
        <el-form-item label="结果图片">
          <UploadImage
            :image-url="resultRuleForm.result_image"
            @upload-success="handleImageUpload"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resultRuleDialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="resultRuleDialogLoading"
          @click="handleSaveResultRule"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
  </Layout>
</template>

<script>
import {
  getQuestionList, addQuestion, editQuestion, deleteQuestion,
  getOptionList, addOption, editOption, deleteOption,
  getResultRuleList, addResultRule, editResultRule, deleteResultRule
} from '../../api/admin'

export default {
  name: 'SurveyConfig',
  data() {
    return {
      surveyId: this.$route.params.id, // 问卷ID
      // 题目相关
      questionList: [],
      currentQuestionId: '', // 当前选中的题目ID
      questionDialogVisible: false,
      questionDialogTitle: '新增题目',
      questionDialogLoading: false,
      questionForm: {
        id: '',
        survey_id: this.$route.params.id,
        content: ''
      },
      questionRules: {
        content: [
          { required: true, message: '请输入题目内容', trigger: 'blur' },
          { min: 2, max: 50, message: '题目内容长度为2-50个字符', trigger: 'blur' }
        ]
      },
      // 选项相关
      optionList: [],
      optionLoading: false,
      optionDialogVisible: false,
      optionDialogTitle: '新增选项',
      optionDialogLoading: false,
      optionForm: {
        id: '',
        question_id: '',
        content: '',
        option_key: ''
      },
      optionRules: {
        content: [
          { required: true, message: '请输入选项内容', trigger: 'blur' },
          { min: 2, max: 20, message: '选项内容长度为2-20个字符', trigger: 'blur' }
        ]
      },
      // 结果规则相关
      resultRuleList: [],
      resultRuleLoading: false,
      resultRuleDialogVisible: false,
      resultRuleDialogTitle: '新增结果规则',
      resultRuleDialogLoading: false,
      resultRuleForm: {
        id: '',
        survey_id: this.$route.params.id,
        option_combination: '',
        result_name: '',
        result_content: '',
        result_image: ''
      },
      resultRuleRules: {
        option_combination: [
          { required: true, message: '请输入选择组合', trigger: 'blur' },
          { min: 2, max: 50, message: '选择组合长度为2-50个字符', trigger: 'blur' }
        ],
        result_name: [
          { required: true, message: '请输入结果名称', trigger: 'blur' },
          { min: 2, max: 20, message: '结果名称长度为2-20个字符', trigger: 'blur' }
        ],
        result_content: [
          { required: true, message: '请输入结果内容', trigger: 'blur' },
          { min: 2, max: 500, message: '结果内容长度为2-500个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 获取题目列表
    this.getQuestionListData()
    // 获取结果规则列表
    this.getResultRuleListData()
  },
  methods: {
    // ---------------------- 题目相关方法 ----------------------
    // 获取题目列表
    async getQuestionListData() {
      try {
        const res = await getQuestionList({ surveyId: this.surveyId })
        this.questionList = res.data
      } catch (error) {
        console.error('获取题目列表失败：', error)
      }
    },
    // 新增题目
    handleAddQuestion() {
      this.questionDialogTitle = '新增题目'
      this.questionForm = {
        id: '',
        survey_id: this.surveyId,
        content: ''
      }
      this.questionDialogVisible = true
      this.$nextTick(() => {
        this.$refs.questionFormRef.resetFields()
      })
    },
    // 编辑题目
    handleEditQuestion(row) {
      this.questionDialogTitle = '编辑题目'
      this.questionForm = { ...row }
      this.questionDialogVisible = true
      this.$nextTick(() => {
        this.$refs.questionFormRef.resetFields()
      })
    },
    // 保存题目
    async handleSaveQuestion() {
      this.$refs.questionFormRef.validate(async (valid) => {
        if (!valid) return
        this.questionDialogLoading = true
        try {
          if (this.questionForm.id) {
            await editQuestion(this.questionForm)
            this.$message.success('题目编辑成功')
          } else {
            await addQuestion(this.questionForm)
            this.$message.success('题目新增成功')
          }
          this.questionDialogVisible = false
          this.getQuestionListData()
        } catch (error) {
          console.error('保存题目失败：', error)
        } finally {
          this.questionDialogLoading = false
        }
      })
    },
    // 删除题目
    async handleDeleteQuestion(id) {
      this.$confirm('确定要删除该题目吗？删除后将连带删除该题目的所有选项', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await deleteQuestion({ id })
          this.$message.success('题目删除成功')
          this.getQuestionListData()
          // 如果删除的是当前选中的题目，清空选中状态和选项列表
          if (this.currentQuestionId === id) {
            this.currentQuestionId = ''
            this.optionList = []
          }
        } catch (error) {
          console.error('删除题目失败：', error)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 选择题目，获取该题目的选项
    handleSelectQuestion(id) {
      this.currentQuestionId = id
      this.getOptionListData(id)
    },
    // 关闭题目弹框
    handleQuestionDialogClose() {
      this.questionForm = { id: '', survey_id: this.surveyId, content: '' }
      this.$refs.questionFormRef.resetFields()
    },

    // ---------------------- 选项相关方法 ----------------------
    // 获取选项列表
    async getOptionListData(questionId) {
      this.optionLoading = true
      try {
        const res = await getOptionList({ questionId })
        this.optionList = res.data
      } catch (error) {
        console.error('获取选项列表失败：', error)
      } finally {
        this.optionLoading = false
      }
    },
    // 新增选项
    handleAddOption() {
      this.optionDialogTitle = '新增选项'
      this.optionForm = {
        id: '',
        question_id: this.currentQuestionId,
        content: '',
        option_key: ''
      }
      this.optionDialogVisible = true
      this.$nextTick(() => {
        this.$refs.optionFormRef.resetFields()
      })
    },
    // 编辑选项
    handleEditOption(row) {
      this.optionDialogTitle = '编辑选项'
      this.optionForm = { ...row }
      this.optionDialogVisible = true
      this.$nextTick(() => {
        this.$refs.optionFormRef.resetFields()
      })
    },
    // 保存选项
    async handleSaveOption() {
      this.$refs.optionFormRef.validate(async (valid) => {
        if (!valid) return
        this.optionDialogLoading = true
        try {
          if (this.optionForm.id) {
            await editOption(this.optionForm)
            this.$message.success('选项编辑成功')
          } else {
            // 新增选项，自动生成选项标识（A、B、C、D）
            const keyList = ['A', 'B', 'C', 'D']
            this.optionForm.option_key = keyList[this.optionList.length]
            await addOption(this.optionForm)
            this.$message.success('选项新增成功')
          }
          this.optionDialogVisible = false
          this.getOptionListData(this.currentQuestionId)
        } catch (error) {
          console.error('保存选项失败：', error)
        } finally {
          this.optionDialogLoading = false
        }
      })
    },
    // 删除选项
    async handleDeleteOption(id) {
      this.$confirm('确定要删除该选项吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await deleteOption({ id })
          this.$message.success('选项删除成功')
          this.getOptionListData(this.currentQuestionId)
        } catch (error) {
          console.error('删除选项失败：', error)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 关闭选项弹框
    handleOptionDialogClose() {
      this.optionForm = { id: '', question_id: this.currentQuestionId, content: '', option_key: '' }
      this.$refs.optionFormRef.resetFields()
    },

    // ---------------------- 结果规则相关方法 ----------------------
    // 获取结果规则列表
    async getResultRuleListData() {
      this.resultRuleLoading = true
      try {
        const res = await getResultRuleList({ surveyId: this.surveyId })
        this.resultRuleList = res.data
      } catch (error) {
        console.error('获取结果规则列表失败：', error)
      } finally {
        this.resultRuleLoading = false
      }
    },
    // 新增结果规则
    handleAddResultRule() {
      this.resultRuleDialogTitle = '新增结果规则'
      this.resultRuleForm = {
        id: '',
        survey_id: this.surveyId,
        option_combination: '',
        result_name: '',
        result_content: '',
        result_image: ''
      }
      this.resultRuleDialogVisible = true
      this.$nextTick(() => {
        this.$refs.resultRuleFormRef.resetFields()
      })
    },
    // 编辑结果规则
    handleEditResultRule(row) {
      this.resultRuleDialogTitle = '编辑结果规则'
      this.resultRuleForm = { ...row }
      this.resultRuleDialogVisible = true
      this.$nextTick(() => {
        this.$refs.resultRuleFormRef.resetFields()
      })
    },
    // 保存结果规则
    async handleSaveResultRule() {
      this.$refs.resultRuleFormRef.validate(async (valid) => {
        if (!valid) return
        this.resultRuleDialogLoading = true
        try {
          if (this.resultRuleForm.id) {
            await editResultRule(this.resultRuleForm)
            this.$message.success('结果规则编辑成功')
          } else {
            await addResultRule(this.resultRuleForm)
            this.$message.success('结果规则新增成功')
          }
          this.resultRuleDialogVisible = false
          this.getResultRuleListData()
        } catch (error) {
          console.error('保存结果规则失败：', error)
        } finally {
          this.resultRuleDialogLoading = false
        }
      })
    },
    // 删除结果规则
    async handleDeleteResultRule(id) {
      this.$confirm('确定要删除该结果规则吗？', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await deleteResultRule({ id })
          this.$message.success('结果规则删除成功')
          this.getResultRuleListData()
        } catch (error) {
          console.error('删除结果规则失败：', error)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 图片上传成功，接收图片地址
    handleImageUpload(imageUrl) {
      this.resultRuleForm.result_image = imageUrl
    },
    // 关闭结果规则弹框
    handleResultRuleDialogClose() {
      this.resultRuleForm = {
        id: '',
        survey_id: this.surveyId,
        option_combination: '',
        result_name: '',
        result_content: '',
        result_image: ''
      }
      this.$refs.resultRuleFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.survey-config-page {
  padding: 10px 0;
}
.operate-bar {
  margin-bottom: 20px;
}
.config-card {
  padding: 20px !important;
}
.config-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
/* 题目配置项 */
.question-config-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.question-config-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 2px solid #eaeaea;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}
.question-config-item:hover {
  border-color: #c6e2ff;
  background-color: #f5faff;
}
.question-config-item.border-primary {
  border-color: #409eff;
  background-color: #f5faff;
}
.question-index {
  font-weight: 600;
  color: #409eff;
  margin-right: 10px;
  margin-bottom: 0;
}
.question-content {
  flex: 1;
  margin-bottom: 0;
  color: #333;
}
.edit-btn {
  color: #67c23a !important;
  margin-right: 10px;
}
.delete-btn {
  color: #f56c6c !important;
}
/* 空提示 */
.empty-tip {
  padding: 30px 0;
  text-align: center;
}
/* 结果规则弹框提示 */
.tip-text {
  font-size: 12px;
  color: #999;
  margin-top: 5px;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .operate-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .operate-bar .el-button {
    width: 100%;
  }
  .question-config-item {
    padding: 10px;
  }
  .question-index {
    font-size: 14px;
  }
  .question-content {
    font-size: 14px;
  }
}
</style>