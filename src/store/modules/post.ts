import type { Module } from 'vuex'
import { type RootState } from '@/store/index'
// import { store, type RootState } from '@/store/index'
import type { SocialData,CommentData } from '@/@types/social'
import { getSocial,UserLikePost } from '@/api/social'


export interface PostState {
    userPosts: number[];
    likedPosts: number[];
    socialData: SocialData[];
    currentPage: number;
    loading: boolean;
    finished: boolean;
    loadedPages:Set<number>;
}

export const PostModule: Module<PostState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
      userPosts: [],// 用户发布的帖子
      likedPosts: [],// 用户点赞的帖子
      socialData: [],// 所有帖子
      currentPage: 1, // 当前页码
      loading: false, // 加载状态
      finished: false, // 是否加载完成
      loadedPages: new Set(), // 缓存已加载的页码
    },
    mutations: {
        setUserPosts(state, posts) {
            state.userPosts = posts;
        },
        setLikedPosts(state, posts) {
            state.likedPosts = posts;
        },
        updatePost(state, post: SocialData) {
          const index = state.socialData.findIndex(item => item.id === post.id);
          if (index !== -1) {
            state.socialData[index] = post;// 更新特定帖子
          } else {
            state.socialData.push(post);// 如果帖子不存在，则添加新帖子
          }
        },
      updatePostComments(state, payload:{ postId:number, comments: CommentData[] }) {
          const post = state.socialData.find(item => item.id === payload.postId);
          if (post) {
            post.comments = payload.comments;
          }
        },
        addLikedPost(state, postId) {
          if (!state.likedPosts.includes(postId)) {
            state.likedPosts.push(postId);
          }
        },
        removeLikedPost(state, postId) {
          state.likedPosts = state.likedPosts.filter(id => id !== postId);
        },
        SET_SOCIAL_DATA(state, data: SocialData[]) {
            state.socialData = data;// 设置初始数据
        },
        APPEND_SOCIAL_DATA(state, data: SocialData[]) {
          state.socialData.push(...data); // 追加新数据
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
        CACHE_LOADED_PAGE(state, page) {
          state.loadedPages.add(page);
        },
    },
  actions: {
    userPosts({ commit }, response) {
    commit('setUserPosts', response);
    },
    async likedPosts({ commit }, response) {
      commit('setLikedPosts', response);
    },
    async fetchSocialData({ state, commit }) {
      console.log(`Current Page: ${state.currentPage}, Loaded Pages: ${Array.from(state.loadedPages)}`);
      console.log(`fetchSocialData called, current page: ${state.currentPage}`);
      // 如果当前页已经加载过，直接返回
      if (state.loadedPages.has(state.currentPage)) {
        console.log(`页码:${state.currentPage}已经加载过，直接返回.`);
        return;
      }
      if (state.loading || state.finished) return;

      commit('SET_LOADING', true);
      try {
        const params = {
          page: state.currentPage,
          limit: 10,
        };
        const response = await getSocial(params);
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
          // commit('SET_CURRENT_PAGE', state.currentPage + 1);// 只有加载到新数据时才更新
          commit('CACHE_LOADED_PAGE', state.currentPage); // 缓存已加载的页码
        }
      } catch (error) {
        console.error('Failed to fetch social data:', error);
        commit('SET_FINISHED', true); // 如果请求失败，标记为加载完成
      } finally {
        commit('SET_LOADING', false);
      }
      console.log(`fetchSocialData finished, current page: ${state.currentPage}`);
    },
    async loadMoreData({ state, commit }) {
      // 只有在未完成加载且不是正在加载时才触发加载更多
      if (!state.finished && !state.loading) {
        commit('SET_CURRENT_PAGE', state.currentPage + 1); // 增加页码
        await this.dispatch('post/fetchSocialData'); // 调用 fetchSocialData 加载数据
      }
    },
    async initializeLikedPosts({ commit }) {
      try {
        const response = await UserLikePost();
        if (response) {
          const likedPostIds = response.map((item: SocialData) => item.id);
          commit('setLikedPosts', likedPostIds);
        }
      } catch (error) {
        console.error('Failed to fetch liked posts:', error);
      }
    },
  },
  getters: {
    isPostLiked: (state) => (postId: number) => {
      return state.likedPosts.includes(postId);
    }
  }
};