<script setup lang="ts">
// import  SearchCom from './SearchCom.vue'
import { useStore } from 'vuex';
import UserInfoCom from './UserInfoCom.vue'
import { Search } from '@element-plus/icons-vue'
const searchQuery = ref(""); // 搜索关键词
// const emit = defineEmits(["search"]);
// const handleSearch = () => {
//   if (searchQuery.value.trim()) {
//     emit("search", searchQuery.value); // 触发搜索事件
//     console.log('触发搜索事件');
//   }
// };
const store = useStore();

// 直接从 store 中获取 getters
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);
const user = computed(() => store.getters['user/getUser']);
// console.log('token', token)
// const searchQuery = ref(""); // 搜索关键词
const headerMenuVisible = ref(false);// 顶部菜单是否显示
// 搜索逻辑
const handleSearch = (query: string) => {
  // 模拟搜索逻辑：根据关键词跳转到知识详情页
  // 假设知识详情页的路由路径为 `/knowledge/:id`
  const knowledgeId = searchKnowledge(query); // 搜索知识并获取 ID
  if (knowledgeId) {
    // router.push(`/knowledge/${knowledgeId}`); // 跳转到知识详情页
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
// 切换头部菜单
const toggleHeaderMenu=() => {
  headerMenuVisible.value = !headerMenuVisible.value;
};
</script>
<template>
  <div class="element-header h-full flex-center title">
    <div class="logo">
      <!-- <img src="../assets/images/LOGO.png" /> -->
       智护长者
    </div>
    <el-input class="search h-full" @keyup.enter="handleSearch" v-model="searchQuery" placeholder="请输入搜索内容" :prefix-icon="Search" />
    <!-- <SearchCom class="search" @search="handleSearch"/> -->
    <div v-if="isAuthenticated" class="info flex-end">
      <el-icon class="info-items">
        <i-ep-Tools/>
      </el-icon>
      <el-icon class="info-items">
        <i-ep-BellFilled />
      </el-icon>
      <div class="info-items avatar">
          <el-avatar class="w-full h-full" :src="user.avatar" />
          <UserInfoCom class="userInfo-com"/>
      </div>
    </div>
    <div v-else class="info flex-end">
      <router-link class="link" to="/register">注册</router-link>
      &nbsp;|&nbsp;<router-link class="link" to="/login">登录</router-link>
    </div>
    <i-ep-Menu @click="toggleHeaderMenu" class="header-menu"/>
  </div>
</template>
<style scoped lang="scss">
.element-header{
  margin: 0 rem(40);
    .logo{
        flex: 1.15;
        @extend .title-big;
        // img{
        //   width: 40%;
        //   object-fit: contain;
        // }
    }
    .search{
      flex: 2.28;
      height: rem(46);
      // 搜索边框
      :deep(.el-input__wrapper) {
          border-radius: 50px;
          box-shadow: 0 0 0 1px var(--blue) inset;
      }
      // 搜索边框高亮
      :deep(.el-input__wrapper.is-focus) {
          box-shadow: 0 0 0 1px var(--dark-blue) inset;
      }
      // 输入框文字
      :deep(.el-input__inner){
        color: var(--dark-blue);
      }
      // 输入框提示文字
      :deep(.el-input__inner)::placeholder {
          color: var(--dark-blue-rgb);
      }
      // 搜索图标
      :deep(.el-input__prefix){
          color:var(--blue);
          font-size:rem(23);
      }
      // 搜索图标高亮
      :deep(.el-input__wrapper.is-focus)>.el-input__prefix {
          color:var(--dark-blue);
      }
    }
    .info{
    flex: 1.12;
    font-size: rem(30);
    .info-items{
      width: rem(52);
      height: rem(52);
    }
    .avatar{
      position: relative;
      .userInfo-com{
      position: absolute;
      top: var(--header-height);
      right: 0;
      display: none; // 默认隐藏
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      @include hover {
        &:hover .userInfo-com {
          display: block;
        }
      }
    }
    .el-icon{
      background-color: var(--orange);
      color: var(--white);
      border-radius: 50%;
    }
  }
  .header-menu{
    display: none;
  }
    // @media (max-width: 768px) {
    //   flex-direction: column;
    //   justify-content: center;
    //   .logo,
    //   .search,
    //   .info {
    //     width: 100%;
    //     text-align: center;
    //     margin: 10px 0;
    //   }
    //   .logo{
    //     flex-grow: 0.5;
    //   }
    //   .search {
    //     flex-grow: 0.1;
    //   }
    //   .info{
    //     flex-grow: 0.1;
    //   }
    // }
    @include mobile{
      margin: 0 2.1vw;
      .logo,.info{
        display: none;
      }
      .search{
        height: rem(35);
      }
      .header-menu{
      display: block;
      font-size: rem(28);
      margin-left: rem(10);
      color: var(--blue);
      &:active {
        color: var(--blue-rgb);
      }
    }
    .avatar{
      .userInfo-com{
        display: none;
      }
    }
  }
}

</style>