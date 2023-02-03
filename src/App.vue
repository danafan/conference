<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  export default {
    created() {
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