import type { Module } from 'vuex';
import type { RootState } from '@/store/index'
import type { IKnowledge } from '@/@types/knowledge';
import { getKnowledge } from '@/api/knowledge';

export interface KnowledgeState {
  knowledgeData: IKnowledge[];
  currentPage: number;
  loading: boolean;
  finished: boolean;
  loadedPages:Set<number>;
}
export const knowledgeModule: Module<KnowledgeState, RootState> = {
  namespaced: true,
  state: {
    knowledgeData: [],
    currentPage: 1, // 当前页码
    loading: false, // 加载状态
    finished: false, // 是否加载完成
    loadedPages: new Set(), // 缓存已加载的页码
  },
  mutations: {
    SET_SOCIAL_DATA(state, data: IKnowledge[]) {
      state.knowledgeData = data;// 设置初始数据
    },
    APPEND_SOCIAL_DATA(state, data: IKnowledge[]) {
      state.knowledgeData.push(...data); // 追加新数据
    },
    SET_CURRENT_PAGE(state, page: number) {
      state.currentPage = page;
    },
    SET_LOADING(state, loading: boolean) {
      state.loading = loading;
    },
    SET_FINISHED(state, finished: boolean) {
      state.finished = finished;
    },
    CACHE_LOADED_PAGE(state, page: number) {
      state.loadedPages.add(page);
    }
  },
  actions: {
    async fetchKnowledgeData({ state, commit }) {
      // 如果当前页已经加载过，直接返回
      if (state.loadedPages.has(state.currentPage)) return;
      if (state.loading || state.finished) return;
    
      commit('SET_LOADING', true);
      try {
        const params = {
          page: state.currentPage,
          limit: 10,
        };
        const response = await getKnowledge(params);
        const newItems = response.results || [];
    
        if (newItems.length === 0) {
          commit('SET_FINISHED', true);
        } else {
          if (state.currentPage === 1) {
            // 如果是第一页，直接设置数据，而不是追加
            commit('SET_SOCIAL_DATA', newItems);
          } else {
            commit('APPEND_SOCIAL_DATA', newItems); // 使用 APPEND_SOCIAL_DATA 追加新数据
          }
          commit('CACHE_LOADED_PAGE', state.currentPage); // 缓存已加载的页码
        }
      } catch (error) {
        console.error('Failed to fetch social data:', error);
        commit('SET_FINISHED', true); // 如果请求失败，标记为加载完成
      } finally {
        commit('SET_LOADING', false);
      }
    },
    async loadMoreKnowledgeData({ state, commit }) {
      // 只有在未完成加载且不是正在加载时才触发加载更多
      if (!state.finished && !state.loading) {
        commit('SET_CURRENT_PAGE', state.currentPage + 1); // 增加页码
        await this.dispatch('knowledge/fetchKnowledgeData'); // 加载数据
      }
    }
  }
}