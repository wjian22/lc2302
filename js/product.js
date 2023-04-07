
(function(){
	var oBanner = document.querySelector('.banner');
	var goodsName = document.querySelector('.goods-name');
	var goodsPrice = document.querySelector('.goods-price');
	var desc = document.querySelector('.desc');
	
	//获取参数
	var goodsId = getUrlVal1('goodsId');
	console.log(goodsId);
	
	// 发起请求
	wjAjax.get(BASE_URL + '/api_goods', {goodsId : goodsId}, function(res){
		if(res.code != 0){
			console.log(res);
			return;
		};
		
		//拿到数据
		var goods = res.data[0];
		console.log(goods);
		
		//dom 轮播图片
		var strImg = '';
		for(var i = 0; i < goods.banner.length; i++){
			// console.log(goods.banner[i].replace("url('", '').replace("')", ''));
			// console.log(goods.banner[i].slice(5, -2));
			//	https://imgs-qn.iliangcang.com/ware/upload/orig/2/392/392871.jpg
			// console.log(goods.banner[i].match(/(https:\/\/[.]+\.jpg)/g));
			
			strImg += `<img src="${goods.banner[i].slice(5, -2)}">`;
		};
		oBanner.innerHTML = strImg;
		
		// 名称 价格
		goodsName.innerHTML = goods.goods_name;
		goodsPrice.innerHTML = goods.price;
		
		//详情 
		var strDesc = '';
		for(var i = 0; i < goods.product_banner.length; i++){
			strDesc += `<img src="${goods.product_banner[i]}">`;
		}
		desc.innerHTML = strDesc;
	})
	
	
})();