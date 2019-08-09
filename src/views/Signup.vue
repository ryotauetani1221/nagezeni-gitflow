<template>
  <div class="signup">
    <h1>新規登録画面</h1>
    <form @submit.prevent="signup">
      <div>
        <label>
          <b>ユーザー名</b>
          <input type="text" placeholder="Username" v-model="userName" />
        </label>
      </div>
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
        <input type="submit" value="新規登録" />
      </div>
      <router-link to="/">ログインはこちらから</router-link>
    </form>
  </div>
</template>

<script>
import firebase from "firebase";
import { firebaseDB } from "../plugin/firebase.js";
export default {
  name: "Login",
  data: function() {
    return {
      userName: "",
      userMail: "",
      userPassword: ""
    };
  },
  methods: {
    async signup() {
      const firebaseSignup = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.userMail, this.userPassword)
        .catch(err => alert(err));
      if (firebaseSignup && firebaseSignup.operationType === "signIn") {
        console.log("Create account: ", firebaseSignup.user.email);
        firebaseDB.collection("users").add({
          user_id: firebaseSignup.user.uid,
          name: this.userName
        });
        firebaseDB.collection("wallet").add({
          user_id: firebaseSignup.user.uid,
          wallet: 500
        });
        this.$router.push("/admin");
      }
    }
  }
};
</script>

<style scoped>
.signup {
  text-align: center;
}
</style>