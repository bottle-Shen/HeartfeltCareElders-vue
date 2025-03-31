import store from '@/store';
import request from '@/utils/request'
import type { getRegisterActivityDataParams,CreateActivityData } from '@/@types/activities'


// 获取全部活动数据
export const getActivityData =()=> {
    return request({
        url: 'api/activities/events/',
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        return response.data;
      }
    }).catch((error) => {
      console.log('获取全部活动信息失败',error)
      throw error;
  });
}


//  获取用户参加的活动数据
export const getUserActivityData =()=> {
    return request({
        url: `api/activities/registrations/my-activities/`,
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        return response.data;
      }
    }).catch((error) => {
      console.error('获取用户活动数据失败:', error);
      throw error; // 抛出错误，以便在调用处捕获
    })
}
//  用户报名活动
export const registerActivity =(params: getRegisterActivityDataParams)=> {
    return request({
        url: 'api/activities/registrations/',
        method: 'POST',
      data:{
          user: params.user_id,
          event_id: params.event_id,
      }
    }).then(response => {
      if (response.status === 201) {
        store.commit('activities/addUserActivity', {
          id: response.data.id,
          registered_at: new Date(response.data.registered_at).toISOString(),
          user: response.data.user,
          event: response.data.event,
        })
        ElMessage.success('报名成功')
      }
    }).catch((error) => {
       console.log(error)
    })
}
// 用户取消报名活动
export const cancelRegisterActivity =(params: getRegisterActivityDataParams)=> {
    return request({
        url: `api/activities/registrations/cancel/${params.event_id}/`,
        method: 'DELETE',
    }).then(response => {
      if (response.status === 204) {
        console.log(response)
        store.commit('activities/deleteUserActivity', {
          event_id:params.event_id,
          user_id:params.user_id,
        });
        ElMessage.success('取消报名成功')
      }
    }).catch((error) => {
       console.log(error)
    })
}
// 搜索用户活动
export const searchUserActivity =(params:string)=> {
    return request({
        url: `api/activities/registrations/?search=${params}`,
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        return response.data;
      }
    }).catch((error) => {
        console.log(error)
    })
}

// 机构人员创建活动数据
export const createActivityData =(params:CreateActivityData)=> {
    return request({
        url: 'api/activities/events/',
        method: 'POST',
        data:{
            title: params.title,
            description: params.description,
            location: params.location,
            start_time: params.start_time,
            end_time: params.end_time,
        }
    }).then(response => {
      if (response.status === 201) {
        // console.log(response.data)
        return response.data;
      }
   }).catch((error) => {
      console.log(error)
  });
}
// 获取机构人员创建的活动数据
export const getActivityDataByOrg =()=> {
    return request({
        url: 'api/activities/events/my-events/',
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        return response.data;
      }
    }).catch((error) => {
      console.log('获取机构人员创建的活动数据失败',error)
    })
}
// 机构人员删除活动数据
export const deleteActivityData =(params:number)=> {
    return request({
        url: `api/activities/events/${params}/delete-my-event/`,
        method: 'DELETE',
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        return response.data;
      }
    }).catch((error) => {
      console.log('删除活动数据失败',error)
    })
}