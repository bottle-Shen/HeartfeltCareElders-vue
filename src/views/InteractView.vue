<script setup lang="ts">
// onMounted(() => {
//     const script = document.createElement("script");
//     script.src = "https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.3/libs/cn/index.js";
//     script.onload = () => {
//         console.log("Script loaded successfully");
//         cozeWebSDK()
//     };
//     script.onerror = () => {
//         console.error("Failed to load script");
//     };
//     document.body.appendChild(script);
// });

// const cozeWebSDK = () => {
//     new CozeWebSDK.WebChatClient({
//     config: {
//       bot_id: '7475470927577481225',
//     },
//     componentProps: {
//       title: 'Coze',
//     },
//     auth: {
//       type: 'token',
//       token: 'pat_ipF9mac9DdsKhgusNYGUpbcfpU8Sr4Fbbv1Ybbd2VaDAw9h20TfHJGC3Q3tqLKy3',
//       onRefreshToken: function () {
//         return 'pat_ipF9mac9DdsKhgusNYGUpbcfpU8Sr4Fbbv1Ybbd2VaDAw9h20TfHJGC3Q3tqLKy3'
//       }
//     }
//   });
// }
import type {SocialData} from '@/@types/social'
import { addPost,getUploadProgress,clearTaskCache,getUserTasks } from '@/api/social'
import { useStore } from 'vuex'
import { useInfiniteScroll } from '@/utils'
import type { UploadFile, UploadFiles } from 'element-plus';

const store = useStore()
const router = useRouter();
const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])//判断用户是否登录
const showPostForm = ref(false); // 控制表单弹窗的显示
const socialData = computed(() => store.state.post.socialData)// 获取帖子数据
const socialDataContainerRef = ref<HTMLElement | null>(null)// 滚动容器的引用
const loading = computed(() => store.state.post.loading)// 获取加载状态
const finished = computed(() => store.state.post.finished)// 获取加载完成状态
// 初始化帖子数据
const getSocialData = async () => {
  await store.dispatch('post/fetchSocialData')
}
// 使用无限滚动逻辑
const { cleanup: cleanupSocialData, restoreScrollPosition: restoreSocialDataScroll,
  addScrollListeners: addSocialDataListeners,
  removeScrollListeners: removeSocialDataScroll
 } = useInfiniteScroll(socialDataContainerRef,
  async() => {
    // 获取当前状态
    const { finished, loading } = store.state.post;

    // 如果已经加载完成或正在加载中，则不触发加载更多
    if (finished || loading) {
      return;
    }

    // 调用加载更多数据的动作
    await store.dispatch('post/loadMoreData');
} , 300,'socialDataScrollPosition')

const recordViewHistory = (post: SocialData) => {
  // 记录观看历史
  store.dispatch('post/addToViewHistory', post);
};
// 表单数据
const postForm = ref({
  title: '',
  content: '',
  coverImage: null as File | null, // 封面图文件对象
  video: null as File | null, // 视频文件对象
  images: [] as File[], // 多张图片文件对象
  uploadType: 'image', // 默认选择上传图片
});

// 表单验证规则
const postFormRules = {
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
  ],
  coverImage: [
    { required: true, message: '封面图不能为空', trigger: 'change' }
  ]
}

const videoFileList = ref<UploadFiles>([]);
const imageFileList = ref<UploadFiles>([]);

// 封面图上传验证
const onCoverImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && file.type.startsWith('image/')) {
    postForm.value.coverImage = file; // 直接存储文件对象
  } else {
    ElMessage.error('请选择有效的图片文件');
  }
};

