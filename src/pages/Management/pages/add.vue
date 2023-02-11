<template>
	<div>
		<el-form label-width="150px">
			<el-form-item label="会议室名称：" required>
				<el-input style="flex:1" v-model="meeting_room_name" placeholder="请添加会议室名称">
				</el-input>
			</el-form-item>
			<el-form-item label="会议室头像：" required>
				<UploadImage @callbackFn="callbackFn" :img_list="img_list" v-if="!isEdit || is_show"/>
			</el-form-item>
			<el-form-item label="容纳人数：" required>
				<el-input-number v-model="limit_num" @blur="chageNum" :precision="0" :min="1"></el-input-number>
			</el-form-item>
			<el-form-item label="会议室设备：">
				<el-select v-model="selected_equipment" @remove-tag="changeSelect" multiple filterable placeholder="请选择">
					<div class="ddd pl-6 pr-6">
						<el-input placeholder="请输入设备名称" size="small" v-model="equipment_name">
							<el-button slot="append" @click="addEquipment">添加</el-button>
						</el-input>
						<el-option v-for="(item,index) in equipment_list" :key="item.equipment_id" :label="item.equipment_name" :value="item.equipment_id">
							<div class="flex ac jsb" @click="changeEquipment(index)">
								<div class="flex ac">
									<img class="select_icon mr-6" src="../../../static/selected_icon.png" v-if="item.is_checked">
									<img class="select_icon mr-6" src="../../../static/unselect_icon.png" v-else>
									{{ item.equipment_name }}
								</div>
								<img class="delete_small_icon" src="../../../static/delete_small_icon.png" @click.stop="deleteItem(item.equipment_id,index)">
							</div>
						</el-option>
					</div>
				</el-select>
			</el-form-item>
			<el-form-item label="会议室地点：" required>
				<el-input style="flex:1" v-model="meeting_address" placeholder="请添加会议室地点">
				</el-input>
			</el-form-item>
			<el-form-item label="备注：">
				<el-input type="textarea" :rows="3" placeholder="请输入备注" v-model="remark">
				</el-input>
			</el-form-item>
			<el-form-item v-if="!isEdit">
				<el-button type="primary" @click="confirmFn">保存</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>
<script>
	import UploadImage from '../../../components/uploadImage.vue'

	import resource from '../../../api/resource.js'
	export default{
		inject: ["reload"],
		data(){
			return{
				meeting_room_name:"",			//会议室名称
				meeting_image:"",				//会议室图片
				img_list:[],					//会议室图片（组件传递）
				is_show:false,
				limit_num:1,					//容纳人数
				equipment_list:[],				//设备列表
				selected_equipment:[],			//选中的设备
				equipment_name:"",				//输入的设备名称（添加）
				meeting_address:"",				//会议室地点
				remark:"",						//备注
			}
		},
		props:{
			//是否是编辑
			isEdit:{
				type:Boolean,
				default:false
			},
			//获取的详情
			info:{
				type:Object,
				default:() => {}
			}
		},
		created(){
			//获取设备列表
			this.ajaxEquipment();
		},
		methods:{
			//获取当前图片
			callbackFn(v){
				this.meeting_image = v.length > 0?v[0]:"";
			},
			//处理输入的容纳人数
			chageNum(n){
				let new_value = n.target.ariaValueNow;
				this.limit_num = new_value !== 'undefined'?new_value:1;
			},
			//获取设备列表
			ajaxEquipment(){
				resource.ajaxEquipment().then(res => {
					if(res.data.code == 1){
						let equipment_list = res.data.data;
						
						//处理编辑详情
						if(this.isEdit){
							this.meeting_room_name = this.info.meeting_room_name;
							this.meeting_image = this.info.meeting_image;
							this.img_list = [];
							let arg = {
								urls:this.meeting_image,
								show_icon:false
							}
							this.img_list.push(arg);
							this.is_show = true;
							this.limit_num = this.info.limit_num;
							this.selected_equipment = this.info.meeting_equipment;
							this.meeting_address = this.info.meeting_address;
							this.remark = this.info.remark;
						}
						equipment_list.map(item => {
							let selected_equipment = this.selected_equipment.filter(i => {
								return item.equipment_id == i;
							})
							if(selected_equipment.length > 0){
								item['is_checked'] = true;
							}else{
								item['is_checked'] = false;
							}
						})
						this.equipment_list = equipment_list;
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//多选删除
			changeSelect(e){
				this.equipment_list.map(item => {
					if(item.equipment_id == e){
						item.is_checked = false;
					}
				})
			},
			//点击切换选中设备
			changeEquipment(index){
				this.equipment_list[index].is_checked = !this.equipment_list[index].is_checked
			},
			//点击添加设备
			addEquipment(){
				if(this.equipment_name == ''){
					this.$message.warning('设备名称不能为空');
				}else{
					resource.addEquipment({equipment_name:this.equipment_name}).then(res => {
						if(res.data.code == 1){
							//获取设备列表
							this.ajaxEquipment();
							this.equipment_name = "";
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			},
			//点击删除设备
			deleteItem(id,index){
				resource.delEquipment({equipment_id:id}).then(res => {
					if(res.data.code == 1){
						let new_index = this.selected_equipment.findIndex(item => {
							return item == id;
						})
						if(new_index > -1){
							this.selected_equipment.splice(new_index,1);
						}
						this.equipment_list.splice(index,1);
					}else{
						this.$message.warning(res.data.msg);
					}
				})
			},
			//点击保存
			confirmFn(){
				if(this.meeting_room_name == ''){
					this.$message.warning('请输入会议室名称！');
				}else if(this.meeting_image == ''){
					this.$message.warning('请上传会议室图片！');
				}else if(this.meeting_address == ''){
					this.$message.warning('请输入会议室地点！');
				}else{
					let arg = {
						meeting_room_name:this.meeting_room_name,
						meeting_image:this.meeting_image,
						limit_num:this.limit_num,
						meeting_address:this.meeting_address,
						meeting_equipment:this.selected_equipment.join(','),
						remark:this.remark
					}
					resource.addMettingRoom(arg).then(res => {
						if(res.data.code == 1){
							this.reload();
							this.$message.success(res.data.msg);
						}else{
							this.$message.warning(res.data.msg);
						}
					})
				}
			}


		},
		components:{
			UploadImage
		}
	}
</script>
<style type="text/css">
.ddd .el-select-dropdown__item{
	padding-left: 0px!important;
	padding-right: 0px!important;
}
</style>
<style lang="less" scoped>
.delete_small_icon{
	width: 16px;
	height: 16px;
}
.select_icon{
	width: 16px;
	height: 17px;
}
</style>