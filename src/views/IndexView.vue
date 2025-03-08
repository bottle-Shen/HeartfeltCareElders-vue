<script setup lang="ts">
import SidebarCom from '@/components/SidebarCom.vue';
import HeaderCom from '@/components/HeaderCom.vue';
import { Opportunity } from '@element-plus/icons-vue'
import { useDraggable } from '@/composables/useDraggable';

// 导入响应式布局逻辑
import { useResponsiveLayout } from '@/composables/useResponsiveLayout';
const { isHeaderVisible, isAsideVisible } = useResponsiveLayout();


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
// 点击回调函数-切换侧边栏
const toggleAside = () => {
  isAsideVisible.value = !isAsideVisible.value;
}

const windowHeight = window.innerHeight;// 当前视口高度
const topOffset = windowHeight * 0.932; // 93.2vh 转换为像素值
// 使用组合式函数管理拖拽逻辑
const {
  position,
  startDrag,
  endDrag,
} = useDraggable({ x: 0, y: topOffset },buttonWidth,buttonHeight,toggleAside); // 初始位置


// 监听侧边栏是否显示，隐藏时调整main占满全屏
watch(isAsideVisible, (newValue) => {
  const main = document.querySelector<HTMLElement>('.el-main');
  if (main) {
    // 如果侧边栏隐藏，main 占满全屏
    // main.style.marginTop = '0';
    main.style.padding = '0 1.4vw';
    main.style.width = '100vw'; // 设置 main 的宽度为视口宽度的 100%
    // 获取css自定义属性的值
    const mobileBreakpoint = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-mobile-device').trim();
    const desktopBreakpoint = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-desktop-device').trim();
    // console.log('mobileBreakpoint', mobileBreakpoint);
    // console.log('desktopBreakpoint', desktopBreakpoint);
    // 检测当前媒体查询状态
    const isMobile = window.matchMedia(`(max-width: ${mobileBreakpoint})`).matches;
    const isDesktop = window.matchMedia(`(max-width: ${desktopBreakpoint})`).matches;

   if (isMobile) {
            main.style.marginLeft = newValue ? 'clamp(var(--min-mobile-aside-width), 20%, var(--mobile-aside-width))' : '0';
        } else if (isDesktop) {
            main.style.marginLeft = newValue ? 'clamp(var(--min-aside-width), 17%, var(--aside-width))' : '0';
        } else {
            main.style.marginLeft = newValue ? 'clamp(var(--min-aside-width), 17%, var(--aside-width))' : '0';
        }
    }
})
</script>

<template>
    <el-container class="fixed-top">
      <el-header>
        <!-- <i-ep-Menu @click="toggleHeader" class="svg-icon"/> -->
        <HeaderCom v-if="isHeaderVisible"/>
      </el-header>
    </el-container>
    <el-container>
      <Transition name="slide-x">
        <el-aside v-if="isAsideVisible" class="aside">
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
      <el-main class="main h-full">
        <router-view></router-view>
      </el-main>
    </el-container>
</template>

<style scoped lang="scss">
// @use '@/styles/variables.scss';
// .svg-icon {
//   width: 60px;
//   height: auto;
//   display: none; // 默认状态下不显示
//   position: absolute;
//   top: 0;
//   right: 5%;
// }

  // display: flex;
  // flex-direction: column;
  // background-color: var(--white-green);

  .el-header {
    width: 100vw;
    height: var(--header-height);
    min-height: var(--min-header-height);
    border-bottom: 1px solid var(--white-gray);
    box-shadow: 0 1px 4px var(--dark-blue-rgb);
    background-color: var(--bg-one);
  }
  .el-aside {
    width: clamp(var(--min-aside-width),17%, var(--aside-width));
    position: fixed; // 固定侧边栏
    top: var(--aside-top);
    bottom: 0;
    left: 0;
    z-index: 1000; // 确保在内容上方
    border-right: 1px solid var(--el-menu-border-color);
    background: linear-gradient(to right, var(--bg-one) 27%, var(--bg-two) 27%);
    // :deep(.el-menu--collapse){
    //   width: 100%;
    // };
  }
  .el-button{
    width: 26px;
    height: 26px;
    padding: 0;
    color: var(--white);
    background-color: var(--blue);
    font-size: rem(20);
    // left:2.4vw;
    // bottom: 20px;
    z-index: 1001;
    &:hover{
      color: var(--blue);
      background-color: var(--white);
    }
    &:active{
      color: var(--blue);
      background-color: var(--white);
    }
  }
  .el-main {
    margin-left:clamp(var(--min-aside-width),17%, var(--aside-width)); // 留出侧边栏的空间
    margin-top: var(--aside-top);
    padding-right: clamp(var(--min-side-width),15%,var(--side-width));
    padding-left: 1.4vw;
    // margin: clamp(var(--min-side-width),2.5vw,var(--side-width));
    // padding: 0;
    // margin-top: var(--header-height);
    // overflow-y: auto; // 使内容区域可滚动
    height: calc(100vh - var(--aside-top)); // 确保内容区域占据剩余空间--导致滚动条
  }

  @include mobile {
    .el-header {
      height: var(--header-height);
    }
    .el-aside {
      width: clamp(var(--min-mobile-aside-width), 20%, var(--mobile-aside-width));
    }

    // .svg-icon {
    //   display: block;
    // }

    .el-main {
      // padding-right: clamp(var(--min-side-width),15%,var(--side-width));
      margin-left: clamp(var(--min-mobile-aside-width), 20%, var(--mobile-aside-width));
    }
  }

</style>