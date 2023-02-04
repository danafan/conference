<template>
	<div class="flex fc height-100">
		<el-card shadow="never">
			<el-form :inline="true" size="mini">
				<el-form-item label="时间：">
					<el-date-picker v-model="date" type="date" value-format="yyyy-MM-dd" :clearable="false" :picker-options="pickerOptions" @change="searchFn">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="搜索：">
					<el-input v-model="search" clearable placeholder="搜索会议室" @change="searchFn"></el-input>
				</el-form-item>
				<el-form-item label="按设备筛选：">
					<el-checkbox-group v-model="equipment" @change="searchFn">
						<el-checkbox label="1">电视</el-checkbox>
						<el-checkbox label="2">电话</el-checkbox>
						<el-checkbox label="3">投影</el-checkbox>
						<el-checkbox label="4">白板</el-checkbox>
						<el-checkbox label="5">视频</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</el-card>
		<PageTab :tab_list="tab_list" @checkTab="checkTab"/>
		<div class="mt-10 scroll-y hide_scrollbar">
			<ConferenceItem type="1" :info="item" v-for="item in list"/>
		</div>
	</div>
</template>
<script>
	import { getNowDate } from '../../utils.js'
	import PageTab from '../../components/pageTab.vue'
	import ConferenceItem from '../../components/conferenceItem.vue'
	export default{
		data(){
			return{
				date:getNowDate(),		//时间
				pickerOptions: {
					disabledDate(date) {
						return date.getTime() < Date.now() - 8.64e7;
					}
				},
				search:"",				//搜索会议室
				equipment:[],			//选中的设备列表
				tab_list:[{
					name:'可预定',
					id:'1'
				},{
					name:'全部',
					id:'0'
				}],						//导航列表
				list:[{
					id:"",
					image:"",
					name:"国泰16楼02会议室",
					ty:true,
					bb:true,
					kt:true,
					tv:true,
					people:15,
					position:"国泰科技大厦",
				}],						//会议室列表
			}
		},
		methods:{
			//搜索
			searchFn(){
				let arg = {
					date:this.date,
					search:this.search,
					equipment:this.equipment
				}
				console.log(arg)
			},
			//切换导航
			checkTab(id){
				console.log(id)
			}
		},
		components:{
			PageTab,
			ConferenceItem
		}
	}
</script>
<style lang="less" scoped>

</style>