export interface SocialData{
  content: string;//内容
  id: number;//id
    title: string;//标题
    user: {//用户
        id: number;
        username: string;
        avatar: string;
    };
    image: string;//图片
    video: string;//视频
    comments_count: number;//评论数
    likes_count: number;//点赞数
    created_at: string;//创建时间
    updated_at: string;//更新时间
    comments: CommentData[];
    isCommentsVisible: boolean; // 控制评论区的显示
}
export interface CommentData {
    id: number;
    comment_content: string;
    created_at: string;
    user: {
        id: number;
        username: string;
        avatar: string;
    };
}

// 发布帖子请求参数
export interface addPostParams {
    title: string;
    content: string;
    user_id:number
}