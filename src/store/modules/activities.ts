import type { Module } from 'vuex'
import type { ActivityData,EventData,userActivityData } from '@/@types/activities'
import type { RootState } from '@/store/index'
// import { getRefresh } from '@/api/refresh';


export interface ActivityState {
    activity: ActivityData;
    event: EventData;
    useractivity: userActivityData[];
}

export const ActivityModule: Module<ActivityState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
      activity: {} as ActivityData,
      event: {} as EventData,
      useractivity: {} as userActivityData[],
    },
    mutations: {
        setUserActivity(state, useractivity: userActivityData[]) {
            state.useractivity = useractivity;
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
    // login({ commit }, { access_token, refresh_token, user }: { access_token: string, refresh_token: string, user: IUserInfo }) {
    //   commit('setToken', { access_token, refresh_token });
    //   commit('setUser', user);
    // },
    // userInfo({ commit }, response: IUserInfo) {
    //   commit('setUser', response);
    // },
  },
  getters: {
    // getToken: (state) => state.token,
    // getUser: (state) => state.user
  }
};