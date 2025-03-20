<script setup lang="ts">
import { useStore } from 'vuex';
const store = useStore();

// 获取侧边栏的显示/隐藏状态
const isAsideVisible = computed(() => store.getters['asideVisible/isAsideVisible']);

// 定义响应式的 isMobile 变量
const isMobile = ref(false);

// 获取移动端断点值
const getMobileBreakpoint = () => {
  return parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-mobile-device')
  );
};

// 动态计算侧边栏宽度
const getAsideWidth = (isMobile: boolean) => {
  return isMobile
    ? 'clamp(var(--min-mobile-aside-width), 20%, var(--mobile-aside-width))'
    : 'clamp(var(--min-aside-width), 17%, var(--aside-width))';
};
// 动态计算加载提示的样式
const isLoadingStyle = computed(() => {

  // 计算侧边栏宽度
  const asideWidth = isAsideVisible.value ? getAsideWidth(isMobile.value) : '0';
  const Width =  isAsideVisible.value ? getAsideWidth(isMobile.value) : '0vw';

  return {
    top: 'var(--header-top)',
    left: asideWidth,
    height: 'calc(100vh - var(--header-top))',
    width: 'calc(100vw - ' + Width + ')',
  };
});
// 获取全局加载状态
const isLoading = computed(() => store.state.loading.isLoading);

// 初始化定时清理任务
store.dispatch('user/initClearOldData');

// 监听窗口大小变化并动态更新 isMobile 的值
const updateIsMobile = () => {
  // 判断是否为移动端
  isMobile.value = window.innerWidth <= getMobileBreakpoint();
};

// 在组件挂载时初始化 isMobile 的值
onMounted(() => {
  updateIsMobile(); // 初始化 isMobile 的值
  window.addEventListener('resize', updateIsMobile); // 监听窗口大小变化
});

// 在组件销毁时移除监听器
onUnmounted(() => {
  store.dispatch('user/clearClearOldDataInterval');
  window.removeEventListener('resize', updateIsMobile);// 在组件销毁时清理定时器
});
</script>

<template>
  <!-- 如果 isLoading 为 true，显示加载提示 -->
    <div v-if="isLoading" class="isLoading" :style="isLoadingStyle">
      <LoadingCom/>
    </div>
    <!-- 如果 isLoading 为 false，显示正常内容 -->
  <RouterView/>
  <!-- <div class="body">
    <RouterView/>
  </div> -->
</template>

<style lang="scss" scoped>
.isLoading {
    position: absolute;
    background-color: var(--white);
}
</style>
