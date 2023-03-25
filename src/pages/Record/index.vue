<template>
	<div class="flex fc height-100">
		<div class="p_none mb_none white_back pl-30 pt-10 pb-10 mb-6 flex ac">
			<el-form :inline="true" size="mini">
				<el-form-item label="会议类型：">
					<el-select v-model="type" style="width: 130px" placeholder="请选择会议类型" @change="meetingRecord(true)">
						<el-option v-for="item in type_list" :key="item.id" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="日期:">
					<el-date-picker v-model="date" type="daterange" unlink-panels value-format="yyyy-MM-dd" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" @change="meetingRecord(true)">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="部门：">
					<div class="dept_box" @click="checkDept">
						<div class="dept_check text-overflow">{{dept_ids.length > 0?dept_names:'请选择部门'}}</div>
						<i class="el-icon-error f16" v-if="dept_ids.length > 0" @click.stop="clearDepts"></i>
						<img class="right_arrow" src="../../static/right_arrow.png" v-else>
					</div>
				</el-form-item>
				<el-form-item label="搜索会议：">
					<el-input v-model="search" style="width: 130px" clearable placeholder="搜索会议主题" @change="meetingRecord(true)"></el-input>
				</el-form-item>
				<el-form-item label="会议纪要：">
					<el-select v-model="filling_status" style="width: 130px" placeholder="请选择" clearable @change="meetingRecord(true)">
						<el-option label="已填报" :value="1"></el-option>
						<el-option label="未填报" :value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="级别：">
					<el-checkbox-group v-model="meeting_level" @change="meetingRecord(true)">
						<el-checkbox :label="item.meeting_level_id" v-for="item in meeting_level_list">{{item.meeting_level_name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</div>
		<PageTab :tab_list="tab_list" @checkTab="checkTab"/>
		<div class="mt-10 scroll-y hide_scrollbar" v-if="list.length > 0">
			<ConferenceItem type="3" :info="item" :meeting_status="meeting_status" v-for="item in list" @reload="meetingRecord"/>
		</div>
		<EmptyPage class="mt-10" :loading="loading" v-else/>
		<div class="page">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="total">
			</el-pagination>
		</div>
	</div>
</template>
<script>
	import * as dd from 'dingtalk-jsapi';

	import {getNowDate,getMonthStartDate,getLastMonthStartDate,getLastMonthEndDate,filterMeetingTime} from '../../utils.js'
	import PageTab from '../../components/pageTab.vue'
	import ConferenceItem from '../../components/conferenceItem.vue'
	import EmptyPage from '../../components/empty_page.vue'

	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				type_list:[{
					id:'0',
					name:'全部'
				},{
					id:'1',
					name:'我发起的'
				},{
					id:'2',
					name:'我参与的'
				}],								//会议类型列表
				type:"0",						//选中的会议类型
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
				dept_ids:[],						//选中的部门
				meeting_level_list:[],			//会议级别
				meeting_level:[],				//选中的会议级别
				search:"",						//搜索会议室
				filling_status:'',				//会议纪要
				tab_list:[{
					name:'全部',
					id:'0'
				},{
					name:'已预定',
					id:'1'
				},{
					name:'进行中',
					id:'2'
				},{
					name:'已结束',
					id:'3'
				}],								//导航列表
				meeting_status:"0",				//当前选中的导航
				page:1,
				pagesize:10,
				list:[],						//会议室列表
				loading:true,
				total:0
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
			//获取部门列表和会议室级别
			this.ajaxDeptLevel(); 
			//获取会议记录
			this.meetingRecord(true);
		},
		methods:{
			//获取部门列表和会议室级别
			ajaxDeptLevel(){
				resource.ajaxDeptLevel().then(res => {
					if(res.data.code == 1){
						let data = res.data.data;
						this.meeting_level_list = data.meeting_level_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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
					    	this.meetingRecord(true);
					    },
					    onFail : function(err) {}
					});
				})
			},
			//点击清空选中部门
			clearDepts(){
				this.dept_names = "";
				this.dept_ids = [];
				this.meetingRecord(true);
			},
			//切换导航
			checkTab(item){
				this.meeting_status = item.id;
				//获取会议记录
				this.meetingRecord(true);
			},
			//获取会议记录
			meetingRecord(is_reload){
				if(is_reload){
					this.list = [];
					this.page = 1;
				}
				let arg = {
					type:this.type,
					dept_id:this.dept_ids.join(','),
					meeting_status:this.meeting_status,
					meeting_level:this.meeting_level.join(','),
					start_date:this.date && this.date.length > 0?this.date[0]:"",
					end_date:this.date && this.date.length > 0?this.date[1]:"",
					search:this.search,
					filling_status:this.filling_status,
					page:this.page,
					pagesize:this.pagesize
				}
				this.loading = true;
				resource.meetingRecord(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let data = res.data.data;
						data.data.map(item => {
							item['time'] = filterMeetingTime(item.start_time,item.end_time,item.week);
							item['is_sign'] = getNowDate() == item.start_time.split(' ')[0] && item.status != 0
						})
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
				this.meetingRecord();
			},
			handleCurrentChange(val) {
				this.page = val;
				//获取列表
				this.meetingRecord();
			}
		},
		components:{
			PageTab,
			ConferenceItem,
			EmptyPage
		}
	}
</script>
<style lang="less" scoped>
.dept_box{
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 130px;
	height: 28px;
	padding: 0 16px;
	background: #FFFFFF;
	border-radius: 3px;
	font-size: 12px;
	border: 1px solid rgba(0,0,0,0.15);
	.dept_check{
		color: rgba(0,0,0,0.35);
	}
	.right_arrow{
		width: 14px;
		height: 14px;
	}
}
</style>