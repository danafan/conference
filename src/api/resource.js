import http from "./request.js";
let path = {
  meetingList:'meeting/list',						      //预约会议室列表
  addMeeting:'meeting/add',								  //预约会议（查看/预约）
  meetingRoomList:'meeting_room/list',                    //会议室列表
  uploadFile:'common/upload',							  //上传文件
  deleteFile:'common/del_file',							  //删除文件
  ajaxEquipment:'meeting_room/ajax_equipment',			  //获取设备列表
  delEquipment:'meeting_room/del_equipment',			  //删除设备
  addEquipment:'meeting_room/add_equipment',			  //添加设备
  addMettingRoom:'meeting_room/add',					  //创建会议室
  editMettingRoom:'meeting_room/edit',					  //查看/编辑会议室
  updateMettingRoom:'meeting_room/update',				  //启用/禁用/删除
  ajaxDeptLevel:'meeting/ajax_dept_level',          //获取部门列表和会议级别
  meetingRecord:'meeting/record',                   //获取会议记录列表
  meetingCancle:'meeting/cancle',                   //取消日程
  meetingDetail:'meeting/detail',                   //获取会议详情
} 
export default {
  //会议室列表（预约会议室）
  meetingList(params) {
  	return http.get(path.meetingList, params);
  },
  //预约会议（查看）
  addMeetingGet(params){
  	return http.get(path.addMeeting, params);
  },
  //预约会议（预约）
  addMeetingPost(params){
  	return http.post(path.addMeeting, params);
  },
  //会议室列表（会议室管理）
  meetingRoomList(params) {
  	return http.get(path.meetingRoomList, params);
  },
  //上传文件
  uploadFile(params) {
  	return http.post(path.uploadFile, params);
  },
  //删除文件
  deleteFile(params) {
  	return http.post(path.deleteFile, params);
  },
  //获取设备列表
  ajaxEquipment(params) {
  	return http.get(path.ajaxEquipment, params);
  },
  //删除设备
  delEquipment(params) {
  	return http.post(path.delEquipment, params);
  },
  //添加设备
  addEquipment(params) {
  	return http.post(path.addEquipment, params);
  },
  //创建会议室
  addMettingRoom(params) {
  	return http.post(path.addMettingRoom, params);
  },
  //查看会议室
  editMettingRoomGet(params) {
  	return http.get(path.editMettingRoom, params);
  },
  //编辑会议室
  editMettingRoomPost(params) {
  	return http.post(path.editMettingRoom, params);
  },
  //启用/禁用/删除
  updateMettingRoom(params) {
  	return http.post(path.updateMettingRoom, params);
  },
  //获取部门列表和会议级别
  ajaxDeptLevel(params) {
    return http.get(path.ajaxDeptLevel, params);
  },
  //获取会议记录列表
  meetingRecord(params) {
    return http.get(path.meetingRecord, params);
  },
  //取消日程
  meetingCancle(params) {
    return http.post(path.meetingCancle, params);
  },
  //获取会议详情
  meetingDetail(params) {
    return http.get(path.meetingDetail, params);
  },
};
