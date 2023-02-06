<template>
	<el-card class="mb-10" shadow="hover">
		<div class="flex">
			<DefaultImage :info="info"/>
			<div class="flex fc jsb">
				<div class="f20 fw-600">{{info.name}}</div>
				<div class="flex">
					<Equipment type="1" v-if="info.ty"/>
					<Equipment type="2" v-if="info.bb"/>
					<Equipment type="3" v-if="info.tv"/>
					<Equipment type="4" v-if="info.kt"/>
				</div>
				<div class="flex ac">
					<img class="people_icon mr-6" src="../static/people_icon.png">
					<div class="f26">{{info.people}}人</div>
				</div>
				<div class="flex ac">
					<img class="position_icon mr-6" src="../static/position_icon.png">
					<div class="f26">{{info.position}}</div>
				</div>
			</div>
		</div>
		<SelectTime :info="info"/>
	</el-card>
</template>
<script>
	import DefaultImage from '../components/defaultImage.vue'
	import Equipment from '../components/equipment.vue'
	import SelectTime from '../components/selectTime.vue'
	export default{
		props:{
			//类型（1:预约会议）
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
			Equipment,
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