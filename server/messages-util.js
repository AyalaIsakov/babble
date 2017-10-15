m = require('./message')
module.exports = {
	Messages : function(){
		this.messages = [],
	    this.addMessage = function(message) {
	    	this.messages.push(message);
	    	return this.messages.length;
	    },
	    this.deleteMessage = function(id) {
	    	var index = this.messages.indexOf(item);
	    	if (index != -1) {
	    		this.messages.splice(index, 1);
	    	}
	    },
	    this.getMessages = function(counter) {
	    	return this.messages;
	    },
	    this.amount = function(){
	    	return this.messages.length;
	    },
	    this.sendersNumber = function(){
	    	var senders = [];
	    	for (var msg in this.messages){
	    		if (senders.indexOf(msg.sender) == -1){
	    			senders.push(msg.sender);
	    		}
	    	}
	    	return senders.length;
	    }
	}	
}