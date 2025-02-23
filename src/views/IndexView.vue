<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import SidebarCom from '@/components/SidebarCom.vue';
import HeaderCom from '@/components/HeaderCom.vue';
import variables from '@/styles/variables.module.scss';

// 控制 HeaderCom 组件的显示状态
const isHeaderVisible = ref(false);
// 监听窗口大小变化
const handleResize = () => {
  const header = document.querySelector<HTMLElement>('.el-header');
  if (window.innerWidth <= 768) {
    isHeaderVisible.value = false;
  } else {
    isHeaderVisible.value = true;
    if (header) {
      header.style.height = variables.headerHeight; // 恢复默认高度
    }
  }
};

onMounted(() => {
  handleResize(); // 初始化时调用一次
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 点击切换头部菜单
const toggleHeader = () => {
  if (window.innerWidth > 768) return; // 视口大于768px时不执行

  const header = document.querySelector<HTMLElement>('.el-header');
  if (header) {
    const computedStyle = getComputedStyle(header);
    const currentHeight = computedStyle.height;
    console.log('currentHeight', currentHeight);
    if (header.style.height === variables.toggleHeight) {
      console.log('等于120点击了切换为60');
      header.style.height = variables.headerHeight; // 设置高度为 60px
      isHeaderVisible.value = false; // 隐藏HeaderCom 组件
    } else {
      console.log('等于60点击了切换为120');
      header.style.height = variables.toggleHeight; // 恢复默认高度
      isHeaderVisible.value = true; // 显示HeaderCom 组件
    }
  }
}
</script>

<template>
  <div class="index-page bg">
    <el-container>
        <el-header class="fixed-header">
        <i-ep-Menu @click="toggleHeader" class="svg-icon"/>
        <HeaderCom v-if="isHeaderVisible"/>
      </el-header>
      <el-container>
        <el-aside class="aside">
          <SidebarCom/>
        </el-aside>
        <el-main class="main h-full">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
// @use '@/styles/variables.scss';

.svg-icon {
  width: 60px;
  height: auto;
  display: none; // 默认状态下不显示
  position: absolute;
  top: 0;
  right: 5%;
}

.index-page {
  // display: flex;
  // flex-direction: column;
  background-color: var(--white-green);

  .el-header {
    height: var(--header-height);
    border-bottom: 1px solid var(--white-gray);
    box-shadow: 0 1px 4px var(--black-rgb);
    background-color: var(--white-green);
    // padding: 0 30px;
  }

  .el-container {
    display: flex;
    flex: 1; // 使内容区域占据剩余空间
    // margin-top: $header-height; // 留出顶部导航的高度
  }

  .el-aside {
    position: fixed; // 固定侧边栏
    top: var(--header-height);
    bottom: 0;
    left: 0;
    z-index: 1000; // 确保在内容上方
    border-right: 1px solid var(--el-menu-border-color);
    background: linear-gradient(to right, var(--white-green) 20%, #F0F2FF 80%);
    overflow: hidden;
    width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 6);
  }

  .el-main {
    margin-top: var(--header-height);
    margin-left: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 6); // 留出侧边栏的空间
    padding:0 10px; // 根据需要调整内边距
    background-color: var(mainBac);
    overflow-y: auto; // 使内容区域可滚动
    // height: 100%; // 确保内容区域占据剩余空间--导致滚动条
  }

  @media (max-width: 768px) {
    .el-header {
      height: var(header-height);
    }

    .el-aside {
      width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2);
    }

    .svg-icon {
      display: block; // 在媒体查询中显示
    }

    .el-main {
      margin-left: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding) * 2);
    }
  }
}
</style>