<script setup lang="ts">
import { getDocument } from '@/api/document';
import type { HealthData } from '@/@types/healthdata'
import { useStore } from 'vuex'
const store = useStore()
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);// 获取用户是否登录

interface documentData {
    created_at: string,
    file: string,
    elderly: number,
    id: number,
    health_data: HealthData,
}
const documentData = ref<documentData[]>([])
const documentURL = ref<string[]>([])// 文档下载URL
const documentTimes = ref<string[]>([]); // 存储用户测量时间
const pageSize = ref(80); // 每页显示的条数
const currentPage = ref(1); // 当前页码

const getDocumentBtn = async() => {
    const response = await getDocument()
    console.log(response)
    documentData.value = response.results
    documentURL.value = documentData.value.map(item => item.file)
     // 提取每个 URL 中的时间并格式化
    documentTimes.value = documentURL.value.map(url => formatDate(extractTime(url)));
    console.log(documentTimes.value);
};

// 提取时间的函数
const extractTime = (url: string): string => {
    const timeRegex = /(\d{4}-\d{2}-\d{2}_\d{6})/;
    const match = url.match(timeRegex);
    return match ? match[1] : 'No time found';
};

// 格式化时间的函数
const formatDate = (timeString: string): string => {
    if (timeString === 'No time found') {
        return '时间不可用';
    }

    const [datePart, timePart] = timeString.split('_');
    const [year, month, day] = datePart.split('-');
    const [hour, minute, second] = timePart.match(/(\d{2})(\d{2})(\d{2})/)!.slice(1);

    return `${year}年${month}月${day}日 ${hour}:${minute}:${second}`;
};

// 计算分页数据
const paginatedData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return documentURL.value.slice(start, end);
});

const paginatedTimes = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return documentTimes.value.slice(start, end);
});
// 分页按钮点击事件
const nextPage = () => {
    if (currentPage.value < Math.ceil(documentURL.value.length / pageSize.value)) {
        currentPage.value++;
    }
};

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};
onMounted(() => {
    getDocumentBtn();
});

</script>
<template>
    <div class="knowledge-page">
    <div v-if="isAuthenticated">
        <ul>
            <li v-for="(url, index) in paginatedData" :key="index">
                <a :href="url" target="_blank" class="download-link">
                    <img src="" alt="File" class="file-icon"> <!-- 文件图标 -->
                    {{ url.split('/').pop() }} <!-- 显示文件名 -->
                </a> - 测量时间: {{ paginatedTimes[index] }}
            </li>
        </ul>
        <!-- 健康档案 -->
        <!-- <el-button @click="getDocumentBtn"></el-button> -->
         <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
            <span>第 {{ currentPage }} 页 / 共 {{ Math.ceil(documentURL.length / pageSize) }} 页</span>
            <button @click="nextPage" :disabled="currentPage >= Math.ceil(documentURL.length / pageSize)">下一页</button>
        </div>
    </div>
    <!-- 未登录 -->
    <div v-else class="not-logged-in">
      <div class="noFound-item">
        未登录，<router-link class="link" to="/login">登录</router-link>后查看健康档案
      </div>
    </div>
    </div>
</template>

<style scoped lang="scss">
.knowledge-page{
    padding-top:2.1vh;
}
</style>