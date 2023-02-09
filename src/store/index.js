import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    domain:localStorage.getItem("domain")?localStorage.getItem("domain"):"",
    userInfo:{},
  },
  mutations: {
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
