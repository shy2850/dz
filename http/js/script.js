function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
;(function($) {
	var root = location.href.match(/(http:\/\/[^\/]+)/)[1] + ":8973";
	var time = 0;
	var id=getUrlParam('id')||'',pd=getUrlParam('pd')||'';

	if(!id || !pd){
		window.location.href='index.html';
	}
	window.refresh = function(id){
		$.ajax({
			url: root,
			dataType: "jsonp",
			data:{
				id:id,
				password:pd,
				method:"refresh",
				time: time
			},
			success:function(d){
				console.log(d);
				if(d.no){
					window.location.href='index.html';
					return;
				}
				if(time!=d.time){
					time = d.time
					T(d);
					$("#ex4").slider({
						reversed : true
					});	
				}
				window.refresh(id);
			}
		});
	}

	window.refresh(id);


	wrapper.on('click','#check',function(){
		$.ajax({
			url:root,
			dataType:"jsonp",
			data:{
				id:id,
				method:'check',
				time:time
			},
			success:function(d){

			}
		});
	});
	wrapper.on('click','#call',function(){
		$.ajax({
			url:root,
			dataType:"jsonp",
			data:{
				id:id,
				method:'call',
				time:time
			},
			success:function(d){

			}
		});
	});

	$('body').on('click','#raise',function(){
		var val=$('#ex4').val(),max=$('#ex4').data('slider-max');
		if(val==max){
			$('#allin').click();
		}else{
			$.ajax({
				url:root,
				dataType:"jsonp",
				data:{
					id:id,
					method:'raise',
					bet:val,
					time:time
				},
				success:function(d){

				}
			});
		}
		
	});

	wrapper.on('click','#allin',function(){
		$.ajax({
			url:root,
			dataType:"jsonp",
			data:{
				id:id,
				method:'allin',
				time:time
			},
			success:function(d){

			}
		});
	});
	wrapper.on('click','#fold',function(){
		$.ajax({
			url:root,
			dataType:"jsonp",
			data:{
				id:id,
				method:'fold',
				time:time
			},
			success:function(d){

			}
		});
	});

	wrapper.on('click','#nextbtn',function(){
		$.ajax({
			url:root,
			dataType:"jsonp",
			data:{
				id:id,
				method:'nextbtn',
				time:time
			},
			success:function(d){
			}
		});
	});

})(jQuery)

