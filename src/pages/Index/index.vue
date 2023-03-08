<template>
	<div class="container background_color flex fc pt-10 pl-8 pb-10 pr-8">
		<div class="tab_menu white_back flex pl-34 mb-6">
			<div class="menu_item pointer relative mr-100" v-for="(item,index) in menu_list" @click="checkMenu(index)">
				<div class="height-100 flex ac jsa">
					<img class="menu_icon mr-13" :src="item.active_icon" v-if="active_index == index">
					<img class="menu_icon mr-13" :src="item.icon" v-else>
					<div class="f16 bold space_nowrap" :class="{'primary_color':active_index == index}">{{item.name}}</div>
				</div>
				<div class="active_line active_background width-100 absolute bottom-0 left-0" v-if="active_index == index"></div>
			</div>
		</div>
		<div class="flex-1">
			<router-view></router-view>
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
					icon:require('../../static/hyjl_icon.png'),
					active_icon:require('../../static/hyjl_active.png'),
					name:"会议记录",
					path:'/record'
				},{
					icon:require('../../static/hytj_icon.png'),
					active_icon:require('../../static/hytj_active.png'),
					name:"会议统计",
					path:'/statistics'
				},{
					icon:require('../../static/hysgl_icon.png'),
					active_icon:require('../../static/hysgl_active.png'),
					name:"会议室管理",
					path:'/management'
				},{
					icon:require('../../static/authority_icon.png'),
					active_icon:require('../../static/authority_active.png'),
					name:"权限管理",
					path:'/authority'
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
.tab_menu{
	height: 48px;
	.menu_item{
		height: 48px;
		.menu_icon{
			width: 17px;
			height: 17px;
		}
		.active_line{
			height: 1px;
		}
	}
	
}
</style>