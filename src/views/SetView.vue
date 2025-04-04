<script setup lang="ts">
import { resetForm, userInfo,userInfoForm } from '@/utils/form'
import type { user,UserInfoFormType,IUserInfo, elderlyInfoResponse, familyInfoResponse, caregiverInfoResponse } from '@/@types/userInfo'
import { getUserInfo, updateUserInfo } from '@/api/userInfo';
import { hidePhoneNumber,encryptName } from '@/utils/modules/hidePhoneNumber';
import { formRules3 } from '@/utils/formRules'
import { useStore } from 'vuex';
import { countdown, isCounting, sendSms } from '@/utils/modules/captchaUtils'
import { themeColors,updateTheme,currentThemeIndex } from '@/utils/modules/themeUtils'
import RealNameAuthCom from '@/components/RealNameAuthCom.vue'// 实名认证组件,引入才能重置子组件表单
import { form } from '@/utils/form'
import SecureLS from 'secure-ls'
const secret = import.meta.env.VITE_ENCRYPTION_SECRET || 'default-secret'
const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: secret });



const store = useStore()
const ruleFormRef = ref()// 表单引用
const showRealNameAuthCom = ref(false)
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);// 获取用户是否登录
const isEditMode = ref(false);// 响应式控制是否处于编辑模式
const isPhone = ref(false);// 绑定手机号编辑模式
// 用户类型和不同类型用户ID的计算属性
const userType = computed(() => ({
  userType: store.state.user.user.user_type,
  elderly_id: store.state.user.user.elderly_id,
  family_id: store.state.user.user.family_id,
  caregiver_id: store.state.user.user.caregiver_id,
}));

onMounted(async() => {
  try {
    store.commit('loading/SET_LOADING', true); // 设置全局加载状态为 true
    if (isAuthenticated.value) {
        fetchUserInfo();// 初始化用户信息
    }
  } catch (error) {
    console.error('加载用户资料失败:', error);
    // ElMessage.error('加载用户资料失败，请稍后重试');
  } finally {
    store.commit('loading/SET_LOADING', false); // 设置全局加载状态为 false
  }

});

onUnmounted(() => {

});
// 响应式数据
const changedParams = ref<UserInfoFormType>({
  user: {
    user_type: store.state.user.user.user_type,
    id: store.state.user.user.id,
    username: store.state.user.user.username,
    sex: store.state.user.user.sex,
    phone: store.state.user.phone,
    real_name: store.state.user.user.real_name,
    id_card: store.state.user.user.id_card,
    birthday: store.state.user.user.birthday,
    signature: store.state.user.user.signature,
    age: store.state.user.user.age,
    common_phone: store.state.user.user.common_phone, 
    address: store.state.user.user.address,
  } as Pick<user, keyof user>,
  //老人
      elderly_id: store.state.user.user.elderly_id, // 确保Vuex中存在elderly_id
      emergency_contact:store.state.user.emergency_contact,
      emergency_phone: store.state.user.emergency_phone,
      caregiver:store.state.user.caregiver,
      elderly_id_card: store.state.user.elderly_id_card,
      elderly_real_name: store.state.user.elderly_real_name,
      elderly_phone: store.state.user.elderly_phone,
    //家属
      family_id: store.state.user.user.family_id, // 确保Vuex中存在family_id
        relation:store.state.user.relation,
        common_address: store.state.user.common_address,
    //机构人员
      caregiver_id: store.state.user.user.caregiver_id, // 确保Vuex中存在caregiver_id
        department: store.state.user.department,
        position: store.state.user.position,
});
// 用户类型
const updateParams = (userType: number) => {
  changedParams.value.user.user_type = userType;
  return changedParams.value;
}
const params = updateParams(userType.value.userType);

// 类型守卫函数
const isElderlyUserInfo = (response: IUserInfo): response is elderlyInfoResponse =>  'elderly_id' in response;
const isFamilyUserInfo = (response: IUserInfo): response is familyInfoResponse =>  'family_id' in response;
const isCaregiverUserInfo = (response: IUserInfo): response is caregiverInfoResponse => 'caregiver_id' in response;

