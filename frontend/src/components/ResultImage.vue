<template>
  <div class="result-image-container" v-if="imageUrl">
    <img :src="imageUrl" alt="结果图案" class="result-image" />
  </div>
</template>

<script>
export default {
  name: 'ResultImage',
  props: {
    imageUrl: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.result-image-container {
  margin: 20px 0;
  text-align: center;
}
.result-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
}
/* 手机端适配 */
@media (max-width: 768px) {
  .result-image {
    max-height: 300px;
  }
}
</style>