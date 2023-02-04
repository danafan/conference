<template>
	<div class="box mr-16 flex ac jc">
		<img class="default_icon" src="../static/default_icon.png" v-if="info.image == ''">
		<img class="container" src="../static/default_icon.png" v-else>
	</div>
</template>
<script>
	export default{
		props:{
			//图片地址
			info:{
				type: Object,
				default:{}
			}
		}
	}
</script>
<style lang="less" scoped>
.box{
	width: 150px;
	height: 150px;
	background: #E8EFFF;
	border-radius: 6px;
	.default_icon{
		width: 95px;
		height: 88px;
	}
}
</style>