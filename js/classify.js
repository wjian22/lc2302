// 页面跳转过来，要拿当前跳转过来的 catId 号 请求商品
// 页面之间，地址栏参数传递
// 操作地址栏
console.log(window.location);
console.log(window.location.search);
console.log(window.location.search.replace('?', ''));


getUrlVal('catId');
getUrlVal('page');
getUrlVal('username');

function getUrlVal(){
	//获取地址栏，拿到参数，去掉问号
	// ['catId=0082', 'page=2']
	// [['catId', '0082'], 'page=2']
	// {catId : '0082', page : 2}
	// return obj['page']
	
	// catId=0082&page=2&username=xiaoming
	// 正则！六个方法
  var str = window.location.search.replace('?', '');
	
};


