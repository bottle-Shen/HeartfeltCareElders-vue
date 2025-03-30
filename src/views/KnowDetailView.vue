<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getKnowledgeById } from "@/api/knowledge";
import type { IKnowledge } from "@/@types/knowledge";
import { formatDate } from '@/utils'
// import { useStore } from 'vuex'
// 定义响应式数据
// const store = useStore()
const route = useRoute();
const router = useRouter(); // 获取路由实例
const knowledge = ref<IKnowledge | null>(null);
// 返回按钮的逻辑
const goBack = () => {
    router.back(); // 返回到上一个页面
};

onMounted(async () => {
    try {
        // store.commit('loading/SET_LOADING', true); // 设置全局加载状态为 true
        const id = route.params.id as unknown as number;
        knowledge.value = await getKnowledgeById(id);
    } catch (error) {
        console.error('加载健康知识失败:', error);
        ElMessage.error('加载健康知识失败，请稍后重试');
    } finally {
        // store.commit('loading/SET_LOADING', false); // 设置全局加载状态为 false
    }
});
onUnmounted(() => {
    // sessionStorage.removeItem("scrollPosition"); // 清除滚动位置
});
</script>
<template>
    <div class="knowledge-detail">
        <!-- 返回按钮 -->
        <button @click="goBack" class="back-button header">返回</button>
        <div class="content">
            <h1 class="h2">{{ knowledge?.title }}</h1>
            <p class="time">发布时间：{{ formatDate(knowledge?.create_time) }}</p>
            <img :src="knowledge?.image" :alt="knowledge?.title"/>
            <p>{{ knowledge?.content }}</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.header{
    padding: 1.4vw 0;
    @extend .title;
}
.content{
    // display: flex;
    // flex-direction: column;
    // justify-content: center;
    p{
        text-indent: 2em;// 首行首字缩进
    }
    img{
        width: rem(200);
        float: left;
    }
    .time{
        display: flex;
        justify-content: flex-end;
        @extend .body-s;
    }
}
</style>