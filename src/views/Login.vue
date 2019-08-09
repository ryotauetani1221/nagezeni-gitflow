<template>
  <div class="login">
    <h1>ログイン画面</h1>
    <form @submit.prevent="login">
      <div>
        <label>
          <b>メールアドレス</b>
          <input type="text" placeholder="Username" v-model="userMail" />
        </label>
      </div>
      <div>
        <label>
          <b>パスワード</b>
          <input type="password" placeholder="Password" v-model="userPassword" />
        </label>
      </div>
      <div>
        <input type="submit" value="ログイン" />
      </div>
      <router-link to="/signup">新規登録はこちらから</router-link>
    </form>
  </div>
</template>

<script>
import { firebaseAuth } from "../plugin/firebase";
export default {
  name: "Login",
  data: function() {
    return {
      userMail: "",
      userPassword: ""
    };
  },
  methods: {
    async login() {
      const firebaseLogin = await firebaseAuth
        .signInWithEmailAndPassword(this.userMail, this.userPassword)
        .catch(error => alert(error.message));
      if (firebaseLogin && firebaseLogin.operationType === "signIn") {
        this.$router.push("/admin");
      }
    }
  }
};
</script>

<style scoped>
.login {
  text-align: center;
}
</style>