<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, type RouteLocationNormalized } from 'vue-router';
import { deletePost,updatePost,isDataLoaded,socket,CommentContent,initializeWebSocket,getSocialById, getComments,likePost,handleAvatarPath } from '@/api/social';
import type { SocialData } from '@/@types/social';
import { formatDate } from '@/utils'
import type { ElForm } from 'element-plus';
import { useStore } from 'vuex';

const store = useStore();
const route = useRoute();
const router = useRouter();
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);//判断用户是否登录
const userId = computed(() => store.getters['user/getUserId']); // 用户ID从 Vuex 中获取
const postId = ref<number>(parseInt(route.params.id as string, 10)); // 确保 postId 是数字类型,10 表示十进制
// console.log(postId);
const showPostForm = ref(false); // 控制表单弹窗的显示
const isMoreShow = ref(false);// 控制更多按钮的显示
const MoreBtn = (event: MouseEvent) => {
  if (post.value?.isCommentsVisible) {
    // 如果 commentContainer 显示，则不执行返回操作
    return;
  }
  event.stopPropagation(); // 阻止事件冒泡--避免触发父组件的点击其它位置关闭弹窗事件
  isMoreShow.value = !isMoreShow.value;
}
// 表单数据
const postForm = ref({
  title: '',
  content: '',
  coverImage: null as File | null, // 封面图文件对象
  coverImageUrl: '',
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
// 直接从 Vuex 的 socialData 中获取帖子数据
const post = computed<SocialData | null>(() => {
  return store.state.post.socialData.find((item:SocialData) => item.id === postId.value) || null;
});
const isAnimating = ref(false); // 动画状态
const isHovered = ref(false);// 悬浮状态
// 判断用户是否点赞
const isLiked = computed(() => {
  return store.getters['post/isPostLiked'](postId.value);
});
// 点赞功能
const toggleLike = async (postId: number, postData: SocialData) => {
  if (isMoreShow.value || post.value?.isCommentsVisible) {
    // 如果 moreBox 或 commentContainer 显示，则不执行点赞操作
    return;
  }
  if (!postData) return

      // 调用 likePost API，并传递 store
    // 触发动画
  isAnimating.value = true;
    await likePost(postId, postData, store);
  // 动画结束，重置状态
    setTimeout(() => {
      isAnimating.value = false;
    }, 600);
};
// 返回按钮的逻辑
const goBack = () => {
  if (isMoreShow.value || post.value?.isCommentsVisible) {
    // 如果 moreBox 或 commentContainer 显示，则不执行返回操作
    return;
  }
  router.back(); // 返回到上一个页面
};

// 移动端评论区显示时隐藏点赞图标等样式的变化-控制 actions 和 post-infotime 的显示和隐藏
const adjustActionsAndInfoTime = () => {
  // 判断评论区是否显示，如果显示则隐藏点赞图标等样式
    const actions = document.querySelector<HTMLElement>('.actions');
    const postInfotime = document.querySelector<HTMLElement>('.post-infotime');
    if (!actions || !postInfotime) return;
    const viewportWidth = window.innerWidth;// 获取视口宽度
    const mobileBreakpoint = parseFloat(// 获取 CSS 自定义属性的值
      getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-mobile-device')
    );
  // 根据视口宽度和评论区的显示状态调整样式
  if (viewportWidth <= mobileBreakpoint) {
    if (post.value.isCommentsVisible) {
      console.log('评论区显示，隐藏点赞图标和发布时间');
      actions.classList.add('mobile-hidden');
      postInfotime.classList.add('mobile-hidden');
    } else {
      console.log('评论区隐藏，显示点赞图标和发布时间');
      actions.classList.remove('mobile-hidden');
      postInfotime.classList.remove('mobile-hidden');
    }
  } else {
    // 如果不是移动端，始终显示点赞图标和发布时间
    actions.classList.remove('mobile-hidden');
    postInfotime.classList.remove('mobile-hidden');
  }
};
// 点击评论图标时切换评论区的显示状态
const toggleComments = (event: MouseEvent) => {
  if (isMoreShow.value) {
    // 如果 moreBox 显示，则不执行返回操作
    return;
  }
  event.stopPropagation(); // 阻止事件冒泡--避免触发父组件的点击其它位置关闭弹窗事件
  if (post.value) {
    post.value.isCommentsVisible = !post.value.isCommentsVisible;
    // 调整样式
    adjustActionsAndInfoTime();
  }
};
// 提交评论
const submitComment = async () => {
  // console.log('提交评论');
  if (!isAuthenticated.value) {
    ElMessage.error("请先登录");
    return;
  }
  if (!CommentContent.value.trim()) {
    ElMessage.error("评论内容不能为空");
    return;
  }
  // if (CommentContent.value.length > 200) {
  //   ElMessage.error("评论内容不能超过200个字符");
  //   return;
  // }
  // 发送 WebSocket 消息
  if (socket) {
    socket.send(
      JSON.stringify({
        type: "comment",
        user_id: userId.value,
        content: CommentContent.value,
        post_id: postId.value,
      })
    );
  }
  // 清空输入框
  CommentContent.value = "";
};
import { debounce } from '@/utils/index';
// 使用自定义 debounce 函数-enter 键提交评论
const debouncedSubmitComment = debounce(submitComment, 500);
// 初始化 WebSocket 连接
const initializeWebSocketConnection = (postId: number, userId: number) => {
  initializeWebSocket(postId, userId)
};
const loadPostAndComments = async (postId: number,route:RouteLocationNormalized) => {
  try {
    // 设置全局加载状态为 true
    store.commit('loading/SET_LOADING', true);
    // 初始化用户点赞记录
    await store.dispatch('post/initializeLikedPosts');
    // 根据路由名称决定加载逻辑
    if (route.name === 'searchPostDetail') {
      // 如果是从搜索页面进入，从 Vuex 的 searchPostList 获取帖子数据
      const searchPost = store.state.post.searchPostList.find((item: SocialData) => item.id === postId);
      if (searchPost) {
        store.commit('post/updatePost', searchPost); // 更新 Vuex 的 socialData 状态
      } else {
        console.error('搜索帖子数据为空');
        ElMessage.error('帖子加载失败，请稍后重试');
        return; // 提前返回，避免继续加载评论
      }
    } else if (route.name === 'interactDetail') {
      // 如果是从单页社交互动帖子进入，从后端获取帖子数据
      const postResponse = await getSocialById(postId);
      if (postResponse) {
        store.commit('post/updatePost', postResponse); // 更新 Vuex 的 socialData 状态
      } else {
        console.error('帖子数据为空');
        ElMessage.error('帖子加载失败，请稍后重试');
        return; // 提前返回，避免继续加载评论
      }
    }


    // 同时获取帖子和评论数据
    // const [postResponse, commentsResponse] = await Promise.all([
    //   getSocialById(postId),
    //   getComments(postId)
    // ]);

    // if (postResponse) {
    //   // 更新 Vuex 的 socialData 状态
    //   store.commit('post/updatePost', postResponse); // 更新特定帖子

    //   // 更新当前帖子的评论数据
    //   store.commit('post/updatePostComments', {
    //     postId: postResponse.id,
    //     comments: commentsResponse || []
    //   });
    // 无论从哪个路由进入，都加载评论数据
    const commentsResponse = await getComments(postId);
    if (commentsResponse) {
      store.commit('post/updatePostComments', {
        postId: postId,
        comments: commentsResponse || []
      });
    } else {
      console.error('评论数据为空');
      ElMessage.error('评论加载失败，请稍后重试');
    }


      isDataLoaded.value = true; // 标记数据加载完成
  } catch (error) {
    console.error('加载帖子或评论失败:', error);
    ElMessage.error('加载帖子或评论失败，请稍后重试');
  } finally {
    // 设置全局加载状态为 false
    store.commit('loading/SET_LOADING', false);
  }
};
// 获取帖子的发布人ID
const postAuthorId = computed(() => {
  const post = store.state.post.socialData.find((item: SocialData) => item.id === postId.value);
  return post ? post.user.id : null; // 获取发布者的 id
});
// 判断当前用户是否是帖子作者
const isPostAuthor = computed(() => {
  return userId.value === postAuthorId.value; // 比较当前用户 ID 和帖子作者 ID
});
// 修改帖子
const editPost = () => {
  if (post.value) {
    postForm.value = {
      title: post.value.title,
      content: post.value.content,
      coverImage: null, // 封面图文件对象，初始为空
      coverImageUrl: post.value.image // 保存封面图的 URL，用于显示
    };
  }
  showPostForm.value = true; // 显示修改帖子表单
};
// 封面图上传验证
const onCoverImageChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file && file.type.startsWith('image/')) {
    postForm.value.coverImage = file; // 直接存储文件对象
    // 使用 FileReader 读取文件内容并更新封面图预览
    const reader = new FileReader();
    reader.onload = (e) => {
      postForm.value.coverImageUrl = e.target?.result as string; // 更新封面图预览
    };
    reader.readAsDataURL(file);
  } else {
    ElMessage.error('请选择有效的图片文件');
    postForm.value.coverImage = null; // 清空无效的文件选择
    postForm.value.coverImageUrl = ''; // 清空封面图预览
  }
};
const postFormRef = ref<InstanceType<typeof ElForm> | null>(null);// 获取表单引用
// 提交修改帖子表单
const submitEditPost = async () => {
  try {
    // 确保 postFormRef.value 不为 null
    if (!postFormRef.value) {
      console.error('表单引用未初始化');
      ElMessage.error('表单验证失败，请稍后再试');
      return;
    }
    // 验证表单
    const isValid = await postFormRef.value.validate();
    if (!isValid) {
      ElMessage.error('表单验证失败，请检查输入内容');
      return; // 如果验证不通过，直接返回
    }
    const formData = new FormData();
    formData.append('title', postForm.value.title);
    formData.append('content', postForm.value.content);
    if (postForm.value.coverImage) {
      // 添加封面图
      formData.append('image', postForm.value.coverImage);
    } else if (post.value && post.value.image) {
      // 如果没有新的封面图文件，传递原始封面图的 URL 或文件名
      formData.append('image', post.value.image);
    }
    // 调用更新帖子的 API
    await updatePost(postId.value, formData);
    ElMessage.success('帖子修改成功');
    showPostForm.value = false; // 关闭表单
    isMoreShow.value = false
    // 重新加载数据
    await loadPostAndComments(postId.value,route);
  } catch (error) {
    console.error('帖子修改失败：', error);
    ElMessage.error('帖子修改失败，请稍后再试');
  }
};

