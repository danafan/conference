<template>
	<div>
		<ConferenceItem type="2" :info="item" v-for="item in list" @reload="meetingRoomList"/>
	</div>
</template>
<script>
	import ConferenceItem from '../../../components/conferenceItem.vue'

	import resource from '../../../api/resource.js'
	export default{
		data(){
			return{
				list:[],				//会议室列表
			}
		},
		created(){
			//获取会议室列表
			this.meetingRoomList();
		},
		methods:{
			//获取会议室列表
			meetingRoomList(){
				resource.meetingRoomList().then(res => {
					if(res.data.code == 1){
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
			ConferenceItem
		}
	}
</script>
<style lang="less" scoped>

</style>