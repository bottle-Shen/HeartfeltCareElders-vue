<script setup lang="ts">
// import SetCom from './BottomCom.vue'

const router = useRouter();

const handleSelect = (index: string) => {
  switch (index) {
    case '1':
      router.push('/index');
      break;
    case '2':
      router.push('/worktable');
      break;
    case '3':
      router.push('/knowledge');
      break;
    case '4':
      router.push('/interact');
      break;
    case '5':
      router.push('/consult');
      break;
    case '6':
      router.push('/document');
      break;
    case '7':
      router.push('/userInfo');
      break;
    default:
      break;
  }
};

</script>

<template>
  <el-menu
    default-active="2"
    :collapse="true"
    @select="handleSelect"
  >
    <el-menu-item index="1" class="set-title">
      <el-icon class="set-icon"><i-ep-TrendCharts /></el-icon>
      <el-icon class="set-span">数据走势图</el-icon>
    </el-menu-item>
    <el-menu-item index="2" class="set-title">
      <el-icon class="set-icon"><i-ep-Guide /></el-icon>
      <el-icon class="set-span">活动日程</el-icon>
    </el-menu-item>
    <el-menu-item index="3" class="set-title">
      <el-icon class="set-icon"><i-ep-Reading /></el-icon>
      <el-icon class="set-span">知识小仓库</el-icon>
    </el-menu-item>
    <el-menu-item index="4" class="set-title">
      <el-icon class="set-icon"><i-ep-ChatRound /></el-icon>
      <el-icon class="set-span">互动贴吧</el-icon>
    </el-menu-item>
    <el-menu-item index="5" class="set-title">
      <el-icon class="set-icon"><i-ep-FirstAidKit /></el-icon>
      <el-icon class="set-span">咨询服务</el-icon>
    </el-menu-item>
    <el-menu-item index="6" class="set-title">
      <el-icon class="set-icon"><i-ep-MessageBox /></el-icon>
      <el-icon class="set-span">健康档案</el-icon>
    </el-menu-item>
    <el-menu-item index="7" class="set-title">
      <el-icon class="set-icon"><i-ep-User /></el-icon>
      <el-icon class="set-span">个人主页</el-icon>
    </el-menu-item>
  </el-menu>
  <!-- <div class="sidebar-bottom">
    <SetCom/>
    <SetCom/>
  </div> -->
</template>

<style scoped lang="scss">
.el-menu{
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, var(--bg-one) 27%, var(--bg-two) 27%);
}
.el-menu-item{
  height: rem(75.6);
  padding: 0 clamp(var(--min-side-width),15%,var(--side-width));
  color:var(--blue);
}
.el-menu--collapse {
  // width: 99%;
  border: 0;
}
// .el-menu-vertical-demo:not(.el-menu--collapse) {
//   width: 200px;
//   min-height: 400px;
// }
// .sidebar-bottom{
//   position: fixed;
//   bottom: 0;
// }
.set-title{
  .set-icon{
    width: rem(45);
    height: rem(45);
    @extend .title;
    color: #fff;
    background-color: var(--orange);
    border-radius: 10px;
  }
  .set-span{
  margin-left: 0.5vw;
  @extend .title;
  font-style: normal;
  display: flex;
  justify-content: flex-start;
  }
}
.set-title:nth-of-type(2)>.set-icon{
    background-color: var(--dark-purple);
  }
  .set-title:nth-of-type(3)>.set-icon{
    color: var(--blue);
    background-color: var(--white-blue);
  }
  .set-title:last-child>.set-icon{
    color: var(--orange);
    background-color: var(--orange-light);
  }
@include mobile {
  .set-title{
  flex-direction: column;
  justify-content: center;
  .set-span{
    margin-top: 5px;
    font-size: 12px;
    justify-content: center;
  }
}
}
</style>