// 获取用户信息
const fetchUserInfo = async () => {
  try {
    const response = await getUserInfo(params)
    // 检查响应并更新 userInfoForm 的初始值
    store.dispatch('user/userInfo', response);// 调用 Vuex action 更新状态
    // 安全地访问状态
    const user = store.state.user.user;
    if (user) {
      // 更新 changedParams
      //老人
      changedParams.value.elderly_id = store.state.user.user.elderly_id
      //家属
      changedParams.value.family_id = store.state.user.user.family_id
      //机构人员
      changedParams.value.caregiver_id = store.state.user.user.caregiver_id
      userInfoForm.value = response;
      userInfo.user = userInfoForm.value;
    }
    if (isElderlyUserInfo(response)) {
      // 老人
      Object.assign(changedParams.value, response);
    } else if (isFamilyUserInfo(response)) {
      // 家属
      Object.assign(changedParams.value, response);
    } else if (isCaregiverUserInfo(response)) {
      // 机构人员
      Object.assign(changedParams.value, response);
    }
    // isShow.value = true; // 显示用户信息页面
    // console.log('获取到的用户信息：', userInfoForm.value);
  }catch (error) {
    console.error('获取用户信息失败：', error);
  }
};
// 更新用户信息
const saveUserInfo = async () => {
  if (!ruleFormRef.value) return;
  // 调用表单的 validate 方法进行验证
  ruleFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
    const response = await updateUserInfo(changedParams.value);
    console.log('更新', response);
      // 更新成功，退出编辑模式
      isEditMode.value = false;
    isPhone.value = false;
      resetSetForm()
      // 更新成功后，更新store中的信息
    store.commit('user/setUser', response);
      // 可以在这里更新本地的 userInfo 状态，使其与后端同步
      userInfoForm.value = response;
  } catch (error) {
    console.error('更新用户信息异常：', error);
  }
    } else {
      // 表单验证未通过，提示用户
      // ElMessage.error('表单信息不符合规范，请检查后重新提交');
    }
  });
};

// 接收子组件传递的实名认证信息
const handleRealNameAuthSuccess = (real_name: string, id_card: string) => {
  changedParams.value.user.real_name = real_name;
  changedParams.value.user.id_card = id_card;
  // 调用更新接口
  saveUserInfo();
  showRealNameAuthCom.value = false
  isRealNameAuthOpen.value = false
};
const toggleEditMode = () => {
  resetSetForm()
  isEditMode.value = !isEditMode.value;
};
const resetCountdown = () => {
  // 清空倒计时
  isCounting.value = false;
  countdown.value = 60;
};
onBeforeRouteLeave(() => {
  // 清空倒计时
  resetCountdown()
});
const isRealNameAuthOpen = ref(false)// 控制实名认证组件的显示和隐藏
const realNameAuthComRef = ref<InstanceType<typeof RealNameAuthCom> | null>(null); // 子组件的引用

const toggleRealNameAuth = () => {// 切换实名认证组件的显示和隐藏
  if (isRealNameAuthOpen.value) {
    // 如果当前处于“返回”状态，通知子组件清空表单
    realNameAuthComRef.value?.resetFormFromParent();
  }
  isRealNameAuthOpen.value = !isRealNameAuthOpen.value
  if (isRealNameAuthOpen.value) {
    // 显示实名认证组件
    showRealNameAuthCom.value = true
  } else {
    // 隐藏实名认证组件
    showRealNameAuthCom.value = false
  }
}

// const currentThemeIndex = ref(0); // 默认选择第一个主题

