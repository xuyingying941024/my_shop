import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Home from '../views/Home'
import '../assets/global.css'

Vue.use(VueRouter)

  const routes = [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
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
