<template>
	<div class="container background_color flex fc">
		<div class="page_title flex ac pl-18">
			<img class="logo mr-6" src="../../static/logo.png">
			<div class="fw-600 f20">德儿智能会议室管理平台</div>
		</div>
		<div class="flex-1 flex">
			<div class="left_menu">
				<div class="menu_item pointer pt-6 pr-6 pb-6 pl-6" v-for="(item,index) in menu_list" @click="checkMenu(index)">
					<div class="menu_content flex ac height-100 pl-26" :class="{'active_menu':active_index == index}">
						<img class="menu_icon mr-13" :src="item.active_icon" v-if="active_index == index">
						<img class="menu_icon mr-13" :src="item.icon" v-else>
						<div class="f20 fw-500" :class="{'primary_color':active_index == index}">{{item.name}}</div>
					</div>
				</div>
			</div>
			<div class="flex-1 pt-14 pl-20 pb-14 pr-20">
				<router-view></router-view>
			</div>
		</div>
	</div>
</template>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				menu_list:[],
				default_menu_list:[{
					icon:require('../../static/yyhy_icon.png'),
					active_icon:require('../../static/yyhy_active.png'),
					name:"预约会议",
					path:'/appointment'
				},{
					icon:require('../../static/hyjl_icon.png'),
					active_icon:require('../../static/hyjl_active.png'),
					name:"会议记录",
					path:'/record'
				}],							//路由地址
				admin_menu_list:[{
					icon:require('../../static/yyhy_icon.png'),
					active_icon:require('../../static/yyhy_active.png'),
					name:"预约会议",
					path:'/appointment'
				},{
					icon:require('../../static/hysgl_icon.png'),
					active_icon:require('../../static/hysgl_active.png'),
					name:"会议室管理",
					path:'/management'
				},{
					icon:require('../../static/hyjl_icon.png'),
					active_icon:require('../../static/hyjl_active.png'),
					name:"会议记录",
					path:'/record'
				},{
					icon:require('../../static/hytj_icon.png'),
					active_icon:require('../../static/hytj_active.png'),
					name:"会议统计",
					path:'/statistics'
				}],							//路由地址
				active_index:0,				//当前选中的路由下标
			}
		},
		created(){
			resource.getUserInfo().then(res => {
				if(res.data.code == 1){
					this.menu_list = res.data.data.user_type == 1?this.admin_menu_list:this.default_menu_list;

					if(this.$route.path == '/list' || this.$route.path == '/add'){
						if(res.data.data.user_type == 1){
							this.active_index = 1;
						}else{
							this.active_index = 0;
							this.$router.replace(this.menu_list[0].path);
						}
					}else{
						let active_index = this.menu_list.findIndex(item => {
							return item.path == this.$route.path			
						})
						this.active_index = active_index == -1?0:active_index;
						if(this.$route.path != this.menu_list[this.active_index].path){
							this.$router.replace(this.menu_list[this.active_index].path)
						}
					}
				}
			})
		},
		methods:{
			//切换左侧导航
			checkMenu(index){
				this.active_index = index;
				this.$router.push(this.menu_list[this.active_index].path)
			}
		}
	}
</script>
<style lang="less" scoped>
.page_title{
	border-bottom: 1px solid #E9ECF4;
	height: 86px;
	.logo{
		width: 22px;
		height: 22px;
	}
}
.left_menu{
	border-right: 1px solid #E9ECF4;
	width: 280px;
	.menu_item{
		height: 64px;
		.menu_content{
			.menu_icon{
				width: 20px;
				height: 21px;
			}
		}
		.active_menu{
			background-color: #E8EFFF;
			border-radius: 8px;
		}
	}
	
}
</style>