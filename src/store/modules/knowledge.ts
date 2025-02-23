import type { Module } from 'vuex';
import type { IKnowledge } from '@/@types/knowledge';
import { getKnowledge } from '@/api/knowledge';
import type { RootState } from '@/store/index'

export interface KnowledgeState {
  knowledge: IKnowledge[];
//   currentArticle: IArticle | null;
}
export const knowledgeModule: Module<KnowledgeState, RootState> = {
  state: {
    knowledge: [],
    // currentArticle: null,
  },
  mutations: {
    setKnowledge(state, knowledge: IKnowledge[]) {
      state.knowledge = knowledge;
    },
    // setCurrentArticle(state, article: IArticle) {
    //   state.currentArticle = article;
    // },
    },
  actions: {
    getKnowledge({ commit }) {
      return getKnowledge().then((knowledge: IKnowledge[]) => {
        commit('setAKnowledge', knowledge);
      });
    },
    // getCurrentArticle({ commit }, id: number) {
    //   return getCurrentArticle(id).then((article: IKnowledge) => {
    //     commit('setCurrentArticle', article);
    //   });
    // }
  }
}