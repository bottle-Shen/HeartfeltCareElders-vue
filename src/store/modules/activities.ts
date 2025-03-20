import type { Module } from 'vuex'
import type { ActivityData,EventData,userActivityData } from '@/@types/activities'
import type { RootState } from '@/store/index'
import { getUserActivityData,searchUserActivity } from '@/api/activities';
// import { getRefresh } from '@/api/refresh';


export interface ActivityState {
    activity: ActivityData;
    event: EventData;
    useractivity: userActivityData[];
    searchUserActivity: userActivityData[];
}

export const ActivityModule: Module<ActivityState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
      activity: {} as ActivityData,
      event: {} as EventData,
      useractivity: {} as userActivityData[],
      searchUserActivity: [] as userActivityData[],
    },
    mutations: {
      setUserActivity(state, useractivity: userActivityData[]) {
        state.useractivity = useractivity;
      },
      setSearchUserActivity(state, searchUserActivity: userActivityData[]) {
        state.searchUserActivity = searchUserActivity;
      },
      addUserActivity(state, useractivity: userActivityData) {
        state.useractivity.push(useractivity);// 使用 push 方法添加新活动
        // console.log('addUser后d1',state.useractivity);
      },
      deleteUserActivity(state, { event_id, user_id }: { event_id: number; user_id: number; }) {
        // 找到匹配的活动记录索引
        const index = state.useractivity.findIndex(activity => 
          activity.event.id === event_id && activity.user === user_id
        );
        // 如果找到匹配的记录，从数组中移除
        if (index !== -1) {
          state.useractivity.splice(index, 1);
        }
      },
          setEvent(state, event: EventData) {
            state.event = event;
          },
          setActivity(state, activity: ActivityData) {
            state.activity = activity;
        },
    },
  actions: {
    async fetchUserActivityData({ commit }) {
      const userActivities = await getUserActivityData(); // 从后端获取数据
      commit('setUserActivity', userActivities);
    },
    async searchUserActivity({ commit }, query: string) {
      const result = await searchUserActivity(query);// 返回搜索结果
      commit('setSearchUserActivity', result);
    },
  },
  getters: {
    filteredActivities: (state) => (query:string) => {
      if (!query) return state.useractivity;// 如果没有搜索关键词，显示所有活动
      const lowerCaseQuery = query.toLowerCase();
      return state.searchUserActivity.filter(activity =>
        activity.event.title.toLowerCase().includes(lowerCaseQuery) ||
        activity.event.description.toLowerCase().includes(lowerCaseQuery) ||
        activity.event.location.toLowerCase().includes(lowerCaseQuery) ||
        activity.event.start_time.includes(lowerCaseQuery) ||
        activity.event.end_time.includes(lowerCaseQuery)
      );
    }
  }
};