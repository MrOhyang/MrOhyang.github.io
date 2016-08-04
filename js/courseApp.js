var app = angular.module('myApp', []);

app.controller('publicCtrl', function($scope){
	$scope.model = {
		textObj: [{
			header: {
				number: '一',
				title: '语法篇'
			},
			body: [{
				type: 'text',
				data: 'JavaScript 是一门弱语言，也是一门脚本语言。其实它的语法结构的和广大的编程语言差不多。'
			},{
				type: 'text',
				data: '常见数据类型：Int, String, Bool, Array, Object, Function'
			},{
				type: 'text',
				data: '比较特殊的是，在 JavaScript 中，一个变量可以存储不同的数据类型，而且不需要定义类别，比如说这样子：'
			},{
				type: 'code',
				data: 'var a = 100;\nconsole.log(a);    // 100\na = \'str\';\nconsole.log(a);    // \'str\''
			}]
		}]
	}
})