// 取消修改帖子
const cancelEditPost = () => {
  showPostForm.value = false; // 关闭表单
  if (postFormRef.value) {
    postFormRef.value.resetFields(); // 重置表单数据和验证状态
  }
};
// 删除帖子
const deleteUserPost = async () => {
  try {
    // 调用删除帖子的 API
    await deletePost(postId.value);
    ElMessage.success('帖子删除成功');
    if (postFormRef.value) {
      postFormRef.value.resetFields(); // 重置表单数据和验证状态
    }
    router.push('/userInfo?tab=first'); // 跳转到主页或其他页面
  } catch (error) {
    console.error('帖子删除失败：', error);
    ElMessage.error('帖子删除失败，请稍后再试');
  }
};
// 弹窗关闭时重置表单
const resetFormOnClose = () => {
  if (postFormRef.value) {
    postFormRef.value.resetFields(); // 重置表单数据和验证状态
  }
};
// 点击页面其他地方隐藏
const handleClickOutside = (event: MouseEvent) => {
  const moreBox = document.querySelector('.more-box');
  const commentContainer = document.querySelector('.comment-container');
  // 如果 moreBox 被显示，且点击位置不在 moreBox 内部，则隐藏 moreBox
  if (isMoreShow.value && moreBox && !moreBox.contains(event.target as Node)) {
    isMoreShow.value = false;
    // console.log('点击了页面其他地方');
  }
  // 如果 commentContainer 被显示，且点击位置不在 commentContainer 内部，则隐藏 commentContainer
  if (post.value?.isCommentsVisible && commentContainer && !commentContainer.contains(event.target as Node)) {
    if (post.value) { // 确保 post.value 不为 null
      post.value.isCommentsVisible = false;
      // 调整样式
      adjustActionsAndInfoTime();
    }
  }
};
// 监听 isMoreShow 的变化
watch(isMoreShow, (newVal) => {
  if (newVal) {
    // 当 isMoreShow 为 true 时绑定事件监听器
    document.addEventListener('click', handleClickOutside);
  } else {
    // 当 isMoreShow 为 false 时移除事件监听器
    document.removeEventListener('click', handleClickOutside);
  }
});
// 监听 post.value?.isCommentsVisible 的变化
watch(() => post.value?.isCommentsVisible, (newVal) => {
  if (newVal) {
    // 当评论框显示时绑定事件监听器
    document.addEventListener('click', handleClickOutside);
  } else {
    // 当评论框隐藏时移除事件监听器
    document.removeEventListener('click', handleClickOutside);
  }
});
onMounted(async () => {
  // 在组件挂载时加载帖子和评论数据
  await loadPostAndComments(postId.value,route);
  // 在数据加载完成后初始化 WebSocket 连接
  if (isDataLoaded.value) {
    initializeWebSocketConnection(postId.value, userId.value); // 初始化 WebSocket 连接
  }
  nextTick(() => {// 确保在 DOM 加载完成后调用
    initializeTextTruncation();
    setupResizeObserver(); // 截断文本并设置按钮显示状态
  });
  // 初始化时也调用一次，确保初始状态正确
  adjustActionsAndInfoTime();
  // 绑定窗口大小变化事件
  window.addEventListener('resize', adjustActionsAndInfoTime);
});

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
  if (resizeObserver) {
    resizeObserver.disconnect(); // 停止 ResizeObserver 监听
  }
  document.removeEventListener('click', handleClickOutside);
  window.removeEventListener('resize', adjustActionsAndInfoTime);
});

