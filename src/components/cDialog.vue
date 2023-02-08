<template>
	<el-dialog :width="width" :close-on-click-modal="false" :append-to-body="append" :visible.sync="show_dialog" @close="closeDialog">
		<div slot="title" class="dialog_title">
			<div>{{title}}</div>
			<img class="close_icon" src="../static/close_icon.png" @click="show_dialog = false">
		</div>
		<slot></slot>
		<div slot="footer" class="dialog_footer" v-if="footer">
			<el-button size="small" @click="$emit('cancleFn')" v-if="cancel">{{cancelText}}</el-button>
			<el-button size="small" type="primary" @click="$emit('confirmFn')" v-if="confirm">{{confirmText}}</el-button>
		</div>
	</el-dialog>
</template>
<script>
	export default{
		data(){
			return{
				show_dialog:false,			//是否显示
			}
		},
		props:{
			append:{
				type:Boolean,
				default:false
			},
			//标题
			title:{
				type:String,
				default:""
			},
			//弹窗宽度
			width:{
				type:String,
				default:"65%"
			},
			//弹窗脚部是否显示
			footer:{
				type:Boolean,
				default:true
			},
			//是否显示取消按钮
			cancel:{
				type:Boolean,
				default:true
			},
			//取消按钮文字
			cancelText:{
				type:String,
				default:"取消"
			},
			//确认按钮是否显示
			confirm:{
				type:Boolean,
				default:true
			},
			//确认按钮文字
			confirmText:{
				type:String,
				default:"确认"
			},
		},
		methods:{
			//关闭回调
			closeDialog(){

			},
			//点击确认
			confirmDialog(){

			}
		}
	}
</script>
<style>
.el-dialog__header {
	border-bottom:1px solid rgba(0,0,0,0.06) !important;
	padding: 0 0 !important;
}
.el-dialog__footer{
	border-top:1px solid rgba(0,0,0,0.06) !important;
	padding: 10px 20px 10px !important;
}
</style>
<style lang="less" scoped>
.dialog_title{
	background-color: #F5F7FB;
	height: 56px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	color: #000000;
	font-size: 16px;
	font-weight: 500;
	padding-left: 20px;
	padding-right: 20px;
}
.close_icon{
	cursor: pointer;
	width: 16px;
	height: 16px;
}
</style>