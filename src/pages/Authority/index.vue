<template>
	<div class="flex fc height-100">
		<div class="mb_none white_back pl-30 pt-10 pb-10 mb-6 flex ac">
			<el-form :inline="true" size="mini">
				<el-form-item label="姓名：">
					<el-input v-model="name" clearable placeholder="搜索姓名" @change="handleCurrentChange(1)"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<el-card class="flex-1">
			<div class="flex ac jsb mb-14">
				<div class="f14 fw-500">数据列表</div>
				<el-button type="primary" size="small" @click="editUser('1')">添加</el-button>
			</div>
			<el-table size="mini" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
				<el-table-column prop="username" label="姓名" align="center">
				</el-table-column>
				<el-table-column label="子管理员" align="center">
					<template slot-scope="scope">
						<div>{{scope.row.type == 1?'是':'否'}}</div>
					</template>
				</el-table-column>
				<el-table-column prop="dept_names" label="数据权限" align="center">
				</el-table-column>
				<el-table-column label="操作" align="center">
					<template slot-scope="scope">
						<el-button type="text" size="small" v-if="scope.row.edit_status == 1" @click="editUser('2',scope.row.user_id)">编辑</el-button>
						<el-button type="text" size="small" v-if="scope.row.edit_status == 1" @click="delUser(scope.row.user_id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
				</el-pagination>
			</div>
		</el-card>
		<!-- 确认会议室详情 -->
		<c-dialog title="杭州德儿电子商务有限公司" width="440px" :cancel="false" @cancleFn="$refs.CDialog.show_dialog = false" confirmText="确定" @confirmFn="confirmFn" @closeDialog="closeDialog" ref="CDialog">
			<el-form size="small">
				<el-form-item label="姓名：">
					<el-tag size="medium" type="info" :closable="dialog_type == '1'" @close="deleteUser" v-if="pickedUsers.length > 0">
						{{user_name}}
					</el-tag>
					<el-button size="small" @click="checkUser" v-else>选择员工<i class="el-icon-arrow-right el-icon--right"></i></el-button>
				</el-form-item>
				<el-form-item label="子管理员：">
					<el-radio-group v-model="type">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="数据权限：">
					<el-tag class="mr-6" size="medium" closable v-for="(item,index) in depts_name" @close="deleteDept(index)">
						{{item}}
					</el-tag>
					<el-button size="mini" @click="checkDept">{{button_name}}<i class="el-icon-arrow-right el-icon--right"></i></el-button>
					<el-checkbox style="margin-left: 10px" v-model="is_all">全部</el-checkbox>
				</el-form-item>
			</el-form>
		</c-dialog>
	</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';
	import resource from '../../api/resource.js'

	import CDialog from '../../components/cDialog.vue'
	export default{
		data(){
			return{
				name:"",						//输入的姓名
				page:1,
				pagesize:10,
				dataObj:{},						//列表数据
				loading:false,
				dialog_type:'',					//弹窗类型（1:添加；2:编辑）
				user_name:"",					//已选的用户姓名
				pickedUsers:[],					//已选的用户
				type:1,							//是否子管理员
				depts_name:[],					//已选的部门名称
				pickedDepts:[],					//已选的部门
				button_name:"选择部门",			//选择部门按钮文字
				is_all:false,					//是否全部部门
			}
		},
		computed:{
			//appId
			appId(){
				return this.$store.state.appId;
			},
			//corpId
			corpId(){
				return this.$store.state.corpId;
			},
		},
		watch:{
			//切换是否全部部门
			is_all:function(n,o){
				if(n){
					this.button_name = "全部部门";
					this.depts_name = [];					//已选的部门名称
					this.pickedDepts = [];					//已选的部门
				}else{
					this.button_name = "选择部门";
				}
			}
		},
		created(){
			//获取列表
			this.userList();
		},
		methods:{
			//获取列表
			userList(){
				let arg = {
					name:this.name
				}
				this.loading = true;
				resource.userList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						this.dataObj = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.userList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.userList();
			},
			//添加或编辑用户
			editUser(type,user_id){
				this.dialog_type = type;
				if(type == '1'){
					this.$refs.CDialog.show_dialog = true;
				}else{
					resource.editUserGet({user_id:user_id}).then(res => {
						if(res.data.code == 1){
							let data = res.data.data;
							this.user_name = data.username;		//已选的用户姓名
							this.pickedUsers.push(user_id);		//已选的用户
							this.type = data.type;				//是否子管理员
							this.is_all = data.dept_ids == '-1';
							//已选的部门
							this.pickedDepts = data.dept_ids == '-1'?[]:data.dept_ids.split(',');	
							//已选的部门名称
							this.depts_name = data.dept_ids == '-1'?[]:data.dept_names.split(',');	
							this.$refs.CDialog.show_dialog = true;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//创建或编辑选择员工
			checkUser(){
				dd.ready(() => {
					dd.biz.contact.complexPicker({
					    title:"选择员工",            		//标题
					    corpId:this.corpId,  			//企业的corpId
					    multiple:false,            		//是否多选
					    limitTips:"超出了",          		//超过限定人数返回提示
					    maxUsers:1,            			//最大可选人数
					    pickedUsers:[],   				//已选用户
					    pickedDepartments:this.pickedDepts,          	//已选部门
					    disabledUsers:[],            	//不可选用户
					    disabledDepartments:[],        	//不可选部门
					    requiredUsers:[],				//必选用户（不可取消选中状态）
					    requiredDepartments:[],        	//必选部门（不可取消选中状态）
					    appId:this.appId,           //微应用Id，企业内部应用查看AgentId
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
			//设置当前选中的员工
			setPickedUsers(users){
				this.pickedUsers = [];
				this.user_name = users.length > 0?users[0].name:'';				
				if(users.length > 0){
					this.pickedUsers.push(users[0].emplId);
				}	
			},
			//删除当前选中的员工
			deleteUser(){
				this.pickedUsers = [];
				this.user_name = "";
			},
			//点击选择部门
			checkDept(){
				dd.ready(() => {
					dd.biz.contact.departmentsPicker({
					    title:"选择部门",            //标题
					    corpId:this.corpId,        	//企业的corpId
					    multiple:true,              //是否多选
					    limitTips:"超出了",          //超过限定人数返回提示
					    maxDepartments:1000,        //最大选择部门数量
					    pickedDepartments:[],       //已选部门
					    disabledDepartments:[],     //不可选部门
					    requiredDepartments:[],     //必选部门（不可取消选中状态）
					    appId:this.appId,           //微应用的Id
					    permissionType:"GLOBAL",    //选人权限，目前只有GLOBAL这个参数
					    onSuccess: (result) => {
					    	let depts = result.departments;
					    	depts.map(item => {
					    		this.depts_name.push(item.name);
					    		this.pickedDepts.push(item.id);
					    	})
					    },
					    onFail : function(err) {}
					});
				})
			},
			//删除部门
			deleteDept(index){
				this.depts_name.splice(index,1);
				this.pickedDepts.splice(index,1);
			},
			//关闭创建和编辑
			closeDialog(){
				this.is_all = false;
				this.user_name = "";					//已选的用户姓名
				this.pickedUsers = [];					//已选的用户
				this.type = 1;							//是否子管理员
				this.depts_name = [];					//已选的部门名称
				this.pickedDepts = [];					//已选的部门
			},
			//创建和编辑确定
			confirmFn(){
				if(this.pickedUsers.length == 0){
					this.$message.warning('请选择员工！');
				}else if(this.pickedDepts.length == 0){
					this.$message.warning('请选择部门！');
				}else{
					let arg = {
						user_id:this.pickedUsers[0],
						type:this.type,
						dept_ids:this.is_all?'-1':this.pickedDepts.join(',')
					}
					if(this.dialog_type == '1'){	//添加
						resource.addUser(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.$refs.CDialog.show_dialog = false;
								//获取列表
								this.userList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}else{							//编辑
						resource.editUserPost(arg).then(res => {
							if(res.data.code == 1){
								this.$message.success(res.data.msg);
								this.$refs.CDialog.show_dialog = false;
								//获取列表
								this.userList();
							}else{
								this.$message.warning(res.data.msg);
							}
						})
					}

				}
			},
			//点击删除用户
			delUser(user_id){
				this.$confirm('确认删除该用户?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					resource.delUser({user_id:user_id}).then(res => {
						if(res.data.code == 1){
							this.$message.success(res.data.msg);
							//获取列表
							this.userList();
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消删除'
					});          
				});
			}
		},
		components:{
			CDialog
		}
	}
</script>
<style lang="less" scoped>

</style>