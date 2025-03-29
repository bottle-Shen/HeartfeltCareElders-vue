import request from '@/utils/request'
import type { HealthDataFormType } from '@/@types/healthdata'
// 获取用户健康数据
export const getHealthData =()=> {
    return request({
        // url: `data/health_data/my-elderly/?limit=10`,//limit表示每页展示的数据条数,这里设置为10
        url: `data/health_data/my-elderly/?limit=10`,//limit表示每页展示的数据条数,这里设置为10
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
// SSE URL
export const getSSEUrl = () => {
  const baseURL = request.defaults.baseURL || ''; // 提取 Axios 实例的 baseURL
  // 确保 URL 以斜杠结尾
  const sseUrl = `${baseURL}data/sse/`; // 拼接 SSE URL
  return sseUrl;
}
// 删除当前用户关联的老人的健康数据(只有机构人员有权限)
export const deleteHealthData = (healthDataId: number) => {
    return request({
        url: `data/health_data/delete-health-data/${healthDataId}/`,
        method: 'DELETE',
    }).then(response => {
      if (response.status === 200) {
        console.log(response.data)
        // return response.data;
      }
    }).catch((error) => {
        console.log(error)
  });
};
// 获取当前机构人员关联的老人的列表
export const getElderlyList = () => {
    return request({
        url: `data/health_data/elderly-list/`,
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
// 获取当前机构人员关联的老人的健康数据
export const getElderlyHealthDataList = (elderlyId: number) => {
    return request({
        url: `data/health_data/caregiver-elderly/${elderlyId}`,
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
// 更新当前用户关联的老人的健康数据(只有机构人员有权限)
export const updateHealthData = (healthDataId: number,data: HealthDataFormType) => {
    return request({
        url: `data/health_data/update-health-data/${healthDataId}`,
        method: 'PATCH',
        data,
    }).then(response => {
      if (response.status === 200) {
        // console.log(response.data)
        return response.data;
      }
    }).catch((error) => {
        console.log(error)
  });
};

// 获取家属绑定的老人健康数据
export const getElderlyHealthData = () => {
  return request({
    url: `data/health_data/family-elderly-health-data/`,
    method: 'GET',
  }).then(response => {
    if (response.status === 200) {
      // console.log(response.data)
      return response.data;
    }
  }).catch((error) => {
    console.log('获取绑定的老人健康数据失败', error)
    throw error;
  })
}
// 上传老人健康数据(仅机构人员有权限)
export const uploadHealthData = (elderlyId: number,data: HealthDataFormType) => {
  return request({
    url: `data/health_data/upload-health-data/${elderlyId}/`,
    method: 'POST',
    data,
  }).then(response => {
    if (response.status === 201) {
      // console.log(response.data)
      return response;
    }
  }).catch((error) => {
    console.log(error)
  })
}
