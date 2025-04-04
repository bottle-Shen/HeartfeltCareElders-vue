<script setup lang="ts">
const router = useRouter();
const handleSelect = (index: string) => {
  switch (index) {
    case '1':
      router.push('/index');
      break;
    case '2':
      router.push('/activity');
      break;
    case '3':
      router.push('/knowledge');
      break;
    case '4':
      router.push('/interact');
      break;
    case '5':
      router.push('/document');
      break;
    case '6':
      router.push({ path: '/userInfo', query: { tab: 'first' } });
      break;
    default:
      break;
  }
};

</script>

<template>
  <el-menu
    default-active="1"
    :collapse="true"
    @select="handleSelect"
  >
    <el-menu-item index="1">
      <el-icon><i-ep-TrendCharts /></el-icon>
      <el-icon>数据走势图</el-icon>
    </el-menu-item>
    <el-menu-item index="2">
      <el-icon><i-ep-Guide /></el-icon>
      <el-icon>活动日程</el-icon>
    </el-menu-item>
    <el-menu-item index="3">
      <el-icon><i-ep-Reading /></el-icon>
      <el-icon>知识小仓库</el-icon>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><i-ep-ChatRound /></el-icon>
      <el-icon>互动贴吧</el-icon>
    </el-menu-item>
    <!-- <el-menu-item index="5">
      <el-icon><i-ep-FirstAidKit /></el-icon>
      <el-icon>咨询服务</el-icon>
    </el-menu-item> -->
    <el-menu-item index="5">
      <el-icon><i-ep-MessageBox /></el-icon>
      <el-icon>健康档案</el-icon>
    </el-menu-item>
    <el-menu-item index="6">
      <el-icon><i-ep-User /></el-icon>
      <el-icon>个人主页</el-icon>
    </el-menu-item>
  </el-menu>
</template>

<style scoped lang="scss">
.el-menu{
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, var(--bg-one) 27%, var(--bg-two) 27%);
}
.el-menu-item:hover{// element-ui默认hover样式修改
    background-color: var(--white-blue-rgb);
  }
.el-menu-item{
  height: rem(75.6);
  padding: 0 2.1vw;
  // padding: 0 clamp(var(--min-side-width),15%,var(--side-width));
  color:var(--blue);
  .el-icon:nth-child(1){
    width: rem(45);
    height: rem(45);
    @extend .body;
    color: var(--white);
    background-color: var(--orange);
    @include rounded-border;
  }
  .el-icon:nth-child(2){
    width: auto; /* 移除固定宽度 */
    display: inline-block;
    font-style: normal;
    padding-left: rem(20);
    @extend .body-big;
    // font-size: rem(22);
  }
  &:active {
      background-color: var(--white-blue-rgb);
  }
}
.el-menu--collapse {
  border: 0;//清除element默认边框
}
.el-menu-item:nth-child(2)>.el-icon:first-child{
  background-color: var(--dark-purple);
}
.el-menu-item:nth-child(3)>.el-icon:first-child{
  color: var(--blue);
  background-color: var(--white-blue);
}
.el-menu-item:last-child>.el-icon:first-child{
  color: var(--orange);
  background-color: var(--orange-light);
}
@include mobile {
.el-menu-item{
  flex-direction: column;
  justify-content: center;
  .el-icon:nth-child(2){
    margin-top: rem(5);
    font-size: rem(12);
    padding-left: 0;
  }
};
}
</style>