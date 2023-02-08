<template>
	<div>
		<el-card class="mb-10" shadow="hover">
			<div class="flex">
				<DefaultImage :info="info"/>
				<div class="flex-1 flex fc jsb">
					<!-- 名称 -->
					<div class="f20 fw-600">{{info.meeting_room_name}}</div>
					<!-- 设备 -->
					<div class="f16" v-if="type == 1 || type == 2">{{info.equipment_str}}</div>
					<!-- 人数 -->
					<div class="flex ac" v-if="type == 1 || type == 2">
						<img class="people_icon mr-6" src="../static/people_icon.png">
						<div class="f26">{{info.limit_num}}人</div>
					</div>
					<!-- 地址 -->
					<div class="flex ac">
						<img class="position_icon mr-6" src="../static/position_icon.png">
						<div class="f26">{{info.meeting_address}}</div>
					</div>
					<!-- 时间 -->
					<div class="flex ac">
						<img class="time_icon mr-6" src="../static/time_icon.png">
						<div class="f26">{{info.time}}</div>
					</div>
				</div>
				<!-- 会议室管理 -->
				<div class="flex ac" v-if="type == 2">
					<el-button type="text" @click="editMetting">编辑</el-button>
					<el-button type="text" @click="updateFn(info.status == 1?2:1,info.status == 1?'禁用':'启用')">{{info.status == 1?'禁用':'启用'}}</el-button>
					<el-button type="text" @click="updateFn(0,'删除')">删除</el-button>
				</div>
				<!-- 会议记录 -->
				<div class="flex ac" v-if="type == 3">
					<el-button type="text" @click="$refs.CDialog.show_dialog = true" v-if="info.status == 1">取消日程</el-button>
					<el-button type="text" @click="getDetail">会议详情</el-button>
				</div>
			</div>
			<SelectTime :info="info" v-if="type == '1'" @reloadFn="$emit('reload')"/>
		</el-card>
		<!-- 编辑 -->
		<c-dialog title="编辑会议室" @cancleFn="$refs.CDialog.show_dialog = false" @confirmFn="confirmFn" ref="CDialog">
			<Add ref="add" :isEdit="true" :info="detail_info"/>
		</c-dialog>
		<!-- 取消日程 -->
		<c-dialog title="取消日程" cancelText="暂不" @cancleFn="$refs.CDialog.show_dialog = false" @confirmFn="confirmCancel" ref="CDialog">
			<div class="f16">
				<div class="mb-10">会议室：{{info.meeting_room_name}}</div>
				<div>时间：{{info.time}}</div>
			</div>
		</c-dialog>
		<!-- 会议详情 -->
		<c-dialog title="会议详情" :footer="false" ref="dDialog">
			<div class="f16">
				<div class="fw-500 mb-15">{{detail_info.meeting_title}}</div>
				<div class="mb-15">{{detail_info.time}}</div>
				<div class="mb-15">{{detail_info.admin_name}}（组织人）</div>
				<el-divider></el-divider>
				<div class="fw-500">会议纪要</div>
				<!-- 未结束 -->
				<div>
					<el-button type="text">添加附件</el-button>
				</div>
				
			</div>
		</c-dialog>

	</div>
</template>
<script>
	import {filterMeetingTime} from '../utils.js'

	import DefaultImage from '../components/defaultImage.vue'
	import SelectTime from '../components/selectTime.vue'
	import CDialog from '../components/cDialog.vue'
	import Add from '../pages/Management/pages/add.vue'

	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				detail_info:{},			//获取的详情
				show_drawer:false,		//会议详情弹窗
			}
		},
		props:{
			//类型（1:预约会议;2:会议室管理列表;3:会议记录）
			type:{
				type: String,
				default:''
			},
			//每一条的数据
			info:{
				type: Object,
				default:{}
			}
		},
		methods:{
			//点击编辑
			editMetting(){
				resource.editMettingRoomGet({meeting_room_id:this.info.meeting_room_id}).then(res => {
					if(res.data.code == 1){
						this.detail_info = res.data.data;
						this.$refs.CDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//确认编辑
			confirmFn(){
				if(this.$refs.add.meeting_room_name == ''){
					this.$message.warning('请输入会议室名称！');
				}else if(this.$refs.add.meeting_image == ''){
					this.$message.warning('请上传会议室图片！');
				}else if(this.$refs.add.meeting_address == ''){
					this.$message.warning('请输入会议室地点！');
				}else{
					let arg = {
						meeting_room_id:this.info.meeting_room_id,
						meeting_room_name:this.$refs.add.meeting_room_name,
						meeting_image:this.$refs.add.meeting_image,
						limit_num:this.$refs.add.limit_num,
						meeting_address:this.$refs.add.meeting_address,
						meeting_equipment:this.$refs.add.selected_equipment.join(','),
						remark:this.$refs.add.remark
					}
					resource.editMettingRoomPost(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.$refs.CDialog.show_dialog = false;
							this.$emit('reload');
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//启用/禁用/删除
			updateFn(type,message){
				this.$confirm(`确认${message}？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						meeting_room_id:this.info.meeting_room_id,
						type:type
					}
					resource.updateMettingRoom(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.$emit('reload');
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});          
				});
			},
			//确认取消日程
			confirmCancel(){
				let arg = {
					meeting_id:this.info.meeting_id
				}
				resource.meetingCancle(arg).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.$refs.CDialog.show_dialog = false;
						this.$emit('reload',this.info.meeting_id);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取会议详情
			getDetail(){
				resource.meetingDetail({meeting_id:this.info.meeting_id}).then(res => {
					if(res.data.code == 1){
						this.detail_info = res.data.data;
						this.detail_info['time'] = filterMeetingTime(this.detail_info.start_time,this.detail_info.end_time)
						this.$refs.dDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		},
		components:{
			DefaultImage,
			SelectTime,
			CDialog,
			Add
		}
	}
</script>
<style lang="less" scoped>
.people_icon{
	width: 22px;
	height: 22px;
}
.position_icon{
	width: 18px;
	height: 21px;
}
.time_icon{
	width: 18px;
	height: 18px;
}
</style>