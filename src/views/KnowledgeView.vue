<script setup lang="ts">
import { useInfiniteScroll } from '@/utils'
import { useStore } from 'vuex'
// 定义响应式数据
const store = useStore()
const knowledgeData = computed(() => store.state.knowledge.knowledgeData)
const knowledgeDataContainerRef = ref<HTMLElement | null>(null)// 滚动容器的引用
const loading = computed(() => store.state.knowledge.loading)// 获取加载状态
const finished = computed(() => store.state.knowledge.finished)// 获取加载完成状态

// 初始化数据
const getKnowledge = async () => {
  await store.dispatch('knowledge/fetchKnowledgeData')
}
// 使用无限滚动逻辑
const {  cleanup: cleanupKnowledgeData,
  restoreScrollPosition: restoreKnowledgeDataScroll,
  addScrollListeners: addKnowledgeDataListeners,
   removeScrollListeners: removeKnowledgeDataListeners
} = useInfiniteScroll(knowledgeDataContainerRef,
  async () => {
  // 获取当前状态
  const { finished, loading } = store.state.knowledge;

  // 如果已经加载完成或正在加载中，则不触发加载更多
  if (finished || loading) {
    return;
  }

  // 调用加载更多数据的逻辑
  await store.dispatch('knowledge/loadMoreKnowledgeData');
}, 300,'knowledgeDataContainerRef')

// 挂载时添加滚动事件监听
onMounted(() => {
  try {
    store.commit('loading/SET_LOADING', true); // 设置全局加载状态为 true
    getKnowledge(); // 加载健康知识数据
  } catch (error) {
    console.error('加载健康知识失败:', error);
    ElMessage.error('加载健康知识失败，请稍后重试');
  } finally {
    store.commit('loading/SET_LOADING', false); // 设置全局加载状态为 false
  }
    restoreKnowledgeDataScroll()
    addKnowledgeDataListeners()
});

// 卸载时移除滚动事件监听
onUnmounted(() => {
  removeKnowledgeDataListeners()
  cleanupKnowledgeData()
});
</script>
<template>
    <div class="knowledge-page">
        <h1>健康知识库</h1>
        <!-- 知识列表 -->
         <div ref="knowledgeDataContainerRef" class="knowledge-list">
            <ul class="cards" v-for="(knowledge,index) in knowledgeData" :key="knowledge.id">
            <li class="card" :class="`color-${index % 4}`">
                <router-link :to="`/knowledge/${knowledge.id}`" class="card-link">
                      <p class="tip">{{ knowledge.title }}</p>
                      <p class="second-text">{{ knowledge.desc }}</p>
                </router-link>
            </li>
         </ul>
         <!-- 加载状态 -->
        <LoadingCom v-if="loading" class="loading"/>
        <!-- 没有更多数据 -->
        <div v-if="finished" class="finished">没有更多数据了</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
h1{
    height: 9.2vh;
    padding-left: 2.1vw;
    min-height: rem(50);
    @extend .title-big;
    @extend .flex-align-center;
}
.knowledge-list{
    // max-height: 80vh; //高度限制
    width: 100%;
    height: 100%;
    overflow: auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    position: absolute;
.cards {
    width: 90%;
    // border: 1px solid red;
    // flex:1 1 auto;
    padding-bottom: rem(30);
  .card {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    height: rem(100);
    // width: 240px;
    // width: 100%;
    border-radius: rem(10);
    color: var(--black);
    cursor: pointer;
    transition: 400ms;
    white-space: nowrap; // 防止文字换行
    .card-link{
      width: 100%;
    }
    p.tip {
    font-size: 1em;
    font-weight: 700;
    padding-bottom: rem(5);
    overflow: hidden;// 隐藏超出部分
    text-overflow: ellipsis; // 显示省略号
    }
    p.second-text {
      font-size: .7em;
      overflow: hidden;// 隐藏超出部分
      text-overflow: ellipsis; // 显示省略号
    }
    @include hover{
    &:hover{//卡片悬停时放大
        transform: scale(1.1, 1.1);
    }
    }
}
}

}
</style>