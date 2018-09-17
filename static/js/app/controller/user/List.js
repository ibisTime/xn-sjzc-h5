define([
	'app/controller/base',
	'app/interface/PageFindCtr',
	'app/module/validate',
	'app/module/smsCaptcha',
], function (base, PageFindCtr, Validate, smsCaptcha) {
	var lang = base.getUrlParam('lang') || '';
	var code = base.getUrlParam('code');

	init();

	function init() {
		base.showLoading();
		setHtml();
		listDetails();
	}

	// 根据设置文本
	function setHtml() {
		$("title").html(base.getText('列表详情', lang));
		$(".mess").html(base.getText('基本信息', lang));
		$(".disc").html(base.getText('应用描述', lang));
		$(".downLoad").html(base.getText('安装', lang));
	}

	// 列表详情页面应用信息渲染
	function listDetails() {
		return PageFindCtr.listDetails(code).then((data) => {
			base.hideLoading();
			var head = '';
			let html = '';
			let message = '';
			let disc = '';
			let Pic = data.pic;
			let Picarr = Pic.split("||");
			for (let i = 0; i < Picarr.length; i++) {
				html += `
					<li class="listImg"><div class="wp100 hp100" style="background-image: url('${base.getImg(Picarr[i])}');"></div></li>
				`;
			};
			var tagHtml = '';
			if(data.tag){
				tagHtml = `<span class="pub">${data.tag}</span>`;
			}
			head += `
				<div class="listPic"><img src="${base.getImg(data.icon)}">${tagHtml}</div>
				<div class="text">
					<p><span class="txt1">${data.name}</span></p>
					<p class="txt2 dow downloadTimes">${data.downloadTimes} ${base.getText('次下载', lang)}</p>
					<p class="txt2 con">${base.getText('大小：', lang)}${base.getUserBrowser() == 'ios' ? data.iosSize : data.androidSize}M</p>
				</div>
			`;
			message += `
				<div class="listMain">
					<p class="now">${base.getText('当前版本：', lang)}${base.getUserBrowser() == 'ios' ? data.iosVersion : data.androidVersion}</p>
					<p class="newTime">${base.getText('更新时间：', lang)}${base.formatDate(base.getUserBrowser() == 'ios' ? data.iosUpdateDatetime : data.androidUpdateDatetime)}</p>
				</div>
			`;

			disc += `
				<p class="dicerip">${data.description}</p>
			`;
			$('#head1').html(head);
			$("#listmain1").html(message);
			$('#listMain2').html(disc);
			$("#banner1 ul").html(html).css({'width': 4.26 * Picarr.length + 'rem'});

			//应用安装
			$("#appDownLoad").click(function () {
				// 判断终端给出下载地址
				let phone = base.getUserBrowser()
				base.showLoading();
				//请求下载次数接口更新下载次数
				PageFindCtr.newDownLoadTimes(code).then( (res) => {
					base.hideLoading();
					$(".downloadTimes").html(`${res.downloadTimes} ${base.getText('次下载', lang)}`);
					
					if (phone === 'ios') {
						window.location.href = data.iosUrl;
					} else if (phone === 'android') {
						window.location.href = data.androidUrl;
					}
				})
				
			})

		})
	}

});
