// import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
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

// 挂载axios实例到Vue原型上，使其在组件中可用
app.config.globalProperties.$request = request;


app.use(router)
app.use(store)
// 注册全局防抖指令
app.directive('debounce', useDebounceDirective(500));
// 注册全局节流指令
app.directive('throttle', useThrottleDirective(500));


app.mount('#app')
