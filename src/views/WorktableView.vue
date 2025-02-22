<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
import {image} from '@/api/images'
// 定义一个响应式变量来存储图片数据
const images = ref<string[]>([]);
const value = ref(new Date())
const locale = ref(zhCn)
// 定义一个响应式变量来存储问候语
const greeting = ref('早上好');
// 获取当前时间并判断时间段
function getGreeting() {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 6 && hour < 12) {
    return '早上好';
  } else if (hour >= 12 && hour < 18) {
    return '中午好';
  } else {
    return '晚上好';
  }
}
// 定义异步函数来获取图片数据
const fn = async () => {
  const { data } = await image();
  // console.log(data)
  // console.log(data[0].image)
  // const res = await image();
  // console.log(res)
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i].image);
    images.value.push(data[i].image);
  }
  // 打印 images 以调试
  console.log(images.value);
}

// 在组件挂载时调用 fn 函数
onMounted(() => {
  fn();
  // greeting.value = getGreeting();
})
// 在组件挂载时调用 getGreeting 方法
onMounted(() => {
  greeting.value = getGreeting();
});
</script>
<template>
    <div class="worktable-page">
      <div class="header worktable-item">
        <div class="worktable-left">
          <div class="carousel">
            <div class="title">企业宣传栏</div>
            <el-carousel class="carousel-item" trigger="click">
              <el-carousel-item v-for="(image, item) in images" :key="item">
                <el-image style="width: 100%; height: 100%;" :src="image" fit="fill" lazy />
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <div class="worktable-right">
          <div class="work-card">
            <div class="title">审批</div>
            <div>
              <div class="card-header">
                <ul>
                  <li class="card-header-item">待办</li>
                  <li class="card-header-item">抄送我</li>
                  <li class="card-header-item">已发起</li>
                  <li class="card-header-item">发起申请</li>
                </ul>
              </div>
              <div class="card-body">
                <p v-for="o in 4" :key="o" class="text item">
                  <span class="text-title">{{ 'xxx发起项目结算申请' + o }}</span>
                  <span class="text-user">{{ '发起人' }}</span>
                  <span class="text-time">{{ '时间' }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="worktable-item">
        <div class="worktable-left">
          <div class="title">{{ greeting }}，用户名！</div>
        </div>
        <div class="worktable-right">
          <div class="title">222</div>
          <el-config-provider :locale="locale">
            <el-calendar v-model="value" />
          </el-config-provider>
      </div>
    </div>
</div>
</template>
<style scoped lang="scss">
// @use '@/styles/main.scss';
.worktable-page{
.worktable-item {
  display: flex;
  justify-content: space-between;
  padding: 20px 40px;
  font-size: var(--font-size);
  // border: 1px solid red;

  .worktable-left {
    flex: 1;
    margin-right: 20px;

    .carousel {
      height: 333px;
      // border: 1px solid red;

      .carousel-item {
        border-radius: 10px;
      }
    }
  }

  .worktable-right {
    flex: 1;
    // border: 1px solid red;

    .work-card {
      width: 100%;

      .el-card {
        height: 302px;
      }
    }

    .card-header {
      display: flex;

      .card-header-item {
        float: left;
        flex-grow: 1;
        font-weight: var(--font-weight);
      }
    }

    .text {
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      height: 45px;
      color: var(--fontColor);
      font-size: calc(var(--font-size) * 0.9);

      .text-title {
        color: #000;
        font-weight: var(--font-weight);
      }

      .text-user {
        position: absolute;
        bottom: 0;
      }
    }
  }

  .title {
    font-weight: var(--font-weight);
    margin-bottom: 10px;
  }

  .el-calendar {
    width: 100%;
  }

}
@media (max-width: 768px) {
    .worktable-item{
      flex-direction: column;
      // padding: 20px 0px;
    }
    .worktable-left,
    .worktable-right {
      width: 100%;
      margin-right: 0;
    }
  }
}
</style>