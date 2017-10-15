module.exports = {
	Message : function(_content, _sender, _mail){
		this.content = _content;
		this.sender = _sender;
		this.mail = _mail;
	}
}