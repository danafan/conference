<template>
	<div class="flex select_box mt-24 mb-24">
		<div class="relative item" :class="[{'is_exceed':item.is_exceed},{'pointer':!item.is_exceed && !item.disable},{'is_disable':item.disable},{'active_background':item.is_selected},{'hover_background':item.is_hover && !item.is_selected && frequency > 0}]" @mouseover="changeShow(item,index,true)" @mouseleave="changeShow(item,index,false)" @click="selectedItem(index)" v-for="(item,index) in list" :key="index">
			<div class="point_start absolute" v-if="index == 0">{{item.point_time}}</div>
			<div class="point absolute" v-if="index%2 == 1">{{item.point_time}}</div>
			<!-- 已过期 -->
			<div class="popover absolute f14" v-if="active_index == index && item.is_exceed">已过期</div>
			<!-- 被预定 -->
			<div class="popover absolute f14" v-if="active_index == index && item.disable">已被 <span class="primary_color">{{item.user_name}}</span> 预定</div>
			<!-- 可选择 -->
			<div class="popconfirm absolute f14" v-if="start_index == index">
				<div>{{popconfirm_value}}</div>
				<div v-if="frequency === 1">(再次点击确认时段)</div>
				<div class="width-100 flex jfc mt-10">
					<el-button size="mini" @click.stop="cancel">取消</el-button>
					<el-button size="mini" type="primary" @click.stop="selectedTime">确定</el-button>
				</div>
			</div>
		</div>
		<!-- 确认会议室详情 -->
		<c-dialog title="杭州德儿电子商务有限公司" :cancel="false" @cancleFn="$refs.CDialog.show_dialog = false" confirmText="完成" @confirmFn="confirmFn" @closeDialog="$emit('reloadFn')" ref="CDialog">
			<el-form size="small" label-width="100px">
				<el-form-item label="会议标题：" required>
					<el-input style="flex:1" v-model="meeting_title" placeholder="请添加会议标题">
					</el-input>
				</el-form-item>
				<el-form-item label="会议级别：" required>
					<el-select v-model="meeting_level">
						<el-option v-for="item in meeting_level_list" :label="item.meeting_level_name" :value="item.meeting_level_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会议日期：">
					<el-date-picker v-model="date" type="date" value-format="yyyy-MM-dd" @change="changeDate" :clearable="false" :picker-options="pickerOptions">
					</el-date-picker>
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
							minTime:startMinTime
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
		<el-form-item label="通知时间：">
			<el-select v-model="notice_type">
				<el-option v-for="item in notice_type_list" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
		</el-form-item>
	</el-form>
