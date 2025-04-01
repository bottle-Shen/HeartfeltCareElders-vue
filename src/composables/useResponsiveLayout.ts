import { useStore } from 'vuex';
export function useResponsiveLayout() {
    const store = useStore();
    const isAsideVisible = computed(() => store.getters['asideVisible/isAsideVisible']);
    const isHeaderVisible = ref(true);
    // const isAsideVisible = ref(true);

// 头部大小变化
const adjustHeaderStyle = () => {
    const header = document.querySelector<HTMLElement>('.el-header');
        if (header) {
            const headerHeight = getComputedStyle(header).height.trim();
            const minHeaderHeight = getComputedStyle(document.documentElement).getPropertyValue('--min-header-height').trim();
            if (headerHeight === minHeaderHeight) {
                document.documentElement.style.setProperty('--header-top', minHeaderHeight);
            } else {
                document.documentElement.style.setProperty('--header-top', headerHeight);
            }
        }
//   if (window.innerWidth <= 768) {
//     isHeaderVisible.value = false;
//   } else {
//     isHeaderVisible.value = true;
//     if (header) {
//       header.style.height = variables.headerHeight; // 恢复默认高度
//     }
//   }
};

// 侧边栏与main的样式变化
const adjustMainStyle = () => {
  const main = document.querySelector<HTMLElement>('.el-main');
  if (!main) return;
  const viewportWidth = window.innerWidth;// 获取视口宽度
  const mobileBreakpoint = parseFloat(// 获取 CSS 自定义属性的值
    getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-mobile-device')
  );
  // 当侧边栏显示时
  if (isAsideVisible.value) {
    // 如果视口宽度小于或等于移动端断点
    if (viewportWidth <= mobileBreakpoint) {
        main.classList.add('el-main-mobile');
    } else {
        main.classList.remove('el-main-mobile');
    }
    main.classList.remove('el-main-hidden'); // 移除隐藏类
  } else {// 侧边栏隐藏
    main.classList.add('el-main-hidden');
    main.classList.remove('el-main-mobile');
  }
};
// 切换侧边栏显示/隐藏
const toggleAside = () => {
    // isAsideVisible.value = !isAsideVisible.value;
    // console.log('isAsideVisible.value',isAsideVisible.value)
    store.commit('asideVisible/TOGGLE_ASIDE');
    adjustMainStyle(); // 调整 main 样式
};

    onMounted(() => {
        adjustHeaderStyle();
        adjustMainStyle();
        window.addEventListener('resize', adjustHeaderStyle);
        // window.addEventListener('resize', adjustAsideTop);
        window.addEventListener('resize', adjustMainStyle);

    });

    onUnmounted(() => {
        window.removeEventListener('resize', adjustHeaderStyle);
        // window.removeEventListener('resize', adjustAsideTop);
        window.removeEventListener('resize', adjustMainStyle);
    });

    return {
        isHeaderVisible,
        isAsideVisible,
        adjustHeaderStyle,
        adjustMainStyle,
        toggleAside,
    };
}