const selectTheme = (index: number) => {
  currentThemeIndex.value = index;
  updateTheme(index);
  ls.set('currentThemeIndex', index.toString()); // 保存到本地存储
};
const togglePhone = () => {
  isPhone.value = !isPhone.value
  resetCountdown();// 清空倒计时
  resetForm();// 重置绑定手机号表单
}
// 监听 form.phone 的变化
watch(() => form.phone, (newPhone) => {
  changedParams.value.user.phone = newPhone;
});
// 重置表单
const resetSetForm = () => {
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields(); // 重置表单数据和验证规则
  }
};
// 切换拖拽按钮的显示隐藏-inject获取祖先组件通过 provide 提供的数据或方法
const toggleButtonVisibility = inject('toggleButtonVisibility') as ((evt: MouseEvent) => void) | undefined;
</script>
<template>
  <!-- 用户信息已加载 -->
  <div class="set-page body" v-if="isAuthenticated">

    <div class="userInfo-left">
      <!-- 头像 -->
    <div class="avatar-container">
        <!-- 非编辑模式：显示当前头像 -->
        <img :src="userInfoForm.avatar" class="avatar"/>
        <div class="username">{{ userInfoForm.username }}</div>
    </div>
    <el-form
      ref="ruleFormRef"
      :model="changedParams"
      status-icon
      class="demo-ruleForm"
      :rules="formRules3"
    >
      <!-- 绑定手机号 -->
      <el-form-item label="绑定手机号" prop="phone">
        <template v-if="isPhone">
          <div class="flex-between w-full">
            <el-input placeholder="请输入手机号" v-model="form.phone" />
          <el-button
            class="primary-button"
            @click="sendSms"
            :disabled="isCounting"
            :loading="isCounting"
          >
            {{ isCounting ? `${countdown}秒后重新获取` : "获取验证码" }}
          </el-button>
          </div>
          <el-input placeholder="请输入验证码" v-model="form.captcha" />
          <el-button
            class="primary-button"
            type="primary"
            @click="saveUserInfo"
            :disabled="!form.phone || !form.captcha"
          >
            确认更换
          </el-button>
        </template>
        <template v-else>
          <div v-if="userInfoForm.phone">{{ hidePhoneNumber(userInfoForm.phone) }}</div>
          <div v-else>暂未填写</div>
        </template>
        <div class="togglephone-btn">
          <el-button class="primary-button" @click="togglePhone">{{isPhone?'返回':'更换'}}</el-button>
        </div>
      </el-form-item>

      <!-- 常用手机号 -->
      <el-form-item label="常用手机号" prop="user.common_phone">
        <template v-if="isEditMode">
          <el-input placeholder="请输入常用手机号" v-model="changedParams.user.common_phone" />
        </template>
        <template v-else>
          <div v-if="userInfoForm.common_phone">{{ hidePhoneNumber(userInfoForm.common_phone) }}</div>
          <div v-else>暂未填写</div>
        </template>
      </el-form-item>

      <!-- 根据用户类型显示不同的信息 -->
      <div class="elderly-item" v-if="isElderlyUserInfo(userInfoForm)">
        <!-- 紧急联系人 -->
        <el-form-item label="紧急联系人" prop="emergency_contact">
          <template v-if="isEditMode">
            <el-input placeholder="请填写紧急联系人" v-model="changedParams.emergency_contact" />
          </template>
          <template v-else>
            <div v-if="userInfoForm.emergency_contact">{{ encryptName(userInfoForm.emergency_contact) }}</div>
            <div v-else>暂未填写</div>
          </template>
        </el-form-item>

        <!-- 紧急联系人电话 -->
        <el-form-item label="紧急联系人电话" prop="emergency_phone">
          <template v-if="isEditMode">
            <el-input placeholder="请填写紧急联系人电话" v-model="changedParams.emergency_phone" />
          </template>
          <template v-else>
            <div v-if="userInfoForm.emergency_phone">{{ hidePhoneNumber(userInfoForm.emergency_phone) }}</div>
            <div v-else>暂未填写</div>
          </template>
        </el-form-item>
      </div>

      <div class="family-item" v-else-if="isFamilyUserInfo(userInfoForm)">
        <!-- 与老人关系 -->
        <el-form-item label="与老人关系" prop="relation">
          <template v-if="isEditMode">
            <el-select v-model="changedParams.relation">
              <el-option label="母女/母子" value="母女/母子" />
              <el-option label="父女/父子" value="父女/父子" />
              <el-option label="其它" value="其它" />
            </el-select>
          </template>
          <template v-else>
            <div v-if="userInfoForm.relation">{{  userInfoForm.relation }}</div>
            <div v-else>暂未填写</div>
          </template>
        </el-form-item>

        <!-- 现家庭住址 -->
        <el-form-item label="详细地址" prop="common_address">
          <template v-if="isEditMode">
            <el-input v-model="changedParams.common_address" />
          </template>
          <template v-else>
            <div v-if="userInfoForm.common_address">{{  userInfoForm.common_address }}</div>
            <div v-else>暂未填写</div>
          </template>
        </el-form-item>
      </div>

      <div class="caregiver-item" v-else-if="isCaregiverUserInfo(userInfoForm)">
        <!-- 部门 -->
        <el-form-item label="部门" prop="department">
            <div v-if="userInfoForm.department">{{  userInfoForm.department }}</div>
            <div v-else>请联系管理员填写</div>
        </el-form-item>

        <!-- 职位 -->
        <el-form-item label="职位" prop="position">
            <div v-if="userInfoForm.position">{{  userInfoForm.position }}</div>
            <div v-else>请联系管理员填写</div>
        </el-form-item>
      </div>

      <div class="noFound-item" v-else>
        <div>未找到用户信息</div>
      </div>

      <!-- 操作按钮 -->
      <el-form-item class="button-group">
        <template v-if="!isEditMode">
          <el-button class="primary-button" @click="toggleEditMode">修改资料</el-button>
        </template>
        <template v-else>
          <el-button class="primary-button" @click="saveUserInfo">保存</el-button>
          <el-button class="primary-button" @click="toggleEditMode">取消</el-button>
        </template>
      </el-form-item>
    </el-form>
    <el-button class="primary-button w-full btn" @click="toggleButtonVisibility">切换拖拽按钮的显示隐藏</el-button>
    <!-- 实名认证 -->
    <div v-if="!changedParams.user.real_name || !changedParams.user.id_card">
      <el-button class="primary-button w-full btn" @click="toggleRealNameAuth">{{ isRealNameAuthOpen ? '返回' : '前往实名认证' }}</el-button>
    </div>
    <div class="flex-between w-full" v-else>
      <span>已实名</span>
      <el-button class="primary-button" @click="toggleRealNameAuth">{{ isRealNameAuthOpen ? '返回' : '点击更换' }}</el-button>
    </div>
    <RealNameAuthCom v-show="showRealNameAuthCom" ref="realNameAuthComRef" @real-name-auth-success="handleRealNameAuthSuccess"></RealNameAuthCom>
   </div>
   <div class="card">
    <h1>更改主题</h1>
    <ul v-for="(color, index) in themeColors" :key="index">
       <li class="socialContainer" :class="`container${index + 1}`"  @click="selectTheme(index)">
         <span class="card-text">{{ color.text }}</span>
       </li>
     </ul>
    </div>
  </div>

  <!-- 未登录 -->
  <div v-else class="not-logged-in">
    <div class="noFound-item">
      未登录，请前往<router-link class="link-button" to="/login">登录</router-link>
    </div>
  </div>
