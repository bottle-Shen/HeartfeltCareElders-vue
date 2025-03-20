import type { Module } from 'vuex'
import { type RootState } from '@/store/index'
// import { store, type RootState } from '@/store/index'
import type { SocialData,CommentData } from '@/@types/social'
import { getSocial,UserLikePost,getUserSocial } from '@/api/social'


export interface PostState {
    userPosts: SocialData[]; // 用户发布的帖子
    likedPosts: number[]; // 存储点赞的帖子 ID
    socialData: SocialData[];// 所有帖子
    currentPageUserPosts: number; // 用户发布帖子的当前页码
    currentPageLikedPosts: number; // 用户点赞帖子的当前页码
    loadingUserPosts: boolean; // 用户发布帖子的加载状态
    loadingLikedPosts: boolean; // 用户点赞帖子的加载状态
    finishedUserPosts: boolean; // 用户发布帖子是否加载完成
    finishedLikedPosts: boolean; // 用户点赞帖子是否加载完成
    loadedPagesUserPosts: Set<number>; // 缓存已加载的页码（用户发布帖子）
    loadedPagesLikedPosts: Set<number>; // 缓存已加载的页码（用户点赞帖子）
    currentPage: number;// 全部帖子当前页码
    loading: boolean;
    finished: boolean;
    loadedPages:Set<number>;
    viewHistory: SocialData[]; // 观看历史
    currentPageViewHistory: number; // 当前页码
    loadingViewHistory: boolean; // 加载状态
    finishedViewHistory: boolean; // 是否加载完成
    itemsPerPageViewHistory: number,
}

