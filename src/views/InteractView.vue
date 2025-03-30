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
import { addPost } from '@/api/social'
import { useStore } from 'vuex'
import { useInfiniteScroll } from '@/utils'
import type { UploadFile, UploadFiles } from 'element-plus';

const store = useStore()
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
    { min: 3, max: 50, message: '标题长度应在3到50个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 5, max: 500, message: '内容长度应在5到500个字符之间', trigger: 'blur' }
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
  const isVideo = file.type.startsWith('video/');
  if (!isVideo) {
    ElMessage.error('只能上传视频文件');
  }
  return isVideo;
};
// 视频文件发生变化时
const handleVideoChange = (file: UploadFile, fileList: UploadFiles) => {
  // console.log("视频文件发生变化", file, fileList);
  if (beforeVideoUpload(file.raw!)) {// 手动调用beforeVideoUpload
    postForm.value.video = file.raw!; // 存储视频文件对象
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


// 发布帖子
const addPostBtn = async () => {
  if (!postForm.value.coverImage) {
    ElMessage.error('封面图不能为空');
    return;
  }
  if (postForm.value.video && postForm.value.images.length > 0) {
    ElMessage.error('您只能选择上传图片组或视频，但不能同时上传两者');
    return;
  }
  console.log('检查图片组',postForm.value.images); // 检查图片组
  // console.log(postForm.value.video); // 检查视频

  // 创建 FormData 对象
  const formData = new FormData();
  formData.append('title', postForm.value.title);
  formData.append('content', postForm.value.content);
  // formData.append('user_id', userId.toString());
  formData.append('image', postForm.value.coverImage); // 封面图文件对象
  // 添加多张图片
  if (postForm.value.images.length > 0) {
    postForm.value.images.forEach((img:File) => {
      formData.append(`images`, img); // 确保这里正确添加了文件
    });
  }

  // 添加视频
  if (postForm.value.video) {
    formData.append('video', postForm.value.video); // 视频文件对象
  }

  // 调用 API 发布帖子
  try {
    await addPost(formData);
    ElMessage.success('帖子发布成功');
    showPostForm.value = false; // 关闭表单弹窗
    postForm.value = { title: '', content: '', coverImage: null, video: null, images: [],uploadType: 'image' }; // 清空表单
  } catch (error) {
    console.error('帖子发布失败：', error);
    ElMessage.error('帖子发布失败，请稍后再试');
  }
}
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
onMounted(() => {
    getSocialData()
    restoreSocialDataScroll()// 恢复滚动位置
    addSocialDataListeners()
    store.commit('loading/SET_LOADING', false);

});
onUnmounted(() => {
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
    <!-- 发布帖子的表单 -->
     <!-- :before-close="handleClose" -->
    <el-dialog
      title="发布帖子"
      v-model="showPostForm"
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
        <el-radio label="image">上传图片</el-radio>
        <el-radio label="video">上传视频</el-radio>
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
        >
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="primary-button" @click="showPostForm = false">取消</el-button>
          <el-button class="primary-button" @click="addPostBtn">发布</el-button>
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
  .header {
    @extend .flex-between;
    padding: 2.1vh 0;
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
    // max-height: 80vh; //高度限制
    height: 100%;
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