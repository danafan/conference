<template>
	<div class="flex fc height-100">
		<div class="mb_none white_back pl-30 pt-6 pb-6 flex ac">
			<div class="create_button flex ac jc pointer" @click="createFn">
				<img class="create_metting mr-8" src="../../static/create_metting.png">
				<div class="f14">新建会议</div>
			</div>
		</div>
		<div class="mt-10 scroll-y hide_scrollbar" v-if="list.length > 0">
			<div class="period_item white_back flex ac jsb pt-12 pb-12 pl-20 pr-88 mb-6" v-for="item in list">
				<div class="height-100 flex fc jsb">
					<div class="flex ac">
						<div class="f16 fw-500 mr-8">{{item.meeting_title}}</div>
						<div class="status_tag f12" v-if="item.status == '2'">已过期</div>
					</div>
					<div class="flex ac">
						<img class="item_icon mr-6" src="../../static/cycle_icon.png">
						<div class="f14">会议循环周期：{{item.range_start_date}}至{{item.range_end_date}}</div>
					</div>
					<div class="flex ac">
						<img class="item_icon mr-6" src="../../static/time_icon.png">
						<div class="f14">会议时间：{{item.meeting_time}}</div>
					</div>
					<div class="flex ac">
						<img class="item_icon mr-6" src="../../static/admin_user_icon.png">
						<div class="f14">组织人：{{item.admin_name}}</div>
					</div>
				</div>
				<el-button type="text" v-if="item.status != '2' && item.is_self == 1" @click="cancelFn(item.batch_id)">取消</el-button>
			</div>
		</div>
		<EmptyPage class="mt-10" :loading="loading" v-else/>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
		<!-- 确认会议室详情 -->
		<c-dialog title="杭州德儿电子商务有限公司" :cancel="false" @cancleFn="$refs.CDialog.show_dialog = false" @closeDialog="closeDialog" confirmText="完成" @confirmFn="confirmFn(1)" ref="CDialog">
			<el-form size="small" label-width="100px">
				<el-form-item label="会议标题：" required>
					<el-input style="flex:1" v-model="meeting_title" placeholder="请添加会议标题">
					</el-input>
				</el-form-item>
				<el-form-item label="会议日期：">
					{{range_start_date}} 至 {{range_end_date}}
				</el-form-item>
				<el-form-item label="会议时间：" required>
					<div class="flex ac">
						<el-time-select placeholder="起始时间"
						v-model="startTime"
						:clearable="false"
						:picker-options="{
							start: '07:00',
							step: '00:30',
							end: '23:00',
							minTime:startMinTime,
							maxTime:endTime
						}">
					</el-time-select>
					-
					<el-time-select
					placeholder="结束时间"
					v-model="endTime"
					:clearable="false"
					:picker-options="{
						start: '07:00',
						step: '00:30',
						end: '23:00',
						minTime: startTime
					}">
				</el-time-select>
			</div>
		</el-form-item>
		<el-form-item label="会议级别：" required>
			<el-select v-model="meeting_level">
				<el-option v-for="item in meeting_level_list" :label="item.meeting_level_name" :value="item.meeting_level_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="参会人员：">
			<div class="people_box flex">
				<div class="flex-1">
					<el-button type="primary" plain icon="el-icon-plus" @click="checkUser">批量添加</el-button>
					<el-tag class="mr-10 mb-10" effect="plain" :class="{'ml-10':index == 0}" type='info' :closable="user.emplId != userInfo.user_id" v-for="(user,index) in selected_user" :key="index" @close="closeFn(index)">
						{{user.name}}
					</el-tag>
				</div>
				<div class="f16 dark_color">{{selected_user.length}}人</div>
			</div>
		</el-form-item>
		<el-form-item label="会议室：" required>
			<el-select v-model="meeting_room_ids" multiple filterable>
				<el-option v-for="item in meeting_room" :label="item.meeting_room_name" :value="item.meeting_room_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="会议描述：">
			<el-input type="textarea" :rows="3" placeholder="添加会议描述" v-model="remark">
			</el-input>
		</el-form-item>
		<el-form-item label="重复周期：" required>
			<el-select v-model="repeat_days" multiple>
				<el-option v-for="item in week_list" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="通知时间：" required>
			<el-select v-model="notice_type" multiple>
				<el-option v-for="item in notice_type_list" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
			<el-checkbox style="margin-left: 10px" v-model="is_chat_notice" :true-label="1" :false-label="0">单聊通知参与人</el-checkbox>
		</el-form-item>
		<!-- <el-form-item label="自定义通知：">
			<el-date-picker
			size="small"
			v-model="date_time"
			value-format="yyyy-MM-dd HH:mm"
			format="yyyy-MM-dd HH:mm"
			type="datetime"
			@focus="focus"
			@change="addType"
			:picker-options="pickerOptions"
			placeholder="选择日期时间">
		</el-date-picker>
	</el-form-item> -->
