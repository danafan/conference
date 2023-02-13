<template>
	<el-card class="flex-1 flex fc ac jsc" v-loading="loading">
		<img class="empty_icon" src="../static/empty_icon.png" v-show="!loading">
		<div class="toast f14 fw-500 mt-90" v-show="!loading">暂无数据</div>
	</el-card>
</template>
<script>
	export default{
		props:{
			//加载状态
			loading:{
				type:Boolean,
				default:true
			}
		}
	}
</script>
<style lang="less" scoped>
	.empty_icon{
		width: 385px;
		height: 264px;
	}
	.toast{
		width: 100%;
		text-align: center;
	}
</style>