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
import { socket,CommentContent,socialData,getSocial,initializeWebSocket, likePost,addComment, addPost,getComments } from '@/api/social'
import { useStore } from 'vuex'
const store = useStore()
const userId = store.getters['user/getUserId']
console.log('userId', userId)

const getSocialData = async () => {
  const response = await getSocial()
  socialData.value = response
  console.log('帖子数据', socialData.value)
}
const getCommentsData = async () => {
  socialData.value.forEach(async (post) => {
    const response = await getComments(post.id);
    post.comments = response; // 将评论数据绑定到帖子对象
    console.log('评论数据', post);
  });
}

const addPostBtn = async() => {
  await addPost({
    title: '标题',
    content: '内容',
    user_id:userId,
  })
}

onMounted(() => {
  getSocialData()
  socialData.value.forEach(post => {
        initializeWebSocket(post.id, '', userId); // 初始化 WebSocket 连接
    });
})
onUnmounted(() => {
  if (socket) {
    socket.close();
  }
});
</script>
<template>
    <div class="interact-page">
        社交互动区
        <ul v-for="post in socialData" :key="post.id">
          <li>{{ post.title }}</li>
          <li>{{ post.content }}</li>
          <li>
            <el-button type="primary" @click="likePost(post.id,post)">点赞</el-button>
            <span>{{ post.likes_count }}</span>
          </li>
          <li><span>评论数:{{ post.comments_count }}</span></li>
          <li>
            <ul v-for="comment in post.comments" :key="comment.id">
               <li>
                {{ comment.user.username }}
              </li>
              <li>
                {{ comment.comment_content }}
              </li>
              <li>
                {{ comment.created_at }}
              </li>
            </ul>
          </li>
          <li>
            <el-input v-model="CommentContent" placeholder="评论内容" />
            <el-button type="primary" @click="addComment(post.id,CommentContent,userId)">评论</el-button>
          </li>
        </ul>
        <el-button type="primary" @click="addPostBtn">发布帖子</el-button>
        <el-button type="primary" @click="getCommentsData">获取评论</el-button>
    </div>
</template>

<style scoped lang="scss">

</style>