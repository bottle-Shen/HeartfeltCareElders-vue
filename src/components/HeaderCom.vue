<script setup lang="ts">
import  SearchCom from './SearchCom.vue'
import { useStore } from 'vuex';
import UserInfoCom from './UserInfoCom.vue'

const store = useStore();

// 直接从 store 中获取 getters
// const token = computed(() => store.getters['getToken']);
const user = computed(() => store.getters['user/getUser']);


const searchQuery = ref(""); // 搜索关键词
// 搜索逻辑
const handleSearch = (query: string) => {
  // 模拟搜索逻辑：根据关键词跳转到知识详情页
  // 假设知识详情页的路由路径为 `/knowledge/:id`
  const knowledgeId = searchKnowledge(query); // 搜索知识并获取 ID
  if (knowledgeId) {
    router.push(`/knowledge/${knowledgeId}`); // 跳转到知识详情页
  } else {
    alert("未找到相关知识");
  }
};

// 模拟搜索函数
const searchKnowledge = (query: string): string | null => {
  // 这里可以根据实际逻辑调用 API 或查询 Vuex 状态
  // 示例：假设返回知识的 ID
  return query.toLowerCase() === "example" ? "123" : null;
};
</script>
<template>
  <div class="element-header flex-center">
    <div class="logo">
      <img src="../assets/images/LOGO.png" />
    </div>
    <div class="search">
      <SearchCom @search="handleSearch" class="search-com"></SearchCom>
    </div>
    <div class="flex info flex-between">
      <el-icon class="info-items icon">
        <i-ep-Tools />
      </el-icon>
      <el-icon class="info-items icon">
        <i-ep-BellFilled />
      </el-icon>
      <!-- <el-button>登录</el-button>
        <el-button type="primary" class="ml-2">退出</el-button> -->
      <div class="info-items userInfo">
       <div class="userInfo-avatar">
         <el-avatar :size="45" class="mr-3" :src="user.avatar" />
       </div>
        <div class="userInfo-com">
          <UserInfoCom/>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
// @use '@/styles/main.scss';
.element-header{
    height: 100%;
    // display: flex;
    // justify-content: space-between;
    // line-height: 60px;
    .logo{
        flex: 2;
        img{
          width: 40%;
          object-fit: contain;
        }
    }
    .search{
      flex: 5;
      // margin: 0 30px;
      .search-com{
        width: 70%;
      }
    }
    .info{
    // display: flex;
    flex: 3;
    .info-items{
      // border: 1px solid red;
      // border-left: 1px solid #F2F2F2;
    }
    .icon{
      // height: 100%;
      // flex: 0.5;
      // color: #CBD0D4;
      // font-size: 26px;
    }
    .userInfo{
      // display: flex;
      // justify-content: center;
      // align-items: center;
      // height: 100%;
      // flex-grow: 1;
      // position: relative; // 添加相对定位
      .userInfo-avatar{
      //   display: flex;
      //   align-items: center;
      //   .mr-3{
      //   margin-right: 10px;
      // }
      }
      
      .userInfo-com{
        position: absolute;
        top: var(--header-height);
        right: 0;
        display: none; // 默认隐藏
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
       &:hover .userInfo-com {
        display: block; // 鼠标悬浮时显示
      }
    }
  }
    @media (max-width: 768px) {
      flex-direction: column;
      justify-content: center;
      .logo,
      .search,
      .info {
        width: 100%;
        text-align: center;
        margin: 10px 0;
      }
      .logo{
        flex-grow: 0.5;
      }
      .search {
        flex-grow: 0.1;
      }
      .info{
        flex-grow: 0.1;
      }
    }
}

</style>