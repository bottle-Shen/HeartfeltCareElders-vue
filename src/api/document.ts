import request from '@/utils/request'


export const getDocument =()=> {
    return request({
        url: `files/health_document/my-elderly/?limit=11`,
        method: 'GET',
    }).then(response => {
    //   console.log(response.data)
      return response.data;
    }).catch((error) => {
      console.error('获取用户健康文档失败:', error);
  });
}