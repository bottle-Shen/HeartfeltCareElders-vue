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