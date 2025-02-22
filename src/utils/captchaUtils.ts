import { ElMessage } from 'element-plus'
import type { getCaptchaResponse } from '@/api/captcha'
import { getCaptcha } from '@/api/captcha'
import { form } from '@/utils/form'

// 定义计时器相关逻辑
export const countdown = ref(60)// 假设倒计时为60秒
export const isCounting = ref(false)// 倒计时状态

// 启动倒计时
const startCountdown = () => {
  if (isCounting.value) return; // 如果已经在倒计时，直接返回
  isCounting.value = true;// 开启倒计时
  const timer = setInterval(() => {// 设置定时器，每秒减1
    if (countdown.value > 0) {
      countdown.value--; // 只有当 countdown > 0 时才减 1
    } else {
     clearInterval(timer); // 倒计时结束后清除计时器
      isCounting.value = false;
      countdown.value = 60;
    }
  }, 1000);
};

  
// 清除倒计时
export const clearCountdown = () => {
  if (isCounting.value) {
    isCounting.value = false;
    countdown.value = 60; // 重置倒计时
  }
};


//处理验证码响应
export const handleCaptchaResponse = (response:getCaptchaResponse) => {
  // 处理响应数据
  if (response.code === "200") {
    ElMessage.success('验证码已发送，请查收' + response.captcha);
    // 启动倒计时
    startCountdown()
  } else {
    ElMessage.error(response.message);
  }
}

//发送验证码
export const sendSms = async () => {
  if (isCounting.value) return; // 如果正在倒计时，阻止重复点击
   // 校验手机号格式
  const phoneRegex = /^1[3-9]\d{9}$/; // 假设手机号格式为11位数字，以1开头，第二位为3-9
  if (!phoneRegex.test(form.phone)) {
    ElMessage.error('手机号格式不正确，请输入有效的手机号');
    return;
  }
   try {
     const response = await getCaptcha({
       phone: form.phone
     });
    handleCaptchaResponse(response);
  } catch {
     ElMessage.error('验证码发送失败，请稍后重试');
  }
}
