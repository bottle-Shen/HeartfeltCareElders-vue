import request from '@/utils/request'
// 定义请求参数类型
interface getRefreshParams {
  refresh_token: string,
}

export const getRefresh =(data: getRefreshParams)=> {
  const { refresh_token } = data;
    return request({
        url: 'api/users/token/refresh/',
        method: 'POST',
        data: { refresh: refresh_token },
    }).then(response => {
        // console.log('刷新令牌成功', response.data);
        return response.data;
    }).catch((error) => {
        // console.error('刷新token失败', error)
        throw error;  // 抛出错误，以便在调用方处理
  });
}