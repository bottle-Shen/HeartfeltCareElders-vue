<script setup lang="ts">
import { getKnowledge } from '@/api/knowledge'
import type { IKnowledge } from '@/@types/knowledge';
// getKnowledge()
// 定义响应式数据
const knowledges = ref<IKnowledge[]>([]);
const currentPage = ref(1);
const loading = ref(false);// 控制加载状态
const finished = ref(false);// 控制是否加载完成

// 加载知识数据
const loadKnowledges = async () => {
    if (loading.value || finished.value) return;
    loading.value = true;// 开始加载时设置为 true
    try {
        const params = {
            page: currentPage.value,
            limit: 10, // 每页加载 10 条数据
        };
        const response = await getKnowledge(params);
        const newItems = response.results || [];

        if (newItems.length === 0) {
            finished.value = true; // 没有更多数据
        } else {
            knowledges.value = [...knowledges.value, ...newItems];
            currentPage.value++;
        }
    } catch (error) {
        console.error("Failed to fetch knowledge:", error);
    } finally {
        loading.value = false;// 加载完成后设置为 false
    }
};

// 监听滚动事件
const handleScroll = () => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // 判断是否滚动到底部
    if (scrollTop + windowHeight >= documentHeight - 10) { // 10 是一个容差值
        loadKnowledges();
    }
    // 监听滚动事件并保存滚动位置
    sessionStorage.setItem("scrollPosition", String(scrollTop)); // 保存滚动位置
};

// 挂载时添加滚动事件监听
onMounted(() => {
    loadKnowledges(); // 初始加载数据
    window.addEventListener("scroll", handleScroll);
});

// 卸载时移除滚动事件监听
onUnmounted(() => {
    window.removeEventListener("scroll", handleScroll);
});
</script>
<template>
    <div class="knowledge-page">
        <h1>健康知识库</h1>
        <!-- 知识列表 -->
            <ul class="knowledge-list" v-for="knowledge in knowledges" :key="knowledge.id">
            <li>
                <div>
                    <router-link :to="`/knowledge/${knowledge.id}`" class="knowledge-item">
                        <div>
                            <div>
                                <div class="flex-center">
                                    <img :src="knowledge.image" :alt="knowledge.title" class="knowledge-image" />
                                </div>
                            </div>
                            <div><!--播放条--></div>
                            <span>
                                <span>爱心</span>
                                <span>点赞数</span>
                            </span>
                            <p>标题</p>
                        </div>
                        <p>标题</p>
                    </router-link>
                </div>
            </li>
         </ul>
        <LoadingCom v-if="loading" class="loading-com"></LoadingCom>
    </div>
</template>

<style scoped lang="scss">
.knowledge-list{
    width: 200px;
    height: 300px;
    border: 1px solid red;
    margin-left: 20px;
    margin-bottom: 15px;
    float: left;
    .knowledge-item{
        position: relative;
    }
    img{
        width: 100%;
        height: 100%;
    }
}
.loading-com{
    // width: 100%;
    background-color: red;
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}
</style>