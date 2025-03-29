<script setup lang="ts">
import { getDocument,getUserElderlyHealthDocument,getCaregiverElderlyHealthDocument } from '@/api/document';
import { getElderlyList} from '@/api/healthData'
import type { HealthData } from '@/@types/healthdata'
import { useStore } from 'vuex'
import type { elderlyInfoResponse } from '@/@types/userInfo'
const selectedElderly = ref<number>(1)// 选择的老人用户ID
const elderlyList = ref<elderlyInfoResponse[]>([])// 机构人员绑定的老人用户列表
const store = useStore()
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);// 获取用户是否登录
const sortDirection = ref<'asc' | 'desc'>('asc'); // 默认为正序
const getUserType = computed(() => store.getters['user/getUserType']);
interface documentData {
    created_at: string,
    file: string,
    elderly: number,
    id: number,
    health_data: HealthData,
}
const documentData = ref<documentData[]>([])// 文档数据
const hasDocumentData = ref(false);// 用于标记是否有文档数据
const documentURL = ref<string[]>([])// 文档下载URL
const documentTimes = ref<string[]>([]); // 存储用户测量时间
const pageSize = ref(20); // 每页显示的条数
const currentPage = ref(1); // 当前页码
const finished = ref(false); // 是否已经加载了所有数据
// 排序数据
const sortData = () => {
  const sortedData = documentData.value.sort((a, b) => {
    const timeA = extractTime(a.file);
    const timeB = extractTime(b.file);
    if (timeA < timeB) return sortDirection.value === 'asc' ? -1 : 1;
    if (timeA > timeB) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });
  documentURL.value = sortedData.map(item => item.file);
  documentTimes.value = sortedData.map(item => formatDate(extractTime(item.file)));
};
// 获取文档
const getDocumentBtn = async (page: number, limit: number) => {
    try {
        // 设置全局加载状态
        store.commit('loading/SET_LOADING', true);
        // 重置状态
        finished.value = false;
        let response;
        if (getUserType.value === 1) {
            response = await getDocument(page, limit);
        } else if (getUserType.value === 2) {
            response = await getUserElderlyHealthDocument(page, limit);
        } else if (getUserType.value === 3) {
            response = await getCaregiverElderlyHealthDocument(selectedElderly.value,page, limit);
        } else {
            throw new Error("未知的用户类型");
        }
        // 更新文档数据
        documentData.value = response.results || [];
        hasDocumentData.value = documentData.value.length > 0;
        // 如果有数据，处理数据-更新当前页的数据
        if (hasDocumentData.value) {
          // 提取文件 URL
          documentURL.value = documentData.value.map(item => item.file);

          // 格式化时间
          documentTimes.value = documentURL.value.map(url => formatDate(extractTime(url)));

          // 排序数据
          sortData();
        }

        // 判断是否加载完所有数据（例如分页加载）
        if (response.results.length < limit) {
          finished.value = true; // 没有更多数据
        }
    } catch (error) {
        console.error('获取文档失败:', error);
        hasDocumentData.value = false;
        // ElMessage.error('没有更多数据了');
    } finally {
        // 清除全局加载状态
        store.commit('loading/SET_LOADING', false);
  }
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
    // console.log('documentURL.value', documentURL.value)
    return documentURL.value;
});

const paginatedTimes = computed(() => {
    return documentTimes.value;
});

// 分页按钮点击事件
const nextPage = async () => {
    if (finished.value) {
        ElMessage.warning('没有更多数据了');
        finished.value = true;
        return;
    }
    currentPage.value++;
    await getDocumentBtn(currentPage.value, pageSize.value);
};

