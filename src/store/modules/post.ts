import type { Module } from 'vuex'
import { type RootState } from '@/store/index'
// import { store, type RootState } from '@/store/index'
import type { SocialData,CommentData } from '@/@types/social'
import { getSocial,UserLikePost,getUserSocial,searchPost } from '@/api/social'
import SecureLS from 'secure-ls';
const secret = import.meta.env.VUE_APP_ENCRYPTION_SECRET || 'default-secret';
const ls = new SecureLS({ encodingType: 'aes', encryptionSecret: secret });

export interface PostState {
    userPosts: SocialData[]; // 用户发布的帖子
    likedPosts: number[]; // 存储点赞的帖子
    likedPostsId: number[]; // 存储点赞的帖子ID
    socialData: SocialData[];// 所有帖子
    searchQuery:string,// 搜索帖子关键词
    searchPostList: SocialData[];// 全部帖子搜索
    currentPageUserPosts: number; // 用户发布帖子的当前页码
    currentPageLikedPosts: number; // 用户点赞帖子的当前页码
    currentPageSearchPosts: number;// 全部帖子搜索当前页码
    loadingUserPosts: boolean; // 用户发布帖子的加载状态
    loadingLikedPosts: boolean; // 用户点赞帖子的加载状态
    loadingSearchPosts: boolean;// 全部帖子搜索加载状态
    finishedUserPosts: boolean; // 用户发布帖子是否加载完成
    finishedLikedPosts: boolean; // 用户点赞帖子是否加载完成
    finishedSearchPosts: boolean;// 全部帖子搜索是否加载完成
    loadedPagesUserPosts: Set<number>; // 缓存已加载的页码（用户发布帖子）
    loadedPagesLikedPosts: Set<number>; // 缓存已加载的页码（用户点赞帖子）
    loadedPagesSearchPosts: Set<number>;// 全部帖子搜索已加载的页码
    currentPage: number;// 全部帖子当前页码
    loading: boolean;
    finished: boolean;
    loadedPages:Set<number>;
    viewHistory: SocialData[]; // 观看历史
    currentPageViewHistory: number; // 当前页码
    loadingViewHistory: boolean; // 加载状态
    finishedViewHistory: boolean; // 是否加载完成
    loadedPagesViewHistory: Set<number>,
    itemsPerPageViewHistory: number,
    maxPages: number,// 最大页数
}