// 视频上传验证
const beforeVideoUpload = (file:File) => {
  // console.log("触发视频上传验证", file);
  const isVideo = file.type.startsWith('video/');// 检查文件类型
  if (!isVideo) {
    ElMessage.error('只能上传视频文件');
    return false; // 阻止文件选择
  }
  // 检查文件大小
  const maxSize = 60 * 1024 * 1024; // 60 MB
  if (file.size > maxSize) {
    ElMessage.error(`视频文件大小不能超过${ maxSize / (1024 * 1024)}MB`);
    return false; // 阻止文件选择
  }
  return true;// 允许上传
};
// 视频文件发生变化时
const handleVideoChange = (file: UploadFile, fileList: UploadFiles) => {
  // console.log("视频文件发生变化", file, fileList);
  // 手动调用 beforeVideoUpload 验证文件
  const isValid = beforeVideoUpload(file.raw!);
  if (isValid) {
    // 如果文件通过验证，存储视频文件对象
    postForm.value.video = file.raw!;
  } else {
    // 如果文件未通过验证，从 fileList 中移除该文件
    const index = fileList.findIndex(f => f.uid === file.uid);
    if (index !== -1) {
      fileList.splice(index, 1);
    }
  }
  videoFileList.value = fileList; // 同步到 videoFileList
};

// 多图片上传验证
const beforeImageUpload = (file:File) => {
  // console.log("触发图片上传验证", file);
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件');
  }
  return isImage;
};
// 图片组文件发生变化时
const handleImageChange = (file: UploadFile,fileList: UploadFiles) => {
  // console.log("图片组文件发生变化", file, fileList);
  // 过滤掉 undefined 值，并提取 raw 属性
  const validFiles = fileList
    .filter((item) => item.raw !== undefined)
    .map((item) => item.raw!);  // 使用非空断言操作符 (!) 确保 item.raw 是 File 类型
  postForm.value.images = validFiles;// 更新图片文件列表
  imageFileList.value = fileList; // 同步到 imageFileList
};
// 图片移除时
const handleImageRemove = (file: UploadFile,fileList: UploadFiles) => {
  // console.log("移除图片", file);
  const validFiles = fileList
    .filter((item) => item.raw !== undefined)
    .map((item) => item.raw!);
  postForm.value.images = validFiles; // 更新图片文件列表
  imageFileList.value = fileList; // 同步到 imageFileList
};
// 视频上传
const handleVideoSuccess = (file: UploadFile) => {
  if (file.raw) {
    postForm.value.video = file.raw; // 存储文件对象
  } else {
    console.warn("文件对象为空，无法存储");
  }
};

// 多图片上传
const handleImageSuccess = (file: File) => {
  postForm.value.images.push(file); // 存储文件对象
};

