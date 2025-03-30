<script setup lang="ts">
import { userInfo,userInfoForm } from '@/utils/form'
import type { user,UserInfoFormType,IUserInfo, elderlyInfoResponse, familyInfoResponse, caregiverInfoResponse } from '@/@types/userInfo'
import { getUserInfo, updateUserInfo,uploadAvatar,uploadBackground } from '@/api/userInfo';
import { ElMessage, ElDialog } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import type { UploadProps,UploadFile } from 'element-plus'
import { useStore } from 'vuex';
import { countdown, isCounting } from '@/utils/modules/captchaUtils'
import { useInfiniteScroll } from '@/utils'
import type {SocialData} from '@/@types/social'
import router from '@/router';
import { useRoute} from 'vue-router';

const route = useRoute();
const activeName = ref('first')// 默认选中的标签页
const userPostsContainerRef = ref<HTMLElement | null>(null)// 滚动容器的引用
const viewHistory = computed(() => store.state.post.viewHistory);// 仓库获取观看历史
// 获取用户帖子和点赞帖子的数据
const userPosts = computed(() => store.state.post.userPosts);
const likedPosts = computed(() => store.state.post.likedPosts);
// 加载状态
const loadingUserPosts = computed(() => store.state.post.loadingUserPosts);
const loadingLikedPosts = computed(() => store.state.post.loadingLikedPosts);
const loadingViewHistory = computed(() => store.state.post.loadingViewHistory);

const handleClick = (tab: TabsPaneContext) => {
  // console.log(tab, event);
  // console.log(tab.props.name); // 使用 tab.props.name
  // 更新路由，添加当前激活的标签页名称作为查询参数
  router.push({ path: router.currentRoute.value.path, query: { tab: tab.props.name } });
  // 清除当前数据
  if (tab.props.name === 'first') {
    store.commit('post/SET_USER_POSTS', []);// 清除用户帖子数据
    store.commit('post/SET_CURRENT_PAGE_USER_POSTS', 1);// 重置当前页码
    store.commit('post/SET_LOADING_USER_POSTS', false);// 重置加载状态
    store.commit('post/SET_FINISHED_USER_POSTS', false);// 重置完成状态
    store.commit('post/CLEAR_LOADED_PAGES_USER_POSTS');// 重置缓存页码
  } else if (tab.props.name === 'second') {
    store.commit('post/SET_LIKED_POSTS', []);
     store.commit('post/SET_CURRENT_PAGE_LIKED_POSTS', 1);
     store.commit('post/SET_LOADING_LIKED_POSTS', false);
    store.commit('post/SET_FINISHED_LIKED_POSTS', false);
     store.commit('post/CLEAR_LOADED_PAGES_LIKED_POSTS');
  }
   // 加载新数据
  if (tab.props.name === 'first') {
     store.dispatch('post/fetchUserPosts');
  } else if (tab.props.name === 'second') {
     store.dispatch('post/fetchLikedPosts');
  } else if (tab.props.name === 'third') {
    getUserViewHistoryData();
  }
  // 清除滚动位置
  const container = userPostsContainerRef.value;
  if (container) {
    container.scrollTop = 0; // 将滚动位置设置为顶部
  }
   // 移除滚动监听器和清理资源
   removeUserPostListeners();
   // 重新添加滚动监听器
   addUserPostsListeners();
};

// 获取用户发布的帖子
const getUserSocialData = async () => {
  await store.dispatch('post/fetchUserPosts')
}
// 获取用户点赞的帖子
const getUserLikeData = async () => {
  await store.dispatch('post/fetchLikedPosts')
}
// 获取用户观看历史
const getUserViewHistoryData = async () => {
  await store.dispatch('post/loadViewHistoryFromLocalStorage');
}

