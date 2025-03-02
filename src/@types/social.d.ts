export interface SocialData{
  content: string;//内容
  id: number;//id
  title: string;//标题
  comments_count: number;//评论数
    likes_count: number;//点赞数
    comments: CommentData[];
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