const handleVideoRemove = () => {// 移除视频
  postForm.value.video = null;
};
// -------------后端压缩-轮询-发布处理start---------------
import { compressImage, compressImages } from '@/utils/index';
// 后端处理压缩进度
const checkProgress = async (taskId: string,postId:number) => {
  try {
    const progressResponse = await getUploadProgress(taskId);
    const progress = progressResponse.data.progress;
    uploadProgress.value = progress; // 更新进度条的值为后端返回的进度

    if (progress < 100) {
      setTimeout(() => checkProgress(taskId, postId), 1000); // 每秒查询一次
    } else if (progress === 100) {
      console.log('视频压缩完成');
      uploading.value = false; // 确保在任务完成后设置 uploading 为 false
      await clearTaskCache(taskId);// 调用后端接口清理后端缓存
      // ElMessage.success('视频压缩完成');
      // 跳转到详情页
      if (postId) {
          ElMessage.success('帖子发布成功');
          router.push(`/interact/${postId}`);
      } else {
        ElMessage.error('帖子发布失败');
      }
    } else if (progress === -1) {
      console.error('视频压缩失败');
      uploading.value = false; // 确保在任务失败后设置 uploading 为 false
      await clearTaskCache(taskId);// 调用后端接口清理后端缓存
      // ElMessage.error('视频压缩失败');
    }
  } catch (error) {
    console.error('查询进度失败：', error);
    uploading.value = false; // 确保在查询失败后设置 uploading 为 false
    await clearTaskCache(taskId);// 调用后端接口清理后端缓存
    // ElMessage.error('查询进度失败');
  }
};
// 发布帖子
const addPostBtn = async () => {
  // 检查表单是否填写完整
  if (!postForm.value.coverImage) {
    ElMessage.error('封面图不能为空');
    return;
  }
  if (!postForm.value.title) {
    ElMessage.error('标题不能为空');
    return;
  }
  if (!postForm.value.content) {
    ElMessage.error('内容不能为空');
    return;
  }
  if (postForm.value.video && postForm.value.images.length > 0) {
    ElMessage.error('您只能选择一种，不能同时上传图片组和视频');
    return;
  }

  // console.log('检查图片组',postForm.value.images); // 检查图片组
  // console.log(postForm.value.video); // 检查视频
  

  // 调用 API 发布帖子
  try {

    // 压缩封面图和图片组
    const {coverImage,images} = await compressImages(postForm.value.coverImage, postForm.value.images, {
      maxWidth: 800,// 最大宽度
      maxHeight: 800,// 最大高度
      quality: 0.8,// 压缩质量,范围0-1
      resize: "cover",// 是否调整图片尺寸
    });
    // 检查文件大小，如果仍然较大，进一步调整压缩质量
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (coverImage.size > maxSize) {
      const furtherCompressedCoverImage = await compressImage(coverImage, {
        quality: 0.6, // 进一步降低压缩质量
      });
      postForm.value.coverImage = furtherCompressedCoverImage as File;
    }
    if (images.some(img => img.size > maxSize)) {
      postForm.value.images = await Promise.all(
        images.map(img => compressImage(img, {
          quality: 0.6, // 进一步降低压缩质量
        }))
      ) as File[];
    }

    // 更新表单数据
    postForm.value.coverImage = coverImage;
    postForm.value.images = images;


  // 创建 FormData 对象并上传
  const formData = new FormData();
  formData.append('title', postForm.value.title);
  formData.append('content', postForm.value.content);
  // formData.append('user_id', userId.toString());
  formData.append('image', postForm.value.coverImage,`image${Date.now()}.jpg`); // 封面图文件对象
  // 添加多张图片
  if (postForm.value.images.length > 0) {
    postForm.value.images.forEach((img:File) => {
      formData.append(`images`, img,`images${Date.now()}.jpg`); // 确保这里正确添加了文件
    });
  }

  // 添加视频
    if (postForm.value.video) {
    formData.append('video', postForm.value.video); // 视频文件对象
    }

    uploading.value = true;
    uploadProgress.value = 0;
    uploadStatus.value = 'uploading';// 设置为前端上传状态
    const response = await addPost(formData, (progress: number) => {
      uploadProgress.value = progress;// 更新前端的上传进度
    });
    if (postForm.value.video) {
      // 如果上传了视频，保存任务 ID 并开始轮询查询任务进度
      // 设置轮询获取后端任务进度
      const taskId = response.task_id;
        if (!taskId) {
          ElMessage.error('上传失败，请刷新重试');
          uploading.value = false;
          return;
        }
        uploadStatus.value = 'processing'; // 设置为后端处理状态
        checkProgress(taskId,response.id);// 定期查询任务进度
    } else {
      // 如果只上传了图片，直接跳转到详情页
      ElMessage.success('帖子发布成功');
      showPostForm.value = false;
      postForm.value = { title: '', content: '', coverImage: null, video: null, images: [], uploadType: 'image' };
      router.push(`/interact/${response.id}`); // 跳转到帖子详情页
    }
  } catch (error) {
    uploading.value = false;
    console.error('帖子发布失败：', error);
    ElMessage.error('帖子发布失败，请稍后再试');
  }
}
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref('uploading'); // 'uploading' 或 'processing'-表示当前的上传状态是前端上传还是后端处理
type StatusType = "" | "success" | "warning" | "exception" | "";
// 计算进度条的状态
const progressStatus = computed<StatusType>(() => {
  if (uploadProgress.value === 100) {
    return 'success';
  }
  return ""; // 默认无状态
});
// -------------后端压缩-轮询-发布处理end---------------

