/*
	版本：1.0.0
	作者：wj
	QQ : xxxxx
	
	功能方法：
		一，运动方法：animate(运动对象，目标对象，时间，[缓冲名]，[回调函数]);
		
		二，计算后样式：fetchComputedStyle(对象，CSS属性);
		
		三，获取子节点：children(对象, [子节点下标]);
		
		四，净位置方法：getLeftAll(对象) getTopAll(对象)
		
		五，封装ajax wjAjax.get() wjAjax.post() wjAjax.ajax() wjAjax.queryString()
			  wjAjax.get(地址, {即使没有参数也要是一个空对象}, 回调函数)
				
		六，模板字符串方法 wjCompile(str, obj)
				
		缓冲公式：
	
*/

//一，运动框架
function animate(obj, objTarget, times, tweenName, callback){
	//元素要运动，必传参数：obj target times
	//可选参数：tweenName 如果不传 默认为 linear
	//callback：不传参，不做事
	//console.log(typeof arguments[0]);
	//console.log(arguments.length);
	if(arguments.length == 3 && (typeof arguments[0] != 'object' || typeof arguments[1] != 'object' || typeof arguments[2] != 'number')){
		//抛出错误
		throw new Error('必传三个参数：第一个为运动对象，第二个为对象形式的目标点，第三个为number类型的时间ms');
		
	}else if(arguments.length == 3){
		//设置四五参数的默认值
		tweenName = 'linear';
		callback = null;
	}else if(arguments.length == 4){
		//验证 参数 类型 ：string | function
		switch(typeof arguments[3]){
			case 'string':
				tweenName = arguments[3];
				callback = null;
				break;
			case 'function':
				//如果实参是四个参数，最后一个是 function; 那么形参对应其是 tweenName
				callback = arguments[3];
				tweenName = 'linear';
				break;
		}
	}else if(arguments.length == 5){
		if(typeof arguments[3] != 'string' || typeof arguments[4] != 'function'){
			throw new Error('第四个参数为string类型的缓冲名，第五个参数为回调函数');
		};
	};
	
	
	//上锁
	obj.lock = true;
	
	//定时器间隔 初始值 总帧数 步长
	var interval = 10;
	
	//初始值
	var objStart = {};	
	for(var k in objTarget){
		objStart[k] = fetchComputedStyle(obj, k);
	};
	
	//总帧数 总次数
	var maxCount = parseInt(times / interval);
	
	// 运动距离：目标点 - 初始点
	var objDistance = {};
	for(var k in objTarget){
		objDistance[k] = objTarget[k] - objStart[k];
	};

	//定时器
	var timer;
	
	//当前帧
	var nowCount = 0;
	
	// 开定时器
	timer = setInterval(function(){
		//当前帧数的累加
		nowCount++;
				
		// 先设置
		for(var k in objStart){
			if(k == 'opacity'){
				obj.style[k] = Tween[tweenName](nowCount, objStart[k], objDistance[k], maxCount);
			}else{
				//使用公式去做
				obj.style[k] = Tween[tweenName](nowCount, objStart[k], objDistance[k], maxCount) + 'px';
			};
		};
					
		// 验证
		if(nowCount == maxCount){
			//停止定时器
			clearInterval(timer);
			//设置终点
			for(var k in objStart){
				if(k == 'opacity'){
					obj.style[k] = objTarget[k];
				}else{
					obj.style[k] = objTarget[k] + 'px';
				};
			};
			//开锁
			obj.lock = false;
			// 手动指定一下函数体内的this
			callback && callback.call(obj);
		};	
	}, interval);
};	
	
//二，计算后样式
function fetchComputedStyle(obj, property){
	
	//处理兼容
	if(window.getComputedStyle){
		// chrome 火狐
		return parseFloat(getComputedStyle(obj)[property]);
	}else{
		//IE低版本
		return parseFloat(obj.currentStyle[property]);
	};
};

//三，获取所有子节点方法
function children(el, idx){
	var arr = [];
	var all = el.childNodes;
	for(var i = 0; i < all.length; i++){
		if(all[i].nodeType == 1){
			arr.push(all[i]);
		};
	};
	return idx ? arr[idx] : arr;
};

//四，净位置
function getTopAll(obj, isBorder){
	var topAll = 0;	
	topAll += obj.offsetTop;
	topAll += isBorder ? parseInt(getComputedStyle(obj)['border-top-width']) : 0;
	while(obj = obj.offsetParent){
		topAll += obj.offsetTop;
		topAll += parseInt(getComputedStyle(obj)['border-top-width']);
	};
	return topAll;
};

function getLeftAll(obj, isBorder){
	var leftAll = 0;	
	leftAll += obj.offsetLeft;
	leftAll += isBorder ? parseInt(getComputedStyle(obj)['border-left-width']) : 0;
	while(obj = obj.offsetParent){
		leftAll += obj.offsetLeft;
		leftAll += parseInt(getComputedStyle(obj)['border-left-width']);
	};
	return leftAll;
};

