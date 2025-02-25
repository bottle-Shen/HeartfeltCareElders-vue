import store from '@/store';
import request from '@/utils/request'

// 定义请求参数类型
interface getUserActivityDataParams {
  user_id: number;
}

// 获取全部活动数据
export const getActivityData =()=> {
    return request({
        url: 'activities/events/',
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        return response.data;
      }
    }).catch((error) => {
        console.log(error)
  });
}

// 定义请求参数类型
interface getRegisterActivityDataParams {
  user_id: number;
  event_id: number;
}

//  获取用户参加的活动数据
export const getUserActivityData =(params: getUserActivityDataParams)=> {
    return request({
        url: `activities/registrations/user-id/${params.user_id}/`,
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        store.commit('activities/setUserActivity', response.data)
        return response.data;
      }
    }).catch((error) => {
       console.log(error)
    })
}
//  用户报名活动
export const registerActivity =(params: getRegisterActivityDataParams)=> {
    return request({
        url: 'activities/registrations/',
        method: 'POST',
      data:{
          user: params.user_id,
        event_id: params.event_id,
      }
    }).then(response => {
      if (response.status === 201) {

        ElMessage.success('报名成功')
      }
    }).catch((error) => {
       console.log(error)
    })
}
