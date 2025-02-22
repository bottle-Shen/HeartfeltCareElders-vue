export interface IArticle {
    id: number;
    title: string;//标题
    content: string;//内容
    image: string;//图片
    click_num: number;//点击量
    is_recommend: boolean;//是否推荐
    create_time: string;
    update_time: string;
}