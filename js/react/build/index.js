var BasicInfo = React.createClass({displayName: "BasicInfo",
	render: function(){
		var liCount = 0;
		var liNodes = this.props.data.list.map(function(onelistData){
			if(onelistData.ke === 'Github'){
				return (
					React.createElement("li", {key: liCount++, className: "clearfix"}, 
						React.createElement("span", {className: "span_left"}, onelistData.ke), 
						React.createElement("span", {className: "span_right"}, 
							React.createElement("a", {target: "_blank", href: onelistData.val}, onelistData.val)
						)
					)
				);
			}else{
				return (
					React.createElement("li", {key: liCount++, className: "clearfix"}, 
						React.createElement("span", {className: "span_left"}, onelistData.ke), 
						React.createElement("span", {className: "span_right"}, onelistData.val)
					)
				);
			}
		});
		return (
			React.createElement("div", {className: "d_basicInfo"}, 
				React.createElement("h1", null, this.props.data.name), 
				React.createElement("ul", null, 
					liNodes
				)
			)
		);
	}
});

var basicData = {
	name: '欧阳逸滨',
	list: [
		{ke: '手机', val: '13505174172'},
		{ke: '邮箱', val: 'ohyang94e@163.com'},
		{ke: 'Github', val: 'http://github.com/MrOhyang'}
	]
};

ReactDOM.render(
	React.createElement(BasicInfo, {data: basicData}),
	document.getElementById('basicInfo')
);