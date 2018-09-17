define([
	'app/controller/base',
	'app/module/validate',
	'app/interface/PageFindCtr',
	'app/interface/GeneralCtr',
	'app/module/qiniu'

], function (base, Validate, PageFindCtr, GeneralCtr, qiniu) {
	var lang = base.getUrlParam('lang') || '';
	var _formWrapper = $("#formWrapper");
	_formWrapper.validate({
		'rules': {
			name: {
				required: true,
			},
			tag:{},
			slogan:{
				required: true,
			},
			description: {
				required: true
			},
			androidVersion: {
				required: true
			},
			androidSize: {
				number: true,
				required: true
			},
			androidUrl: {
				required: true
			},
			iosVersion: {
				required: true,
			},
			iosSize: {
				number: true,
				required: true
			},
			iosUrl: {
				required: true
			},
			isNecessary:{}
		},
		onkeyup: false
	});

	init();

	function init() {
		base.showLoading();
		setHtml();
		$.when(
			getType(),
			initUpload()
		)
	}


	// 根据设置文本
	function setHtml() {
		$("title").html(base.getText('上传', lang));
		$(".classification").html(base.getText('分类', lang));
		$(".theApplicationName").html(base.getText('应用名称', lang));
		$(".appName1").attr("placeholder", base.getText('请输入应用的名称', lang));
		$(".iconChoose").html(base.getText('图标', lang));
		$(".theLabel").html(base.getText('标签', lang));
		$(".theSolgan").html(base.getText('标语（必填）', lang));
		$(".theSolganDicr").attr("placeholder", base.getText('请用一句话简单明了的概括一下', lang));
		$(".describe").html(base.getText('描述（必填）', lang));
		$(".describeDicr").attr("placeholder", base.getText('请详细描述一下您的应用', lang));
		$(".screenshots").html(base.getText('截图（必填）', lang));
		$(".androidVersion").html(base.getText('安卓版本号', lang));
		$(".androidUpdateTime").html(base.getText('安卓更新时间', lang));
		$(".androidPackageSize").html(base.getText('安卓包大小', lang));
		$(".androidDownUrl").html(base.getText('安卓下载地址', lang));
		$(".appleVersion").html(base.getText('苹果版本号', lang));
		$(".appleUpdateTime").html(base.getText('苹果更新时间', lang));
		$(".applePackageSize").html(base.getText('苹果包大小', lang));
		$(".appleDownUrl").html(base.getText('苹果下载地址', lang));
		$(".introductionToEssential").html(base.getText('是否入门必备', lang));
		$("#submitBtn").attr("value", base.getText('提交', lang));
		$(".isNecessary1").html(base.getText('是', lang));
		$(".isNecessary0").html(base.getText('否', lang));
	}

	//应用提交
	$("#submitBtn").click(function () {
		if(_formWrapper.valid()){
			let data = _formWrapper.serializeObject();
			var icon = $("#showAvatar1").attr("data-key");
			var pic = '';
			var androidUpdateDatetime = $("#dataWrap").text();
			var iosUpdateDatetime = $("#dataWrap1").text();

			$("#picWrap").find('.pic').each(function(i, d){
				pic+=$(this).attr("data-url")

				if(i<$("#picWrap").find('.pic').length-1){
					pic+='||';
				}
			})
			if( icon != "" && icon){
				data.icon = icon;
			}else {
				base.showMsg(base.getText("请上传图标"))
				return;
			}
			
			if( pic != "" && pic){
				data.pic = pic;
			}else {
				base.showMsg(base.getText("请至少上传1张截图"))
				return;
			}

			if( androidUpdateDatetime != "" && androidUpdateDatetime){
				data.androidUpdateDatetime = androidUpdateDatetime;
			}else {
				base.showMsg(base.getText("请选择安卓更新时间"))
				return;
			}
			
			if( iosUpdateDatetime != "" && iosUpdateDatetime){
				data.iosUpdateDatetime = iosUpdateDatetime;
			}else {
				base.showMsg(base.getText("请选择iOS更新时间"))
				return;
			}
			base.showLoading();
			getNewsApp(data);
		}
		
	})

	function getNewsApp(params){
		return PageFindCtr.getNewsApp(params).then( (data) => {
			base.hideLoading();
			base.showMsg(base.getText("上传成功"));
			setTimeout(function(){
				base.gohref("../user/page.html")
			}, 800)
		}, base.hideLoading)
	}
	function getType() {
		return GeneralCtr.getDictList('app_category').then((data) => {
			base.hideLoading();
			var html = '';
			data.forEach((item) => {
				html += `
					<option value="${item.dkey}">${item.dvalue}</option>
				`;
			})
			$("#category").html(html)
		}, base.hideLoading)
	}

	//单图上传
	function initUpload() {
		qiniu.getQiniuToken()
			.then((data) => {
				let token = data.uploadToken;
				qiniu.uploadInit({
					token: token,
					btnId: "uploadBtn1",
					containerId: "uploadContainer1",
					multi_selection: false,
					showUploadProgress: function (up, file) {
						$(".upload-progress").css("width", parseInt(file.percent, 10) + "%");
					},
					fileAdd: function (file) {
						$(".upload-progress-wrap").show();
					},
					fileUploaded: function (up, url, key) {
						$(".upload-progress-wrap").hide().find(".upload-progress").css("width", 0);
						$("#showAvatar1").css("background-image", "url('" + url + "')");
						$("#showAvatar1").attr("data-key", key)
					}
				});
			}, () => { })
		qiniu.getQiniuToken()
			.then((data) => {
				var token = data.uploadToken;
				qiniu.uploadInit({
					token: token,
					btnId: "uploadBtn",
					containerId: "uploadContainer",
					multi_selection: true,
					showUploadProgress: function (up, file) {
					},
					fileAdd: function (up, file, oriFile) {
						base.showLoading('上传中')
					},
					error: function (up, err, errTip) {
						base.hideLoading();
						base.showMsg("上传失败！请刷新页面重新上传！");
					},
					fileUploaded: function (up, url, key, file) {
						var picHtml = `<div data-url="${key}" style="background-image: url('${PIC_PREFIX + key}?imageMogr2/auto-orient/thumbnail/!400x400r');" class="pic deleteWrap">
						  <i class="delete"></i>
						  <div class="pic-extra-wrapper">
							<div class="upload-progress"></div>
						  </div>
						</div>`;
						$("#uploadContainer").after(picHtml);
						base.hideLoading();
					}
				});
			}, () => { })
	};

	//删除图片
	$("#picWrap").on("click",".deleteWrap .delete", function(){
		$(this).parent('.deleteWrap').remove();
	})

	//安卓更新时间
	var startDate = {
		elem: '#dataWrap',
		format: 'YYYY-MM-DD',
		isclear: true, //是否显示清空
		istoday: true,
		istime: false,
		choose: function (datas) {
			if (datas) {
				var d = new Date(datas);
				d.setDate(d.getDate());
				d = d.format('yyyy-MM-dd');
				$("#dataWrap").text(d);
				$("#dataWrap .error").addClass('hidden');
			} else {
				$("#dataWrap").text('');
				$("#dataWrap .error").removeClass('hidden');
			}
		}
	};

	$('#dataWrap').click(() => {
		laydate(startDate);
	})

	//苹果更新时间
	var startDate1 = {
		elem: '#dataWrap1',
		format: 'YYYY-MM-DD',
		isclear: true, //是否显示清空
		istoday: true,
		istime: false,
		choose: function (datas) {
			if (datas) {
				var d = new Date(datas);
				d.setDate(d.getDate());
				d = d.format('yyyy-MM-dd');
				$("#dataWrap1").text(d);
				$("#dataWrap1 .error").addClass('hidden');
			} else {
				$("#dataWrap1").text('');
				$("#dataWrap1 .error").removeClass('hidden');
			}
		}
	};
	
	$('#dataWrap1').click(() => {
		laydate(startDate1);
	})
});