<template>
	<div class="flex fc height-100">
		<div class="mb_none white_back pl-30 pt-10 pb-10 mb-6 flex ac">
			<el-form :inline="true" size="mini">
				<el-form-item label="日期:">
					<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="handleCurrentChange(1)">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="部门：">
					<div class="dept_box" @click="checkDept">
						<div class="text-overflow">{{dept_ids.length > 0?dept_names:'请选择部门'}}</div>
						<i class="el-icon-error f16" v-if="dept_ids.length > 0" @click.stop="clearDepts"></i>
						<img class="right_arrow" src="../../static/right_arrow.png" v-else>
					</div>
				</el-form-item>
				<el-form-item label="姓名：">
					<el-input v-model="search" clearable placeholder="搜索姓名" @change="handleCurrentChange(1)"></el-input>
				</el-form-item>
			</el-form>
		</div>
		<PageTab :tab_list="tab_list" @checkTab="checkTab"/>
		<el-card class="flex-1">
			<!-- 员工会议列表 -->
			<el-table size="mini" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading" v-if="metting_type == '1'">
				<el-table-column prop="user_name" label="姓名" align="center">
				</el-table-column>
				<el-table-column prop="organization_num" label="组织会议次数" align="center">
				</el-table-column>
				<el-table-column prop="join_num" label="相关会议次数" align="center">
				</el-table-column>
			</el-table>
			<!-- 部门会议列表 -->
			<el-table size="mini" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading" v-else>
				<el-table-column prop="main_dept" label="部门" align="center">
				</el-table-column>
				<el-table-column prop="num" label="会议次数" align="center">
				</el-table-column>
				<el-table-column prop="submit_num" label="会议纪要已提交次数" align="center">
				</el-table-column>
				<el-table-column prop="un_submit_num" label="会议纪要未提交次数" align="center">
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
				</el-pagination>
			</div>
		</el-card>
	</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';

	import {getNowDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate} from '../../utils.js'

	import resource from '../../api/resource.js'

	import PageTab from '../../components/pageTab.vue'
	export default{
		data(){
			return{
				tab_list:[{
					name:'员工会议统计',
					id:'1'
				},{
					name:'部门会议统计',
					id:'2'
				}],								//导航列表
				metting_type:'1',				//当前选中的导航类型
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getNowDate();
							picker.$emit('pick', [start, end]);
						}
					},{
						text: '上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(1);
							const end = getLastMonthEndDate(0);
							picker.$emit('pick', [start, end]);
						}
					}, {
						text: '上上个月',
						onClick(picker) {
							const start = getLastMonthStartDate(2);
							const end = getLastMonthEndDate(1);
							picker.$emit('pick', [start, end]);
						}
					}]
				},	 							//时间区间
				date:[],						//日期
				dept_names:"",
				dept_ids:[],					//选中的部门
				search:"",						//搜索会议室
				page:1,
				pagesize:10,
				dataObj:{},						//列表数据
				loading:false,
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
		created(){
			//获取列表
			this.statisticsList();
		},
		methods:{
			//点击选择部门
			checkDept(){
				dd.ready(() => {
					dd.biz.contact.departmentsPicker({
					    title:"选择部门",            //标题
					    corpId:this.corpId,        	//企业的corpId
					    multiple:true,              //是否多选
					    limitTips:"超出了",          //超过限定人数返回提示
					    maxDepartments:1000,        //最大选择部门数量
					    pickedDepartments:this.dept_ids,       //已选部门
					    disabledDepartments:[],     //不可选部门
					    requiredDepartments:[],     //必选部门（不可取消选中状态）
					    appId:this.appId,           //微应用的Id
					    permissionType:"GLOBAL",    //选人权限，目前只有GLOBAL这个参数
					    onSuccess: (result) => {
					    	let depts = result.departments;
					    	let dept_names = [];
					    	this.dept_ids = [];
					    	depts.map(item => {
					    		dept_names.push(item.name);
					    		this.dept_ids.push(item.id);
					    	})
					    	this.dept_names = dept_names.join(',');
					    	this.statisticsList();
					    },
					    onFail : function(err) {}
					});
				})
			},
			//点击清空选中部门
			clearDepts(){
				this.dept_names = "";
				this.dept_ids = [];
				this.statisticsList();
			},
			//切换导航
			checkTab(item){
				this.metting_type = item.id;
				this.page = 1;
				this.pagesize = 10;
				this.dataObj = {};						//列表数据
				//获取列表
				this.statisticsList()
			},
			//获取列表
			statisticsList(){
				let arg = {
					username:this.search,
					dept_id:this.dept_ids.join(','),
					start_date:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				if(this.metting_type == '1'){	//员工会议统计
					resource.statisticsList(arg).then(res => {
						if(res.data.code == 1){
							this.loading = false;
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}else{					//部门会议统计
					resource.statisticsDeptList(arg).then(res => {
						if(res.data.code == 1){
							this.loading = false;
							this.dataObj = res.data.data;
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
				
			},
			//分页
			handleSizeChange(val) {
				this.pagesize = val;
				//获取列表
				this.statisticsList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.statisticsList();
			},
			
		},
		components:{
			PageTab
		}
	}
</script>
<style lang="less" scoped>
.dept_box{
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 220px;
	height: 28px;
	padding: 0 16px;
	background: #FFFFFF;
	border-radius: 2px;
	font-size: 12px;
	color: #606266;
	border: 1px solid rgba(0,0,0,0.15);
	.right_arrow{
		width: 14px;
		height: 14px;
	}
}
</style>