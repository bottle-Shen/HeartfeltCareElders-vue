import request from '@/utils/request'


// 获取知识列表（支持分页和搜索）
export const getKnowledge = (params: { page?: number, search?: string }) => {
  return request({
    url: 'knowledge/knowledges/',
    method: 'GET',
    params,
  }).then(response => {
    return response.data;
  }).catch((error) => {
    console.error(error)
  })
}

// 获取单个知识
export const getKnowledgeById = (id: number) => {
  return request({
    url: `knowledge/knowledges/${id}/`,
    method: 'GET',
  }).then(response => {
      console.log(response)
    return response.data;
  });
}

// 创建知识
export const createKnowledge = () => {
  return request({
    url: 'knowledge/knowledges/',
    method: 'POST',
  }).then(response => {
      console.log(response)
    return response.data;
  });
}

// 更新知识
export const updateKnowledge = () => {
  return request({
    url: 'knowledge/knowledges/',
    method: 'PATCH',
  }).then(response => {
      console.log(response)
    return response.data;
  });
}

// 删除知识
export const deleteKnowledge = () => {
  return request({
    url: 'knowledge/knowledges/',
    method: 'DELETE',
  }).then(response => {
      console.log(response)
    return response.data;
  });
}
