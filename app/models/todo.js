import ShareProxy from 'ember-share/models/share-proxy';
import { isArray } from 'ember-share/utils';
export default ShareProxy.extend({
	id: null,
	wrapLookup : function(key,value) {
		return value.type || (isArray(value) ? 'item-array' : 'share-proxy');
	}
});