
console.log(TOKEN, USERNAME);

(function(){
	var oBanner = document.querySelector('.banner');
	var oProduct = document.querySelector('.product');
	var goodsName = document.querySelector('.goods-name');
	var goodsPrice = document.querySelector('.goods-price');
	var desc = document.querySelector('.desc');
	
	var oAddCart = document.querySelector('.add-cart');
	var oNowBuy = document.querySelector('.now-buy');
	var oReduce = document.querySelector('.reduce');
	var oAddBtn = document.querySelector('.add');
	var oNumber = document.querySelector('.num');
	
	//获取参数
	var goodsId = getUrlVal1('goodsId');
	console.log(goodsId);
	
	// 发起请求
	wjAjax.get(BASE_URL + '/api_goods', {goodsId : goodsId}, function(res){
		console.log(res);
		if(res.code != 0){
			console.log(res);
			return;
		};
		
		//拿到数据
		var goods = res.data[0];
		// 验证商品是否存在
		if(!goods){
			oProduct.innerHTML = '商品已下架~~~';
			return;
		};
		
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
		
		//等上面添加到页面之后，调用用户操作
		userClick();
		
	});
	
	// 用户操作按钮
	function userClick(){
		// 默认数量
		var num = 1;
		
		//点击加
		oAddBtn.onclick = function(){
			num++;
			num = num >= 10 ? 10 : num;
			oNumber.value = num;
		};
		
		//点击减
		oReduce.onclick = function(){
			num--;
			num = num <= 1 ? 1 : num;
			oNumber.value = num;
		};
		
		// 点击加入购物车
		oAddCart.onclick = function(){
			if(!TOKEN || !USERNAME){
				//没有
				alert('请登录')
				return;
			};
			
			// 加入购物当前用购物车 
			wjAjax.post(BASE_URL + '/api_cart', {
				status : 'addcart',
				goodsId : goodsId,
				userId : TOKEN,
				goodsNumber : num,
			}, function(res){
				
				if(res.code != 0){
					console.log(res);
					return;
				};
				//加车成功
				alert('加车成功');			
			})
			
		};
		
		// 点击 立即购买
		oNowBuy.onclick = function(){
			if(!TOKEN || !USERNAME){
				//没有
				alert('请登录')
				return;
			};
			
			//跳转到地址栏，还要带商品参数过去
			location.href = 'address.html?goodsId=' + goodsId;
			
		}
		
	}
	
	
	
})();