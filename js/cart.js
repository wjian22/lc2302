
//查看购物车列表
(function(){
	var oTable = document.querySelector('.table');
	var oPriceAll = document.querySelector('.price-all');
	var oAccount = document.querySelector('.account');
	
	//请求 
	wjAjax.post(BASE_URL + '/api_cart', {status : 'viewcart', userId : TOKEN}, function(res){
		console.log(res);
		if(res.code != 0){
			console.log(res);
			return;
		};
		
		//组装DOM
		var cartArr = res.data;
		// 验证
		if(cartArr.length == 0){
			oTable.innerHTML = '空空如也~~~';
			return;
		};
		
		//模板
		var str = `
			<tr>
				<th><label><input type="checkbox" class="check-all"/>全选</label></th>
				<th>良品</th>
				<th>数量</th>
				<th>单价</th>
				<th>小计</th>
				<th>神操作</th>
			</tr>
		`;
		//组装
		for(var i = 0; i < cartArr.length; i++){
			str += `
				<tr>
					<td>
						<input goods-id="${cartArr[i].goods_id}" type="checkbox" class="check"/>
						<img src="${cartArr[i].goods_thumb}"/>
					</td>
					<td>${cartArr[i].goods_name}</td>
					<td>
						<span class="reduce" price="${cartArr[i].price}" goods-id="${cartArr[i].goods_id}">-</span>
						<span class="num">${cartArr[i].goods_number}</span>
						<span class="add" price="${cartArr[i].price}" goods-id="${cartArr[i].goods_id}">+</span>
					</td>
					<td>${cartArr[i].price}.00</td>
					<td class="xiaoji">${cartArr[i].price * cartArr[i].goods_number}.00</td>
					<td><a href="javascript:;" goods-id="${cartArr[i].goods_id}" class="del">删除</a></td>
				</tr>
			`;	
		};
		// 添加到页面
		oTable.innerHTML = str;
		
		//添加点击事件 对整个父级 表格 进行点击
		oTable.onclick = function(e){
			//用事件对象去进行区分
			//console.log(e.target);
			//console.log(e.target.className);
			
			//点击了全选
			if(e.target.className == 'check-all'){
				//拿到当前状态，给所有商品设置相同状态
				// console.log(e.target.checked);
				//拿到所有 check 的元素
				var aCheck = document.querySelectorAll('.check');
				for(var i = 0; i < aCheck.length; i++){
					//设置的一个交互 效果
					aCheck[i].checked = e.target.checked;
					//验证状态，设置标记值			
					aCheck[i].setAttribute('check-goods', e.target.checked ? 'check' : '');
				};
				// 调用总价
				getPriceAll();
				
			};
			
			// 点击了单选
			if(e.target.className == 'check'){
				e.target.setAttribute('check-goods', e.target.checked ? 'check' : '');
				// 调用总价
				getPriceAll();
			};
			
			//点击了加 | 减
			if(e.target.className == 'add' || e.target.className == 'reduce'){
				//拿到当前数量
				var nowNum = parseInt(e.target.parentNode.querySelector('.num').innerHTML);
				if(e.target.className == 'add'){
					nowNum++;					
					//验证最大数量
					if(nowNum > 10){
						nowNum = 10;
						return;
					};	
				}else if(e.target.className == 'reduce'){
					nowNum--;
					//验证最大数量
					if(nowNum < 1){
						nowNum = 1;
						return;
					};
				};
								
				//一定是后台数据更新完了，才能显示页面的数量
				wjAjax.post(BASE_URL + '/api_cart', {
					status : 'addcart',
					userId : TOKEN,
					goodsId : e.target.getAttribute('goods-id'),
					goodsNumber : nowNum
				}, function(res){
					if(res.code != 0){
						console.log(res);
						return;
					};
					
					//加车成功 修改当前商品数量
					e.target.parentNode.querySelector('.num').innerHTML = nowNum;
					//设置小计
					e.target.parentNode.parentNode.querySelector('.xiaoji').innerHTML = nowNum * e.target.getAttribute('price');
					
					//调用总价方法
					getPriceAll();
				});
				
			};
			
			//点击了删除
			if(e.target.className == 'del'){
				
				// 请求删除的接口，要先后台删除数据，再做前端交互
				wjAjax.post(BASE_URL + '/api_cart', {
					userId : TOKEN,
					goodsId : e.target.getAttribute('goods-id'),
					status : 'delcart'
				}, function(res){
					if(res.code != 0){
						console.log(res);
						return;
					};
					
					//后台数据 已删除 再做前端交互 删除当前元素的整个 tr
					e.target.parentNode.parentNode.remove();
					// e.target.parentNode.parentNode.parentNode.removeChild();
					// 调用总价方法
					getPriceAll();
				});
				
			};
			
		};
		
		// 封装总价的方法
		function getPriceAll(){
			// 获取所有 带标记元素(单选被中了的元素) check-goods="check"
			var aCheck = document.querySelectorAll('[check-goods="check"]');
			var price = 0;
			//遍历进行小计累加
			for(var i = 0; i < aCheck.length; i++){
				//price += 单价 * 数量
				var dj =  parseFloat(aCheck[i].parentNode.nextElementSibling.nextElementSibling.nextElementSibling.innerHTML);
				var n = parseInt(aCheck[i].parentNode.nextElementSibling.nextElementSibling.querySelector('.num').innerHTML);
				price += dj * n;
			};
			//设置
			oPriceAll.innerHTML = '总价为：' + price;
		};
			
	});
	
	// 点击结算页面
	oAccount.onclick = function(){
		if(TOKEN && USERNAME){
			
			//本地存储
			var str = '';
			var aGoods = document.querySelectorAll('input[goods-id]');
			for(var i = 0; i < aGoods.length; i++){
				if(aGoods[i].checked){
					str += aGoods[i].getAttribute('goods-id') + '&';
				};
			};
			localStorage.setItem('goodsid', str);
			
			location.href = 'address.html';
			
		}else{
			alert('非法登录');
		}
	};
	
})();