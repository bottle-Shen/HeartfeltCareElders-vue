<script setup lang="ts">
import zhCn from "element-plus/dist/locale/zh-cn.mjs"
import type { CalendarDateType, CalendarInstance } from 'element-plus'
import type {CreateActivityData} from "@/@types/activities"
import { deleteActivityData,getActivityDataByOrg,createActivityData,getActivityData,getUserActivityData,registerActivity,cancelRegisterActivity } from "@/api/activities";
import { useStore } from 'vuex'
import { formatDate,formatDateToISO } from '@/utils'
import type { ActivityData, ActivitiesByDate,userActivityData } from "@/@types/activities"
// import { useRouter } from 'vue-router'
// const router = useRouter()
const locale = ref(zhCn)
const store = useStore()
const isAuthenticated = computed(() => store.getters['user/isAuthenticated']);// 获取用户是否登录
// const getUserType = computed(() => store.getters['user/getUserType']);// 获取用户类型
// 定义活动数据的响应式变量
const activityData = ref<ActivityData[]>([])// 全部活动数据
const myActivityData = ref<ActivityData[]>([])// 机构人员创建的活动数据
// 按日期分类的活动数据
const activitiesByDate = ref<ActivitiesByDate>({});
const calendar = ref<CalendarInstance>()
// 定义用户参加活动的响应式变量
const userActivitiesData = ref<userActivityData[]>([])

