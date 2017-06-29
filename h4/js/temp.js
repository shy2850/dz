var ANIMATE={
	show:function(o,i){
		o.eq(i).removeClass('hide');
	},
	hide:function(o,i){
		o.eq(i).addClass('hide');
	},
	bounceIn:function(o,i,time){
		time=time || 0;
		setTimeout(function(){
			o.eq(i).removeClass('hide animated bounceOut ').addClass('animated bounceIn');
		},time)
	},
	bounceOut:function(o,i,time){
		time=time || 0;
		setTimeout(function(){
			o.eq(i).removeClass('animated bounceIn').addClass('animated bounceOut');
		},time)
	}
}

var DOM=function(){
	this.player=$('#Tplayer').children();
	this.name=$('.p-name');
	this.photo=$('.p-photo');
	this.chip=$('.p-chip em');
	this.bet=$('.p-bet');
	this.button=$('.p-button');
	this.turning=$('.p-turning');
	this.winchip=$('.p-winchip');
	this.win=$('.p-win');
	this.hole=$('.p-hole');
	this.deal=$('.p-deal');
	this.info=$('.p-actioninfo');

	this.sit=$('#Tsit').children();
	this.board=$('#Tboard').children().children();
	this.sidepot=$('#Tsidepot').children();
	this.action=$('#Taction').children();
	return this;
}
DOM.prototype={
	set:function(data){
		this.setPlayer(data.id);
		this.setName(data.name);
		this.setPhoto(data.photo);
		this.setChip(data.chip);
		this.setBet(data.bet);
		this.setButton(data.button);
		this.setTurning(data.turning);
		this.setwinchip(data.winchip);
		this.setWin(data.win);
		this.setHole(data.hole);
		this.setDeal(data.deal);
		this.setInfo(data.info);
		this.setBoard(data.board);
		this.setSidepot(data.sidepot);
	},
	setBoard:function(res){
		for(var i=0;i<res.length;i++){
			if(res[i]){
				this.board.eq(i).removeClass().addClass('card c-'+res[i]);
				ANIMATE.show(this.board,i);
			}else{
				ANIMATE.hide(this.board,i);
			}
		}
	},
	setSidepot:function(res){
		var str='';
		for(var i=0;i<res.length;i++){
			str+='<span>'+res[i]+'</span>';
		}
		this.sidepot.html(str);
	},
	_set:function(){
		var a=arguments[0];
		if(a.length==1 && a[0] instanceof Array){
			for(var i=0;i<a[0].length;i++){
				arguments[1](i,a[0][i]);
			}
		}else{
			arguments[1](a[0],a[1]);
		}	
	},
	setPlayer:function(res){
		for(var i=0;i<res.length;i++){
			if(res[i]){
				ANIMATE.show(this.player,i);
				ANIMATE.hide(this.sit,i);
			}
		}
	},
	setName:function(){
		var me=this;
		me._set(arguments,function(i,a){
			me.name.eq(i).text(a);
		});	
	},
	setBet:function(){
		var me=this;
		me._set(arguments,function(i,a){
			if(a){
				me.bet.eq(i).text(a);
				ANIMATE.show(me.bet,i);}
			else{ANIMATE.hide(me.bet,i);}
		});	
	},
	setPhoto:function(){
		var me=this;
		me._set(arguments,function(i,a){
			me.photo.eq(i).children().attr('src','images/'+a);
		});	
	},
	setChip:function(){
		var me=this;
		me._set(arguments,function(i,a){
			me.chip.eq(i).text(a);
		});	
	},
	setButton:function(){
		var me=this;
		me._set(arguments,function(i,a){
			if(a){ANIMATE.show(me.button,i);}
			else{ANIMATE.hide(me.button,i);}
		});	
	},
	setTurning:function(){
		var me=this;
		me._set(arguments,function(i,a){
			if(a){
				if(i==0 && a==1){ANIMATE.show(me.action,i);}
				ANIMATE.show(me.turning,i);
			}
			else{ANIMATE.hide(me.turning,i);}
		});	
	},
	setwinchip:function(){
		var me=this;
		me._set(arguments,function(i,a){
			if(a){
				ANIMATE.show(me.winchip,i);
				me.winchip.eq(i).text(a);
			}
			else{ANIMATE.hide(me.winchip,i);}
		});	
	},
	setWin:function(){
		var me=this;
		me._set(arguments,function(i,a){
			if(a){ANIMATE.show(me.win,i);}
			else{ANIMATE.hide(me.win,i);}
		});	
	},
	setHole:function(){
		var me=this;
		me._set(arguments,function(i,a){
			if(a){
				ANIMATE.show(me.hole,i);
				me.hole.eq(i).children().eq(0).removeClass().addClass('card c-'+a[0]);
				me.hole.eq(i).children().eq(1).removeClass().addClass('card c-'+a[1]);
			}
			else{ANIMATE.hide(me.hole,i);}
		});	
	},
	setDeal:function(){
		var me=this;
		me._set(arguments,function(i,a){
			if(a){ANIMATE.show(me.deal,i);}
			else{ANIMATE.hide(me.deal,i);}
		});	
	},
	setInfo:function(){
		var me=this;
		me._set(arguments,function(i,a){
			if(a){
				ANIMATE.show(me.info,i);
				me.info.eq(i).removeClass().addClass('p-actioninfo aci-'+a).text(a);
			}
			else{ANIMATE.hide(me.info,i);}
		});	
	}
}
var GAME={};
GAME.init=function(data){
	var dom=new DOM();
	dom.set(data);
}

