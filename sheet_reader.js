/*
//  2018 Logan Bateman
//  sheet_reader: a class which contains functions for reading a Google Spreadsheet
//
//
*/

const {google} = require('googleapis');
const constants = require('./constants.js');
var sheets = google.sheets('v4');
var drive = google.drive('v3');
module.exports = class sheet_reader{
  //gets basic spreadsheet info - not very useful
  static readSpreadsheet(jwtClient, spreadsheetId)
  {
    var resp=new Promise(function(resolve, reject){
      sheets.spreadsheets.get({
        spreadsheetId: spreadsheetId,
        auth: jwtClient
      },
      function(err, response)
      {
        if(response){resolve(response)}
        else if (err) {reject(err)}
      });
    });
    return resp;
  }
  //Return actual values from a spreadsheet at the specified range
  static readSheet(jwtClient, spreadsheetId, range){
    return new Promise(function(resolve, reject){
      sheets.spreadsheets.values.get({
        auth:jwtClient,
        spreadsheetId: spreadsheetId,
        range: range
      },function(err,response){
        if(response){resolve(response)}
        else if (err) {reject(err)}
      })
    });
  }
  //Return a list of events from a Schedule spreadsheet based on sheetid and date
  static getEventList(jwtClient, spreadsheetId, date){
    return new Promise(function(resolve, reject){
      var weekday=constants.dow_list[date.getDay()];
<<<<<<< HEAD
=======

>>>>>>> 58bfcfc3978c55b17d60066167f28663d7a65a35
      var readSheetData=sheet_reader.readSheet(jwtClient, spreadsheetId, weekday);
      readSheetData.then(function(response){
        var eventList=[];
        var colTime, colEvent, colDescription;
        for(var columnNumber=0; columnNumber<response.data.values[0].length; columnNumber++){
          switch(response.data.values[0][columnNumber]){
            case 'Time':
              colTime=columnNumber;
              break;
            case 'Event':
              colEvent=columnNumber;
              break;
            case 'Description':
              colDescription=columnNumber;
              break;
            default:
          }
        };
        for(var rowNumber=1; rowNumber<response.data.values.length; rowNumber++){
          eventList[rowNumber-1]={};
          if (colTime!=undefined)eventList[rowNumber-1].Time=response.data.values[rowNumber][colTime];
          if (colEvent!=undefined)eventList[rowNumber-1].Event=response.data.values[rowNumber][colEvent];
          if (colDescription!=undefined)eventList[rowNumber-1].Description=response.data.values[rowNumber][colDescription];
        };
        resolve(eventList);
      });
    });
  }
  //Returns settings from a control spreadsheet
  static getControlSheetSettings(jwtClient, spreadsheetId){
    return new Promise(function(resolve, reject){
      var controlSheetSettings=[];
      controlSheetSettings.schedules=[];
      controlSheetSettings.calendars=[];
      var readSheetData=sheet_reader.readSheet(jwtClient, spreadsheetId, "CONTROL");
      readSheetData.then(function(response){
        //crash and burn if no values come back from sheet read
        if(response.data.values==undefined){reject();}
        for (var rowCounter=3; rowCounter<response.data.values.length; rowCounter++){
          if(response.data.values[rowCounter][1]){
            controlSheetSettings.schedules[response.data.values[rowCounter][1]]=response.data.values[rowCounter][0];
          }
          if(response.data.values[rowCounter][3]){
            controlSheetSettings.calendars[response.data.values[rowCounter][3]]=response.data.values[rowCounter][2];
          }
        }
        controlSheetSettings.curCal=response.data.values[1][2];
        controlSheetSettings.blankDaySchedule=response.data.values[1][3];
        resolve(controlSheetSettings);
      });
    });
  }
  //Returns the timestamp from a file in GoogleDrive, including spreadsheets, docs, etc
  static getModifiedTimestamp(jwtClient, spreadsheetId){
    return new Promise(function(resolve, reject){
      drive.files.get({
        auth: jwtClient,
        fileId: spreadsheetId,
        fields: "modifiedTime"
      },function(err, response){
        if(response){resolve(response.data.modifiedTime)}
        else if (err) {reject(err)}
      });
    });
  }
}
