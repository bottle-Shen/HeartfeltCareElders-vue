<script setup lang="ts">
import { getRealName } from '@/api/realnameAuth';
import { formRules } from '@/utils/formRules'

// 声明可以触发的事件
const emit = defineEmits(["real-name-auth-success"]);
// const real_name = ref(""); // 实名认证的真实姓名
// const id_card = ref(""); // 实名认证的身份证号
const form = reactive({
  real_name: "",
  id_card: "",
});

const ruleFormRef = ref();// 定义表单引用
const resetForm = () => {
  form.real_name = "";
  form.id_card = "";
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields(); // 清空表单数据
    ruleFormRef.value.clearValidate(); // 清空表单验证状态
  }
};
const saveUserInfo = async () => {
    const formData = { real_name: form.real_name, id_card: form.id_card };
    // 验证表单
    ruleFormRef.value.validate(async (valid: boolean) => {
        if (valid) {
            try {
            const response = await getRealName(formData);
            if (response.code === 200) {
                ElMessage.success("实名认证成功");
                // 触发自定义事件，将实名信息传递给父组件
                emit("real-name-auth-success", form.real_name, form.id_card);
                resetForm()// 重置表单
            }
        } catch (error) {
            if (error instanceof Error) {
                ElMessage.error(error.message); // 显示具体的错误信息
            } else {
                ElMessage.error('未知错误，请稍后再试');
            }
        }
        }else {
      // 表单验证未通过，提示用户
      ElMessage.error('表单信息不符合规范，请检查后重新提交');
    }
    })
};
// 监听父组件传来的 reset-form 事件
const resetFormFromParent = () => {
  resetForm();
};
// 定义 props 用于接收父组件传递的 placeholder
const props = defineProps({
  realNamePlaceholder: {
    type: String,
    default: '请输入真实姓名', // 默认值
  },
  idCardPlaceholder: {
    type: String,
    default: '请输入身份证号', // 默认值
  },
});
defineExpose({
  resetFormFromParent
});
</script>
<template>
    <div class="realNameAuthCom display-flex flex-column">
      <el-form 
            :model="form"
            ref="ruleFormRef"
            status-icon
            class="demo-ruleForm"
            :rules="formRules"
            >
            <!-- 真实姓名 -->
            <el-form-item label="真实姓名" prop="real_name">
                <el-input v-model="form.real_name" :placeholder="props.realNamePlaceholder"/>
            </el-form-item>
            <!-- 身份证号 -->
            <el-form-item label="身份证号" prop="id_card">
                    <el-input v-model="form.id_card" :placeholder="props.idCardPlaceholder"/>
            </el-form-item>
            <el-form-item>
              <el-button class="primary-button w-full" @click="saveUserInfo">保存</el-button>
            </el-form-item>
      </el-form>
    </div>
</template>
<style lang="scss" scoped>
@use '@/styles/base.module';
.el-form-item {
  padding-bottom: rem(18);
}
</style>