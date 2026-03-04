<template>
  <el-upload
    class="upload-image"
    :action="uploadUrl"
    :headers="uploadHeaders"
    :file-list="fileList"
    :on-success="handleSuccess"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-upload="beforeUpload"
    list-type="picture-card"
    :limit="1"
    :on-exceed="handleExceed"
  >
    <i class="el-icon-plus" />
  </el-upload>
  <!-- 图片预览弹框 -->
  <el-dialog :visible.sync="previewVisible" title="图片预览" width="80%">
    <img :src="previewImage" alt="预览" class="preview-img" />
  </el-dialog>
</template>

<script>
export default {
  name: 'UploadImage',
  props: {
    // 已上传的图片地址
    imageUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      uploadUrl: 'http://localhost:3001/api/admin/upload-image', // 图片上传接口
      uploadHeaders: {
        Authorization: `Bearer ${localStorage.getItem('adminToken')}`
      },
      fileList: [],
      previewVisible: false,
      previewImage: ''
    }
  },
  watch: {
    // 监听父组件传的图片地址，初始化文件列表
    imageUrl(newVal) {
      if (newVal) {
        this.fileList = [{
          name: 'result-image',
          url: newVal
        }]
      } else {
        this.fileList = []
      }
    }
  },
  mounted() {
    // 初始化文件列表
    if (this.imageUrl) {
      this.fileList = [{
        name: 'result-image',
        url: this.imageUrl
      }]
    }
  },
  methods: {
    // 上传成功
    handleSuccess(res) {
      this.$message.success('图片上传成功')
      // 向父组件传递图片地址
      this.$emit('upload-success', res.data.imageUrl)
    },
    // 移除图片
    handleRemove() {
      this.$emit('upload-success', '')
    },
    // 预览图片
    handlePreview(file) {
      this.previewImage = file.url
      this.previewVisible = true
    },
    // 上传前校验（格式+大小）
    beforeUpload(file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isImage) {
        this.$message.error('请上传图片格式文件！')
        return false
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB！')
        return false
      }
      return true
    },
    // 超出文件数量限制
    handleExceed() {
      this.$message.warning('只能上传一张图片！')
    }
  }
}
</script>

<style scoped>
.upload-image {
  margin: 10px 0;
}
.preview-img {
  width: 100%;
  height: auto;
}
</style>