const prevPage = async () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        await getDocumentBtn(currentPage.value, pageSize.value);
    }
};
// 切换排序方向
const toggleSortDirection = () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  sortData(); // 重新排序
};
// 切换老人用户时的处理
const handleElderlyChange = () => {
  // 重置当前页码
  currentPage.value = 1;
  // 重置文档数据
  documentData.value = [];
  documentURL.value = [];
  documentTimes.value = [];
  hasDocumentData.value = false;
  finished.value = false;

  // 调用 getDocumentBtn 方法重新加载数据
  getDocumentBtn(currentPage.value, pageSize.value);
};
onMounted(async () => {
  store.commit('loading/SET_LOADING', true); // 设置全局加载状态为 true
  try {
    if (isAuthenticated.value) {
      if(getUserType.value === 3){
        const response = await getElderlyList();
        elderlyList.value = response;
        // console.log('elderlyList',elderlyList.value)
      }
      await getDocumentBtn(currentPage.value, pageSize.value); // 等待异步操作完成
    }
  } catch (error) {
    console.error('获取文档失败:', error);
    ElMessage.error('获取文档失败，请稍后重试');
  } finally {
    store.commit('loading/SET_LOADING', false); // 设置全局加载状态为 false
  }
});
</script>
<template>
    <div class="knowledge-page">
    <div v-if="isAuthenticated">
        <el-select class="elderly-select" v-if="getUserType === 3" v-model="selectedElderly" placeholder="请选择老人" @change="handleElderlyChange">
          <el-option
            v-for="elderly in elderlyList"
            :key="elderly.elderly_id"
            :label="elderly.username"
            :value="elderly.elderly_id"
          >
            用户名:{{ elderly.username }}
          </el-option>
        </el-select>
        <div class="noFound-item" v-if="!hasDocumentData">
            暂无健康档案
        </div>
        <div v-else>
            <div class="sort-buttons">
            <el-button @click="toggleSortDirection" class="link-button sort-button" plain>{{ sortDirection === 'asc' ? '降序' : '升序' }}</el-button>
        </div>
        <ul>
            <li v-for="(url, index) in paginatedData" :key="index">
                <a :href="url" target="_blank" class="download-link">
                    <!-- <img src="" alt="File" class="file-icon"> 文件图标 -->
                     <svg t="1742417402381" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2658" width="200" height="200"><path d="M616.746667 85.333333L896 347.904V853.333333a85.333333 85.333333 0 0 1-85.333333 85.333334H213.333333a85.333333 85.333333 0 0 1-85.333333-85.333334V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h403.413334z m244.352 295.381334L581.802667 118.186667v177.237333a85.333333 85.333333 0 0 0 85.333333 85.333333h193.962667zM232.746667 512v224.810667h28.074666v-102.570667h14.378667c27.648 0 46.933333-1.109333 57.813333-3.242667 10.88-2.133333 20.053333-5.845333 27.605334-11.093333 7.509333-5.162667 13.269333-11.776 17.28-19.754667 4.053333-7.978667 6.058667-17.024 6.058666-27.050666s-2.048-19.029333-6.186666-27.008a56.661333 56.661333 0 0 0-17.152-19.968 65.962667 65.962667 0 0 0-24.021334-11.050667C327.893333 513.024 309.589333 512 281.728 512H232.746667z m28.074666 96.725333v-70.912h39.210667c36.565333 0 54.869333 11.648 54.869333 34.986667a33.28 33.28 0 0 1-11.946666 26.112c-7.936 6.954667-22.912 10.24-44.885334 9.813333h-37.248zM426.112 512v224.810667h77.056c32 0 56.32-4.778667 73.002667-14.293334 16.64-9.514667 29.525333-22.741333 38.570666-39.637333 9.002667-16.853333 13.525333-34.858667 13.525334-53.888 0-19.029333-3.029333-35.84-9.130667-50.346667a100.864 100.864 0 0 0-26.282667-36.992 108.330667 108.330667 0 0 0-40.661333-22.442666c-15.701333-4.821333-40.746667-7.210667-75.136-7.210667H426.112z m27.093333 199.594667v-173.781334h14.378667c26.794667 0 47.36 1.28 61.738667 3.84 14.378667 2.56 26.88 7.68 37.546666 15.36s18.901333 17.578667 24.661334 29.781334c5.76 12.16 8.661333 25.429333 8.661333 39.765333 0 14.336-2.432 26.965333-7.338667 37.930667a74.282667 74.282667 0 0 1-21.418666 27.733333c-9.386667 7.594667-20.352 12.714667-32.981334 15.36-12.629333 2.688-32.768 4.010667-60.416 4.010667h-24.832z m338.048-82.901334v-26.112h-94.037333v-64.469333h94.037333V512h-122.154666v224.810667h28.117333v-108.117334h94.037333z" fill="#EA5454" p-id="2659"></path></svg>
                    {{ url.split('/').pop() }} <!-- 显示文件名 -->
                    - 测量时间: {{ paginatedTimes[index] }}
                </a>
            </li>
        </ul>
        <!-- 健康档案 -->
        <!-- <el-button @click="getDocumentBtn"></el-button> -->
         <div class="pagination">
            <el-button class="link-button" @click="prevPage" link :disabled="currentPage === 1">上一页</el-button>
            <span>第 {{ currentPage }} 页 / 共 {{ Math.ceil(documentURL.length / pageSize) }} 页</span>
            <el-button class="link-button" @click="nextPage" link :disabled="finished">下一页</el-button>
        </div>
        </div>
    </div>
    <!-- 未登录 -->
    <div v-else class="not-logged-in">
      <div class="noFound-item">
        未登录，<router-link class="link-button" to="/login">登录</router-link>后查看健康档案
      </div>
    </div>
    </div>
</template>

<style scoped lang="scss">
.knowledge-page{
    .elderly-select,.noFound-item{
        padding-top: rem(15);
    }
    .sort-buttons{
        padding:1.4vh 0;
    }
    ul{
        li{
            a{
                display: flex;
                align-items: center;
                @extend .title;
            }
        }
    }
    .pagination{
        margin: rem(15) 0;
        display: flex;
        align-items: center;
    }
    .icon{
        width: rem(30);
        height: rem(30);
    }
}
</style>