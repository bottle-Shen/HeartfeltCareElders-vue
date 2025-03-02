<script setup lang="ts">
import { useStore } from 'vuex';

const store = useStore();

// 初始化定时清理任务
store.dispatch('user/initClearOldData');

// 在组件销毁时清理定时器
onUnmounted(() => {
  store.dispatch('user/clearClearOldDataInterval');
});
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
