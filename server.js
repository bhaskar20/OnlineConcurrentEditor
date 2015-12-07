var express = require('express');
var app = express();
var logger = require('morgan');
var port     = process.env.PORT || 8000;
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser=require('body-parser');
var sharejs = require('share');
var duplex = require( 'stream' ).Duplex;
var livedb = require('livedb');
var backend = livedb.client( livedb.memory() );
var share = sharejs.server.createClient({
      backend: backend
    });

//db
var dbUrl = require('./config/database.js');
var mongoose = require('mongoose');

//connect db
mongoose.connect(dbUrl.url);

app.use(express.static(__dirname + '/public'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());

io.on('connection', function(socket){
  Console.log('User Connected');
  var stream = new Duplex({ objectMode: true })

  stream._write = function(chunk, encoding, callback) {
    console.log( 's->c ', chunk )
    socket.send( JSON.stringify(chunk) )
    return callback()
  }

  stream._read = function() {}

/*  stream.headers = socket.request.headers

  stream.remoteAddress = socket.upgradeReq.connection.remoteAddress
*/
  socket.on( 'message', function( data ) {
    console.log( 'c->s ', data );
    return stream.push( JSON.parse(data) )
  })

/*  stream.on( 'error', function(msg) {
    return socket.close( msg )
  })

  socket.on( 'close', function(reason) {
    stream.push( null )
    stream.emit( 'close' )
    console.log( 'socket went away' )
    return socket.close( reason )
  })
*/
  stream.on( 'end', function() {
    return socket.close()
  })

  return share.listen( stream )
});


//routes
require('./app/routes.js');

//initializing server 
server.listen(port);
