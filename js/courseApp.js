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
			},{
				type: 'text',
				data: '不过如果这样做的话，JavaScript 会消耗一些不必要的资源，如果想要知道原因不妨买本书看看，当然也可以 Google (百度)一下。'
			},{
				type: 'text',
				data: '判断语句、循环语句都跟 C 语言类似。'
			},{
				type: 'code',
				data: 'if( true ) {} else {}\nfor(var i=0;i<5;i++){}\nwhile(){}\n...'
			},{
				type: 'text',
				data: '在这里就先略过了。'
			}]
		},{
			header: {
				number: '二',
				title: '过渡'
			},
			body: [{
				type: 'text',
				data: '先抛个砖，jquery 大多都是用来做什么事情的呢？jquery 可以选择在文档中的某一些元素然后进行一些相关操作，比如可以获取某些元素的文本内容，或者是在这个文档中删除这个元素等等；jquery 还能够对这些元素进行事件的绑定，通过触发事件来执行相关的函数；jquery 甚至还封装了 ajax 请求，帮我们做了不同浏览器版本的兼容。'
			}]
		},{
			header: {
				number: '三',
				title: '选择器、筛选'
			},
			body: [{
				type: 'text',
				data: '我们在用 jquery 的时候，最想知道的是能利用它做什么，怎么去利用它。在上一节中提到了我们可以利用 jquery 选择在文档中的某一些元素然后进行一些相关的操作。那么在这里，我们就需要如何利用 jquery 的选择器。'
			},{
				type: 'text',
				data: '我们利用 jquery 想要去获取文档中的某个元素，可以通过 jquery 封装好的选择器去选中它。例如：'
			},{
				type: 'code',
				data: '<!-- JS -->\n<sctipt>\nvar a = $(\'#div1\');       \/\/ 获取了 id 为 div1 的元素\nvar b = $(\'.content\');    \/\/ 获取了 class 为 content 的元素\nvar c = $(\'div\');         \/\/ 获取了 2 个 div 元素\n\n\/\/ 我们可以通过 console.log() 的方式在控制台打印输出内容\nconsole.log(a.text());      \/\/ \'my id is div1\'\nconsole.log(b.val());       \/\/ \'my class name is content\'\nconsole.log(c.length());    \/\/ 2\n<\/script>'
			},{
				type: 'text',
				data: '有的同学可能会问，后面的.text()那些都是什么意思？其实，对照的 HTML 文档，都可以基本猜得出来是什么意思。.text()为 jquery 封装好的获取该元素内的文本信息；.val()为获取该元素的 value 属性的值；.length() 为返回选中的元素的个数。'
			}]
		}]
	}
})