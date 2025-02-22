import request from '@/utils/request'
//注册
export const image =() => {
    return request({
      url: 'carousel/carousel/',
      method: 'GET',
    })
}