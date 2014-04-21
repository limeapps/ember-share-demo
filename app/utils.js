// get prefixed event
var evt = null;
function transitionEvent(){
	if(evt === null)
	{
		var el = document.createElement('div');
		var transitions = {
			'transition':'transitionend',
			'OTransition':'oTransitionEnd',
			'MozTransition':'transitionend',
			'WebkitTransition':'webkitTransitionEnd'
		};

		for(var t in transitions){
			if( el.style[t] !== undefined ){
				evt = transitions[t];
			}
		}
	}
	return evt;
}

export {transitionEvent};
