<script setup lang="ts">
import type {SocialData} from '@/@types/social'
// import { searchPost } from '@/api/social'
import { useStore } from 'vuex'
import { useInfiniteScroll } from '@/utils'

const store = useStore()
const route = useRoute();
const postList = computed(() => store.state.post.searchPostList);
const socialDataContainerRef = ref<HTMLElement | null>(null)// 滚动容器的引用
const loading = computed(() => store.state.post.loadingSearchPosts)// 获取加载状态
const finished = computed(() => store.state.post.finishedSearchPosts)// 获取加载完成状态
// 检测是否有搜索结果
const noResults = computed(() => postList.value.length === 0);
// 使用无限滚动逻辑
const { cleanup: cleanupPostList, restoreScrollPosition: restorePostListScroll,
      resetScrollPosition:resetPostListScroll,
  addScrollListeners: addPostListeners,
  removeScrollListeners: removePostListScroll
 } = useInfiniteScroll(socialDataContainerRef,
  async() => {
    // 获取当前状态
    const { finished, loading } = store.state.post;

    // 如果已经加载完成或正在加载中，则不触发加载更多
    if (finished || loading) {
      return;
    }

    // 调用加载更多数据的动作
    await store.dispatch('post/loadMoreSearchSocialData');
} , 300,'searchSocialListScrollPosition')

const recordViewHistory = (post: SocialData) => {
  // 记录观看历史
  store.dispatch('post/addToViewHistory', post);
};

onMounted(async () => {
   const query = route.query.q as string;
  if (query) {
      try {
          store.commit('post/SET_SEARCH_QUERY', query);// 更新搜索关键词
      await store.dispatch('post/fetchSearchSocialList');// 重新加载搜索数据
    } catch (error) {
      console.error('搜索失败：', error);
    }
  }
  // console.log('恢复滚动位置');
    restorePostListScroll()// 恢复滚动位置
    addPostListeners()
    store.commit('loading/SET_LOADING', false);
});
onUnmounted(() => {
  // 移除滚动事件监听
  removePostListScroll()
  // 清理资源
  cleanupPostList()
});
// 监听路由变化，重新加载搜索数据
watch(
  () => route.query.q,
  (newQuery) => {
    if (newQuery) {
      resetPostListScroll(); // 重置滚动位置
      store.commit('post/SET_SEARCH_QUERY', newQuery);
      store.commit('post/SET_CURRENT_PAGE_SEARCH_POSTS', 1); // 重置当前页码
      store.commit('post/CLEAR_LOADED_PAGES_SEARCH_POSTS'); // 清空已加载的页码记录
      store.commit('post/SET_FINISHED_SEARCH_POSTS', false);// 重置完成状态
      store.dispatch('post/fetchSearchSocialList');
    }
  }
);
onBeforeRouteLeave((to) => {
  // 判断目标路由是否是详情页
    if (to.name !== 'searchPostDetail') {
    resetPostListScroll(); // 重置滚动位置
    // 如果不是详情页，清理搜索数据
    store.commit('post/SET_SEARCH_QUERY', '');
    store.commit('post/SET_SEARCH_POST_LIST', []);
    store.commit('post/CLEAR_LOADED_PAGES_SEARCH_POSTS');
    store.commit('post/SET_FINISHED_SEARCH_POSTS', false);
    store.commit('post/SET_CURRENT_PAGE_SEARCH_POSTS', 1);
  }
});
</script>
<template>
  <div class="interact-page h-full">
    <div class="header">
      <h1>搜索结果</h1>
    </div>
    <div ref="socialDataContainerRef" class="post-list">
      <div v-if="noResults" class="no-results">
        暂无搜索结果
      </div>
      <div v-for="(post,index) in postList" :key="post.id" class="post-item">
        <router-link :to="`/searchpost/${post.id}`" @click="recordViewHistory(post)">
          <!-- 添加对post和post.user的校验，否则在重新回到列表页时user字段为undefined报错。 -->
          <CardsCom v-if="post && post.user" :post="post" :index="index"></CardsCom>
        </router-link>
      </div>
      <!-- 加载状态 -->
        <LoadingCom v-if="loading" class="loading"/>
        <!-- 没有更多数据 -->
        <div v-if="!noResults && finished" class="finished">没有更多数据了</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.interact-page {
  .header {
    @extend .flex-between;
    padding: 2.1vh 0;
    padding-left: 2.1vw;
  }
  .post-list{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap:rem(0) rem(80);
    position: fixed;
    padding: 0 2.1vw;
    max-height: 80vh; //高度限制
    overflow: auto;
  }
  .el-form-item {
    padding-bottom: rem(18);
    &:last-child{
      padding-bottom: rem(0);
    }
  }
  .post-item {
    max-width: rem(315);
    padding-bottom: rem(30);
    // padding-right: rem(80);
    // padding: rem(30) 0;
  }
}
</style>