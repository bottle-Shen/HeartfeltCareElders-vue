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

// 获取家属用户绑定老人的健康文档
export const getUserElderlyHealthDocument = (page: number, limit: number) => {
  return request({
      url: `files/health_document/family-elderly-health-documents/?limit=${limit}&page=${page}`,
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
// 获取机构人员绑定老人的健康文档
export const getCaregiverElderlyHealthDocument = (elderlyId: number, page: number, limit: number) => {
  return request({
      url: `files/health_document/caregiver-elderly/${elderlyId}/?limit=${limit}&page=${page}`,
      method: 'GET',
  }).then(response => {
    if (response.status === 200) {
      return response.data;
    }
  })
}