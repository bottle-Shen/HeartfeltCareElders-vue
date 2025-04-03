<script setup lang="ts">
import SidebarCom from '@/components/SidebarCom.vue';
import HeaderCom from '@/components/HeaderCom.vue';
import { Opportunity } from '@element-plus/icons-vue'
import { useDraggable } from '@/composables/useDraggable';
// import { useStore } from 'vuex'
// 导入响应式布局逻辑
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
const { isAsideVisible,toggleAside } = useResponsiveLayout();
// 定义响应式数据
// const store = useStore()
// ------------拖拽按钮开始------------
const isButtonVisible = ref(true); // 控制按钮的显示隐藏
// 跨组件通信
provide('isButtonVisible', isButtonVisible);//provide将数据或方法提供给所有其它组件
provide('toggleButtonVisibility', () => {
  isButtonVisible.value = !isButtonVisible.value;
});
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
const headerMenuVisible = ref(false);// 顶部菜单是否显示
// 切换头部菜单显示隐藏
const toggleHeaderMenu = (event: MouseEvent) => {
  event.stopPropagation(); // 阻止事件冒泡--避免触发父组件的点击其它位置关闭弹窗事件
  headerMenuVisible.value = !headerMenuVisible.value;
};
// 点击页面其他地方隐藏
const handleClickOutside = (event: MouseEvent) => {
  const headerMenu = document.querySelector('.header-menu-com');
  // 如果 headerMenu 被显示，且点击位置不在 headerMenu 内部，则隐藏 headerMenu
  if (headerMenuVisible.value && headerMenu && !headerMenu.contains(event.target as Node)) {
    headerMenuVisible.value = false;
    console.log('点击了页面其他地方');
  }
};
// 监听 showUserInfo 的变化
watch(headerMenuVisible, (newVal) => {
  if (newVal) {
    // 当 isMoreShow 为 true 时绑定事件监听器
    document.addEventListener('click', handleClickOutside);
  } else {
    // 当 isMoreShow 为 false 时移除事件监听器
    document.removeEventListener('click', handleClickOutside);
  }
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

</script>

<template>
  <el-container>
    <el-header>
      <HeaderCom @toggle-menu="toggleHeaderMenu"/>
      <transition name="slide-x">
    <div class="header-menu-container" v-show="headerMenuVisible">
      <div class="header-menu-com">
      <UserInfoCom />
    </div>
    </div>
  </transition>
    </el-header>
      <Transition name="slide-x">
        <el-aside v-if="isAsideVisible">
        <SidebarCom/>
      </el-aside>
      </Transition>
      <el-button v-if="isButtonVisible" ref="draggableButton" type="primary" :icon="Opportunity" circle
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
    border-bottom: 1px solid var(--gray);
    box-shadow: 0 1px 4px var(--gray-rgb);
    background-color: var(--bg-one);
    .header-menu-com{
      display: none;
      @include mobile{
       display: block;
       width: 75%;
       max-width: rem(350);
       position: absolute;
       right: 0;
      }
    }
    .header-menu-container{// 菜单容器-避免触发main的点击事件
      position: relative;
      width: 100vw;
      height: 100vh;
      background-color: transparent;
    }
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