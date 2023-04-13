
//请求省
(function(){
	var oTakename = document.querySelector('.takename');
	var oProvince = document.querySelector('.province');
	var oCity = document.querySelector('.city');
	var oDistrict = document.querySelector('.district');
	var oStreetname = document.querySelector('.streetname');
	var oTel = document.querySelector('.tel');
	var oSaveBtn = document.querySelector('.save-address');
	var oAddressList = document.querySelector('.address-list');
	
	// 全局信号验证是编辑过来的保存，还是保存一个新地址
	var isEdit = '';
	
	//默认调用一次
	getCountry(oProvince, {}, '--请选择省份--');
	
	//封装省市区方法
	function getCountry(obj, data, msg){
	
		wjAjax.get(BASE_URL + '/api_country', data, function(res){
			if(res.code != 0){
				console.log(res);
				return;
			};
			
			console.log(res);
			console.log(data);
			//res.data 省 城市 市辖区 res.data.area 区
			var dataArr = res.data.area || res.data;
	
			//组装
			var str = `<option value="">${msg}</option>`;
			for(var i = 0; i < dataArr.length; i++){
				str += `<option value="${dataArr[i].name}">${dataArr[i].name}</option>`;
			};
			//添加到页面
			obj.innerHTML = str;
		});
	
	};
	
	//监听选择change事件
	oProvince.onchange = function(){
		console.log(this.value);
		
		// 拿到省之后，再请求城市
		getCountry(oCity, {province : this.value}, '--请选择城市--');	
	};
	
	//监听选择change事件
	oCity.onchange = function(){
		console.log(oProvince.value); //省
		console.log(this.value); //城市
		
		// 拿到省之后，再请求城市
		getCountry(oDistrict, {province : oProvince.value, city : this.value}, '--请选择区--');
		
	};
	
	//默认调用一次获取当前用户的地址列表
	setAddressList();
	
	// 默认获取当前用户的地址列表方法
	function setAddressList(){
		wjAjax.post(BASE_URL + '/api_address', {userId : TOKEN, status : 'getAddress'}, function(res){
				if(res.code != 0){
					console.log(res);
					return;
				};
				
				//拿到收货地址列表
				var addressList = res.data;
				//验证地址有空
				if(addressList.length == 0){
					oAddressList.innerHTML = '暂无收货地址~~~';
					return;
				};
				console.log(addressList)
				//调用渲染地址的方法
				renderAddress(addressList);
							
		});
	};
	
	//渲染地址方法
	function renderAddress(arr){
		//验证谁是默认地址 isDefault属性;
		
		//对数据结构进行重组
		for(var j = 0; j < arr.length; j++){
			if(arr[j].isDefault){
				//拿当前项切出来，又添加当前数组最前面去
				arr.unshift(arr.splice(j, 1)[0]);
			};
		};
		
		//组装
		oAddressList.innerHTML = '';
		for(var i = 0; i < arr.length; i++){
			var li = document.createElement('li');
			li.innerHTML = `
				<div class="uname-content">
					<div class="uname-phone">
						<span>${arr[i].takename}</span>
						<span>${arr[i].tel}</span>
					</div>
					<p>${arr[i].province} ${arr[i].city} ${arr[i].district}</p>
					<p>${arr[i].streetname}</p>
				</div>
				
				<div class="address-default">
					<span address-id="${arr[i].address_id}" class="default-btn">
						${arr[i].isDefault ? '默认地址' : '设为默认'}
					</span>
					<div>
						<span address-id="${arr[i].address_id}" class="edit-btn">编辑</span>
						<span address-id="${arr[i].address_id}" class="del-btn">删除</span>
					</div>
				</div>
			`;
			
			oAddressList.appendChild(li);
			
			// 给当前li绑定点击事件
			li.onclick = function(e){
				//点击了默认
				if(e.target.className == 'default-btn'){
					var addressId = e.target.getAttribute('address-id');
					//发起请求
					setDefaultAddress({
						status : 'defaultAddress',
						userId : TOKEN,
						addressId : addressId
					});					
				};
				
				//点击了删除
				if(e.target.className == 'del-btn'){
					//拿到当前对应的ID号
					//调用删除接口
					setAddressDel({
						status : 'deleteAddress',
						userId : TOKEN,
						addressId : e.target.getAttribute('address-id')
					}, this);
				};
				
				//点击了编辑
				if(e.target.className == 'edit-btn'){
					//把当前的addressID号
					isEdit = e.target.getAttribute('address-id');
					for(var i = 0; i < arr.length; i++){
						if(arr[i].address_id == isEdit){
							console.log(arr[i]);
							// oProvince.value = arr[i].province;
							// console.log(oCity)
							// oCity.value = arr[i].city;
							// oDistrict.value = arr[i].district;
							oStreetname.value = arr[i].streetname;
							oTakename.value = arr[i].takename;
							oTel.value = arr[i].tel;
							break;
						};
					};
				}
				
			};
		};
		
	}
	
	//新增地址按钮：保存一个全新地址和编辑地址
	oSaveBtn.onclick = function(){
		//验证
		if(oTakename.value == ''){
			alert('收货人姓名不能为空');
			// oTakename.focus();
			// oTakename.style.borderColor = 'orangered';
			return;
		};
		if(oProvince.value == '' || oCity.value == '' || oDistrict.value == ''){
			alert('请选择对应的省市区');
			return;
		};
		if(oStreetname.value == ''){
			alert('详细地址不能为空');
			return;
		};
		// var telResult = /^1[3456789]\d{9}$/g.test(oTel.value);
		// if(!telResult){
		// 	alert('手机号格式不对');
		// 	return;
		// };
		
		//请求后台，保存地址
		var addressJson = {
			status : 'addAddress', 
			userId : TOKEN,
			province : oProvince.value,
			city : oCity.value,
			district : oDistrict.value,
			streetname : oStreetname.value,
			takename : oTakename.value,
			postcode : '',
			tel : oTel.value
		};
		
		//验证是编辑还是新增
		if(isEdit){
			//删除当前的地址	isEdit
			wjAjax.post(BASE_URL + '/api_address', {
				status : 'deleteAddress',
				userId : TOKEN,
				addressId : isEdit
			}, function(res){
				if(res.code != 0){
					console.log(res);
					return;
				};
				//调用添加地址方法
				setAddAddress(addressJson);	
			});
			
		}else{
			//调用添加地址方法
			setAddAddress(addressJson);	
		};
		
		
	};
	
	// 添加地址方法 ajax
	function setAddAddress(data){
		wjAjax.post(BASE_URL + '/api_address', data, function(res){
			if(res.code != 0){
				console.log(res);
				return;
			};
			
			//添加成功
			alert('添加地址成功');
			oProvince.value = '';
			oCity.value = '';
			oDistrict.value = '';
			oStreetname.value = '';
			oTakename.value = '';
			oTel.value = '';	
			console.log(res);
			//重置
			isEdit = '';
			//调用获取列表地址方法 里面调用渲染的方法
			setAddressList();
			
		});
	};
	
	// 设置默认地址方法 ajax
	function setDefaultAddress(data){
		wjAjax.post(BASE_URL + '/api_address', data, function(res){
			if(res.code != 0){
				console.log(res);
				return;
			};
			console.log(res);
			//添加成功
			alert('设置默认地址成功');
			//做事情 重新调用渲染的方法		
			renderAddress(res.data);
			
		});
	};
	
	// 删除地址的方法 ajax
	function setAddressDel(data, obj){
		console.log(data);
		console.log(obj);
		wjAjax.post(BASE_URL + '/api_address', data, function(res){
			if(res.code != 0){
				console.log(res);
				return;
			};
			//结构删除 
			obj && obj.remove();
		})
	}
	
	
})();
