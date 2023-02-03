var now = new Date(); 				//当前日期  
var nowDay = now.getDate(); 		//当前日 
var nowMonth = now.getMonth(); 		//当前月 
var nowYear = now.getYear(); 		//当前年 
nowYear += (nowYear < 2000) ? 1900 : 0; 

//获取某日期的前几日日期
export function getNextDate(date, day) { 
　　var dd = new Date(date);
　　dd.setDate(dd.getDate() + day);
　　var y = dd.getFullYear();
　　var m = dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1;
　　var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate();
　　return m + "-" + d;
}

//获得昨日日期（包括上月末日期）
export function getCurrentDate(){
	var day1 = new Date();
	day1.setTime(day1.getTime()-24*60*60*1000);
	var currentDate = new Date(day1);
	return formatDate(currentDate); 
}
//获得今日
export function getNowDate(){
	return formatDate(new Date()); 
}

//格式化日期
function formatDate(date) { 
	var myyear = date.getFullYear(); 
	var mymonth = date.getMonth()+1; 
	var myweekday = date.getDate(); 
	if(mymonth < 10){ 
		mymonth = "0" + mymonth; 
	} 
	if(myweekday < 10){ 
		myweekday = "0" + myweekday; 
	}
	return (myyear+"-"+mymonth + "-" + myweekday);
}