const userId = store.state.user.user.id
// console.log('userId', userId)
const dialogVisible = ref(false); // 控制弹窗的显示
const moreActivities = ref<ActivityData[]>([]); // 存储更多活动数据
const searchQuery = ref(''); // 搜索关键词
const getUserType = computed(() => store.getters['user/getUserType']);
// 根据用户类型动态计算标题
const activityTitle = computed(() => {
  const userType = store.getters['user/getUserType'];
  return userType === 3 ? '我创建的活动' : '报名活动';
});
const ActivityDialog = ref(false)// 创建活动弹窗
const createActivityDialog = () => {
  ActivityDialog.value = true
}
// 根据用户类型动态返回数据
const currentActivityData = computed(() => {
  if (getUserType.value === 3) {
    return myActivityData.value;
  } else {
    return activityData.value;
  }
});
// 获取活动数据
const fetchActivityData = async () => {
  const response = await getActivityData()
  if (getUserType.value === 3) {
    const response = await getActivityDataByOrg()
    myActivityData.value = response
    myActivityData.value = response.map((activity: ActivityData) => {
    return {
      ...activity,
      start_time: formatDate(activity.start_time),
      end_time: formatDate(activity.end_time),
    }
  })
  }
  // console.log(response)
  activityData.value = response
  // console.log('获取活动数据',activityData.value)
  // 处理活动数据
  activityData.value = response.map((activity: ActivityData) => {
    return {
      ...activity,
      start_time: formatDate(activity.start_time),
      end_time: formatDate(activity.end_time),
    }
  })
   // 按日期分类活动数据-活动日历
    activitiesByDate.value = response.reduce((acc: ActivitiesByDate, activity: ActivityData)=> {
      const date = new Date(activity.start_time).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(activity);
      return acc;
    }, {});
  // console.log('按日期分类活动数据',activitiesByDate.value);
}
//  获取用户活动数据
const fetchUserActivityData = async () => {
  const response = await getUserActivityData();
  // console.log('用户参加的活动数据', response);
  // 处理用户活动数据
  userActivitiesData.value = response.map((activity: userActivityData) => {
    return {
      ...activity,
      event: {
        ...activity.event,
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
  // console.log(`查看日期 ${date} 的更多活动`);
  moreActivities.value = activitiesByDate.value[date] || [];
  dialogVisible.value = true; // 显示弹窗
};

const hasRegistered = (row: number) => {
  const result = userActivitiesData.value.some(activity => {
    // console.log(`活动 ID: ${activity.event.id}, 用户 ID: ${activity.user}, 对比 ID: ${row}, 用户 ID: ${userId}`);
    return activity.event.id === row && activity.user === userId;
  });
  return result;
  // return userActivitiesData.value.some(activity => activity.event.id === row && activity.user === userId);
}
const activityEndedStatus = ref<Record<number, boolean>>({});
const isActivityEnded = async (row: number):Promise<boolean> => {
  const activity = activityData.value.find(activity => activity.id === row);
  if (!activity) return true; // 如果找不到活动，认为活动已结束
  const now = new Date();
  const endTime = new Date(formatDateToISO(activity.end_time));
  return now > endTime;
};
const activityBtn = async (row: number) => {
    const params = { event_id: row,user_id:userId }
    // 处理报名逻辑
  await registerActivity(params)
  // store.dispatch('activities/addUserActivity', params)
}
const cancelActivity = async (row: number) => {
  const params = { event_id: row,user_id:userId }
  await cancelRegisterActivity(params)
}
// 删除活动
const deleteBtn = async (rowId:number) => {
  try {
    // 调用后端接口删除活动
    await deleteActivityData(rowId);

    // 从 activityData 和 myActivityData 中移除对应的活动
    const index = activityData.value.findIndex((activity) => activity.id === rowId);
    if (index !== -1) {
      activityData.value.splice(index, 1);
    }

    const myIndex = myActivityData.value.findIndex((activity) => activity.id === rowId);
    if (myIndex !== -1) {
      myActivityData.value.splice(myIndex, 1);
    }

    // 从 activitiesByDate 中移除对应的活动
    for (const date in activitiesByDate.value) {
      const activityIndex = activitiesByDate.value[date].findIndex((activity) => activity.id === rowId);
      if (activityIndex !== -1) {
        activitiesByDate.value[date].splice(activityIndex, 1);
        // 如果某个日期的活动列表为空，移除该日期
        if (activitiesByDate.value[date].length === 0) {
          delete activitiesByDate.value[date];
        }
      }
    }

  } catch (error) {
    console.error('删除活动失败:', error);
  }
};
const filteredActivities = computed(() => {
  if (searchQuery.value === '') {
    // console.log('没有搜索关键词');
    return store.state.activities.useractivity
  }
  return store.getters['activities/filteredActivities'](searchQuery.value)
});
// 搜索用户活动
const handleSearch = async (query: string) => {
  if (!query.trim()) {
    // console.log('搜索内容不能为空');
    ElMessage.error('搜索内容不能为空');
    return;
  }
  if (!isAuthenticated.value) {
    // 如果用户未登录，提示用户登录
    ElMessage.error('请先登录后再进行搜索');
    // router.push('/login'); // 跳转到登录页面
  } else {
    searchQuery.value = query; // 更新搜索关键词
    try {
      await store.dispatch('activities/searchUserActivity', query);
    } catch (error) {
      console.error('搜索失败:', error);
      ElMessage.error('搜索失败，请稍后再试');
    }
  }
};
// 监听子组件的 clear 事件
const handleClear = () => {
  // console.log('clear');
  searchQuery.value = '';
};

// 在组件挂载时获取数据
onMounted(async () => {
  // 设置全局加载状态为 true
  store.commit('loading/SET_LOADING', true);
  try {
    await fetchActivityData()
    if (isAuthenticated.value) {
      if (getUserType.value === 1 || getUserType.value === 2) {
        await fetchUserActivityData()
      }
    }
  for (const activity of activityData.value) {
    const ended = await isActivityEnded(activity.id); // 等待异步操作完成
    activityEndedStatus.value[activity.id] = ended; // 更新活动结束状态
    const registered = hasRegistered(activity.id);
    if (ended && registered) {
      // console.log(`自动取消用户对活动 ID ${activity.id} 的报名`);
      await cancelActivity(activity.id); // 自动取消报名
    }
  }
  } catch (error) {
    console.error('Failed to fetch activity data:', error);
  }finally {
    // 设置全局加载状态为 false
    store.commit('loading/SET_LOADING', false);
  }
})

const activityForm = ref({
  title: '',
  start_time: '',
  end_time: '',
  description: '',
  location: '',
})
import type { ElForm } from 'element-plus';
const activityFormRef = ref<InstanceType<typeof ElForm> | null>(null);

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '活动标题不能为空', trigger: 'blur' },
  ],
  description: [
    { required: true, message: '活动描述不能为空', trigger: 'blur' },
  ],
  location: [
    { required: true, message: '活动地点不能为空', trigger: 'blur' },
  ],
  start_time: [
    { required: true, message: '活动开始时间不能为空', trigger: 'blur' },
  ],
  end_time: [
    { required: true, message: '活动结束时间不能为空', trigger: 'blur' },
  ],
}
// 创建活动数据
const createActivity = async (activityForm: CreateActivityData) => {
  try {
        const response = await createActivityData(activityForm)
        if (response) {
          // 更新活动数据
          const formattedActivity = {
            ...response,
            start_time: response.start_time,
            end_time: response.end_time,
          };

          if (getUserType.value === 3) {
            // 格式化日期并更新 formattedActivity 的 start_time 和 end_time
            myActivityData.value.push({
              ...response,
              start_time: formatDate(response.start_time),
              end_time: formatDate(response.end_time),
            });;
          } else {
            activityData.value.push(formattedActivity);
          }

          // 更新按日期分类的活动数据
          const date = new Date(response.start_time).toISOString().split('T')[0];
          if (!activitiesByDate.value[date]) {
            activitiesByDate.value[date] = [];
          }
          activitiesByDate.value[date].push(formattedActivity);
        }
      } catch (error) {
        console.error('上传活动失败:', error);
      }
}
// 提交表单
const submitForm = () => {
  if (activityFormRef.value) {
    activityFormRef.value.validate((valid: boolean) => {
      if (valid) {
        // 表单验证通过，可以提交数据
        console.log('表单数据:', activityForm.value);
        // 这里可以调用 API 提交数据
        createActivity(activityForm.value)
        ActivityDialog.value = false; // 关闭弹窗
      } else {
        // 表单验证失败
        console.log('表单验证失败');
      }
    });
  }
};

// 重置表单
const resetForm = () => {
  if (activityFormRef.value) {
    activityFormRef.value.resetFields();
  }
};
</script>
<template>
    <div class="activity-page">
   <div class="activity-item activity-calendar one">
      <div class="calendar-item">
        <el-config-provider :locale="locale">
        <el-calendar ref="calendar">
          <template #header="{ date }">
      <span class="activity-title title">活动日历</span>
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
        <span :class="[
                'calendar-day',
                `color-${data.date.getDay() % 4}`
              ]">{{ data.day.split('-').slice(2).join('-') }}</span>
          <span v-if="activitiesByDate[data.day]">
            <!-- {{ activitiesByDate[data.day][0].title }} -->
              <p v-for="(activity, index) in activitiesByDate[data.day]" 
              :key="activity.id" v-show="index<1" class="calendar-title body-s ellipsis">
            {{ activity.title }}
              </p>
              <p v-if="activitiesByDate[data.day].length > 0" 
                class="view-more" @click="showMoreActivities(data.day)">
            查看详情
          </p>
          </span>
      </p>
    </template>
        </el-calendar>
      </el-config-provider>
      </div>
    </div>
    <!-- 更多活动弹窗 -->
  <el-dialog v-model="dialogVisible" title="更多活动">
    <div v-for="activity in moreActivities" :key="activity.id" class="more-activity flex-between">
      <div class="activity-content">
        <p class="activity-title">活动名称：{{ activity.title }}</p>
        <p class="activity-description">活动介绍：{{ activity.description }}</p>
        <p class="activity-location">活动地点：{{ activity.location }}</p>
        <p class="activity-time">开始时间：{{ formatDate(activity.start_time) }} - 结束时间：{{ formatDate(activity.end_time) }}</p>
      </div>
      <div>
        <div v-if="isAuthenticated">
          <div v-if="getUserType === 1 || getUserType === 2">
            <el-button class="primary-button" v-if="!hasRegistered(activity.id) && !activityEndedStatus[activity.id]" v-debounce:click="()=>activityBtn(activity.id)">确认报名</el-button>
            <el-button class="primary-button danger" v-else-if="hasRegistered(activity.id) && !activityEndedStatus[activity.id]" v-debounce:click="()=>cancelActivity(activity.id)" type="danger">取消报名</el-button>
            <el-button class="primary-button danger" v-else disabled>
                活动已结束
            </el-button>
          </div>
        </div>
        <el-button v-else type="info" disabled>请先登录</el-button>
      </div>
    </div>
  </el-dialog>
  <!-- 创建活动弹窗 -->
  <el-dialog v-model="ActivityDialog" title="创建活动">
    <el-form class="w-full" :model="activityForm" :rules="rules" ref="activityFormRef">
      <!-- 活动标题 -->
      <el-form-item label="活动标题" prop="title">
        <el-input v-model="activityForm.title" placeholder="请输入活动标题"></el-input>
      </el-form-item>

      <!-- 活动描述 -->
      <el-form-item label="活动描述" prop="description">
        <el-input
          v-model="activityForm.description"
          type="textarea"
          :rows="3"
          placeholder="请输入活动描述"
        ></el-input>
      </el-form-item>

      <!-- 活动地点 -->
      <el-form-item label="活动地点" prop="location">
        <el-input v-model="activityForm.location" placeholder="请输入活动地点"></el-input>
      </el-form-item>

      <!-- 活动开始时间 -->
      <el-form-item label="活动开始时间" prop="start_time">
        <el-date-picker
          v-model="activityForm.start_time"
          type="datetime"
          placeholder="请选择活动开始时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-form-item>

      <!-- 活动结束时间 -->
      <el-form-item label="活动结束时间" prop="end_time">
        <el-date-picker
          v-model="activityForm.end_time"
          type="datetime"
          placeholder="请选择活动结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <!-- 提交按钮 -->
      <template #footer>
        <span class="dialog-footer">
          <el-button class="primary-button" @click="submitForm">创建</el-button>
          <el-button class="primary-button" @click="resetForm">重置</el-button>
        </span>
      </template>
  </el-dialog>
    <div class="activity-item ep-bg-purple two">
      <div class="flex-between">
        <span class="activity-title title">{{ activityTitle }}</span>
        <el-button v-if="getUserType === 3" class="primary-button" @click="createActivityDialog">上传</el-button>
      </div>
      <el-table
      row-key="id"
    :data="currentActivityData"
    style="width: 100%" height="620"
  >
    <el-table-column prop="title" label="活动名称" show-overflow-tooltip/>
    <el-table-column prop="description" label="活动介绍" show-overflow-tooltip/>
    <el-table-column prop="location" label="地点" show-overflow-tooltip/>
    <el-table-column prop="start_time" label="开始时间" show-overflow-tooltip/>
    <el-table-column prop="end_time" label="结束时间" show-overflow-tooltip/>
    <el-table-column
      v-if="getUserType === 3"
      label="参与者"
      show-overflow-tooltip
    >
      <template #default="scope">
        <span v-if="scope.row.participants && scope.row.participants.length > 0">
          {{ scope.row.participants.join(', ') }}
        </span>
        <span v-else>暂无参与者</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" fixed="right">
       <!-- 为按钮绑定点击事件，并传递当前行的数据 -->
        <!-- 根据用户是否登录显示不同的按钮 -->
      <template #default="scope">
          <div v-if = "isAuthenticated">
            <div v-if="getUserType === 3">
              <el-button class="primary-button danger" v-debounce:click="()=>deleteBtn(scope.row.id)">删除活动</el-button>
            </div>
            <div v-else>
              <el-button class="primary-button" v-if="!hasRegistered(scope.row.id) && !activityEndedStatus[scope.row.id]" v-debounce:click="()=>activityBtn(scope.row.id)">确认报名</el-button>
              <el-button class="primary-button danger" v-else-if="hasRegistered(scope.row.id) && !activityEndedStatus[scope.row.id]" v-debounce:click="()=>cancelActivity(scope.row.id)">取消报名</el-button>
              <el-button class="primary-button danger" v-else disabled>
                活动已结束
              </el-button>
            </div>
          </div>
          <el-button class="primary-button info" v-else disabled>请先登录</el-button>
        </template>
    </el-table-column>
  </el-table>
    </div>
   <div v-if="getUserType === 1 || getUserType === 2" class="activity-item three">
      <el-card class="activity-card">
    <template #header>
      <div class="card-header">
        <span>我的活动</span>
      </div>
    </template>
    <div class="search-com">
      <!-- <el-button @click="searchUserActivityData('游戏')">测试</el-button> -->
      <SearchCom :placeholder="'请输入活动名称'" @search="handleSearch" @clear="handleClear"></SearchCom>
    </div>
    <div class="activity-list-container">
      <el-card class="my-activity body" v-for="useractivity in filteredActivities" :key="useractivity.id" style="width: 100%" shadow="hover">
      <p>{{ '活动名称：' + useractivity.event.title }}</p>
      <p>{{'活动描述：' + useractivity.event.description}}</p>
      <p>{{'活动地点：' + useractivity.event.location}}</p>
      <p>{{'开始时间：' + formatDate(useractivity.event.start_time)}}</p>
      <p>{{'结束时间：' + formatDate(useractivity.event.end_time)}}</p>
    </el-card>
    </div>
  </el-card>
    </div>

