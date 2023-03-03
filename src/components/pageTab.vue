<template>
	<div class="page_tab white_back pl-22 flex mb-6">
		<div class="tab_item mr-60 relative pointer" v-for="(item,index) in tab_list" @click="checkTab(item,index)">
			<div class="f14 fw-500" :class="{'active_tab_color':active_index == index}">{{item.name}}</div>
			<div class="active_line absolute bottom-0 width-100" v-if="active_index == index"></div>
		</div>
	</div>
</template>
<script>
	export default{
		data(){
			return{
				active_index:0
			}
		},
		props:{
			//导航列表
			tab_list:{
				type:Array,
				default:[]
			}
		},
		methods:{
			//切换tab
			checkTab(item,index){
				this.active_index = index;
				this.$emit('checkTab',item)
			}
		}
	}
</script>
<style lang="less" scoped>
.page_tab{
	height: 38px;
	.tab_item{
		height: 38px;
		line-height: 38px;
		.active_tab_color{
			color: #767EFF;
		}
		.active_line{
			background-color: #767EFF;
			height: 1.75px;
		}
	}
}
</style>