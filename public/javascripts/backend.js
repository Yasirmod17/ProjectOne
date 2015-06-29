var mongoose = require('mongoose');                         

var player=[];

function getPlayer(a){
  var players = mongoose.model('Players')
  //console.log(events.find().exec());
  var things=players.findOne( {name:a}, function(err, data) {
    if (err) {
      return console.error(err);
    }
    //console.log(data)
    player= data
    console.log("found player")
  })
  console.log("returning before finding");
}