</div>
</template>
<style scoped lang="scss">
// @use '@/styles/main.scss';
.activity-page{
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  // padding-bottom: rem(20);
  .el-form{
  .el-form-item{
    padding-bottom: rem(20);
  }
  :deep(.el-date-editor.el-input){
    width: 100%;
  }
}
:deep(.el-dialog__footer .dialog-footer){
  padding-top: 0 !important;
}
  .activity-item{
    padding-top: rem(10);
    display: flex;
    flex-direction: column;
    flex:1 1 auto;
    min-width: rem(230);
    // height: 300px;
  }
  .more-activity{
    div{
      padding-left: 1vw;
    }
  }
.activity-calendar{
  padding-right: 1vw;
  // height: 100%;
  // display: flex;
  // flex-direction: column;
  border-right:2px solid var(--white-blue);
  border-bottom:2px solid var(--white-blue);
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}
.one{
  flex:3;
}
.two{
  flex:4;
}
.three{
  flex:1;
}
:deep(.el-card__body){
  padding: 0 rem(10);
  .search-com{
    padding: rem(20) 0;
  }
  .activity-card {
    display: flex;
    flex-direction: column;
    height: 100%; // 确保卡片占满整个容器
  }
  .activity-list-container {
    box-sizing: border-box;
    width: 100%;
    overflow-y: auto; // 添加滚动条
    max-height: rem(510); // 设置最大高度
    .my-activity{
      background-color: var(--white);
      margin-bottom: rem(10);
      color: var(--black);
      border-radius: rem(15);
      .el-card__body{
        padding: rem(10);
      }
    }
  }
}
.el-card{
  flex:1;
  color: #5B91AD;
  :deep(.el-card__header){
    background-color: var(--orange);
    color: var(--white);
    // border-bottom: 1px solid #FE893C;
    
  }
  background-color: var(--cream);
}
.activity-title{
  color: var(--black);
  // @extend .title;
}
:deep(.el-dialog__body){
  flex-direction: column;
  .activity-item{
    @extend .flex-between;
    flex-direction: row;
    .activity-content{
      padding-right: rem(20);
    }
  }
}
.calendar-item{
  height: 100%;
  .el-calendar{
  --el-calendar-selected-bg-color:var(--white-blue-rgb);
  flex:1;
  height: 100%;
  color:var(--blue);
  .el-button{
    @include hover{
      &:hover{
        background-color:var(--white-blue-rgb);
        border: 1px solid transparent;
        color:var(--blue);
      }
    }
  }
  :deep(.el-calendar-table td.is-today){
    color:var(--blue);
  }
  :deep(.el-calendar-table:not(.is-range) td.next),
  :deep(.el-calendar-table:not(.is-range) td.prev) {
    p{
      visibility: hidden; // 隐藏文字日期
    }
  }
  // .calendar-title{
  //   font-size: rem(14);
  // }
  .view-more{
    font-size: rem(12);
    color:var(--yellow);
    @include hover{
      &:hover{
        color:var(--yellow-rgb);
      }
    }
  }
  :deep(.el-calendar__header) {
    height: rem(60);
    padding: 0;
    flex-direction: column;
    align-items: center;
    .el-button-group {
      width: 100%;
      @extend .flex-between;
      font-size: rem(16);
    }
  }
  :deep(.el-calendar__body){
    width: 100%;
    padding: 0;
    font-size: rem(16);
    text-align: center;
  }
  :deep(.el-calendar-table thead th){
        height: rem(40);
        font-size: rem(16);
        padding: 0;
    }
    :deep(.el-calendar-table tbody){
        height:100%;
    }
    :deep(.el-calendar-table .el-calendar-day){
      // border: 1px solid red;
      padding: 0;
      padding-top: rem(10);
    }
}
}
:deep(.el-calendar-table thead th){
 color: var(--dark-blue);
}
}
</style>