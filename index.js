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

var lastTimestampControl;
var lastTimestampSchedule;
var lastUsedSchedule;
var lastUsedCalendar;
var currentEvents;
var currentControlSettings;
var confirmedMasterControl=false, confirmedCalendar=false, confirmedSchedule=false;
var needsupdateMasterControl=false, needsupdateCalendar=false, needsupdateSchedule=false;
var rescheduleNeeded=false;
setInterval(function () {
  confirmedMasterControl=false, confirmedCalendar=false, confirmedSchedule=false;
  needsupdateMasterControl=false, needsupdateCalendar=false, needsupdateSchedule=false;
  var checkTimestampControl=sheet_reader.getModifiedTimestamp(jwtClient, settings.controlSheet);
  checkTimestampControl.then(function(response){
    if(response){
      if(response!=lastTimestampControl){
        needsupdateMasterControl=true;
      }else{
        confirmedMasterControl=true;
      }
      whatNext();
    }else{
      console.log("Error: can't get master control sheet timestamp!");
    }
  });
  if(lastUsedSchedule){ //if a schedule has previously been loaded - AKA not just started program
    var checkTimestampSchedule=sheet_reader.getModifiedTimestamp(jwtClient, lastUsedSchedule)
    checkTimestampSchedule.then(function(response){
      if(response){
        if(response!=lastTimestampSchedule){
          needsupdateSchedule=true;
        }else{
          confirmedSchedule=true;
        }
      }else{
        console.log("Error: can't get schedule sheet timestamp!");
      }
    });
  }
  if(lastUsedCalendar && currentControlSettings){ //if a calendar has previously been used
    var loadCurrentSchedule=calendar_reader.getEventsDuringDay(jwtClient, lastUsedCalendar, new Date())
    loadCurrentSchedule.then(function(response){

    });
  }else{
    needsupdateCalendar=true;
  }
}, settings.refreshRate*1000);


whatNext= function()
{
  if(!(needsupdateMasterControl | needsupdateCalendar | needsupdateSchedule) && (confirmedMasterControl && confirmedCalendar && confirmedSchedule)){
    if(rescheduleNeeded){

    }
  }else{
    if(needsupdateMasterControl){
      var getControlSettings= sheet_reader.getControlSheetSettings(jwtClient, settings.controlSheet);
      getControlSettings.then(function(response){
        if(response!=currentControlSettings){
          currentControlSettings=response;
          //if currentControlSettings.
        }
      });
    }
  }
}
