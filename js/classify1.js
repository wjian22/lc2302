// 页面跳转过来，要拿当前跳转过来的 catId 号 请求商品
var catId = getUrlVal2('catId');
console.log(catId);

(function(){
	
	var oHotList = document.querySelector('.hot-list');
	
	var page = 1;
	//默认请求第一页数据
	getGoods(page);
	
	//调用总页数和分页器
	getMaxPage();
		
	
	// 封装商品请求方法
	function getGoods(page){
		
		wjAjax.get(BASE_URL + '/api_goods', {page : page, pagesize:3, catId : catId}, function(res){
			
			console.log(res);
			if(res.code != 0){
				console.log(res);
				return;
			};
			
			//拼装DOM
			var goodsArr = res.data;
			var str = '';
			
			for(var i = 0 ; i < goodsArr.length; i++){
				// 图片默认为 loading.gif 真正的值要绑定给 wj-img-loading
				str += `
					<li>
						<a href="">
							<img src="img/loading.gif" wj-img-loading="${goodsArr[i].goods_thumb}" alt="">
							<p>${goodsArr[i].goods_name}</p>
							<p>${goodsArr[i].price}</p>
							<p>${goodsArr[i].goods_desc}</p>
							<p>${goodsArr[i].star_number}</p>
							<p>${goodsArr[i].brand_name}</p>
						</a>
					</li>
				`;
			};
			//添加到容器
			oHotList.innerHTML = str;	
			//调用图片预加载
			wjImgLoading('.hot-list');
		});
	
	}
	
	//在调用分页器之前，要得到当前分类的总页数
	// 获取总页数
	function getMaxPage(){
		wjAjax.get(BASE_URL + '/api_goods', {page : 1, pagesize:3, catId : catId}, function(res){
				
				console.log(res);
				if(res.code != 0){
					console.log(res);
					return;
				};
				
				//获取总页数
				res.page;
				
				// 这里才能调用分页器
				$('.pagination').pagination({
					pageCount : res.page,
					current : 1,
					activeCls : 'a',
					prevContent : '上一页',
					nextContent : '下一页',
					mode : 'fixed',
					count : 6,
					coping : true,
					homePage : '首页',
					endPage : '末页',
					isHide : true,
					keepShowPN : true,
					jump : true,
					callback : function(idx){
						//拿到当前面做参数传递
						getGoods(idx.getCurrent())
					}
				});
				
		});
	};
	
})();