export const PostModule: Module<PostState, RootState> = {
  namespaced: true, // 使用命名空间，避免命名冲突
  state: {
      userPosts: [],// 用户发布的帖子
      likedPosts: [],// 用户点赞的帖子
      likedPostsId: [],// 用户点赞的帖子ID
      searchQuery: '',// 搜索查询关键词
      searchPostList: [],// 全部帖子搜索
      socialData: [],// 所有帖子
      currentPageUserPosts: 1,
      currentPageLikedPosts: 1,
      currentPageSearchPosts: 1,
      loadingUserPosts: false,
      loadingLikedPosts: false,
      loadingSearchPosts: false,
      finishedUserPosts: false,
      finishedLikedPosts: false,
      finishedSearchPosts: false,
      loadedPagesUserPosts: new Set(),
      loadedPagesLikedPosts: new Set(),
      loadedPagesSearchPosts: new Set(),
      currentPage: 1, // 当前页码
      loading: false, // 加载状态
      finished: false, // 是否加载完成
      loadedPages: new Set(), // 缓存已加载的页码
      viewHistory: [], // 观看历史
      currentPageViewHistory: 0, // 当前页码
      loadingViewHistory: false, // 加载状态
      finishedViewHistory: false, // 是否加载完成
      loadedPagesViewHistory: new Set(),
      itemsPerPageViewHistory: 50,// 每页显示的观看历史数量
      maxPages:10,// 最大页数
    },
  mutations: {
      // 设置用户发布的帖子
        SET_USER_POSTS(state, posts: SocialData[]) {
          // console.log('SET_USER_POSTS called', posts);
          state.userPosts = posts;
        },
        // 追加用户发布的帖子
        APPEND_USER_POSTS(state, posts: SocialData[]) {
          state.userPosts.push(...posts);
        },
        // 设置用户点赞的帖子ID
        SET_LIKED_POSTS_ID(state, postIds: number[]) {
          state.likedPostsId = postIds;
        },
        // 设置用户点赞的帖子
        SET_LIKED_POSTS(state, postIds: number[]) {
          // console.log('SET_LIKED_POSTS called', postIds);
          state.likedPosts = postIds;
        },
        // 设置用户帖子搜索关键词
        SET_SEARCH_QUERY(state, query: string) {
          state.searchQuery = query;
        },
        // 设置用户搜索的帖子列表
        SET_SEARCH_POST_LIST(state, posts: SocialData[]) {
          state.searchPostList = posts;
        },
        // 追加用户点赞的帖子
        APPEND_LIKED_POSTS(state, postIds: number[]) {
          state.likedPosts.push(...postIds);
        },
        // 追加用户搜索的帖子列表
        APPEND_SEARCH_POST_LIST(state, posts: SocialData[]) {
          state.searchPostList.push(...posts);
        },
        // 设置用户帖子当前页码
        SET_CURRENT_PAGE_USER_POSTS(state, page: number) {
          state.currentPageUserPosts = page;
        },
        // 设置用户帖子搜索当前页码
        SET_CURRENT_PAGE_SEARCH_POSTS(state, page: number) {
          state.currentPageSearchPosts = page;
        },
        // 设置用户点赞帖子当前页码
        SET_CURRENT_PAGE_LIKED_POSTS(state, page: number) {
          state.currentPageLikedPosts = page;
        },
        // 加载更多用户帖子
        SET_LOADING_USER_POSTS(state, loading: boolean) {
          state.loadingUserPosts = loading;
        },
        // 加载更多用户帖子搜索
        SET_LOADING_SEARCH_POSTS(state, loading: boolean) {
          state.loadingSearchPosts = loading;
        },
        // 加载更多用户点赞帖子
        SET_LOADING_LIKED_POSTS(state, loading: boolean) {
          state.loadingLikedPosts = loading;
        },
        // 加载完成用户帖子
        SET_FINISHED_USER_POSTS(state, finished: boolean) {
          state.finishedUserPosts = finished;
        },
        // 加载完成用户帖子搜索
        SET_FINISHED_SEARCH_POSTS(state, finished: boolean) {
          state.finishedSearchPosts = finished;
        },
        // 加载完成用户点赞帖子
        SET_FINISHED_LIKED_POSTS(state, finished: boolean) {
          state.finishedLikedPosts = finished;
        },
        // 缓存已加载的页码用户帖子
        CACHE_LOADED_PAGE_USER_POSTS(state, page: number) {
          state.loadedPagesUserPosts.add(page);
        },
        // 缓存已加载的页码用户帖子搜索
        CACHE_LOADED_PAGE_SEARCH_POSTS(state, page: number) {
          state.loadedPagesSearchPosts.add(page);
        },
        // 缓存已加载的页码用户点赞帖子
        CACHE_LOADED_PAGE_LIKED_POSTS(state, page: number) {
          state.loadedPagesLikedPosts.add(page);
        },
        // 清空已加载的页码用户帖子
        CLEAR_LOADED_PAGES_USER_POSTS(state) {
          state.loadedPagesUserPosts.clear();
        },
        // 清空已加载的页码用户帖子搜索
        CLEAR_LOADED_PAGES_SEARCH_POSTS(state) {
          state.loadedPagesSearchPosts.clear();
        },
        // 清空已加载的页码用户点赞帖子
        CLEAR_LOADED_PAGES_LIKED_POSTS(state) {
          state.loadedPagesLikedPosts.clear();
        },
        // 设置观看历史
        SET_VIEW_HISTORY(state, viewHistory: SocialData[]) {
          state.viewHistory = viewHistory;
        },
        // 追加数据观看历史
        ADD_TO_VIEW_HISTORY(state, post: SocialData) {
          // 添加帖子到观看历史
          const existingIndex = state.viewHistory.findIndex((item) => item.id === post.id);
          if (existingIndex === -1) {
            state.viewHistory.push(post);
          } else {
            state.viewHistory[existingIndex] = post; // 更新已有记录
          }
          // localStorage.setItem('viewHistory', JSON.stringify(state.viewHistory));// 保存到本地存储
        },
        // 设置当前页码观看历史
        SET_CURRENT_PAGE_VIEW_HISTORY(state, page: number) {
          state.currentPageViewHistory = page;
        },
        // 设置加载状态观看历史
        SET_LOADING_VIEW_HISTORY(state, loading: boolean) {
          state.loadingViewHistory = loading;
        },
        // 设置完成状态观看历史
        SET_FINISHED_VIEW_HISTORY(state, finished: boolean) {
          state.finishedViewHistory = finished;
        },
        // 缓存已经加载的观看历史
        CACHE_LOADED_PAGE_VIEW_HISTORY(state, page: number) {
          state.loadedPagesViewHistory.add(page);
        },
        // 清空已加载的页码观看历史
        CLEAR_LOADED_PAGES_VIEW_HISTORY(state) {
          state.loadedPagesViewHistory.clear();
        },
        // 加载观看历史
        LOAD_VIEW_HISTORY(state, viewHistory) {
          state.viewHistory = viewHistory;
          state.loadingViewHistory = false; // 加载完成后关闭加载状态
          state.finishedViewHistory = viewHistory.length === 0; // 如果没有数据，标记为加载完成
        },
        // 更新帖子数据
        updatePost(state, post: SocialData) {
          const index = state.socialData.findIndex(item => item.id === post.id);
          if (index !== -1) {
            state.socialData[index] = post;// 更新特定帖子
          } else {
            state.socialData.push(post);// 如果帖子不存在，则添加新帖子
          }
        },
        // 更新评论数据
      updatePostComments(state, payload:{ postId:number, comments: CommentData[] }) {
          const post = state.socialData.find(item => item.id === payload.postId);
          if (post) {
            post.comments = payload.comments;
          }
        },
        // 添加点赞的帖子ID
        addLikedPost(state, postId) {
          if (!state.likedPostsId.includes(postId)) {
            state.likedPostsId.push(postId);
          }
        },
        // 移除点赞的帖子ID
        removeLikedPost(state, postId) {
          state.likedPostsId = state.likedPostsId.filter(id => id !== postId);
    },
        // 设置所有帖子数据
        SET_SOCIAL_DATA(state, data: SocialData[]) {
            state.socialData = data;// 设置初始数据
        },
        // 追加全部帖子数据
        APPEND_SOCIAL_DATA(state, data: SocialData[]) {
          state.socialData.push(...data); // 追加新数据
        },
        // 设置当前页码全部帖子
        SET_CURRENT_PAGE(state, page: number) {
            state.currentPage = page;
        },
        // 设置加载状态全部帖子
        SET_LOADING(state, loading: boolean) {
          state.loading = loading;
        },
        // 设置完成状态全部帖子
        SET_FINISHED(state, finished: boolean) {
          state.finished = finished;
        },
        // 缓存已加载的页码全部帖子
        CACHE_LOADED_PAGE(state, page) {
          state.loadedPages.add(page);
        },
    },
  actions: {
    // 添加帖子到观看历史
    addToViewHistory({ state,commit }, post: SocialData) {
      commit('ADD_TO_VIEW_HISTORY', post);// 添加到观看历史
      // 动态分页存储到 localStorage
      const pageSize = state.itemsPerPageViewHistory;// 每页存储50条数据
      const maxPages = state.maxPages;// 最多存储10页
      const maxItems = pageSize * maxPages; // 最多存储数据数量
      // 如果数据超过最大数量，从第一页开始覆盖旧数据
      if (state.viewHistory.length > maxItems) {
        state.viewHistory = state.viewHistory.slice(-maxItems); // 丢弃最旧的一条数据
      }
      const totalPages = Math.ceil(state.viewHistory.length / pageSize);// 计算总页数
      const limitedPages = Math.min(totalPages, maxPages);// 限制页数

      for (let i = 0; i < limitedPages; i++) {// 遍历页数
        const start = i * pageSize;
        const end = start + pageSize;
        // localStorage.setItem(`viewHistoryPage${i}`, JSON.stringify(state.viewHistory.slice(start, end)));
        ls.set(`viewHistoryPage${i}`, state.viewHistory.slice(start, end)); // 使用 SecureLS 加密本地存储
      }

      commit('SET_LOADING_VIEW_HISTORY', false);
    },
    loadMoreViewHistory({ state, commit }) {// 仓库存储-获取更多观看历史数据
      // 如果当前页码已经加载过，则不执行任何操作
      if (state.loadedPagesViewHistory.has(state.currentPageViewHistory)) return;
      // 如果已经加载完成或正在加载，则不执行任何操作
      if (state.finishedViewHistory || state.loadingViewHistory) return;

      commit('SET_LOADING_VIEW_HISTORY', true);// 设置加载状态为true
      commit('SET_CURRENT_PAGE_VIEW_HISTORY', state.currentPageViewHistory+1); // 更新当前页码
    try {
      const pageData = ls.get(`viewHistoryPage${state.currentPageViewHistory}`);
      let newItems = [];

      // 检查 pageData 是否已经是对象
    if (typeof pageData === 'object' && !Array.isArray(pageData)) {
      newItems = pageData;
    } else if (typeof pageData === 'string') {
      // 尝试解析 JSON 字符串
      try {
        newItems = JSON.parse(pageData);
      } catch (error) {
        console.error(`Failed to parse JSON for page ${state.currentPageViewHistory}:`, error);
        newItems = []; // 如果解析失败，设置为空数组
      }
    }

      if (newItems.length === 0) {
        commit('SET_FINISHED_VIEW_HISTORY', true);// 有更多数据，设置加载完成状态
      } else {
        commit('SET_VIEW_HISTORY', [...state.viewHistory, ...newItems]); // 追加新数据
        commit('CACHE_LOADED_PAGE_VIEW_HISTORY', state.currentPageViewHistory); // 缓存已加载的页码
      }
    } catch (error) {
      console.error('Failed to load more view history:', error);
    } finally {
      commit('SET_LOADING_VIEW_HISTORY', false);
    }
    },
    loadViewHistoryFromLocalStorage({ state,commit }) {// 从本地存储加载观看历史数据
     const viewHistory = [];

    // 加载所有页的数据
    for (let i = 0; i < state.maxPages; i++) {
      // const pageData = localStorage.getItem(`viewHistoryPage${i}`);
      const pageData = ls.get(`viewHistoryPage${i}`);
      if (pageData) {
      try {
        // 检查 pageData 是否已经是对象
        if (typeof pageData === 'object') {
          viewHistory.push(...pageData);
        } else {
          // 尝试解析 JSON 字符串
          const parsedData = JSON.parse(pageData);
          viewHistory.push(...parsedData);
        }
      } catch (error) {
        console.error(`Failed to parse JSON for page ${i}:`, error);
        // 如果解析失败，跳过当前页
        continue;
      }
    }
  }

   
    // 设置整个观看历史
    commit('SET_VIEW_HISTORY', viewHistory);

    // 初始化分页状态
    // commit('SET_CURRENT_PAGE_VIEW_HISTORY', 0); // 当前页码设置为0
    // commit('SET_LOADING_VIEW_HISTORY', false); // 加载状态设置为false
    // commit('SET_FINISHED_VIEW_HISTORY', false); // 加载完成状态设置为false
    // commit('CLEAR_LOADED_PAGES_VIEW_HISTORY'); // 清空已加载的页码缓存
    // commit('CACHE_LOADED_PAGE_VIEW_HISTORY', 0); // 缓存第一页
    },
    // 获取用户发布帖子数据
     async fetchUserPosts({ state, commit }) {
       //  如果当前页已经加载过，直接返回
       if (state.loadedPagesUserPosts.has(state.currentPageUserPosts)) return;
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
     // 获取用户点赞帖子数据
    async fetchLikedPosts({ state, commit }) {
      // 如果当前页已经加载过，直接返回
      if (state.loadedPagesLikedPosts.has(state.currentPageLikedPosts)) return;
    if (state.loadingLikedPosts || state.finishedLikedPosts) return;

    commit('SET_LOADING_LIKED_POSTS', true);// 设置加载状态为true
    try {
      const params = {
        page: state.currentPageLikedPosts,
        limit: 10,
      };
      const response = await UserLikePost(params);
      const newItems = response.results || [];

      if (newItems.length === 0) {
        commit('SET_FINISHED_LIKED_POSTS', true);// 如果没有更多数据，标记为加载完成
      } else {
        if (state.currentPageLikedPosts === 1) {
          commit('SET_LIKED_POSTS', newItems);// 如果是第一页，直接设置数据
        } else {
          commit('APPEND_LIKED_POSTS', newItems);// 否则追加数据
        }
        commit('CACHE_LOADED_PAGE_LIKED_POSTS', state.currentPageLikedPosts);// 缓存已加载的页码
      }
    } catch (error) {
      console.error('Failed to fetch liked posts:', error);
      commit('SET_FINISHED_LIKED_POSTS', true);// 标记为加载完成
    } finally {
      commit('SET_LOADING_LIKED_POSTS', false);// 结束加载状态
    }
    },
  // 加载更多用户发布帖子数据
  async loadMoreUserPosts({ state, commit }) {
    if (!state.finishedUserPosts && !state.loadingUserPosts) {
      commit('SET_CURRENT_PAGE_USER_POSTS', state.currentPageUserPosts + 1);// 更新当前页码
      await this.dispatch('post/fetchUserPosts');// 加载数据
    }
    },
  // 加载更多用户点赞帖子数据
  async loadMoreLikedPosts({ state, commit }) {
    if (!state.finishedLikedPosts && !state.loadingLikedPosts) {
      commit('SET_CURRENT_PAGE_LIKED_POSTS', state.currentPageLikedPosts + 1);// 更新当前页码
      await this.dispatch('post/fetchLikedPosts');// 加载数据
    }
    },
  // 获取全部帖子数据
    async fetchSocialData({ state, commit }) {
      // console.log(`Current Page: ${state.currentPage}, Loaded Pages: ${Array.from(state.loadedPages)}`);
      // console.log(`fetchSocialData called, current page: ${state.currentPage}`);
      // 如果当前页已经加载过，直接返回
      if (state.loadedPages.has(state.currentPage)) {
        // console.log(`页码:${state.currentPage}已经加载过，直接返回.`);
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
      // console.log(`fetchSocialData finished, current page: ${state.currentPage}`);
    },
    // 加载更多全部帖子数据
    async loadMoreData({ state, commit }) {
      // 只有在未完成加载且不是正在加载时才触发加载更多
      if (!state.finished && !state.loading) {
        commit('SET_CURRENT_PAGE', state.currentPage + 1); // 增加页码
        await this.dispatch('post/fetchSocialData'); // 调用 fetchSocialData 加载数据
      }
    },
    // 初始化用户点赞帖子数据
    async initializeLikedPosts({ commit }) {
      try {
        const response = await UserLikePost({page: 1});// 加载第一页数据
        // console.log('打印返回的数据结构',response); // 打印返回的数据结构
        if (response && response.results) {
          const likedPostIds = response.results.map((item: SocialData) => item.id);// 提取 id
          commit('SET_LIKED_POSTS_ID', likedPostIds);
        }
      } catch (error) {
        console.error('Failed to fetch liked posts:', error);
      }
    },
    // 获取搜索帖子数据
    async fetchSearchSocialList({ state, commit }) {
      // console.log(`Current Page: ${state.currentPageSearchPosts}, Loaded Pages: ${Array.from(state.loadedPagesSearchPosts)}`);
      // console.log(`fetchSocialData called, current page: ${state.currentPageSearchPosts}`);
      // 如果当前页已经加载过，直接返回
      if (state.loadedPagesSearchPosts.has(state.currentPageSearchPosts)) {
        // console.log(`页码:${state.currentPageSearchPosts}已经加载过，直接返回.`);
        return;
      }
      if (state.loadingSearchPosts|| state.finishedSearchPosts) return;

      commit('SET_LOADING_SEARCH_POSTS', true);
      try {
        const params = {
          page: state.currentPageSearchPosts,
          search: state.searchQuery,
        };
        const response = await searchPost(params);
        const newItems = response.results || [];

        if (newItems.length === 0) {
          commit('SET_FINISHED_SEARCH_POSTS', true);
        } else {
          if (state.currentPageSearchPosts === 1) {
            // 如果是第一页，直接设置数据，而不是追加
            commit('SET_SEARCH_POST_LIST', newItems);
          } else {
            commit('APPEND_SEARCH_POST_LIST', newItems); // 追加新数据
          }
          commit('CACHE_LOADED_PAGE_SEARCH_POSTS', state.currentPageSearchPosts); // 缓存已加载的页码
        }
      } catch (error) {
        console.error('Failed to fetch social data:', error);
        commit('SET_FINISHED_SEARCH_POSTS', true); // 如果请求失败，标记为加载完成
      } finally {
        commit('SET_LOADING_SEARCH_POSTS', false);
      }
      console.log(`fetchSocialData finished, current page: ${state.currentPageSearchPosts}`);
    },
    // 加载更多搜索帖子数据
    async loadMoreSearchSocialData({ state, commit }) {
      // 只有在未完成加载且不是正在加载时才触发加载更多
      if (!state.finishedSearchPosts && !state.loadingSearchPosts) {
        commit('SET_CURRENT_PAGE_SEARCH_POSTS', state.currentPageSearchPosts + 1); // 增加页码
        await this.dispatch('post/fetchSearchSocialList'); // 调用加载数据
      }
    },
  },
  getters: {
    isPostLiked: (state) => (postId: number) => {
      return state.likedPostsId.includes(postId);
    },
    // viewHistory: (state) => {
    //   // return state.viewHistory;// 仓库中的观看历史
    //   // 从 localStorage 中读取观看历史
    //   const storedViewHistory = localStorage.getItem('viewHistory');
    //   return storedViewHistory ? JSON.parse(storedViewHistory) : state.viewHistory;
    // },
  //   paginatedViewHistory: (state) => {
  //   // 计算分页的起始和结束索引
  //   const start = (state.currentPageViewHistory - 1) * state.itemsPerPageViewHistory;
  //   const end = start + state.itemsPerPageViewHistory;
    
  //   // 返回分页后的观看历史
  //   return state.viewHistory.slice(start, end);
  // },
  }
};