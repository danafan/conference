<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
  import * as dd from 'dingtalk-jsapi';
  import resource from './api/resource.js'
  export default {
    created() {
      // let user_info = {
      //   user_id: '8318',
      //   real_name:"范玉龙",
      //   user_type:0
      // }
      // this.$store.commit('setUserInfo',user_info);

      // this.$router.replace('/index');
      // return


      //获取钉钉鉴权参数
      this.getConfig();
    },
    watch:{
      $route:function(n,o){
        document.title = n.name;
      }
    },
    methods: {
      //获取钉钉鉴权参数
      getConfig(){
        resource.getConfig().then(res => {
          if(res.code == 1){
            let data = res.data;
            //钉钉鉴权
            this.dingAuth(data);
          }
        })
      },
      //钉钉鉴权
      dingAuth(data){
        resource.dingAuth(data).then(res => {
          //钉钉鉴权
          this.ddConfig(res.data);
        })
      },
      //钉钉鉴权
      ddConfig(data){
        dd.config({
          agentId: data.agentId, // 必填，微应用ID
          corpId: data.crop_id,//必填，企业ID
          timeStamp: data.timeStamp, // 必填，生成签名的时间戳
          nonceStr: data.nonceStr, // 必填，自定义固定字符串。
          signature: data.signature, // 必填，签名
          jsApiList : [
          'biz.contact.complexPicker'
          ] // 必填，需要使用的jsapi列表，注意：不要带dd。
        });
        dd.error(function (err) {
          alert('dd error: ' + JSON.stringify(err));
        })
        //钉钉获取code
        this.getDingCode(data.crop_id);
      },
      //钉钉获取code
      getDingCode(crop_id){
        dd.ready(() => {
          dd.runtime.permission.requestAuthCode({
            corpId: crop_id, 
            onSuccess:  (info) => {
              let code = info.code // 通过该免登授权码可以获取用户身份
              //登录
              this.login(code);
            }});
        });
      },
      //登录
      login(code){
        resource.login({code:code}).then(res => {
          if(res.code == 1){
            this.$store.commit('setUserInfo',res.data.data);
            this.$store.commit('setDomain',res.data.data.domain);
            localStorage.setItem("domain",res.data.data.domain);
            this.$router.replace('/index')
          }
        })
      }


    }
  };
</script>