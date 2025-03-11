<script setup lang="ts">
import SidebarCom from '@/components/SidebarCom.vue';
import HeaderCom from '@/components/HeaderCom.vue';
import { Opportunity } from '@element-plus/icons-vue'
import { useDraggable } from '@/composables/useDraggable';

// 导入响应式布局逻辑
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
const { isAsideVisible,toggleAside } = useResponsiveLayout();

// ------------拖拽按钮开始------------
const draggableButton = ref<{ $el: HTMLElement } | null>(null); // 定义 ref
const buttonWidth = ref(0); // 按钮宽度
const buttonHeight = ref(0); // 按钮高度

// 初始化拖拽逻辑
onMounted(() => {
  nextTick(() => {
    if (draggableButton.value) {
      // 访问组件实例的根 DOM 元素
      const buttonElement = draggableButton.value.$el;
      if (buttonElement) {
        buttonWidth.value = buttonElement.offsetWidth; // 获取宽度
        buttonHeight.value = buttonElement.offsetHeight; // 获取高度
      }
    }
  });
});
// 拖拽按钮位置
const windowHeight = window.innerHeight;// 当前视口高度
const topOffset = windowHeight * 0.932; // 93.2vh 转换为像素值
// 使用组合式函数管理拖拽逻辑
// 回调函数toggleAside-点击切换显示隐藏侧边栏
const {
  position,
  startDrag,
  endDrag,
} = useDraggable({ x: 0, y: topOffset },buttonWidth,buttonHeight,toggleAside); // 初始位置
// ------------拖拽按钮结束------------
</script>

<template>
    <el-container>
      <el-header>
        <HeaderCom/>
      </el-header>
    </el-container>
    <el-container>
      <Transition name="slide-x">
        <el-aside v-if="isAsideVisible">
        <SidebarCom/>
      </el-aside>
      </Transition>
      <el-button ref="draggableButton" type="primary" :icon="Opportunity" circle
      :style="{
    left: `${position.x}px`,
    top: `${position.y}px`,
    position:'fixed',
    cursor:'grab',
  }"
  @mousedown="startDrag"
  @mouseup="endDrag"/>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
</template>

<style scoped lang="scss">
  .el-header {
    position: fixed; // 固定顶部
    top: 0;
    z-index: 999;
    width: 100vw;
    height: 9.7vh;
    min-height: rem(52);
    max-height: rem(104.8);
    border-bottom: 1px solid var(--white-gray);
    box-shadow: 0 1px 4px var(--dark-blue-rgb);
    background-color: var(--bg-one);
  }
  .el-aside {
    width: clamp(var(--min-aside-width),17%, var(--aside-width));
    position: fixed; // 固定侧边栏
    top: var(--header-top);
    bottom: 0;
    left: 0;
    z-index: 1000;
    border-right: 1px solid var(--el-menu-border-color);
    background: linear-gradient(to right, var(--bg-one) 27%, var(--bg-two) 27%);
  }
  .el-button{
    width: rem(26);
    height: rem(26);
    padding: 0;
    color: var(--white);
    background-color: var(--blue);
    font-size: rem(20);
    z-index: 9999;
    @include hover{
      &:hover {
        color: var(--blue);
        background-color: var(--white);
      }
    }
    &:active{
      color: var(--blue);
      background-color: var(--white);
    }
  }
  @include mobile {
    .el-aside {
      width: clamp(var(--min-mobile-aside-width), 20%, var(--mobile-aside-width));
    }
  }

</style>