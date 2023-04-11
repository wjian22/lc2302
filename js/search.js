(function(){
	
	// 获取关键字
	var keyword = decodeURIComponent(getUrlVal1('keyword'));
	
	if(keyword == ''){return};
	
	console.log(keyword)
	
	//请求关键字内容
	wjAjax.get(BASE_URL + '/api_search', {keywords : keyword, page : 1, pagesize : 3}, function(res){
		console.log(res);
		if(res.code != 0){
			console.log(res);
			return;
		};
		
		var goodsArr = res.data;
		//有可能是空，证明没有搜索到这个数据
		if(goodsArr.length == 0){
			alert('没有数据');
			return;
		};
		
		//能运行到这里来，证明有数据..
		
		//组装 DOM 分页
		
	})

})();



