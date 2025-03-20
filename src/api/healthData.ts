import request from '@/utils/request'
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
// export const deleteHealthData = () => {
//     return request({
//         url: `health-documents/delete-by-elderly-id/${health_data_id}/`,
//         method: 'DELETE',
//     }).then(response => {
//       if (response.status === 200) {
//         console.log(response.data)
//         // return response.data;
//       }
//     }).catch((error) => {
//         console.log(error)
//   });
// };

// 更新当前用户关联的老人的健康数据(只有机构人员有权限)
// export const updateHealthData = (data) => {
//     return request({
//         url: `health-documents/update-by-elderly-id/${health_data_id}/`,
//         method: 'PATCH',
//         data: data,
//     }).then(response => {
//       if (response.status === 200) {
//         console.log(response.data)
//         // return response.data;
//       }
//     }).catch((error) => {
//         console.log(error)
//   });
// };