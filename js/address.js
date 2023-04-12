
//请求省
(function(){
	var oProvince = document.querySelector('.province');
	var oCity = document.querySelector('.city');
	var oDistrict = document.querySelector('.district');
	
	//默认调用一次
	getCountry(oProvince, {}, '--请选择省份--');
	
	
	function getCountry(obj, data, msg){
	
		wjAjax.get(BASE_URL + '/api_country', data, function(res){
			if(res.code != 0){
				console.log(res);
				return;
			};
			
			console.log(res);
			console.log(data)
			//res.data 省 城市 市辖区 city
			//res.data.area 区
			//var dataArr = 'city' in data ? res.data.area : res.data;
			
			// var dataArr = res.data;
			
			// if(data.city == '市辖区' || 'city' in data){
			// 	var dataArr = res.data.area;
			// }
			
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
	
})();