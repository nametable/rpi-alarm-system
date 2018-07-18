//Runs the bells using the onoff library

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var BUZZER= null;
var buzzInterval= null;
exports.startbuzz = function ()
{
	if (BUZZER == null)
	{
		BUZZER = new Gpio(2, 'out'); //use GPIO pin 4, and specify that it is output
		buzzInterval = setInterval(buzz, 750); //run the blinkLED function every 250ms		
	}
}
function buzz() { //function to start blinking
  if (BUZZER.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    BUZZER.writeSync(1); //set pin state to 1 (turn LED on)
  } else {
    BUZZER.writeSync(0); //set pin state to 0 (turn LED off)
  }
}
exports.ring = function ()
{
	if (BUZZER == null)
	{
		BUZZER = new Gpio(2, 'out'); //use GPIO pin 4, and specify that it is output
		//buzzInterval = setInterval(buzz, 250); //run the blinkLED function every 250ms		
	}
	BUZZER.writeSync(0)
	setTimeout(exports.endbuzz, 2000); //stop blinking after 30 seconds
}
exports.endbuzz = function () { //function to stop blinking
  if (typeof BUZZER !== 'undefined' && BUZZER)
  {
  	clearInterval(buzzInterval); // Stop blink intervals
  	BUZZER.writeSync(1); // Turn LED off
  	BUZZER.unexport(); // Unexport GPIO to free resources
  	BUZZER=null;
  	buzzInterval=null;
  }

}


process.on('SIGINT', function () {
	exports.endbuzz();
	process.exit(0);
});