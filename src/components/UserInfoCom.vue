<script setup lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import type { SocialData } from '@/@types/social'
const store = useStore()
const user = computed(() => store.getters['user/getUser'])
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);
const router = useRouter()
const activeName = ref('1')// 默认选中的项
// 获取最后三个帖子并倒序显示的通用函数
//参数类型ComputedRef<SocialData[]>，可以直接传入 computed 的结果
const getLastThreePosts = (posts: ComputedRef<SocialData[]>) => computed(() => {
  return posts.value.slice(0,3);// 获取前三个帖子
});
const handleImagePath = (path: string) => {
  // 检查路径是否已经是完整的 URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // 如果不是完整的 URL，则拼接完整的 URL
  return `${import.meta.env.VITE_BASE_URL}${path}`;
};
// 我的喜欢
const likedPosts = computed(() => store.state.post.likedPosts.map((post:SocialData) => ({
  ...post,
  image: handleImagePath(post.image)
}))as SocialData[]);
const lastThreeLikedPosts = getLastThreePosts(likedPosts);
// 发布
const userPosts = computed(() => store.state.post.userPosts as SocialData[]);
const lastThreeUserPosts = getLastThreePosts(userPosts);
// 观看历史
const viewHistory = computed(() => store.state.post.viewHistory.map((post: SocialData) => ({
  ...post,
  // image: `${import.meta.env.VITE_BASE_URL}${post.image}`
  image: handleImagePath(post.image)
})) as SocialData[]);
const lastThreeViewHistory = getLastThreePosts(viewHistory);
// 退出登录
const logoutBtn = () => {
  store.dispatch('user/logout', router );
};
// 获取用户发布的帖子
const getUserSocialData = async () => {
  await store.dispatch('post/fetchUserPosts')
}
// 获取用户点赞的帖子
const getUserLikeData = async () => {
  await store.dispatch('post/fetchLikedPosts')
}
// 获取用户观看历史
const getUserViewHistoryData = async () => {
  await store.dispatch('post/loadViewHistoryFromLocalStorage');
}
// 悬停时展开面板
const handleMouseEnter = async(name:string) => {
  activeName.value = name;
  // 每次悬停时重新加载数据
  try {
    if (name === '1') {
      await getUserLikeData();
    } else if (name === '2') {
      await getUserViewHistoryData();
    } else if (name === '3') {
      await getUserSocialData();
    }
  } catch (error) {
    console.error('加载数据失败:', error);
    ElMessage.error('加载数据失败，请稍后重试');
  }
};
onMounted(async() => {
  try {
    // 默认显示 activeName 为 1 的数据
    await handleMouseEnter('1');
  } catch (error) {
    console.error('加载用户数据失败:', error);
    ElMessage.error('加载数据失败，请稍后重试');
  }
});
</script>
<template>
    <div class="user-info-com body-big">
      <div v-if="isAuthenticated">
        <div class="user-info-com-header">
            <div class="user-info-com-header-avatar">
              <el-avatar :size="45" class="mr-3" :src="user.avatar" />
            </div>
            <div class="user-info-com-header-info">
              <div class="user-info-com-header-info-name ellipsis">{{ user.username }}</div>
              <!-- <div class="user-info-com-header-info-name">用户姓名</div> -->
            </div>
        </div>
        <div class="user-info-com-content">
          <div class="user-info-com-content-items top">
            <el-collapse v-model="activeName" accordion>
              <el-collapse-item name="1" @mouseenter="handleMouseEnter('1')">
                <template #title>
                  <svg t="1743019855407" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="23210" width="200" height="200"><path d="M882.3296 231.5776c-99.4304-99.4304-260.608-99.4304-360.0384 0l-6.8096 6.8096-6.8096-6.8096c-99.4304-99.4304-260.608-99.4304-360.0384 0-99.4304 99.4304-99.4304 260.608 0 360.0384l276.4288 276.4288c49.92 49.92 130.9184 49.92 180.8384 0L875.52 598.4256l6.8096-6.8096c99.4304-99.3792 99.4304-260.608 0-360.0384z" fill="#F0606D" p-id="23211"></path><path d="M518.7584 350.6688l-3.2768 3.2768-3.2768-3.2768C413.5424 251.9552 252.5696 246.9376 152.064 343.808a253.5936 253.5936 0 0 0-71.3216 125.5936 253.31712 253.31712 0 0 0 67.8912 122.2656l276.4288 276.4288c49.92 49.92 130.9184 49.92 180.8384 0L875.52 598.4256l6.8096-6.8096a253.31712 253.31712 0 0 0 67.8912-122.2656 253.5936 253.5936 0 0 0-71.3216-125.5936c-100.5056-96.8192-261.4272-91.8016-360.1408 6.912z" fill="#EB545E" p-id="23212"></path><path d="M518.8096 466.176l-3.2768 3.2768-3.2768-3.2768c-99.4304-99.4304-265.3184-102.6048-364.3392-2.7648a253.71136 253.71136 0 0 0-46.08 63.744 253.7984 253.7984 0 0 0 46.848 64.512l276.4288 276.4288c49.92 49.92 130.9184 49.92 180.8384 0L875.52 598.4256l6.8096-6.8096c19.456-19.456 35.0208-41.2672 46.848-64.512-11.6736-22.9376-27.0336-44.544-46.1312-63.7952-99.0208-99.7376-264.8576-96.5632-364.2368 2.8672z" fill="#E6494E" p-id="23213"></path><path d="M522.2912 578.2016l-6.8096 6.8096-6.8096-6.8096c-99.4304-99.4304-260.608-99.4304-360.0384 0-2.2016 2.2016-4.3008 4.4544-6.4 6.7072 2.0992 2.2528 4.1984 4.5056 6.4 6.7072l276.4288 276.4288c49.92 49.92 130.9184 49.92 180.8384 0L875.52 598.4256l6.8096-6.8096c2.2016-2.2016 4.3008-4.4544 6.4-6.7072-2.0992-2.2528-4.1984-4.5056-6.4-6.7072-99.4304-99.4304-260.608-99.4304-360.0384 0z" fill="#E44447" p-id="23214"></path><path d="M522.2912 693.7088l-6.8096 6.8096-6.8096-6.8096c-81.664-81.664-205.056-96.2048-301.6192-43.6736l218.0096 218.0096c49.92 49.92 130.9184 49.92 180.8384 0l218.0096-218.0096c-96.5632-52.5312-219.904-37.9904-301.6192 43.6736z" fill="#E93838" p-id="23215"></path><path d="M741.7856 580.1984c-8.0384 0-16.0768-2.6624-22.7328-8.1408a35.83488 35.83488 0 0 1-4.9152-50.432c0.3072-0.4096 32.6656-39.7312 54.1184-67.4816 30.6176-46.5408-15.872-99.9424-17.92-102.1952-13.1072-14.7456-11.8784-37.376 2.816-50.5344 14.6944-13.1584 37.1712-12.0832 50.432 2.56 30.3104 33.4336 74.1888 116.48 23.3984 191.232-0.4096 0.6144-0.8192 1.1776-1.28 1.792-22.1184 28.672-54.8864 68.4544-56.2688 70.144a35.66592 35.66592 0 0 1-27.648 13.056z m55.552-105.1648h0.0512-0.0512z" fill="#FFFFFF" p-id="23216"></path></svg>
                  <span>我的喜欢</span>
                </template>
        <ul v-if="lastThreeLikedPosts.length > 0">
          <li class="ellipsis" v-for="(item, index) in lastThreeLikedPosts" :key="index" @click="router.push(`/interact/${item.id}`)">
            <img :src="item.image" alt="封面图">
            <p>
              {{ item.title }}#{{ item.content }}
            </p>
          </li>
        </ul>
        <p v-if="lastThreeLikedPosts.length === 0">暂无点赞帖子</p>
              </el-collapse-item>
              <el-collapse-item name="2" @mouseenter="handleMouseEnter('2')">
        <template #title>
          <svg t="1743019332754" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="26273" width="200" height="200"><path d="M0 0.049489h1023.919793v1023.919793H0V0.049489z" fill="#202425" opacity=".01" p-id="26274"></path><path d="M921.527814 512.009386c0 226.183882-183.384035 409.567917-409.567918 409.567917S102.391979 738.193268 102.391979 512.009386 285.776014 102.441469 511.959896 102.441469s409.567917 183.384035 409.567918 409.567917z" fill="#FFAA44" p-id="26275"></path><path d="M707.869884 984.992069A511.959896 511.959896 0 0 1 102.391979 819.185324l97.886733-97.886732A375.437257 375.437257 0 1 0 136.522639 512.009386H0a511.959896 511.959896 0 1 1 707.869884 472.982683zM58.261036 726.793628c-21.502316 21.502316-58.261036 6.280041-58.261036-24.130377V512.009386h190.653865c30.376287 0 45.632692 36.758721 24.130377 58.261036l-156.523206 156.523206z" fill="#FF7744" p-id="26276"></path><path d="M511.959896 221.898778A51.19599 51.19599 0 0 1 563.155886 273.094768v217.719478l155.635809 155.635809a51.19599 51.19599 0 0 1-72.356999 72.42526l-170.653299-170.653299A51.19599 51.19599 0 0 1 460.763907 512.009386V273.094768A51.19599 51.19599 0 0 1 511.959896 221.898778z" fill="#FFFFFF" p-id="26277"></path></svg>
          <span>历史记录</span>
        </template>
        <ul v-if="lastThreeViewHistory.length > 0">
          <li class="ellipsis" v-for="(item, index) in lastThreeViewHistory" :key="index" @click="router.push(`/interact/${item.id}`)">
            <img :src="item.image" alt="封面图">
            <p>
              {{ item.title }}#{{ item.content }}
            </p>
          </li>
        </ul>
        <p v-if="lastThreeViewHistory.length === 0">暂无浏览记录</p>
              </el-collapse-item>
      <el-collapse-item name="3" @mouseenter="handleMouseEnter('3')">
        <template #title>
          <svg t="1743019607142" class="icon" viewBox="0 0 1045 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="15763" width="200" height="200"><path d="M690.252271 644.935591L437.542665 787.998467c-33.416146 18.796582-75.186329-5.221273-75.186329-43.858692V458.014023c0-38.637419 41.770183-62.655274 75.186329-43.858692l252.709606 143.062876c34.460401 19.840837 34.460401 67.876547 0 87.717384M865.687039 178.153798H752.907545l55.345493-97.115675c14.619564-26.106364 5.221273-58.478256-20.885092-73.09782-26.106364-14.619564-59.522511-5.221273-74.142074 20.885091L627.596997 178.153798H416.657574L331.028699 27.78114C316.409135 1.674775 282.992989-7.723516 256.886624 6.896048s-35.504655 48.03571-20.885091 73.09782l55.345492 97.115675H179.611786C80.407602 178.153798 0 257.517145 0 356.721329v488.711139C0 944.636653 80.407602 1024 179.611786 1024h686.075253c99.204184 0 179.611786-79.363347 179.611786-178.567532V356.721329C1044.254571 257.517145 963.846969 178.153798 865.687039 178.153798" fill="#1296db" p-id="15764"></path></svg>
          <span>我的发布</span>
        </template>
        <ul v-if="lastThreeUserPosts.length > 0">
          <li class="ellipsis" v-for="(item, index) in lastThreeUserPosts" :key="index" @click="router.push(`/interact/${item.id}`)">
            <img :src="item.image" alt="封面图">
            <p>
              {{ item.title }}#{{ item.content }}
            </p>
          </li>
        </ul>
        <p v-if="lastThreeUserPosts.length === 0">快去发布第一个作品吧~</p>
      </el-collapse-item>
    </el-collapse>
          </div>
        </div>
        <div class="user-info-com-footer">
          <span>
            <el-button class="primary-button w-full" @click="router.push('/setting')">设置</el-button>
          </span>
          <span>
            <el-button class="primary-button w-full" @click="router.push('/reset')">修改密码</el-button>
          </span>
          <span>
            <el-button class="primary-button w-full" @click="logoutBtn">退出登录</el-button>
          </span>
        </div>
        </div>
      <div v-else>
        <span class="register-btn">
          <el-button class="primary-button w-full" @click="router.push('/register')">注册</el-button>
        </span>
        <span>
          <el-button class="primary-button w-full" @click="router.push('/login')">登录</el-button>
        </span>
      </div>
    </div>
