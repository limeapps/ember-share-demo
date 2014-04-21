var Router = Ember.Router.extend({
  rootURL: ENV.rootURL,
  location: 'auto'
});

Router.map(function() {
	this.resource('home',{path:'/'},function(){
		this.route('welcome');
		this.route('todo',{path:'/todo'});
		this.route('chat',{path:'/chat'});
	});
});

export default Router;
