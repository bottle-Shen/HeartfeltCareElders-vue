<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getKnowledgeById } from "@/api/knowledge";
import type { IKnowledge } from "@/@types/knowledge";

const route = useRoute();
const router = useRouter(); // 获取路由实例
const knowledge = ref<IKnowledge | null>(null);
// 返回按钮的逻辑
const goBack = () => {
    router.back(); // 返回到上一个页面
};

onMounted(async () => {
    const id = route.params.id as unknown as number;
    try {
        knowledge.value = await getKnowledgeById(id);
    } catch (error) {
        console.error("Failed to fetch knowledge:", error);
    }
});
onUnmounted(() => {
    sessionStorage.removeItem("scrollPosition"); // 清除滚动位置
});
</script>
<template>
    <div class="knowledge-detail">
        <!-- 返回按钮 -->
        <button @click="goBack" class="back-button">返回</button>
        <h1>{{ knowledge?.title }}</h1>
        <img :src="knowledge?.image" :alt="knowledge?.title" class="knowledge-image" />
        <p>{{ knowledge?.content }}</p>
    </div>
</template>

<style lang="scss" scoped>
.knowledge-detail {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.knowledge-image {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
}
</style>