<script setup lang="ts">
const props = defineProps({
     password1: {
        type: String,
        default: ''
    },
    password2: {
        type: String,
        default: ''
    }
})
const emit = defineEmits(['update:password1','update:password2']);
const handlePasswordInput = (value: string) => {
  emit('update:password1', value);
};

const handleConfirmPasswordInput = (value: string) => {
  emit('update:password2', value);
};
</script>
<template>
  <div>
      <!-- 密码 -->
      <el-form-item prop="password1">
        <el-input placeholder="请输入密码" autocomplete="new-password" :model-value="props.password1" @input="handlePasswordInput" show-password />
      </el-form-item>
      <!-- 确认密码 -->
      <el-form-item prop="password2">
        <el-input placeholder="请再次输入密码" :model-value="props.password2" @input="handleConfirmPasswordInput" show-password />
      </el-form-item>
  </div>
</template>
<style scoped lang="scss">
.el-input{
        @extend .input;
      }
</style>