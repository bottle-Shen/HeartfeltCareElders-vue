// 定义用户报名和取消活动请求参数类型
export interface getRegisterActivityDataParams {
  user_id: number;
  event_id: number;
}
// 定义活动数据的类型
export interface ActivityData {
  title: string,
  start_time: string,
  end_time: string,
  description: string,
  location: string,
  id: number,
  created_at: string,
  updated_at: string,
}
// 定义按日期分类的活动数据的类型
export interface ActivitiesByDate {
  [date: string]: ActivityData[];
}
// 活动数据类型
export interface EventData {
  title: string,
  start_time: string,
  end_time: string,
  description: string,
  location: string,
  id: number,
  created_at: string,
  updated_at: string,
}
// 用户参加活动的数据类型
export interface userActivityData {
  id: number,
  registered_at: string,
  user: number,
  event: EventData,
}
// 创建活动的请求参数类型
export interface CreateActivityData {
  title: string,
  start_time: string,
  end_time: string,
  description: string,
  location: string,
  participants?:{ username: string }[],
}