import Vue from 'vue'
import Vuex from 'vuex'
import './plugin/firebase'
import { firebaseDB , firebaseAuth } from "./plugin/firebase.js";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    userDataId: "",
    userDataName: "",
    userDataWallet: "",
    userList: [],
    selectSendUserId: "",
  },
  mutations: {
    setLoginUser(state) {
      state.user = firebaseAuth.currentUser;
    },
    setLoginUserDataId(state, id) {
      state.userDataId = id;
    },
    setLoginUserDataName(state, name) {
      state.userDataName = name;
    },
    setLoginUserDataWallet(state, wallet) {
      state.userDataWallet = wallet;
    },
    setUserDataList(state, dataList) {
      state.userList = dataList;
    },
    setSelectSendUserId(state, sendUserId) {
      state.selectSendUserId = sendUserId;
    },
    setSendWalletPrice(state, sendWalletPrice) {
      state.sendWalletPrice = sendWalletPrice;
    }
  },
  actions: {
    // 全部のデータ取得、ログインしているユーザーデータの取得
    async startVuexGetData() {

      this.commit('setLoginUserDataId', this.state.user.uid);

      let userIdList = [];
      let userNameList = [];
      const snapShotUsers = await firebaseDB.collection("users").get();
      snapShotUsers.forEach(doc => {
        userNameList.push(doc.data().name);
        userIdList.push(doc.data().user_id);
        if (this.state.user.uid === doc.data().user_id) {
          this.commit('setLoginUserDataName', doc.data().name);
        }
      });

      let userWalletList = [];
      const snapShotWallet = await firebaseDB.collection("wallet").get();
      snapShotWallet.forEach(doc => {
        userWalletList.push(doc.data().wallet);
        if (this.state.user.uid === doc.data().user_id) {
          this.commit('setLoginUserDataWallet', doc.data().wallet);
        }
      });

      let userDataList = [];
      for (let i = 0; i < userNameList.length; i++) {
        userDataList[i] = {
          id: userIdList[i],
          name: userNameList[i],
          wallet: userWalletList[i],
        };
      }

      this.commit('setUserDataList', userDataList);
    },
    // ウォレットを送信
    async sendWallet({ state, commit, dispatch }, data) {

      console.log(state);
      console.log(commit);
      console.log(dispatch);

      const sendWalletPrice = data.sendWalletPrice;
      let sendUserOldWallet;
      this.state.userList.forEach(item => {
        if (this.state.selectSendUserId === item.id) {
          this.commit("setSelectSendUserId", item.id);
          sendUserOldWallet = item.wallet;
        }
      });


      const firebaseWallet = await firebaseDB.collection("wallet").get();

      let recipientUserCollection;
      let sendUserCollection;
      firebaseWallet.forEach(doc => {
        if (this.state.selectSendUserId === doc.data().user_id) {
          recipientUserCollection = doc.id;
        }
        if (this.state.userDataId === doc.data().user_id) {
          sendUserCollection = doc.id;
        }
      });

      // 送る分のウォレットを相手のデータに加える
      const recipientUserDataArray = {
        wallet: Number(sendUserOldWallet) + Number(sendWalletPrice),
        user_id: this.state.selectSendUserId
      };
      await firebaseDB.collection("wallet").doc(recipientUserCollection).set(recipientUserDataArray);

      // 送る分のウォレットを自分のウォレットから減らす
      const sendUserDataArray = {
        wallet: Number(this.state.userDataWallet) - Number(sendWalletPrice),
        user_id: this.state.userDataId
      };
      await firebaseDB.collection("wallet").doc(sendUserCollection).set(sendUserDataArray);

      // admin画面に必要な、データを再度firebaseから読み込み、vuexにデータを再配置する
      this.commit("setLoginUser");
      this.dispatch("startVuexGetData");

    }
  },
})