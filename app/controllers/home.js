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
				var txt = this.get('newMsg');
				if (txt.length > 256)
				{
					txt = txt.substr(0, 256);
				}
				txt = this.stripString(txt);
				this.newDoc.set('message',txt);
			}
			else
			{
				Ember.run.later(this,'handleText',20);
			}
		}
		else 
		{
			var txt = this.get('newMsg');
			if (txt.length > 256)
			{
				txt = txt.substr(0, 256);
			}
			txt = this.stripString(txt);
			this.newDoc.set('message',txt);
		}
	}.observes('newMsg'),
	stripString : function(str) {
		var reg = /[\u2400-\u243F\u2440-\u245F\u2460-\u24FF\u2500-\u257F\u2580-\u259F\u25A0-\u25FF\u2600-\u26FF\u2700-\u27BF\u27C0-\u27EF\u27F0-\u27FF\u2800-\u28FF\u2900-\u297F\u2980-\u29FF\u2A00-\u2AFF\u2B00-\u2BFF\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2E00-\u2E7F\u2E80-\u2EFF\u2F00-\u2FDF\u2FF0-\u2FFF\u3000-\u303F\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F]+/g;
		return str.replace(reg,"");
	},
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