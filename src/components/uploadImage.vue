<template>
	<div class="image_list">
		<div class="view_card_img" @mouseenter="item.show_icon = true" @mouseleave="item.show_icon = false" v-for="(item,index) in preview_images" :key="index">
			<el-image class="card_img" :src="domain + item.urls" fit="scale-down"></el-image>
			<div class="delete_img" v-if="item.show_icon == true">
				<img class="delete_icon" src="../static/delete_icon.png" @click="deleteFile(item.urls,index)">
			</div>
		</div>
		<div class="upload_container" v-if="preview_images.length < max_num">
			<img class="upload_icon" src="../static/add_icon.png">
			<input type="file" ref="imgUpload" class="upload_file" accept="image/*" :multiple="is_multiple" @change="uploadFn">
		</div>
	</div>
</template>
<style lang="less" scoped>
.image_list {
	display: flex;
	flex-wrap: wrap;
	.view_card_img {
		margin-right: 10px;
		margin-bottom: 10px;
		border-radius: 2px;
		position: relative;
		width: 118px;
		height: 118px;
		.card_img,
		.delete_img {
			border-radius: 2px;
			position: absolute;
			width: 100%;
			height: 100%;
		}
		.delete_img {
			background: rgba(0, 0, 0, 0.5);
			display: flex;
			align-items: center;
			justify-content: center;
			.delete_icon {
				width: 28px;
				height: 28px;
			}
		}
	}
	.upload_container{
		border:1px solid #D9D9D9;
		width: 118px;
		height: 118px;
		border-radius: 2px;
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content:center;
		align-items:center;
		color: #666666;
		.upload_icon{
			width: 32px;
			height: 32px;
		}
		.upload_file {
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			width: 100%;
			height: 100%;
			opacity: 0;
		}
	}
}
</style>
<script>
	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				preview_images:[],		//当前的图片列表
			}
		},
		computed:{
			//图片前缀
			domain(){
				return this.$store.state.domain;
			}
		},
		props:{
			img_list:{
				type:Array,
				default:() => []
			},
			//是否多选
			is_multiple:{
				type:Boolean,
				default:false
			},
			//多选已上传的数量
			current_num:{
				type:Number,
				default:0
			},
			//多选最多上传的数量
			max_num:{
				type:Number,
				default:1
			}
		},
		created(){
			this.preview_images = this.img_list;
		},
		methods:{
			// 上传图片
			uploadFn(){
				if (this.$refs.imgUpload.files.length > 0) {
					let files = this.$refs.imgUpload.files;
					//判断是否多选
					if(this.is_multiple == true){
						if(this.current_num + this.$refs.imgUpload.files.length > this.max_num){
							this.$refs.imgUpload.value = null;
							this.$message.warning(`图片最多不超过${this.max_num}张`);
							return;
						}
					}
					for(var i = 0;i < files.length;i ++){
						let arg = {
							image:files[i],
							type:'1'
						}
						resource.uploadFile(arg).then(res => {
							this.$refs.imgUpload.value = null;
							if(res.data.code == 1){
								let file = res.data.data;
								file.show_icon = false;
								this.preview_images.push(file);
								//向父组件传递已选的图片列表
								this.emitFn();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}
				}
			},
    		//删除文件
    		deleteFile(url, index) {
    			let arg = {
    				url: url,
    			};
    			resource.deleteFile(arg).then((res) => {
    				if (res.data.code == 1) {
    					this.preview_images.splice(index, 1);
    					//向父组件传递已选的图片列表
    					this.emitFn();
    				} else {
    					this.$message.warning(res.data.msg);
    				}
    			});
    		},
    		//向父组件传递已选的图片列表
    		emitFn(){
    			let image_arr = [];
    			this.preview_images.map(item => {
    				image_arr.push(item.urls);
    			})
    			this.$emit('callbackFn',image_arr);
    		}
    	}
    }
</script>