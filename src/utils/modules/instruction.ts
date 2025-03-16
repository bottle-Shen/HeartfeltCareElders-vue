// 防抖函数
export function debounce<T extends (...args: Parameters<T>) => void>(func: T, delay: number): T & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined; // 定义在闭包中

  const debouncedFunc = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timer); // 清除之前的定时器
    timer = setTimeout(() => {
      func.apply(this, args); // 调用原函数
    }, delay);
  } as T & { cancel: () => void };

  debouncedFunc.cancel = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
  };

  return debouncedFunc;
}

// HTMLElementWithCleanup类型定义
interface HTMLElementWithCleanup extends HTMLElement {
  _cleanup?: () => void;
}
// 自定义指令 - 防抖
export const useDebounceDirective = <T extends (event: Event) => void>(delay: number) => {
  const timers = new Map<HTMLElement, ReturnType<typeof setTimeout>>();

  return {
    beforeMount(el: HTMLElementWithCleanup, binding: DirectiveBinding<T>) {
      const handler = (event: Event) => {
        const timer = timers.get(el);
        if (timer) clearTimeout(timer);

        const newTimer = setTimeout(() => {
          binding.value(event); // 调用绑定的函数，并传递事件对象
        }, delay);

        timers.set(el, newTimer); // 存储定时器引用
      };

      el.addEventListener(binding.arg as string, handler);

      const cleanup = () => {
        const timer = timers.get(el);
        if (timer) clearTimeout(timer);
        timers.delete(el); // 删除定时器引用
        el.removeEventListener(binding.arg as string, handler);
      };

      el._cleanup = cleanup; // 存储清理函数
    },
    unmounted(el: HTMLElementWithCleanup) {
      const cleanup = el._cleanup;
      if (cleanup) cleanup(); // 调用清理函数
    }
  };
};

// 自定义指令 - 节流
export const useThrottleDirective = <T extends (event: Event) => void>(delay: number) => {
  const throttledMap = new Map<HTMLElement, boolean>();

  return {
    beforeMount(el: HTMLElementWithCleanup, binding: DirectiveBinding<T>) {
      const handler = (event: Event) => {
        const throttled = throttledMap.get(el) || false;
        if (!throttled) {
          throttledMap.set(el, true); // 标记为节流状态

          setTimeout(() => {
            binding.value(event); // 调用绑定的函数
            throttledMap.set(el, false); // 解除节流状态
          }, delay);
        }
      };

      el.addEventListener(binding.arg as string, handler);

      const cleanup = () => {
        el.removeEventListener(binding.arg as string, handler);
      };

      el._cleanup = cleanup; // 存储清理函数
    },
    unmounted(el: HTMLElementWithCleanup) {
      const cleanup = el._cleanup;
      if (cleanup) cleanup(); // 调用清理函数
    }
  };
};
// // 自定义指令
// // 防抖
// export const useDebounceDirective = (delay: number) => {
//   return {
//     beforeMount(el: HTMLElement, binding: DirectiveBinding) {
//       let timer: number;
//       // 监听事件
//       el.addEventListener(binding.arg as string, () => {
//         clearTimeout(timer);
//         timer = setTimeout(() => {
//           binding.value();// 调用绑定的函数
//         }, delay);
//       });
//     },
//   };
// };
 
// // 节流
// export const useThrottleDirective = (delay: number) => {
//   return {
//     beforeMount(el: HTMLElement, binding: DirectiveBinding) {
//       let throttled = false;
 
//       el.addEventListener(binding.arg as string, () => {
//         if (!throttled) {
//           throttled = true;
//           setTimeout(() => {
//             binding.value();
//             throttled = false;
//           }, delay);
//         }
//       });
//     }
//   };
// };