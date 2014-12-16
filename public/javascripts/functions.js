/*
 *
 * FONCTIONS
 *
 */

/*
 * read the Cookie with name parameter
 */
function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

/*
 * Send the new user connected
 */
function UserConnected(username) {
	socket.emit('newUserConnected', username, function(listOfUsers, messages, username) {
		
		$.each(listOfUsers, function(key, userName) {
  		$("#list-friends").prepend("<div class=\"row-fluid \" id=\"" + userName + "\"><div class=\"friend\">" + userName + "</div></div>");
  	});
		
		DisplayAllMessages(messages, username);
		
	});

	document.cookie="Username=" + username +"; expires=360000;path=/";
}

/*
 * Send The message
 */
function SendMessageToAll(message) { 
	socket.emit('sendMessageToAll', message);
	MessageInputClear();
}

function DisplayMessage(message, own) {
	$("#conversation").prepend("<div class=\"row-fluid" + ((own == 1) ? " align-right" : "") + "\">"
														+		"<div class=\"message\">"
														+			"<p class=\"username\">"+ message["username"] + " :</p>"
														+			"<p class=\"message-content\">" + message["content"] + "</p>"
														+		"</div>"						
														+	"</div>"
													);
}

function DisplayAllMessages(messages, username) {
	$.each(messages, function(key, value) {
		$("#conversation").append("<div class=\"row-fluid" + ((value["username"] == username) ? " align-right" : "") + "\">"
															+		"<div class=\"message\">"
															+			"<p class=\"username\">"+ value["username"] + " :</p>"
															+			"<p class=\"message-content\">" + value["content"] + "</p>"
															+		"</div>"						
															+	"</div>"
														);
	});
}

function MessageInputClear() {
	console.log('tu te fous de ma gueule ?');
	$("#message").val("");
}