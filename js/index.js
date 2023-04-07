


// 轮播图
(function(){
	var oList = document.querySelector('.banner-list');
	
	//请求轮播数据
	wjAjax.get(BASE_URL + '/api_banner', {bannerId : 1}, function(res){
		console.log(res);
		if(res.code != 0){
			console.log(res);
			return;
		};
		
		//拼装DOM
		var bannerArr = res.data;
		var str = ``;
		for(var i = 0; i < bannerArr.length; i++){
			str += `<li><a target="_blank" href="product.html?goodsId=${bannerArr[i].goods_id}"><img src="${bannerArr[i].goods_thumb}" alt=""></a></li>`;
		};
		console.log(str)
		//添加到页面
		oList.innerHTML = str;
		
		//在这里开始做轮播效果
		//调用封装轮播的方法
		bannerPlay();
		
	});
	
	// 封装轮播的方法
	function bannerPlay(){
		
	};
	
})();

// 热门商品
(function(){
	
	var oHotList = document.querySelector('.hot-list');
	var oMore = document.querySelector('.more');
	//当前页面
	var nowPage = 544;
	
	//先调用一次
	getHot(nowPage);
	
	// //定义一把锁
	var lock = false;
	
	// 滚动到底部加载下一页
	// window.onscroll = function(){
	// 	//浏览器高度
	// 	var windowH = window.innerHeight;	
	// 	//console.log('滚动出去的值');
	// 	var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
	// 	// 页面高度
	// 	var pageH = document.body.clientHeight || document.documentElement.clientHeight;
		
	// 	// 验证
	// 	if((windowH + scrollTop)/pageH >= 0.9){
	// 		//console.log('快到底了111')
	// 		// 验证锁
	// 		if(lock){return};
	// 		// 上锁
	// 		lock = true;
	// 		//console.log('快到底了222')
	// 		// 加载下一页
	// 		nowPage++;
	// 		console.log(nowPage);
	// 		getHot(nowPage);
	// 	};
		
	// };
	
	
	// // 点击更多事件
	oMore.onclick = function(){
		if(lock){return};
		// 上锁
		lock = true;
		nowPage++;	
		
		//调用请求数据方法
		getHot(nowPage);
	};
	
	//默认请求商品
	function getHot(nowPage){
		wjAjax.get(BASE_URL + '/api_goods', {page : nowPage, pagesize : 3}, function(res){
			if(res.code != 0){
				console.log(res);
				return;
			};
			console.log(res);
			//可以拼装
			var goodsArr = res.data;
			//如果goodsArr数组长度 == 0 证明没有更多数据了
			if(goodsArr.length == 0){
				// 交互
				oMore.innerHTML = '没有更多了~~~';
				return;
			}
			
			for(var i = 0 ; i < goodsArr.length; i++){
				var li = document.createElement('li');
				// 图片默认为 loading.gif 真正的值要绑定给 wj-img-loading
				li.innerHTML = `
					<a target="_blank" href="product.html?goodsId=${goodsArr[i].goods_id}">
						<img src="img/loading.gif" wj-img-loading="${goodsArr[i].goods_thumb}" alt="">
						<p>${goodsArr[i].goods_name}</p>
						<p>${goodsArr[i].price}</p>
						<p>${goodsArr[i].goods_desc}</p>
						<p>${goodsArr[i].star_number}</p>
						<p>${goodsArr[i].brand_name}</p>
					</a>
				`;
				// 每遍历 一次就要添加一次
				oHotList.appendChild(li);
			};	
			
			//调用图片预加载方法
			wjImgLoading('.hot-list');
			
			// 开锁
			lock = false;
		})
	};
	
	
	
	
	
})();


