import request from '@/utils/request'
//注册
export const image =() => {
    return request({
      url: 'api/carousel/carousel/',
      method: 'GET',
    })
}