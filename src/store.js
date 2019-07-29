import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    userDataName: "",
    userDataMoney: "",
    userList: [],
    selectSendUserName: "",
    selectSendUserEmail: "",
    selectSendUserMoney: "",
    sendMoneyPrice: ""
  },
  mutations: {
    setLoginUser(state) {
      state.user = firebase.auth().currentUser;
    },
    setLoginUserDataName(state, name) {
      state.userDataName = name;
    },
    setLoginUserDataMoney(state, money) {
      state.userDataMoney = money;
    },
    setUserDataList(state, dataList) {
      state.userList = dataList;
    },
    setSelectSendUserName(state, sendUserName) {
      state.selectSendUserName = sendUserName;
    },
    setSelectSendUserEmail(state, sendUserEmail) {
      state.selectSendUserEmail = sendUserEmail;
    },
    setSelectSendUserMoney(state, sendUserMoney) {
      state.selectSendUserMoney = sendUserMoney;
    },
    setSendMoneyPrice(state, sendMoneyPrice) {
      state.sendMoneyPrice = sendMoneyPrice;
    }
  },
  actions: {
    // ログインしているユーザーデータの取得
    async getLoginUserData() {
      const userEmail = this.state.user.email;
      const firebaseDB = firebase.firestore();
      const getUserDB = firebaseDB.collection("users").doc(userEmail);
      const getUserData = await getUserDB.get();
      this.commit('setLoginUserDataName', getUserData.data().name);
      this.commit('setLoginUserDataMoney', getUserData.data().money);
    },
    // 全ユーザーデータの取得
    async getUserDataList() {
      const firebaseDB = firebase.firestore();
      const getUserDB = firebaseDB.collection("users");
      const getUserData = await getUserDB.get();
      let userDataList = [];
      getUserData.forEach(doc => {
        if (doc.id !== this.state.user.email) {
          userDataList.push(doc.data());
        }
      });
      this.commit('setUserDataList', userDataList);
    },
    // ウォレットを送信
    async sendWallet() {
      const firebaseDB = firebase.firestore();
      const getUserDB = firebaseDB.collection("users");
      const getUserData = await getUserDB.get();

      getUserData.forEach(doc => {
        if (this.state.selectSendUserName === doc.data().name) {
          this.commit("setSelectSendUserEmail", doc.id);
          this.commit("setSelectSendUserMoney", doc.data().money);
        }
      });

      // 選んだユーザーにウォレットを増やす
      const recipientUserDataArray = {
        money: Number(this.state.selectSendUserMoney) + Number(this.state.sendMoneyPrice),
        name: this.state.selectSendUserName
      };
      await getUserDB.doc(this.state.selectSendUserEmail).set(recipientUserDataArray);

      // 送る分のウォレットを自分のウォレットから減らす
      const sendUserDataArray = {
        money: Number(this.state.userDataMoney) - Number(this.state.sendMoneyPrice),
        name: this.state.userDataName
      };
      await getUserDB.doc(this.state.user.email).set(sendUserDataArray);

      // admin画面に必要な、データを再度firebaseから読み込み、vuexにデータを配置する
      this.commit("setLoginUser");
      this.dispatch("getUserDataList");
      this.dispatch("getLoginUserData");

    }
  },
})