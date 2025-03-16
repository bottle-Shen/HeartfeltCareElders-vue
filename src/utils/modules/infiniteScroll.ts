import { debounce } from "./instruction";
// 无限滚动
export const useInfiniteScroll = (
  containerRef: Ref<HTMLElement | null>,
  loadMoreData: () => Promise<void>,
  delay: number = 300
) => {
  // 使用 debounce 包装滚动事件处理函数
  const handleScroll = debounce(async () => {
    // console.log("滚动事件被触发");
    const container = containerRef.value;
    if (!container) return;

    const { scrollTop, clientHeight, scrollHeight } = container;
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      // console.log("触发加载更多数据");
      await loadMoreData();
    }
    // 监听滚动事件并保存滚动位置
    sessionStorage.setItem("scrollPosition", scrollTop.toString());
  }, delay);

  // 清理函数
  const cleanup = () => {
    // 清理 debounce 的定时器
    handleScroll.cancel();
  };
  // 恢复滚动位置
  const restoreScrollPosition = async () => {
    await nextTick(); // 确保 DOM 渲染完成
    const scrollContainer = containerRef.value;
    if (scrollContainer) {
      const savedScrollPosition = sessionStorage.getItem("scrollPosition");
      // console.log("从 sessionStorage 获取的滚动位置:", savedScrollPosition);
      if (savedScrollPosition) {
        scrollContainer.scrollTop = parseInt(savedScrollPosition, 10);
        // console.log("滚动位置已恢复到:", scrollContainer.scrollTop);
      }
    } else {
      console.error("未找到容器，无法恢复滚动位置");
    }
  };

  return {
    handleScroll,
    cleanup,
    restoreScrollPosition
  };
};