// 监听路由参数 id 的变化
watch(() => route.params.id, (newId) => {
  const newPostId = parseInt(newId as string, 10);
  console.log('postId changed:', newPostId);
  postId.value = newPostId;

  // 关闭旧的 WebSocket 连接
  if (socket) {
    socket.close();
  }

  // 初始化新的 WebSocket 连接
  initializeWebSocketConnection(newPostId, userId.value);

  // 重新加载帖子和评论数据
  loadPostAndComments(newPostId,route);
});

// --------文本截断和展开按钮显示控制start---------
import { truncateText } from '@/utils'

const isExpanded = ref(false); // 控制文本展开状态
const isButtonVisible = ref(true); // 控制展开按钮的显示状态
// 调用函数，对文本进行截断，限制行数
function initializeTextTruncation() {
  truncateText('.title-content', 2); // 应用省略号
}

// 检查是否有截断样式
const isOverflow = () => {
  const elements = document.querySelectorAll('.title-content');
  let hasOverflow = false;
  elements.forEach((el) => {
    const element = el as HTMLElement;
    if (element.scrollHeight > element.clientHeight) {
      hasOverflow = true;
    }
  });
  return hasOverflow;
}

let resizeObserver: ResizeObserver | null = null;
 // 使用 ResizeObserver 监听窗口大小变化-显示隐藏展开按钮
