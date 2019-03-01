var five = require("johnny-five");
var board = new five.Board();
var val = 0;

board.on("ready", function() {

  var sensor = new five.Sensor("A0");
  var servo = new five.Servo(10);
  
  sensor.on("change", function(value) {
    //console.log(value);
        
    // API Way
    // val = five.Fn.map(value, 0, 1023, 0, 180);

    // sensor scaleTo way
    val = sensor.scaleTo(0, 180);
    servo.to(val);
    
    console.log(val);
    
  }); 

});