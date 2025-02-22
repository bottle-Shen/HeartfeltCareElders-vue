<script setup lang="ts">
const isLoading = ref(true); // 加载状态标志
</script>
<template>
    <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner">加载中...</div>
  </div>
</template>
<style lang="scss" scoped>
</style>