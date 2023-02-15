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
      resource.getUserInfo().then(res => {
        if(res.data.code == 1){
          this.$store.commit('setUserInfo',res.data.data);

          this.$store.commit('setDomain',res.data.data.domain);
          localStorage.setItem("domain",res.data.data.domain);

          // if(this.$route.path == '/'){
          //   this.$router.replace('/index')
          // }

          //获取钉钉鉴权参数
          this.getConfig(1);
        }else{
          //获取钉钉鉴权参数
          this.getConfig(0);
        }
      })
    },
    watch:{
      $route:function(n,o){
        document.title = n.name;
      }
    },
    methods: {
      //获取钉钉鉴权参数
      getConfig(type){
        resource.getConfig().then(res => {
          if(res.data.code == 1){
            let data = res.data.data;
            //钉钉鉴权
            this.dingAuth(data,type);
          }
        })
      },
      //钉钉鉴权
      dingAuth(data,type){
        resource.dingAuth(data).then(res => {
          //钉钉鉴权
          this.ddConfig(res.data.data,type);
        })
      },
      //钉钉鉴权
      ddConfig(data,type){
        dd.config({
          agentId: data.agentId, // 必填，微应用ID
          corpId: data.corpId,//必填，企业ID
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
        if(type == 1){    //已登录
          if(this.$route.path == '/'){
            this.$router.replace('/index')
          }
        }else{            //未登录
          //钉钉获取code
          this.getDingCode(data.corpId);
        }
        
      },
      //钉钉获取code
      getDingCode(corpId){
        dd.ready(() => {
          dd.runtime.permission.requestAuthCode({
            corpId: corpId, 
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
          if(res.data.code == 1){
            this.$store.commit('setUserInfo',res.data.data);
            this.$store.commit('setDomain',res.data.data.domain);
            localStorage.setItem("domain",res.data.data.domain);
            this.$router.replace('/index');
          }
        })
      }


    }
  };
</script>