import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import Welcome from '../views/Welcome'
import Users from '../views/user/Users'
import '../assets/global.css'

Vue.use(VueRouter)

  const routes = [
    { path: '/', component: Login },
    { path: '/login', component: Login },
    { path: '/home', component: Home, redirect: '/welcome',
      children:[
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
      ]
    }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if(to.path === '/login') return next();
  const tokenStr =  window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login');
  next();
})
export default router
