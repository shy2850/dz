exports.POKER={
// var POKER={
	cards:function(){
		var c=[];
		for(var i=0;i<52;i++){c[i]=i;}
		return c.sort(function(){return Math.random()-.5;});
	},
	showcard:function(c){
		var s='';
		for(var i=0;i<c.length;i++){s+="♦♣♥♠"[c[i]/13 | 0] + "0,1,2,3,4,5,6,7,8,9,10,J,Q,K,A".split(',')[(c[i]%13)+2]+",";}
		return s;
	},
	//皇家通同花顺:10,同花顺:9,四条:8,葫芦:7,同花:6,顺子:5,三条:4,两对:3,一对:2,高牌:1; 
	maxgroup:function(c){
		c.sort(function(a,b){return b-a});
		var i,j,k; //索引
		var range=[[],[],[],[],[],[]];//数据预处理
		var mc=[];//最大组合
		function pushNum(i,n){
			range[i].push(n);
			if(range[4].indexOf(n)==-1){range[4].push(n);}
			range[5].push(n);
		}
		function eachCard(n,isArr){
			var a=[];
			isArr=isArr || false;
			for(i=0;i<c.length;i++){
				if(c[i]%13==n){
					if(!isArr){return c[i];}else{a.push(c[i]);}
				}
			}
			return a;
		}
		for(var i=0;i<7;i++){
			switch (true){
				case c[i]<13:pushNum(0,c[i]);
					break;
				case c[i]<26:pushNum(1,c[i]-13);
					break;
				case c[i]<39:pushNum(2,c[i]-26);
					break;
				default:pushNum(3,c[i]-39);
			}
		}
		range[4].sort(function(a,b){return b-a});
		range[5].sort(function(a,b){return b-a});
		//判断同花顺 同花
		for(i=0;i<4;i++){
			if(range[i].length>=5){
				if(range[i][0]==12){range[i].push(-1);}
				for(j=0;j<range[i].length-4;j++){
					if(range[i][j]-range[i][j+4]==4){
						for(k=0;k<5;k++){
							mc.push( range[i][j+k]!=-1? range[i][j+k] + i*13 : 12 + i*13);
						}
						if(range[i][j]==12){
							return {
								'power':10*100000000 + range[i][j],
								'cards':mc
							}
						}
						return {
							'power':9*100000000 + range[i][j],
							'cards':mc
						}
					}
				}
				for(k=0;k<5;k++){
					mc.push( range[i][k] + i*13 );
				}
				return {
					'power':6*100000000 +range[i][0]*1000000+range[i][1]*10000+range[i][2]*100+ range[i][3]*10+ range[i][4],
					'cards':mc
				}
			}
		}
		if(range[4].length>=5){//判断是否是顺子
			if(range[4][0]==12){range[4].push(-1);}
			for(j=0;j<range[4].length-4;j++){
				if(range[4][j]-range[4][j+4]==4){
					for(var k=0;k<5;k++){
						mc.push(eachCard(range[4][j+k]==-1?12:range[4][j+k]))
					}
					return {
						'power':5*100000000+range[4][j],
						'cards':mc
					}
				}
			}
			if(range[4][0]==12){range[4].pop();}
		}
		if(range[4].length==7){//判断高牌
			for(var k=0;k<5;k++){
				mc.push(eachCard(range[4][k]))
				// mc = mc.concat(eachCard(range[4][k]));
			}
			return {
				'power':1*100000000 +range[4][0]*1000000+range[4][1]*10000+range[4][2]*100+ range[4][3]*10+ range[4][4],
				'cards':mc
			}
		}
		if(range[4].length==6){//判断一对
			var repeatnum=-100;
			for(i=0;i<6;i++){
				if(range[5][i]==range[5][i+1]){
					repeatnum=range[5][i];
					range[5].splice(i,2);
					break;	
				}
			}
			mc = mc.concat(eachCard(repeatnum,true));
			for(var k=0;k<3;k++){
				mc.push(eachCard(range[5][k]));
			}
			return {
				'power'	: 2*100000000 +repeatnum*1000000+range[5][0]*10000+range[5][1]*100+range[5][2],
				'cards'	: mc
			}
		}
		//判断两对或三条
		if(range[4].length==5){
			repeatnum=-100;
			for(i=0;i<5;i++){
				if(range[5][i]==range[5][i+1] && range[5][i]==range[5][i+2]){
					repeatnum=range[5][i];
					range[5].splice(i,3);
					break;	
				}
			}
			if(repeatnum>-100){
				mc = mc.concat(eachCard(repeatnum,true));
				for(var k=0;k<2;k++){
					mc.push(eachCard(range[5][k]));
				}
				return {
					'power':4*100000000+repeatnum*10000+range[5][0]*100+range[5][1],
					'cards':mc
				}
			}

			var repeatnum01,repeatnum02;
			for(i=0;i<6;i++){
				if(range[5][i]==range[5][i+1]){
					repeatnum01=range[5][i];
					range[5].splice(i,2);
					break;	
				}
			}
			for(i=0;i<4;i++){
				if(range[5][i]==range[5][i+1]){
					repeatnum02=range[5][i];
					range[5].splice(i,2);
					break;	
				}
			}
			mc = mc.concat(eachCard(repeatnum01,true));
			mc = mc.concat(eachCard(repeatnum02,true));
			mc.push(eachCard(range[5][0]));
			return { 
				'power':repeatnum01>repeatnum02?(3*100000000+repeatnum01*10000+repeatnum02*100+range[5][0]):(3*100000000+repeatnum02*10000+repeatnum01*100+range[5][0]),
				'cards':mc
			}

		}
		//判断 葫芦 或 四条
		if(range[4].length<5){
			repeatnum=-100;
			for(i=0;i<4;i++){
				if(range[5][i]==range[5][i+1] && range[5][i]==range[5][i+2] && range[5][i]==range[5][i+3]){
					repeatnum=range[5][i];
					range[5].splice(i,4);
					break;	
				}
			}
			if(repeatnum>-100){
				mc = mc.concat(eachCard(repeatnum));
				mc.push(eachCard(range[5][0]));
				return {
					'power':8*100000000+repeatnum*100+range[5][0],
					'cards':mc
				}
			}

			repeatnum01=0,repeatnum02=0;
			for(i=0;i<5;i++){
				if(range[5][i]==range[5][i+1] && range[5][i]==range[5][i+2]){
					repeatnum01=range[5][i];
					range[5].splice(i,3);
					break;	
				}
			}
			for(i=0;i<3;i++){
				if(range[5][i]==range[5][i+1]){
					repeatnum02=range[5][i];
					range[5].splice(i,3);
					break;	
				}
			}
			mc = mc.concat(eachCard(repeatnum01,true));
			mc = mc.concat(eachCard(repeatnum02,true));
			mc.splice(5);
			return {
				'power':7*100000000+repeatnum01*100+repeatnum02,
				'cards':mc
			}
		}
	}
}

//测试案例
// var c=[13,14,15,16,19,18,25];
// c=[13,14,28,16,19,31,51];
// c=[1,14,16,30,44,48,51];
// c=[17,30,43,21,34,47,38];
// c=[28,13,15,46,7,37,35];
// c=[24,43,16,27,30,20,37];
// c=POKER.createcards();
// c=POKER.shuffle(c);
// console.log(c.slice(0,7));
// console.log(POKER.showcard(c.slice(0,7)));
// console.log("牌力:"+POKER.maxgroup(c.slice(0,7)));


// c=[25,21,32,44,29,9,42];
// console.log(c.slice(0,7));
// console.log(POKER.showcard(c.slice(0,7)));
// console.log("牌力:"+POKER.maxgroup(c.slice(0,7)).power);
// console.log("牌型:"+POKER.showcard(POKER.maxgroup(c.slice(0,7)).cards));


// c=[25,21,32,44,29,5,37];
// console.log(c.slice(0,7));
// console.log(POKER.showcard(c.slice(0,7)));
// console.log("牌力:"+POKER.maxgroup(c.slice(0,7)));