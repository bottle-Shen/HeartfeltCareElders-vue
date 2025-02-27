import request from '@/utils/request'
import type { number } from 'echarts';

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
interface addPostParams {
    title: string;
    content: string;
    user_id:number
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
export const likePost = (postId: number) => {
    return request({
        url: `social/posts/${postId}/like/`,
        method: 'POST',
    }).then(response => {
      console.log(response.data)
    //   return response.data;
    }).catch((error) => {
      console.error(error);
  });
}
interface addCommentParams {
    postId: number;
    commentContent: string;
}
// 获取评论
export const getComments = (postId: number) => {
    return request({
        url: `social/posts/${postId}/comments/`,
        method: 'GET',
    }).then(response => {
      console.log('获取评论',response.data)
    //   return response.data;
    }).catch((error) => {
      console.error(error);
  });
}

// 添加评论
export const addComment = (postId: number,CommentContent: string) => {
    return request({
        url: `social/posts/${postId}/comments/`,
        method: 'POST',
        data: {
            content: CommentContent,
        }
    }).then(response => {
      console.log(response.data)
    //   return response.data;
    }).catch((error) => {
      console.error(error);
  });
}

const initializeWebSocket = (postId: number) => {
    const socket = new WebSocket(`ws://${window.location.host}/ws/posts/${postId}/`);

    socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log(data.message);  // 更新评论或点赞信息
    // 将新评论添加到评论列表
    const commentsList = document.getElementById('comments-list');
    const newComment = document.createElement('li');
    newComment.textContent = data.message.comment_content;
    commentsList.appendChild(newComment);
};
    
}