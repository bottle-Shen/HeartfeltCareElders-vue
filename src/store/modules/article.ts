import type { Module } from 'vuex';
import type { IArticle } from '@/@types/article';
import { getArticle } from '@/api/article';
import type { RootState } from '@/store/index'

export interface ArticleState {
  articles: IArticle[];
//   currentArticle: IArticle | null;
}
export const articleModule: Module<ArticleState, RootState> = {
  state: {
    articles: [],
    // currentArticle: null,
  },
  mutations: {
    setArticles(state, articles: IArticle[]) {
      state.articles = articles;
    },
    // setCurrentArticle(state, article: IArticle) {
    //   state.currentArticle = article;
    // },
    },
  actions: {
    getArticle({ commit }) {
      return getArticle().then((articles: IArticle[]) => {
        commit('setArticles', articles);
      });
    },
    // getCurrentArticle({ commit }, id: number) {
    //   return getCurrentArticle(id).then((article: IKnowledge) => {
    //     commit('setCurrentArticle', article);
    //   });
    // }
  }
}