export const PostModule: Module<PostState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
      userPosts: [],// 用户发布的帖子
      likedPosts: [],// 用户点赞的帖子
      socialData: [],// 所有帖子
      currentPageUserPosts: 1,
      currentPageLikedPosts: 1,
      loadingUserPosts: false,
      loadingLikedPosts: false,
      finishedUserPosts: false,
      finishedLikedPosts: false,
      loadedPagesUserPosts: new Set(),
      loadedPagesLikedPosts: new Set(),
      currentPage: 1, // 当前页码
      loading: false, // 加载状态
      finished: false, // 是否加载完成
      loadedPages: new Set(), // 缓存已加载的页码
      viewHistory: [], // 观看历史
      currentPageViewHistory: 1, // 当前页码
      loadingViewHistory: false, // 加载状态
      finishedViewHistory: false, // 是否加载完成
      itemsPerPageViewHistory: 5,// 每页显示的观看历史数量
    },
  mutations: {
      // 设置用户发布的帖子
        SET_USER_POSTS(state, posts: SocialData[]) {
          state.userPosts = posts;
        },
        APPEND_USER_POSTS(state, posts: SocialData[]) {
          state.userPosts.push(...posts);
    },
        // 设置用户点赞的帖子
        SET_LIKED_POSTS(state, postIds: number[]) {
          state.likedPosts = postIds;
        },
        APPEND_LIKED_POSTS(state, postIds: number[]) {
          state.likedPosts.push(...postIds);
        },
        SET_CURRENT_PAGE_USER_POSTS(state, page: number) {
          state.currentPageUserPosts = page;
        },
        SET_CURRENT_PAGE_LIKED_POSTS(state, page: number) {
          state.currentPageLikedPosts = page;
        },
        SET_LOADING_USER_POSTS(state, loading: boolean) {
          state.loadingUserPosts = loading;
        },
        SET_LOADING_LIKED_POSTS(state, loading: boolean) {
          state.loadingLikedPosts = loading;
        },
        SET_FINISHED_USER_POSTS(state, finished: boolean) {
          state.finishedUserPosts = finished;
        },
        SET_FINISHED_LIKED_POSTS(state, finished: boolean) {
          state.finishedLikedPosts = finished;
        },
        CACHE_LOADED_PAGE_USER_POSTS(state, page: number) {
          state.loadedPagesUserPosts.add(page);
        },
        CACHE_LOADED_PAGE_LIKED_POSTS(state, page: number) {
          state.loadedPagesLikedPosts.add(page);
        },
        // 设置观看历史
        SET_VIEW_HISTORY(state, viewHistory: SocialData[]) {
          state.viewHistory = viewHistory;
        },
        ADD_TO_VIEW_HISTORY(state, post: SocialData) {
          // 添加帖子到观看历史
          const existingIndex = state.viewHistory.findIndex((item) => item.id === post.id);
          if (existingIndex === -1) {
            state.viewHistory.push(post);
          } else {
            state.viewHistory[existingIndex] = post; // 更新已有记录
          }
          localStorage.setItem('viewHistory', JSON.stringify(state.viewHistory));// 保存到本地存储
        },
        SET_CURRENT_PAGE_VIEW_HISTORY(state, page: number) {
          state.currentPageViewHistory = page;
        },
        SET_LOADING_VIEW_HISTORY(state, loading: boolean) {
          state.loadingViewHistory = loading;
        },
        SET_FINISHED_VIEW_HISTORY(state, finished: boolean) {
          state.finishedViewHistory = finished;
        },
        LOAD_VIEW_HISTORY(state, viewHistory) {
          state.viewHistory = viewHistory;
          state.loadingViewHistory = false; // 加载完成后关闭加载状态
          state.finishedViewHistory = viewHistory.length === 0; // 如果没有数据，标记为加载完成
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
        // 设置所有帖子数据
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
    // userPosts({ commit }, response) {
    // commit('setUserPosts', response);
    // },
    // async likedPosts({ commit }, response) {
    //   commit('setLikedPosts', response);
    // },
    addToViewHistory({ commit }, post: SocialData) {
      commit('SET_LOADING_VIEW_HISTORY', true);
      commit('ADD_TO_VIEW_HISTORY', post);// 添加到观看历史
      commit('SET_LOADING_VIEW_HISTORY', false);
    },
    loadMoreViewHistory({ state, commit }) {// 获取更多观看历史数据
    if (state.finishedViewHistory || state.loadingViewHistory) return;

    commit('SET_LOADING_VIEW_HISTORY', true);
    try {
      const viewHistory = JSON.parse(localStorage.getItem('viewHistory') || '[]');
      const newItems = viewHistory.slice(state.currentPageViewHistory * 10, (state.currentPageViewHistory + 1) * 10);

      if (newItems.length === 0) {
        commit('SET_FINISHED_VIEW_HISTORY', true);
      } else {
        state.viewHistory.push(...newItems);
        commit('SET_CURRENT_PAGE_VIEW_HISTORY', state.currentPageViewHistory + 1);
      }
    } catch (error) {
      console.error('Failed to load more view history:', error);
    } finally {
      commit('SET_LOADING_VIEW_HISTORY', false);
    }
    },
    loadViewHistoryFromLocalStorage({ commit }) {
  commit('SET_LOADING_VIEW_HISTORY', true); // 开始加载
  const storedViewHistory = localStorage.getItem('viewHistory');
  const viewHistory = storedViewHistory ? JSON.parse(storedViewHistory) : [];

  // 设置整个观看历史
  commit('SET_VIEW_HISTORY', viewHistory);

  // 设置加载状态和完成状态
  commit('SET_LOADING_VIEW_HISTORY', false); // 结束加载
  commit('SET_FINISHED_VIEW_HISTORY', viewHistory.length === 0); // 如果没有数据，标记为完成
    },
     async fetchUserPosts({ state, commit }) {
    if (state.loadingUserPosts || state.finishedUserPosts) return;

    commit('SET_LOADING_USER_POSTS', true);// 设置加载状态
    try {
      const params = {
        page: state.currentPageUserPosts,
        limit: 10,
      };
      const response = await getUserSocial(params);
      const newItems = response.results || [];

      if (newItems.length === 0) {
        commit('SET_FINISHED_USER_POSTS', true);// 如果没有更多数据，标记为加载完成
      } else {
        if (state.currentPageUserPosts === 1) {
          commit('SET_USER_POSTS', newItems);// 如果是第一页，直接设置数据
        } else {
          commit('APPEND_USER_POSTS', newItems);// 否则追加数据
        }
        commit('CACHE_LOADED_PAGE_USER_POSTS', state.currentPageUserPosts);// 缓存已加载的页码
      }
    } catch (error) {
      console.error('Failed to fetch user posts:', error);
      commit('SET_FINISHED_USER_POSTS', true);// 标记为加载完成
    } finally {
      commit('SET_LOADING_USER_POSTS', false);// 结束加载状态
    }
  },
  async fetchLikedPosts({ state, commit }) {
    if (state.loadingLikedPosts || state.finishedLikedPosts) return;

    commit('SET_LOADING_LIKED_POSTS', true);
    try {
      const params = {
        page: state.currentPageLikedPosts,
        limit: 10,
      };
      const response = await UserLikePost(params);
      const newItems = response.results || [];

      if (newItems.length === 0) {
        commit('SET_FINISHED_LIKED_POSTS', true);
      } else {
        if (state.currentPageLikedPosts === 1) {
          commit('SET_LIKED_POSTS', newItems);
        } else {
          commit('APPEND_LIKED_POSTS', newItems);
        }
        commit('CACHE_LOADED_PAGE_LIKED_POSTS', state.currentPageLikedPosts);
      }
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
      commit('SET_FINISHED_LIKED_POSTS', true);
    } finally {
      commit('SET_LOADING_LIKED_POSTS', false);
    }
    },
  async loadMoreUserPosts({ state, commit }) {
    if (!state.finishedUserPosts && !state.loadingUserPosts) {
      // commit('SET_LOADING_USER_POSTS', true);// 设置加载状态为true
      commit('SET_CURRENT_PAGE_USER_POSTS', state.currentPageUserPosts + 1);
      await this.dispatch('post/fetchUserPosts');
    }
  },
  async loadMoreLikedPosts({ state, commit }) {
    if (!state.finishedLikedPosts && !state.loadingLikedPosts) {
      commit('SET_CURRENT_PAGE_LIKED_POSTS', state.currentPageLikedPosts + 1);
      await this.dispatch('post/fetchLikedPosts');
    }
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
        const response = await UserLikePost({page: 1});// 加载第一页数据
        console.log('打印返回的数据结构',response); // 打印返回的数据结构
        if (response && response.results) {
          const likedPostIds = response.results.map((item: SocialData) => item.id);// 提取 id
          commit('SET_LIKED_POSTS', likedPostIds);
        }
      } catch (error) {
        console.error('Failed to fetch liked posts:', error);
      }
    },
  },
  getters: {
    isPostLiked: (state) => (postId: number) => {
      return state.likedPosts.includes(postId);
    },
    viewHistory: (state) => {
      // return state.viewHistory;// 仓库中的观看历史
      // 从 localStorage 中读取观看历史
      const storedViewHistory = localStorage.getItem('viewHistory');
      return storedViewHistory ? JSON.parse(storedViewHistory) : state.viewHistory;
    },
    paginatedViewHistory: (state) => {
    // 计算分页的起始和结束索引
    const start = (state.currentPageViewHistory - 1) * state.itemsPerPageViewHistory;
    const end = start + state.itemsPerPageViewHistory;

    // 返回分页后的观看历史
    return state.viewHistory.slice(start, end);
  },
  }
};