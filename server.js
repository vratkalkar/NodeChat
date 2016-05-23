require('./core/mongoose.js');
require('./models/message.js');
var mongoose = require('mongoose');
var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Find the database to connect to, if not found default to localhost
var uriString = process.env.MONGOLAB_URI ||
				process.env.MONGOHQ_URL ||
				'mongodb://localhost/NodeChat'

//Listen on established port or default to port 5000
var port = process.env.PORT || 5000
http.listen(port, function(){
	console.log('listening on *:' + port);
});

//Connect to database via mongoose connect
mongoose.connect(uriString, function(err,res){
	if (err) {
		console.log("Error connecting to: " + uriString + ' . ' + err);
	} else {
		console.log('Succesfully connected to: ' + uriString);
	}
});

app.get('/chat', function(req, res){
	res.sendFile(__dirname + '/index.html');
});

app.get('/login', function(req, res){
	res.sendFile(__dirname + '/login.html');
});

app.post('/messages', function(req, res, next){
	var message = req.body.message;
	var author = req.body.author;
	var messageModel = new Message();
	messageModel.author = author;
	messageModel.message = message;
	messageModel.save(function (err, result){
		if (!err) {
			Message.find({}).sort('-createDate').limit(5).exec(function (err, messages){
				io.emit("message", messages);
			});
			res.send("Message Sent!");
		} else {
			res.send("Unable to send - Try again!");
		}
	});
});

app.get('/messages', function(req, res, next){
	Message.find({}).sort('-createDate').limit(5).exec(function (err,messages){
		res.json(messages);
	});
});

