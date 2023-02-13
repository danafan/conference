<template>
	<div class="flex fc height-100">
		<div v-if="list.length > 0">
			<ConferenceItem type="2" :info="item" v-for="item in list" @reload="meetingRoomList"/>
		</div>
		<EmptyPage :loading="loading" v-else/>
	</div>
</template>
<script>
	import ConferenceItem from '../../../components/conferenceItem.vue'
	import EmptyPage from '../../../components/empty_page.vue'

	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				list:[],				//会议室列表
				loading:true,
			}
		},
		created(){
			//获取会议室列表
			this.meetingRoomList();
		},
		methods:{
			//获取会议室列表
			meetingRoomList(){
				this.loading = true;
				resource.meetingRoomList().then(res => {
					if(res.data.code == 1){
						this.loading = false;
						let list = res.data.data;
						list.map(item => {
							item['equipment_str'] = item.meeting_equipment.join(' / ');
						})
						this.list = list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			}
		},
		components:{
			ConferenceItem,
			EmptyPage
		}
	}
</script>
<style lang="less" scoped>

</style>