var express = require('express');
var app = express();
var logger = require('morgan');
var port     = process.env.PORT || 8080;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser=require('body-parser');
var share = require('share');
//db
var dbUrl = require('./config/database.js');
var mongoose = require('mongoose');

//connect db
mongoose.connect(dbUrl.url);

app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

//routes
require('./app/routes.js');

//initializing server 
server.listen(port);
