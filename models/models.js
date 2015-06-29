var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
	lname: String,
	 fname: String,
	classyear : String,
	position: String,
	hobbies: String,
	sex: String
});

var requestSchema=new Schema({
	lname: String,
	fname: String,
	classyear : String,
	position: String,
	hobbies: String,
	prevexperience: String,
	Team:String,
	sex:String

});

mongoose.model('players', playerSchema);
mongoose.model('memberRequest', requestSchema);
