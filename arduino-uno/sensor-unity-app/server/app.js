var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var five = require("johnny-five");
var board = new five.Board();
var led, sensor;


app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

///////////////////////////////////////////////////////////////////////////////
// johnny-five
///////////////////////////////////////////////////////////////////////////////

// The board's pins will not be accessible until
// the board has reported that it is ready
board.on("ready", function() {
  console.log("Board Ready!");

  led = new five.Led(13);
  //led.off();
  led.blink(500);
  
  sensor = new five.Sensor({
    pin: "A0",
    freq: 100 // poll this sensor every 100 ms
  });  
  
  this.on("exit", function() {
    led.off();
  });
});

///////////////////////////////////////////////////////////////////////////////
// socket.io
///////////////////////////////////////////////////////////////////////////////
io.on('connection', function(socket){
  console.log('a client connected: ' + socket.id);
  
  // from server to client(s)
  socket.emit('message', {message: 'server active'});
  
  ////////////////////////////////////////////
  // ARDUINO
  ////////////////////////////////////////////
  if(board.isReady){
    
    // read in sensor data as it changes, send it to clients
    sensor.on("change", function(){
      //console.log(data);
      var val = this.raw; // range: 0 - 1023 from ADC
      var scaledVal = this.scaleTo(0, 179); // scale to 0-179 deg
      socket.emit('sensor', { raw: val, rawScaled: scaledVal }); 
      //socket.broadcast.emit('message', data);
    });

    // constantly stream data from sensor, send it to clients
    // sensor.on("data", function(data){    
    //   socket.emit('sensor', { raw: this.raw });
    // });
  } 

  ////////////////////////////////////////////
  // UNITY CLIENT
  ////////////////////////////////////////////
  // from unity client to server
  socket.on('unity', function(data){
    console.log(data);
    
    // send data to all clients (except the client sending data)
    socket.broadcast.emit('message', data);
  });
  
  ////////////////////////////////////////////
  // BROWSER CLIENT
  ////////////////////////////////////////////
  // from browser client to server
  socket.on('browser', function(data){
    console.log(data);
    
    // send data to all clients (except the client sending data)
    socket.broadcast.emit('message', data);
  });
    
  socket.on('disconnect', function() {
    console.log('a client disconnected: ' + socket.id);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});