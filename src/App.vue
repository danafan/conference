<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import * as dd from 'dingtalk-jsapi';
  export default {
    created() {
      let domain = 'http://img.92nu.com/';
      this.$store.commit('setDomain',domain);
      localStorage.setItem("domain",domain);

      this.$router.replace('/index');
    },
    watch:{
      $route:function(n,o){
        document.title = n.name;
      }
    },
    methods: {

    }
  };
</script>