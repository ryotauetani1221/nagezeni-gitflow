<template>
  <div class="admin">
    <div>
      <span>{{computedGetLoginUserDataName}}さんようこそ！</span>
      <span style="float:right;">残高：{{computedGetLoginUserDataWallet}}</span>
    </div>
    <h1>ユーザー一覧</h1>
    <table>
      <tr>
        <th>ユーザー名</th>
      </tr>
      <tr v-for="(item,index) in computedGetUserDataList" :key="item.name">
        <td>{{item.name}}</td>
        <td>
          <button @click="showWallet(index)">Walletを見る</button>
        </td>
        <td>
          <button @click="showSendWallet(item.id)">送る</button>
        </td>
      </tr>
    </table>
    <div class="fixedWrap" v-show="isShowSelectWallet">
      <div class="fixedBg" @click="closeWallet"></div>
      <div class="showWallet">
        <p>{{selectUserName}}の残高</p>
        <p>{{selectUserWallet}}</p>
        <button @click="closeWallet">close</button>
      </div>
    </div>
    <div class="fixedWrap" v-show="isShowSendWallet">
      <div class="fixedBg" @click="closeSendWallet"></div>
      <div class="showWallet">
        <p>あなたの残高：{{computedGetLoginUserDataWallet}}</p>
        <p>送る金額↓</p>
        <p>
          <input type="text" v-model="sendWalletPrice" />
          <button @click="sendWallet">送信</button>
        </p>
        <button @click="closeSendWallet">閉じる</button>
      </div>
    </div>
    <br />
    <br />
    <br />
    <button @click="logout">ログアウト</button>
  </div>
</template>

<style>
.admin {
  margin: 0 auto;
  max-width: 1080px;
}
.fixedBg {
  background: rgba(0, 0, 0, 0.4);
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.showWallet {
  position: fixed;
  z-index: 100;
  width: 300px;
  height: fit-content;
  padding: 20px;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  background-color: #fff;
}
</style>


<script>
import { firebaseAuth } from "../plugin/firebase";
export default {
  name: "Admin",
  data: function() {
    return {
      isShowSendWallet: false,
      isShowSelectWallet: false,
      selectUserWallet: "",
      selectUserName: "",
      sendWalletPrice: ""
    };
  },
  computed: {
    computedGetUserDataList: function() {
      return this.$store.state.userList;
    },
    computedGetLoginUserDataName: function() {
      return this.$store.state.userDataName;
    },
    computedGetLoginUserDataWallet: function() {
      return this.$store.state.userDataWallet;
    }
  },
  async created() {
    this.$store.commit("setLoginUser");
    this.$store.dispatch("startVuexGetData");
  },
  methods: {
    showWallet: function(index) {
      this.isShowSelectWallet = true;
      this.selectUserName = this.computedGetUserDataList[index].name;
      this.selectUserWallet = this.computedGetUserDataList[index].wallet;
    },
    closeWallet: function() {
      this.isShowSelectWallet = false;
    },
    showSendWallet: function(sendId) {
      this.isShowSendWallet = true;
      this.$store.commit("setSelectSendUserId", sendId);
    },
    closeSendWallet: function() {
      this.isShowSendWallet = false;
    },
    sendWallet: function() {
      this.isShowSendWallet = false;
      this.$store.dispatch("sendWallet", {
        sendWalletPrice: this.sendWalletPrice
      });
    },
    async logout() {
      await firebaseAuth
        .signOut()
        .catch(error =>
          console.log(`ログアウト時にエラーが発生しました (${error})`)
        );
      // ログアウト後のtopページへの遷移は、main.jsが担当
    }
  }
};
</script>