// const saveToDraft = () => {
//   const draftData = {
//     title: postForm.value.title,
//     content: postForm.value.content,
//     // 不保存文件对象，因为它们无法存储到 localStorage
//   };

//   // 从 localStorage 获取现有的草稿列表
//   const drafts = JSON.parse(localStorage.getItem('drafts') || '[]');

//   // 添加新的草稿
//   drafts.push(draftData);

//   // 保存到 localStorage
//   localStorage.setItem('drafts', JSON.stringify(drafts));

//   ElMessage.success('帖子已保存到草稿箱');
// };
// const handleClose = (done:() => void) => {
//   if (postForm.value.title || postForm.value.content || postForm.value.coverImage || postForm.value.video || postForm.value.images.length > 0) {
//     ElMessageBox.confirm('您有未保存的帖子内容，是否保存到草稿箱？', '提示', {
//       confirmButtonText: '保存到草稿箱',
//       cancelButtonText: '取消',
//       type: 'warning'
//     }).then(() => {
//       // 保存到草稿箱
//       saveToDraft();
//       done();
//     }).catch(() => {
//       // 用户取消保存
//       done();
//     });
//   } else {
//     done();
//   }
// };
// 关闭表单弹窗
// const handleClose = () => {
//   showPostForm.value = false
// }

