import type { Module } from 'vuex';
import type { RootState } from '@/store/index'
import type { IKnowledge } from '@/@types/knowledge';
import { getKnowledge } from '@/api/knowledge';

export interface KnowledgeState {
  knowledgeData: IKnowledge[];
  currentPage: number;
  loading: boolean;
  finished: boolean;
//   currentArticle: IArticle | null;
}
export const knowledgeModule: Module<KnowledgeState, RootState> = {
  namespaced: true,
  state: {
    knowledgeData: [],
    currentPage: 1, // 当前页码
    loading: false, // 加载状态
    finished: false // 是否加载完成
    // currentArticle: null,
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
    }
    // setCurrentArticle(state, article: IArticle) {
    //   state.currentArticle = article;
    // },
    },
  actions: {
    async fetchKnowledgeData({ state, commit }) {
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
              commit('APPEND_SOCIAL_DATA', newItems); // 使用 APPEND_SOCIAL_DATA 追加新数据
              commit('SET_CURRENT_PAGE', state.currentPage + 1);// 只有加载到新数据时才更新
            }
          } catch (error) {
            console.error('Failed to fetch social data:', error);
            commit('SET_FINISHED', true); // 如果请求失败，标记为加载完成
          } finally {
            commit('SET_LOADING', false);
          }
        }
    // getCurrentArticle({ commit }, id: number) {
    //   return getCurrentArticle(id).then((article: IKnowledge) => {
    //     commit('setCurrentArticle', article);
    //   });
    // }
  }
}