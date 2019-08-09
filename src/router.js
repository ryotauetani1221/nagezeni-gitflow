import Vue from 'vue'
import Router from 'vue-router'
import Admin from './views/Admin.vue'
import Login from './views/Login.vue'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/signup',
      name: 'signup',
      component: Signup,
    },
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/admin',
      name: 'admin',
      component: Admin,
      meta: { requiresAuth: true }
    },
  ]
})