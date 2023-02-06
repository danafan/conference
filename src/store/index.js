import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    domain:localStorage.getItem("domain")?localStorage.getItem("domain"):"",
  },
  mutations: {
    //设置图片前缀
    setDomain(state, domain){
      state.domain = domain;
    }
  },
  actions: {
    
  }
});
export default store;
