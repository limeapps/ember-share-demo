export default Ember.Route.extend({
	activate : function(){
		this.controllerFor('home').set('showChat',true);
		this.controllerFor('home').get('model').incrementProperty('count',1);
	},
	deactivate : function(){
		this.controllerFor('home').setProperties({'showChat':false,'modal':false});
	}
});