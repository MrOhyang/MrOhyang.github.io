/**
 	-CommentBox
		-CommentList
			-Comment
		-CommentForm
 **/
var CommentBox = React.createClass({
	render: function(){
		return (
			<div className="commentBox">
				<CommentList />
				<CommentForm />
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function(){
		return (
			<div className="commentList">
				<Comment author="Peter">heihei</Comment>
			</div>
		);
	}
});

var CommentForm = React.createClass({
	render: function(){
		return (
			<div className="commentForm">
				this is CommentForm
			</div>
		);
	}
});

var Comment = React.createClass({
	render: function(){
		return (
			<div className="comment">
				<h2>{this.props.author}</h2>
				{this.props.children}
				<br />
				{this.props.children.toString()}
			</div>
		);
	}
});

ReactDOM.render(
	<CommentBox />,
	document.getElementById('example')
);

///////////////////////////////////////////////////////////////////////

var Mydiv = React.createClass({
	handleClick: function(){
		var str = 'this time:' + this.state.data.secend + 's';
		console.log(str);
	},
	// 设置组件的初始化 state
	getInitialState: function(){
		return {data: {secend: 0}};
	},
	// 组件渲染时被 React 自动调用
	componentDidMount: function(){
		var self = this;
		window.setInterval(function(){
			var num = self.state.data.secend + 1;
			self.setState({data: {secend: num}});
		}, 1000);
	},
	// 组件渲染，事件可在此绑定
	render: function(){
		return (
			<div onClick={this.handleClick}>
				秒数{this.state.data.secend}s
			</div>
		);
	}
});

ReactDOM.render(
	<Mydiv />,
	document.getElementById('example1')
);

