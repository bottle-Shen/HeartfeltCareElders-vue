<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import { getActivityData,getUserActivityData,registerActivity,cancelRegisterActivity,searchUserActivity } from "@/api/activities";
import { useStore } from 'vuex'
import type { ActivityData, ActivitiesByDate,userActivityData } from "@/@types/activities"
const locale = ref(zhCn)
const store = useStore()
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);// 获取用户是否登录
// const getUserType = computed(() => store.getters['user/getUserType']);// 获取用户类型
// 定义活动数据的响应式变量
const activityData = ref<ActivityData[]>([])
// 按日期分类的活动数据
const activitiesByDate = ref<ActivitiesByDate>({});
const calendar = ref<CalendarInstance>()
// 定义用户参加活动的响应式变量
const userActivitiesData = ref<userActivityData[]>([])

const options = { hour12: true };//使用12小时制格式,显示上午下午
const userId = store.state.user.user.id
// console.log('userId', userId)
// 获取活动数据
const fetchActivityData = async () => {
  const response = await getActivityData()
  // console.log(response)
  activityData.value = response
  console.log(activityData.value)
  // activityData.value.sort((a, b) => {
  //   const aDate = new Date(a.start_time).getTime()// 将日期字符串转换为时间戳
  //   const bDate = new Date(b.start_time).getTime()
  //   return bDate - aDate;//降序
  // })
  // 处理活动数据
  activityData.value = response.map((activity: ActivityData) => {
    return {
      ...activity,
      start_time: new Date(activity.start_time).toLocaleString(undefined, options),
      end_time: new Date(activity.end_time).toLocaleString(undefined,options),
    }
  })
   // 按日期分类活动数据
    activitiesByDate.value = response.reduce((acc: ActivitiesByDate, activity: ActivityData)=> {
      const date = new Date(activity.start_time).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(activity);
      return acc;
    }, {});
  console.log(activitiesByDate.value);
}
//  获取用户活动数据
const fetchUserActivityData = async () => {
  const response = await getUserActivityData();
  console.log('用户参加的活动数据', response);
  // 处理用户活动数据
  userActivitiesData.value = response.map((activity: userActivityData) => {
    return {
      ...activity,
      registered_at: new Date(activity.registered_at).toLocaleString(undefined,options),
      event: {
        ...activity.event,
        start_time: new Date(activity.event.start_time).toLocaleString(undefined,options),
        end_time: new Date(activity.event.end_time).toLocaleString(undefined,options),
      },
    }
  })
  // console.log('userActivitiesData', userActivitiesData.value);
  store.commit('activities/setUserActivity', userActivitiesData.value)
}
// 日期选择事件
const selectDate = (val: CalendarDateType) => {
  if (!calendar.value) return
  calendar.value.selectDate(val)
}
// 显示更多活动
const showMoreActivities = (date: string) => {
  console.log(`查看日期 ${date} 的更多活动`);
  // 在这里实现查看更多活动的逻辑，例如弹出一个模态框
};
const hasRegistered = (row: number) => {
  return userActivitiesData.value.some(activity => activity.event.id === row && activity.user === userId);
  
}
const activityBtn = async (row:number) => {
  // 获取当前行的 event_id
  //     const eventId = row;
  // console.log('Clicked event ID:', eventId);
    const params = { event_id: row,user_id:userId }
    // 在这里处理报名逻辑
  await registerActivity(params)
  // store.dispatch('activities/addUserActivity', params)
}
const cancelActivity = async (row:number) => {
  const params = { event_id: row,user_id:userId }
  await cancelRegisterActivity(params)
}
// 搜索用户活动
const handleSearch = async (query: string) => {
  if (!query.trim()) {
    console.log('搜索内容不能为空');
    return;
  }

  try {
    await searchUserActivity(query);
    // 处理搜索结果，例如更新列表数据
  } catch (error) {
    console.error('搜索失败:', error);
  }
};
// 在组件挂载时获取数据
onMounted(() => {
  fetchActivityData()
  fetchUserActivityData()
})

