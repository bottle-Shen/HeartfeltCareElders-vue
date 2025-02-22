<script setup lang="ts">
import {
  Setting,
} from '@element-plus/icons-vue'
</script>
<template>
  <div>
     <!-- 设置组件 -->
  <el-menu
    default-active="2"
    class="el-menu-vertical-demo"
    :collapse="true"
  >
    <el-sub-menu index="4">
      <template #title>
        <div class="set-title">
          <el-icon class="set-icon"><setting /></el-icon>
          <el-icon class="set-span">设置</el-icon>
        </div>
      </template>
        <el-menu-item index="1-1"><el-icon><setting /></el-icon><span>深浅模式</span></el-menu-item>
        <el-menu-item index="1-2"><el-icon><setting /></el-icon><span>常见问题</span></el-menu-item>
        <el-menu-item index="1-3"><el-icon><setting /></el-icon><span>意见反馈</span></el-menu-item>
      <el-sub-menu index="1-4">
        <template #title><el-icon><setting /></el-icon><span>通用设置</span></template>
        <el-menu-item index="1-4-1"><el-icon><setting /></el-icon><span>隐私设置</span></el-menu-item>
        <el-menu-item index="1-4-2"><el-icon><setting /></el-icon><span>通知设置</span></el-menu-item>
      </el-sub-menu>
    </el-sub-menu>
    
  </el-menu>
  </div>
</template>
<style scoped lang="scss">
.el-menu{
  background: linear-gradient(to right, var(--white-green) 20%, #F0F2FF 80%);
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