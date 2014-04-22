import { transitionEvent } from '../utils';
export default Ember.View.extend({
	easeInOut : function(t, b, c, d) {
		var ts=(t/=d)*t;
		var tc=ts*t;
		return b+c*(-2*tc + 3*ts);
	},
	animInfo: {},
	limit : function(){
		Ember.run.scheduleOnce('afterRender',this,function(){
			this.$().on('keyup blur paste','textarea',function(){
				if(this.value.length > 256) { 
					this.value = this.value.substr(0, 256);
					return false;
				}
			});
		});
	}.on('didInsertElement'),
	showModal : function(){
		var modal = this.get('controller.modal');
		if(this.state === "inDOM")
		{
			var button = this.$('.add-msg');
			var popup = this.$('.msg-box');
			var buttonRect = button.get(0).getBoundingClientRect();
			var popupRect = popup.get(0).getBoundingClientRect();
			var buttonStyles = {
				width:popupRect.width / buttonRect.width,
				height:popupRect.height / buttonRect.height,
				x : (popupRect.left + popupRect.width / 2) - (buttonRect.left + buttonRect.width / 2),
				y : (popupRect.top + popupRect.height / 2) - (buttonRect.top + buttonRect.height / 2)
			};
			var popupStyles = {
				width: 1 / buttonStyles.width,
				height: 1 / buttonStyles.height,
				x : buttonStyles.x * -1,
				y : buttonStyles.y * -1
			};
			if(modal)
			{
				// transition-layout dance
				popup.addClass('no-transition').css({
					transform : 'translate3d('+popupStyles.x+'px,'+popupStyles.y+'px,0) scale3d('+popupStyles.width+','+popupStyles.height+',1)',
					opacity:0,
					visibility:'visible'
				});
				popup.find('.msg-bubble').on('click.app',function(){
					popup.find('textarea').focus();
				})
				// force layout
				popup.get(0).clientHeight;
				popup.removeClass('no-transition');
				popup.get(0).clientHeight;
				button.css({
					transform : 'translate3d('+buttonStyles.x+'px,'+buttonStyles.y+'px,0) scale3d('+buttonStyles.width+','+buttonStyles.height+',1)',
					opacity:0
				});
				popup.removeAttr('style').css({
					visibility:'visible',
					transform:'translateZ(0)'
				});
				var that = this;
				button.one(transitionEvent(), function() {
					popup.css('user-select','initial');
					jQuery('textarea').focus();
					button.addClass('no-transition')
					.removeAttr('style').css({
						visibility:'hidden',
					});
					button.get(0).clientHeight;
					button.removeClass('no-transition');
					that.didTransition = true;
				});
			}
			else if (!modal && this.didTransition)
			{
				button.addClass('no-transition')
				.css({
					transform : 'translate3d('+buttonStyles.x+'px,'+buttonStyles.y+'px,0) scale3d('+buttonStyles.width+','+buttonStyles.height+',1)',
					opacity:0,
					visibility: 'visible'
				});
				button.get(0).clientHeight;
				popup.css({
					transform : 'translate3d('+popupStyles.x+'px,'+popupStyles.y+'px,0) scale3d('+popupStyles.width+','+popupStyles.height+',1)',
					opacity:0
				});
				button.removeClass('no-transition').removeAttr('style');
				popup.one(transitionEvent(),function(){
					popup.addClass('no-transition').removeAttr('style');
					popup.get(0).clientHeight;
					popup.removeClass('no-transition');
					popup.get(0).clientHeight;
					popup.find('.msg-bubble').off('click.app');
				});
			}
		}
	}.observes('controller.modal'),
	click :function(e){
		if(jQuery(e.target).hasClass('messages') && this.get('controller.modal')) {
			this.set('controller.modal',false);
		}
	},
	scroll : function(){
		Ember.run.scheduleOnce('afterRender',this,function(){
			this.scrollEl = this.$('.messages').get(0);
			if(this.get('controller.showWelcome'))
			{
				if(!this.raf)
				{
					this.raf = window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					// IE Fallback, you can even fallback to onscroll
					function(callback){ window.setTimeout(callback, 1000/60); };
				}
				var scrollHeight = this.scrollEl.scrollHeight;
				var windowHeight = window.innerHeight;
				this.animInfo.max = scrollHeight - windowHeight;
				this.animInfo.time = 0;
				this.animInfo.duration = this.animInfo.max / 1;
				this.animInfo.begin = this.scrollEl.scrollTop;
				this.animInfo.change = this.animInfo.max  - this.scrollEl.scrollTop;
				if(this.animInfo.change > 0) {
					Ember.run.throttle(this,'animate',1000);
				}
			}
		});
	}.on('willInsertElement').observes('controller.showWelcome','controller.messages.length'),
	animate : function(){
		
		this.animInfo.target = this.easeInOut(this.animInfo.time,this.animInfo.begin,this.animInfo.max,this.animInfo.duration);
		if(this.animInfo.time < this.animInfo.duration && this.get('controller.showWelcome'))
		{

			this.scrollEl.scrollTop = this.animInfo.target;
			this.raf.call(window,this.animate.bind(this));
			this.animInfo.time+= 12;
		}
	}
});