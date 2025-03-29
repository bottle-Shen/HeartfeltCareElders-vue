import type { Module } from 'vuex';
// import { getFromSessionStorage, saveToSessionStorage } from '@/utils/vuex-storage';
import type { IUserInfo } from '@/@types/userInfo';
import type { RootState } from '@/store/index'
// import { getRefresh } from '@/api/refresh';
import { updateTheme } from '@/utils/modules/themeUtils'
import SecureLS from 'secure-ls'
// const encryptionSecret = import.meta.env.VITE_ENCRYPTION_SECRET;
// console.log('Encryption Secret:', encryptionSecret);
const secret = import.meta.env.VITE_ENCRYPTION_SECRET || 'default-secret'
const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: secret });

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
      access_token: ls.get('access_token')||'',
      refresh_token: ls.get('refresh_token')||'',
    },
    user: ls.get('user') || {} as IUserInfo,
  },
  mutations: {
    setToken(state, token: { access_token: string; refresh_token: string }) {
      state.token.access_token = token.access_token;
      state.token.refresh_token = token.refresh_token;
      ls.set('access_token', token.access_token);
      ls.set('refresh_token', token.refresh_token);
    },
    setUser(state, user: IUserInfo) {
      state.user = user;
      ls.set('user', user);
    },
    setAvatar(state, avatar: string) {
      state.user.avatar = avatar;
      ls.set('user', state.user);
    },
    setBackground(state, background: string) {
      state.user.background_image = background;
      ls.set('user', state.user);
    },
    clearToken(state) {
      state.token.access_token = '';
      state.token.refresh_token = '';
      ls.remove('access_token');
      ls.remove('refresh_token');
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
    // 退出登录
    logout({ commit }, router) {
      commit('clearToken');// 清除 Vuex 中的令牌
      commit('setUser', {} as IUserInfo);// 清除 Vuex 中的用户信息
      // 清空会话存储中的信息
      // sessionStorage.removeItem('user');
      ls.remove('access_token');
      ls.remove('refresh_token');
      ls.remove('user'); // 清空本地存储中加密存储中的用户信息
      // 恢复默认主题
      updateTheme(0);
      // console.log('currentThemeIndex', ls.get('currentThemeIndex'));
      // ls.remove('currentThemeIndex');// 清空本地存储中存储的当前主题索引
      sessionStorage.clear(); // 清空会话存储中的所有信息
      
      // 清空 post 模块的 Vuex 状态
      commit('post/SET_USER_POSTS', [], { root: true });
      commit('post/SET_CURRENT_PAGE_USER_POSTS', 1, { root: true }); // 重置当前页码
      commit('post/SET_LOADING_USER_POSTS', false, { root: true });// 重置加载状态
      commit('post/SET_FINISHED_USER_POSTS', false, { root: true });// 重置完成状态
      commit('post/CLEAR_LOADED_PAGES_USER_POSTS',null, { root: true });// 重置缓存页码

      // 清空 post 模块的 Vuex 状态
      commit('post/SET_LIKED_POSTS', [], { root: true });
      commit('post/SET_CURRENT_PAGE_LIKED_POSTS', 1, { root: true });
      commit('post/SET_LOADING_LIKED_POSTS', false, { root: true });
      commit('post/SET_FINISHED_LIKED_POSTS', false, { root: true });
      commit('post/CLEAR_LOADED_PAGES_LIKED_POSTS',null, { root: true });
      
      // 跳转到登录页面
      router.push('/login'); // 跳转到登录页面
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
    getUser: (state) => state.user,
    getUserId: (state) => state.user.id,
    isAuthenticated: (state) => !!state.token.access_token, // 如果 access_token 存在，则认为用户已登录
    getUserType: (state) => state.user.user_type,// 获取用户类型
    // getUserName: (state) => state.user.username,
    // getUserAvatar: (state) => state.user.avatar,
    // getUserRole: (state) => state.user.role,
    // getUserLastLogin: (state) => state.user.last_login,
    // getUserPhone: (state) => state.user.phone,
    // getUserEmail:(state) => state.user.email,
  }
};