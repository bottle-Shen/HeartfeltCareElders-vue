<script setup lang="ts">
import SetCom from './SetCom.vue'
import {
  Menu as IconMenu,
  Location,
} from '@element-plus/icons-vue'

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
    class="el-menu-vertical-demo"
    :collapse="true"
    @select="handleSelect"
  >
    <el-menu-item index="1" class="set-title">
      <el-icon class="set-icon"><location /></el-icon>
      <el-icon class="set-span">首页</el-icon>
    </el-menu-item>
    <el-menu-item index="2" class="set-title">
      <el-icon class="set-icon"><icon-menu /></el-icon>
      <el-icon class="set-span">工作台</el-icon>
    </el-menu-item>
    <el-menu-item index="3" class="set-title">
      <el-icon class="set-icon"><i-ep-Reading /></el-icon>
      <el-icon class="set-span">健康知识库</el-icon>
    </el-menu-item>
    <el-menu-item index="4" class="set-title">
      <el-icon class="set-icon"><i-ep-ChatRound /></el-icon>
      <el-icon class="set-span">社交互动区</el-icon>
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
      <el-icon class="set-span">个人资料</el-icon>
    </el-menu-item>
  </el-menu>
  <div class="sidebar-bottom">
    <SetCom/>
    <SetCom/>
  </div>
</template>

<style scoped lang="scss">
.el-menu{
  background: linear-gradient(to right, var(--white-green) 20%, #F0F2FF 80%);
}
.el-menu-item{
    color:var(--green-blue);
  }
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}
.sidebar-bottom{
  position: fixed;
  bottom: 0;
}
.set-title{
  width: 100%;
  display: flex;
  // justify-content: center;
  align-items: center;
  .set-span{
  padding-left: 15px;
  font-size: 14px;
  font-style: normal;
  display: flex;
  justify-content: flex-start
}
}
.el-menu--collapse{
  width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding)* 6);
}
@media (max-width: 768px) {
  .el-menu--collapse{
  width: calc(var(--el-menu-icon-width) + var(--el-menu-base-level-padding)*2);
  .set-title{
  flex-direction: column;
  justify-content: center;
  .set-span{
    padding-left: 0;
    margin-top: 5px;
    font-size: 12px;
    display: flex;
    justify-content: center
  }
}
}
}
</style>