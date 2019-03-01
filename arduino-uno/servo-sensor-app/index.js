var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var five = require("johnny-five");
var board = new five.Board();
var led, servo, sensor;

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

  sensor = new five.Sensor({
    pin: "A0",
    freq: 100 // poll this sensor every 100 ms
  });
         
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

    sensor.on("change", function(value) {
      
      var val = sensor.scaleTo(0, 180);
      // servo.to(val);

      // change takes 10 ms 
      servo.to(val, 10);

      socket.emit('sensor', { raw: val });       
    }); 
      
  } 
});

http.listen(3000, function() {
  console.log('listening on *:3000');
});
