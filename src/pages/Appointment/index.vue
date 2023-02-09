<template>
	<div class="flex fc height-100">
		<el-card class="tab_card" shadow="never">
			<el-form :inline="true" size="mini">
				<el-form-item label="时间：">
					<el-date-picker v-model="date" type="date" value-format="yyyy-MM-dd" :clearable="false" :picker-options="pickerOptions" @change="meetingList">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="搜索：">
					<el-input v-model="search" clearable placeholder="搜索会议室" @change="meetingList"></el-input>
				</el-form-item>
				<el-form-item label="按设备筛选：">
					<el-checkbox-group v-model="equipment" @change="meetingList">
						<el-checkbox :label="item.equipment_id" v-for="item in equipment_list">{{item.equipment_name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</el-card>
		<PageTab :tab_list="tab_list" @checkTab="checkTab"/>
		<div class="mt-10 scroll-y hide_scrollbar">
			<ConferenceItem type="1" :info="item" v-for="item in list" @reload="meetingList"/>
		</div>
	</div>
</template>
<script>
	import { getNowDate } from '../../utils.js'
	import PageTab from '../../components/pageTab.vue'
	import ConferenceItem from '../../components/conferenceItem.vue'

	import resource from '../../api/resource.js'
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
				equipment_list:[],		//所有设备列表
				equipment:[],			//选中的设备列表
				tab_list:[{
					name:'可预定',
					id:'1'
				},{
					name:'全部',
					id:'0'
				}],						//导航列表
				flag:"1",				//当前选中的导航
				list:[],				//会议室列表
			}
		},
		created(){
			//获取设备列表
			this.ajaxEquipment();
			//获取会议室列表
			this.meetingList();
		},
		methods:{
			//获取设备列表
			ajaxEquipment(){
				resource.ajaxEquipment().then(res => {
					if(res.data.code == 1){
						this.equipment_list = res.data.data;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//切换导航
			checkTab(item){
				this.flag = item.id;
				//获取会议室列表
				this.meetingList();
			},
			//获取会议室列表
			meetingList(){
				// this.list = [{
				// 	meeting_room_id: 8,
				// 	limit_num: 15,
				// 	meeting_room_name: "测试会议室",
				// 	meeting_image: "idc\/DataCenter_202302070958267553.png",
				// 	equipment_str: "白板/电话/投影仪",
				// 	meeting_address: "钱塘江边",
				// 	meeting_records: [{
				// 		start_time: "2023-02-09 16:00:00",
				// 		end_time: "2023-02-09 18:30:00",
				// 		admin_id: "8318",
				// 		admin_name: "范玉龙"
				// 	},{
				// 		start_time: "2023-02-09 20:30:00",
				// 		end_time: "2023-02-09 21:30:00",
				// 		admin_id: "8318",
				// 		admin_name: "范玉龙"
				// 	}]
				// }]
				// return;



				let arg = {
					flag:this.flag,
					day:this.date,
					equipment_id:this.equipment.join(','),
					search:this.search
				}

				resource.meetingList(arg).then(res => {
					if(res.data.code == 1){
						let list = res.data.data;
						list.map(item => {
							item['equipment_str'] = item.equipment_name.join(' / ');
						})
						this.list = list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
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