import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyB7vjVp-_PxmWDDqtg1R_wSy27031iUehs",
  authDomain: "vue-nagezeni.firebaseapp.com",
  databaseURL: "https://vue-nagezeni.firebaseio.com",
  projectId: "vue-nagezeni",
  storageBucket: "",
  messagingSenderId: "764937800237",
  appId: "1:764937800237:web:a0be24a8f5cdefa5"
};
firebase.initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