// 使用无限滚动逻辑-用户发布的帖子-用户点赞的帖子
const { cleanup: cleanupUserPosts,
  restoreScrollPosition: restoreUserPostsScroll,
  addScrollListeners: addUserPostsListeners,
  removeScrollListeners:removeUserPostListeners
} = useInfiniteScroll(
  userPostsContainerRef,
  async () => {
    // 根据当前激活的标签页调用对应的加载更多数据的函数
    if (activeName.value === 'first') {
      await store.dispatch('post/loadMoreUserPosts');
    } else if (activeName.value === 'second') {
      await store.dispatch('post/loadMoreLikedPosts');
    }else if (activeName.value === 'third') {
      await store.dispatch('post/loadMoreViewHistory');
    }
  }, 300,'userPostsContainerRef')
const recordViewHistory = (post: SocialData) => {
  // 记录观看历史
  store.dispatch('post/addToViewHistory', post);
};
// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(); // 根据本地语言格式化日期
};

const store = useStore()
const isLoading = ref(true)// 是否加载中
const isEditMode = ref(false)// 响应式控制是否处于编辑模式
const ruleFormRef = ref()// 表单引用
const backgroundUrl = ref<string | null>(null)// 背景图上传的预览地址
const backgroundFile = ref<File | null>(null); // 用于保存背景图文件对象
const avatarFile = ref<File | null>(null); // 用于保存文件对象
const avatarUrl = ref<string | null>(null); // 用于保存头像预览 URL
const dialogVisible = ref(false); // 控制弹窗显示
const currentUploadType = ref<string | null>(null); // 当前上传类型：'avatar' 或 'background'
const signatureDefaultText = "用一段简单的个性介绍，展示您的独特风采~"// 定义个性签名默认文本
const showVerificationCode = ref(false); // 是否显示验证码相关字段
const parentAddress = ref<string>(''); // 存储地址选择器的值

// 监听 parentAddress 的变化，并同步到 changedParams
watch(parentAddress, (newValue) => {
  changedParams.value.user.address = newValue;
  // console.log('parentAddress changed:', newValue);
});
// 定义 SEX_CHOICES 为对象数组
const SEX_CHOICES = [
  { value: '男' },
  { value: '女'},
  { value: '保密'},
] 
// 用户类型和不同类型用户ID的计算属性
const userType = computed(() => ({
  userType: store.state.user.user.user_type,
  elderly_id: store.state.user.user.elderly_id,
  family_id: store.state.user.user.family_id,
  caregiver_id: store.state.user.user.caregiver_id,
}));
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);// 获取用户是否登录

onMounted(async() => {
  try {
    store.commit('loading/SET_LOADING', true); // 设置全局加载状态为 true
    // 从路由中读取当前激活的标签页名称
    const currentTab = Array.isArray(route.query.tab) ? route.query.tab[0] : route.query.tab;
    activeName.value = currentTab || 'first'; // 如果为空，使用默认值 'first'
    if (isAuthenticated.value) {
        fetchUserInfo();// 初始化用户信息
        // 根据当前激活的标签页重新加载数据
      if (activeName.value === 'first') {
        getUserSocialData(); // 加载用户发布的帖子
      } else if (activeName.value === 'second') {
        getUserLikeData(); // 加载用户点赞的帖子
      } else if (activeName.value === 'third') {
        getUserViewHistoryData(); // 加载用户观看历史
      }
    }
  } catch (error) {
    console.error('加载用户资料失败:', error);
    ElMessage.error('加载用户资料失败，请稍后重试');
  } finally {
    store.commit('loading/SET_LOADING', false); // 设置全局加载状态为 false
  }
  // 确保 DOM 更新完成后再恢复滚动位置和添加监听器
  nextTick(() => {
    // 恢复滚动位置和添加滚动监听器
    restoreUserPostsScroll();
    addUserPostsListeners();
  });
});

