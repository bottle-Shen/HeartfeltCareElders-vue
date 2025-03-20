<script setup lang="ts">
import { useStore } from 'vuex';
import { useRouter } from 'vue-router'
const store = useStore();
const user = computed(() => store.getters['user/getUser']);
const router = useRouter();
const logoutBtn = () => {
  store.dispatch('user/logout', router );
};
</script>
<template>
    <div class="user-info-com">
        <div class="user-info-com-header">
            <div class="user-info-com-header-avatar">
              <el-avatar :size="45" class="mr-3" :src="user.avatar" />
            </div>
            <div class="user-info-com-header-info">
              <div class="user-info-com-header-info-name">{{ user.username }}</div>
              <!-- <div class="user-info-com-header-info-name">用户姓名</div> -->
            </div>
        </div>
        <div class="user-info-com-content">
          <div class="user-info-com-content-items top">
            <ul>
              <li>我的喜欢</li>
              <li>我的收藏</li>
              <li>观看历史</li>
              <li>稍后再看</li>
              <li>我的作品</li>
            </ul>
          </div>
          <div class="user-info-com-content-items itemsBom">
            <ul>
              <li>我的课程</li>
              <li>我的活动</li>
            </ul>
          </div>
        </div>
        <div class="user-info-com-footer">
          <!-- <div class="user-info-com-footer-items">修改密码</div> -->
          <div class="user-info-com-footer-items"><button @click="logoutBtn">退出登录</button></div>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.user-info-com {
  width: 350px;
  height: 500px;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px;
  box-sizing: border-box;
//   text-align: center;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
  .user-info-com-header {
    background-color: pink;
    display: flex;
  }
  .user-info-com-content{
    // height: calc(100% - 100px);
    .user-info-com-content-items{
      ul li{
      height: 50px;
      border: 1px solid red;
      background-color: aqua;
      border-radius: 10px;
    }
    }
    .itemsBom{
      margin-top: 20px;
    }
  }
  .user-info-com-footer{
    
  }
}
</style>