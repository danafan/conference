<template>
	<div class="flex fc height-100">
		<div class="mb_none white_back pl-30 mb-6 flex ac">
			<el-form :inline="true" size="mini">
				<el-form-item label="时间：">
					<el-date-picker v-model="date" type="date" value-format="yyyy-MM-dd" :clearable="false" :picker-options="pickerOptions" @change="reloadFn">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="搜索：">
					<el-input v-model="search" clearable placeholder="搜索会议室" @change="reloadFn"></el-input>
				</el-form-item>
				<el-form-item label="按设备筛选：">
					<el-checkbox-group v-model="equipment" @change="reloadFn">
						<el-checkbox :label="item.equipment_id" v-for="item in equipment_list">{{item.equipment_name}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
		</div>
		<PageTab :tab_list="tab_list" @checkTab="checkTab"/>
		<div class="scroll-y hide_scrollbar" v-if="list.length > 0">
			<ConferenceItem type="1" :info="item" :current_date="date" v-for="item in list" @reloadFn="reloadFn"/>
		</div>
		<EmptyPage :loading="loading" v-else/>
	</div>
</template>
<script>
	import { getNowDate } from '../../utils.js'
	import PageTab from '../../components/pageTab.vue'
	import ConferenceItem from '../../components/conferenceItem.vue'
	import EmptyPage from '../../components/empty_page.vue'

	import resource from '../../api/resource.js'
	export default{
		data(){
			return{
				date:getNowDate(),		//时间
				pickerOptions: {
					disabledDate(date) {
						return date.getTime() < Date.now() - 8.64e7;
					},
					firstDayOfWeek:1
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
				loading:true,			//是否加载
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
				this.list = [];
				//获取会议室列表
				this.meetingList();
			},
			//获取会议室列表
			meetingList(){
				let arg = {
					flag:this.flag,
					day:this.date,
					equipment_id:this.equipment.join(','),
					search:this.search
				}
				this.loading = true;
				resource.meetingList(arg).then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let list = res.data.data;
						list.map(item => {
							item['equipment_str'] = item.equipment_name.join(' / ');
						})
						this.list = list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			reloadFn(){
				this.list = [];
				this.meetingList();
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
.mb_none{
	height: 48px;
}
</style>