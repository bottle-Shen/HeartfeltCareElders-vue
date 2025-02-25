import request from '@/utils/request'

// 定义请求参数类型
interface getHealthDataParams {
  elderly_id: number;
}

export const getHealthData =(params: getHealthDataParams)=> {
    return request({
        url: `data/health_data/elderly-id/${params.elderly_id}/`,
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