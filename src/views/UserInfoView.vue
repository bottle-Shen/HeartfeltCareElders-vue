<script setup lang="ts">
import { userInfo,userInfoForm } from '@/utils/form'
import type { user,UserInfoFormType,IUserInfo, elderlyInfoResponse, familyInfoResponse, caregiverInfoResponse } from '@/@types/userInfo'
import { getUserInfo, updateUserInfo } from '@/api/userInfo';
import { hidePhoneNumber } from '@/utils/modules/hidePhoneNumber';
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import { useStore } from 'vuex';

const store = useStore()
const isShow = ref(false)// 是否显示用户信息页面
const isLoading = ref(true)// 是否加载中
const isEditMode = ref(false)// 响应式控制是否处于编辑模式
const ruleFormRef = ref()// 表单引用
const imageUrl = ref('')// 头像上传的预览地址
const showRealNameAuthCom = ref(false)
const signatureDefaultText = "用一段简单的个性介绍，展示您的独特风采~"// 定义个性签名默认文本

// 定义 SEX_CHOICES 为对象数组
const SEX_CHOICES = [
  { value: '男' },
  { value: '女'},
  { value: '保密'},
] 
// 用户类型 和 不同类型用户ID 的计算属性
const userType = computed(() => ({
  userType: store.state.user.user.user_type,
  elderly_id: store.state.user.user.elderly_id,
  family_id: store.state.user.user.family_id,
  caregiver_id: store.state.user.user.caregiver_id,
}));

// 检查用户是否登录
const checkLoginStatus = () => {
  if (!store.state.user.token.access_token) {
    isShow.value = false;
    ElMessage.error('请先登录！');
    return false;
  }
  return true;
};
// 在组件加载时检查登录状态
onMounted(() => {
  checkLoginStatus();
});

const changedParams = ref<UserInfoFormType>({
  user: {
    user_type: store.state.user.user.user_type,
    id: store.state.user.user.id,
    username: store.state.user.user.username,
    sex: store.state.user.user.sex,
    phone: store.state.user.user.phone,
    real_name: store.state.user.user.real_name,
    id_card: store.state.user.user.id_card,
    birthday: store.state.user.user.birthday,
    signature: store.state.user.user.signature,
    age: store.state.user.user.age,
    common_phone: store.state.user.user.common_phone, 
  } as Pick<user, keyof user>,
  //老人
      elderly_id: store.state.user.user.elderly_id, // 确保Vuex中存在elderly_id
      emergency_contact:store.state.user.emergency_contact,
      emergency_phone: store.state.user.emergency_phone,
      health_status: store.state.user.health_status,
      caregiver:store.state.user.caregiver,
    //家属
      family_id: store.state.user.user.family_id, // 确保Vuex中存在family_id
        relation:store.state.user.relation,
        common_address: store.state.user.common_address,
    //机构人员
      caregiver_id: store.state.user.user.caregiver_id, // 确保Vuex中存在caregiver_id
        department: store.state.user.department,
        position: store.state.user.position,
});

const updateParams = (userType: number): UserInfoFormType => {
  changedParams.value.user.user_type = userType;
  return changedParams.value;
}
const params = updateParams(userType.value.userType);

// 类型守卫函数
const isElderlyUserInfo = (response: IUserInfo): response is elderlyInfoResponse =>  'elderly_id' in response;

const isFamilyUserInfo = (response: IUserInfo): response is familyInfoResponse =>  'family_id' in response;

const isCaregiverUserInfo = (response: IUserInfo): response is caregiverInfoResponse => 'caregiver_id' in response;

// watch(
//   () => userInfo,
//   (newValue) => {
//     // 基础信息变化检测
//     console.log('新值', newValue);
//     // console.log('库里数据newValue', store.state.user);
//     console.log('用户名', newValue.user.username);

//       changedParams.value.user.username = newValue.user.username;

//       changedParams.value.user.sex = newValue.user.sex;

//     switch (userType.value.userType) {
//       case 1:
//         break;
//       case 2:
//         changedParams.value.relation = newValue.relation;
//         changedParams.value.common_address = newValue.common_address;
//         break;
//       case 3:
//         break;
//       default:
//         break;
//     }
//   }
//   , { deep: true }
// )

// 加载用户信息
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
    isShow.value = true; // 显示用户信息页面
    console.log('获取到的用户信息：', userInfoForm.value);
  }catch (error) {
    console.error('获取用户信息失败：', error);
  }finally {
        isLoading.value = false; // 加载完成，隐藏加载状态
      }
};
const saveUserInfo = async () => {
    try {
    const response = await updateUserInfo(changedParams.value);
    console.log('更新', response);
      // 更新成功，退出编辑模式
      isEditMode.value = false;
      // 更新成功后，更新store中的信息
    store.commit('user/setUser', response);
      // 可以在这里更新本地的 userInfo 状态，使其与后端同步
      userInfoForm.value = response;

  } catch (error) {
    console.error('更新用户信息异常：', error);
  }
};

