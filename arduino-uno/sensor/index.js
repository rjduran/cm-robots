var five = require("johnny-five");
var board = new five.Board();
var val = 0;

board.on("ready", function() {

  var sensor = new five.Sensor("A0");
  
  sensor.on("change", function(value) {
    console.log(value);        
  }); 

});
