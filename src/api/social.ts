import request from '@/utils/request'
import type { SocialData,addPostParams } from '@/@types/social'

export const socialData = ref<SocialData[]>([]);
export const CommentContent = ref('')

//  获取全部帖子
export const getSocial =()=> {
    return request({
        url: `social/posts/`,
        method: 'GET',
    }).then(response => {
    //   console.log(response.data)
      return response.data;
    }).catch((error) => {
      console.error(error);
  });
}

// 获取用户自己的帖子
export const getUserSocial =()=> {
    return request({
        url: `social/posts/my-posts/`,
        method: 'GET',
    }).then(response => {
      console.log('用户发布的帖子:',response.data)
      // return response.data;
    }).catch((error) => {
      console.error(error);
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
      console.log(response.data)
    //   return response.data;
    }).catch((error) => {
        console.error(error);
    })
}

// 点赞帖子
export const likePost = (postId: number,post:SocialData) => {
    return request({
        url: `social/posts/${postId}/like/`,
        method: 'POST',
    }).then(response => {
      // console.log(response.data)
      if (response.status === 201) {
        post.likes_count += 1;
        ElMessage.success('点赞成功');
      }
      if (response.status === 204) {
        post.likes_count -= 1;
        ElMessage.success('取消点赞成功');
      }
    //   return response.data;
    }).catch((error) => {
      console.error(error);
      ElMessage.error('点赞失败');
  });
}
// 获取用户点赞过的帖子
export const UserLikePost = () => {
    return request({
        url: `social/likes/my-likes/`,
        method: 'GET',
    }).then(response => {
      console.log('用户点赞的帖子:', response.data)
    //   return response.data;
    }).catch((error) => {
      console.error(error);
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
        return response.data;
      }
    }).catch((error) => {
      console.error(error);
  });
}


// 添加评论
export const addComment = async(postId:number,commentContent:string,userId:number) => {
   if (!commentContent.trim()) {
    ElMessage.error('评论内容不能为空');
    return;
  }
  if (commentContent.length > 200) {
    ElMessage.error('评论内容不能超过200个字符');
    return;
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
      const post = socialData.value.find(item => item.id === postId);
      if (post) {
                if (!Array.isArray(post.comments)) {
                    post.comments = [];
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
                ElMessage.success('评论成功');
            }
    }
  }).catch((error) => {
    console.error(error);
    ElMessage.error('评论失败');
  })
  // 初始化 WebSocket 连接
  // await initializeWebSocket(postId, commentContent, userId)
  CommentContent.value = '';
}

// WebSocket URL
const getWebSocketUrl = (postId: number) => {
  const baseURL = request.defaults.baseURL || '';
  const wsUrl = baseURL.replace('http', 'ws');
  return `${wsUrl}social/ws/posts/${postId}/`;
}

export let socket: WebSocket | null = null;

// 初始化 WebSocket 连接
export const initializeWebSocket = (postId: number,userId:number) => {
  if (socket) {
    socket.close();
  }
  const wsUrl = getWebSocketUrl(postId);
  socket = new WebSocket(wsUrl);
  socket.onopen = () => {
    console.log('WebSocket connection established');
    // if (socket) {
    //   socket.send(JSON.stringify({
    //     type: "comment",
    //     content: commentContent,
    //     user_id: userId,
    //   }));
    // } else {
    //   console.error('WebSocket connection is not established');
    // }
  };

  socket.onmessage = (event) => {
    try {
        const {type,message} = JSON.parse(event.data);
      // console.log('Parsed message:', type,message); // 打印解析后的消息
      if (type === "comment_message") {
        // 更新评论列表
        // console.log('postID', postId)
        // 找到对应的帖子
        const post = socialData.value.find(item => item.id === postId);
        // console.log('post',post)
        if (post) {
          // 确保 post.comments 是一个数组
          if (!Array.isArray(post.comments)) {
            post.comments = [];
          }
          // 判断是否是用户自己发送的评论
          const isOwnComment = message.user.id === userId;
          if (!isOwnComment) {
            // 添加新评论
            post.comments.push({
              id: message.id,// 评论ID
              comment_content: message.comment_content,
              created_at: message.created_at,
              user: {
                id: message.user.id,
                username: message.user.username,
                avatar: message.user.avatar,
              }
            })
            post.comments_count += 1;
          }
        }
      } else if (type === "like_message") {
        // console.log('Received like message:', message);
        // 更新点赞数
            const post = socialData.value.find(item => item.id === message.post_id);
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

