import type { Module } from 'vuex'
import type { RootState } from '@/store/index'
export interface AsideVisibleState {
  isAsideVisible: boolean;
}
export const AsideVisibleModule: Module<AsideVisibleState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
      isAsideVisible: true,// 控制侧边栏的显示和隐藏
    },
  mutations: {
    TOGGLE_ASIDE(state) {
      state.isAsideVisible = !state.isAsideVisible;
    },
  },
  getters: {
    isAsideVisible: (state) => state.isAsideVisible,
  },
};