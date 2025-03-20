<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { isDataLoaded,socket,CommentContent,initializeWebSocket,getSocialById, getComments,likePost,handleAvatarPath } from '@/api/social';
import type { SocialData } from '@/@types/social';
import { formatDate } from '@/utils'
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute();
const router = useRouter();
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);//判断用户是否登录
const userId = computed(() => store.getters['user/getUserId']); // 用户ID从 Vuex 中获取
console.log(userId.value);
const postId = parseInt(route.params.id as string, 10); // 确保 postId 是数字类型
console.log(postId);
// 获取全局加载状态
const isLoading = computed(() => store.state.loading.isLoading);
console.log(isLoading.value);
// 直接从 Vuex 的 socialData 中获取帖子数据
const post = computed<SocialData | null>(() => {
  return store.state.post.socialData.find((item:SocialData) => item.id === postId) || null;
});
const isAnimating = ref(false); // 动画状态
const isHovered = ref(false);// 悬浮状态
// 判断用户是否点赞
const isLiked = computed(() => {
  return store.getters['post/isPostLiked'](postId);
});
// 点赞功能
const toggleLike = async (postId: number, post: SocialData) => {
  if (!post) return

      // 调用 likePost API，并传递 store
    // 触发动画
  isAnimating.value = true;
    await likePost(postId, post, store);
  // 动画结束，重置状态
    setTimeout(() => {
      isAnimating.value = false;
    }, 600);
};
// 返回按钮的逻辑
const goBack = () => {
  router.back(); // 返回到上一个页面
};

// 点击评论图标时切换评论区的显示状态
const toggleComments = () => {
  if (post.value) {
    post.value.isCommentsVisible = !post.value.isCommentsVisible;
  }
};
// 提交评论
const submitComment = async () => {
  if (!CommentContent.value.trim()) {
    ElMessage.error("评论内容不能为空");
    return;
  }
  if (CommentContent.value.length > 200) {
    ElMessage.error("评论内容不能超过200个字符");
    return;
  }
  // 发送 WebSocket 消息
  if (socket) {
    socket.send(
      JSON.stringify({
        type: "comment",
        user_id: userId.value,
        content: CommentContent.value,
        post_id: postId,
      })
    );
  }
  // 清空输入框
  CommentContent.value = "";
};
// 初始化 WebSocket 连接
const initializeWebSocketConnection = (postId: number, userId: number) => {
  initializeWebSocket(postId, userId)
};

onMounted(async () => {
  try {
    // 设置全局加载状态为 true
    store.commit('loading/SET_LOADING', true);
    // 初始化用户点赞记录
    await store.dispatch('post/initializeLikedPosts');

    // 同时获取帖子和评论数据
    const [postResponse, commentsResponse] = await Promise.all([
      getSocialById(postId),
      getComments(postId)
    ]);

    if (postResponse) {
      // 更新 Vuex 的 socialData 状态
      store.commit('post/updatePost', postResponse); // 更新特定帖子

      // 更新当前帖子的评论数据
      store.commit('post/updatePostComments', {
        postId: postResponse.id,
        comments: commentsResponse || []
      });

      isDataLoaded.value = true; // 标记数据加载完成
    } else {
      console.error('帖子数据为空');
      ElMessage.error('帖子加载失败，请稍后重试');
    }
  } catch (error) {
    console.error('加载帖子或评论失败:', error);
    ElMessage.error('加载帖子或评论失败，请稍后重试');
  } finally {
    // 设置全局加载状态为 false
    store.commit('loading/SET_LOADING', false);
  }

  // 在数据加载完成后初始化 WebSocket 连接
  if (isDataLoaded.value) {
    initializeWebSocketConnection(postId, userId.value); // 初始化 WebSocket 连接
  }
});

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
});
  // sessionStorage.removeItem("scrollPosition"); // 清除滚动位置
