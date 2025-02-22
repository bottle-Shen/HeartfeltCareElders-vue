import request from '@/utils/request'
// 定义请求参数类型
interface ResetParams {
    phone: string,
    new_password?: string,
    confirm_new_password: string,
    captcha: string,
}
// 定义响应数据类型
interface ResetResponse {
    message: string,
    phone: string,
    captcha?: string,//可选属性，不是所有响应都包含验证码
}

export const reset =(data: ResetParams):Promise<ResetResponse>=> {
    return request({
        url: 'users/reset_password/',
        method: 'POST',
        data,
    }
    ).then(response => {
        // 处理响应数据
        return response.data;    
    }).catch(error => {
      // 处理错误
      if (error.request.response) {
        const responseString = error.request.response;
        const responseObject = JSON.parse(responseString);
        const { code, message,errors } = responseObject;
        console.log(code, message, errors)
        if (code === "400") {
          // ElMessage.error(errors.phone[0]);
          return Promise.reject(new Error(message));
        }
      } else if (error.response) {
        console.log('我是error.response');
        console.log(error.response);
      }
      throw error;
  });
}