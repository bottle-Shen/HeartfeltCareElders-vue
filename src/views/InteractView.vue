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
// import type {SocialData} from '@/@types/social'
import { addPost } from '@/api/social'
import { useStore } from 'vuex'
import { useInfiniteScroll } from '@/utils'
const store = useStore()
const userId = store.getters['user/getUserId']//获取用户id
const isAuthenticated = computed(() => store.getters['user/isAuthenticated'])//判断用户是否登录
const showPostForm = ref(false); // 控制表单弹窗的显示
const socialData = computed(() => store.state.post.socialData)// 获取帖子数据
const containerRef = ref<HTMLElement | null>(null)// 滚动容器的引用
const loading = computed(() => store.state.post.loading)// 获取加载状态
const finished = computed(() => store.state.post.finished)// 获取加载完成状态
// 初始化帖子数据
const getSocialData = async () => {
  await store.dispatch('post/fetchSocialData')
}
// 使用无限滚动逻辑
const { handleScroll, cleanup, restoreScrollPosition } = useInfiniteScroll(containerRef,
  async() => {
    // 获取当前状态
    const { finished, loading } = store.state.post;

    // 如果已经加载完成或正在加载中，则不触发加载更多
    if (finished || loading) {
      return;
    }

    // 调用加载更多数据的动作
    await store.dispatch('post/loadMoreData');
} , 300)
// 表单数据
const postForm = ref({
  title: '',
  content: '',
})
// 表单验证规则
const postFormRules = {
  title: [
    { required: true, message: '请输入帖子标题', trigger: 'blur' },
    { min: 3, max: 50, message: '标题长度应在3到50个字符之间', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入帖子内容', trigger: 'blur' },
    { min: 5, max: 500, message: '内容长度应在5到500个字符之间', trigger: 'blur' }
  ]
}
// 发布帖子
const addPostBtn = async() => {
  await addPost({
    title: postForm.value.title,
    content: postForm.value.content,
    user_id:userId,
  })
  ElMessage.success('帖子发布成功')
  showPostForm.value = false// 关闭表单弹窗
  postForm.value = { title: '', content: '' }// 清空表单
}

// 关闭表单弹窗
const handleClose = () => {
  showPostForm.value = false
}

// 在组件中只初始化一个 WebSocket 连接
onMounted(() => {
  getSocialData()
  restoreScrollPosition()
  const scrollContainer = containerRef.value;
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", handleScroll)
  } else {
    window.addEventListener("scroll", handleScroll)
  }
});
onUnmounted(() => {
  const scrollContainer = containerRef.value
  if (scrollContainer) {// 移除滚动事件监听
    scrollContainer.removeEventListener("scroll", handleScroll)
  } else {
    window.removeEventListener("scroll", handleScroll)
  }
  cleanup()// 清理资源
});
</script>
<template>
  <div class="interact-page h-full">
    <div class="header">
      <h1>快来发布属于你的帖子吧~</h1>
      <div class="actions-bar">
        <el-button v-if = "isAuthenticated" type="primary" @click="showPostForm = true">点我发布</el-button>
        <el-button v-else type="info" disabled>请登录后操作</el-button>
      </div>
    </div>
    <!-- 发布帖子的表单 -->
    <el-dialog
      title="发布帖子"
      v-model="showPostForm"
      :before-close="handleClose"
    >
      <el-form
        ref="postFormRef"
        :model="postForm"
        :rules="postFormRules"
      >
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
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showPostForm = false">取消</el-button>
          <el-button type="primary" @click="addPostBtn">发布</el-button>
        </span>
      </template>
    </el-dialog>
    <div ref="containerRef" class="post-list">
      <div v-for="(post,index) in socialData" :key="post.id" class="post-item">
        <keep-alive>
        <router-link :to="`/interact/${post.id}`">
          <!-- 添加对post和post.user的校验，否则在重新回到列表页时user字段为undefined报错。 -->
          <CardsCom v-if="post && post.user" :post="post" :index="index"></CardsCom>
        </router-link></keep-alive>
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
  .loading{
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }
  .header {
    @extend .flex-between;
    padding: 2.1vh 0;
    .el-button{
      // @extend .button;
    }
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
    max-height: 80vh; //高度限制
    overflow: auto;
  }
:deep(.el-dialog){
  width:80%;
  min-width: rem(300);
  height: 70% !important;
  min-height: rem(500);
 .el-form{
    width: 100%;
  }
  .el-button{
    @extend .button;
  }
  
}
  .post-item {
    max-width: rem(315);
    padding-bottom: rem(30);
    // padding-right: rem(80);
    // padding: rem(30) 0;
  }
}
</style>