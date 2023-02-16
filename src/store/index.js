import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    appId:"", 
    corpId:"",
    domain:localStorage.getItem("domain")?localStorage.getItem("domain"):"",
    userInfo:{},
  },
  mutations: {
    //设置appId
    setCorpId(state, corpId){
      state.corpId = corpId;
    },
    //设置appId
    setAppId(state, appId){
      state.appId = appId;
    },
    //设置图片前缀
    setDomain(state, domain){
      state.domain = domain;
    },
    //用户信息
    setUserInfo (state, info) {  
      state.userInfo = info;
    },
  },
  actions: {
    
  }
});
export default store;
