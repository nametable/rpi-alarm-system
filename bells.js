//Runs the bells using the onoff library

var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var BUZZER= null;
const buzzer_pin=2; //onoff uses bcm numbering
var buzzInterval= null;
exports.startbuzz = function ()
{
	if (BUZZER == null)
	{
		BUZZER = new Gpio(buzzer_pin, 'out');
		buzzInterval = setInterval(buzz, 750);
	}
}
function buzz() { //function to start blinking
  if (BUZZER.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    BUZZER.writeSync(1); //set pin state to 1 (turn relay off)
  } else {
    BUZZER.writeSync(0); //set pin state to 0 (turn relay on)
  }
}

var ringSequence;
var ringSeqCounter;
exports.ring = function (params)
{
	ringSequence=params;
	ringSeqCounter=0;
	if (BUZZER == null)
	{
		BUZZER = new Gpio(buzzer_pin, 'out');
	}
	console.log("debug: startbuzz");
	console.log("debug: params -> " + params.length);
	ringStartStop();
	//setTimeout(exports.endbuzz, 2000); //stop blinking after 30 seconds
}
function ringStartStop(){
	
	if(ringSeqCounter % 2 ==0){
		BUZZER.writeSync(0)
	}else{
		BUZZER.writeSync(1)
	}
	ringSeqCounter++;
	if(ringSeqCounter==ringSequence.length){
		exports.endbuzz();
	}else{
		setTimeout(ringStartStop, Math.trunc(parseFloat(ringSequence[ringSeqCounter-1]))*1000);
	}
}
exports.endbuzz = function () { //function to stop blinking
  if (typeof BUZZER !== 'undefined' && BUZZER)
  {
  	clearInterval(buzzInterval); // Stop blink interval
		console.log("debug: endbuzz");
  	BUZZER.writeSync(1); // Turn LED off
		console.log("debug: buzz ended");
  	BUZZER.unexport(); // Unexport GPIO to free resources
  	BUZZER=null;
  	buzzInterval=null;
  }

}


process.on('SIGINT', function () {
	exports.endbuzz();
	process.exit(0);
});
