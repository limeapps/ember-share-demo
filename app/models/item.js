import ShareProxy from 'ember-share/models/share-proxy';
import shareTextMixin from 'ember-share/mixins/share-text';
export default ShareProxy.extend(shareTextMixin,{
	textKeys : ['title'],
	id: null
});