exports.TOOL={
	sum:function(a){
		return parseInt( eval( a.join("+") ) );
	},
	max:function(a){
		return Math.max.apply(Math,a);
	},
	min:function(a){
		return Math.min.apply(Math,a);
	},
	countIf:function(a,b){
		var n=0;
		if(!isNaN(b)){
			for(var i=0;i<a.length;i++){
				( a[i]==b ) ? ( n++ ) : '';
			}
		}else{
			for(var i=0;i<a.length;i++){
				eval(a[i]+b) ? ( n++ ): '';
			}
		}
		return n;
	}
}