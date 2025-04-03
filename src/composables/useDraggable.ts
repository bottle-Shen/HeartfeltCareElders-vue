import type { Ref } from "vue";
import { useMousePressed, useMouse, type MousePressedOptions } from "@vueuse/core";

const options: MousePressedOptions = {
  touch: true, // 是否支持触摸屏
  drag: true, // 是否支持拖拽
  initialValue: false, // 初始值
  target: document.body, // 捕获点击的目标元素 - 全局拖拽范围
};

// const dragThreshold = 35; // 设置拖拽阈值（像素）

export function useDraggable(initialPosition: { x: number; y: number }, widthRef:Ref<number>, heightRef:Ref<number>,clickCallback?: () => void) {
  const { pressed: isPressed, sourceType } = useMousePressed(options); // sourceType 区分设备类型
  const { x: mouseX, y: mouseY } = useMouse(); // 使用 useMouse 钩子获取鼠标位置
  const position = ref(initialPosition); // 按钮位置
  const isDragging = ref(false); // 是否正在拖拽
  const dragOffset = ref({ x: 0, y: 0 }); // 拖拽偏移量
  const startX = ref(0); // 记录拖拽开始时的 X 坐标
  const startY = ref(0); // 记录拖拽开始时的 Y 坐标
  const hasMoved = ref(false); // 用于判断是否触发了拖拽
  const windowHeight = ref(window.innerHeight);// 视口高度
  // 监听宽度和高度的变化
//   watchEffect(() => {
//     console.log("按钮宽度和高度更新:", widthRef.value, heightRef.value);
//   });
  // 更新视口高度
const updateWindowHeight = () => {
  windowHeight.value = window.innerHeight;
  // 更新按钮位置
  position.value.y = windowHeight.value * 0.932; // 93.2vh 转换为像素值
};
  // 开始拖拽
  const startDrag = (event: MouseEvent | TouchEvent) => {
  // 设置其他元素的 pointer-events 为 none,不影响拖拽
    document.body.style.pointerEvents = 'none';
    isDragging.value = true;
    // 获取按钮当前的位置
    // const buttonX = position.value.x;
    //   const buttonY = position.value.y;
      // console.log("startDrag", buttonX, buttonY);
  //     startX.value = buttonX;
  // startY.value = buttonY;
   // 动态设置 sourceType
    if ("clientX" in event) {
        sourceType.value = "mouse"; // 鼠标事件
      // console.log("mouse")
      const eventMouse = event as MouseEvent;
      startX.value = eventMouse.clientX; // 鼠标点击位置的绝对 X 坐标
  startY.value = eventMouse.clientY; // 鼠标点击位置的绝对 Y 坐标
  //     startX.value = buttonX; // 按钮的初始 X 位置
  // startY.value = buttonY; // 按钮的初始 Y 位置
    } else if ("touches" in event) {
        sourceType.value = "touch"; // 触摸事件
      console.log("touch")
      const eventTouch = event as TouchEvent;
      event.preventDefault(); // 阻止默认行为
      startX.value = eventTouch.touches[0].clientX;
      startY.value = eventTouch.touches[0].clientY;
  }
    // 监听鼠标位置变化
  watch([isPressed, mouseX, mouseY], ([pressed, newX, newY]) => {
      if (pressed && isDragging.value) {
      // 判断鼠标是否移动超过阈值
      const distanceX = Math.abs(newX - startX.value);
          const distanceY = Math.abs(newY - startY.value);
          const dragThreshold = widthRef.value; // 设置拖拽阈值（像素）
        // console.log('阈值', dragThreshold)
        // console.log('移动',newX, newY)
        // console.log('startX', startX.value,' startY',startY.value)
        // console.log('距离', distanceX, distanceY)
          if (distanceX > dragThreshold || distanceY > dragThreshold) {
            // 如果鼠标移动超过阈值，则开始拖拽
            // console.log('超过阈值');
            hasMoved.value = true;
        // 计算偏移量
        let nextX = newX - dragOffset.value.x - widthRef.value / 2;
        let nextY = newY - dragOffset.value.y - heightRef.value / 2;
        // 动态获取按钮宽度和高度
        const buttonWidth = widthRef.value;
        const buttonHeight = heightRef.value;
        // 限制新位置不能超出视口
        nextX = Math.max(0, Math.min(nextX, window.innerWidth - buttonWidth));
        nextY = Math.max(0, Math.min(nextY, window.innerHeight - buttonHeight));
        position.value = { x: nextX, y: nextY };
        } else {
            // console.log("鼠标移动距离小于阈值，不进行拖拽");
            hasMoved.value = false;
      }
      }
      
  });
    // 绑定全局事件
    document.addEventListener("mouseup", endDrag);
    document.addEventListener("touchend", endDrag);
  };

  // 结束拖拽
  const endDrag = () => {
    // 恢复其他元素的 pointer-events
    document.body.style.pointerEvents = 'auto';
    // console.log("endDrag");
    isDragging.value = false;
        // 自动吸附到最近的边缘
      const buttonWidth = widthRef.value; // 动态获取按钮宽度
      // 自动吸附到最近的水平边缘
        const distanceToLeft = position.value.x;
        const distanceToRight = window.innerWidth - position.value.x - buttonWidth;

        if (distanceToLeft < distanceToRight) {
            position.value.x = 0; // 吸附到左边
        } else {
            position.value.x = window.innerWidth - buttonWidth; // 吸附到右边
      }

      // 如果有点击回调，并且没有触发拖拽，则调用点击回调
    if (!hasMoved.value && clickCallback) {
        clickCallback();
      }
       // 解绑全局事件
    document.removeEventListener("mouseup", endDrag);
    document.removeEventListener("touchend", endDrag);
  };

  onMounted(() => {
    // 初始化视口高度
    updateWindowHeight();
    // 监听窗口大小变化
    window.addEventListener('resize', updateWindowHeight);
  });

  onUnmounted(() => {
    // 移除监听器
    window.removeEventListener('resize', updateWindowHeight);
  });
  return {
    position, // 按钮位置
    isDragging, // 是否正在拖拽
    startDrag, // 开始拖拽
    endDrag, // 结束拖拽
  };
}