<template>
	<div>
		<el-card class="p_none pt-10 pr-10 pb-10 pl-10 mb-6" shadow="hover">
			<div class="flex">
				<DefaultImage :info="info"/>
				<div class="flex-1 flex fc jsb">
					<!-- 名称 -->
					<div class="flex ac">
						<div class="f16 mr-8 fw-600">{{type == 3?info.meeting_title:info.meeting_room_name}}</div>
						<div class="status_tag f12" :class="[{'yyd':info.status == '1'},{'jxz':info.status == '2'},{'yqx':info.status == '3'},{'yqx':info.status == '4'}]" v-if="meeting_status == '0' && $route.path == '/record'">{{info.status | status}}</div>
						<div class="status_tag yjs f12" v-if="info.is_period == '1'">周期会议</div>
					</div>
					<!-- 设备 -->
					<div class="f14" v-if="type == 1 || type == 2">{{info.equipment_str}}</div>
					<!-- 地址 -->
					<div class="flex ac" v-if="type == 3">
						<img class="position_icon mr-6" src="../static/position_icon.png">
						<div class="f14">{{info.meeting_address}}</div>
						<div class="f14 fw-500" v-if="type == 3">（{{info.meeting_room_name}}）</div>
					</div>
					<!-- 人数/地址/时间 -->
					<div class="flex" v-if="type == 1 || type == 2">
						<!-- 人数 -->
						<div class="flex ac mr-20" v-if="type == 1">
							<img class="people_icon mr-6" src="../static/people_icon.png">
							<div class="f14">{{info.limit_num}}人</div>
						</div>
						<!-- 地址 -->
						<div class="flex ac mr-20">
							<img class="position_icon mr-6" src="../static/position_icon.png">
							<div class="f14">{{info.meeting_address}}</div>
						</div>
					</div>
					<!-- 时间 -->
					<div class="flex ac" v-if="type == 3">
						<img class="time_icon mr-6" src="../static/time_icon.png">
						<div class="f14">{{info.time}}</div>
					</div>
					<!-- 组织人/部门 -->
					<div class="flex ac" v-if="type == 3">
						<img class="admin_user_icon mr-6" src="../static/admin_user_icon.png">
						<div class="f14">组织人：{{info.admin_name}}&nbsp&nbsp&nbsp{{info.main_dept}}</div>
						&nbsp&nbsp&nbsp
						<div class="f14" v-if="info.status == '3'">会议纪要：{{info.filling_status == '1'?'已填写':'未填写'}}</div>
					</div>
				</div>
				<!-- 会议室管理 -->
				<div class="flex ac" v-if="type == 2">
					<el-button type="text" @click="getQrCode(info.meeting_room_qcode)">二维码</el-button>
					<el-button type="text" @click="editMetting">编辑</el-button>
					<el-button type="text" @click="updateFn(info.status == 1?2:1,info.status == 1?'禁用':'启用')">{{info.status == 1?'禁用':'启用'}}</el-button>
					<el-button type="text" @click="updateFn(0,'删除')">删除</el-button>
				</div>
				<!-- 会议记录 -->
				<div class="flex ac" v-if="type == 3">
					<el-button type="text" @click="editFn(info.meeting_id)" v-if="info.status == 1 && info.is_self == 1">编辑</el-button>
					<el-button type="text" @click="meetingCode" v-if="info.is_sign">签到</el-button>
					<el-button type="text" @click="$refs.CDialog.show_dialog = true" v-if="info.cancle_status == 1 && info.status != 3">取消日程</el-button>
					<el-button type="text" @click="getDetail">会议详情</el-button>
				</div>
			</div>
			<SelectTime :info="info" :current_date="current_date" v-if="type == '1'" @reloadFn="$emit('reloadFn')"/>
		</el-card>
		<!-- 编辑会议 -->
		<c-dialog title="编辑会议" @cancleFn="$refs.editDialog.show_dialog = false" confirmText="完成" @confirmFn="editConfirmFn" @closeDialog="$emit('reloadFn')" ref="editDialog">
			<el-form size="small" label-width="100px">
				<el-form-item label="会议标题：" required>
					<el-input style="flex:1" v-model="edit_detail_info.meeting_info.meeting_title" placeholder="请添加会议标题">
					</el-input>
				</el-form-item>
				<el-form-item label="会议级别：">
					<el-select v-model="edit_detail_info.meeting_info.meeting_level">
						<el-option v-for="item in edit_detail_info.meeting_level" :label="item.meeting_level_name" :value="item.meeting_level_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会议日期：">
					<el-date-picker v-model="edit_detail_info.meeting_info.meeting_day" type="date" disabled value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="会议时间：">
					<div class="flex ac">
						<el-time-select placeholder="起始时间"
						v-model="startTime"
						disabled
						>
					</el-time-select>
					-
					<el-time-select
					placeholder="结束时间"
					v-model="endTime"
					disabled
					>
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
		<el-form-item label="会议室：">
			<el-select v-model="edit_detail_info.meeting_info.meeting_room_id" disabled>
				<el-option v-for="item in edit_detail_info.meeting_room" :label="item.meeting_room_name" :value="item.meeting_room_id">
				</el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="会议描述：">
			<el-input type="textarea" :rows="3" placeholder="添加会议描述" v-model="edit_detail_info.meeting_info.remark">
			</el-input>
		</el-form-item>
		<el-form-item label="通知时间：">
			<el-select v-model="notice_type_ids" multiple>
				<el-option v-for="item in edit_detail_info.notice_type" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
			<el-checkbox style="margin-left: 10px" v-model="edit_detail_info.meeting_info.is_chat_notice" :true-label="1" :false-label="0">单聊通知参与人</el-checkbox>
		</el-form-item>
		<el-form-item label="自定义通知：">
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
	</el-form-item>
