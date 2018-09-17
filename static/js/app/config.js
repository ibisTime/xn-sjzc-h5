var SYSTEM_CODE = "CD-TOKEN00018";
var CLIENT = "WEB_H5";// h5登录标识
//七牛地址
var PIC_PREFIX = 'http://pajvine9a.bkt.clouddn.com/';
var PIC_SHOW = '?imageMogr2/auto-orient/interlace/1';

//当前语言设置列表
var LANGUAGELIST=[
	{
		'key':'ZH_CN',
		'value': '中文简体'
	},{
		'key':'EN',
		'value': 'English'
	},{
		'key':'KO',
		'value': '한국어'
	}
];

// 当前语言
var NOWLANG = getUrlParam('lang') || 'EN';

// 开关
var ISOPEN = false;

// 获取链接入参
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
	    return decodeURIComponent(r[2]);
	return '';
}

(function() {
	var isList = !!getUrlParam("isList");
	if(ISOPEN && !isList){
		// 判断是否是Binance
		if (getUrlParam('code') == 'APP201809020205359811311') {
			location.replace("http://www.thachain.org");
		}
	}
})()
