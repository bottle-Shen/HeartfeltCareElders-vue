<script setup lang="ts">
// import  SearchCom from './SearchCom.vue'
import { useStore } from 'vuex';
import UserInfoCom from './UserInfoCom.vue'
import { Search } from '@element-plus/icons-vue'
import { searchPost } from '@/api/social'
const store = useStore();

// 直接从 store 中获取 getters
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);
const user = computed(() => store.getters['user/getUser']);
// console.log('token', token)
const searchQuery = ref(""); // 搜索关键词
const headerMenuVisible = ref(false);// 顶部菜单是否显示
// 搜索逻辑
const handleSearch = async (query:string) => {
  if (query.trim()) {
    try {
      // 跳转到搜索结果页面，并传递搜索结果
      router.push({ name: 'searchPost', query: { q: query } });
    } catch (error) {
      console.error('搜索失败：', error);
    }
  } else {
    console.log('搜索关键词为空');
    // 清空搜索结果等操作
  }
};
// 监听子组件的 clear 事件
const handleClear = () => {
  // console.log('clear');
  searchQuery.value = '';
};
// 切换头部菜单
const toggleHeaderMenu=() => {
  headerMenuVisible.value = !headerMenuVisible.value;
};
const showUserInfo = ref(false);// 用户信息是否显示
const router = useRouter();
const goToUserInfo = () => {
  // 跳转到用户信息页面
  router.push({ path: '/userInfo', query: { tab: 'first' } });
};
</script>
<template>
  <div class="element-header h-full flex-center">
    <div class="logo">
      <!-- <img src="../assets/images/LOGO.png" /> -->
       智护长者
    </div>
    <!-- <el-input class="search h-full" @keyup.enter="handleSearch" v-model="searchQuery" placeholder="请输入搜索内容" :prefix-icon="Search" /> -->
    <SearchCom class="search" @search="handleSearch" :placeholder="'请输入想搜索的帖子内容'" @clear="handleClear"/>
    <div v-if="isAuthenticated" class="info flex-end">
      <div class="info-items">
      <div class="icon-container">
      <el-icon class="icon" @click="$router.push('/setting')">
        <i-ep-Tools/>
      </el-icon>
      <span>设置</span></div>
    </div>
      <!-- <el-icon class="info-items icon">
        <i-ep-BellFilled />
      </el-icon> -->
      <div class="info-items avatar" @mouseenter="showUserInfo = true" @mouseleave="showUserInfo = false">
          <el-avatar class="w-full h-full" :src="user.avatar" @click="goToUserInfo"/>
           <transition name="slide-y">
            <div class="userInfo-com" v-show="showUserInfo">
              <UserInfoCom />
            </div>
            </transition>
      </div>
    </div>
    <div v-else class="info flex-end">
      <router-link class="title" to="/register">注册</router-link>
      &nbsp;<b class="title">|</b>&nbsp;<router-link class="title" to="/login">登录</router-link>
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
    gap: 0 rem(8);
    .info-items{
      cursor: pointer;
      width: rem(52);
      height: rem(52);
      .icon-container{
        height: 100%;
        @extend .flex-center;
        flex-direction: column;
      }
      span{
        font-size: rem(12);
      }
      @include hover{
        &:hover .icon{
          color: var(--orange);
          transition: all 0.2s ease;
          background-color: var(--orange-light);
        }
        &:hover span{
          color: var(--orange);
          transition: all 0.2s ease;
        }
      }
    }
    .icon{
      width: rem(34.4);
      height: rem(34.4);
      font-size: rem(26);
    }
    .avatar{
      position: relative;
      .userInfo-com{
      position: absolute;
      top: var(--header-height);
      right: 0;
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