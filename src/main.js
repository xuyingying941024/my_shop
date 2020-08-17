import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
// 引入字体图标文件
import './assets/fonts/iconfont.css';
// 设置请求拦截器
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config
});
// 把axios挂载到vue原型对象的$http属性上
Vue.prototype.$http = axios;
// 设置请求根路径
Vue.prototype.$http.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';

Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
