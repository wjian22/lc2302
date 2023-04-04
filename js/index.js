
//全局的公共地址
var BASE_URL = 'http://159.75.89.136:3000';

// 请求分类导航的数据
(function(){
	var oNav = document.querySelector('.nav');
	var navTem = document.querySelector('#navTem').innerHTML;
	//console.log(navTem)
	
	//发起ajax请求
	wjAjax.get(BASE_URL + '/api_cat', {}, function(res){
		//验证数据
		if(res.code != 0){
			console.log(res);
			return;
		};
		var arrNav = res.data;
		console.log(arrNav);
		//进行DOM组装渲染  <li><a href="">家居</a></li> 拼字符串方法
		var str = '';
		for(var i = 0; i < arrNav.length; i++){
			// str += '<li><a href="">' + arrNav[i].cat_name + '</a>';
			str += wjCompile(navTem, arrNav[i]);
		};
		//添加到nav里面
		oNav.innerHTML = str;
		
		// for(var i = 0; i < arrNav.length; i++){
		// 	// 创建元素
		// 	var li = document.createElement('li');
		// 	li.innerHTML = '<a href="">'+arrNav[i].cat_name+'</a>';
		// 	//appendChild方法 添加只能是节点
		// 	// oNav.appendChild('<span>span<span>');
		// 	oNav.appendChild(li);
		// };
		
		
	});
	
})();

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
			str += `<li><a href=""><img src="${bannerArr[i].goods_thumb}" alt=""></a></li>`;
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
	var nowPage = 1;
	
	//先调用一次
	getHot(nowPage);
	
	//定义一把锁
	var lock = false;
	// 点击事件
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
			
			for(var i = 0 ; i < goodsArr.length; i++){
				var li = document.createElement('li');
				li.innerHTML = `
					<img src="${goodsArr[i].goods_thumb}" alt="">
					<p>${goodsArr[i].goods_name}</p>
					<p>${goodsArr[i].price}</p>
					<p>${goodsArr[i].goods_desc}</p>
					<p>${goodsArr[i].star_number}</p>
					<p>${goodsArr[i].brand_name}</p>
				`;
				// 每遍历 一次就要添加一次
				oHotList.appendChild(li);
			};	
			
			// 开锁
			lock = false;
		})
	};
	
	
	
	
	
})();


