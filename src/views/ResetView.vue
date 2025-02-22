<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus'
import { getCaptcha } from '@/api/captcha'
import { reset } from '@/api/resetPassword'
import {form} from '@/utils/form'
const countdown = ref(60);
const isCounting = ref(false);
const sendSms = async () => {
  if (isCounting.value) return; // 如果正在倒计时，阻止重复点击
  //检查手机号是否为空
  // if (!form.phone) {
  //   ElMessage.error('请填写手机号');
  //   return;
  // }
  try {
    await getCaptcha({
      phone: form.phone,
      // captcha_type: 'register' // 如果你不需要这个参数，可以注释掉或者删除
    })
  } catch (error) {
    console.error('Error sending SMS:', error);
    // 你可以在这里处理错误，比如显示错误消息给用户
    
  }
};
const resetPassword = async () => {
  // 首先确认用户是否确定要修改密码
  const confirmResult = await ElMessageBox.confirm(
    '您是否确定要修改密码？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  );

  // 如果用户取消，则不继续执行
  if (!confirmResult) {
    ElMessage({
      type: 'info',
      message: '修改已取消',
    });
    return;
  }

  try {
    // 用户确认后，发送重置密码请求
    await reset({
      phone: form.phone,
      new_password: form.password1,
      confirm_new_password: form.password2,
      captcha: form.captcha,
    });
    // 请求成功后，提示用户修改成功
    ElMessage({
      type: 'success',
      message: '密码重置成功',
    });
  } catch (error) {
    // 捕获并处理错误
    console.error('Error resetting password:', error);
    ElMessage({
      type: 'error',
      message: '密码重置失败',
    });
  }
};
const submitForm = async () => {
  // if (!form.password1 || !form.password2 || !isPasswordMatching.value) {
  //   ElMessage.error('密码不匹配或未输入');
  //   return;
  // }
    resetPassword()
}
</script>
<template>
  <div class="reset-page">
    <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    status-icon
    class="demo-ruleForm"
  >
    <el-form-item>您正在重置密码中：</el-form-item>
    <!-- 手机号 -->
    <el-form-item label="手机号" prop="phone">
      <el-input placeholder="请输入手机号" v-model="form.phone" />
    </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="password1">
        <el-input placeholder="请输入密码" autocomplete="new-password" v-model="form.password1" show-password />
      </el-form-item>
      <!-- 确认密码 -->
      <el-form-item label="确认密码" prop="password2">
        <el-input placeholder="请再次输入密码" v-model="form.password2" show-password />
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item label="获取验证码" prop="captcha">
         <el-input placeholder="请输入验证码" v-model="form.captcha" />
         <el-button type="primary" @click="sendSms" :disabled="isCounting" :loading="isCounting">
          {{ isCounting ? `${countdown}秒后重新获取` : '获取验证码' }}
        </el-button>
         <!-- <el-button @click="verifySms">验证验证码</el-button> -->
      </el-form-item>
    <el-form-item>
    <el-button type="primary" @click="submitForm">重置密码</el-button>
      <!-- <el-button type="primary" @click="submitForm">
        确认修改
      </el-button> -->
    </el-form-item>
  </el-form>
  </div>
</template>
<style scoped lang="scss">
.reset-page {
    position: relative;
    display: flex;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: #fafafa;
    .el-form{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: pink;
        border-radius: 10px;
        border: 1px solid red;
        box-shadow: 0 0 10px #ccc;
        width:500px;/* 确保有明确的宽度 */
        padding: 30px 20px;
        .el-button{
            width: 100%;
            height: 40px;
        }
    }
    @media (max-width: 768px) {
    .el-form{
      width: 95%;
    }
  }
}
</style>