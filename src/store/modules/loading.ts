import type { Module } from 'vuex'
import { type RootState } from '@/store/index'

export interface LoadingState {
  isLoading: boolean;
}

export const LoadingModule: Module<LoadingState, RootState> = {
  namespaced: true,
  state: {
    isLoading: false,
  },
  mutations: {
    SET_LOADING(state, loading: boolean) {
      state.isLoading = loading;
    },
  },
  actions: {
    setLoading({ commit }, loading: boolean) {
      commit('SET_LOADING', loading);
    },
  },
};