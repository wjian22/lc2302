//全局的公共地址
var BASE_URL = 'http://159.75.89.136:3000';
//获取本地 token
var TOKEN = localStorage.getItem('token');
var USERNAME = localStorage.getItem('username');

// 点击登录按钮
(function(){
	var loginBtn = document.querySelector('.login-btn');
	
	// 点击
	loginBtn.onclick = function(){
		
		// 获取当前路径参数值 
		var catId = getUrlVal1('catId');
		var goodsId = getUrlVal1('goodsId');
		//console.log('catid：'+catId, 'goodsid:'+goodsId)
		if(catId){
			location.href = 'login.html?catId=' + catId;
		}else if(goodsId){
			location.href = 'login.html?goodsId=' + goodsId;
		}else{
			location.href = 'login.html';
		};
		
	};
	
	
})();

// 验证登录状态
(function(){
	
	var oLoginBtn = document.querySelector('.login-btn');
	var oRegBtn = document.querySelector('.register-btn');
	var oWel = document.querySelector('.welcome');
	var oLoginOutBtn = document.querySelector('.loginout');
	var oCartBtn = document.querySelector('.cart-btn');
	
	//校验
	if(TOKEN && USERNAME){
		oLoginBtn.style.display = 'none';
		oRegBtn.style.display = 'none';
		oLoginOutBtn.style.display = 'inline';
		oWel.style.display = 'inline';
		oWel.innerHTML = '欢迎，' + USERNAME;
	}else{
		oLoginBtn.style.display = 'inline';
		oRegBtn.style.display = 'inline';
		oLoginOutBtn.style.display = 'none';
		oWel.style.display = 'none';
	};
	
	//登出
	oLoginOutBtn.onclick = function(){
		// 清除本地存储
		localStorage.removeItem('token');
		localStorage.removeItem('username');
		// 跳转 首页 登录
		location.href = 'index.html';
	};
	
	//点击购物车按钮
	oCartBtn.onclick = function(){
		//验证状态
		if(TOKEN && USERNAME){
			// 跳转到购物车页面
			location.href = 'cart.html';
		}else{
			alert('请登录');
		};
	};
	
})();


// 请求分类导航的数据
(function(){
	var oNav = document.querySelector('.nav');
	// var navTem = document.querySelector('#navTem').innerHTML;
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
			str += `
				<li>
					<a href="classify.html?catId=${arrNav[i].cat_id}" nav-class="${arrNav[i].cat_id}">${arrNav[i].cat_name}</a>
				</li>
			`;
		};
		//添加到nav里面
		oNav.innerHTML = str;
		
		// 获取比对
		var aNav = document.querySelectorAll('.nav [nav-class]');
		// 获取地址栏ID号
		var catId = getUrlVal2('catId');
		for(var i = 0 ; i < aNav.length; i++){
			if(aNav[i].getAttribute('nav-class') == catId){
				aNav[i].style.color = 'orangered';
				break;
			};
		};
		
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

// 搜索
(function(){
	
	var oKeyword = document.querySelector('.keyword');
	var oBtn = document.querySelector('.key-btn');
	// console.log(oKeyword)
	//js 实现跳转 location
	oBtn.onclick = function(){
		var val = oKeyword.value;
		if(val == ''){
			alert('请输入要搜索的内容');
			return;
		};
		
		// 实现跳转到搜索页面，还搜索参数过去
		window.location.href = `search.html?keyword=${val}`;
	};
	
})();

