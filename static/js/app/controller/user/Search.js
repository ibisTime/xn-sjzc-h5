define([
    'app/controller/base',
	'app/interface/PageFindCtr',
    'app/module/validate',
    'app/module/smsCaptcha',
], function(base, PageFindCtr, Validate, smsCaptcha) {
	var lang = base.getUrlParam('lang') || '';
	var searchVal = base.getUrlParam('searchVal') || "";
	var	isEnd = false,
		canScrolling = false;
		var config = {
			start: 1,
			limit: 20,
			status: 1,
			name: searchVal,
		}

    
    init();
    
    function init(){
		$(".search1 .inp").val(searchVal)
		setHtml();
		requestData();
		addListener();

    }
    
    // 根据设置文本
    function setHtml(){
		$("title").html(base.getText('搜索',lang));		
		$(".cancel").html(base.getText('搜索',lang));	
	}
	
	//搜索到的软件渲染到页面
	function requestData(){
		return PageFindCtr.requestData(config).then((data) => {
			base.hideLoading();

			var lists = data.list;
            var totalCount = +data.totalCount;
            if (totalCount <= config.limit || lists.length < config.limit) {
                isEnd = true;
            }
            if(lists.length){

            	var html = "";
				lists.forEach(v => {
					html += `
					<a href="../user/list.html?code=${v.code}" class="Main">
						<img class="mainPic" src="${base.getImg(v.icon)}">
						<div class="text">
							<p class="txt1 bite">${v.name}</p>
							<p class="txt2 bite2">${v.slogan}</p>
						</div>
						<div class="down">
							<img class="downPic" src="/static/images/下载@3x.png" alt="">
							<span>${base.getUserBrowser()=='ios' ? v.iosSize : v.androidSize}</span>
						</div>
					</a>
					`;
				})
                $("#main1")[config.start == 1 ? "html" : "append"](html);
                
			} else if(config.config.start == 1) {
                $("#main1").html('<div class="no-data-img"><p>暂无相关商品</p></div>');
            } 
            canScrolling = true;
		})

	}


	function addListener(){
		//下拉加载
		$(window).off("scroll").on("scroll", function() {
			if (canScrolling && !isEnd && ($(document).height() - $(window).height() - 10 <= $(document).scrollTop())) {
				canScrolling = false;
				base.showLoading();
				requestData(data);
			}
		});

    	//搜索功能
    	$("#cancel").click(function(){
			config.name = $(".inp").val();
			config.start == 1;
			base.showLoading();
			requestData();
		})
		
		$(".search .inp").focus(function(){
			$(document).keyup(function(event){
				if(event.keyCode==13){
					config.name = $(".inp").val();
					config.start == 1;
					base.showLoading();
					requestData();
				}
			}); 
		})
		
		$(".search .inp").blur(function(){
			if (window.event.keyCode==13) window.event.keyCode=0 ;
		})

    }

    
    
    
});
