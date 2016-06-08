var GAMEDATA = {
	soldier: [{
		id: 'barbarian',
		size: 1,
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
		size: 1,
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
		size: 5,
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
		size: 1,
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
		size: 2,
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
		size: 5,
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
		size: 4,
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
		size: 14,
		costObj: {
			'1': 5000,
			'2': 6000,
			'3': 3000,
			'4': 10000
		}
	},{
		id: 'dragon',
		size: 20,
		costObj: {
			'1': 25000,
			'2': 30000,
			'3': 33000,
			'4': 37000,
			'5': 42000
		}
	},{
		id: 'pika',
		size: 25,
		costObj: {
			'1': 28000,
			'2': 32000,
			'3': 36000,
			'4': 40000,
			'5': 45000
		}
	},{
		id: 'baby_dragon',
		size: 10,
		costObj: {
			'1': 15000,
			'2': 16000,
			'3': 17000,
			'4': 18000
		}
	},{
		id: 'miners_dig',
		size: 5,
		costObj: {
			'1': 4200,
			'2': 4800,
			'3': 5400,
			'4': 6000
		}
	}]
}

var Camp = React.createClass({
	getInitialState: function(){
		var data = {data: {
			listTotal: []
		}};
		for( var key in GAMEDATA.soldier ){
			data.data.listTotal.push({
				cost: 0,
				size: 0
			});
		}
		return data;
	},
	setStateOfTotal: function(id, cost, size){
		var data = JSON.parse(JSON.stringify(this.state));
		for( var key in GAMEDATA.soldier ){
			if( GAMEDATA.soldier[key].id === id ){
				break;
			}
		}
		data.data.listTotal[key] = {
			cost: cost,
			size: size
		}
		console.log(data);
		this.setState(data);
	},
	render: function(){
		var count = 0;
		var listNodes = GAMEDATA.soldier.map(function(oneData){
			var data = {
				id: oneData.id,
				size: oneData.size
			}
			return (
				<List key={'list_'+count++} data={data} funcs={this.setStateOfTotal} />
			);
		}.bind(this));

		var allTotalCost = 0;
		var allTotalSize = 0;
		for( var key in this.state.data.listTotal ){
			allTotalCost += this.state.data.listTotal[key].cost;
			allTotalSize += this.state.data.listTotal[key].size;
		}
		return (
			<div className="TrainingCamp">
				<table cellSpacing="0">
					<tbody>
						<tr>
							<th>兵种</th>
							<th>等级</th>
							<th>所需空间</th>
							<th>训练费用</th>
							<th>数量</th>
							<th>总费用</th>
							<th>总占用空间</th>
						</tr>
						{listNodes}
						<tr>
							<td><b>总计</b></td>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td><p>{allTotalCost}<b className="icon_waterdrop"></b></p></td>
							<td>{allTotalSize}</td>
						</tr>
					</tbody>
				</table>
			</div>
		);
	}
});

var List = React.createClass({
	getInitialState: function(){
		var data = {data: {
			level: 1,
			num: 0,
			wrong: false
		}};
		for(var key in GAMEDATA.soldier){
			if(GAMEDATA.soldier[key].id == this.props.data.id){
				data.data.cost = GAMEDATA.soldier[key].costObj[data.data.level];
				break;
			}
		}
		return data;
	},
	componentDidMount: function(){
		this.refs.level.value = this.state.data.level;
		this.refs.num.value = 0;
	},
	changeLevel: function(){
		var data = JSON.parse(JSON.stringify(this.state));
		var level = this.refs.level.value;
		var cost = null;
		for(var key in GAMEDATA.soldier){
			if(GAMEDATA.soldier[key].id === this.props.data.id){
				cost = GAMEDATA.soldier[key].costObj[level];
				break;
			}
		}
		if(!!cost){
			data.data.level = level;
			data.data.cost = cost;
			data.data.wrong = false;
		}else{
			data.data.wrong = true;
		}

		this.setState(data);

		var totalCost = this.state.data.cost * data.data.num;
		var totalSize = this.props.data.size * data.data.num;
		this.props.funcs(
			this.props.data.id,
			totalCost,
			totalSize
		);
	},
	changeNum: function(){
		var data = JSON.parse(JSON.stringify(this.state));
		var num = this.refs.num.value;
		if(num >= 0 && num == ~~num){
			data.data.num = num;
			data.data.wrong = false;
		}else{
			data.data.wrong = true;
		}

		this.setState(data);

		var totalCost = this.state.data.cost * data.data.num;
		var totalSize = this.props.data.size * data.data.num;
		this.props.funcs(
			this.props.data.id,
			totalCost,
			totalSize
		);
	},
	render: function(){
		var data = {
			totalCost: this.state.data.cost * this.state.data.num,
			totalSize: this.props.data.size * this.state.data.num
		}
		var allClass = '';
		if( this.state.data.wrong ){
			allClass = 'wrong';
		}else if( this.state.data.num > 0 ){
			allClass = 'have';
		}
		return (
			<tr className={allClass}>
				<td><img className="img_face" src={'./images/soldier/'+this.props.data.id+'.png'} /></td>
				<td>
					<input className="ohinput input_lev"
						   type="text"
						   placeholder="level"
						   ref="level"
						   onChange={this.changeLevel} />
				</td>
				<td>{this.props.data.size}</td>
				<td><p>{this.state.data.cost}<b className="icon_waterdrop"></b></p></td>
				<td>
					<input className="ohinput input_num"
						   type="text"
						   placeholder="num"
						   ref="num"
						   onChange={this.changeNum} />
				</td>
				<td><p>{data.totalCost}<b className="icon_waterdrop"></b></p></td>
				<td>{data.totalSize}</td>
			</tr>
		);
	}
});

ReactDOM.render(
	<Camp />,
	document.getElementById('example')
);