import type { Module } from 'vuex';
// import { getFromSessionStorage, saveToSessionStorage } from '@/utils/vuex-storage';
import type { userData } from '@/@types/userInfo';
import type { RootState } from '@/store/index'
// import { getRefresh } from '@/api/refresh';
import SecureLS from 'secure-ls'
const secret = import.meta.env.VUE_APP_ENCRYPTION_SECRET || 'default-secret'
const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: secret });

export interface UserState {
  // token: string;
  token: {
    access_token: string;
    refresh_token: string;
  };
  user: userData;
}

export const userModule: Module<UserState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
    token: {
      access_token: '',
      refresh_token: '',
    },
    user: ls.get('user') || {} as userData,
  },
  mutations: {
    setToken(state, token: { access_token: string; refresh_token: string }) {
      state.token.access_token = token.access_token;
      state.token.refresh_token = token.refresh_token;
    },
    setUser(state, user: userData) {
      state.user = user;
      ls.set('user', user);
    },
    setAvatar(state, avatar: string) {
      state.user.avatar = avatar;
      ls.set('user', state.user);
    },
    clearToken(state) {
      state.token.access_token = '';
      state.token.refresh_token = '';
    },
  },
  actions: {
    login({ commit }, { access_token, refresh_token, user }: { access_token: string, refresh_token: string, user: userData }) {
      commit('setToken', { access_token, refresh_token });
      commit('setUser', user);
    },
    userInfo({ commit }, response: userData) {
      commit('setUser', response);
    },
    logout({ commit },{router}) {
      commit('clearToken');// 清除 Vuex 中的令牌
      commit('setUser', {} as userData);// 清除 Vuex 中的用户信息
      // 清空会话存储中的用户信息
      // sessionStorage.removeItem('user');
      ls.remove('user'); // 清空加密存储中的用户信息
      // 跳转到登录页面
      router.push('/login');
    },
    // 定期清理存储的数据
    clearOldData({ state }) {
      const now = new Date();
      const threshold = 7; // 7天
      const lastLoginTime = new Date(state.user.last_login).getTime()
      if (now.getTime() - lastLoginTime > threshold * 24 * 60 * 60 * 1000) {
          ls.remove('user');
      }
    },
    // 初始化定时任务
    initClearOldData({ dispatch }) {
      const intervalId = setInterval(() => {
        dispatch('clearOldData');
      }, 24 * 60 * 60 * 1000); // 每天清理一次
      // 保存定时器引用
      ls.set('clearOldDataInterval', intervalId);
    },
    clearClearOldDataInterval() {
      const intervalId = ls.get('clearOldDataInterval');
      if (intervalId) {
        clearInterval(intervalId);
        ls.remove('clearOldDataInterval');
      }
    },
  },
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user
  }
};