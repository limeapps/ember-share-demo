export default Ember.View.extend({
	classNames: ['todo-view','hidden'],
	keyDown: function(e){
		if(e.keyCode === 13)
		{
			var c = this.get('controller');
			c.guid = null;
			c.newDoc = null;
			c.set('newItem',null);
		}
	},
	willInsertElement : function(){
		Ember.run.scheduleOnce('afterRender',this,function(){
			Ember.run.later(this,function(){
				this.$().removeClass('hidden');
			},10)
		});
	}
});