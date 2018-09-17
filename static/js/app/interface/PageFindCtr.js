define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {

		//行情软件
		requestData(data){
			return Ajax.get('625605', data, true);
		},

		// 搜索页面
		SearchList(data) {
			return Ajax.get('625605', data, true);
		},

		// 列表应用详情
		listDetails(code) {
			return Ajax.get('625606', {
				code
			}, true);
		},

		//更新应用的下载次数
		newDownLoadTimes(code) {
			return Ajax.get('625603', {
				code
			}, true);
		},

		//新增应用
		getNewsApp(data){
			return Ajax.post("625600", data , true);
		}


    };
})
