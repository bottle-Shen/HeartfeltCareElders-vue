<script setup lang="ts">
// import  SearchCom from './SearchCom.vue'
import { useStore } from 'vuex';
import UserInfoCom from './UserInfoCom.vue'

const store = useStore();

// 直接从 store 中获取 getters
const token = computed(() => store.getters['user/getToken']);
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
    <div class="logo title-big">
      <!-- <img src="../assets/images/LOGO.png" /> -->
       智护长者
    </div>
    <div class="search">
      <SearchCom @search="handleSearch"></SearchCom>
    </div>
    <div v-if="token" class="info flex-end">
      <el-icon class="info-items">
        <i-ep-Tools/>
      </el-icon>
      <el-icon class="info-items">
        <i-ep-BellFilled />
      </el-icon>
      <div class="relative info-items">
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
  margin: 0 var(--side-width);
    .logo{
        flex: 1.15;
        img{
          width: 40%;
          object-fit: contain;
        }
    }
    .search{
      flex: 2.28;
      height: rem(46);
    }
    .info{
    flex: 1.12;
    font-size: rem(30);
    .info-items{
      width: rem(52);
      height: rem(52);
    }
    .el-icon{
      // width: rem(52);
      // height: rem(52);
      // padding: 8px 8px 8px 0;
      background-color: var(--orange);
      color: var(--white);
      border-radius: 50%;
    }
      
      .userInfo-com{
        position: absolute;
        top: var(--header-height);
        right: 0;
        display: none; // 默认隐藏
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
       :hover .userInfo-com {
        display: block; // 鼠标悬浮时显示
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
      .logo,.info{
        display: none;
      }
      .header-menu{
      display: block;
      font-size: rem(28);
      margin-left: 10px;
      color: var(--blue);
      &:active {
        color: var(--blue-rgb);
      }
    }
        // flex-direction: column;
        // justify-content: center;
        .info{
          :hover .userInfo-com{
            display: none;
          }
        }
    }
}

</style>