//五，封装ajax方法
var wjAjax = {
	//get方法
	get : function(url, data, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
					callback(JSON.parse( xhr.response));
				};
			};
		};
		var url = wjAjax.queryString(data) ? url + '?' + wjAjax.queryString(data) : url;
		xhr.open('get', url);
		xhr.send();
	},
	
	//post方法
	post : function(url, data, callback){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
					callback(JSON.parse( xhr.response));
				};
			};
		};
		xhr.open('post', url);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.send(wjAjax.queryString(data));
	},
	
	//ajax
	ajax : function(obj){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState == 4){
				if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
					obj.success(JSON.parse( xhr.response));
				};
			};
		};
		if(obj.type.toLowerCase() == 'get'){
			var url = wjAjax.queryString(obj.data) ? obj.url + '?' + wjAjax.queryString(obj.data) : obj.url;	
			xhr.open('get', url);
			xhr.send();		
		}else if(obj.type.toLowerCase() == 'post'){
			xhr.open('post', obj.url);
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.send(wjAjax.queryString(obj.data));
		};
		
	},
	
	//序列化封装
	queryString: function(obj){
		var arr = [];
		for(var k in obj){
			arr.push(k + '=' + encodeURIComponent(obj[k]));
		};
		return arr.join('&');
	},
	
};

//六，模板字符串方法
function wjCompile(str, obj){
	return str.replace(/@([a-z0-9_]+)@/g, function(match, $1){
		//返回的正好是 $1 的属性值
		return obj[$1];
	});
};


//三，缓冲公式
var Tween = {
	linear: function(t, b, c, d) {
			return c * t / d + b;
	},
	easeIn: function(t,b,c,d){
			return c * ( t /= d) * t + b;
	},		
	easeOut: function(t,b,c,d){
			return -c *(t/=d)*(t-2) + b;
	},
	
	//二次的
	quadEaseIn: function(t, b, c, d) {
			return c * (t /= d) * t + b;
	},
	quadEaseOut: function(t, b, c, d) {
			return -c * (t /= d) * (t - 2) + b;
	},
	quadEaseInOut: function(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t + b;
			return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	//三次的
	qubicEaseIn: function(t, b, c, d) {
			return c * (t /= d) * t * t + b;
	},
	qubicEaseOut: function(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t + 1) + b;
	},
	qubicEaseInOut: function(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t + 2) + b;
	},
	//四次的
	quartEaseIn: function(t, b, c, d) {
			return c * (t /= d) * t * t * t + b;
	},
	quartEaseOut: function(t, b, c, d) {
			return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	quartEaseInOut: function(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
			return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	quartEaseIn: function(t, b, c, d) {
			return c * (t /= d) * t * t * t * t + b;
	},
	quartEaseOut: function(t, b, c, d) {
			return c * ((t = t / d - 1) * t * t * t * t + 1) + b;
	},
	quartEaseInOut: function(t, b, c, d) {
			if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
			return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
	},
	//正弦的
	sineEaseIn: function(t, b, c, d) {
			return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
	},
	sineEaseOut: function(t, b, c, d) {
			return c * Math.sin(t / d * (Math.PI / 2)) + b;
	},
	sineEaseInOut: function(t, b, c, d) {
			return -c / 2 * (Math.cos(Math.PI * t / d) - 1) + b;
	},
	expoEaseIn: function(t, b, c, d) {
			return (t == 0) ? b : c * Math.pow(2, 10 * (t / d - 1)) + b;
	},
	expoEaseOut: function(t, b, c, d) {
			return (t == d) ? b + c : c * (-Math.pow(2, -10 * t / d) + 1) + b;
	},
	expoEaseInOut: function(t, b, c, d) {
			if (t == 0) return b;
			if (t == d) return b + c;
			if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
			return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
	},
	circEaseIn: function(t, b, c, d) {
			return -c * (Math.sqrt(1 - (t /= d) * t) - 1) + b;
	},
	circEaseOut: function(t, b, c, d) {
			return c * Math.sqrt(1 - (t = t / d - 1) * t) + b;
	},
	circEaseInOut: function(t, b, c, d) {
			if ((t /= d / 2) < 1) return -c / 2 * (Math.sqrt(1 - t * t) - 1) + b;
			return c / 2 * (Math.sqrt(1 - (t -= 2) * t) + 1) + b;
	},
	elasticEaseIn: function(t, b, c, d, a, p) {
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * .3;
			if (!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	elasticEaseOut: function(t, b, c, d, a, p) {
			if (t == 0) return b;
			if ((t /= d) == 1) return b + c;
			if (!p) p = d * .3;
			if (!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
	},
	elasticEaseInOut: function(t, b, c, d, a, p) {
			if (t == 0) return b;
			if ((t /= d / 2) == 2) return b + c;
			if (!p) p = d * (.3 * 1.5);
			if (!a || a < Math.abs(c)) {
					a = c;
					var s = p / 4;
			} else var s = p / (2 * Math.PI) * Math.asin(c / a);
			if (t < 1) return -.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
			return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * .5 + c + b;
	},
	//冲过头系列
	backEaseIn: function(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	backEaseOut: function(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	backEaseInOut: function(t, b, c, d, s) {
			if (s == undefined) s = 1.70158;
			if ((t /= d / 2) < 1) return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
			return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	//弹跳系列
	bounceEaseIn: function(t, b, c, d) {
			return c - Tween.bounceEaseOut(d - t, 0, c, d) + b;
	},
	bounceEaseOut: function(t, b, c, d) {
			if ((t /= d) < (1 / 2.75)) {
					return c * (7.5625 * t * t) + b;
			} else if (t < (2 / 2.75)) {
					return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
			} else if (t < (2.5 / 2.75)) {
					return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
			} else {
					return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
			}
	},
	bounceEaseInOut: function(t, b, c, d) {
			if (t < d / 2) return Tween.bounceEaseIn(t * 2, 0, c, d) * .5 + b;
			else return Tween.bounceEaseOut(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
	}
}

