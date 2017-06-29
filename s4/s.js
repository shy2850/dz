var fs = require("fs"),
	http = require("http"),
	url = require("url"),
	querystring = require("querystring");
var GAME=require('./util-game.js').GAME; //存放处理扑克的算法
var SERVER={
	send:function(data,r,resp){
		resp.end( (r.callback || "callback") + '('+JSON.stringify(data)+');' );
	},
	sendAll:function(game,r,resp){
		var c=game.config,p=game.player,g=game.global;
		var index=p.id.indexOf(r.id);
		if(index==-1){
			SERVER.send({'no':true},r,resp);
			return;
		}
		function rank(a){
			if(index==0){return a;}
			else{
				var b=a.slice(0,index),c=a.slice(index);
				return (c.concat(b)).slice(0);
			}
		}
		var pp={
			'button':[0,0,0,0,0],
			'turning':[0,0,0,0,0]
		}
		pp.button[g.button]=1;
		pp.turning[g.turn]=1;
		
		var d={
			'operate':(index!=g.turn)?'':g.operate,
			'board':g.board,
			'sidepot':g.sidepot,
			'nextbtn':g.nextbtn,
			'time':g.time
		}
		var arr=[];
		for(var i=0;i<c.N;i++){
			arr.push({
				'id':p.id[i],
				'name':p.name[i],
				'photo':p.photo[i],
				'chip':p.chip[i],
				'bet':p.bet[i],
			 	'button':pp.button[i],
				'turning':pp.turning[i],
				'winchip':p.winchip[i],
				'win':p.win[i],
				'hole':( (g.step==5 && p.state[i]>0 )|| i==index)?p.hole[i]:'',
				'actionable':p.state[i],
				'deal':(p.state[i]==0)?'hidden':( (p.state[i]==-1)?'deal-fold':'' ),
				'info':p.action[i]
			})
		}
		d.list=rank(arr);
		var classSit=['p-l p-b p-me','p-l','p-l','p-l','p-l p-t','p-r p-t','p-r','p-r','p-r'];
		for(var i=0;i<c.N;i++){
			d.list[i].classSit=classSit[i];
		}
		SERVER.send(d,r,resp);
	},
	login:function(r,resp){
		var user = JSON.parse( fs.readFileSync( "user.json", 'utf-8') );
		var c=game.config,p=game.player,g=game.global;
		for(var i=0;i<user.length;i++){
			if(r.id==user[i].id && r.password==user[i].password){ //判断数据库中是否存在

				//如果不在本局游戏中
				if(p.id.indexOf(r.id)==-1){
					
					//姓名 和 头像信息
					var name=user[i].name;
					var photo=user[i].photo;
					//登陆成功创建用户
					for(var i=0;i<5;i++){
						if(!p.id[i]){
							dataRefresh=game._sitDown(r.id,name,photo,100,i);
							break;
						}
					}
					//判断游戏是否开始
					if(g.step==0){
						dataRefresh=game._main();
					}

				}

				//向客户端返回成功信息
				SERVER.send({'success':true},r,resp);
				return;
			}
		}
		SERVER.send({'success':false,'msg':'账号有误'},r,resp);
	}
};



var	dataRefresh = +new Date;	//初始时间,用于刷新数据
var game = new GAME({'N':9});
var SERVERROOt = require('path').join(__dirname, '../http/');

http.createServer(function (req, resp){
	var repeat=0;
	var	r = querystring.parse( url.parse(req.url).query ); //接收信息
	resp.writeHead(200, {"Content-Type": 'application/javascript'});

	var c=game.config,p=game.player,g=game.global;

	function refresh(){
		if( r.time != dataRefresh){
			g.time = dataRefresh;
			SERVER.sendAll(game,r,resp);
		}else if(repeat>=60){
			SERVER.sendAll(game,r,resp);
		}
		else{
			repeat++;
			setTimeout(refresh,500);
		}
	}


	switch (r.method){
		case 'login':SERVER.login(r,resp);	
		break;
		case 'refresh':refresh(r,resp);
		break;
		case 'check':dataRefresh=game._check(r.id);
			SERVER.send({'success':true},r,resp);
		break;
		case 'call':dataRefresh=game._call(r.id);
			SERVER.send({'success':true},r,resp);
		break;
		case 'raise':dataRefresh=game._raise(r.id,parseInt(r.bet));
			SERVER.send({'success':true},r,resp);
		break;
		case 'allin':dataRefresh=game._allin(r.id);
			SERVER.send({'success':true},r,resp);
		break;
		case 'fold':dataRefresh=game._fold(r.id);
			SERVER.send({'success':true},r,resp);
		break;
		case 'nextbtn':if(g.step==5 || g.step==6){g.step=7;dataRefresh=game._main();}
			SERVER.send({'success':true},r,resp);
		break;
		default:	
	}
		

}).listen(8973);