</el-form>
</c-dialog>
<!-- 编辑会议室 -->
<c-dialog title="编辑会议室" @cancleFn="$refs.eDialog.show_dialog = false" @confirmFn="confirmFn" ref="eDialog">
	<Add ref="add" :isEdit="true" :info="edit_info"/>
</c-dialog>
<!-- 取消日程 -->
<c-dialog title="取消日程" width="420px" cancelText="暂不" @cancleFn="$refs.CDialog.show_dialog = false" @confirmFn="confirmCancel" ref="CDialog">
	<div class="f16">
		<div class="mb-10">会议室：{{info.meeting_room_name}}</div>
		<div>时间：{{info.time}}</div>
	</div>
</c-dialog>
<!-- 会议详情 -->
<c-dialog title="会议详情" :footer="false" ref="dDialog">
	<div class="f16">
		<div class="mb-15 flex">
			<div>会议主题：</div>
			<div class="fw-500">{{detail_info.meeting_title}}</div>
		</div>
		<div class="mb-15">会议时间：{{detail_info.time}}</div>
		<div class="mb-15">会议地点：{{detail_info.meeting_room_name}}</div>
		<div class="mb-15">组织人：{{detail_info.admin_name}}</div>
		<div class="mb-15">会议级别：{{detail_info.meeting_level_name}}</div>
		<div>参与人：{{cyr_list}}</div>
		<el-divider></el-divider>
		<div class="fw-500">会议纪要</div>
		<!-- 可编辑 -->
		<div v-if="detail_info.edit_status == 1">
			<div class="flex mb-10 mt-10">
				<div class="upload_box">
					<el-button size="mini" type="text">添加附件</el-button>
					<input type="file" ref="fileUpload" class="upload_file" @change="uploadFile">
				</div>
				<el-button type="info" plain size='mini' @click="downTemp">下载模版</el-button>
			</div>
			<div v-if="detail_info.meeting_files.length > 0">
				<div class="flex ac" v-for="(item,index) in detail_info.meeting_files">
					<img class="link_icon mr-6" src="../static/link_icon.png">
					<el-button class="f14" size="mini" type="text" @click="downLoad(item)">{{item.split('/')[1]}}</el-button>
					<el-button size="mini" type="text" @click="deleteFile(index)">删除</el-button>
				</div>
			</div>
			<div class="f12 red_color mb-10" v-else>请至少添加一个附件</div>
			<el-input class="mb-10" type="textarea" :rows="5" placeholder="请输入会议记录...(必填)" v-model="detail_info.meeting_minutes">
			</el-input>
			<el-button size="small" type="primary" plain @click="updateMinutes">保存</el-button>
		</div>
		<!-- 不可编辑 -->
		<div class="flex ac mt-10" v-else>
			<img class="minutes_icon mr-15" src="../static/minutes_icon.png">
			<el-button size="mini" type="text" @click="$refs.mDialog.show_dialog = true">查看会议纪要</el-button>
		</div>
		<el-divider></el-divider>
		<div class="flex jsb mb-15">
			<div class="flex">
				<div class="tab_item mr-60 relative pointer" v-for="(item,index) in tab_list" @click="checkTab(item,index)">
					<div class="fw-500" :class="{'primary_color':active_index == index}">{{item.name}}({{item.id == '-1'?total_num:item.id == '1'?sign_num:unsign_num}})</div>
					<div class="active_line absolute bottom-0 width-100" v-if="active_index == index"></div>
				</div>
			</div>
			<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
				<i class="el-icon-upload pointer" @click="exportUser"></i>
			</el-tooltip>
		</div>
		<div class="flex flex-warp">
			<div class="flex fc ac mr-20 mb-15" v-for="item in signin_list">
				<div class="picture fw-500 mb-10">{{item.user_name.split('')[0]}}</div>
				<div class="f14">{{item.user_name}}</div>
			</div>
		</div>
	</div>
	<!-- 会议纪要 -->
	<c-dialog title="会议纪要" :footer="false" :append="true" ref="mDialog">
		<div class="f16 fw-500 mb-15">会议记录</div>
		<div class="pre-line" v-html="detail_info.meeting_minutes" v-if="detail_info.meeting_minutes"></div>
		<div v-else>暂无内容</div>
		<el-divider></el-divider>
		<div class="f16 fw-500 mb-15">会议附件</div>
		<div v-if="detail_info.meeting_files.length > 0">
			<div class="minutes_row flex mb-10" v-for="(item,index) in detail_info.meeting_files">
				<img class="minutes_icon mr-18" src="../static/minutes_icon.png">
				<div class="flex fc as jsb f14">
					<div>{{item.split('/')[1]}}</div>
					<div class="flex">
						<el-button size="mini" type="text" @click="downLoad(item)">下载</el-button>
						<el-button size="mini" type="text" @click="viewFile(item)">预览</el-button>
					</div>
				</div>
			</div>
		</div>
		<div v-else>暂无上传</div>
		<el-divider></el-divider>
		<div class="f16 fw-500 mb-15">会议记录人</div>
		<div class="f14">{{detail_info.admin_name}}</div>
	</c-dialog>
