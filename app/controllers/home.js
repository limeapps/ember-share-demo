import { guid } from "ember-share/utils";

export default Ember.ObjectController.extend({
	newMsg : '',
	guid : null,
	newDoc : null,
	modal:false,
	showWelcome : true,
	showChat : false,
	handleText : function(){
		if(this.get('newMsg') === null || (this.guid === null && Ember.isEmpty(this.get('newMsg'))))
		{
			return;
		}
		if(this.guid === null)
		{
			// create a new chat doc
			var uid = guid();
			var newBubble = {id:uid,message:this.get('newMsg')};
			if(this.get('messages.length') > 120)
			{
				// remove the oldest chat message
				this.get('messages').removeAt(0);
			}
			this.get('messages').insertAt(this.get('model.messages.length'),newBubble);
			this.guid = uid;
		}
		else if (this.newDoc === null)
		{
			var messages = this.get('messages');
			var found = false;
			var newDoc = messages.findBy('id',this.guid);
			if(newDoc)
			{
				this.newDoc = newDoc;
				this.newDoc.set('message',this.get('newMsg'));
			}
			else
			{
				Ember.run.later(this,'handleText',20);
			}
		}
		else 
		{
			this.newDoc.set('message',this.get('newMsg'));
		}
	}.observes('newMsg'),
	actions : {
		showInput : function(){
			this.set('modal',true);
		},
		hideInput : function(){
			this.set('modal',false);
			this.set('guid',null);
			this.set('newDoc',null);
			this.set('newMsg',null);
		}
	}
});