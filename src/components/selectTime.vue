<template>
	<div class="flex select_box mt-24 mb-24">
		<div class="relative item" :class="[{'is_exceed':item.is_exceed},{'pointer':!item.is_exceed && !item.disable},{'is_disable':item.disable},{'active_background':item.is_selected},{'hover_background':item.is_hover && !item.is_selected && frequency > 0}]" @mouseover="changeShow(item,index,true)" @mouseleave="changeShow(item,index,false)" @click="selectedItem(index)" v-for="(item,index) in list" :key="index">
			<div class="point_start absolute" v-if="index == 0">{{item.point_time}}</div>
			<div class="point absolute" v-if="index%2 == 1">{{item.point_time}}</div>
			<!-- 已过期 -->
			<div class="popover absolute f14" v-if="active_index == index && item.is_exceed">已过期</div>
			<!-- 被预定 -->
			<div class="popover absolute f14" v-if="active_index == index && item.disable">已被 <span class="primary_color">{{item.user_name}}</span> 预定</div>
			<!-- 可选择 -->
			<div class="popconfirm absolute f14" v-if="start_index == index">
				<div>{{popconfirm_value}}</div>
				<div v-if="frequency === 1">(再次点击确认时段)</div>
				<div class="width-100 flex jfc mt-10">
					<el-button size="mini" @click.stop="cancel">取消</el-button>
					<el-button size="mini" type="primary" @click.stop="selectedTime">确定</el-button>
				</div>
			</div>
		</div>
		<!-- 确认会议室详情 -->
		<c-dialog title="杭州德儿电子商务有限公司" :cancel="false" @cancleFn="$refs.CDialog.show_dialog = false" confirmText="完成" @confirmFn="confirmFn" ref="CDialog">
			<el-form size="small" label-width="100px">
				<el-form-item label="会议标题：">
					<el-input style="flex:1" v-model="title" placeholder="请添加会议标题">
					</el-input>
				</el-form-item>
				<el-form-item label="会议级别：">
					<el-select v-model="level_id">
						<el-option v-for="item in level_list" :label="item.name" :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
			</el-form>
		</c-dialog>
	</div>