</c-dialog>
<!-- 签到 -->
<c-dialog class="sign_dialog" width="540px" title="签到" :footer="false" ref="sDialog" @closeDialog="closeSignDialog">
	<div class="sign_box flex f16">
		<!-- 左侧 -->
		<div class="height-100 left_box flex fc">
			<div class="qrcode flex ac jc">
				<img class="qrcode_img" :src="meeting_code">
			</div>
			<div class="user_num flex-1 flex ac jsa">
				<div class="flex fc ac">
					<div class="mb-20">{{sign_list.length}}</div>
					<div>已签到</div>
				</div>
				<div class="flex fc ac">
					<div class="mb-20">{{unsign_list.length}}</div>
					<div>未签到</div>
				</div>
			</div>
		</div>
		<!-- 右侧 -->
		<div class="flex-1 flex fc">
			<div class="sign_tab flex ac jsa">
				<div class="tab_item relative pointer" v-for="(item,index) in tab_list" @click="signCheckTab(item,index)">
					<div class="fw-500" :class="{'primary_color':sign_active_index == index}">{{item.name}}</div>
					<div class="active_line absolute bottom-0 width-100" v-if="sign_active_index == index"></div>
				</div>
				<el-tooltip class="item" effect="dark" content="导出" placement="top-end">
					<i class="el-icon-upload pointer" @click="exportUser"></i>
				</el-tooltip>
			</div>
			<div class="user_list flex-1 scroll-y hide_scrollbar">
				<div class="user_item flex jsb" v-for="item in current_list">
					<div class="mr-15">{{item.user_name}}</div>
					<div v-if="item.status == 1">{{item.sign_in_time}}</div>
				</div>
			</div>
		</div>
	</div>
