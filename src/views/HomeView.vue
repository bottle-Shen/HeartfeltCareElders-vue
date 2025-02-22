<script setup lang="ts">
const open = () => {
  ElMessageBox.confirm(
    'proxy will permanently delete the file. Continue?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(() => {
      ElMessage({
        type: 'success',
        message: 'Delete completed',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
}
</script>

<template>
  <div>
    <CarouselCom class="carousel-com"></CarouselCom>
    <el-button plain @click="open">Click to open the Message Box</el-button>
  </div>
</template>

<style lang="scss" scoped>
.carousel-com {
  border: 1px solid red;
}

</style>
