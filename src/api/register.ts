import request from '@/utils/request'
import { ElMessage } from 'element-plus'
import type { Action } from 'element-plus'
import router from '@/router'
//注册
// 定义请求参数类型
interface RegisterParams {
  phone: string,
  password: string,
  confirm_password: string,
  user_type: number,
  captcha: string,
  current_user_id?: string,
}
// 定义响应数据类型
interface RegisterResponse {
  phone: string,
  password1: string,
  password2: string,
  user_type: number,
  captcha: string,
  status: number,
  // message: string,
  // errors: string,
  // code: number,
}

export const register =(data: RegisterParams):Promise<RegisterResponse> => {
    return request({
      url: 'api/users/register/',
      method: 'POST',
      data,
    }
    ).then(response => {
      if (response.data.code === "201") {
        ElMessage.success('注册成功');
        router.push('/login');
      } else {
        // ElMessage.error(response.data.message);
        ElMessage.error('注册失败');
        return Promise.reject(new Error(response.data.message));
      }
      return response.data;
    }).catch(error => {
      // 处理错误
      if (error.response && error.response.data) {
        const { code, message, errors } = error.response.data;
        // console.log(code, message, errors)
        if (code === "400") {
          // 解析后端返回的用户信息
          if (errors.captcha) {
            ElMessage.error('验证码错误');
          } else {
            const user_info = errors.phone.user_info ? JSON.parse(errors.phone.user_info) : null;
            if (user_info) {
              ElMessageBox.confirm(`该手机号已注册，是否为您的账户？${user_info.user_id ? `用户ID：${user_info.user_id}` : ''}`, "警告", {
                distinguishCancelAndClose: true,
                  confirmButtonText: "已有账户，立即登录",
                  cancelButtonText: "不是我的，继续注册",
              type: "warning",
            }).then(async() => {
              await router.push("/login");
            }).catch((action: Action) => {
                if (action === 'cancel') {
                    // 用户选择继续注册
                  continueRegistration(data)
                  router.push('/login');
                } else {
                    // 用户关闭弹窗，不执行任何操作
                    ElMessage({
                      type: 'info',
                      message: '用户取消操作',
                    })
                }
            })
          } 
            
          }
            // 使用 new Error(message) 来创建错误对象，并传递给 Promise 的拒绝处理程序
            return Promise.reject(new Error(message));
          }
          // 如果没有后端响应，直接返回捕获到的错误
          return Promise.reject(error);
      } 
  });
}
//用户确认继续注册
const continueRegistration = (data: RegisterParams) => {
  //发送新的请求，告诉后端用户确认继续注册
  return request({
    url: 'api/users/continue_register/',
    method: 'POST',
    data: {
      ...data,
      continue_register: true,// 告诉后端用户确认继续注册
      // current_user_id: localStorage.getItem('user_id')
    }
  }).then(response => {
      if (response.data.code === "201") {
        ElMessage.success(response.data.message);
      } else {
        ElMessage.error(response.data.message);
      }
    })
    .catch(error => {
      console.error('继续注册失败:', error);
    });
}