</c-dialog>
<!-- 会议室二维码 -->
<c-dialog title="会议室二维码" :cancel="false" confirmText="下载" @confirmFn="downQrcode" ref="qrDialog">
	<div class="width-100 flex fc ac pt-10 pb-10">
		<div class="meeting_room_name">{{info.meeting_room_name}}</div>
		<img class="qrcode_url" :id="`imageWrapper_${info.meeting_room_name}`" :src="qrcode_url">
	</div>
</c-dialog>
</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';

	import html2Canvas from 'html2canvas'

	import {filterMeetingTime,exportPost,getNowDate} from '../utils.js'

	import DefaultImage from '../components/defaultImage.vue'
	import SelectTime from '../components/selectTime.vue'
	import CDialog from '../components/cDialog.vue'
	import PageTab from '../components/pageTab.vue'
	import Add from '../pages/Management/pages/add.vue'

	import resource from '../api/resource.js'
	export default{
		data(){
			return{
				edit_info:{
					meeting_files:[]
				},			//获取的详情
				detail_info:{
					meeting_files:[]
				},			//获取的详情
				show_drawer:false,		//会议详情弹窗
				tab_list:[{
					name:'全部',
					id:'-1'
				},{
					name:'已签到',
					id:'1'
				},{
					name:'未签到',
					id:'0'
				}],						//签到状态导航
				active_index:0,			//默认选中的导航下标
				sign_active_index:0,	//签到弹窗的默认下标
				signin_list:[],			//当前已签到和未签到的用户列表
				total_num:0,
				meeting_code:"",		//签到二维码地址
				ws:null,
				user_list:[],			//所有用户列表
				cyr_list:'',			//参与人列表
				current_list:[],		//当前显示的用户列表
				sign_list:[],			//签到弹窗已签到的用户列表
				sign_num:0,
				unsign_list:[],			//签到弹窗未签到的用户列表
				unsign_num:0,
				edit_detail_info:{
					meeting_info:{},
					meeting_level:[],
					meeting_room:[],
					notice_type:[]
				},						//编辑会议的详情
				notice_type_ids:[],		//已选中的通知类型
				date_time:"",
				pickerOptions: {
					disabledDate: (date)=> {
						return date.getTime() < Date.now() - 8.64e7 || date.getTime() > new Date(`${this.edit_detail_info.meeting_info.meeting_day}`).getTime();
					}
				},		
				startTime:"",
				endTime:"",
				selected_user:[],
				pickedUsers:[],			//当前已选中的用户
				qrcode_url:"",			//会议室二维码图片地址
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
			},
			//当前的筛选条件日期
			current_date:{
				type: String,
				default:''
			},
			//判断是否是会议记录的全部
			meeting_status:{
				type: String,
				default:''
			},
		},
		computed:{
			//用户信息
			userInfo(){
				return this.$store.state.userInfo;
			},
			//图片前缀
			domain(){
				return this.$store.state.domain;
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
			focus(){
				this.$nextTick(() => {
					document
					.getElementsByClassName('el-button--text')[0]
					.setAttribute('style', 'display:none')
				})
			},
			//点击编辑会议
			editFn(meeting_id){
				resource.meetingEditGet({meeting_id:meeting_id}).then(res => {
					if(res.data.code == 1){
						this.edit_detail_info = res.data.data;
						
						this.startTime = this.edit_detail_info.meeting_info.start_time.split(' ')[1].split(':').splice(0,2).join(':');
						this.endTime = this.edit_detail_info.meeting_info.end_time.split(' ')[1].split(':').splice(0,2).join(':');
						this.selected_user = [];
						this.edit_detail_info.meeting_info.user_list.map(item => {
							let new_user = {
								name:item.user_name,
								emplId :item.user_id
							}
							this.selected_user.push(new_user);
						})
						let current_user = {
							name:this.userInfo.real_name,
							emplId :this.userInfo.user_id
						}
						this.selected_user.unshift(current_user);

						this.pickedUsers = this.edit_detail_info.meeting_info.user_list.map(item => {
							return item.user_id;
						})

						//会议通知
						this.notice_type_ids = [];
						this.edit_detail_info.meeting_info.notice_type_id.map(item => {
							if(item.indexOf('-') > -1){
								let new_type = {
									id:item,
									name:item
								}
								this.edit_detail_info.notice_type.push(new_type);
								this.notice_type_ids.push(item);
							}else{
								this.notice_type_ids.push(parseInt(item));
							}
						})
						this.$refs.editDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击添加通知类型
			addType(){
				if(!this.date_time){
					this.$message.warning('请选择通知时间!');
				}else{
					if(new Date(`${this.date_time}`).getTime() > new Date(`${this.edit_detail_info.meeting_info.meeting_day} ${this.startTime}:00`).getTime()){
						this.$message.warning('提醒时间不能超过会议开始时间!');
						return
					}

					let new_ele = `${this.date_time.split(' ')[0]} ${this.date_time.split(' ')[1]}`;
					let c_i = this.notice_type_ids.findIndex(item => {
						return item == new_ele
					})
					if(c_i > -1){
						this.$message.warning('该提醒时间已存在!');
						return
					}


					
					let new_type = {
						id:new_ele,
						name:new_ele
					}
					this.edit_detail_info.notice_type.push(new_type);
					this.notice_type_ids.push(new_ele);
					this.date_time = "";
				}
			},
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
				this.selected_user = users;
				let current_user = {
					name:this.userInfo.real_name,
					emplId :this.userInfo.user_id
				}
				this.selected_user.unshift(current_user)

				let pickedUsers = this.selected_user.filter(item => {
					return item.emplId != this.userInfo.user_id;
				})
				this.pickedUsers = pickedUsers.map(item => {
					return item.emplId;
				})
			},
			//提交编辑会议
			editConfirmFn(){
				if(this.notice_type_ids.length == 0){
					this.$message.warning('请选择会议提醒时间！');
					return;
				}
				let edit_meeting_info = {
					meeting_id:this.edit_detail_info.meeting_info.meeting_id,
					meeting_title:this.edit_detail_info.meeting_info.meeting_title,
					notice_type:this.notice_type_ids.join(','),
					meeting_level:this.edit_detail_info.meeting_info.meeting_level,
					remark:this.edit_detail_info.meeting_info.remark,
					is_chat_notice:this.edit_detail_info.meeting_info.is_chat_notice
				}
				let user_ids = this.selected_user.map(item => {
					return item.emplId
				})
				edit_meeting_info['user_ids'] = user_ids.join(',');
				resource.meetingEditPost(edit_meeting_info).then(res => {
					if(res.data.code == 1){
						this.$message.success(res.data.msg);
						this.$refs.editDialog.show_dialog = false;
						this.$emit('reload');
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击编辑会议室
			editMetting(){
				resource.editMettingRoomGet({meeting_room_id:this.info.meeting_room_id}).then(res => {
					if(res.data.code == 1){
						this.edit_info = res.data.data;
						this.$refs.eDialog.show_dialog = true;
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
							this.$refs.eDialog.show_dialog = false;
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
						this.$emit('reload');
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
						this.detail_info['time'] = filterMeetingTime(this.detail_info.start_time,this.detail_info.end_time);
						this.active_index = 0;
						let cyr_list = this.detail_info.user_list.map(item => {
							return item.user_name
						})
						this.cyr_list = cyr_list.join('、');
						// 所有人
						this.signin_list = this.detail_info.user_list;
						this.total_num = this.signin_list.length;
						//已签到的人
						let sign_list = this.detail_info.user_list.filter(item => {
							return item.status == 1;
						})
						this.sign_num = sign_list.length;
						//未签到的人
						let unsign_list = this.detail_info.user_list.filter(item => {
							return item.status == 0;
						})
						this.unsign_num = unsign_list.length;

						this.$refs.dDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换导航
			checkTab(item,index){
				this.active_index = index;
				if(item.id == '-1'){
					this.signin_list = this.detail_info.user_list
				}else{
					this.signin_list = this.detail_info.user_list.filter(i => {
						return i.status == item.id;
					})
				}
			},
			//点击签到
			meetingCode(){
				resource.meetingCode({meeting_id:this.info.meeting_id}).then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.meeting_code = data.meeting_code.replaceAll("\r|\n", "");
						this.user_list = data.user_list;
						this.user_list.map(item => {
							if(item.status == 1){
								this.sign_list.push(item);
							}else{
								this.unsign_list.push(item);
							}
						})
						this.current_list = this.user_list;

						//创建webscoket链接
						let websocket_url = data.websocket_url;
						this.ws = new WebSocket(websocket_url)

						this.ws.onopen = () => {
							console.log('已连接')
						}

						this.ws.onmessage = (evt) => {
							let user_info = JSON.parse(evt.data);

							let c_list = this.user_list.filter(item => {
								return item.user_id == user_info.user_ding_id;
							})

							if(c_list.length == 0){		//不是参会人员
								let new_user = {
									sign_in_time:user_info.sign_in_time,
									status: 1,
									user_id: user_info.user_ding_id,
									user_name: user_info.user_name
								}
								this.sign_list.unshift(new_user);
								this.user_list.unshift(new_user);
								this.$message.success(`【${user_info.user_name}】已签到!`)
							}else{
								if(c_list[0].status == 1){
									this.$message.success(`【${c_list[0].user_name}】已签到!`)
								}else{
									let i = this.unsign_list.findIndex(item => {
										return item.user_id == c_list[0].user_id;
									})
									this.unsign_list.splice(i,1);

									let i_i = this.user_list.findIndex(item => {
										return item.user_id == c_list[0].user_id;
									})
									this.user_list.splice(i_i,1);
									let new_user = {
										sign_in_time:user_info.sign_in_time,
										status: 1,
										user_id: user_info.user_ding_id,
										user_name: user_info.user_name
									}
									this.sign_list.unshift(new_user);
									this.user_list.unshift(new_user);
									this.$message.success(`【${c_list[0].user_name}】已签到!`)
								}
							}
						}

						this.ws.onclose = function () {
							console.log('已关闭')
						}

						this.$refs.sDialog.show_dialog = true;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//关闭签到弹窗
			closeSignDialog(){
				this.sign_active_index = 0;
				this.user_list = [];			//所有用户列表
				this.current_list = [];			//当前显示的用户列表
				this.sign_list = [];			//签到弹窗已签到的用户列表
				this.unsign_list = [];			//签到弹窗未签到的用户列表
				this.ws.close();
			},
			//签到弹窗切换导航
			signCheckTab(item,index){
				this.sign_active_index = index;
				this.current_list = index == 0?this.user_list:index == 1?this.sign_list:this.unsign_list;
			},
			//上传文件
			uploadFile(){
				if (this.$refs.fileUpload.files.length > 0) {
					let files = this.$refs.fileUpload.files;
					let arg = {
						image:files[0],
						type:'3'
					}
					resource.uploadFile(arg).then(res => {
						if(res.data.code == 1){
							let file = res.data.data;
							this.detail_info.meeting_files.push(file.urls);
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//删除文件
			deleteFile(index){
				this.detail_info.meeting_files.splice(index,1);
			},
			//更新会议纪要
			updateMinutes(){
				if(this.detail_info.meeting_files.length == 0){
					this.$message.warning('至少上传一个附件!');
					return;
				}
				if(!this.detail_info.meeting_minutes){
					this.$message.warning('请输入会议记录!');
					return;
				}
				let arg = {
					meeting_id:this.detail_info.meeting_id,
					meeting_files:this.detail_info.meeting_files.join(','),
					meeting_minutes:!this.detail_info.meeting_minutes?'':this.detail_info.meeting_minutes
				}
				resource.updateMinutes(arg).then(res => {
					if(res.data.code == 1){
						this.$refs.dDialog.show_dialog = false;
						this.$message.success(res.data.msg);
						this.$emit('reload');
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击下载会议附件
			downLoad(link){
				window.open(this.domain  + link);
			},
			//点击预览会议附件
			viewFile(link){
				let view_url = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(this.domain  + link)}&wdOrigin=BROWSELINK`;
				window.open(view_url);
			},
			//点击导出参会人
			exportUser(){
				let baseURL = `${location.origin}/api/meeting/meeting_user_export?meeting_id=${this.info.meeting_id}`;
				dd.ready(() => {
					dd.biz.util.downloadFile({
						url: baseURL, 
						name: `参会人列表-${getNowDate()}.xlsx`, 
						onProgress: function(msg){
						},
						onSuccess : (result) => {
							this.$message.success('导出成功!')
						},
						onFail : function() {}
					})
				})
			},
			//点击展示二维码
			getQrCode(qrcode_url){
				this.qrcode_url = qrcode_url;
				this.$refs.qrDialog.show_dialog = true;
			},
			//下载二维码
			downQrcode(){
				let image_ele = document.getElementById(`imageWrapper_${this.info.meeting_room_name}`);
				html2Canvas(image_ele,{
      				useCORS: true, //  默认值 false 是否尝试使用CORS从服务器加载图像
      			}).then(canvas => {
      				const imageurl = canvas.toDataURL('image/png',1.0);
				    const aLink = document.createElement('a') // 创建a标签
				    aLink.style.display = 'none'
				    aLink.href = imageurl
				    aLink.download = `${this.info.meeting_room_name}.png` // 下载文件名
				    document.body.appendChild(aLink)
				    aLink.click()
				    document.body.removeChild(aLink) // 用完后移除元素
				})
      		},
			//点击下载模版
			downTemp(){
				dd.ready(() => {
					dd.biz.util.downloadFile({
						url: `${location.origin}/api/meeting/down_template?meeting_id=${this.info.meeting_id}`, 
				    	name: `${this.info.meeting_title}-会议记录模板.docx`, //定义下载文件名字
				    	onProgress: function(msg){
				    	},
				    	onSuccess : (result) => {
				    		this.$message.success('下载成功')
				    	},
				    	onFail : function() {}
				    })
				})
			}
		},
		filters:{
			status(v){
				let tab_list = [{
					name:'已预定',
					id:'1'
				},{
					name:'进行中',
					id:'2'
				},{
					name:'已结束',
					id:'3'
				},{
					name:'已取消',
					id:'4'
				}]
				let arr = tab_list.filter(item => {
					return item.id == v;
				})
				return arr.length > 0?arr[0].name:"-";
			}
		},
		components:{
			DefaultImage,
			SelectTime,
			CDialog,
			PageTab,
			Add
		}
	}
</script>
<style>
.sign_dialog .el-dialog__body{
	padding: 0!important;
}
</style>
<style lang="less" scoped>
.status_tag{
	margin-right: 5px;
	border-radius: 12px;
	padding-left: 5px;
	padding-right: 5px;
	height: 18px;
	line-height: 18px;
}
.yyd{
	border:1px solid #2A37FD;
	background-color: #2A37FD;
	color: #ffffff;
}
.jxz{
	border:1px solid #2A37FD;
	background-color: #E8EFFF;
	color: #2A37FD;
}
.yjs{
	border:1px solid #7A82FF;
	background-color: #EEF3FF;
	color: #7A82FF;
}
.yqx{
	border:1px solid #999999;
	background-color: #F2F2F2;
	color: #999999;
}
.people_icon{
	width: 18px;
	height: 18px;
}
.position_icon{
	width: 16px;
	height: 19px;
}
.time_icon{
	width: 16px;
	height: 16px;
}
.admin_user_icon{
	width: 17px;
	height: 15px;
}
.link_icon{
	width: 17px;
	height: 15px;
}
.tab_item{
	height: 30px;
	.active_line{
		background-color: #2A37FD;
		height: 2px;
	}
}
.picture{
	background-color: #DFEAFF;
	border-radius: 50%;
	width: 50px;
	text-align: center;
	height: 50px;
	line-height: 50px;
}
.minutes_icon{
	width: 27px;
	height: 31px;
}
.minutes_row{
	height: 46px;
}
.upload_box{
	width: 55px;
	position: relative;
	.upload_file{
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
.sign_box{
	height: 390px;
	.left_box{
		border-right: 1px solid rgba(0,0,0,0.15);
		width: 224px;
		.qrcode{
			border-bottom: 1px solid rgba(0,0,0,0.15);
			height: 224px;
			.qrcode_img{
				width: 150px;
				height: 150px;
			}
		}
	}
	.sign_tab{
		height: 46px;
		border-bottom: 1px solid rgba(0,0,0,0.15);
	}
	.user_list{
		padding:8px 12px;
		.user_item{
			padding-top: 8px;
			padding-bottom: 8px;
		}
	}
}
.qrcode_url{
	width: 300px;
	height: 300px;
}
.meeting_room_name{
	margin-bottom: 30px;
	font-size: 36px;
	color: #333333;
	font-weight: bold;
}
</style>