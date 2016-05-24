/**
 	-CommentBox
		-CommentList
			-Comment
		-CommentForm
 **/
var CommentBox = React.createClass({displayName: "CommentBox",
	render: function(){
		return (
			React.createElement("div", {className: "commentBox"}, 
				React.createElement(CommentList, null), 
				React.createElement(CommentForm, null)
			)
		);
	}
});

var CommentList = React.createClass({displayName: "CommentList",
	render: function(){
		return (
			React.createElement("div", {className: "commentList"}, 
				React.createElement(Comment, {author: "Peter"}, "heihei")
			)
		);
	}
});

var CommentForm = React.createClass({displayName: "CommentForm",
	render: function(){
		return (
			React.createElement("div", {className: "commentForm"}, 
				"this is CommentForm"
			)
		);
	}
});

var Comment = React.createClass({displayName: "Comment",
	render: function(){
		return (
			React.createElement("div", {className: "comment"}, 
				React.createElement("h2", null, this.props.author), 
				this.props.children, 
				React.createElement("br", null), 
				this.props.children.toString()
			)
		);
	}
});

ReactDOM.render(
	React.createElement(CommentBox, null),
	document.getElementById('example')
);

///////////////////////////////////////////////////////////////////////

var Mydiv = React.createClass({displayName: "Mydiv",
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
			React.createElement("div", {onClick: this.handleClick}, 
				"秒数", this.state.data.secend, "s"
			)
		);
	}
});

ReactDOM.render(
	React.createElement(Mydiv, null),
	document.getElementById('example1')
);