</template>
<script>
	import CDialog from '../components/cDialog.vue'
	export default{
		data(){
			return{
				list:[{
					point_time:7,
					interval:"07:00~07:30",
				},{
					point_time:8,
					interval:"07:30~08:00",
				},{
					point_time:null,
					interval:"08:00~08:30",
				},{
					point_time:9,
					interval:"08:30~09:00",
				},{
					point_time:null,
					interval:"09:00~09:30",
				},{
					point_time:10,
					interval:"09:30~10:00",
				},{
					point_time:null,
					interval:"10:00~10:30",
				},{
					point_time:11,
					interval:"10:30~11:00",
				},{
					point_time:null,
					interval:"11:00~11:30",
				},{
					point_time:12,
					interval:"11:30~12:00",
				},{
					point_time:null,
					interval:"12:00~12:30",
				},{
					point_time:13,
					interval:"12:30~13:00",
				},{
					point_time:null,
					interval:"13:00~13:30",
				},{
					point_time:14,
					interval:"13:30~14:00",
				},{
					point_time:null,
					interval:"14:00~14:30",
				},{
					point_time:15,
					interval:"14:30~15:00",
				},{
					point_time:null,
					interval:"15:00~15:30"
				},{
					point_time:16,
					interval:"15:30~16:00",
				},{
					point_time:null,
					interval:"16:00~16:30",
				},{
					point_time:17,
					interval:"16:30~17:00",
				},{
					point_time:null,
					interval:"17:00~17:30",
				},{
					point_time:18,
					interval:"17:30~18:00",
				},{
					point_time:null,
					interval:"18:00~18:30",
				},{
					point_time:19,
					interval:"18:30~19:00",
				},{
					point_time:null,
					interval:"19:00~19:30",
				},{
					point_time:20,
					interval:"19:30~20:00",
				},{
					point_time:null,
					interval:"20:00~20:30",
				},{
					point_time:21,
					interval:"20:30~21:00",
				},{
					point_time:null,
					interval:"21:00~21:30",
				},{
					point_time:22,
					interval:"21:30~22:00",
				},{
					point_time:null,
					interval:"22:00~22:30",
				},{
					point_time:23,
					interval:"22:30~23:00",
				}],
				active_index:-1,					//悬浮提示默认下标
				start_index:-1,						//第一次选中的下标
				frequency:0,						//当前有效点击次数
				popconfirm_value:"",				//选中时间的弹窗时间段
				title:"",							//弹窗会议标题
				level_list:[{
					id:'1',
					name:"大级别"
				},{
					id:'2',
					name:"中级别"
				},{
					id:'3',
					name:"小级别"
				}],									//会议级别列表
				level_id:'1',						//选中的会议级别列表

			}
		},
		props:{
			//当前会议室
			info:{
				type:Object,
				default:{}
			}
		},
		created(){
			//设置默认状态
			this.filterTime();
		},
		methods:{
			//控制是否显示悬浮提示
			changeShow(item,index,type){
				if(item.is_exceed || item.disable){		//已过期或被预定
					this.active_index = type?index:-1;
				}else{									//可选择
					if(this.start_index > -1 && this.frequency == 1){
						var new_list = JSON.parse(JSON.stringify(this.list));
						if(this.getNum(index).is_exceed > 0 || this.getNum(index).disable > 0){
							return
						}
						new_list.map((new_item,i) => {
							if(i >= this.getNum(index).s_index && i <= this.getNum(index).e_index){
								new_item.is_hover = true;
							}else{
								new_item.is_hover = false;
							}
						})
						this.list = new_list;
						this.popconfirm_value = `${new_list[this.getNum(index).s_index].interval.split('~')[0]}~${new_list[this.getNum(index).e_index].interval.split('~')[1]} ${((this.getNum(index).e_index - this.getNum(index).s_index) + 1)*30}分钟`;
					}
				}
			},
			//点击选择某个时间段
			selectedItem(index){
				//点击的是已过期或者被预定的，直接不向下执行
				if(this.list[index].is_exceed || this.list[index].disable){
					return;
				}
				var new_list = JSON.parse(JSON.stringify(this.list));
				if(this.frequency == 0){			//第一次点击
					new_list.map((item,i) => {
						if(index == i){
							item.is_selected = true;
							this.popconfirm_value = `${item.interval} 30分钟`;
						}else{
							item.is_selected = false;
						}
					})
					this.start_index = index;
					this.show_confirm = true;
					this.frequency = 1;
				}else if(this.frequency == 1){	//第二次点击
					if(this.getNum(index).is_selected == 1 && this.getNum(index).is_exceed == 0 && this.getNum(index).disable == 0){
						new_list.map((item,i_i) => {
							item.is_hover = false;
							if(i_i >= this.getNum(index).s_index && i_i <= this.getNum(index).e_index){
								item.is_selected = true;
							}
						})
						this.frequency = 0;
					}
				}
				this.list = new_list;
			},
			//获取被预定、已过期、已选中的数量
			getNum(index){
				var new_list = JSON.parse(JSON.stringify(this.list));
				var min_index = Math.min(this.start_index,index);
				let arr = [];
				let s_index = -1;
				let e_index = -1;
				if(min_index == this.start_index){
					arr = new_list.slice(min_index,index + 1);
					s_index = this.start_index;
					e_index = index;
				}
				if(min_index == index){
					arr = new_list.slice(index,this.start_index + 1);
					s_index = index;
					e_index = this.start_index;
				}

				let not_select_arr1 = arr.filter(item => {
					return item.is_selected;
				})

				let not_select_arr2 = arr.filter(item => {
					return item.is_exceed;
				})

				let not_select_arr3 = arr.filter(item => {
					return item.disable;
				})

				let arg = {
					is_selected:not_select_arr1.length,
					is_exceed:not_select_arr2.length,
					disable:not_select_arr3.length,
					s_index:s_index,
					e_index:e_index
				}
				return arg;
			},	
			//设置默认状态
			filterTime(){
				this.list.map((item,index) => {
					let start_time = item.interval.split('~')[0];
					let end_time = item.interval.split('~')[1];
					let arg = this.getStatus(start_time,end_time);
					item['is_selected'] = false;
					item['is_hover'] = false;
					for(let k in arg){
						item[k] = arg[k];
					}
					if(index == 26){
						item['disable'] = true;
						item['user_name'] = '彪子';
					}
				})
			},
			//处理每一格的时间
			getStatus(start_time,end_time){
				var now = new Date(); 				//当前日期  
				var nowYear = now.getYear(); 		//当前年 
				nowYear += (nowYear < 2000) ? 1900 : 0;
				var nowMonth = now.getMonth(); 		//当前月 
				var nowDay = now.getDate(); 		//当前日 
				var nowHours = now.getHours();  	//当前小时
				var nowMinutes = now.getMinutes();  //当前分钟
				var Seconds = now.getSeconds();     //当前秒

				//当前时间
				let current_time = `${nowYear}-${nowMonth+1}-${nowDay} ${nowHours}:${nowMinutes}:${Seconds}`;
				//指定的开始时间
				let set_start_time = `${nowYear}-${nowMonth+1}-${nowDay} ${start_time}:00`;
				//指定的结束时间
				let set_end_time = `${nowYear}-${nowMonth+1}-${nowDay} ${end_time}:00`;

				//当前时间是否超出指定的结束时间
				let is_exceed = new Date(current_time).getTime() > new Date(set_end_time).getTime();

				let arg = {
					is_exceed:is_exceed,
					arg_start_time:set_start_time,
					arg_end_time:set_end_time
				}
				return arg;
			},
			//取消
			cancel(){
				this.start_index = -1;					//第一次选中的下标
				this.list.map(item => {
					item.is_hover = false;
					item.is_selected = false;
				})
				this.frequency = 0;						//当前有效点击次数
				this.popconfirm_value = "";				//选中时间的弹窗时间段
			},
			//选中确定
			selectedTime(){
				this.title = `${this.info.name}预定`;
				this.$refs.CDialog.show_dialog = true;
			},
			//弹窗确定
			confirmFn(){
				this.$refs.CDialog.show_dialog = false;
			}
			
		},
		components:{
			CDialog
		}
	}
