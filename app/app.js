import Resolver from 'ember/resolver';
import Store from 'ember-share/store';

Store.reopen({
  url : 'http://'+window.location.hostname+':'+ENV.port+'/primus'
});

Ember.MODEL_FACTORY_INJECTIONS = true;

var App = Ember.Application.extend({
  LOG_ACTIVE_GENERATION: true,
  LOG_MODULE_RESOLVER: true,
  // LOG_TRANSITIONS: true,
  // LOG_TRANSITIONS_INTERNAL: true,
  LOG_VIEW_LOOKUPS: true,
  modulePrefix: 'ember-share-demo', // TODO: loaded via config
  Resolver: Resolver
});

App.initializer({
  name: 'injectStore',
  initialize: function(container, application) {
	application.register('store:main',Store);
    application.inject('controller', 'store', 'store:main');
    application.inject('route', 'store', 'store:main');
  }
});


export default App;
