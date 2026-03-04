<template>
  <Layout title="问卷管理">
    <div class="survey-manage-page">
      <!-- 操作栏 -->
      <div class="operate-bar">
        <el-button type="primary" icon="el-icon-plus" @click="handleAddSurvey">
          新建问卷
        </el-button>
        <el-button
          type="success"
          icon="el-icon-s-tools"
          @click="$router.push('/admin/code')"
        >
          生成验证码
        </el-button>
        <el-button
          type="danger"
          icon="el-icon-logout"
          @click="handleLogout"
          style="float: right"
        >
          退出登录
        </el-button>
      </div>
      <!-- 问卷列表 -->
      <el-card class="survey-list-card" style="margin-top: 20px;">
        <el-table
          :data="surveyList"
          border
          stripe
          style="width: 100%"
          v-loading="loading"
        >
          <el-table-column
            prop="id"
            label="问卷ID"
            align="center"
            width="80"
          />
          <el-table-column
            prop="name"
            label="问卷名称"
            align="center"
            min-width="200"
          />
          <el-table-column
            label="操作"
            align="center"
            width="200"
            fixed="right"
          >
            <template #default="scope">
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-setting"
                @click="handleConfigSurvey(scope.row.id)"
              >
                配置
              </el-button>
              <el-button
                type="success"
                size="mini"
                icon="el-icon-edit"
                @click="handleEditSurvey(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="handleDeleteSurvey(scope.row.id)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 空数据提示 -->
        <div class="empty-tip" v-if="surveyList.length === 0 && !loading">
          <el-empty description="暂无问卷，请点击新建问卷" />
        </div>
      </el-card>
    </div>

    <!-- 新建/编辑问卷弹框 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="400px"
      @close="handleDialogClose"
    >
      <el-form
        ref="surveyFormRef"
        :model="surveyForm"
        :rules="surveyRules"
        label-width="80px"
      >
        <el-form-item label="问卷名称" prop="name">
          <el-input v-model="surveyForm.name" placeholder="请输入问卷名称" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          :loading="dialogLoading"
          @click="handleSaveSurvey"
        >
          确认
        </el-button>
      </template>
    </el-dialog>
  </Layout>
</template>

<script>
import { getSurveyList, addSurvey, editSurvey, deleteSurvey } from '../../api/admin'

export default {
  name: 'SurveyManage',
  data() {
    return {
      surveyList: [],
      loading: false,
      // 弹框相关
      dialogVisible: false,
      dialogTitle: '新建问卷',
      dialogLoading: false,
      surveyForm: {
        id: '',
        name: ''
      },
      surveyRules: {
        name: [
          { required: true, message: '请输入问卷名称', trigger: 'blur' },
          { min: 2, max: 50, message: '问卷名称长度为2-50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    // 获取问卷列表
    this.getSurveyListData()
  },
  methods: {
    // 获取问卷列表
    async getSurveyListData() {
      this.loading = true
      try {
        const res = await getSurveyList()
        this.surveyList = res.data
      } catch (error) {
        console.error('获取问卷列表失败：', error)
      } finally {
        this.loading = false
      }
    },
    // 新建问卷
    handleAddSurvey() {
      this.dialogTitle = '新建问卷'
      this.surveyForm = { id: '', name: '' }
      this.dialogVisible = true
      // 重置表单校验
      this.$nextTick(() => {
        this.$refs.surveyFormRef.resetFields()
      })
    },
    // 编辑问卷
    handleEditSurvey(row) {
      this.dialogTitle = '编辑问卷'
      this.surveyForm = { ...row }
      this.dialogVisible = true
      // 重置表单校验
      this.$nextTick(() => {
        this.$refs.surveyFormRef.resetFields()
      })
    },
    // 保存问卷（新建/编辑）
    async handleSaveSurvey() {
      // 表单校验
      this.$refs.surveyFormRef.validate(async (valid) => {
        if (!valid) return
        this.dialogLoading = true
        try {
          if (this.surveyForm.id) {
            // 编辑问卷
            await editSurvey(this.surveyForm)
            this.$message.success('问卷编辑成功')
          } else {
            // 新建问卷
            await addSurvey(this.surveyForm)
            this.$message.success('问卷新建成功')
          }
          // 关闭弹框，刷新列表
          this.dialogVisible = false
          this.getSurveyListData()
        } catch (error) {
          console.error('保存问卷失败：', error)
        } finally {
          this.dialogLoading = false
        }
      })
    },
    // 删除问卷
    async handleDeleteSurvey(id) {
      this.$confirm('确定要删除该问卷吗？删除后将连带删除题目、选项和结果规则', '提示', {
        type: 'warning'
      }).then(async () => {
        try {
          await deleteSurvey({ id })
          this.$message.success('问卷删除成功')
          this.getSurveyListData()
        } catch (error) {
          console.error('删除问卷失败：', error)
        }
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    // 配置问卷（跳题目/选项/结果配置页）
    handleConfigSurvey(id) {
      this.$router.push(`/admin/survey/config/${id}`)
    },
    // 退出登录
    handleLogout() {
      this.$confirm('确定要退出管理员后台吗？', '提示', {
        type: 'info'
      }).then(() => {
        // 清空localStorage中的token
        localStorage.removeItem('adminToken')
        this.$message.success('退出成功')
        // 跳管理员登录页
        this.$router.push('/admin/login')
      }).catch(() => {
        this.$message.info('已取消退出')
      })
    },
    // 关闭弹框，重置表单
    handleDialogClose() {
      this.surveyForm = { id: '', name: '' }
      this.$refs.surveyFormRef.resetFields()
    }
  }
}
</script>

<style scoped>
.survey-manage-page {
  padding: 10px 0;
}
.operate-bar {
  margin-bottom: 20px;
}
.survey-list-card {
  padding: 20px !important;
}
.empty-tip {
  padding: 50px 0;
  text-align: center;
}
/* 手机端适配 */
@media (max-width: 768px) {
  .operate-bar {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .operate-bar .el-button {
    float: none !important;
    width: 100%;
  }
}
</style>