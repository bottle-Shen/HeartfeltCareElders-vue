import request from '@/utils/request'
import type { SocialData, addPostParams } from '@/@types/social'
import type { Store } from 'vuex'
import type { PostState } from '@/store/modules/post'
import { store } from '@/store'
export const CommentContent = ref('')

//  获取全部帖子
export const getSocial =(params: { page?: number, search?: string })=> {
    return request({
        url: `social/posts/`,
        method: 'GET',
        params,
    }).then(response => {
      //   console.log(response.data)
      return response.data// 返回 API 的返回值
    }).catch((error) => {
      console.error(error)
      throw error// 重新抛出错误，以便在 Vuex 中捕获
  });
}
// 获取单个帖子
export const getSocialById = (id: number) => {
  return request({
    url: `social/posts/${id}/`,
    method: 'GET',
  }).then(response => {
      console.log(response)
    return response.data
  }).catch((error) => {
    console.error(error)
  });
}

// 获取用户自己的帖子
export const getUserSocial =()=> {
    return request({
        url: `social/posts/my-posts/`,
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return response.data
      }
    }).catch((error) => {
      console.error(error)
  });
}


// 发布帖子
export const addPost = (params: addPostParams) => {
    return request({
        url: `social/posts/`,
        method: 'POST',
        data: {
            title: params.title,
            content: params.content,
            user_id:params.user_id
        }
    }).then(response => {
      // console.log(response.data)
      return response.data
    }).catch((error) => {
      console.error(error)
    })
}

// 点赞帖子
export const likePost = (postId: number, post: SocialData,store:Store<PostState>) => {
    return request({
        url: `social/posts/${postId}/like/`,
        method: 'POST',
    }).then(response => {
      if (response.status === 201) {
        post.likes_count += 1
        store.commit('post/addLikedPost', postId);
        ElMessage.success('点赞成功')
      }
      if (response.status === 204) {
        post.likes_count -= 1
        store.commit('post/removeLikedPost', postId);
        ElMessage.success('取消点赞成功')
      }
    }).catch((error) => {
      console.error(error)
      ElMessage.error('点赞失败')
  });
}
// 获取用户点赞过的帖子
export const UserLikePost = () => {
    return request({
        url: `social/likes/my-likes/`,
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        // console.log('用户点赞的帖子:', response.data)
        return response.data
      }
    }).catch((error) => {
      console.error(error)
  });
}
// 获取评论
export const getComments = (postId: number) => {
    return request({
        url: `social/posts/${postId}/comments/`,
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        // return response.data
        return Array.isArray(response.data) ? response.data : []; // 确保返回的是数组
      }
    }).catch((error) => {
      console.error(error)
      return []; // 如果失败，返回空数组
  });
}

// 处理评论里头像的相对路径问题
export const handleAvatarPath = (avatarPath: string) => {
  // const baseURL = import.meta.env.VITE_BASE_URL;
  const baseURL = request.defaults.baseURL || ''
  // 使用 URL 对象处理路径拼接
  return avatarPath.startsWith("http") ? avatarPath : new URL(avatarPath, baseURL).href;
};


// 添加评论
export const addComment = async(postId:number,commentContent:string,userId:number) => {
   if (!commentContent.trim()) {
    ElMessage.error('评论内容不能为空')
    return
  }
  if (commentContent.length > 200) {
    ElMessage.error('评论内容不能超过200个字符')
    return
  }
  // 发送 HTTP 请求添加评论
  await request({
    url: `social/comments/`,
    method: 'POST',
    data: {
      comment_content: commentContent,
      post_id: postId,
    }
  }).then(response => {
    if (response.status === 201) {
      // 更新评论列表
      const post = store.state.post.socialData.find(item => item.id === postId)
      if (post) {
                if (!Array.isArray(post.comments)) {
                    post.comments = []
                }
                post.comments.push({
                    id: response.data.id,
                    comment_content: commentContent,
                    created_at: response.data.created_at,
                    user: {
                        id: userId,
                        username: response.data.user.username,
                        avatar: response.data.user.avatar,
                    }
                });
                post.comments_count += 1;
                ElMessage.success('评论成功')
            }
    }
  }).catch((error) => {
    console.error(error)
    ElMessage.error('评论失败')
  })
  // 初始化 WebSocket 连接
  // await initializeWebSocket(postId, commentContent, userId)
  CommentContent.value = ''
}

// WebSocket URL
const getWebSocketUrl = (postId: number) => {
  const baseURL = request.defaults.baseURL || ''
  const wsUrl = baseURL.replace('http', 'ws')
  return `${wsUrl}social/ws/posts/${postId}/`
}

export let socket: WebSocket | null = null;

// 当前连接的帖子ID
let currentPostId: number | null = null;
export const isDataLoaded = ref(false); // 数据加载完成的标志
// 初始化 WebSocket 连接
export const initializeWebSocket = (postId: number,userId:number) => {
  if (socket) {
    socket.close();// 如果已有连接，先关闭
  }
  // 如果帖子ID未变，无需重新连接
  if (currentPostId === postId) {
    // console.log('WebSocket连接的帖子ID未变，无需重新连接。');
    return;
  }
  currentPostId = postId;// 更新当前帖子ID
  const wsUrl = getWebSocketUrl(postId);
  socket = new WebSocket(wsUrl);
  socket.onopen = () => {
    // console.log('WebSocket connection established');
    if (socket) {// 发送初始消息,告诉后端用户关注实时更新
      socket.send(JSON.stringify({
        type: "subscribe",
        user_id: userId,
        post_id: postId,
      }));
    } else {
      // console.error('WebSocket connection is not established');
      return
    }
  };

  socket.onmessage = (event) => {
    try {
        const {type,message} = JSON.parse(event.data);
      console.log('Parsed message:', type, message); // 打印解析后的消息
      if (!isDataLoaded.value) {
        console.log('数据未加载完成');
        return;
      }
      if (type === "comment_message") {
        // 更新评论列表
        console.log('postID', postId)
        // 找到对应的帖子
        const post = store.state.post.socialData.find(item => item.id === postId);
        console.log('socialData:', store.state.post.socialData);
        console.log('post',post)
        if (post) {
          // 确保 post.comments 是一个数组
          if (!Array.isArray(post.comments)) {
            post.comments = reactive([]); // 确保是响应式数组
          }
          // 添加新评论
          post.comments.push({
              id: message.id,
              comment_content: message.comment_content,
              created_at: message.created_at,
              user: {
                  id: message.user.id,
                  username: message.user.username,
                  avatar: message.user.avatar,
              }
          });

          // 更新评论数量
          if (post.comments_count) {
              post.comments_count += 1;
          } else {
              post.comments_count = 1;
          }

          console.log("Comment added:");
        }
      } else if (type === "like_message") {
        // console.log('Received like message:', message);
        // 更新点赞数
            const post = store.state.post.socialData.find(item => item.id === message.post_id);
            if (post) {
              // 判断是否是用户自己的点赞操作
                const isOwnLike = message.user_id === userId;
                if (message.action === "like") {
                    if (!isOwnLike) {
                        post.likes_count += 1; // 只有非自己的点赞才更新
                    }
                } else if (message.action === "unlike") {
                   if (!isOwnLike) {
                        post.likes_count -= 1; // 只有非自己的取消点赞才更新
                    }
                }
            }
      }
    } catch (error) {
        console.error('Error parsing message:', error);
    }
  }
  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  return socket;//  返回WebSocket实例
}

