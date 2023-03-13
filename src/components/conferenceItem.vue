<template>
	<div>
		<el-card class="p_none pt-10 pr-10 pb-10 pl-10 mb-6" shadow="hover">
			<div class="flex">
				<DefaultImage :info="info"/>
				<div class="flex-1 flex fc jsb">
					<!-- 名称 -->
					<div class="flex ac">
						<div class="f16 mr-8 fw-500">{{type == 3?info.meeting_title:info.meeting_room_name}}</div>
						<div class="status_tag f12" :class="[{'yyd':info.status == '1'},{'jxz':info.status == '2'},{'yjs':info.status == '3'},,{'yqx':info.status == '4'}]" v-if="meeting_status == '0' && $route.path == '/record'">{{info.status | status}}</div>
					</div>
					<!-- 设备 -->
					<div class="f14" v-if="type == 1 || type == 2">{{info.equipment_str}}</div>
					<!-- 地址 -->
					<div class="flex ac" v-if="type == 3">
						<img class="position_icon mr-6" src="../static/position_icon.png">
						<div class="f14">{{info.meeting_address}}</div>
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
				</div>
				<!-- 会议室管理 -->
				<div class="flex ac" v-if="type == 2">
					<el-button type="text" @click="editMetting">编辑</el-button>
					<el-button type="text" @click="updateFn(info.status == 1?2:1,info.status == 1?'禁用':'启用')">{{info.status == 1?'禁用':'启用'}}</el-button>
					<el-button type="text" @click="updateFn(0,'删除')">删除</el-button>
				</div>
				<!-- 会议记录 -->
				<div class="flex ac" v-if="type == 3">
					<el-button type="text" @click="editFn(info.meeting_id)" v-if="info.status == 1 && info.is_self == 1">编辑</el-button>
					<el-button type="text" @click="meetingCode" v-if="info.is_sign">签到</el-button>
					<el-button type="text" @click="$refs.CDialog.show_dialog = true" v-if="info.cancle_status == 1">取消日程</el-button>
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
			<el-select v-model="edit_detail_info.meeting_info.notice_type_id">
				<el-option v-for="item in edit_detail_info.notice_type" :label="item.name" :value="item.id">
				</el-option>
			</el-select>
			<el-checkbox style="margin-left: 10px" v-model="edit_detail_info.meeting_info.is_chat_notice" :true-label="1" :false-label="0">单聊通知参与人</el-checkbox>
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
			<div class="upload_box">
				<el-button size="mini" type="text">添加附件</el-button>
				<input type="file" ref="fileUpload" class="upload_file" @change="uploadFile">
			</div>
			<div class="flex ac" v-for="(item,index) in detail_info.meeting_files">
				<img class="link_icon mr-6" src="../static/link_icon.png">
				<el-button class="f14" size="mini" type="text" @click="downLoad(item)">{{item.split('/')[1]}}</el-button>
				<el-button size="mini" type="text" @click="deleteFile(index)">删除</el-button>
			</div>
			<el-input class="mb-10" type="textarea" :rows="5" placeholder="请输入会议记录" v-model="detail_info.meeting_minutes">
			</el-input>
			<el-button size="small" type="primary" plain @click="updateMinutes">保存</el-button>
		</div>
		<!-- 不可编辑 -->
		<div class="flex ac mt-10" v-else>
			<img class="minutes_icon mr-15" src="../static/minutes_icon.png">
			<el-button size="mini" type="text" @click="$refs.mDialog.show_dialog = true">查看会议纪要</el-button>
		</div>
		<el-divider></el-divider>
		<div class="flex mb-15">
			<div class="tab_item mr-60 relative pointer" v-for="(item,index) in tab_list" @click="checkTab(item,index)">
				<div class="fw-500" :class="{'primary_color':active_index == index}">{{item.name}}({{item.id == 1?sign_num:unsign_num}})</div>
				<div class="active_line absolute bottom-0 width-100" v-if="active_index == index"></div>
			</div>
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
					<el-button size="mini" type="text" @click="downLoad(item)">下载</el-button>
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
</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';

	import {filterMeetingTime,exportPost} from '../utils.js'

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
					name:'已签到',
					id:'1'
				},{
					name:'未签到',
					id:'0'
				}],						//签到状态导航
				active_index:0,			//默认选中的导航下标
				sign_active_index:0,	//签到弹窗的默认下标
				signin_list:[],			//当前已签到和未签到的用户列表
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
				},	//编辑会议的详情
				startTime:"",
				endTime:"",
				selected_user:[],
				pickedUsers:[],			//当前已选中的用户
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
						this.$refs.editDialog.show_dialog = true;
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
				let edit_meeting_info = {
					meeting_id:this.edit_detail_info.meeting_info.meeting_id,
					meeting_title:this.edit_detail_info.meeting_info.meeting_title,
					notice_type:this.edit_detail_info.meeting_info.notice_type_id,
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
						this.signin_list = this.detail_info.user_list.filter(i => {
							return i.status == '1';
						})
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
				this.signin_list = this.detail_info.user_list.filter(i => {
					return i.status == item.id;
				})
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
						this.current_list = this.sign_list;

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

							if(c_list.length == 0){
								// this.$message.warning(`【${user_info.user_name}】不是参会人员!`)
								let new_user = {
									sign_in_time:user_info.sign_in_time,
									status: 1,
									user_id: user_info.user_ding_id,
									user_name: user_info.user_name
								}
								this.sign_list.unshift(new_user);
								this.$message.success(`【${user_info.user_name}】已签到!`)
							}else{
								if(c_list[0].status == 1){
									this.$message.success(`【${c_list[0].user_name}】已签到!`)
								}else{
									let i = this.unsign_list.findIndex(item => {
										return item.user_id == c_list[0].user_id;
									})
									this.unsign_list.splice(i,1);
									let new_user = {
										sign_in_time:user_info.sign_in_time,
										status: 1,
										user_id: user_info.user_ding_id,
										user_name: user_info.user_name
									}
									this.sign_list.unshift(new_user);
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
				this.current_list = index == 0?this.sign_list:this.unsign_list;
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
				let arg = {
					meeting_id:this.detail_info.meeting_id,
					meeting_files:this.detail_info.meeting_files.join(','),
					meeting_minutes:!this.detail_info.meeting_minutes?'':this.detail_info.meeting_minutes
				}
				resource.updateMinutes(arg).then(res => {
					if(res.data.code == 1){
						this.$refs.dDialog.show_dialog = false;
						this.$message.success(res.data.msg);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击下载会议附件
			downLoad(link){
				window.open(this.domain  + link);
			},
			//点击导出参会人
			exportUser(){
				resource.meetingUserExport({meeting_id:this.info.meeting_id}).then(res => {
					exportPost("\ufeff" + res.data,'参会人列表');
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
	border-radius: 12px;
	width: 50px;
	text-align: center;
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

</style>