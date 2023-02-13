<template>
	<div class="flex fc height-100">
		<el-card class="tab_card mb-15" shadow="never">
			<el-form :inline="true" size="mini">
				<el-form-item label="日期:">
					<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="handleCurrentChange(1)">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="部门：">
					<el-select v-model="dept_id" clearable multiple filterable collapse-tags placeholder="请选择部门" @change="handleCurrentChange(1)">
						<el-option v-for="item in dept_list" :key="item.main_dept_id" :label="item.main_dept" :value="item.main_dept_id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="姓名：">
					<el-input v-model="search" clearable placeholder="搜索姓名" @change="handleCurrentChange(1)"></el-input>
				</el-form-item>
			</el-form>
		</el-card>
		<el-card class="flex-1">
			<el-table size="mini" :data="dataObj.data" tooltip-effect="dark" style="width: 100%" :header-cell-style="{'background':'#f4f4f4'}" v-loading="loading">
				<el-table-column prop="user_name" label="姓名" align="center">
				</el-table-column>
				<el-table-column prop="organization_num" label="组织会议次数" align="center">
				</el-table-column>
				<el-table-column prop="join_num" label="相关会议次数" align="center">
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
	import {getNowDate,getMonthStartDate,getCurrentDate,getLastMonthStartDate,getLastMonthEndDate} from '../../utils.js'

	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				pickerOptions: {
					shortcuts: [{
						text: '当月',
						onClick(picker) {
							const start = getMonthStartDate();
							const end = getCurrentDate();
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
				date:[getNowDate(),getNowDate()],						//日期
				dept_list:[],					//部门列表
				dept_id:[],						//选中的部门
				search:"",						//搜索会议室
				page:1,
				pagesize:10,
				dataObj:{},						//列表数据
				loading:false,
			}
		},
		created(){
			//获取部门列表和会议室级别
			this.ajaxDeptLevel();
			//获取列表
			this.statisticsList();
		},
		methods:{
			//获取部门列表和会议室级别
			ajaxDeptLevel(){
				resource.ajaxDeptLevel().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.dept_list = data.dept_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//获取列表
			statisticsList(){
				let arg = {
					username:this.search,
					dept_id:this.dept_id.join(','),
					start_date:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.statisticsList(arg).then(res => {
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
				this.statisticsList();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.statisticsList();
			},
			
		}
	}
</script>
<style lang="less" scoped>

</style>