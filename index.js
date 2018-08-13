/*
//  RPi Alarm System
//  2018 Logan Bateman
//
//
*/
"use strict";
const {google} = require('googleapis');
const _ = require('lodash');

let config = require('./config.json');
let sheet_maker = require('./sheet_maker.js');
let sheet_reader = require('./sheet_reader.js');
let calendar_reader = require('./calendar_reader.js');
let code_parser = require('./code_parser.js');
let privatekey = require("./serviceaccountkey.json");
require('datejs');

const schedule = require('node-schedule');
var http = require('http');
var events= require('./events.js');

var settings={};
//from http://isd-soft.com/tech_blog/accessing-google-apis-using-service-account-node-js/
// configure a JWT auth client
let jwtClient = new google.auth.JWT(
  privatekey.client_email,
  null,
  privatekey.private_key, ['https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/calendar'
  ]);
//authenticate request
jwtClient.authorize(function(err, tokens) {
  if (err) {
    console.log(err);
    return;
  } else {
    console.log("Auth Token Success!");
  }
});

settings.backupSchedule=config.master_backup_schedule_id;
settings.controlSheet=config.master_control_gsheet_id;
settings.refreshRate=config.update_frequency;
settings.folder=config.master_folder_id;

var currentDay=Date.today(); //today
var lastTimestampControl; //timestamp of MasterControl Spreadsheet
var lastTimestampSchedule;//timestamp of Schedule spreadsheet
var lastUsedSchedule;     //id of last used schedule
var lastUsedCalendar;     //id of last used calendar
var currentEvents;        //current events in the calendar for today
var currentAlarmList=[];     //current alarms from last used schedule
var newAlarmList=[];         //new alarms to be set
var currentControlSettings;//current settings from control sheet
var confirmedMasterControl=false, confirmedCalendar=false, confirmedSchedule=false;
var needsupdateMasterControl=false, needsupdateCalendar=false, needsupdateSchedule=false;
var rescheduleNeeded=false; //whether or not the alarms need to be rescheduled

setInterval(function () { //main function which repeats every x seconds, specified in config.json
  console.log("Rechecking...");
  confirmedMasterControl=false, confirmedCalendar=false, confirmedSchedule=false;
  needsupdateMasterControl=true, needsupdateCalendar=false, needsupdateSchedule=false;
  rescheduleNeeded=false; //Until proven needed
  whatNext();

}, settings.refreshRate*1000);


