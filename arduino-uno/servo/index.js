var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

  var servo = new five.Servo(10);
  //servo.sweep();

  // goto 0 deg
  servo.to(0);
  
  // goto 90 deg
  //servo.to(90);

});
