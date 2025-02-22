<script setup lang="ts">
// 定义一个响应式变量来存储图片数据
const images = ref<string[]>([]);
</script>
<template>
  <div>
    <!-- 轮播图 -->
     <el-carousel class="carousel-item" trigger="click">
        <el-carousel-item v-for="(image, item) in images" :key="item">
            <el-image style="width: 100%; height: 100%;" :src="image" fit="fill" lazy />
        </el-carousel-item>
    </el-carousel>
  </div>
</template>
<style scoped lang="scss">

</style>