
/**
 * Module dependencies.
 */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
require('./models/models');
var routes = require('./routes/index');
var user = require('./routes/user');
var env = process.env.NODE_ENV || 'development';
var config = require('./config')[env];

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
var mongoose = require('mongoose');                         
mongoose.connect(config.mongo.url); //Database name==Soccer
// development only
if (env == 'development') {
  app.use(express.errorHandler());
}

app.use('/', routes);
app.use('/users', user);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