onMounted(fetchUserInfo);



const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${store.state.user.token.access_token}`
}));

    const handleAvatarSuccess: UploadProps['onSuccess'] = async (
      response,
      file
    ) => {
      // imageUrl.value = URL.createObjectURL(uploadFile.raw!)

      if (response.code === '200') {
        ElMessage.success('头像上传成功');
        imageUrl.value = URL.createObjectURL(file.raw!);
        store.commit('user/setAvatar', imageUrl.value);
      } else {
        ElMessage.error(response.message || '上传失败');
      }
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (file) => {
  const isJPG = file.type === "image/jpeg";
  const isPNG = file.type === "image/png";
  const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        ElMessage.error("上传头像图片只能是 JPG 或 PNG 格式!");
        return false
      } else if (!isLt2M) {
        ElMessage.error("上传头像图片大小不能超过 2MB!");
        return false
      }
      return true
}
const handleAvatarError: UploadProps['onError'] = () => {  
  ElMessage.error("头像上传失败，请稍后再试");
}

const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const submitRealNameAndIdCard = () => {
  showRealNameAuthCom.value = true
};

// 接收子组件传递的实名认证信息
const handleRealNameAuthSuccess = (real_name: string, id_card: string) => {
  changedParams.value.user.real_name = real_name;
  changedParams.value.user.id_card = id_card;
  // 调用更新接口
  saveUserInfo();
  showRealNameAuthCom.value = false
};

</script>
<template>
  <!-- 加载中 -->
  <div v-if="isLoading">
    <LoadingCom></LoadingCom>
  </div>
  <!-- 用户信息已加载 -->
    <div class="userInfo-page" v-else-if="isShow">
      <div class="userInfo-bac">
        <img src="@/assets/images/19_piano1_4k.jpg" alt="">
      </div>
            <!-- 头像 -->
            <el-form-item label="头像" prop="avatar">
              <!-- 编辑模式下显示上传按钮，否则显示头像 -->
              <template v-if="isEditMode">
                <el-upload
                  class="avatar-uploader"
                  action="http://localhost:8000/api/v1/users/upload_avatar/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-error="handleAvatarError"
                  :headers="uploadHeaders"
                  name="avatar"
                >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
                </el-upload>
              </template>
              <template v-else>
                <img :src="userInfoForm.avatar" class="avatar" width="60px">
              </template>
            </el-form-item>
            <div class="title">个人资料</div>
            
            
            <el-form 
            ref="ruleFormRef"
            status-icon
            class="demo-ruleForm"
          >
            <!-- 用户名 -->
            <el-form-item label="用户名" prop="username">
              <!-- 编辑模式下显示输入框，否则显示用户名 -->
              <template v-if="isEditMode">
                <el-input v-model="changedParams.user.username"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.username }}</div>
              </template>
            </el-form-item>
            <!-- 性别 -->
            <el-form-item label="性别" prop="sex">
              <template v-if="isEditMode">
                <el-radio-group v-model="changedParams.user.sex">
                  <el-radio
        v-for="choice in SEX_CHOICES"
        :key="choice.value"
        :value="choice.value"
      >
        {{ choice.value }}
      </el-radio>
                </el-radio-group>
              </template>
              <template v-else>
                <div>{{ userInfoForm.sex }}</div>
              </template>
            </el-form-item>
            <!-- 绑定手机号 -->
            <el-form-item label="绑定手机号" prop="phone">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.user.phone"></el-input>
              </template>
              <template v-else>
                <div>{{ hidePhoneNumber(userInfoForm.phone) }}</div>
              </template>
            </el-form-item>
            <!-- 常用手机号 -->
            <el-form-item label="常用手机号" prop="common_phone">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.user.common_phone"></el-input>
              </template>
              <template v-else>
                <div>{{ hidePhoneNumber(userInfoForm.common_phone) }}</div>
              </template>
            </el-form-item>
            <!-- 真实姓名 -->
             <!-- <el-form-item label="真实姓名" prop="real_name">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.user.real_name"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.real_name }}</div>
              </template>
            </el-form-item> -->
            <!-- 身份证号 -->
            <!-- <el-form-item label="身份证号" prop="id_card">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.user.id_card"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.id_card }}</div>
              </template>
            </el-form-item> -->
             <!-- 出生日期 -->
             <el-form-item label="出生日期" prop="birthday">
              <template v-if="isEditMode">
                <!-- <el-input v-model="changedParams.user.birthday"></el-input> -->
                <el-col :span="11">
                  <el-date-picker
                  v-model="changedParams.user.birthday"
                  type="date"
                  placeholder="请选择您的出生日期"
                  :disabled-date="disabledDate"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                  />
                </el-col>
              </template>
              <template v-else>
                <div>{{ userInfoForm.birthday }}</div>
              </template>
             </el-form-item>
             <!-- 个性签名 -->
              <el-form-item label="个性签名" prop="signature">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.user.signature" :placeholder="signatureDefaultText"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.signature || signatureDefaultText }}</div>
              </template>
             </el-form-item>
             <!-- 所在地 -->
              <AddressSelectorCom></AddressSelectorCom>
             <!-- 根据用户类型显示不同的信息 -->
             <div class="elderly-item" v-if="isElderlyUserInfo(userInfoForm)">
            <div>
              <!-- 紧急联系人 -->
            <el-form-item label="紧急联系人" prop="emergency_contact">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.emergency_contact"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.emergency_contact }}</div>
              </template>
           </el-form-item>
           <!-- 紧急联系人电话 -->
           <el-form-item label="紧急联系人电话" prop="emergency_phone">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.emergency_phone"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.emergency_phone }}</div>
              </template>
            </el-form-item>
            <!-- 健康状况 -->
             <el-form-item label="健康状况" prop="health_status">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.health_status"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.health_status }}</div>
              </template>
             </el-form-item>
            </div>
             </div>
             <div class="family-item" v-else-if="isFamilyUserInfo(userInfoForm)">
              <!-- 与老人关系 -->
               <el-form-item label="与老人关系" prop="relation">
                <template v-if="isEditMode">
                <!-- <el-input v-model="changedParams.relation"></el-input> -->
                 <el-select v-model="changedParams.relation" placeholder="please select your zone">
                  <el-option label="母女/母子" value="母女/母子" />
                  <el-option label="父女/父子" value="父女/父子" />
                  <el-option label="爷孙" value="爷孙" />
                  <el-option label="其它" value="其它" />
                </el-select>
              </template>
              <template v-else>
                <div>{{ userInfoForm.relation }}</div>
              </template>
               </el-form-item>
              <!-- 现在家庭住址 -->
              <el-form-item label="现在家庭住址" prop="common_address">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.common_address"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.common_address }}</div>
              </template>
             </el-form-item>
             </div>
             <div class="caregiver-item" v-else-if="isCaregiverUserInfo(userInfoForm)">
              <!-- 部门 -->
               <el-form-item label="部门" prop="department">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.department"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.department }}</div>
              </template>
             </el-form-item>
              <!-- 职位 -->
               <el-form-item label="职位" prop="position">
              <template v-if="isEditMode">
                <el-input v-model="changedParams.position"></el-input>
              </template>
              <template v-else>
                <div>{{ userInfoForm.position }}</div>
              </template>
             </el-form-item>
             </div>
             <div class="noFound-item" v-else>
              <div>
                <div>未找到用户信息</div>
              </div>
             </div>
            <!-- 修改和保存按钮 -->
            <el-form-item>
              <!-- 修改按钮，点击后进入编辑模式 -->
              <el-button type="primary" @click="isEditMode = true">修改</el-button>
              <!-- 保存按钮，点击后保存信息并退出编辑模式 -->
              <el-button type="primary" @click="saveUserInfo">保存</el-button>
            </el-form-item>
          </el-form>
          <div v-if="!changedParams.user.real_name || !changedParams.user.id_card" type="primary">
            <!-- 如果用户未实名认证，显示前往实名认证按钮 -->
             <el-button type="primary" @click="submitRealNameAndIdCard">前往实名认证</el-button>
          </div>
            <!-- 如果用户已实名认证，显示“已实名”状态和“点击更换”按钮 -->
          <div v-else>
            <span>已实名</span>
            <el-button type="primary" @click="submitRealNameAndIdCard">点击更换</el-button>
          </div>
          <!-- 实名认证组件 -->
            <RealNameAuthCom
              v-show="showRealNameAuthCom"
              @real-name-auth-success="handleRealNameAuthSuccess"
            ></RealNameAuthCom>
    </div>
    <!-- 未登录 -->
    <div v-else>
        <div class="noFound-item">未登录，请前往<router-link class="link" to="/login">登录</router-link></div>
    </div>
</template>
<style scoped lang="scss">
// @use '@/styles/main.scss';
.userInfo-page{
  position: relative;
  .userInfo-bac{
    position: absolute;
    top: 0;
    right: 0;
    img{
      width: 500px;
    }
  }
      .avatar-uploader .avatar {
          width: 178px;
          height: 178px;
          display: block;
        }
        .avatar-uploader .el-upload {
          border: 1px dashed var(--el-border-color);
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: var(--el-transition-duration-fast);
        }

        .avatar-uploader .el-upload:hover {
          border-color: var(--el-color-primary);
        }
        .el-icon.avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 178px;
          height: 178px;
          text-align: center;
        }

      .demo-ruleForm{
        
      }

@media (max-width: 768px) {
    
  }
}
</style>