<template>
	<div class="flex fc height-100">
		<PageTab :tab_list="tab_list" @checkTab="checkTab"/>
		<div class="flex-1 pb-14 scroll-y hide_scrollbar">
			<router-view v-if="isRouterAlive"></router-view>
		</div>
	</div>
</template>
<script>
	import PageTab from '../../components/pageTab.vue'
	export default{
		provide () {
			return {
				reload: this.reload
			}
		},
		data(){
			return {
				isRouterAlive: true,
				tab_list:[{
					name:'会议室管理',
					path:'/list',
					id:'0'
				},{
					name:'添加会议室',
					path:'/add',
					id:'1'
				}],						//导航列表
			}
		},
		created(){
			this.$router.push(this.tab_list[0].path);
		},
		methods:{
			//单独页面刷新
			reload () {
				this.isRouterAlive = false
				this.$nextTick( () => {
					this.isRouterAlive = true
				})
			},
			//切换导航
			checkTab(item){
				this.$router.push(item.path);
			}
		},
		components:{
			PageTab
		}
	}
</script>
<style lang="less" scoped>

</style>