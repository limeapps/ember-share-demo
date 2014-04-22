import { guid } from "ember-share/utils";

export default Ember.ObjectController.extend({
	guid:null,
	newDoc:null,
	newItem:null,
	handleItem : function(){
		if(this.get('newItem') === null || (this.guid === null && Ember.isEmpty(this.get('newItem'))))
		{
			return;
		}
		if(this.guid === null)
		{
			// create a new todo doc
			var uid = guid();
			var newItem = {id:uid,title:this.get('newItem'),done:false};
			this.get('items').insertAt(this.get('model.items.length'),newItem);
			this.guid = uid;
		}
		else if (this.newDoc === null)
		{
			var items = this.get('items');
			var found = false;
			var newDoc = items.findBy('id',this.guid);
			if(newDoc)
			{
				this.newDoc = newDoc;
				var txt = this.get('newItem');
				if (txt.length > 256)
				{
					txt = txt.substr(0, 256);
				}
				this.newDoc.set('title',txt);
			}
			else
			{
				Ember.run.later(this,'handleItem',20);
			}
		}
		else 
		{
			var txt = this.get('newItem');
			if (txt.length > 256)
			{
				txt = txt.substr(0, 256);
			}
			this.newDoc.set('title',txt);
		}
	}.observes('newItem'),
	actions : {
		deleteItem : function(item){
			if(item === this.newDoc)
			{
				this.guid = null;
				this.newDoc = null;
				this.set('newItem',null);
			}
			this.get('items').removeObject(item);
			// the library should take care of this
			this.get('items').forEach(function(item,idx){
				item._context.path[1] = idx;
			});
		},
		keypress : function(e){
			console.log(arguments);
		}
	}
});