</script>
<template>
    <div class="activity-page ">

   <div class="activity-item activity-calendar one">
      <div class="calendar-item">
        <el-config-provider :locale="locale">
        <el-calendar ref="calendar">
          <template #header="{ date }">
      <span class="activity-title">活动日历</span>
      <el-button-group>
        <el-button size="small" @click="selectDate('prev-month')">
          <el-icon><i-ep-CaretLeft /></el-icon>
        </el-button>
        <el-button size="small" @click="selectDate('today')"><span>{{ date }}</span></el-button>
        <el-button size="small" @click="selectDate('next-month')">
          <el-icon><i-ep-CaretRight /></el-icon>
        </el-button>
      </el-button-group>
      </template>
      <template #date-cell="{ data }">
        <p :class="data.isSelected ? 'is-selected' : ''">
        {{ data.day.split('-').slice(2).join('-') }}
          <span v-if="activitiesByDate[data.day]">
            <!-- {{ activitiesByDate[data.day][0].title }} -->
              <p v-for="(activity, index) in activitiesByDate[data.day]" 
              :key="activity.id" v-show="index<1" class="activity-title">
            {{ activity.title }}
              </p>
              <p v-if="activitiesByDate[data.day].length > 1" 
                class="view-more" @click="showMoreActivities(data.day)">
            查看更多
          </p>
          </span>
      </p>
    </template>
        </el-calendar>
      </el-config-provider>
      </div>
      <div class="item-two">
        <!-- <el-config-provider :locale="locale">
            <el-calendar v-model="value" />
          </el-config-provider> -->
      </div>
    </div>
    <div class="activity-item ep-bg-purple two">
      <span class="activity-title">报名活动</span>
      <el-table
    :data="activityData"
    style="width: 100%"
  >
    <el-table-column prop="title" label="活动名称" width="80" />
    <el-table-column prop="description" label="介绍" width="150" show-overflow-tooltip/>
    <el-table-column prop="location" label="地点" />
    <el-table-column prop="start_time" label="开始时间" />
    <el-table-column prop="end_time" label="结束时间" />
    <el-table-column label="立即参与" fixed="right">
       <!-- 为按钮绑定点击事件，并传递当前行的数据 -->
        <!-- 根据用户是否登录显示不同的按钮 -->
      <template #default="scope">
          <div v-if = "isAuthenticated">
            <el-button v-if="!hasRegistered(scope.row.id)" v-debounce:click="()=>activityBtn(scope.row.id)">确认报名</el-button>
            <el-button v-else v-debounce:click="()=>cancelActivity(scope.row.id)" type="danger">取消报名</el-button>
          </div>
          <el-button v-else type="info" disabled>请登录后操作</el-button>
        </template>
    </el-table-column>
  </el-table>
    </div>
   <div class="activity-item three">
      <el-card>
    <template #header>
      <div class="card-header">
        <span>我的活动</span>
      </div>
    </template>
    <div class="search-com">
      <!-- <el-button @click="searchUserActivityData('游戏')">测试</el-button> -->
      <SearchCom @search="handleSearch"></SearchCom>
    </div>
    <el-card v-for="useractivity in userActivitiesData" :key="useractivity.id" style="width: 100%" shadow="hover">
      <p>{{ '活动名称：' + useractivity.event.title }}</p>
      <p>{{'结束时间：' + useractivity.event.end_time}}</p>
      <p>{{'活动地点：' + useractivity.event.location}}</p>
      <p>{{'活动描述：' + useractivity.event.description}}</p>
      <p>{{'开始时间：' + useractivity.event.start_time}}</p>
    </el-card>
    <template #footer>Footer content</template>
  </el-card>
    </div>

</div>
</template>
<style scoped lang="scss">
// @use '@/styles/main.scss';
.activity-page{
  // height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: rem(10);
  // padding-bottom: rem(20);
  .activity-item{
    display: flex;
    flex-direction: column;
    flex:1;
    min-width: rem(280);
    // height: 300px;
  }
  .is-selected {
  // color: #1989fa;
}
.activity-calendar{
  padding-right: 1vw;
  // height: 100%;
  // display: flex;
  // flex-direction: column;
  border-right:2px solid var(--white-blue);
  border-bottom:2px solid var(--white-blue);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  .item-two{
    // flex:1;
  }
}
.two{
  height: calc(100vh - var(--header-height));
  flex:2;
}
.search-com{
  margin-bottom: 20px;
  // border: 1px solid red;
  // padding: 0 5px 10px;
}
.el-card{
  flex:1;
  color: #5B91AD;
  :deep(.el-card__header){
    background-color: #FE893C;
    color: #fff;
    // border-bottom: 1px solid #FE893C;
    
  }
  background-color: #FFF8F2;
}
.activity-title{
  color: var(--black);
  @extend .title;
}
.el-calendar{
  flex:1;
  // width: 353px;
  // min-width: 100px;
  color:var(--blue);
  :deep(.el-calendar__header) {
    padding: 0;
    flex-direction: column;
    align-items: center;
    .el-button-group {
      width: 100%;
      @extend .flex-between;
      font-size: rem(16);
      padding-top: rem(5);
      .el-button {
        // color: #5B91AD;
      }
    }
  }
  :deep(.el-calendar__body){
    width: 100%;
    height: rem(314);
    padding: 0;
    font-size: rem(16);
    text-align: center;
    :deep(.el-calendar-table){
    } 
  }
  :deep(.el-calendar-table thead th){
        height: rem(30);
        font-size: rem(16);
        padding: 0;
    }
    :deep(.el-calendar-table tbody){
        height:100%;
    }
    :deep(.el-calendar-table .el-calendar-day){
      height:calc(rem(314)/7);
      // padding: 0;
    }
}
// :deep(.el-calendar-table thead th){
//  color: #5B91AD;
// }
// .activity-title{
//   color: #FBBFDD;
// }
// .view-more{
//   font-size: 12px;
//   color: #F1BA78;
// }
// .el-row {
//   margin-bottom: 20px;
// }
// .el-row:last-child {
//   margin-bottom: 0;
// }
// .el-col {
//   height: calc(100vh - var(--header-height));
//   border-radius: 4px;
//   border:1px solid red;
// }
// .grid-content {
//   display: flex;
//   border-radius: 4px;
//   min-height: 36px;
//   flex-direction: column
// }
// .item1{
//   border:1px solid red;
// }
// .item2{
//   border:1px solid red;
// }
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