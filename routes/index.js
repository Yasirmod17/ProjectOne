var sendgrid  = require('sendgrid')('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');
var cloudinary = require('cloudinary');
var passwordHash = require('password-hash');
var mongoose = require('mongoose');
var players = mongoose.model('players');
var captain = mongoose.model('captain');
var memberrequest = mongoose.model('memberRequest');
var mongojs = require('mongojs');
var express = require('express');
var router = express();   //Removed '.Router()'
var player=[];
var foundRequests=[];
//var captain=[{captainUname:"ACFCcaptain",captainPword :"Capta1n"}]
var captainDetails=[];
var captainU = ''
var captainP = ""
var maleTeam=[];
var femaleTeam=[];

//Get players from players collection in Soccer Database
function splitPlayers(player){
	maleTeam=[];
	femaleTeam=[];
	for(i=0 ; i<player.length;i++){
		if(player[i].sex=='Male'){
			maleTeam.push({fname:player[i].fname, lname:player[i].lname});
		}
		if(player[i].sex=='Female'){
			femaleTeam.push({fname:player[i].fname, lname:player[i].lname});
		}

	}
}

function getCaptain(){
	var captains = mongoose.model('captain')
  var things= captains.find().exec(function(err, data) {
    if (err) {
      return console.error(err);
    }
    captainDetails= data;
    console.log("found captain");
    //console.log(data);
})
}

function logOutCaptain(){
	captainU="";
	captainP="";
}

function deletePlayer(a){
	var players = mongoose.model('players')
	players.remove({lname:a.lname,fname:a.fname},function (err,data){
		if(err){
			console.log("Couldnt delete player");
		}
		else{
			console.log("Player Deleted")
			getPlayer();
		}
	});
}

function getPlayer(){
  var players = mongoose.model('players')
  var things=players.find().exec(function(err, data) {
    if (err) {
      return console.error(err);
    }
    player= data;
    console.log("found player");
    splitPlayers(player);
    //console.log(player)
    //return(player);
    
    
  })
  //console.log("returning before finding");
}

//check if a request was made and is pending
function checkIfRequestExists(a){
	var existingRequest = mongoose.model('memberRequest');
	var request_exists=[];
	var get_existingRequest = existingRequest.findOne({fname:a.fname,lname:a.lname}).exec(function(err, data) {
		if (err){console.log("sorry couldn't check if request exists")}
		else{
			request_exists.push(data);
			console.log(request_exists)
			if (request_exists[0] == null){
				console.log("will send request");
				sendRequest(a);
				//return(res);
			}
			else{
				console.log("request already exists");
			}
		}
	});
}


//Save new member request to database
function sendRequest(a){
	var request= new memberrequest();
	request.fname = a.fname;
	request.lname = a.lname;
	request.position = a.position;
	request.team = a.team;
	request.classyear = a.classyear;
	request.sex = a.sex;
	request.hobbies = a.hobbies;
	request.prevexperience = a.prevexperience;

	request.save(function (err, data) {
      if (err) {console.log("---------------->fuck(Reequest save)<---------------------"); 
      	//return("Couldn't send request, try again later")}
      }
      else {console.log('Saved request');
      getPendingRequests();
      //return("Request sent succesfully");
    	}
    })
}



function getPendingRequests(){
  var pendingRequests = mongoose.model('memberRequest')
  //console.log(events.find().exec());
  var pending=pendingRequests.find().exec(function(err, data) {
    if (err) {
      return console.error(err);
    }
    //console.log(data)
    foundRequests = data;
    console.log(foundRequests);
    console.log("found requests");
  })
  console.log("returning before finding requests");
}

function sendEmail(a){
	console.log(a);
	payload=a;
	sendgrid.send(payload, function(err, json) {
	  if (err) { console.error(err); }
	  console.log(json);
	  console.log("email sent");
	});
}

/* GET players / pending requests from database page. */
getPlayer();
getPendingRequests();
getCaptain();
/* GET homepage page. */

