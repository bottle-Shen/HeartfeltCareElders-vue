<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
const searchQuery = ref(""); // 搜索关键词
const emit = defineEmits(["search"]);
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit("search", searchQuery.value); // 触发搜索事件
  }
};
// const input = ref('')
</script>
<template>
    <div>
      <el-input @keyup.enter="handleSearch" v-model="searchQuery" placeholder="请输入搜索内容" :prefix-icon="Search" />
    </div>
</template>
<style lang="scss" scoped>
:deep(.el-input__wrapper) {
    border-radius: 50px;
    box-shadow: 0 0 0 1px var(--blue,var(--blue)) inset;
}
:deep(.el-input__wrapper.is-focus) {
    box-shadow: 0 0 0 1px var(--dark-blue) inset;
}
:deep(.el-input__wrapper.is-focus)>.el-input__prefix {
    color:var(--dark-blue)
}
:deep(.el-input__prefix){
    color:var(--blue,var(--blue))
}

</style>