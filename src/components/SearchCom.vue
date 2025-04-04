<script setup lang="ts">
import { Search } from '@element-plus/icons-vue'
defineProps({
  placeholder: {
    type: String,
    default: "请输入搜索内容",
  },
});
const searchQuery = ref(""); // 搜索关键词
const emit = defineEmits(["search","clear"]);
const handleSearch = () => {
  emit("search", searchQuery.value.trim()); // 触发搜索事件
  // console.log('触发搜索事件');
};
// 监听搜索框内容变化
watch(searchQuery, (newVal) => {
  // console.log('监听', searchQuery)
  if (!newVal.trim()) {
    emit("clear"); // 触发 clear 事件
  }
});
import { debounce } from '@/utils/index';
// 使用自定义 debounce 函数-enter 键提交评论
const debouncedhandleSearch = debounce(handleSearch, 500);
// const input = ref('')
</script>
<template>
    <!-- <div> -->
      <el-input class="h-full" @keyup.enter="debouncedhandleSearch" v-model="searchQuery" :placeholder="placeholder" :prefix-icon="Search" />
    <!-- </div> -->
</template>
<style lang="scss" scoped>
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
</style>