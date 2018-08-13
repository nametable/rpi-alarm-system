//  2018 - Logan Bateman
//
var cmd=require('node-cmd');
var bells = require('./bells.js');

module.exports = class events{
    static execute(event){
        var action_param_split;
        var params;
        if(!event){
            console.log("Error, this alarm has no event");
            return;
        }
        if(event.indexOf("@")!=-1){
            action_param_split= event.split(/@(.+)/); //split("@");
            params= action_param_split[1].split(",");
            console.log(params);
            switch(action_param_split[0]){
                case "ringBells":
                    this.ringBells(params);
                    break;
                case "playYoutube":
                    this.playYoutube(params);
                    break;
                case "playAudioFile":
                    this.playAudioFile(params);
                    break;
                case "updateSystem":
                    this.updateSystem(params);
                    break;
                case "eSpeak":
                    this.eSpeak(params);
                    break;
                case "setVolume":
                    this.setVolume(params);
                    break;
                case "stopAudio":
                    this.stopAudio(params);
                    break;
                case "combo":
                    this.comboEvent(params);
                    break;
                default:
                    break;
            }
        }
    }
    static ringBells(params){
        bells.ring(params);
    }
    static playYoutube(params){
        //This will find the audio stream of a youtube video and play it with cvlc
        //cvlc "$(/usr/local/bin/youtube-dl -f 140 -g https://www.youtube.com/watch?v=nQWFzMvCfLE)"
        var cmdstring='setsid \'mplayer "$(youtube-dl -f 140 -g ' + params[0] + ')"\ > youtubeplay.log\'';
        cmd.run(cmdstring);
        console.log("Running -> " + cmdstring);
    }
    static playAudioFile(params){
        var cmdstring='setsid mplayer ~/"Music/' + params[0] + '"';
        cmd.run(cmdstring);
        console.log("Running -> " + cmdstring);
    }
    static updateSystem(params){
        var cmdstring='sudo apt update && sudo apt upgrade';
        cmd.run(cmdstring);
        console.log("Running -> " + cmdstring);
    }
    static eSpeak(params){
        params[0]=params[0].replace("$time", getAmPmTime);
        var cmdstring='espeak "' + params[0] + '"';
        cmd.run(cmdstring);
        cmd.run(cmdstring);
        console.log("Running -> " + cmdstring);
    }
    static setVolume(params){
        var cmdstring='amixer set PCM ' + params[0] + ' -M';
        cmd.run(cmdstring);
        console.log("Running -> " + cmdstring);
    }
    static stopAudio(params){
        var cmdstring='killall mplayer';
        cmd.run(cmdstring);
        console.log("Running -> " + cmdstring);
    }
    static comboEvent(params){
        //yet to be implemented
        var eventsList= params[0].split("^");
        eventsList.forEach(event => {
            this.execute(event)
        });
    }
}
getAmPmTime = function(){
    if ((new Date()).getHours()<12){
        return (new Date()).getHours() + ":" + (new Date()).getMinutes() + "am";
    }else{
        return ((new Date()).getHours()-12) + ":" + (new Date()).getMinutes() + "pm";
    }
}