var whatNext= function() //calls recursively when still loading needed information
{
  if(!(needsupdateMasterControl | needsupdateCalendar | needsupdateSchedule) && (confirmedMasterControl && confirmedCalendar && confirmedSchedule)){
    if(rescheduleNeeded){ //only happens if something changed
      toastAlarms();
      scheduleAlarms();
    }
  }else{
    if(needsupdateMasterControl){
      console.log("Checking master control sheet...")
      var checkTimestampControl=sheet_reader.getModifiedTimestamp(jwtClient, settings.controlSheet);
      checkTimestampControl.then(function(response){
        if(response){
          if(response!=lastTimestampControl){
            console.log("Master control sheet changed...");
            var getControlSettings= sheet_reader.getControlSheetSettings(jwtClient, settings.controlSheet);
            getControlSettings.then(function(response){
              if(currentControlSettings){
                if(!code_parser.getScheduleFromCalendarEvents(currentEvents,currentControlSettings)){
                  console.log("No schedules in calendar. Need to use blank day schedule.");
                  if(currentControlSettings.blankDaySchedule){
                    lastUsedSchedule=code_parser.getId(currentControlSettings.blankDaySchedule, currentControlSettings);
                    needsupdateSchedule=true;
                  }else{
                    console.log("No blank day schedule. Need to use config.json backup schedule.")
                    if(settings.backupSchedule){
                      lastUsedSchedule=code_parser.getId(settings.backupSchedule, currentControlSettings);
                      needsupdateSchedule=true;
                    }
                  }
                }
              }else{
                //Setting currentControlSettings for first time - need to update based on these settings
                currentControlSettings=response;
                //Checks to see if calendar is active
                if(currentControlSettings.curCal){
                  console.log("Calendar id found. Need to update calendar");
                  lastUsedCalendar=code_parser.getId(currentControlSettings.curCal, currentControlSettings);
                  needsupdateCalendar=true;
                }else{ //No calendar - use backup
                  if(currentControlSettings.blankDaySchedule){
                    console.error("No calendar... using blank day schedule.");
                    if(currentControlSettings.blankDaySchedule){
                      lastUsedSchedule=code_parser.getId(currentControlSettings.blankDaySchedule, currentControlSettings);
                      needsupdateSchedule=true;
                    }else{
                      console.log("No blank day schedule. Need to use config.json backup schedule.")
                      if(settings.backupSchedule){
                        lastUsedSchedule=code_parser.getId(settings.master_backup_schedule_id, currentControlSettings);
                        needsupdateSchedule=true;
                      }
                    }
                    }else{
                      if(settings.backupSchedule){
                        console.log("Using backup schedule from config.json")
                        lastUsedSchedule=code_parser.getId(settings.master_backup_schedule_id, currentControlSettings);
                        needsupdateSchedule=true;
                      }else{
                        console.error("No calendar and no backup schedule!");
                      }
                  }
                }
              }
              needsupdateMasterControl=false;
              confirmedMasterControl=true;
              needsupdateCalendar=true;
              whatNext();
            });
            lastTimestampControl=response; //Remembers timestamp of just loaded control sheet
          }else{
            needsupdateMasterControl=false;
            confirmedMasterControl=true;
            needsupdateCalendar=true;
            whatNext();
          }
        }
      }).catch(function(error){
        console.error("Error: can't get master control sheet timestamp! -> " + error);
      });
    }
    if(needsupdateSchedule){
      console.log("Checking schedule: "+ lastUsedSchedule);
      needsupdateSchedule=false;
      var checkTimestampSchedule=sheet_reader.getModifiedTimestamp(jwtClient, code_parser.getId(lastUsedSchedule, currentControlSettings))
      checkTimestampSchedule.then(function(response){
        //console.log("Last modified " + response);
        if((response!=lastTimestampSchedule)|(currentDay.getDay()!=Date.today().getDay())){ 
          confirmedSchedule=true;
          var getNewAlarms=sheet_reader.getEventList(jwtClient, code_parser.getId(lastUsedSchedule, currentControlSettings), new Date())
          lastTimestampSchedule=response;
          getNewAlarms.then(function(response){
            console.log("New schedule differs - alarm rescheduling needed")
            rescheduleNeeded=true;
            newAlarmList=response;
            whatNext();
          }).catch(function(error){
            console.error("Couldn't get alarms from schedule -> " + error);
          });
        }
      }).catch(function(error){
        console.error("Error: can't get schedule sheet timestamp! -> " + error);
        if(config.master_backup_schedule_id){
          console.log("Trying to load backup schedule in config");
          if(lastUsedSchedule==config.master_backup_schedule_id){
            console.log("Major problems - can't load backup schedule");
            needsupdateSchedule=false;
          }else{
            lastUsedSchedule=config.master_backup_schedule_id;
            needsupdateSchedule=true;
            whatNext();
          }
        }else{
          //Can't load any schedule at all, not even backup - maybe loss of inet
          console.error("Falling back to currently loaded schedule - basically offline");
        }
      });
      
      
    }
    if(needsupdateCalendar){ //Update the calendar and look for today's schedule
      console.log("Checking calendar...");
      needsupdateCalendar=false;
      var readCal=calendar_reader.getEventsDuringDay(jwtClient, lastUsedCalendar, new Date());
      readCal.then(function(response){
        currentEvents=response;
        var newScheduleFromCalendar=code_parser.getScheduleFromCalendarEvents(currentEvents, currentControlSettings);
        //See if the calendar events have a schedule
        if(newScheduleFromCalendar){
          //See if the calendar shcedule is new
          if(newScheduleFromCalendar!=lastUsedSchedule){
            console.log("New schedule from calendar to get...");
            lastUsedSchedule=newScheduleFromCalendar;
          }
        }else{
          //If there is no schedule on the calendar and the master control sheet specifies a backup
          if(currentControlSettings.blankDaySchedule){
            console.log("Using backup schedule")
            if (currentControlSettings.blankDaySchedule!=lastUsedSchedule){
              console.log("Going to load in blank day schedule");
              lastUsedSchedule=currentControlSettings.blankDaySchedule;
            }
          }
        }
        needsupdateSchedule=true;
        whatNext();
      }).catch(function(error){
        console.error("Problem reading calendar with id " + lastUsedCalendar + " -> " + error);
      });
      confirmedCalendar=true;
    }
    //whatNext();
  }
}
function toastAlarms() //remove the old alarms safely with jobs
{
	// for (var i = 0; i < schedule.scheduledJobs.length; i++) {
  //   schedule.scheduledJobs[i].cancel();
  // }
  //https://stackoverflow.com/questions/39925701/how-to-delete-all-schedules-in-node-schedule
  const jobNames = _.keys(schedule.scheduledJobs);
  for(let name of jobNames) schedule.cancelJob(name);
  //schedule.scheduledJobs=[];
	currentAlarmList=[];
	//schedule = null;
	//schedule = new require('node-schedule');
	console.log("Old alarms toasted...");
}
function scheduleAlarms() //schedule the new alarms // curAlarms[i].time //new Date(Date.now() + 5000)
{
  currentAlarmList=newAlarmList;//Object.assign({}, newAlarmList);
  //currentAlarmList.length=newAlarmList.length;
  currentDay=Date.today();
  if (currentAlarmList==[]){console.log("Warning: no defined alarms");return;}
	for (var i = 0; i < currentAlarmList.length; i++) {
    var JobTime=new Date.today().at(currentAlarmList[i].Time);
		currentAlarmList[i].Job= schedule.scheduleJob(JobTime, function(alarm){
      console.log("Alarm: " + alarm.Description + " @ " + alarm.Time + " -> " + alarm.Event);
      events.execute(alarm.Event);
      //console.log(y);
      //bells.ring();
      //cmd.run('mpg123 whistle.mp3; espeak "'+ alarm.Description + 'The time is' + alarm.Time + '"');
    }.bind(null,currentAlarmList[i]));
    if(JobTime < Date.now()){
      console.log("<" + JobTime + "#" + i + " - " + currentAlarmList[i].Description + " -> " + currentAlarmList[i].Event);
    }else{
      console.log(">" + JobTime + "#" + i + " - " + currentAlarmList[i].Description + " -> " + currentAlarmList[i].Event);
    }
	}
	//console.log(curAlarms[0].time.getHours());
	//console.log(Date(Date.now() + 5000));
	//console.log(curAlarms[0].job);
	//console.log(curAlarms[0].job.nextInvocation());
	console.log("New alarms scheduled...");
}
http.createServer(function(req, res){
  var Message;
  currentAlarmList.forEach(alarm => {
    Message+="Alarm: " + alarm.Description + " @ " + alarm.Time + " -> " + alarm.Event + "\n";
  });
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end(Message);
}).listen(8080);