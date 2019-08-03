import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugin/firebase'
import { firebaseAuth } from "./plugin/firebase.js";

Vue.config.productionTip = false


// ログインしていないのに「/admin」にアクセスされたら「/」へリダイレクト
router.beforeEach((to, from, next) => {
  let requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requiresAuth) {
    firebaseAuth.onAuthStateChanged(function (user) {
      if (user) {
        // ログインしている
        next()
      } else {
        next({
          path: '/',
        })
      }
    })
  } else {
    next()
  }
})
export default router


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')