</script>
<style lang="less" scoped>
.select_box{
	border-left: 1px solid #ADADAD;
	border-top: 1px solid #ADADAD;
	border-bottom: 1px solid #ADADAD;
	width: 100%;
	.item{
		border-right: 1px solid #ADADAD;
		width: 3.125%;
		height: 36px;
		.point_start{
			bottom:-26px;
			left: -6px;
		}
		.point{
			bottom:-26px;
			right: -7px;
		}
		.popover{
			white-space: nowrap;
			top:-40px;
			left: 50%;
			transform: translate(-50%);
			padding-left: 8px;
			padding-right: 8px;
			text-align: center;
			height: 28px;
			line-height: 28px;
			background: #FFFFFF;
			box-shadow: 0px 0px 3px 0px #DADADA;
			border-radius: 6px;
		}
		.popconfirm{
			white-space: nowrap;
			top:-110px;
			left: 50%;
			transform: translate(-50%);
			padding: 12px;
			background: #FFFFFF;
			box-shadow: 0px 0px 3px 0px #DADADA;
			border-radius: 6px;
		}
	}
	.is_exceed{
		background-color: #E8E9EA;
	}
	.is_disable{
		background-color: #929497;
	}
	.hover_background{
		background-color: #C8DEF4;
	}
}
</style>