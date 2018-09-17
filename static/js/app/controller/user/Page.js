define([
	'app/controller/base',
	'app/interface/PageFindCtr',
	'app/module/validate',
	'app/interface/GeneralCtr',
], function (base, PageFindCtr, Validate, GeneralCtr) {
	var lang = base.getUrlParam('lang') || '';
	var config = {
		category: '',
		isNecessary: '',
		start: '0',
		limit: '10'
	};
	var appCategory = {};

	init();

	function init() {
		setHtml();
		base.showLoading();
		$.when(
			getType(),
			IntroductionNecessary(),
			NewsAndInformation(),
			OnTheSoftware()
		)
	}

	function getType() {
		return GeneralCtr.getDictList('app_category').then((data) => {
			data.forEach((item) => {
				appCategory[item.dkey] = [item.dvalue];
			})
			
			$(".main .new1").html(appCategory[1]);
			$(".main .new2").html(appCategory[2]);
		}, base.hideLoading)
	}
	// 根据设置文本
	function setHtml() {
		$("title").html(base.getText('应用', lang));
		$(".inp").attr("placeholder", base.getText('请输入搜索关键词', lang));
		$(".rumen").html(base.getText('入门必备', lang));
	}

	//入门必备
	function IntroductionNecessary() {
		return PageFindCtr.requestData({...config, isNecessary: '1', limit: 5, status: '1'}).then(d => {
			base.hideLoading();
			let list = d.list;
			let html = '';
			list.forEach(v => {
				var style = '';
				if(base.getStringLength(v.name) > 7 && base.getStringLength(v.name) < 11){
					style = 'fs24'
				} else if(base.getStringLength(v.name) > 11) {
					style = 'fs20'
				}
				html += `<a href="../user/list.html?code=${v.code}&isList=1" class="HeadApp">
							<div class="wp100 hp100 imgWrap" style="background-image: url('${base.getImg(v.icon)}');"></div>
							<p class="${style}">${v.name}</p></a>`;
			})
			$('#HeadAPP').html(html);
		})
	}

	//新闻资讯
	function NewsAndInformation(){
		return PageFindCtr.requestData({category:1,start:1,limit:10, isNecessary: '0', status: '1'}).then( d => {
			let list = d.list;
			let html = '';
			list.forEach(v => {
				html += buildHtml(v);
				$('#main1').html(html);
				
			});
		})
	}

	//行情软件
	function OnTheSoftware(){
		return PageFindCtr.requestData({category:2,start:1,limit:10, isNecessary: '0', status: '1'}).then( d => {
			let list = d.list;
			let html = '';
			list.forEach(v => {
				html += buildHtml(v);
				$('#main2').html(html);
				
			});
		})
	}
	function buildHtml(v){
		return `
			<a href="../user/list.html?code=${v.code}&isList=1" class="Main">
				<img class="mainPic" src="${base.getImg(v.icon)}">
				<div class="text">
					<p class="txt1 bite">${v.name}</p>
					<p class="txt2 bite2">${v.slogan}</p>
				</div>
				<div class="down">
					<img class="downPic" src="/static/images/下载@3x.png" alt="">
					<span>${base.getUserBrowser()=='ios' ? v.iosSize : v.androidSize}M</span>
				</div>
			</a>
		`;
	}

	//page搜索框跳转
	$(".search .inp").focus(function(){
		$(document).keyup(function(event){
			if(event.keyCode==13){
				if($(".search .inp").val()&&$(".search .inp").val()!=''){
					location.href = '../user/search.html?searchVal='+$(".search .inp").val();
				}
			}
		}); 
	})
	$(".search .inp").blur(function(){
		if (window.event.keyCode==13) window.event.keyCode=0 ;
	})


	//跳转到应用上传界面
	$("#pageBanner").click(function(){
		location.href = '../user/upload.html';
	})
	
});
