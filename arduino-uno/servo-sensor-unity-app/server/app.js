var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var five = require("johnny-five");
var board = new five.Board();
var led, sensor, servo;


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
  
  servo = new five.Servo(10);

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
      //var scaledVal = this.scaleTo(0, 10); // scale to 0-10 deg as int
      //var scaledVal = this.fscaleTo(0, 10); // scale to 0-10 deg as float
      var scaledVal = this.fscaleTo(0, 10).toFixed(3); // scale to 0-10 deg with 3 decimal precision
      socket.emit('sensor', { raw: val, rawScaled: scaledVal });       
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

  // from unity client to server to control the servo
  socket.on('servo', function(data){
    //console.log(data);
    
    var val = data.raw; // range: -1.0 to 1.0 from unity amplitude
    var scaledVal = five.Fn.fmap(val, -1.0, 1.0, 0.0, 179.0).toFixed(0);
    //console.log(scaledVal);
    
    // move the servo
    // change takes 10 ms 
    servo.to(scaledVal, 10);
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