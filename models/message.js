var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectID = Schema.ObjectId;

mongoose.connect('localhost');

var Message = mongoose.Schema({
	author: String,
	message: String,
	createDate: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Message', Message);