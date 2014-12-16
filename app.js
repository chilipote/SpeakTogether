/** 
 * Module dependencies.
 */
var express = require('express')
	, app = express()	
  , cookie = require('cookies')
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server)
  , path = require('path')
  , mongoose = require('mongoose')
  , routes = require('./routes')
  , User = require('./models/user.js')(mongoose);


/**
 * Set properties for the app
 */
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.set('env', 'development');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

/**
 * For development
 */
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}


/**
 * Allow cross domain
 */
app.get('/', function (req, res, next) {
  
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();

}, routes.index);


/**
 * launch server
 */
server.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


/**
 * connec to mongoDB
 */
mongoose.set('dbname', 'speakusdb');
mongoose.connect('mongodb://localhost/'+mongoose.get('dbname'));

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {

  console.log("you're well connected ! Yay !")

});

var user = new User( {name : "roger"} );
user.save();
User.find(function (err, users) {
  if (err) console.log(err);
  console.log(users)
})

console.log(user);



var users = { } 
  , messages = { }
  , countMessage = 0
  , count;


/**
 * Socket ready => connection
 */
io.sockets.on('connection', function (socket) {
  
  io.sockets.emit('countUpdate', io.sockets.clients().length);
  
  socket.on('newUserConnected', function(userName, callback) {

    socket.userName = userName;
    users[userName] = userName;
    callback(users, messages, userName);

    socket.broadcast.emit('newUser', userName);

  });

  socket.on('sendMessageToAll', function (message) { 
    countMessage++;
    messages[countMessage] = message;
    socket.broadcast.emit('newMessage', message);
  });

  socket.on('disconnect', function (data) {
    
    count = io.sockets.clients().length;
    count--;

    // Merge into one socket
    socket.broadcast.emit('countUpdate', count);
    socket.broadcast.emit('usersUpdate', socket.userName);

    delete users[socket.userName];

  });

});


 