<template>
	<el-card class="mb-10" shadow="hover">
		<div class="flex">
			<DefaultImage :info="info"/>
			<div class="flex fc jsb">
				<div class="f20 fw-600">{{info.meeting_room_name}}</div>
				<div class="f16">{{info.equipment_str}}</div>
				<div class="flex ac">
					<img class="people_icon mr-6" src="../static/people_icon.png">
					<div class="f26">{{info.limit_num}}人</div>
				</div>
				<div class="flex ac">
					<img class="position_icon mr-6" src="../static/position_icon.png">
					<div class="f26">{{info.meeting_address}}</div>
				</div>
			</div>
		</div>
		<SelectTime :info="info" v-if="type == '1'"/>
	</el-card>
</template>
<script>
	import DefaultImage from '../components/defaultImage.vue'
	import SelectTime from '../components/selectTime.vue'
	export default{
		props:{
			//类型（1:预约会议;2:会议室管理列表）
			type:{
				type: String,
				default:''
			},
			//每一条的数据
			info:{
				type: Object,
				default:{}
			}
		},
		components:{
			DefaultImage,
			SelectTime
		}
	}
</script>
<style lang="less" scoped>
.people_icon{
	width: 22px;
	height: 22px;
}
.position_icon{
	width: 18px;
	height: 21px;
}
</style>