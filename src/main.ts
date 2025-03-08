// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import './styles/reset.scss'
//Element Plus消息弹出框样式
// import "element-plus/theme-chalk/el-loading.css";
// import "element-plus/theme-chalk/el-message.css";
// import "element-plus/theme-chalk/el-notification.css";
// import "element-plus/theme-chalk/el-message-box.css";
//vuex状态库
import { store } from './store'
import { useDebounceDirective,useThrottleDirective } from "@/utils";

//导入axios实例
import request from './utils/request';

const app = createApp(App)

//全局使用axios
//配置请求头，非常重要，有了这个才可以正常使用POST等请求后台数据
// Axios.defaults.headers.post['Content-Type'] = 'application/x-www-fromurlencodeed'
// axios.defaults.xsrfCookieName = 'csrfmiddlewaretoken';
// axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
// 跨域携带cookie
// axios.defaults.withCredentials = true;
// app.config.globalProperties.$axios = axios;

// 挂载axios实例到Vue原型上，使其在组件中可用
app.config.globalProperties.$request = request;


app.use(router)
app.use(store)
// 注册全局防抖指令
app.directive('debounceClick', useDebounceDirective(500));
// 注册全局节流指令
app.directive('throttleClick', useThrottleDirective(500));


app.mount('#app')