router.get('/', function(req, res) { 
  res.render('homepage'
  );
});

router.get('/players', function(req, res) { 
	//console.log("....finding player...");
	//getPlayer();
	//console.log(player)
	res.send(player);
});

router.get('/maleTeam',function(req,res){
	console.log("Got to male team")
	console.log(maleTeam);
	res.send(maleTeam);
})


router.get('/femaleTeam',function(req,res){
	console.log("Got to female team")
	console.log(femaleTeam);
	res.send(femaleTeam);
})

router.post('/sendEmail', function(req,res){
	console.log(req.body);
	a={to:'', from:"",subject:"",text:""};
	a.to=req.body.to;
	a.from=req.body.from;
	a.subject=req.body.subject;
	a.text=req.body.text;
	sendEmail(a);
	if(a.from != "" && a.subject != "" && a.text != ""){
	res.send('Thank you for your feedback!');
	}
	else{
		res.send("Please enter information correctly");
	}
})



router.post('/playerAcceptance', function(req, res) { 
	player="";
	var add_player = new players();
	console.log("Got to playerAcceptance");
	var playerRequest = mongoose.model('memberRequest')
	console.log(req.body.lname);
	player_accepted= playerRequest.findOne({lname:req.body.lname}).exec(function(err, data) {
    if (err) {
       console.log("Couldnt find",req.body.lname);
    }
    else{
    	player=data;
    	console.log(player);
    	playerRequest.remove({lname:req.body.lname},function (err,data){
				if(err){
					console.log("error finding player request with lastname",req.body.lname);	
				}
				else{
					console.log("removed");
					getPendingRequests();;
					add_player.fname = player.fname;
					add_player.lname = player.lname;
					add_player.classyear = player.classyear;
					add_player.position = player.position;
					add_player.hobbies = player.hobbies;
					add_player.sex = player.sex;

				  add_player.save(function (err, data) {
		      	if (err) console.log("Couldnt add player to players",player.fname);
		      	else {console.log('Saved New Player',player.fname);
			      	getPendingRequests();
			      	getPlayer();
		      	}
		    		});
				}
			}); //Ends remove from request Database
			//var add_player = mongoose.model('players');
			
    }
    res.send("Player Added to player database and removed from requests")
   })	
});

router.post('/playerReject', function(req,res){
	getPlayer();
	console.log("got to player rejectance");
	console.log(req.body.lname)
	var playerRequest = mongoose.model('memberRequest');
	playerRequest.remove({lname:req.body.lname},function (err,data){
		if(err){
			console.log("error finding and remove player with lastname",req.body.lname);	
		}
		else{
			getPendingRequests();
			console.log("removed", req.body.lname);
			res.send("Player successfully rejected");
			
		}
	});
})


router.post('/postCaptainInfo', function(req, res) { 
	console.log("Got to Posting Captain Info");
	getCaptain();
	captainU=req.body.uname;
	captainP=req.body.pword;
	console.log(req.body);
	res.send("done");
});

router.post('/memberrequest', function(req, res) { 
	console.log("Got to request");
	logOutCaptain();
	checkIfRequestExists(req.body);
	console.log(req.body);
	res.send('Your information has been sent');
});

router.get('/captainapproval', function(req, res) { 
		res.send(foundRequests);
});

router.post('/captainLogout',function(req,res){
	console.log('logging out captain');
	captainU=req.body.uname;
	 captainP=req.body.pword;
	 res.send('Logged Out');
})


router.get('/captainLogin', function(req, res) { 
		console.log("checking captain info")
		if (captainU == captainDetails[0].captainUname){
			if (passwordHash.verify(captainP, captainDetails[0].captainPword)){
				res.send("Yes");
			}
		}
		else{
			res.send("No");
		}
});



router.post('/deletePlayer',function(req,res){
	console.log("got to deleting player");
	console.log(req.body);
	deletePlayer(req.body);
	res.send("player Deleted");
});

router.post('/upload', function(req,res){
	console.log("got to uploading")
	console.log(req.body)
})

module.exports = router;