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

//获得本月的开始日期 
export function getMonthStartDate(){
	var monthStartDate; 
	if(nowDay == 1){
		monthStartDate = new Date(nowYear, nowMonth - 1, 1);
	}else{
		monthStartDate = new Date(nowYear, nowMonth, 1);
	}
	return formatDate(monthStartDate); 
}

//获得前某月的开始日期 
export function getLastMonthStartDate(month_num){ 
	var lastMonthStartDate = new Date(nowYear, nowMonth - month_num, 1); 
	return formatDate(lastMonthStartDate); 
}
//获得前某月的结束日期 
export function getLastMonthEndDate(month_num){ 
	var lastMonthEndDate = new Date(nowYear, nowMonth - month_num, 0); 
	return formatDate(lastMonthEndDate); 
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


//处理会议时间
export function filterMeetingTime(start_time,end_time){
	let year_list = start_time.split(' ')[0].split('-');
	let year = `${year_list[0]}年${year_list[1]}月${year_list[2]}日`;
	let start = `${start_time.split(' ')[1].split(':')[0]}:${start_time.split(' ')[1].split(':')[1]}`;
	let end = `${end_time.split(' ')[1].split(':')[0]}:${end_time.split(' ')[1].split(':')[1]}`;
	return `${year} ${start}~${end}`; 
}

//导出
export function exportPost(data,name){
	const blob = new Blob([data], {type: 'text/csv,charset=UTF-8'})
	let today = new Date();
	let tadayDate =
	today.getFullYear() +
	"-" +
	(today.getMonth() + 1) +
	"-" +
	today.getDate();
	const fileName = name + '-' + tadayDate + '.csv'
	const elink = document.createElement('a')
	elink.download = fileName
	elink.style.display = 'none'
	elink.href = URL.createObjectURL(blob)
	document.body.appendChild(elink)
	elink.click()
    URL.revokeObjectURL(elink.href) // 释放URL 对象
    document.body.removeChild(elink)
}


