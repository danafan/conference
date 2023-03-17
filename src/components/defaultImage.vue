<template>
	<div class="image_box relative mr-10">
		<!-- <img class="default_icon" src="../static/default_icon.png" v-if="info.image == ''">
			<img class="container" src="../static/default_icon.png" v-else> -->
			<!-- <img class="container" :src="domain + info.meeting_image"> -->
			<el-image class="container radius" :src="domain + info.meeting_image" fit="cover"></el-image>
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
			},
			computed:{
				//图片前缀
				domain(){
					return this.$store.state.domain;
				}
			},
		}
	</script>
	<style lang="less" scoped>
	.image_box{
		width: 120px;
		height: 110px;
	// background: #E8EFFF;
	border-radius: 6px;
	// .default_icon{
	// 	width: 95px;
	// 	height: 88px;
	// }
	.radius{
		border-radius: 6px;
	}
}
</style>