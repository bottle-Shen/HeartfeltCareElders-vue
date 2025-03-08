import variables from '@/styles/variables.module.scss';
export function useResponsiveLayout() {
    const isHeaderVisible = ref(true);
    const isAsideVisible = ref(true);

    // 监听窗口大小变化
const handleResize = () => {
    const header = document.querySelector<HTMLElement>('.el-header');
    //  const header = document.querySelector<HTMLElement>('.el-header');
        if (header) {
            const headerHeight = getComputedStyle(header).height.trim();
            const minHeaderHeight = getComputedStyle(document.documentElement).getPropertyValue('--min-header-height').trim();

            if (headerHeight === minHeaderHeight) {
                document.documentElement.style.setProperty('--aside-top', minHeaderHeight);
            } else {
                document.documentElement.style.setProperty('--aside-top', headerHeight);
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

    // const adjustAsideTop = () => {
    //     const header = document.querySelector<HTMLElement>('.el-header');
    //     if (header) {
    //         const headerHeight = getComputedStyle(header).height.trim();
    //         const minHeaderHeight = getComputedStyle(document.documentElement).getPropertyValue('--min-header-height').trim();

    //         if (headerHeight === minHeaderHeight) {
    //             document.documentElement.style.setProperty('--aside-top', minHeaderHeight);
    //         } else {
    //             document.documentElement.style.setProperty('--aside-top', headerHeight);
    //         }
    //     }
    // };

    onMounted(() => {
        handleResize();
        // adjustAsideTop();
        window.addEventListener('resize', handleResize);
        // window.addEventListener('resize', adjustAsideTop);
    });

    onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
        // window.removeEventListener('resize', adjustAsideTop);
    });

    return {
        isHeaderVisible,
        isAsideVisible,
    };
}