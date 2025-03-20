<script setup lang="ts">
import { register } from '@/api/register'
import {countdown,isCounting,sendSms,clearCountdown} from '@/utils/modules/captchaUtils'
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
  <div class="bg flex-center">
    <div class="form-container">
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
         <div class="flex-center captcha-group">
          <el-input class="captcha" placeholder="请输入验证码" v-model="form.captcha" />
         <el-button class="get-captcha primary-button" type="primary" v-debounce:click="sendSms" :disabled="!form.phone||isCounting" :loading="isCounting">
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
        <span>已有账号？去<router-link class="link-button" to="/login" @click="handleRegisterClick">登录</router-link></span>
        <span><router-link class="link-button" to="/reset">忘记密码</router-link></span>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button class="primary-button submit-button" type="primary" v-debounce:click="submitForm" :disabled="!form.phone || !form.password1 || !form.password2 || !form.captcha" >注册</el-button>
      </el-form-item>
    </el-form>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(.tip .el-form-item__content){//:deep()穿透
      @extend .flex-between;
    }
.form-container{
  min-width: rem(300);
  @extend .flex-center;
  border-radius: 30% 10px 20% 20%;
  background-color: var(--white);
  width:rem(650);/* 确保有明确的宽度 */
  margin: 0 rem(20);
}
.el-form{
  width:80%;/* 确保有明确的宽度 */
  padding:rem(30) rem(60) rem(50);
    h1{
      color: var(--dark-blue);
      margin-bottom: rem(30);
    }
      .el-form-item{
        @extend .flex-center;
      }
      .el-input{
    height: rem(48);
  }
      .captcha-group{
    flex:2;
    .captcha{
      flex:3;
    }
    .get-captcha{
      height: rem(48);
      flex:1;
    }
  }
      .radio-group > :deep(.el-form-item__content){
          justify-content: flex-end;
        }
      
      :deep(.el-form-item__label){
        // @extend .label;
      }
        .el-button{
          // @extend .button;// 继承全局按钮样式
          @extend .w-full;
        }
      @include mobile{
        padding: 5% 2% 10%;
      }
}
</style>