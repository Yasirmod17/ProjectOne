var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var playerSchema = new Schema({
	lname: String,
	 fname: String,
	classyear : String,
	position: String,
	hobbies: String,
	sex: String,
	image: String
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

var captainSchema=new Schema({
	captainUname: String,
	captainPword: String
});

mongoose.model('players', playerSchema);
mongoose.model('memberRequest', requestSchema);
mongoose.model('captain',captainSchema);