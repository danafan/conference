<template>
	<div class="flex ac mr-25">
		<img class="ty_icon mr-6" src="../static/ty_icon.png" v-if="type == '1'">
		<div class="f16" v-if="type == '1'">投影</div>

		<img class="bb_icon mr-6" src="../static/bb_icon.png" v-if="type == '2'">
		<div class="f16" v-if="type == '2'">白板</div>

		<img class="tv_icon mr-6" src="../static/tv_icon.png" v-if="type == '3'">
		<div class="f16" v-if="type == '3'">电视</div>

		<img class="kt_icon mr-6" src="../static/kt_icon.png" v-if="type == '4'">
		<div class="f16" v-if="type == '4'">空调</div>
	</div>
</template>
<script>
	export default{
		props:{
			//类型（1:投影；2:白板；3:电视；4:空调）
			type:{
				type:String,
				default:''
			}
		}
	}
</script>
<style lang="less" scoped>
.ty_icon{
	width: 28px;
	height: 23px;
}
.bb_icon{
	width: 28px;
	height: 22px;
}
.tv_icon{
	width: 24px;
	height: 23px;
}
.kt_icon{
	width: 24px;
	height: 22px;
}
</style>