const setupResizeObserver = () => {
  resizeObserver = new ResizeObserver(() => {
    if (isOverflow()) {
      // console.log('有截断样式');
      isButtonVisible.value = true;
    } else {
      // console.log('没有截断样式');
      isButtonVisible.value = false;
    }
  });
  resizeObserver.observe(document.body);
};
const toggleText = async() => {
  isExpanded.value = !isExpanded.value; // 切换展开状态
  if (!isExpanded.value) {
    // 如果状态变为未展开，重新应用文本截断
    nextTick(() => {
      initializeTextTruncation();
    });
  } else {
    // 如果状态变为展开，移除截断样式
    const elements = document.querySelectorAll('.title-content');
    elements.forEach((el) => {
      const element = el as HTMLElement; // 强制转换为 HTMLElement
      element.style.overflow = '';
      element.style.textOverflow = '';
      element.style.display = '';
      element.style.webkitLineClamp = '';
    });
  }
};
// --------文本截断和展开按钮显示控制end---------
</script>
<template>
  <div class="interact-detail w-full h-full body">
    <el-dialog
      title="修改帖子"
      v-model="showPostForm"
      @closed="resetFormOnClose"
    >
      <el-form
      class="w-full"
        ref="postFormRef"
        :model="postForm"
        :rules="postFormRules"
      >
      <el-form-item label="封面图" prop="coverImage" required>
        <!-- 自定义按钮 -->
        <label for="custom-file-upload" class="custom-file-upload">
          修改封面图
        </label>
        <!-- 隐藏的原生文件输入 -->
        <input id="custom-file-upload" type="file" @change="onCoverImageChange" accept="image/*" style="display: none;">
        <div v-if="postForm.coverImageUrl">
            <img :src="postForm.coverImageUrl" alt="封面图" style="max-width: 100%; height: auto;">
          </div>
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
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="primary-button" @click="cancelEditPost">取消</el-button>
          <el-button class="primary-button" @click="submitEditPost">修改</el-button>
        </span>
      </template>
    </el-dialog>
    <img class="image-bac w-full h-full" :src="post?.image" :alt="post?.title"/>
    <div class="interact-container">
    <!-- 返回按钮 -->
    <button @click="goBack" class="back-button header title">返回</button>
    <div class="content w-full h-full">
      <span class="image-container w-full">
         <!-- 判断是否有图片组 -->
          <el-carousel v-if="post?.images && post.images.length > 0"  trigger="click">
            <el-carousel-item v-for="item in post?.images" :key="item.id">
                <img :src="item.image" alt="Image" class="carousel-image" />
            </el-carousel-item>
          </el-carousel>
          <!-- 判断是否有视频 -->
           <video v-else-if="post?.video" controls class="video-player w-full h-full" autoplay>
             <source :src="post.video" type="video/mp4">
              您的设备不支持视频播放。
            </video>
            <!-- 默认情况：显示封面图 -->
             <img v-else :src="post?.image" :alt="post?.title"/>
      </span>
      <div class="post-infotime">
        <div class="post-info">
        <p class="info-username">{{ post?.user.username }}</p>
        <p class="title-content">{{ post?.title }}&nbsp;{{ post?.content }}</p>
        <el-button v-if="isButtonVisible" class="link-button toggle-button" link @click="toggleText">{{ isExpanded ? '收起' : '展开' }}</el-button>
      </div>
      <p class="time body-s">发布时间：{{ formatDate(post?.created_at) }}</p>
      </div>
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
      <div v-if="isPostAuthor" class="actions-item" @click="MoreBtn">
        <svg t="1743436148619" class="icon comment-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2612" width="200" height="200"><path d="M512 64.7C265.3 64.7 64.7 265.3 64.7 512S265.3 959.3 512 959.3 959.3 758.7 959.3 512 758.7 64.7 512 64.7z m275.2 722.5c-35.7 35.7-77.4 63.8-123.7 83.4-48 20.3-99 30.6-151.5 30.6s-103.5-10.3-151.5-30.6c-46.3-19.6-88-47.7-123.7-83.4s-63.8-77.4-83.4-123.7c-20.3-48-30.6-99-30.6-151.5s10.3-103.5 30.6-151.5c19.6-46.3 47.7-88 83.4-123.7s77.4-63.8 123.7-83.4c48-20.3 99-30.6 151.5-30.6s103.5 10.3 151.5 30.6c46.3 19.6 88 47.7 123.7 83.4s63.8 77.4 83.4 123.7c20.3 48 30.6 99 30.6 151.5s-10.3 103.5-30.6 151.5c-19.6 46.4-47.6 88-83.4 123.7z" p-id="2613"></path><path d="M550.2 451.6c-9.3-5.4-19.8-8.1-30.3-8.1s-21 2.7-30.3 8.1c-18.7 10.8-30.3 30.9-30.3 52.5 0 33.4 27.2 60.6 60.6 60.6 33.4 0 60.6-27.2 60.6-60.6 0-21.6-11.6-41.7-30.3-52.5zM330.5 443.5c-33.4 0-60.6 27.2-60.6 60.6 0 33.4 27.2 60.6 60.6 60.6s60.6-27.2 60.6-60.6c0-33.4-27.2-60.6-60.6-60.6zM709.3 443.5c-33.4 0-60.6 27.2-60.6 60.6 0 33.4 27.2 60.6 60.6 60.6 33.4 0 60.6-27.2 60.6-60.6 0-33.4-27.2-60.6-60.6-60.6z"  p-id="2614"></path></svg>
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
            <p class="comment-content body">{{ comment.comment_content }}</p>
            <p class="time body-s">{{ formatDate(comment.created_at) }}</p>
          </span>
        </li>
      </ul>
      <div v-else class="no-comments">期待您的第一条评论~</div>
      </div>
      <div class="comment-form">
      <el-input v-model="CommentContent" @keyup.enter="debouncedSubmitComment" placeholder="评论内容" />
      <!-- <el-button type="primary" @click="addComment(postId, CommentContent, userId)">评论</el-button> -->
      <el-button class="primary-button" type="primary" v-debounce:click="submitComment">评论</el-button>
      </div>
    </div>
    <transition name="slide-y">
      <div v-show="isMoreShow" class="more-box">
        <div class="flex-center h-full w-full">
          <el-button class="primary-button" @click="editPost">修改</el-button>
          <el-button class="primary-button danger" @click="deleteUserPost">删除</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.mobile-hidden{
  visibility:hidden;
}
.interact-detail {
  box-sizing: border-box;
  display: flex;
  position: relative;
  color: var(--white);
  .more-box{
    width: 100%;
    height: rem(100);
    border-radius: rem(10) rem(10) 0 0;
    background-color: var(--bg-one);
    position: absolute;
    bottom: 0;
    z-index: 2;
  }
  .el-form-item{
      &:nth-child(2){
        padding-bottom: rem(18);
      }
  }
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
    @include mobile{
      height: 50%;
    }
  }
  .image-bac{
    position: absolute;
    object-fit: cover;
    filter: blur(rem(35));
    z-index:-2;
  }
  .header{
    padding-left: 2.1vw;
    padding-top: 2.1vw;
    position: absolute;
    z-index: 1;
  }
  .content{
    display: flex;
    flex-direction: column;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); // 添加文字阴影
    position: relative;
    .image-container{
      display: flex;
      justify-content: center;
      flex:1;
      height:50%;
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
    .post-infotime{
      padding-left: 2.1vw;
      width: 50%;
      padding-bottom: rem(5);
      .post-info{
        .info-username{
          word-wrap: break-word;// 允许换行
        }
      }
    }
    .link-button{
      color: var(--white);
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5); // 添加文字阴影
    }
  }
    .actions{
      padding-right: 2.1vw;
      z-index: 1;
      cursor: pointer;
      position: absolute;
      right: 0;
      top: 75%;
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
        margin-bottom: rem(30);
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
      padding: rem(10);
      z-index: 1;
      background-color: var(--white);
      box-shadow: -4px 0 5px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      .comments-section {
        flex: 1; // 让评论列表占满剩余空间
        overflow-y: auto; // 如果评论过多，允许滚动
        .no-comments{
          color:var(--black);
        }
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
            padding-bottom: rem(12);
            .username{
              @extend .ellipsis;
              padding-bottom: rem(5);
              color: var(--gray);
            }
            .comment-content{
              color: var(--black);
            }
            .time{
              padding-top: rem(5);
              color:var(--gray);
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
    @include mobile{
      flex-direction: column;
      .comment-container{
      width: 100%;
      height: 50%;
      padding: rem(10);
      border-radius: rem(10) rem(10) 0 0;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }
    }
}
</style>