/*
 *
 * WEB SOCKET
 * All web sockets which are going to listen and launch actions
 *
 */

socket = io.connect();

/*
 * Return all the new user
 */
socket.on('newUser', function (username) {
 	$("#list-friends").append("<div class=\"row-fluid\" id=\"" + username + "\" ><div class=\"friend\">" + username + "</div></div>");
 });

/*
 * Display the message to all
 */
socket.on('newMessage', function (message) {
	DisplayMessage(message, 0);
});

/*
 * Update the count
 */
socket.on('countUpdate',function (count) {
	$("#countUser").html(count);
});

/*
 * Update the count
 */
socket.on('usersUpdate',function (username) {
	$("#"+username).remove();
});



