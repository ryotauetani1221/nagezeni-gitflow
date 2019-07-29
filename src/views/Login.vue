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
import firebase from "firebase";
export default {
  name: "Login",
  data: function() {
    return {
      userMail: "",
      userPassword: ""
    };
  },
  methods: {
    login: function() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.userMail, this.userPassword)
        .then(user => {
          console.log(user);
          this.$router.push("/admin");
        })
        .catch(error => {
          alert(error.message);
        });
    }
  }
};
</script>

<style scoped>
.login {
  text-align: center;
}
</style>