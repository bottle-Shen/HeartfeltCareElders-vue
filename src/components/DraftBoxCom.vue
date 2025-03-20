<script lang="ts" setup>
import { ElMessage } from 'element-plus';

const drafts = ref(JSON.parse(localStorage.getItem('drafts') || '[]'));

const deleteDraft = (index: number) => {
  const draftsList = JSON.parse(localStorage.getItem('drafts') || '[]');
  draftsList.splice(index, 1); // 删除指定索引的草稿
  localStorage.setItem('drafts', JSON.stringify(draftsList));
  drafts.value = draftsList; // 更新草稿列表
  ElMessage.success('草稿已删除');
};

const deleteAllDrafts = () => {
  localStorage.removeItem('drafts'); // 删除所有草稿
  drafts.value = []; // 清空草稿列表
  ElMessage.success('所有草稿已删除');
};
</script>
<template>
  <div>
    <h2>草稿箱</h2>
    <el-button type="danger" @click="deleteAllDrafts">删除全部</el-button>
    <ul>
      <li v-for="(draft, index) in drafts" :key="index">
        <h3>{{ draft.title }}</h3>
        <p>{{ draft.content }}</p>
        <img :src="draft.coverImage" alt="封面图" style="max-width: 100px; height: auto;">
        <el-button type="danger" @click="deleteDraft(index)">删除</el-button>
      </li>
    </ul>
  </div>
</template>