</el-form>
</c-dialog>
</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';

	import EmptyPage from '../../components/empty_page.vue'
	import CDialog from '../../components/cDialog.vue'

	import {getNowDate,getNextDate} from '../../utils.js'

	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				page:1,
				pagesize:10,
				list:[],						//会议室列表
				loading:true,
				total:0,
				meeting_title:"",				//会议标题
				range_start_date: getNowDate(),	//开始日期
				range_end_date:getNextDate(getNowDate(),30),	//结束日期
				startTime:"",		//会议开始时间
				startMinTime:"",	//开始时间最小时间
				endTime:"",			//会议结束时间
				meeting_level_list:[],				//会议级别列表
				meeting_level:'',					//选中的会议级别
				meeting_room:[],					//会议室列表
				meeting_room_ids:[],				//选中的会议室
				remark:"",							//会议描述
				notice_type_list:[],				//时间列表
				notice_type:[],						//选中的提前通知时间
				is_chat_notice:0,					//是否单聊通知
				// date_time:"",						//自定义的时间
				// pickerOptions: {
				// 	disabledDate: (date)=> {
				// 		return date.getTime() < Date.now() - 8.64e7;
				// 	}
				// },	
				selected_user:[],					//选中的参会人员列表
				pickedUsers:[],		//当前已选中的用户id(用于展示)
				week_list:[{
					id:'1',
					name:'周一'
				},{
					id:'2',
					name:'周二'
				},{
					id:'3',
					name:'周三'
				},{
					id:'4',
					name:'周四'
				},{
					id:'5',
					name:'周五'
				},{
					id:'6',
					name:'周六'
				},{
					id:'7',
					name:'周日'
				}],
				repeat_days:[],
			}
		},
		created(){
			//获取会议记录
			this.periodList(true);
		},
		computed:{
			//用户信息
			userInfo(){
				return this.$store.state.userInfo;
			},
			//appId
			appId(){
				return this.$store.state.appId;
			},
			//corpId
			corpId(){
				return this.$store.state.corpId;
			},
		},
		methods:{
			// focus(){
			// 	this.$nextTick(() => {
			// 		document
			// 		.getElementsByClassName('el-button--text')[0]
			// 		.setAttribute('style', 'display:none')
			// 	})
			// },
			//获取会议记录
			periodList(is_reload){
				if(is_reload){
					this.list = [];
					this.page = 1;
				}
				let arg = {
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.periodList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						this.list = data.data;
						this.total = data.total;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.periodList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.periodList();
			},
			//点击创建
			createFn(){
				resource.addMeetingGet().then(res => {
					if(res.data.code == 1){
						//会议级别
						this.meeting_level_list = res.data.data.meeting_level;
						let meeting_level = this.meeting_level_list.filter(item => {
							return item.meeting_level_name == '部门级';
						})
						this.meeting_level = meeting_level[0].meeting_level_id;
						//会议室
						this.meeting_room = res.data.data.meeting_room;
						this.notice_type_list = res.data.data.notice_type;
						this.notice_type = [];
						this.notice_type_list.map(item => {
							if(item.default == 1){
								this.notice_type.push(item.id);
							}
						})
						//设置默认参会人
						this.setPickedUsers([]);

						this.$refs.CDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭弹窗
			closeDialog(){

			},
			// //点击添加通知类型
			// addType(){
			// 	if(!this.date_time){
			// 		this.$message.warning('请选择通知时间!');
			// 	}else{
			// 		let new_ele = `${this.date_time.split(' ')[0]} ${this.date_time.split(' ')[1]}`;
			// 		let c_i = this.notice_type.findIndex(item => {
			// 			return item == new_ele
			// 		})
			// 		if(c_i > -1){
			// 			this.$message.warning('该提醒时间已存在!');
			// 			return
			// 		}

			// 		let new_type = {
			// 			id:new_ele,
			// 			name:new_ele
			// 		}
			// 		this.notice_type_list.push(new_type);
			// 		this.notice_type.push(new_ele);
			// 		this.date_time = "";
			// 	}
			// },
			//点击批量选择参会人员
			checkUser(){
				dd.ready(() => {
					dd.biz.contact.complexPicker({
				    title:"选择参会人员",            	//标题
				    corpId:this.corpId,  			//企业的corpId
				    multiple:true,            		//是否多选
				    limitTips:"超出了",          		//超过限定人数返回提示
				    maxUsers:1000,            		//最大可选人数
				    pickedUsers:this.pickedUsers,   //已选用户
				    pickedDepartments:[],          	//已选部门
				    disabledUsers:[],            	//不可选用户
				    disabledDepartments:[],        	//不可选部门
				    requiredUsers:[this.userInfo.user_id],//必选用户（不可取消选中状态）
				    requiredDepartments:[],        	//必选部门（不可取消选中状态）
				    appId:this.appId,              	//微应用Id，企业内部应用查看AgentId
				    permissionType:"GLOBAL",          
				    responseUserOnly:true,         	//返回人，或者返回人和部门
				    startWithDepartmentId:0 ,   	//仅支持0和-1
				    onSuccess: (result) => {
				    	//设置当前选中的参会人员
				    	this.setPickedUsers(result.users)
				    },
				    onFail : function(err) {}
				});
				})
			},
			//关闭选中的人员
			closeFn(index){
				this.selected_user.splice(index,1);
				let pickedUsers = this.selected_user.filter(item => {
					return item.emplId != this.userInfo.user_id;
				})
				this.pickedUsers = pickedUsers.map(item => {
					return item.emplId;
				})
			},
			//设置当前选中的参会人员
			setPickedUsers(users){
				this.selected_user = [];
				let current_user = {
					name:this.userInfo.real_name,
					emplId :this.userInfo.user_id
				}
				this.selected_user.push(current_user)
				this.selected_user = [...this.selected_user,...users];

				let pickedUsers = this.selected_user.filter(item => {
					return item.emplId != this.userInfo.user_id;
				})
				this.pickedUsers = pickedUsers.map(item => {
					return item.emplId;
				})
			},
			//确认创建
			confirmFn(is_check){
				if(this.meeting_title == ''){
					this.$message.warning('请输入会议标题！');
				}else if(this.startTime == ''){
					this.$message.warning('请选择会议开始时间！');
				}else if(this.endTime == ''){
					this.$message.warning('请选择会议结束时间！');
				}else if(this.meeting_level == ''){
					this.$message.warning('请选择会议级别！');
				}else if(this.meeting_room_ids.length == 0){
					this.$message.warning('请选择会议室！');
				}else if(this.notice_type.length == 0){
					this.$message.warning('请选择会议提醒时间！');
				}else if(this.repeat_days.length == 0){
					this.$message.warning('请选择重复周期！');
				}else{
					let arg = {
						meeting_title:this.meeting_title,
						meeting_room_ids:this.meeting_room_ids.join(','),
						start_time:this.startTime,
						end_time:this.endTime,
						notice_type:this.notice_type.join(','),
						meeting_level:this.meeting_level,
						remark:this.remark,
						is_chat_notice:this.is_chat_notice,
						repeat_days:this.repeat_days.join(','),
						range_start_date:this.range_start_date,
						range_end_date:this.range_end_date,
						is_check:is_check
					}
					let user_ids = this.selected_user.map(item => {
						return item.emplId
					})
					arg['user_ids'] = user_ids.join(',');
					resource.periodAdd(arg).then(res => {
						if(res.data.code == 1){
							console.log(is_check)
							if(is_check == 1){		//校验
								//确认创建
								this.confirmFn(0);
							}else{					//正常提交
								this.$message.success(res.data.msg);
								this.$refs.CDialog.show_dialog = false;
								//获取会议记录
								this.periodList(true);
							}
						}else if(res.data.code == 2){
							this.$confirm(`${res.data.msg}`, '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
							}).then(() => {
								//确认创建
								this.confirmFn(0);
							}).catch(() => {
								this.$message({
									type: 'info',
									message: '已取消'
								});          
							});
						}else if(res.data.code == 3){
							this.$message.warning(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//
			//取消
			cancelFn(batch_id){
				this.$confirm(`确认取消该周期会议？`, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let arg = {
						batch_id:batch_id
					}
					resource.periodCancle(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取会议记录
							this.periodList();
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
		},
		components:{
			EmptyPage,
			CDialog
		}
	}
</script>
<style lang="less" scoped>
.create_button{
	width: 112px;
	height: 34px;
	border-radius: 2px;
	border: 1px solid #CCCCCC;
	.create_metting{
		width: 18px;
		height: 17px;
	}
}
.period_item{
	width: 100%;
	height: 130px;
	.status_tag{
		border:1px solid #666666;
		background-color: #EDEDED;
		border-radius: 12px;
		padding-left: 5px;
		padding-right: 5px;
		height: 18px;
		line-height: 18px;
		color: #666666;
	}
	.item_icon{
		width: 16px;
		height: 16px;
	}
	
}
</style>