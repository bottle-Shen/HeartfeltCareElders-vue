import router from '@/router';
import request from '@/utils/request'
import {store} from '../store'
// import { ElMessage } from 'element-plus'

//登录
// 定义请求参数类型
interface LoginParams {
  phone?: string,
  password?: string,
  user_type: number,
  captcha?: string,
  account?: string,
}
// 定义响应数据类型
interface LoginResponse {
  message:string,
  phone?: string,
  account?: string,
  password?: string,
  user_type: number,
}

export const login =(data: LoginParams):Promise<LoginResponse> => {
    return request({
      url: 'api/users/login/',
      method: 'POST',
      data
    }).then(response => {
      if (response.data.code === "200") {
        // 登录成功，存储 token
        // console.log('response.data.data', response.data.data);
       const { access_token,refresh_token, user } = response.data.data;
        // localStorage.setItem('token', response.data.token);
        // 登录成功，处理用户信息
      // 可以将用户信息存储在本地存储或Vuex中
        ElMessage.success('登录成功');
        store.dispatch('user/login', { access_token,refresh_token, user });// 调用 Vuex action 更新状态
            
        // 确保在存储 token 后跳转路由
    router.push({ path: '/' }).catch(err => {
      // 处理路由跳转错误
      console.error(err);
    });
        return response.data; // 返回完整的响应数据
      } else {
        ElMessage.error('登录失败');
        return Promise.reject(new Error(response.data.message));
      }
    }).catch(error => {
  // 处理错误响应
      if (error.response && error.response.data) {
         const { code, message, errors } = error.response.data;
        // console.log(code, message, errors)
        if (code === "400") {
          if (errors.phone) {
            ElMessageBox.confirm(`该手机号未注册，是否立即去注册？`, "提示", {
                distinguishCancelAndClose: true,
                  confirmButtonText: "火速注册",
                  cancelButtonText: "再考虑一下",
              type: "warning",
            }).then(async() => {
              await router.push("/register");
            })
          }
          if (errors.captcha) {
            ElMessage.error('验证码错误');
          }
          if (errors.password) {
            ElMessage.error('密码错误');
          }
          if (errors.account) {
            ElMessage.error('该账号不存在');
          }
          return Promise.reject(new Error(message));
        }
      } 
})
}

