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
				<el-button type="primary" size="small">添加</el-button>
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
						<el-button type="text" size="small" v-if="scope.row.edit_status == 1">编辑</el-button>
						<el-button type="text" size="small" v-if="scope.row.edit_status == 1">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-size="pagesize" :pager-count="11" :page-sizes="[5, 10, 15, 20]" layout="total, sizes, prev, pager, next, jumper" :total="dataObj.total">
				</el-pagination>
			</div>
		</el-card>
		<el-dialog title="添加" width="440px" :visible.sync="show_dialog">
			<el-form size="small">
				<el-form-item label="子管理员">
					<el-radio-group v-model="type">
						<el-radio :label="1">是</el-radio>
						<el-radio :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="show_dialog = false">取 消</el-button>
				<el-button size="small" type="primary" @click="show_dialog = false">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				name:"",						//输入的姓名
				page:1,
				pagesize:10,
				dataObj:{},						//列表数据
				loading:false,
				show_dialog:true,				
				type:1,							//是否子管理员
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
			
		}
	}
</script>
<style lang="less" scoped>

</style>