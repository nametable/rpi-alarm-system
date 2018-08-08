var cmd=require('node-cmd');
var bells = require('./bells.js');

module.exports = class events{
    static execute(event){
        var action_param_split;
        var params;
        if(event.indexOf(":")!=-1){
            action_param_split= event.split(":");
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