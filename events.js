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
            action_param_split= event.split("@");
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
        cmd.run('cvlc "$(youtube-dl -f 140 -g ' + params[0] + ')"');
    }
    static playAudioFile(params){
        cmd.run('cvlc "~/Music/' + params[0] + '"');
    }
    static updateSystem(params){
        cmd.run('sudo apt update && sudo apt upgrade');
    }
    static eSpeak(params){
        cmd.run('espeak "' + params[0] + '"');
    }
    static setVolume(params){
        cmd.run('amixer set \'PCM\' ' + params[0]);
    }
    static comboEvent(params){

    }
}