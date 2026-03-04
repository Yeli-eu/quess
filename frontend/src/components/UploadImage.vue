<template>
  <!-- 修复：唯一根元素 -->
  <div class="upload-image-container">
    <el-upload
      class="upload-image"
      :action="uploadUrl"
      :headers="uploadHeaders"
      :file-list="fileList"
      :on-success="handleSuccess"
      :on-error="handleError"  
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :limit="1"
      :on-exceed="handleExceed"
      :disabled="disabled" 
      list-type="picture-card"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <!-- 图片预览弹框 -->
    <el-dialog :visible.sync="previewVisible" title="图片预览" width="80%">
      <!-- 优化：图片默认图，防止破损 -->
      <img 
        :src="previewImage || 'https://img.icons8.com/fluent/200/000000/picture.png'" 
        alt="预览" 
        class="preview-img" 
      />
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImage',
  props: {
    // 已上传的图片地址
    imageUrl: {
      type: String,
      default: ''
    },
    // 优化：新增props，支持父组件禁用上传
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: [],
      previewVisible: false,
      previewImage: ''
      // 移除：原硬编码的uploadUrl和uploadHeaders，改为计算属性
    }
  },
  computed: {
    // 优化：环境变量获取接口地址，区分开发/生产
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_API}/admin/upload-image`;
    },
    // 修复：计算属性实时获取token，保证最新
    uploadHeaders() {
      const adminToken = localStorage.getItem('adminToken') || '';
      return {
        Authorization: `Bearer ${adminToken}`
      };
    }
  },
  watch: {
    imageUrl: {
      handler(newVal) {
        this.fileList = newVal ? [{ name: 'result-image', url: newVal }] : [];
      },
      // 优化：立即执行，替代mounted的初始化逻辑，消除代码冗余
      immediate: true
    }
  },
  // 移除：冗余的mounted生命周期
  methods: {
    // 上传成功
    handleSuccess(res) {
      this.$message.success('图片上传成功');
      // 向父组件传递图片地址
      this.$emit('upload-success', res.data.imageUrl);
    },
    // 新增：上传失败回调
    handleError(err) {
      this.$message.error(`图片上传失败：${err.message || '服务器异常，请稍后再试'}`);
      console.error('上传失败详情：', err);
    },
    // 修复：接收移除参数，清空预览状态，调整emit语义
    handleRemove(file) {
      this.previewVisible = false; // 清空预览弹框状态
      this.previewImage = '';      // 清空预览图片地址
      this.$emit('remove-image');  // 语义化emit事件
      this.$emit('upload-success', ''); // 保留原有emit，兼容父组件逻辑
    },
    // 预览图片
    handlePreview(file) {
      this.previewImage = file.url;
      this.previewVisible = true;
    },
    // 上传前校验：修复+优化，双重校验格式+大小
    beforeUpload(file) {
      // 优化：文件扩展名+file.type双重校验图片格式
      const validExts = ['.jpg', '.jpeg', '.png', '.gif'];
      const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
      const isExtValid = validExts.includes(ext);
      const isTypeValid = file.type.startsWith('image/');
      
      const isImage = isExtValid && isTypeValid;
      const isLt2M = file.size / 1024 / 1024 < 2; // 2MB限制

      if (!isImage) {
        this.$message.error('请上传jpg/jpeg/png/gif格式的图片！');
        return false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过2MB，请压缩后再上传！');
        return false;
      }
      return true;
    },
    // 超出文件数量限制
    handleExceed() {
      this.$message.warning('只能上传一张图片，请先移除原有图片！');
    }
  }
}
</script>

<style scoped>
.upload-image-container {
  width: 100%;
}
.upload-image {
  margin: 10px 0;
}
.preview-img {
  width: 100%;
  height: auto;
  max-height: 600px;
  object-fit: contain;
}
</style>