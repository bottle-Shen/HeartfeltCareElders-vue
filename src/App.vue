<script setup lang="ts">
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from './components/HelloWorld.vue'
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
  <!-- <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header> -->
  <RouterView />
</template>

<style scoped>

</style>
