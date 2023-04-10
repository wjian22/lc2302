//全局的公共地址
var BASE_URL = 'http://159.75.89.136:3000';

// 交互
(function(){
	var oUsername = document.querySelector('.username-txt');
	var oPassword = document.querySelector('.password-txt');
	var oRegBtn = document.querySelector('.reg-btn');
	var oUnameMsg = document.querySelector('.username-msg');
	var oPwdMsg = document.querySelector('.pwd-msg');
	
	// 全局变量
	var isUsername = false;
	var isPassword = false;
	
	//验证按钮
	function isCheck(){
		if(isUsername && isPassword){
			oRegBtn.disabled = false;
		}else{
			oRegBtn.disabled = true;
		}
	};
	
	//设置交互
	function isMsg(obj, objSpan, isBlock, isColor, msg){
		// 做交互
		objSpan.style.display = isBlock;
		objSpan.style.color = isColor;
		objSpan.innerHTML = msg;
		
		if(obj){
			// 调用聚集方法
			obj.focus();
			obj.style.borderColor = isColor;	
		};	
	};
	
	// 验证用户名是否可用
	oUsername.onchange = function(){
		// console.log('input')
		// 拿到用户输入的值
		var usernameVal = oUsername.value;
		// 进行前端校验
		var re = /^[0-9a-z_]{3,12}$/g;
		if(!re.test(usernameVal)){
			// 做交互
			isMsg(oUsername, oUnameMsg, 'block', 'red', '用户名必须为3-12位数字字母下线划组成');
					
			//验证按钮
			isUsername = false;
			isCheck();
			return;
		};
		
		// 前端通过规则验证，发起请求，查看用户名是否可用
		//console.log('前端通过规则验证')
		wjAjax.post(BASE_URL + '/api_user', {username : usernameVal, status : 'check'}, function(res){
			console.log(res);
			if(res.code == 1005){
				// 做交互
				isMsg(oUsername, oUnameMsg, 'block', 'red', '用户名已存在');
				
				//验证按钮
				isUsername = false;
				isCheck();
				return;
			};
			
			// 做交互
			isMsg(null, oUnameMsg, 'block', 'green', '用户名可用');

			oUsername.style.borderColor = '#000';
			//验证按钮
			isUsername = true;
			isCheck();
			
		});
		
	};
	
	// 验证密码
	oPassword.onkeyup = function(){
		//拿到当前输入的值，做正则验证
		var pwdVal = this.value;
		var re = /^[0-9]{6,12}$/g;
		if(!re.test(pwdVal)){ 
			// 做交互
			isMsg(null, oPwdMsg, 'block', 'red', '密码必须为6-12位数字');

			//验证按钮
			isPassword = false;
			isCheck();
			return;
		};
		
		// 通过了 做交互
		isMsg(null, oPwdMsg, 'block', 'green', 'OK');

		//验证按钮
		isPassword = true;
		isCheck();
		
	};
	
	//点击注册按钮
	oRegBtn.onclick = function(){
		//获取值，进行注册请求
		var usernameVal = oUsername.value;
		var pwdVal = oPassword.value;
		// 进行前端校验
		var re = /^[0-9a-z_]{3,12}$/g;
		if(!re.test(usernameVal)){
			// 做交互
			isMsg(oUsername, oUnameMsg, 'block', 'red', '用户名必须为3-12位数字字母下线划组成');
			return;
		};
		
		// 发起请求
		wjAjax.post(BASE_URL + '/api_user', {username : usernameVal, password : pwdVal, status : 'register'}, function(res){
			console.log(res);
			if(res.code == 1005){
				//验证按钮
				isUsername = false;
				isCheck();
				return;
			};
			
			//注册成功！ 做交互 3秒后跳转到登录
			alert('注册成功！3秒后跳转到登录');
			location.href = 'login.html';
			
			//setInterval(function(){}, 2000);
			
		})
		
		
	};
	
})();