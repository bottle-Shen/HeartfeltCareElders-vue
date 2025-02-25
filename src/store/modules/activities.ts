import type { Module } from 'vuex'
import type { ActivityData,EventData,userActivityData } from '@/@types/activities'
import type { RootState } from '@/store/index'
// import { getRefresh } from '@/api/refresh';


export interface ActivityState {
    activity: ActivityData;
    event: EventData;
    useractivity: userActivityData;
}

export const ActivityModule: Module<ActivityState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
      activity: {} as ActivityData,
      event: {} as EventData,
      useractivity: {} as userActivityData,
    },
    mutations: {
        setUserActivity(state, useractivity: userActivityData) {
            state.useractivity = useractivity;
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