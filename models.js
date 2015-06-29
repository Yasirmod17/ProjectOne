var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
	 name: String,
	classyear : String,
	position: String,
	hobbies: String
});

mongoose.model('players', playerSchema);
