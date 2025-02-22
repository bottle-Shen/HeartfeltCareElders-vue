// 防抖
export const useDebounceDirective = (delay: number) => {
  return {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
      let timer: number;
 
      el.addEventListener(binding.arg as string, () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          binding.value();
        }, delay);
      });
    }
  };
};
 
// 节流
export const useThrottleDirective = (delay: number) => {
  return {
    beforeMount(el: HTMLElement, binding: DirectiveBinding) {
      let throttled = false;
 
      el.addEventListener(binding.arg as string, () => {
        if (!throttled) {
          throttled = true;
          setTimeout(() => {
            binding.value();
            throttled = false;
          }, delay);
        }
      });
    }
  };
};