var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var five = require("johnny-five");
var board = new five.Board();
var led, servo;

app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});


///////////////////////////////////////////////////////////////////////////////
// johnny-five
///////////////////////////////////////////////////////////////////////////////

// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function() {
  console.log("Board Ready!");
  
  servo = new five.Servo(10);  
         
});


///////////////////////////////////////////////////////////////////////////////
// socket.io
///////////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket) {
  console.log('a user connected');
    
  socket.on('disconnect', function() {
    console.log('user disconnected');
  });
  
  if(board.isReady){

    socket.on('servo on', function(data) {
      console.log('message: servo on, ' + data.state);
      if(board.isReady) {        
        servo.sweep();
      }
    });
    
    socket.on('servo off', function(data) {
      console.log('message: servo off, ' + data.state);
      if(board.isReady) {
        servo.stop();
      }
    });
      
  } 
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