</template>
<style lang="scss" scoped>
.user-info-com {
  box-sizing: border-box;
  width: 100%;
  max-width: rem(350);
  background-color: var(--white);
  border-radius: rem(10);
  padding: rem(15);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .user-info-com-header {
    padding-bottom: rem(5);
    display: flex;
    align-items: center;
    .user-info-com-header-info{
      padding-left: rem(10);
      width: 85%;
    }
  }
  :deep(.el-collapse-item__header){
    @extend .body;
  }
  .user-info-com-content{
    :deep(.el-collapse-item__wrap){
      position: relative;
    }
    .user-info-com-content-items{
      ul{
        display: flex;
        gap:0 rem(10);
        justify-content: space-between;
        li{
          flex:1;
          height: rem(150);
          border: 1px solid var(--gray-rgb);
          box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);
          border-radius: rem(10);
          cursor: pointer;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            @include hover{
            &:hover{
              transition: all 0.3s ease;
              transform: scale(1.1, 1.1);
            }
          }
          }
          p{
            width: rem(100);
            @extend .ellipsis;
            position: absolute;
            bottom:0;
          }
        }
      }
    }
    .icon{
      width: rem(23);
      padding-right: rem(5);
    }
  }
  .user-info-com-footer{
    display: flex;
    flex-direction: column;
    span{
      padding-top: rem(20);
      .el-button{
        height: rem(40);
        border-radius: rem(10);
      }
    }
  }
  .register-btn{
    .el-button{
      margin-bottom: rem(20);
    }
  }
}
</style>