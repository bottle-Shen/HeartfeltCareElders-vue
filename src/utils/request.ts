import axios from "axios"
import { store } from '../store'
import { getRefresh } from '@/api/refresh'

// 在全局范围内定义一个标志
let hasRetriedRefresh = false;
// console.log(import.meta.env);
// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // 使用环境变量设置基础路径
  timeout: 5000,
  withCredentials: true,// 携带 cookie
})


// 设置 CSRF 令牌的 cookie 名称和 header 名称
// request.defaults.xsrfCookieName = 'csrftoken';
// request.defaults.xsrfHeaderName = 'X-CSRFToken';
// 请求拦截器
request.interceptors.request.use(
  config => {
  // 自动从 cookie 中获取 CSRF 令牌并添加到请求头
  // 获取CSRF令牌
    const csrftoken = getCookie('csrftoken');
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    // 从localStorage获取认证令牌并添加到请求头
        // const authToken = localStorage.getItem('authToken');
        // if (authToken) {
        //     config.headers['Authorization'] = `Bearer ${authToken}`;
    // }
    //获取access_token
    // const accessToken = sessionStorage.getItem('access_token');
    const accessToken = store.state.user.token.access_token;
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
// 响应拦截器
request.interceptors.response.use(
  response => {
    console.log('拦截器响应成功')
    // console.log(response)
		return response
  },
  // 响应错误处理
  async error => {
    console.log('拦截器响应失败')
    console.log(error)
    if (error.response) {
      //处理HTTP错误码
      switch (error.response.status) {
        case 400:
          error.message = '请求错误(400)';
          break;
        case 401:
          error.message = '未授权，请重新登录(401)';
          // 尝试刷新令牌
          if (!hasRetriedRefresh) {
            hasRetriedRefresh = true; // 防止重复刷新
            try {
              const response = await getRefresh({
                refresh_token: store.state.user.token.refresh_token
              })
              store.commit('user/setToken', {
                access_token: response.access,
                refresh_token: store.state.user.token.refresh_token
              });
              console.log('刷新令牌成功', response);
              console.log('重新发起请求');
              // 更新请求头中的授权令牌
              error.config.headers['Authorization'] = `Bearer ${store.state.user.token.access_token}`;
              // 返回一个新的Promise，确保axios能够自动处理重新发起的请求
              return new Promise((resolve, reject) => {
                axios(error.config)
              .then(response => {
                console.log('重新发起请求成功', response);
                resolve(response)
              })
              .catch(err => {
                console.error('重新发起请求失败', err);
                reject(err)
              });
        });
            } catch (refreshError) {
              console.error('刷新令牌失败，需要重新登录', refreshError);
              error.message = '刷新令牌失败，请重新登录';
              // 清除 Vuex 中的令牌
              store.commit('user/setToken', { access_token: '', refresh_token: '' });
              // 提示用户重新登录
              // ElMessage.error('您的会话已过期，请重新登录');
              // 如果刷新令牌失败，可以跳转到登录页面或提示用户重新登录
              const router = useRouter();
              store.dispatch('user/logout',{router});
            } finally {
              hasRetriedRefresh = false; // 清除重试标志
            }
          }
          break;
        case 403:
          error.message = '拒绝访问(403)';
          break;
        case 404:
          error.message = '请求出错(404)';
          break;
        case 405:
          error.message = '请求方法未允许(405)';
          break;
        case 408:
          error.message = '请求超时(408)';
          break;
        case 500:
          error.message = '服务器错误(500)';
          break;
        case 501:
          error.message = '服务未实现(501)';
          break;
        case 502:
          error.message = '网络错误(502)';
          break;
        case 503:
          error.message = '服务不可用(503)';
          break;
        case 504:
          error.message = '网络超时(504)';
          break;
        case 505:
          error.message = 'HTTP版本不受支持(505)';
          break;
        default:
          error.message = `连接出错(${error.response.status})!`;
      }
    } else {
      error.message = '连接服务器失败!'
    }


    // if (error.response.status === 401 && !error.request._retry) {
    //   error.request._retry = true; // 防止重复刷新

    //   try {
    //     const response = await getRefresh({
    //       refresh_token: store.state.user.token.refresh_token
    //     });

    //     store.commit('user/setToken', {
    //       access_token: response.access,
    //       refresh_token: store.state.user.token.refresh_token
    //     });

    //     console.log('刷新令牌成功', response);
    //     console.log('重新发起请求');

    //     error.config.headers['Authorization'] = `Bearer ${store.state.user.token.access_token}`;

    //     return axios(error.config); // 使用新的访问令牌重新发起请求
    //   } catch (refreshError) {
    //     console.error('刷新令牌失败，需要重新登录', refreshError);

    //     // 清除 Vuex 中的令牌
    //     store.commit('user/setToken', { access_token: '', refresh_token: '' });

    //     // 提示用户重新登录
    //     ElMessage.error('您的会话已过期，请重新登录');

    //     // 执行退出登录操作
    //     store.commit('user/logout');

    //     // 重定向到登录页面
    //     // router.push('/login');
    //   } finally {
    //     delete error.request._retry; // 清除重试标志
    //   }
    // }
    return Promise.reject(error);//返回其它错误
  }
);
//导出axios实例
export default request

// 获取cookie的函数
function getCookie(name:string) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}