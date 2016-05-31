var BasicInfo = React.createClass({
	render: function(){
		var liCount = 0;
		var liNodes = this.props.data.list.map(function(onelistData){
			if(onelistData.ke === 'Github'){
				return (
					<li key={liCount++} className="clearfix">
						<span className="span_left">{onelistData.ke}</span>
						<span className="span_right">
							<a target="_blank" href={onelistData.val}>{onelistData.val}</a>
						</span>
					</li>
				);
			}else{
				return (
					<li key={liCount++} className="clearfix">
						<span className="span_left">{onelistData.ke}</span>
						<span className="span_right">{onelistData.val}</span>
					</li>
				);
			}
		});
		return (
			<div className="d_basicInfo">
				<h1>{this.props.data.name}</h1>
				<ul>
					{liNodes}
				</ul>
			</div>
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
	<BasicInfo data={basicData} />,
	document.getElementById('basicInfo')
);