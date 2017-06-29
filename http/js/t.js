Handlebars.registerHelper('_', function(index) {
    return index;
});
Handlebars.registerHelper('hide', function(a) {
    return a?'':'hide';
});
Handlebars.registerHelper('show', function(a) {
    return a?'hide':'';
});
Handlebars.registerHelper('display', function(a) {
    return a?'':'hidden';
});

var wrapper=$('.gamewrapper');
var TEMP='{{#if nextbtn}}'
	+'<a href="javascript:void(0);" id="nextbtn" style="display:block;position:fixed;top:0;left:0;right:0;font-size:16px;background:rgba(0,0,0,.5);line-height:30px;color:#fff;text-align:center;">筹码已经结算，请核对比赛结果，点击进入下一局</a>'
	+'{{/if}}'
	+'<div class="wrapper" id="Tsit">'
	+'	{{#each list}}'
	+'	<div class="sit sit0{{_ @index}} {{show id}}"></div>'
	+'	{{/each}}'
	+'</div>'
	+'<div class="wrapper" id="Tboard">'
	+'	<div class="board">'
	+'	{{#each board}}'
	+'		<div class="card c-{{this}} {{hide this}}"></div>'
	+'	{{/each}}'
	+'	</div>'
	+'</div>'
	+'<div class="wrapper" id="Tsidepot">'
	+'	<div class="sidepot">'
	+'	{{#each sidepot}}'
	+'	<span>{{this}}</span>'
	+'	{{/each}}'
	+'	</div>'
	+'</div>'
	+'<div class="wrapper" id="Tplayer">'
	+'	{{#each list}}'
	+'	<div class="player {{classSit}} p0{{_ @index}} {{hide id}}" >'
	+'		<span class="p-name">{{name}}</span>'
	+'		<span class="p-photo"><img src="images/{{photo}}" /></span>'
	+'		<span class="p-chip"><em>{{chip}}</em></span>'
	+'		<span class="p-bet {{hide bet}}">{{bet}}</span>'
	+'		<span class="p-button {{hide button}}"></span>'
	+'		<span class="p-turning {{hide turning}}"></span>'
	+'		<span class="p-winchip {{hide winchip}}">{{winchip}}</span>'
	+'		<div class="p-deal {{deal}}">'
	+'			<div></div>'
	+'			<div></div>'
	+'		</div>'
	+'		<div class="p-hole {{hide hole}}">'
	+'			{{#each hole}}'
	+'			<div class="card c-{{this}}"></div>'
	+'			{{/each}}'
	+'		</div>'
	+'		<span class="p-actioninfo {{hide info}} aci-{{info}}">{{info}}</span>'
	+'		<span class="p-win {{hide win}}"></span>'
	+'	</div>'
	+'	{{/each}}'
	+'</div>'
	+'<div class="wrapper" id="Taction">'
	+'	<div class="action {{hide operate}}">'
	+'		<a href="javascript:void(0);" id="call" class="call {{display operate.call}}"><em>Call</em></a>'
	+'		<a href="javascript:void(0);" id="check" class="check {{display operate.check}}"><em>Check</em></a>'
	+'		<a href="javascript:void(0);" class="raise {{display operate.raise}}"><em>Raise</em>'
	+'			<div class="raise-form">'
	+'				<div class="raise-input">'
	+'					<input id="ex4" type="text" data-slider-min="{{operate.raise}}" data-slider-max="{{operate.allin}}" data-slider-step="1" data-slider-value="{{operate.raise}}" data-slider-orientation="vertical"/>'
	+'				</div>'
	+'				<div class="raise-btn" id="raise">确定</div>'
	+'			</div>'
	+'		</a>'
	+'		<a href="javascript:void(0);" id="allin" class="allin {{display operate.allin}}"><em>All In</em></a>'
	+'		<a href="javascript:void(0);" id="fold" class="fold {{display operate.fold}}"><em>Fold</em></a>'
	+'	</div>'
	+'</div>';
var T=function(d){
	var myTemplate = Handlebars.compile(TEMP);
    wrapper.html(myTemplate(d));
}