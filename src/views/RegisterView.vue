<script setup lang="ts">
import { register } from '@/api/register'
import {countdown,isCounting,sendSms,clearCountdown} from '@/utils/captchaUtils'
import { resetForm,form } from '@/utils/form'
import PasswordConfirmation from '@/components/PasswordConfirmation.vue'
import { formRules } from '@/utils/formRules'

//注册登录表单

const registerForm = async () => {
       await register({
        phone: form.phone,
        password: form.password1,
        confirm_password: form.password2,
        user_type: form.userType,
        captcha: form.captcha,
      });
}
// 定义表单引用
const ruleFormRef = ref();
const submitForm = () => {
  ruleFormRef.value.validate((valid:boolean) => {
    if (valid) {
      // 表单验证通过，执行注册逻辑
      registerForm();
    } else {
      // 表单验证未通过，提示用户
      ElMessage.error('表单信息不符合规范，请检查后重新提交');
    }
  });
}

// 跳转注册页面清空表单
const handleRegisterClick = () => {
  // 清空表单
  resetForm();
}
// 监听路由离开事件
onBeforeRouteLeave(() => {
  clearCountdown(); // 清空计时器
  resetForm();
});
</script>
<template>
  <div class="register-page bg flex-center flex-col">
    <el-form
    :model="form"
    ref="ruleFormRef"
    status-icon
    class="demo-ruleForm"
    :rules="formRules"
  >
  <h1 class="h1">注册</h1>
      <div>
        <!-- 用户身份选择 -->
        <el-form-item class="radio-group" label="请选择您的真实身份">
          <el-radio-group v-model="form.userType">
            <el-radio :value="1">老年用户</el-radio>
            <el-radio :value="2">老人家属</el-radio>
            <el-radio :value="3">机构人员</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <!-- 手机号 -->
      <el-form-item prop="phone">
        <el-input placeholder="请输入手机号" v-model="form.phone" />
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="captcha">
         <div class="flex-center flex-two">
          <el-input class="flex-three" placeholder="请输入验证码" v-model="form.captcha" />
         <el-button class="flex-one" type="primary" v-debounceClick:click="sendSms" :disabled="!form.phone||isCounting" :loading="isCounting">
          {{ isCounting ? `${countdown}秒后重新获取` : '获取验证码' }}
        </el-button>
         </div>
      </el-form-item>
      <!-- 密码 -->
      <password-confirmation
       v-model:password1="form.password1"
       v-model:password2="form.password2"
       />
      <!-- 切换登录 -->
      <el-form-item class="tip" >
        <span>已有账号？去<router-link class="link" to="/login" @click="handleRegisterClick">登录</router-link></span>
        <span><router-link class="link" to="/reset">忘记密码</router-link></span>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button class="primary-button" type="primary" v-debounceClick:click="submitForm" :disabled="!form.phone || !form.password1 || !form.password2 || !form.captcha" >注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<style scoped lang="scss">
.register-page {
    :deep(.tip .el-form-item__content){//:deep()穿透
          @extend .flex-between;
        }
    .el-form{
      background-color: var(--white);
        border-radius: 30% 10px 20% 20%;
        width:650px;/* 确保有明确的宽度 */
        padding: 30px 80px 50px;
        h1{
          margin-bottom: 30px;
        }
      .el-form-item{
        @extend .flex-center;
      }
      .radio-group > :deep(.el-form-item__content){
          justify-content: flex-end;
        }
      
      :deep(.el-form-item__label){
        @extend .label;
      }
      .el-input{
        @extend .input;
      }
        .el-button{
          @extend .button;// 继承全局按钮样式
          @extend .w-full;
        }
    }
    @media (max-width: 768px) {
    .el-form{
      width: 95%;
    }
  }
}
</style>