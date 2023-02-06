import http from "./request.js";
let path = {
  meetingRoomList:'meeting_room/list',                    //会议室列表
  uploadFile:'common/upload',							  //上传文件
  deleteFile:'common/del_file',							  //删除文件
  ajaxEquipment:'meeting_room/ajax_equipment',			  //获取设备列表
  delEquipment:'meeting_room/del_equipment',			  //删除设备
  addEquipment:'meeting_room/add_equipment',			  //添加设备
  addMettingRoom:'meeting_room/add',					  //创建会议室
} 
export default {
  //会议室列表
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
};