</script>
<template>
  <!-- 如果 isLoading 为 true，显示加载提示 -->
    <!-- <div v-if="isLoading" class="isLoading">
      <LoadingCom />
    </div> -->
    <!-- 如果 isLoading 为 false，显示正常内容 -->
  <div class="interact-detail w-full h-full body">
    <img class="image-bac w-full h-full" :src="post?.image" :alt="post?.title"/>
    <div class="interact-container">
    <!-- 返回按钮 -->
    <button @click="goBack" class="back-button header title">返回</button>
    <div class="content w-full h-full">
      <span class="image-container w-full h-full">
         <!-- 判断是否有图片组 -->
          <el-carousel v-if="post?.images && post.images.length > 0"  trigger="click">
            <el-carousel-item v-for="item in post?.images" :key="item.id">
                <img :src="item.image" alt="Image" class="carousel-image" />
            </el-carousel-item>
          </el-carousel>
          <!-- 判断是否有视频 -->
           <video v-else-if="post?.video" controls class="video-player w-full h-full">
             <source :src="post.video" type="video/mp4">
              您的设备不支持视频播放。
            </video>
            <!-- 默认情况：显示封面图 -->
             <img v-else :src="post?.image" :alt="post?.title"/>
      </span>
      <div class="post-info">
        <p>{{ post?.user.username }}</p>
        <p>{{ post?.title }}&nbsp;{{ post?.content }}</p>
      </div>
      <p class="time body-s">发布时间：{{ formatDate(post?.created_at) }}</p>
    </div>
    <div class="actions">
      <div class="actions-item">
        <span class="avatar-container"><img class="avatar" :src="post?.user.avatar" alt="用户头像" /></span>
        <span class="like" v-if="isAuthenticated" @click="toggleLike(postId, post!)" @mouseenter="isHovered = true" @mouseleave="isHovered = false"
        :class="{ 'liked-animation': isAnimating ,'liked-hover': isHovered && isLiked,'unliked-hover': isHovered && !isLiked}">
          <svg t="1741837068270" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1729" width="200" height="200">
          <path d="M704 128C833.621333 128 938.666667 234.666667 938.666667 384c0 298.666667-320 469.333333-426.666667 533.333333C405.333333 853.333333 85.333333 682.666667 85.333333 384c0-149.333333 106.666667-256 234.666667-256C399.36 128 469.333333 170.666667 512 213.333333c42.666667-42.666667 112.64-85.333333 192-85.333333z"
        :class="{ 'like-path': true, liked: isLiked }" p-id="1730"></path>
        </svg>
        </span>
        <span v-else @click="router.push('/login')">
          <svg  t="1741837068270" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1729" width="200" height="200">
          <path d="M704 128C833.621333 128 938.666667 234.666667 938.666667 384c0 298.666667-320 469.333333-426.666667 533.333333C405.333333 853.333333 85.333333 682.666667 85.333333 384c0-149.333333 106.666667-256 234.666667-256C399.36 128 469.333333 170.666667 512 213.333333c42.666667-42.666667 112.64-85.333333 192-85.333333z" p-id="1730"></path>
        </svg>
        </span>
        <span>{{ post?.likes_count }}</span>
      </div>
      <div class="actions-item" @click="toggleComments">
        <svg t="1741840016304" class="icon comment-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3669" width="200" height="200">
          <path d="M781.3 188.6H269.7c-59.6 0-108 51.1-108 113.9v312.8c0 64.8 50.3 119.5 109.9 119.5h120.2c30.4 32.8 109.8 117 109.8 117 6.2 6.7 14.9 10.5 23.9 10.5s17.6-3.8 24.6-11.3c0.6-0.7 62.1-72 105.6-116.2h123.7c59.6 0 110-54.7 110-119.5V302.6c-0.1-62.9-48.6-114-108.1-114z m-431.4 321c-25.2 0-45.6-20.4-45.6-45.6s20.4-45.6 45.6-45.6 45.6 20.4 45.6 45.6-20.4 45.6-45.6 45.6z m179.4 0c-25.2 0-45.6-20.4-45.6-45.6s20.4-45.6 45.6-45.6 45.6 20.4 45.6 45.6-20.4 45.6-45.6 45.6z m179.4 0c-25.2 0-45.6-20.4-45.6-45.6s20.4-45.6 45.6-45.6 45.6 20.4 45.6 45.6-20.4 45.6-45.6 45.6z" p-id="3670"></path>
        </svg>
        <span>{{ post?.comments_count }}</span>
      </div>
    </div>
    </div>
    <div v-if="post?.isCommentsVisible" class="comment-container">
      <div class="comments-section">
        <ul class="comments" v-if="post?.comments && post?.comments.length > 0">
        <li v-for="comment in post?.comments" :key="comment.id" class="comment-item">
          <img :src="handleAvatarPath(comment.user.avatar)" alt="用户头像" class="avatar"/>
          <span class="comment-right">
            <p class="username body-s">{{ comment.user.username }}</p>
            <p class="comment-content">{{ comment.comment_content }}</p>
            <p class="time body-s">{{ formatDate(comment.created_at) }}</p>
          </span>
        </li>
      </ul>
      <div v-else class="no-comments">期待您的第一条评论~</div>
      </div>
      <div class="comment-form">
      <el-input v-model="CommentContent" placeholder="评论内容" />
      <!-- <el-button type="primary" @click="addComment(postId, CommentContent, userId)">评论</el-button> -->
      <el-button class="primary-button" type="primary" @click="submitComment" :disabled="!isAuthenticated || !CommentContent.trim()">评论</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.interact-detail {
  display: flex;
  position: relative;
  color: var(--white);
  .like {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }
  .liked-hover{
      transform: scale(1.2);
      transition: all 0.3s;
    }
  .unliked-hover {
    animation: bellRing 0.9s both;
  }
  .like:before,
.like:after {
  position: absolute;
  content: "";
  width: 200%;
  left: 50%;
  height: 100%;
  transform: translateX(-50%);
  z-index: -1000;
  background-repeat: no-repeat;
}
.liked-animation::before {
  top: -40%;
  background-image: radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, transparent 20%, var(--red) 20%, transparent 30%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, var(--red) 15%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%);
  background-size: 10% 10%, 20% 20%, 15% 15%, 20% 20%, 18% 18%, 10% 10%, 15% 15%,
    10% 10%, 18% 18%;
  background-position: 50% 120%;
  animation: greentopBubbles 0.6s ease;
}
.liked-animation::after {
  bottom: -40%;
  background-image: radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, transparent 10%, var(--red) 15%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%),
    radial-gradient(circle, var(--red) 20%, transparent 20%);
  background-size: 15% 15%, 20% 20%, 18% 18%, 20% 20%, 15% 15%, 20% 20%, 18% 18%;
  background-position: 50% 0%;
  animation: greenbottomBubbles 0.6s ease;
}

  .like-path {
  fill: var(--white); // 默认颜色
  transition: fill 0.3s ease, transform 0.2s ease; // 颜色和缩放的过渡效果
}
  .like-path.liked {
  fill: var(--red); //点赞后的颜色
  }
  .interact-container {
    flex:1;
    position: relative;
  }
  .image-bac{
    position: absolute;
    object-fit: cover;
    filter: blur(rem(35));
  }
  .header{
    padding-top: 1.4vw;
    position: absolute;
    z-index: 1;
  }
  .content{
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); // 添加文字阴影
    position: relative;
    .image-container{
      display: flex;
      justify-content: center;
      .el-carousel{
        width: 100%;
        height: 100%;
        :deep(.el-carousel__container){
          width: 100%;
          height: 100%;
          .carousel-image{
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        }
      }
      img{
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
    }
    .post-info{
      position: absolute;
      bottom: rem(10);
    }
    .time{
      position: absolute;
      bottom: rem(10);
      right: 0;
    }
  }
    .actions{
      z-index: 1;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      flex-direction: column;
    .actions-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: rem(10);
      .avatar-container{
        width: rem(45);
        height: rem(45);
        padding-bottom: rem(30);
        .avatar{
          border-radius: 50%;
        }
      }
      .icon{
        width: rem(30);
        height: rem(30);
        fill: var(--white);
      }
      .comment-icon{
        @include hover{
          &:hover{
            animation: bellRing 0.9s both;
          }
        }
      }
    }
    }
    .comment-container{
      width: clamp(rem(200), 50%, rem(350));
      margin-left: rem(15);
      padding: rem(10);
      z-index: 1;
      box-shadow: -4px 0 5px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      .comments-section {
        flex: 1; // 让评论列表占满剩余空间
        overflow-y: auto; // 如果评论过多，允许滚动
      }
      .comments{
        // width: 100%;
        // overflow: auto;
        // position: fixed;
        // height: 100%;
        .comment-item{
          display: flex;
          img{
            width: rem(35);
            height: rem(35);
            border-radius: 50%;
          }
          .comment-right{
            width: 80%;
            padding-left: rem(10);
            .username{
              @extend .ellipsis;
              padding-bottom: rem(5);
              color: var(--black);
            }
            .comment-content{
              color: var(--black);
            }
            .time{
              color:var(--white);
            }
          }
        }
      }
      .comment-form{
        display: flex;
        align-items: flex-end;
        z-index: 3;
      }
    }
}
</style>