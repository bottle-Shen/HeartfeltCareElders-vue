<script setup lang="ts">
import { login } from '@/api/login'
import {countdown,isCounting,sendSms} from '@/utils/captchaUtils'
import { resetForm, form } from '@/utils/form'
import { formRules } from '@/utils/formRules'
import { clearCountdown } from '@/utils/captchaUtils'

const isAccountLogin = ref(true);
const isPasswordLogin = ref(true);
const showVerificationCode = ref(false)// 控制获取验证码元素的显示状态
const showPasswordInput = ref(false)// 控制密码输入框的显示状态
const showAccountInput = ref(false)// 控制账号输入框的显示状态
const showPhoneInput = ref(true)// 控制手机号输入框的显示状态
const showPasswordMethod = ref(false)
const LoginButton = ref(false)
const nextButton = ref(true)
const showAccountMethod = ref(true)
const showprevStep = ref(false)
const isPhoneDisabled = ref(false)
const togglePasswordLogin = () => {
  form.password1 = ''
  form.captcha = ''
  isPasswordLogin.value = !isPasswordLogin.value
  showPasswordInput.value = !showPasswordInput.value
  showVerificationCode.value = !showVerificationCode.value 
}
const toggleAccountLogin = () => {
  resetForm()
  isAccountLogin.value = !isAccountLogin.value
  showPhoneInput.value = !showPhoneInput.value
  showAccountInput.value = !showAccountInput.value
  showPasswordInput.value = !showPasswordInput.value
  LoginButton.value = !LoginButton.value
  nextButton.value = !nextButton.value
};
const nextStep = () => {
  isPhoneDisabled.value = true
  showprevStep.value = true
  showVerificationCode.value = true
  nextButton.value = false
  LoginButton.value = true
  showAccountMethod.value = false
  showPasswordMethod.value = true
};
const prevStep = () => {
  resetForm()
  isPhoneDisabled.value = false
  showprevStep.value = false
  showVerificationCode.value = false
  showPasswordInput.value = false
  showPasswordMethod.value = false
  LoginButton.value = false
  nextButton.value = true
  showAccountMethod.value = true
}

const handleRegisterClick = () => {
  // 清空表单
  resetForm()
};

const loginForm = async () => {
  // 在登录之前发送验证码
       await login({
        phone: form.phone,
        password: form.password1,
        account: form.account,
        captcha: form.captcha,
        user_type: form.userType,
      });
    
}

// 定义表单引用
const ruleFormRef = ref();
const submitForm = () => {
  
      // 根据用户选择的登录方式，动态选择需要验证的字段
      let fieldsToValidate: string[] = [];

      if (form.phone && form.captcha) {
        fieldsToValidate = ["phone", "captcha"];
      } else if (form.phone && form.password1) {
        fieldsToValidate = ["phone", "password1"];
      } else if (form.account && form.password1) {
        fieldsToValidate = ["account", "password1"];
      } else {
        ElMessage.error("请选择有效的登录方式");
        return;
      }

      // 验证指定字段
      ruleFormRef.value.validateField(fieldsToValidate, (isValid: boolean) => {
        if (isValid) {
          // 验证通过，执行登录逻辑
          loginForm();
        } else {
          // 验证失败，提示用户
          ElMessage.error("表单信息不符合规范，请检查后重新提交");
        }
      });
    };


// 监听路由离开事件
onBeforeRouteLeave(() => {
  clearCountdown(); // 清空计时器
  resetForm();
});
</script>
<template>
  <div class="login-page bg flex-center flex-col">
    <el-form
    :model="form"
    ref="ruleFormRef"
    status-icon
    class="demo-ruleForm"
    :rules="formRules"
  >
  <h1 class="h1">登录</h1>
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
      <div>
      <!-- 手机号 -->
      <el-form-item prop="phone" v-show="showPhoneInput">
        <el-input placeholder="请输入手机号" v-model="form.phone" :disabled="isPhoneDisabled"/>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="captcha" v-show="showVerificationCode">
         <div class="flex-center flex-two">
          <el-input class="flex-three" placeholder="请输入验证码" v-model="form.captcha" />
         <el-button class="flex-one" type="primary" v-debounceClick:click="sendSms" :disabled="!form.phone||isCounting" :loading="isCounting">
          {{ isCounting ? `${countdown}秒后重新获取` : '获取验证码' }}
        </el-button>
         </div>
      </el-form-item>
      <!-- 账号 -->
      <el-form-item prop="account" v-show="showAccountInput">
        <el-input placeholder="请输入账号" v-model="form.account" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password1" v-show="showPasswordInput">
        <el-input placeholder="请输入密码" autocomplete="new-password" v-model="form.password1" show-password />
      </el-form-item>
      <div class="flex-between">
      <!-- 切换按钮 -->
      <el-form-item v-show="showprevStep">
        <el-button class="link-button" type="primary" @click="prevStep">返回</el-button>
      </el-form-item>
      <!-- 切换按钮 -->
      <el-form-item v-show="showPasswordMethod">
        <el-button class="link-button" type="primary" @click="togglePasswordLogin">{{ isPasswordLogin ? "使用密码登录" :"使用验证码登录"}}</el-button>
      </el-form-item>
      <!-- 切换按钮 -->
      <el-form-item v-show="showAccountMethod">
        <el-button class="link-button" type="primary" @click="toggleAccountLogin">{{ isAccountLogin ? "使用账号登录":"使用手机号登录" }}</el-button>
      </el-form-item>
      </div>
      <!-- 切换注册 -->
      <el-form-item class="text">
        <span>没有账号？去<router-link to="/register" class="link" @click="handleRegisterClick">注册</router-link></span>
        <span><router-link class="link" to="/reset">忘记密码</router-link></span>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button v-show="nextButton" class="primary-button" type="primary" @click="nextStep">同意并继续</el-button>
      </el-form-item>
      <!-- 提交按钮 -->
      <el-form-item>
        <el-button v-show="LoginButton" class="primary-button" type="primary" v-debounceClick:click="submitForm" :disabled="!form.phone && !form.account || !form.password1 && !form.captcha ">登录</el-button>
      </el-form-item>
      <!-- 上一步按钮 -->
      <!-- <el-form-item v-show="currentStep > 1 && currentStep < 4">
        <el-button type="primary" @click="prevStep">上一步</el-button>
      </el-form-item> -->
      </div>
    </el-form>
  </div>
</template>
<style scoped lang="scss">
.login-page {
  // background: url('../assets/images/background.png') no-repeat;
  // background-size: cover;
  // background-position: bottom;
    :deep(.el-form-item__content){//:deep()穿透
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