export interface IKnowledge {
    id: number;
    title: string;//标题
    desc: string;//简介
    content: string;//内容
    video: string;//视频
    image: string;//图片
    click_num: number;//点击量
    is_recommend: boolean;//是否推荐
    create_time: string;
    update_time: string;
}