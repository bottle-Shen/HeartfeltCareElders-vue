<script setup lang="ts">
import { getArticle } from '@/api/article'
// getKnowledge()
// 定义响应式数据
const articles = ref([]);
// 在组件挂载时调用接口
onMounted(async () => {
    try {
        const response = await getArticle();
        articles.value = response.data;
    } catch (error) {
        console.error('Failed to fetch knowledge:', error);
    }
});
</script>
<template>
    <div class="knowledge-page">
        <h1>健康知识库</h1>
        <dl v-for="article in articles" :key="article.id">
            <dt>文章标题</dt>
            <dd>{{ article.title }}</dd>
            <dt>文章内容</dt>
            <dd>{{ article.content }}</dd>
        </dl>
        <!-- <el-button type="primary" @click="">添加</el-button> -->
    </div>
</template>

<style scoped lang="scss">

</style>

<style scoped lang="scss">

</style>