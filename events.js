var cmd=require('node-cmd');
var bells = require('./bells.js');

module.exports = class events{
    static execute(event){
        var action_param_split;
        var params;
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
                case "setVolume"(params):
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

    }
    static updateSystem(params){

    }
    static eSpeak(params){

    }
    static comboEvent(params){

    }
}