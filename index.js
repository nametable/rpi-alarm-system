/*
//  RPi Alarm System
//  2018 Logan Bateman
//
//
*/
"use strict";
const {google} = require('googleapis');
let config = require('./config.json');
let sheet_maker = require('./sheet_maker.js');
let sheet_reader = require('./sheet_reader.js');
let calendar_reader = require('./calendar_reader.js');
let code_parser = require('./code_parser.js');
let privatekey = require("./google-apis-test-04121b34e74e.json");

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

//var resp=sheet_maker.mk_schedule_spreadsheet(jwtClient, {spreadsheetId:"11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA"});
//var resp=sheet_maker.mk_control_spreadsheet(jwtClient, {spreadsheetId:"11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA"});
//var resp=sheet_reader.readSpreadsheet(jwtClient, "11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA");
//var resp=sheet_maker.del_sheets_from_spreadsheet(jwtClient, "11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA");
//var resp=sheet_reader.readSheet(jwtClient, "11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA", "SUN");
//var resp = sheet_reader.getEventList(jwtClient, "11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA", (new Date()));
//var resp= sheet_reader.getControlSheetSettings(jwtClient, "1-1TapEnaVPItnR7L1grG4OE8WZDW44e40XUcLGlLBKU");
//var resp= sheet_reader.getModifiedTimestamp(jwtClient, "11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA");
var resp= calendar_reader.getEventsDuringDay(jwtClient, "ukd69ks324no7cmaili3mnsbv0@group.calendar.google.com", new Date())
var resp_value;
resp.then(function(response) {
  resp_value = response;
});

var lastTimestampControl; //timestamp of MasterControl Spreadsheet
var lastTimestampSchedule;//timestamp of Schedule spreadsheet
var lastUsedSchedule;     //id of last used schedule
var lastUsedCalendar;     //id of last used calendar
var currentEvents;        //current events in the calendar for today
var currentAlarmList;     //current alarms from last used schedule
var currentControlSettings;//current settings from control sheet
var confirmedMasterControl=false, confirmedCalendar=false, confirmedSchedule=false;
var needsupdateMasterControl=false, needsupdateCalendar=false, needsupdateSchedule=false;
var rescheduleNeeded=false; //whether or not the alarms need to be rescheduled
setInterval(function () { //main function which repeats every x seconds, specified in config.json
  console.log("Rechecking...");
  confirmedMasterControl=false, confirmedCalendar=false, confirmedSchedule=false;
  needsupdateMasterControl=true, needsupdateCalendar=false, needsupdateSchedule=false;
  whatNext();

}, settings.refreshRate*1000);


var whatNext= function()
{
  if(!(needsupdateMasterControl | needsupdateCalendar | needsupdateSchedule) && (confirmedMasterControl && confirmedCalendar && confirmedSchedule)){
    if(rescheduleNeeded){

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
                if(response.blankDaySchedule!=currentControlSettings.blankDaySchedule){
                  //currentControlSettings=response;
                  //if currentControlSettings.
                  if(!code_parser.getScheduleFromCalendarEvents(currentEvents,currentControlSettings)){
        
                  }
                }
                if(!code_parser.getScheduleFromCalendarEvents(currentEvents,currentControlSettings)){
                  console.log("No schedules in calendar. Need to use backup schedule.");
                  lastUsedSchedule=code_parser.getId(currentControlSettings.backupSchedule, currentControlSettings);
                  needsupdateSchedule=true;
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
                  if(currentControlSettings.backupSchedule){
                    console.error("No calendar... using backup.");
                    lastUsedSchedule=code_parser.getId(currentControlSettings.backupSchedule, currentControlSettings);
                    needsupdateSchedule=true;
                  }else{
                    console.error("No calendar and no backup schedule!");
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
        if(response!=lastTimestampSchedule){
          confirmedSchedule=true;
          var getNewAlarms=sheet_reader.getEventList(jwtClient, code_parser.getId(lastUsedSchedule, currentControlSettings), new Date())
          getNewAlarms.then(function(response){
            console.log("New schedule differs - alarm rescheduling needed")
            rescheduleNeeded=true;
            currentAlarmList=response;
            whatNext();
          }).catch(function(err){
            console.err("Couldn't get alarms from schedule -> " + error);
          });
        }
      }).catch(function(error){
        console.error("Error: can't get schedule sheet timestamp! -> " + error);
        if(config.backupSchedule){
          console.log("Trying to load backup schedule in config");
          lastUsedSchedule=config.backupSchedule;
          needsupdateSchedule=true;
          whatNext();
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
            needsupdateSchedule=true;
            whatNext();
          }
        }else{
          //If there is no schedule on the calendar and the master control sheet specifies a backup
          if(currentControlSettings.blankDaySchedule){
            console.log("Using backup schedule")
            if (currentControlSettings.blankDaySchedule!=lastUsedSchedule){
              console.log("Going to load in backup schedule");
              lastUsedSchedule=currentControlSettings.blankDaySchedule;
              needsupdateSchedule=true;
              whatNext();
            }
          }
        }
      }).catch(function(error){
        console.error("Problem reading calendar with id " + lastUsedCalendar + " -> " + error);
      });
      confirmedCalendar=true;
    }
    //whatNext();
  }
}
