import request from '@/utils/request'
export const getArticle = () => {
  return request({
    url: 'knowledge/articles/',
    method: 'GET',
  }).then(response => {
      console.log(response)
    return response.data;
  });
}