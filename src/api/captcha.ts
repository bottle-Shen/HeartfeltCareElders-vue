import request from '@/utils/request'

// 定义请求参数类型
interface getCaptchaParams {
  phone: string,
}
// 定义响应数据类型
export interface getCaptchaResponse {
  code: string,
  message: string,
  phone: string,
  captcha?: string,//可选属性，不是所有响应都包含验证码
}

export const getCaptcha =(data: getCaptchaParams):Promise<getCaptchaResponse>=> {
    return request({
        url: 'api/users/get_captcha/',
        method: 'POST',
        data,
    }).then(response => {
      // console.log(response)
      return response.data;
    }).catch((error) => {
      if (error.response && error.response.data) {
        // console.log('验证码请求失败：', error.response.data);
        const { code, errors } = error.response.data;
        // console.log(code, message, errors);
        if (code === "400") {
          return Promise.reject(new Error(errors.phone[0]));
        }
      }
  });
}