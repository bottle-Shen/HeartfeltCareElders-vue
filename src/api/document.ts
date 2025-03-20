import request from '@/utils/request'


export const getDocument =(page: number, limit: number)=> {
    return request({
        url: `files/health_document/my-elderly/?limit=${limit}&page=${page}`,
        method: 'GET',
    }).then(response => {
      if (response.status === 200) {
        return response.data;
      }
    }).catch((error) => {
      console.error('获取用户健康文档失败:', error);
      throw error;
  });
}