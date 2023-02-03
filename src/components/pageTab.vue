<template>
	<el-card shadow="never" class="tab_card mt-10">
		<div class="flex">
			<div class="tab_item mr-60 relative pointer" v-for="(item,index) in tab_list" @click="checkTab(index,item.id)">
				<div class="f16 fw-500" :class="{'primary_color':active_index == index}">{{item.name}}</div>
				<div class="active_line absolute bottom-0 width-100" v-if="active_index == index"></div>
			</div>
		</div>
	</el-card>
</template>
<script>
	export default{
		data(){
			return{
				active_index:0
			}
		},
		props:{
			//当前选中的下标
			// active_index:{
			// 	type:Number,
			// 	default:0
			// },
			//导航列表
			tab_list:{
				type:Array,
				default:[]
			}
		},
		methods:{
			//切换tab
			checkTab(index,id){
				this.active_index = index;
				this.$emit('checkTab',id)
			}
		}
	}
</script>
<style lang="less" scoped>
.tab_item{
 	height: 40px;
 	.active_line{
 		background-color: #2A37FD;
 		height: 1.75px;
 	}
}
</style>