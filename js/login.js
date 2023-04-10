//全局的公共地址
var BASE_URL = 'http://159.75.89.136:3000';

(function(){
	
	var oUsername = document.querySelector('.username-txt');
	var oPasswrod = document.querySelector('.password-txt');
	var oLoginBtn = document.querySelector('.login-btn');
	
	// 点击
	oLoginBtn.onclick = function(){
		// 验证不能为空
		var usernameVal = oUsername.value;
		var pwdVal = oPasswrod.value;
		if(usernameVal == '' || pwdVal == ''){
			alert('用户名或密码不能为空');
			return;
		};
		
		//请求登录接口
		wjAjax.post(BASE_URL + '/api_user', {status : 'login', username : usernameVal, password : pwdVal}, function(res){
			console.log(res);
			if(res.code == 1007 || res.code == 1008){
				alert('用户名或密码错误');
				return;
			};
			
			if(res.code !== 0){
				//后台的问题
				alert('服务器繁忙~~~');
				return;
			};
			
			
			// 记录设置登录状态 把用户信息存储到本地
			localStorage.setItem('username', res.username);
			localStorage.setItem('token', res.user_id);
			//登录成功了 跳转到首页
			location.href = 'index.html';
			
		})
	}
	
	
})();