</c-dialog>
</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';

	import CDialog from '../components/cDialog.vue'
	import resource from '../api/resource.js'
	import { getNowDate } from '../utils.js'
	export default{
		data(){
			return{
				list:[{
					point_time:7,
					interval:"07:00~07:30",
				},{
					point_time:8,
					interval:"07:30~08:00",
				},{
					point_time:null,
					interval:"08:00~08:30",
				},{
					point_time:9,
					interval:"08:30~09:00",
				},{
					point_time:null,
					interval:"09:00~09:30",
				},{
					point_time:10,
					interval:"09:30~10:00",
				},{
					point_time:null,
					interval:"10:00~10:30",
				},{
					point_time:11,
					interval:"10:30~11:00",
				},{
					point_time:null,
					interval:"11:00~11:30",
				},{
					point_time:12,
					interval:"11:30~12:00",
				},{
					point_time:null,
					interval:"12:00~12:30",
				},{
					point_time:13,
					interval:"12:30~13:00",
				},{
					point_time:null,
					interval:"13:00~13:30",
				},{
					point_time:14,
					interval:"13:30~14:00",
				},{
					point_time:null,
					interval:"14:00~14:30",
				},{
					point_time:15,
					interval:"14:30~15:00",
				},{
					point_time:null,
					interval:"15:00~15:30"
				},{
					point_time:16,
					interval:"15:30~16:00",
				},{
					point_time:null,
					interval:"16:00~16:30",
				},{
					point_time:17,
					interval:"16:30~17:00",
				},{
					point_time:null,
					interval:"17:00~17:30",
				},{
					point_time:18,
					interval:"17:30~18:00",
				},{
					point_time:null,
					interval:"18:00~18:30",
				},{
					point_time:19,
					interval:"18:30~19:00",
				},{
					point_time:null,
					interval:"19:00~19:30",
				},{
					point_time:20,
					interval:"19:30~20:00",
				},{
					point_time:null,
					interval:"20:00~20:30",
				},{
					point_time:21,
					interval:"20:30~21:00",
				},{
					point_time:null,
					interval:"21:00~21:30",
				},{
					point_time:22,
					interval:"21:30~22:00",
				},{
					point_time:null,
					interval:"22:00~22:30",
				},{
					point_time:23,
					interval:"22:30~23:00",
				}],
				active_index:-1,					//悬浮提示默认下标
				start_index:-1,						//第一次选中的下标
				frequency:0,						//当前有效点击次数
				popconfirm_value:"",				//选中时间的弹窗时间段
				meeting_title:"",					//会议标题
				meeting_level_list:[],				//会议级别列表
				meeting_level:'',					//选中的会议级别
				selected_user:[],					//选中的参会人员列表
				meeting_room:[],	//会议室列表
				meeting_room_ids:[],//选中的会议室
				remark:"",			//会议描述
				notice_type_list:[],//时间列表
				notice_type:"",		//选中的提前通知时间
				date:"",			//会议日期
				pickerOptions: {
					disabledDate(date) {
						return date.getTime() < Date.now() - 8.64e7;
					}
				},					
				startTime:"",		//会议时间
				startMinTime:"",	//开始时间最小时间
				endTime:"",
				pickedUsers:[],		//当前已选中的用户
				
			}
		},
		props:{
			//当前会议室
			info:{
				type:Object,
				default:{}
			},
			//当前的筛选条件日期
			current_date:{
				type: String,
				default:''
			}
		},
		computed:{
			//用户信息
			userInfo(){
				return this.$store.state.userInfo;
			}
		},
		created(){
			//设置默认状态
			this.filterTime();
		},
		methods:{
			//设置默认状态
			filterTime(){
				if(this.info.meeting_records.length > 0){
					this.info.meeting_records.map(r_item => {
						var arr = [];
						this.list.map((item,index) => {
							let start_time = item.interval.split('~')[0];
							let end_time = item.interval.split('~')[1];
							let arg = this.getStatus(start_time,end_time);
							item['is_selected'] = false;
							item['is_hover'] = false;
							for(let k in arg){
								item[k] = arg[k];
							}

							if(r_item.start_time == item.arg_start_time && r_item.end_time == item.arg_end_time){
								arr[0] = index;
								arr[1] = index;
							}else if(r_item.start_time == item.arg_start_time || r_item.end_time == item.arg_end_time){
								arr.push(index)
							}
						})
						this.list.map((item,index) => {
							if(index >= arr[0] && index <= arr[1]){
								item['disable'] = true;
								item['user_name'] = r_item.admin_name;
							}
						})
					})
				}else{
					this.list.map((item,index) => {
						let start_time = item.interval.split('~')[0];
						let end_time = item.interval.split('~')[1];
						let arg = this.getStatus(start_time,end_time);
						item['is_selected'] = false;
						item['is_hover'] = false;
						for(let k in arg){
							item[k] = arg[k];
						}
					})
				}
			},
			//处理每一格的时间
			getStatus(start_time,end_time){
				var now = new Date(); 				//当前日期  
				var nowYear = now.getYear(); 		//当前年 
				nowYear += (nowYear < 2000) ? 1900 : 0;
				var nowMonth = now.getMonth()<10?`0${now.getMonth() + 1}`:now.getMonth() + 1; 		//当前月 
				var nowDay = now.getDate()<10?`0${now.getDate()}`:now.getDate(); 		//当前日 
				var nowHours = now.getHours();  	//当前小时
				var nowMinutes = now.getMinutes();  //当前分钟
				var Seconds = now.getSeconds();     //当前秒

				//当前时间
				let current_time = this.current_date == `${nowYear}-${nowMonth}-${nowDay}`?`${nowYear}-${nowMonth}-${nowDay} ${nowHours}:${nowMinutes}:${Seconds}`:`${this.current_date} 00:00:00`;
				//指定的开始时间
				let set_start_time = `${this.current_date} ${start_time}:00`;
				//指定的结束时间
				let set_end_time = `${this.current_date} ${end_time}:00`;

				//当前时间是否超出指定的结束时间
				let is_exceed = new Date(current_time).getTime() > new Date(set_end_time).getTime();

				let arg = {
					is_exceed:is_exceed,				//是否过期
					arg_start_time:set_start_time,		//开始时间
					arg_end_time:set_end_time			//结束时间
				}
				return arg;
			},
			//控制是否显示悬浮提示
			changeShow(item,index,type){
				if(item.is_exceed || item.disable){		//已过期或被预定
					this.active_index = type?index:-1;
				}else{									//可选择
					if(this.start_index > -1 && this.frequency == 1){
						var new_list = JSON.parse(JSON.stringify(this.list));
						if(this.getNum(index).is_exceed > 0 || this.getNum(index).disable > 0){
							return
						}
						new_list.map((new_item,i) => {
							if(i >= this.getNum(index).s_index && i <= this.getNum(index).e_index){
								new_item.is_hover = true;
							}else{
								new_item.is_hover = false;
							}
						})
						this.list = new_list;
						this.popconfirm_value = `${new_list[this.getNum(index).s_index].interval.split('~')[0]}~${new_list[this.getNum(index).e_index].interval.split('~')[1]} ${((this.getNum(index).e_index - this.getNum(index).s_index) + 1)*30}分钟`;
					}
				}
			},
			//点击选择某个时间段
			selectedItem(index){
				//点击的是已过期或者被预定的，直接不向下执行
				if(this.list[index].is_exceed || this.list[index].disable){
					return;
				}
				var new_list = JSON.parse(JSON.stringify(this.list));
				if(this.frequency == 0){			//第一次点击
					new_list.map((item,i) => {
						if(index == i){
							item.is_selected = true;
							this.popconfirm_value = `${item.interval} 30分钟`;
						}else{
							item.is_selected = false;
						}
					})
					this.start_index = index;
					this.show_confirm = true;
					this.frequency = 1;
				}else if(this.frequency == 1){	//第二次点击
					if(this.getNum(index).is_selected == 1 && this.getNum(index).is_exceed == 0 && this.getNum(index).disable == 0){
						new_list.map((item,i_i) => {
							item.is_hover = false;
							if(i_i >= this.getNum(index).s_index && i_i <= this.getNum(index).e_index){
								item.is_selected = true;
							}
						})
						this.frequency = 0;
					}
				}
				this.list = new_list;
			},
			//获取被预定、已过期、已选中的数量
			getNum(index){
				var new_list = JSON.parse(JSON.stringify(this.list));
				var min_index = Math.min(this.start_index,index);
				let arr = [];
				let s_index = -1;
				let e_index = -1;
				if(min_index == this.start_index){
					arr = new_list.slice(min_index,index + 1);
					s_index = this.start_index;
					e_index = index;
				}
				if(min_index == index){
					arr = new_list.slice(index,this.start_index + 1);
					s_index = index;
					e_index = this.start_index;
				}

				let not_select_arr1 = arr.filter(item => {
					return item.is_selected;
				})

				let not_select_arr2 = arr.filter(item => {
					return item.is_exceed;
				})

				let not_select_arr3 = arr.filter(item => {
					return item.disable;
				})

				let arg = {
					is_selected:not_select_arr1.length,
					is_exceed:not_select_arr2.length,
					disable:not_select_arr3.length,
					s_index:s_index,
					e_index:e_index
				}
				return arg;
			},		
			//取消
			cancel(){
				this.start_index = -1;					//第一次选中的下标
				this.list.map(item => {
					item.is_hover = false;
					item.is_selected = false;
				})
				this.frequency = 0;						//当前有效点击次数
				this.popconfirm_value = "";				//选中时间的弹窗时间段
			},
			//切换选中日期
			changeDate(e,is_default){
				let exceed_list = this.list.filter(item => {
					return item.is_exceed;
				})
				if(e == getNowDate()){
					this.startMinTime = exceed_list[exceed_list.length - 1].interval.split('~')[1];
				}else{
					this.startMinTime = '';
				}
				if(!is_default){
					this.startTime = '';
					this.endTime = '';
				}
			},
			//选中确定
			selectedTime(){
				this.meeting_title = `【${this.info.meeting_room_name}】预定`;
				resource.addMeetingGet().then(res => {
					if(res.data.code == 1){
						this.meeting_level_list = res.data.data.meeting_level;
						let meeting_level = this.meeting_level_list.filter(item => {
							return item.meeting_level_name == '部门级';
						})
						this.meeting_level = meeting_level[0].meeting_level_id;
						this.meeting_room = res.data.data.meeting_room;
						this.meeting_room_ids = [];
						this.meeting_room_ids.push(this.info.meeting_room_id);
						this.notice_type_list = res.data.data.notice_type;
						let default_arr = this.notice_type_list.filter(item => {
							return item.default == 1;
						})
						this.notice_type = default_arr[0].id;
						//获取选中的会议时间
						let arr = this.list.filter(item => {
							return item.is_selected;
						})
						this.date = arr[0].arg_start_time.split(' ')[0];

						this.startTime = arr[0].interval.split('~')[0];
						this.endTime = arr[arr.length - 1].interval.split('~')[1];

						//处理默认不能选择的时间
						this.changeDate(this.date,true);
						
						//设置默认参会人
						this.setPickedUsers([]);

						this.$refs.CDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击批量选择参会人员
			checkUser(){
				dd.ready(() => {
					dd.biz.contact.complexPicker({
				    title:"选择参会人员",            	//标题
				    corpId:"ding7828fff434921f5b",  //企业的corpId
				    multiple:true,            		//是否多选
				    limitTips:"超出了",          		//超过限定人数返回提示
				    maxUsers:1000,            		//最大可选人数
				    pickedUsers:this.pickedUsers,   //已选用户
				    pickedDepartments:[],          	//已选部门
				    disabledUsers:[],            	//不可选用户
				    disabledDepartments:[],        	//不可选部门
				    requiredUsers:[this.userInfo.user_id],//必选用户（不可取消选中状态）
				    requiredDepartments:[],        	//必选部门（不可取消选中状态）
				    appId:2398948762,              	//微应用Id，企业内部应用查看AgentId
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
			//弹窗确定
			confirmFn(){
				if(this.meeting_title == ''){
					this.$message.warning('请输入会议标题！');
				}else if(this.meeting_level == ''){
					this.$message.warning('请选择会议级别！');
				}else if(this.meeting_room_ids.length == 0){
					this.$message.warning('请选择会议室！');
				}else if(this.startTime == ''){
					this.$message.warning('请选择会议开始时间！');
				}else if(this.endTime == ''){
					this.$message.warning('请选择会议结束时间！');
				}else{
					let arg = {
						meeting_title:this.meeting_title,
						meeting_room_ids:this.meeting_room_ids.join(','),
						start_time:`${this.date} ${this.startTime}:00`,
						end_time:`${this.date} ${this.endTime}:00`,
						notice_type:this.notice_type,
						meeting_level:this.meeting_level,
						remark:this.remark,
					}
					let user_ids = this.selected_user.map(item => {
						return item.emplId
					})
					arg['user_ids'] = user_ids.join(',');
					resource.addMeetingPost(arg).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							this.$refs.CDialog.show_dialog = false;
							this.start_index = -1;
							this.$emit('reloadFn');
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}
			
		},
		components:{
			CDialog
		}
	}
</script>
<style lang="less" scoped>
.select_box{
	border-left: 1px solid #ADADAD;
	border-top: 1px solid #ADADAD;
	border-bottom: 1px solid #ADADAD;
	width: 100%;
	.item{
		border-right: 1px solid #ADADAD;
		width: 3.125%;
		height: 36px;
		.point_start{
			bottom:-26px;
			left: -6px;
		}
		.point{
			bottom:-26px;
			right: -7px;
		}
		.popover{
			white-space: nowrap;
			top:-40px;
			left: 50%;
			transform: translate(-50%);
			padding-left: 8px;
			padding-right: 8px;
			text-align: center;
			height: 28px;
			line-height: 28px;
			background: #FFFFFF;
			box-shadow: 0px 0px 3px 0px #DADADA;
			border-radius: 6px;
		}
		.popconfirm{
			white-space: nowrap;
			top:-110px;
			left: 50%;
			transform: translate(-50%);
			padding: 12px;
			background: #FFFFFF;
			box-shadow: 0px 0px 3px 0px #DADADA;
			border-radius: 6px;
		}
	}
	.is_exceed{
		background-color: #E8E9EA;
	}
	.is_disable{
		background-color: #929497;
	}
	.hover_background{
		background-color: #C8DEF4;
	}
	.people_box{
		padding:3px 5px 3px 3px;
		border-radius: 4px;
		border:1px solid #DCDFE6;
	}
}
</style>