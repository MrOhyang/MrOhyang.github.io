var GAMEDATA = {
	soldier: [{
		id: 'barbarian',
		costObj: {
			'1': 25,
			'2': 40,
			'3': 60,
			'4': 100,
			'5': 150,
			'6': 200,
			'7': 250
		}
	},{
		id: 'archer',
		costObj: {
			'1': 50,
			'2': 80,
			'3': 120,
			'4': 200,
			'5': 300,
			'6': 400,
			'7': 500
		}
	},{
		id: 'titan',
		costObj: {
			'1': 250,
			'2': 750,
			'3': 1250,
			'4': 1750,
			'5': 2250,
			'6': 3000,
			'7': 3500
		}
	},{
		id: 'goblin',
		costObj: {
			'1': 25,
			'2': 40,
			'3': 60,
			'4': 80,
			'5': 100,
			'6': 150,
			'7': 200
		}
	},{
		id: 'bomberman',
		costObj: {
			'1': 1000,
			'2': 1500,
			'3': 2000,
			'4': 2500,
			'5': 3000,
			'6': 3500
		}
	},{
		id: 'balloonist',
		costObj: {
			'1': 2000,
			'2': 2500,
			'3': 3000,
			'4': 3500,
			'5': 4000,
			'6': 5000
		}
	},{
		id: 'wizard',
		costObj: {
			'1': 1500,
			'2': 2000,
			'3': 2500,
			'4': 3000,
			'5': 3500,
			'6': 4000
		}
	},{
		id: 'healer',
		costObj: {
			'1': 5000,
			'2': 6000,
			'3': 3000,
			'4': 10000
		}
	},{
		id: 'dragon',
		costObj: {
			'1': 25000,
			'2': 30000,
			'3': 33000,
			'4': 37000,
			'5': 42000
		}
	}]
}

var allData = {data: {
	totalCost: 0,
	totalSize: 0,
	list: [{
		id: 'barbarian',
		imgName: 'barbarian-1.png',
		size: 1
	},{
		id: 'archer',
		imgName: 'archer-1.png',
		size: 1
	},{
		id: 'titan',
		imgName: 'titan-1.png',
		size: 5
	},{
		id: 'goblin',
		imgName: 'goblin-1.png',
		size: 1
	},{
		id: 'bomberman',
		imgName: 'bomberman-1.png',
		size: 2
	},{
		id: 'balloonist',
		imgName: 'balloonist-1.png',
		size: 5
	},{
		id: 'wizard',
		imgName: 'wizard-1.png',
		size: 4
	},{
		id: 'healer',
		imgName: 'healer-1.png',
		size: 14
	},{
		id: 'dragon',
		imgName: 'dragon-1.png',
		size: 20
	}]
}};
for( var key in allData.data.list ){
	allData.data.list[key].level = 1;
	allData.data.list[key].num = 0;
	allData.data.list[key].cost = GAMEDATA.soldier[key].costObj[1];
	allData.data.list[key].totalCost = 0;
	allData.data.list[key].totalSize = 0;
	allData.data.list[key].wrong = false;
}

var Camp = React.createClass({displayName: "Camp",
	getInitialState: function(){
		return allData;
	},
	compute: function(data){
		var allData = {
			data: JSON.parse(JSON.stringify(this.state.data))
		};
		for( var key in allData.data.list ){
			if( allData.data.list[key].id === data.id ){
				allData.data.list[key].cost = data.cost;
				allData.data.list[key].totalCost = data.totalCost;
				allData.data.list[key].totalSize = data.totalSize;
				allData.data.list[key].wrong = data.wrong;
				break;
			}
		}
		allData.data.totalCost = allData.data.totalSize = 0;
		allData.data.list.map(function(oneListData){
			this.data.totalCost += oneListData.totalCost;
			this.data.totalSize += oneListData.totalSize;
		}.bind(allData));
		this.setState(allData);
	},
	render: function(){
		var count = 0;
		var listNodes = this.state.data.list.map(function(oneListData){
			return (
				React.createElement(List, {key: 'list_'+count++, data: oneListData, func: this.compute})
			);
		}.bind(this));
		return (
			React.createElement("div", {className: "TrainingCamp"}, 
				React.createElement("table", {cellSpacing: "0"}, 
					React.createElement("tbody", null, 
						React.createElement("tr", null, 
							React.createElement("th", null, "兵种"), 
							React.createElement("th", null, "等级"), 
							React.createElement("th", null, "所需空间"), 
							React.createElement("th", null, "训练费用"), 
							React.createElement("th", null, "数量"), 
							React.createElement("th", null, "总费用"), 
							React.createElement("th", null, "总占用空间")
						), 
						listNodes, 
						React.createElement("tr", null, 
							React.createElement("td", null, React.createElement("b", null, "总计")), 
							React.createElement("td", null), 
							React.createElement("td", null), 
							React.createElement("td", null), 
							React.createElement("td", null), 
							React.createElement("td", null, React.createElement("p", null, this.state.data.totalCost, React.createElement("b", {className: "icon_waterdrop"}))), 
							React.createElement("td", null, this.state.data.totalSize)
						)
					)
				)
			)
		);
	}
});

var List = React.createClass({displayName: "List",
	componentDidMount: function(){
		this.refs.level.value = this.props.data.level;
		this.refs.num.value = this.props.data.num;
	},
	changeCost: function(){
		var cost = null;
		var wrong = false;
		for( var key in GAMEDATA.soldier ){
			if( GAMEDATA.soldier[key].id === this.props.data.id ){
				cost = GAMEDATA.soldier[key].costObj[this.refs.level.value];
				break;
			}
		}
		if( !cost ){
			wrong = true;
		}
		this.compute(cost, wrong);
	},
	compute: function(flag, wrong){
		var data = {
			id: this.props.data.id,
			imgName: this.props.data.imgName,
			cost: 0,
			num: ~~this.refs.num.value,
			totalCost: 0,
			totalSize: 0,
			wrong: false
		}
		if(typeof flag === 'number'){
			data.cost = flag;
		}else{
			data.cost = this.props.data.cost;
		}
		if( data.num < 0 || !!wrong || ~~this.refs.level.value<=0 ){
			data.wrong = true;
		}
		data.totalCost = data.cost * data.num;
		data.totalSize = this.props.data.size * data.num;
		this.props.func(data);
	},
	render: function(){
		var wrongClass = '';
		if( this.props.data.wrong ){
			wrongClass = 'wrong';
		}
		return (
			React.createElement("tr", {className: wrongClass}, 
				React.createElement("td", null, React.createElement("img", {className: "img_face", src: './images/soldier/'+this.props.data.imgName})), 
				React.createElement("td", null, 
					React.createElement("input", {className: "ohinput input_lev", 
						   type: "text", 
						   placeholder: "level", 
						   ref: "level", 
						   onChange: this.changeCost})
				), 
				React.createElement("td", null, this.props.data.size), 
				React.createElement("td", null, React.createElement("p", null, this.props.data.cost, React.createElement("b", {className: "icon_waterdrop"}))), 
				React.createElement("td", null, 
					React.createElement("input", {className: "ohinput input_num", 
						   type: "text", 
						   placeholder: "num", 
						   ref: "num", 
						   onChange: this.compute})
				), 
				React.createElement("td", null, React.createElement("p", null, this.props.data.totalCost, React.createElement("b", {className: "icon_waterdrop"}))), 
				React.createElement("td", null, this.props.data.totalSize)
			)
		);
	}
});

ReactDOM.render(
	React.createElement(Camp, null),
	document.getElementById('example')
);