</template>
<style scoped lang="scss">
.btn{
  margin-bottom: rem(10);
}
  .card {
    margin-top: rem(5);
    background: linear-gradient(to right, var(--bg-one) 27%, var(--bg-two) 27%);
    display: flex;
    flex-direction: column;
    padding: rem(25);
    gap: rem(20);
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.055);
  }
  .el-form{
    padding-bottom: rem(5);
  }
  .socialContainer {
    height: rem(52);
    background-color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition-duration: .3s;
  }

  .container1:hover {
    background: linear-gradient(to right, #E5F3FF 27%, #F0F2FF 27%);
    transition-duration: .3s;
  }

  .container2:hover {
    background: linear-gradient(to right, #94f4c9 27%, var(--yellow) 27%);
    transition-duration: .3s;
  }

  .container3:hover {
    background: linear-gradient(to right, #f8d39c 27%, var(--coral) 27%);
    transition-duration: .3s;
  }

  .container4:hover {
    background: linear-gradient(to right, #FFA78F 27%, #E6A23C 27%);
    transition-duration: .3s;
  }
  .container5:hover {
    background: linear-gradient(to right, #bdc0c6 27%, #B3B3B3 27%);
    transition-duration: .3s;
  }
  .container6:hover {
    background: linear-gradient(to right, #d8bdf4 27%, #FFA78F 27%);
    transition-duration: .3s;
  }

  .socialContainer:active {
    transform: scale(0.9);
    transition-duration: .3s;
  }

  .card-text {
    width: rem(17);
    @extend .body;
    color: var(--black);
  }

  .socialContainer:hover .card-text {
    animation: slide-in-top 0.3s both;
    // color:var(--white);
  }

  @keyframes slide-in-top {
    0% {
      transform: translateY(-50px);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }


.set-page,.not-logged-in{
  padding: 2.1vh;
}
.avatar-container{
  @extend .flex-align-center;
  .avatar{
    width: rem(50);
    height: rem(50);
    border-radius: rem(50);
  }
  .username{
    padding-left: rem(10);
  }
}
.realNameAuthCom{
  padding-top: rem(12);
}
.togglephone-btn{
  padding-left: rem(10);
}
.el-form-item{
  padding-bottom: rem(18);
}
</style>