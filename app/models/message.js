import ShareProxy from 'ember-share/models/share-proxy';
import shareTextMixin from 'ember-share/mixins/share-text';
export default ShareProxy.extend(shareTextMixin,{
	textKeys : ['message'],
	id: null,
	color : function(){
		var rand = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
		var clrs = ['bubble-yellow','bubble-green','bubble-violet','bubble-blue','bubble-red','bubble-orange','bubble-aqua','bubble-olive','bubble-pink'];
		return clrs[rand];
	}.property('message.length')
});