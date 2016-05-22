var mongoose = require('mongoose');
    var fs = require('fs');
    var models_path = process.cwd() + '/models';

mongoose.connect(process.env.MONGO_URI);
mongoose.set('debug', true);

var db = mongoose.connection;

db.on('error', function (error) {
	console.error('MongoDB connection error:', error);
});

db.once('open', function callback() {
	console.info('MongoDB connection is established');
});

fs.readdirSync(models_path).forEach(function (file) {
	if (~file.indexOf('.js')) 
		require(models_path + '/' + file)
});