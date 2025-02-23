import router from '@/router';
import request from '@/utils/request'
// 定义请求参数类型
interface ResetParams {
    user_type: number,
    phone: string,
    new_password?: string,
    confirm_new_password: string,
    captcha: string,
}

export const reset =(data: ResetParams)=> {
    return request({
        url: 'users/reset_password/',
        method: 'POST',
        data,
    }
    ).then(response => {
      // 处理响应数据
      if (response.data.code === "200") {
        ElMessage.success('重置密码成功');
        router.push('/login');
      } else {
        ElMessage.error('重置密码失败');
        return Promise.reject(new Error(response.data.message));
      }
    }).catch(error => {
      // 处理错误
      if (error.response && error.response.data) {
         const { code,errors } = error.response.data;
        if (code === "400") {
          // 解析后端返回的用户信息
          if (errors.captcha) {
            ElMessage.error('验证码错误');
          } 
        }
        if (code === "404") {
          ElMessage.error('该用户不存在');
        }
      }
      throw error;
  });
}