// 在组件中只初始化一个 WebSocket 连接
onMounted(async () => {
  try {
        const userTasks = await getUserTasks();
        if (userTasks.tasks.length > 0) {
            const taskId = userTasks.tasks[0].task_id;
            const postId = userTasks.tasks[0].post_id;
            checkProgress(taskId, postId);// 调用 checkProgress 函数，检查用户未完成的上传任务
        }
    } catch (error) {
        console.error('获取用户任务失败：', error);
        // ElMessage.error('获取用户任务失败，请稍后再试');
    }
    getSocialData()
    restoreSocialDataScroll()// 恢复滚动位置
    addSocialDataListeners()
    store.commit('loading/SET_LOADING', false);

});
onUnmounted(() => {
  // 离开组件时，重置用户帖子和点赞帖子的状态和数据
  store.commit('post/SET_CURRENT_PAGE', 1);// 重置当前页码
  store.commit('post/SET_LOADING', false);// 重置加载状态
  store.commit('post/SET_FINISHED', false);// 重置完成状态
  store.commit('post/CLEAR_LOADED_PAGES');// 重置缓存页码
  // 移除滚动事件监听
  removeSocialDataScroll()
  // 清理资源
  cleanupSocialData()
});
</script>
<template>
  <div class="interact-page h-full">
    <div class="header">
      <h1>快来发布属于你的帖子吧~</h1>
      <div class="actions-bar">
        <el-button class="primary-button" v-if = "isAuthenticated" @click="showPostForm = true">点我发布</el-button>
        <el-button class="primary-button info"  v-else disabled>请登录后操作</el-button>
      </div>
    </div>
    <!-- 进度条 -->
    <div class="progress-bac" v-if="uploading">
      <div class="demo-progress">
        <el-progress type="circle" :percentage="uploadProgress"
        :status="progressStatus"
        />
        <p v-if="uploadStatus === 'uploading'">正在上传文件，请耐心等待~</p>
        <p v-if="uploadStatus === 'processing'">文件处理中，请耐心等待~</p>
      </div>
    </div>
    <!-- 发布帖子的表单 -->
     <!-- :before-close="handleClose" -->
    <el-dialog
      title="发布帖子"
      v-model="showPostForm"
      :close-on-click-modal="false"
    >
      <el-form
      class="w-full"
        ref="postFormRef"
        :model="postForm"
        :rules="postFormRules"
      >
      <el-form-item label="封面图" prop="coverImage" required>
        <input type="file" @change="onCoverImageChange" accept="image/*">
      </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="postForm.title"
            placeholder="请输入帖子标题"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            v-model="postForm.content"
            placeholder="请输入帖子内容"
            maxlength="500"
            show-word-limit
            :rows="15"
          ></el-input>
        </el-form-item>
        <!-- 选择上传图片或视频 -->
         <el-form-item label="上传类型" prop="uploadType">
      <el-radio-group v-model="postForm.uploadType">
        <el-radio value="image">上传图片</el-radio>
        <el-radio value="video">上传视频</el-radio>
      </el-radio-group>
    </el-form-item>
    <!-- 视频上传组件 -->
        <el-form-item v-if="postForm.uploadType === 'video'" label="视频" prop="video">
        <el-upload
          ref="videoUpload"
          :limit="1"
          list-type="text"
          accept="video/*"
          :on-success="handleVideoSuccess"
          :before-upload="beforeVideoUpload"
          :on-remove="handleVideoRemove"
          :on-change="handleVideoChange"
          :auto-upload="false"
          :file-list="videoFileList"
        >
          <el-button class="primary-button">上传视频</el-button>
        </el-upload>
      </el-form-item>
      <!-- 图片上传组件 -->
      <el-form-item v-if="postForm.uploadType === 'image'" label="图片" prop="images">
        <el-upload
          ref="imageUpload"
          :limit="5"
          list-type="picture-card"
          accept="image/*"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
          :on-remove="handleImageRemove"
          :on-change="handleImageChange"
          :auto-upload="false"
          :file-list="imageFileList"
          multiple
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button class="primary-button" @click="showPostForm = false" :disabled="uploading">取消</el-button>
          <el-button class="primary-button" @click="addPostBtn" :disabled="uploading">发布</el-button>
        </span>
      </template>
    </el-dialog>
    <div ref="socialDataContainerRef" class="post-list">
      <div v-for="(post,index) in socialData" :key="post.id" class="post-item">
        <router-link :to="`/interact/${post.id}`" @click="recordViewHistory(post)">
          <!-- 添加对post和post.user的校验，否则在重新回到列表页时user字段为undefined报错。 -->
          <CardsCom v-if="post && post.user" :post="post" :index="index"></CardsCom>
        </router-link>
      </div>
      <!-- 加载状态 -->
        <LoadingCom v-if="loading" class="loading"/>
        <!-- 没有更多数据 -->
        <div v-if="finished" class="finished">没有更多数据了</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.interact-page {
  .progress-bac{
    // background-color: rgba(0, 0, 0, 0.5);
    background: linear-gradient(179deg, var(--bg-one) 0%, var(--bg-two) 100%);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index:9999;
    .demo-progress{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index:9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-progress{
    width: 30vw;
    height: auto;
  }
  :deep(.el-progress-circle) {
  width: 100% !important; // 设置宽度-覆盖element默认样式
  height: 100% !important; // 设置高度-覆盖element默认样式
  }
  :deep(.el-progress__text){
    font-size: clamp(rem(16),2.5vw,rem(50)) !important;// 设置大小-覆盖element默认样式
  }
  p{
    font-size: clamp(rem(16),2.5vw,rem(50));
    padding-top: rem(50);
  }
}
  }
  .header {
    @extend .flex-between;
    padding: 2.1vh;
  }
  .post-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap:rem(0) rem(80);
    // padding-left: rem(20);
    // padding-top: rem(20);
    position: fixed;
    // right: 0;
    // top: 0;
    height: 80%;
    overflow: auto;
  }
  .el-form-item {
    padding-bottom: rem(18);
    &:last-child{
      padding-bottom: rem(0);
    }
  }
  .post-item {
    // max-width: rem(315);
    padding-bottom: rem(30);
    // padding-right: rem(80);
    // padding: rem(30) 0;
  }
}
</style>