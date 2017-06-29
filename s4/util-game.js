var POKER=require('./util-poker.js').POKER; 	//存放处理扑克的算法
var TOOL=require('./util-tool.js').TOOL;  		//计算工具
var GAME=function(opt){
	opt=opt||{};
	this.config={
		N 	: 	opt.N || 5,			//最大人数,默认5人
		BB	: 	opt.BB || 2			//大盲注,默认2
	}
	//玩家
	this.player={
		'id'			:	['','','','','','','','',''],	//id
		'name'			:	['','','','','','','','',''],	//姓名
		'photo' 		:	['','','','','','','','',''],	//照片
		'chip'			:	[0,0,0,0,0,0,0,0,0], 		//玩家手里的筹码
		'bet'			:	[0,0,0,0,0,0,0,0,0], 		//当前押注筹码
		'betall' 		:	[0,0,0,0,0,0,0,0,0], 		//全局押注金额
		'hole'			:	['','','','','','','','',''], 	//玩家手牌
		'state'			:	[0,0,0,0,0,0,0,0,0],		//玩家行动状态，fold(-1) 无(0) 可以行动(1) Allin(2)
		'action'		:	['','','','','','','','',''],	//玩家的实际操作	
		'times' 		:	[0,0,0,0,0,0,0,0,0], 		//每个翻牌圈行动次数
		'power'			:	[0,0,0,0,0,0,0,0,0], 		//牌力
		'sidepot'		:	[0,0,0,0,0,0,0,0,0], 		//所在边池的数额
		'winchip'		: 	[0,0,0,0,0,0,0,0,0],		//赢取的筹码
		'win' 			: 	[0,0,0,0,0,0,0,0,0]			//是否获胜
	}
	//
	this.global={
		'cards' 	:	[],		//纸牌
		'i'			:	0,		//纸牌使用索引
		'operate'	:	'',		//当前玩家可进行的操作 {"check":0,"call":0,"raise":0,"allin":0,"fold":0}
		'button'	:	-1,		//庄家位置
		'pot'		:	0,		//底池
		'sidepot' 	:	[],		// 边池
		'board'		:	[0,0,0,0,0], 	//五张公共牌
		'step'		:	0,		//游戏进度
		'turn'		:	-1,		//行动顺序
		'time'		:	'', 	//刷新时间校对
		'nextbtn' 	:	0		//下一步按钮
	}
	//纸牌
	
	//游戏
	
	return this;
}
GAME.prototype={
	_sitDown:function(id,name,photo,chip,i){ //玩家id ，玩家姓名，玩家头像，玩家带入筹码，玩家位置
		var p=this.player;
		if(!p.id[i]){
			p.id[i]=id;
			p.name[i]=name;
			p.chip[i]=chip;
			p.photo[i]=photo;
		}
		return +new Date;
	},
	_main:function(){
		var me=this,c=this.config,p=this.player,g=this.global;
		function setButton(){
			var n=(++g.button)%c.N;
			for(var i=0;i<c.N;i++){
				if(p.chip[n]>=c.BB){
					break;
				}else{
					n=(++g.button)%c.N;
				}
			}
			g.button=n;
			return n;
		}
		function beforeRound(){
			p.action=['','','','',''];
			p.operate='';
			p.times=[0,0,0,0,0];
			//移入边池
			var a=[],b=[];
			for(var i=0;i<c.N;i++){
				p.sidepot[i]=0;
				if(p.state[i]>0){
					for(var j=0;j<c.N;j++){
						p.sidepot[i]+=(p.betall[i]>p.betall[j])?p.betall[j]:p.betall[i];
					}
				}
			}
			for(var i=0;i<c.N;i++){
				if(p.sidepot[i]!=0 && a.indexOf(p.sidepot[i])==-1 ){
					a.push(p.sidepot[i]);
				}
			}
			a.sort(function compare(a,b){return a-b;});  
			g.sidepot=[];
			for(var i=0;i<a.length;i++){
				if(i==0){g.sidepot.push(a[i]);}
				else{g.sidepot.push(a[i]-a[i-1]);}
			}
			p.bet=[0,0,0,0,0];
		}
		function afterRound(){
			if(TOOL.countIf(p.state,1)<2){
				me._main(++g.step);
			}else{
				g.turn=g.button;
				me._next();
			}
		}
		switch(g.step){
			case 0: // 准备阶段
				//判断是否符合开局条件
				//用户存在，并且筹码大于一个小盲注
				if(TOOL.countIf(p.chip,'>='+c.BB)>=2){
					me._main(++g.step);
					return +new Date;
				}
			break;
			case 1: // Pre-flop 底牌圈
				g.cards=POKER.cards();
				g.turn=setButton();	//turn 指向庄家 button
				for(var i=0;i<c.N;i++){
					if(p.id[i] && p.chip[i]>=c.BB){
						p.state[i]=1;
						p.hole[i]=[g.cards[g.i++],g.cards[g.i++]];
					}
				}
				if(TOOL.countIf(p.state,'>0')==2){
					me._bet(c.BB/2);
					me._bet(c.BB);
				}else{
					me._next();
					me._bet(c.BB/2);
					me._bet(c.BB);
				}
				return +new Date;
			break;
			case 2: // flop round
				beforeRound();
				g.i++;
				g.board[0]=g.cards[g.i++];
				g.board[1]=g.cards[g.i++];
				g.board[2]=g.cards[g.i++];
				afterRound();
				return +new Date;
			break;
			case 3: // turn round 
				beforeRound();
				g.i++;
				g.board[3]=g.cards[g.i++];
				afterRound();
				return +new Date;
			break;
			case 4: // river round
				beforeRound();
				g.i++;
				g.board[4]=g.cards[g.i++];
				afterRound();
				return +new Date;
			break;
			case 5: //结算阶段
				beforeRound();
				//正常比较结算
				//计算牌力
				for(var i=0;i<c.N;i++){
					if(p.state[i]>0){
						p.power[i]=POKER.max(p.hole[i].concat(g.board)).power;
					}
				}
				//分配筹码
				for(var s=0;s<g.sidepot.length;s++){
					var win=[];
					var max=TOOL.max(p.power);
					for(var i=0;i<c.N;i++){
						if(p.power[i]==max){
							win.push(i);
							if(s==0){p.win[i]=1;}
						}
					}
					//平分最小的边池
					var t=g.sidepot[s]%win.length;
					for(var i=0;i<win.length;i++){
						p.winchip[win[i]]+=(g.sidepot[s]-t)/win.length;
					}
					for(var i=0;i<t;i++){
						p.winchip[win[i]]++;
					}
					//重置我的边池
					for(var i=0;i<c.N;i++){
						if(p.sidepot[i]!=0){p.sidepot[i]-=g.sidepot[s];}
						if(p.sidepot[i]==0){p.power[i]=0;}
					}
				}
				//
				g.operate='';
				g.turn=-1;
				//测试
				g.nextbtn=1;
				return +new Date;
			break;
			case 6:
				for(var i=0;i<c.N;i++){
					if(p.state[i]>0){
						p.winchip[i]+=TOOL.sum(p.betall);
					}
				}
				g.nextbtn=1;
				//
				g.operate='';
				g.turn=-1;
				return +new Date;
			break;
			case 7:
				for(var i=0;i<c.N;i++){
					p.chip[i]+=p.winchip[i];
				}
				//id name photo chip
				p.bet			=	[0,0,0,0,0,0,0,0,0];
				p.betall 		=	[0,0,0,0,0,0,0,0,0];
				p.hole			=	['','','','','','','','',''];
				p.state			=	[0,0,0,0,0,0,0,0,0];
				p.action		=	['','','','','','','','',''];
				p.times 		=	[0,0,0,0,0,0,0,0,0];
				p.power			=	[0,0,0,0,0,0,0,0,0];
				p.sidepot		=	[0,0,0,0,0,0,0,0,0];
				p.winchip		= 	[0,0,0,0,0,0,0,0,0];
				p.win 			= 	[0,0,0,0,0,0,0,0,0];
				
				//button time
				g.cards 	=	[];		
				g.i			=	0;		
				g.operate	=	'';
				g.pot		=	0;	
				g.sidepot 	=	[];	
				g.board		=	['','','','',''];
				g.step		=	0;
				g.turn		=	-1;
				g.nextbtn=0;
				me._main();
				return +new Date;
			break;
			default:
		}
	},
	_bet:function(n){
		var me=this,c=this.config,p=this.player,g=this.global;
		var i=g.turn;
		if(n == -1){	//弃牌操作
			p.state[i]=-1;
		}else{ 
			p.bet[i]+=n;
			p.betall[i]+=n;
			p.chip[i]-=n;
			g.pot+=n;
			if(p.chip[i]==0){
				p.state[i]=2;
			}
		}
		if(TOOL.countIf(p.state,'>0')==1){
			g.step=6;
			me._main();
			return;
		}
		for(var i=0,max=TOOL.max(p.bet);i<c.N;i++){
			if(p.state[i]==1 && ( p.times[i]==0 || p.bet[i]<max ) ){
				me._next();
				return;
			}
		}
		me._main(++g.step);
	},
	_next:function(){
		var me=this,c=this.config,p=this.player,g=this.global;
		//指向下一个需要说话的玩家
		var t=(++g.turn)%c.N;
		for(var i=0;i<c.N-1;i++){
			if(p.state[t]==1){
				break;
			}else{
				t=(++g.turn)%c.N;
			}
		}
		g.turn=t;
		//这个玩家可以进行的操作
		var max=TOOL.max(p.bet); 
		g.operate={};
		if(max==p.bet[t]){g.operate.check=1;}
		else{g.operate.check=0;}
		if(max>=p.chip[t]+p.bet[t] || max==p.bet[t]){g.operate.call=0;}
		else{g.operate.call=max;}
		if(max==0 && p.chip[t]>=c.BB){g.operate.raise=c.BB;}
		else if(max*2>=p.chip[t]+p.bet[t]){g.operate.raise=0;}
		else{g.operate.raise=max*2;};
		g.operate.allin=p.chip[t]+p.bet[t];
		g.operate.fold=1;
	},
	_call:function(id){
		var me=this,c=this.config,p=this.player,g=this.global;
		var i=p.id.indexOf(id);
		if(i==g.turn && g.operate.call){
			p.times[i]+=1;
			p.action[i]='call';
			me._bet(g.operate.call-p.bet[i]);
		}
		return +new Date;
	},
	_check:function(id){
		var me=this,c=this.config,p=this.player,g=this.global;
		var i=p.id.indexOf(id);
		if(i==g.turn && g.operate.check){
			p.times[i]+=1;
			p.action[i]='check';
			me._bet(0);
		}
		return +new Date;
	},
	_raise:function(id,n){
		var me=this,c=this.config,p=this.player,g=this.global;
		var i=p.id.indexOf(id);
		if(i==g.turn && g.operate.raise && n>=g.operate.raise && n<g.operate.allin){
			p.times[i]+=1;
			p.action[i]='raise';
			me._bet(n-p.bet[i]);
		}
		return +new Date;
	},
	_fold:function(id){
		var me=this,c=this.config,p=this.player,g=this.global;
		var i=p.id.indexOf(id);
		if(i==g.turn && g.operate.fold){
			p.times[i]+=1;
			p.action[i]='fold';
			me._bet(-1);
		}
		return +new Date;
	},
	_allin:function(id){
		var me=this,c=this.config,p=this.player,g=this.global;
		var i=p.id.indexOf(id);
		if(i==g.turn && g.operate.allin){
			p.times[i]+=1;
			p.action[i]='allin';
			me._bet(p.chip[i]);
		}
		return +new Date;
	},
	_exit:function(id){
		//强制退出
	}
}

exports.GAME = GAME;