onUnmounted(() => {
  // 移除滚动监听器和清理资源
  removeUserPostListeners();
  cleanupUserPosts();
});
// 响应式数据
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
    address: store.state.user.user.address,
  } as Pick<user, keyof user>,
  //老人
      elderly_id: store.state.user.user.elderly_id, // 确保Vuex中存在elderly_id
      emergency_contact:store.state.user.emergency_contact,
      emergency_phone: store.state.user.emergency_phone,
      caregiver:store.state.user.caregiver,
      elderly_id_card: store.state.user.elderly_id_card,
      elderly_real_name: store.state.user.elderly_real_name,
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
const updateParams = (userType: number): UserInfoFormType => {
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
  }finally {
        isLoading.value = false; // 加载完成，隐藏加载状态
      }
};
// 更新用户信息
const saveUserInfo = async () => {
    try {
    const response = await updateUserInfo(changedParams.value);
    // console.log('更新', response);
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


// 头像上传配置
const uploadHeaders = computed(() => ({
  Authorization: `Bearer ${store.state.user.token.access_token}`
}));
// 头像上传成功（仅本地预览）
const handleAvatarSuccess: UploadProps['onSuccess'] = async (
      file
) => {
      avatarUrl.value = URL.createObjectURL(file.raw!); // 更新头像预览
}
// 头像上传前验证
// const beforeAvatarUpload: UploadProps['beforeUpload'] = (file: File) => {
//   const isJPG = file.type === "image/jpeg";
//   const isPNG = file.type === "image/png";
//   const isLt2M = file.size / 1024 / 1024 < 2;
//       if (!isJPG && !isPNG) {
//         ElMessage.error("上传头像图片只能是 JPG 或 PNG 格式!");
//         return false
//       } else if (!isLt2M) {
//         ElMessage.error("上传头像图片大小不能超过 2MB!");
//         return false
//       }
//       return true
// }
// 头像选择后生成本地预览
const handleAvatarChange = (uploadFile: UploadFile) => {
  const rawFile = uploadFile.raw; // 获取原始文件对象
  if (!rawFile) {
    ElMessage.error("无法获取上传的文件，请确保选择了有效的文件。");
    return;
  }

  // const isValid = beforeAvatarUpload(rawFile);
  // if (!isValid) {
  //   ElMessage.error("文件不符合要求，请选择 JPG 或 PNG 格式且大小不超过 2MB 的文件。");
  //   return;
  // }

  avatarUrl.value = URL.createObjectURL(rawFile); // 更新头像预览
  avatarFile.value = rawFile;// 保存文件
  currentUploadType.value = 'avatar'; // 设置当前上传类型为头像
  dialogVisible.value = true; // 显示弹窗
};
// 保存头像
const saveAvatar = async () => {
  if (!avatarFile.value) {
        ElMessage.error("请先上传头像");
        return;
    }
  // 确保 avatarFile.value 是 File 类型
  if (!(avatarFile.value instanceof File)) {
      ElMessage.error("无法识别的文件类型");
      return;
  }
  // 调用 uploadAvatar 函数上传头像
  const uploadedUrl = await uploadAvatar(avatarFile.value);
  userInfoForm.value.avatar = uploadedUrl; // 更新本地头像地址
  // 更新 Vuex 中的头像地址
  store.commit("user/setAvatar", uploadedUrl);
  dialogVisible.value = false;// 关闭弹窗
  // 退出编辑模式
  // isEditMode.value = false;
  // ElMessage.success("头像更新成功");
};

// 保存当前上传的内容
const saveCurrentUpload = async () => {
  if (currentUploadType.value === 'avatar') {
    await saveAvatar();
  } else if (currentUploadType.value === 'background') {
    await saveBackground();
  }
};

// 取消编辑
const cancelEdit = () => {
  avatarUrl.value = null; // 清空头像预览
  avatarFile.value = null;// 清空文件
  backgroundUrl.value = null; // 清空背景图预览
  backgroundFile.value = null;// 清空文件
  dialogVisible.value = false;// 关闭弹窗
  isEditMode.value = false; // 退出编辑模式
};
// 弹窗关闭时的回调
// const handleDialogClose = () => {
//   cancelEdit();// 取消编辑
// };
// 背景图上传成功（仅本地预览）
const handleBackgroundSuccess: UploadProps['onSuccess'] = async (
      file
    ) => {
      backgroundUrl.value = URL.createObjectURL(file.raw!); // 更新背景图预览
}

// 背景图上传前验证
// const beforeBackgroundUpload: UploadProps['beforeUpload'] = (file: File) => {
//   const isJPG = file.type === "image/jpeg";
//   const isPNG = file.type === "image/png";
//   const isLt2M = file.size / 1024 / 1024 < 2;
//       if (!isJPG && !isPNG) {
//         ElMessage.error("上传背景图片只能是 JPG 或 PNG 格式!");
//         return false
//       } else if (!isLt2M) {
//         ElMessage.error("上传背景图片大小不能超过 2MB!");
//         return false
//       }
//       return true
// }

// 背景图选择后生成本地预览
const handleBackgroundChange = (uploadFile: UploadFile) => {
  const rawFile = uploadFile.raw; // 获取原始文件对象
  if (!rawFile) {
    ElMessage.error("无法获取上传的文件，请确保选择了有效的文件。");
    return;
  }

  // const isValid = beforeBackgroundUpload(rawFile);
  // if (!isValid) {
  //   ElMessage.error("文件不符合要求，请选择 JPG 或 PNG 格式且大小不超过 2MB 的文件。");
  //   return;
  // }

  backgroundUrl.value = URL.createObjectURL(rawFile); // 更新头像预览
  backgroundFile.value = rawFile;// 保存文件
  currentUploadType.value = 'background'; // 设置当前上传类型为背景图
  dialogVisible.value = true; // 显示弹窗
};
// 保存背景图
const saveBackground = async () => {
  if (!backgroundFile.value) {
        ElMessage.error("请先上传背景图");
        return;
    }
  // 确保 avatarFile.value 是 File 类型
  if (!(backgroundFile.value instanceof File)) {
      ElMessage.error("无法识别的文件类型");
      return;
  }
  // 调用 uploadBackground 函数上传背景图
  const uploadedUrl = await uploadBackground(backgroundFile.value);
  userInfoForm.value.background_image = uploadedUrl; // 更新本地背景图地址
  // 更新 Vuex 中的头像地址
  store.commit("user/setBackground", uploadedUrl);
  dialogVisible.value = false;// 关闭弹窗
  // 退出编辑模式
  // isEditMode.value = false;
  // ElMessage.success("头像更新成功");
};
const disabledDate = (time: Date) => {
  return time.getTime() > Date.now()
}

const toggleEditMode = () => {
  if (!isEditMode.value) {
    // 进入编辑模式
    showVerificationCode.value = false; // 隐藏验证码相关字段
  } else {
    // 退出编辑模式
    showVerificationCode.value = false; // 隐藏验证码相关字段
  }
  isEditMode.value = !isEditMode.value;
};
onBeforeRouteLeave(() => {
  // 清空倒计时
  isCounting.value = false;
  countdown.value = 60;
});

</script>
<template>
  <!-- 用户信息已加载 -->
  <div ref="userPostsContainerRef" class="userInfo-page" v-if="isAuthenticated">
    <!-- 弹窗组件 -->
      <el-dialog
      v-model="dialogVisible"
      :title="currentUploadType === 'avatar' ? '确认头像' : '确认背景图'"
    >
      <div v-if="currentUploadType === 'avatar'" class="preview-avatar-container">
        <img v-if="avatarUrl" :src="avatarUrl" class="preview-avatar" />
        <div v-else class="no-avatar">未选择头像</div>
      </div>
      <div v-else class="preview-background-container">
        <img v-if="backgroundUrl" :src="backgroundUrl" class="preview-background" />
        <div v-else class="no-background">未选择背景图</div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="primary-button" @click="cancelEdit">取消</el-button>
          <el-button class="primary-button" @click="saveCurrentUpload">保存</el-button>
        </span>
      </template>
    </el-dialog>
    <div class="userInfo-left">
    <el-form
      ref="ruleFormRef"
      :model="changedParams"
      status-icon
      class="demo-ruleForm"
    >
    <!-- 背景图 -->
    <div class="background-container">
      <template v-if="!isEditMode">
        <!-- 非编辑模式：显示当前背景图 -->
        <img :src="userInfoForm.background_image" class="background"/>
      </template>
      <template v-else>
        <!-- 编辑模式：显示上传组件 -->
         <!-- :before-upload="beforeBackgroundUpload" -->
        <el-upload
          class="background background-uploader"
          action=""
          :show-file-list="false"
          :on-change="handleBackgroundChange"
          :on-success="handleBackgroundSuccess"
          :headers="uploadHeaders"
          name="background"
        >
          <!-- 如果有新的背景图预览，则显示新的背景图；否则显示当前背景图 -->
          <img v-if="backgroundUrl" :src="backgroundUrl" class="background" />
          <img v-else :src="userInfoForm.background_image" class="background" />
          <!-- 在头像上显示“+”号 -->
          <el-icon class="uploader-icon"><Plus /></el-icon>
        </el-upload>
      </template>
    </div>

    <!-- 头像 -->
    <div class="avatar-container">
      <template v-if="!isEditMode">
        <!-- 非编辑模式：显示当前头像 -->
        <img :src="userInfoForm.avatar" class="avatar"/>
      </template>
      <template v-else>
        <!-- 编辑模式：显示上传组件 -->
         <!-- :before-upload="beforeAvatarUpload" -->
        <el-upload
          class="avatar avatar-uploader"
          action=""
          :show-file-list="false"
          :on-change="handleAvatarChange"
          :on-success="handleAvatarSuccess"
          :headers="uploadHeaders"
          name="avatar"
        >
          <!-- 如果有新的头像预览，则显示新的头像；否则显示当前头像 -->
          <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
          <img v-else :src="userInfoForm.avatar" class="avatar" />
          <!-- 在头像上显示“+”号 -->
          <el-icon class="uploader-icon"><Plus /></el-icon>
        </el-upload>
      </template>
    </div>
      <!-- 用户名 -->
      <el-form-item prop="username">
        <template v-if="isEditMode">
          <el-input placeholder="请输入用户名" v-model="changedParams.user.username" />
        </template>
        <template v-else>
          <div class="form-username">{{ userInfoForm.username }}</div>
        </template>
      </el-form-item>

      <!-- 性别 -->
      <el-form-item prop="sex">
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
      <!-- 出生日期 -->
      <el-form-item prop="birthday">
        <template v-if="isEditMode">
          <el-date-picker
          :teleported="false"
            v-model="changedParams.user.birthday"
            type="date"
            placeholder="请选择您的出生日期"
            :disabled-date="disabledDate"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </template>
        <template v-else>
          <div>{{ userInfoForm.birthday }}</div>
        </template>
      </el-form-item>

      <!-- 个性签名 -->
      <el-form-item prop="signature">
        <template v-if="isEditMode">
          <el-input
            v-model="changedParams.user.signature"
            :placeholder="signatureDefaultText"
          />
        </template>
        <template v-else>
          <div>{{ userInfoForm.signature || signatureDefaultText }}</div>
        </template>
      </el-form-item>

      <!-- 所在地 -->
      <el-form-item prop="address">
        <template v-if="isEditMode">
          <AddressSelectorCom v-model:address="parentAddress" />
          <!-- <AddressSelectorCom v-model="changedParams.user.address" /> -->
        </template>
        <template v-else>
          <div>{{ userInfoForm.address }}</div>
        </template>
      </el-form-item>
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
   </div>
   <div class="userInfo-right">
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane  label="我的发布" name="first">
          <ul class="userpost-list" v-if="userPosts.length > 0">
            <li class="userpost-item" v-for="post in userPosts" :key="post.id" @click="router.push(`/interact/${post.id}`),recordViewHistory(post)" >
              <h3 class="title">{{ post.title }}</h3>
              <p class="body-s text">{{ post.content }}</p>
              <div class="userpost-item-bottom">
                <span class="userpost-item-bottom-like">
                <svg t="1741824137804" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2618" width="200" height="200"><path d="M667.787 117.333c165.077 0 270.88 132.374 270.88 310.528 0 138.251-125.099 290.507-371.574 461.59a96.768 96.768 0 0 1-110.186 0C210.432 718.368 85.333 566.112 85.333 427.86c0-178.154 105.803-310.528 270.88-310.528 59.616 0 100.054 20.832 155.787 68.096 55.744-47.253 96.17-68.096 155.787-68.096z m0 63.147c-41.44 0-70.262 15.19-116.96 55.04-2.166 1.845-14.4 12.373-17.942 15.381a32.32 32.32 0 0 1-41.77 0c-3.542-3.018-15.776-13.536-17.942-15.381-46.698-39.85-75.52-55.04-116.96-55.04-126.026 0-206.88 100.779-206.88 246.219 0 110.901 113.526 248.544 344.299 408.128a32.352 32.352 0 0 0 36.736 0C761.141 675.253 874.667 537.6 874.667 426.699c0-145.44-80.854-246.219-206.88-246.219z" p-id="2619" fill="#2c2c2c"></path></svg>
                {{ post.likes_count }}
                </span>
                发布时间：{{ formatDate(post.created_at) }}
              </div>
            </li>
          </ul>
          <!-- 加载状态 -->
          <LoadingCom v-if="loadingUserPosts" class="loading"/>
          <!-- <div v-if="finishedUserPosts" class="no-more-data">
            没有更多数据
          </div> -->
        </el-tab-pane>
        <el-tab-pane label="喜欢" name="second">
          <ul class="userpost-list" v-if="likedPosts.length > 0">
            <li class="userpost-item" v-for="post in likedPosts" :key="post.id" @click="router.push(`/interact/${post.id}`),recordViewHistory(post)">
              <h3 class="title">{{ post.title }}</h3>
              <p class="body-s text">{{ post.content }}</p>
              <div class="userpost-item-bottom">
                <span class="userpost-item-bottom-like">
                <svg t="1741824137804" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2618" width="200" height="200"><path d="M667.787 117.333c165.077 0 270.88 132.374 270.88 310.528 0 138.251-125.099 290.507-371.574 461.59a96.768 96.768 0 0 1-110.186 0C210.432 718.368 85.333 566.112 85.333 427.86c0-178.154 105.803-310.528 270.88-310.528 59.616 0 100.054 20.832 155.787 68.096 55.744-47.253 96.17-68.096 155.787-68.096z m0 63.147c-41.44 0-70.262 15.19-116.96 55.04-2.166 1.845-14.4 12.373-17.942 15.381a32.32 32.32 0 0 1-41.77 0c-3.542-3.018-15.776-13.536-17.942-15.381-46.698-39.85-75.52-55.04-116.96-55.04-126.026 0-206.88 100.779-206.88 246.219 0 110.901 113.526 248.544 344.299 408.128a32.352 32.352 0 0 0 36.736 0C761.141 675.253 874.667 537.6 874.667 426.699c0-145.44-80.854-246.219-206.88-246.219z" p-id="2619" fill="#2c2c2c"></path></svg>
                {{ post.likes_count }}
                </span>
                发布时间：{{ formatDate(post.created_at) }}
              </div>
            </li>
          </ul>
          <!-- 加载状态 -->
          <LoadingCom v-if="loadingLikedPosts" class="loading"/>
          <!-- <div v-if="finishedLikedPosts" class="no-more-data">
            没有更多数据
          </div> -->
        </el-tab-pane>
        <el-tab-pane label="足迹" name="third">
          <ul class="userpost-list" v-if="viewHistory.length > 0">
            <li class="userpost-item" v-for="post in viewHistory" :key="post.id" @click="router.push(`/interact/${post.id}`),recordViewHistory(post)">
              <h3 class="title">{{ post.title }}</h3>
              <p class="body-s text">{{ post.content }}</p>
              <div class="userpost-item-bottom">
                <span class="userpost-item-bottom-like">
                <svg t="1741824137804" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2618" width="200" height="200"><path d="M667.787 117.333c165.077 0 270.88 132.374 270.88 310.528 0 138.251-125.099 290.507-371.574 461.59a96.768 96.768 0 0 1-110.186 0C210.432 718.368 85.333 566.112 85.333 427.86c0-178.154 105.803-310.528 270.88-310.528 59.616 0 100.054 20.832 155.787 68.096 55.744-47.253 96.17-68.096 155.787-68.096z m0 63.147c-41.44 0-70.262 15.19-116.96 55.04-2.166 1.845-14.4 12.373-17.942 15.381a32.32 32.32 0 0 1-41.77 0c-3.542-3.018-15.776-13.536-17.942-15.381-46.698-39.85-75.52-55.04-116.96-55.04-126.026 0-206.88 100.779-206.88 246.219 0 110.901 113.526 248.544 344.299 408.128a32.352 32.352 0 0 0 36.736 0C761.141 675.253 874.667 537.6 874.667 426.699c0-145.44-80.854-246.219-206.88-246.219z" p-id="2619" fill="#2c2c2c"></path></svg>
                {{ post.likes_count }}
                </span>
                发布时间：{{ formatDate(post.created_at) }}
              </div>
            </li>
          </ul>
           <!-- 没有观看历史时显示暂无观看历史 -->
          <p v-if="viewHistory.length === 0">暂无观看历史</p>
          <!-- 加载状态 -->
          <LoadingCom v-if="loadingViewHistory" class="loading"/>
          <!-- <div v-if="viewHistory.length > 0 && finishedViewHistory" class="no-more-data">
            没有更多数据
          </div> -->
        </el-tab-pane>
      </el-tabs>
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
.userInfo-page,.not-logged-in{
  padding-top:2.1vh;
}
.userInfo-page{
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 97%;
  position: absolute;
  overflow: auto;
  .userInfo-left,.userInfo-right{
    padding-right: 2.1vw;
  }
  .text{
    padding: rem(5) 0;
    color:var(--gray);
  }
.icon{
  width: rem(20);
  height: rem(20);
}
  .userInfo-left{
    .button-group{
      position: absolute;
      right: 0;
      bottom:0;
      display: flex;
      :deep(.el-form-item__content){
        justify-content: flex-end;
        padding-right: rem(10);
        padding-bottom: rem(10);
      }
    }
  }
  .userInfo-right{
    height: 100%;
    :deep(.el-tabs__header){
      background-color: var(--white);
      position: sticky;
      top: rem(-20);
    }
    :deep(.el-tabs__nav){
        width: 100%;
        justify-content: space-around;
    }
    :deep(.el-tabs__content){
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    }
    .userpost-list{
      // overflow: auto;
      // height: 400px;
      .userpost-item{
        cursor: pointer;
        border-bottom: 1px solid #ccc;
        padding: rem(10);
        .userpost-item-bottom{
          @extend .flex-between;
          @extend .body-s;
        }
      }
    }
    .userpost-item-bottom-like{
      display: flex;
    }
  }
  .el-form{
    height: rem(350);
    // overflow: hidden; // 隐藏溢出部分
    // text-overflow: ellipsis; // 溢出时显示省略号
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
    padding-left: rem(20);
  }
  .el-form-item{
    width: 50%;
    .form-username{
      @extend .ellipsis;
    }
  }
  .background-container{
    width: 80%;
    height: 100%;
    position: absolute;
    right: 0;
    .el-upload{
      width: 100%;
      height: 100%;
    }
    .background{
      width: 100%;
      height: 100%;
      object-fit: cover; // 保持图片比例并覆盖整个区域
      object-position: right; // 图片从右侧开始
      // transition: opacity 0.5s ease; // 渐变动画
    }
    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to left, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
      z-index: 0; // 渐变层在图片上方
    }
    .background-uploader {
    width: 100%;
    height: 100%;
    position: absolute;
    right: 0;
    :deep(.el-upload){
      width: 100%;
      height: 100%;
    }
  }

  .background-uploader-icon {
    font-size: rem(28);
    color: #8c939d;
  }
  }

.avatar-container {
  width: rem(100);
  height: rem(100);
  padding-top: rem(30);
  display: flex;
  flex-direction: column;
  margin-bottom: rem(20);
  .avatar{
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    position: relative;
  }
  .avatar-uploader {
    cursor: pointer;
    @extend .flex-center;
    overflow: hidden;
    z-index: 3;
    :deep(.el-upload){
      width: 100%;
      height: 100%;
    }
  }
}
.uploader-icon {
    font-size: rem(28);
    color: var(--white);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1; // 确保“+”号在头像上方
  }
}
</style>