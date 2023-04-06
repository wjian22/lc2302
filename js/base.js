//全局的公共地址
var BASE_URL = 'http://159.75.89.136:3000';

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
				<a href="classify.html?catId=${arrNav[i].cat_id}" target="_blank">${arrNav[i].cat_name}</a>
				</li>
			`;
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