var five = require("johnny-five");
var board = new five.Board({port: "/dev/serial0"});

board.on("ready", function() {
  
  val = 0;
  this.pinMode(13,1);
  this.loop(1000, function(){
  
    this.digitalWrite(13, (val = val ? 0 : 1 ) );
  })

});

