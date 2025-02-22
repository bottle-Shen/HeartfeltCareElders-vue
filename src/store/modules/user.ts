import type { Module } from 'vuex';
import { getFromSessionStorage, saveToSessionStorage } from '@/utils/vuex-storage';
import type { IUserInfo } from '@/@types/userInfo';
import type { RootState } from '@/store/index'
// import { getRefresh } from '@/api/refresh';


export interface UserState {
  // token: string;
  token: {
    access_token: string;
    refresh_token: string;
  };
  user: IUserInfo;
}

export const userModule: Module<UserState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
    token: {
      access_token: getFromSessionStorage('access_token', ''),
      refresh_token: getFromSessionStorage('refresh_token', ''),
    },
    user: getFromSessionStorage('user', {} as IUserInfo)
  },
  mutations: {
    setToken(state, token: { access_token: string; refresh_token: string }) {
      state.token.access_token = token.access_token;
      state.token.refresh_token = token.refresh_token;
      saveToSessionStorage('access_token', token.access_token);
      saveToSessionStorage('refresh_token', token.refresh_token);
    },
    setUser(state, user: IUserInfo) {
      state.user = user;
      saveToSessionStorage('user', user);
    },
    setAvatar(state, avatar: string) {
      state.user.avatar = avatar;
      saveToSessionStorage('user', state.user);
    },
    clearToken(state) {
      state.token.access_token = '';
      state.token.refresh_token = '';
      saveToSessionStorage('access_token', '');
      saveToSessionStorage('refresh_token', '');
    },
  },
  actions: {
    login({ commit }, { access_token, refresh_token, user }: { access_token: string, refresh_token: string, user: IUserInfo }) {
      commit('setToken', { access_token, refresh_token });
      commit('setUser', user);
    },
    userInfo({ commit }, response: IUserInfo) {
      commit('setUser', response);
    },
    logout({ commit },{router}) {
      commit('clearToken');// 清除 Vuex 中的令牌
      commit('setUser', {} as IUserInfo);// 清除 Vuex 中的用户信息
      // 清空会话存储中的密钥
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('refresh_token');
      sessionStorage.removeItem('user');
      // 跳转到登录页面
      router.push('/login');
    },
  },
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user
  }
};