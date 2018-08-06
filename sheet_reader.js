/*
//  2018 Logan Bateman
//  sheet_reader: a class which contains functions for reading a Google Spreadsheet
//
//
*/

const {google} = require('googleapis');
const constants = require('./constants.js');
var sheets = google.sheets('v4');
module.exports = class sheet_reader{
  static readSpreadsheet(jwtClient, sheetId)
  {
    var resp=new Promise(function(resolve, reject){
      sheets.spreadsheets.get({
        spreadsheetId: sheetId,
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
      console.log(constants.dow_list);
      var weekday=constants.dow_list[date.getDay()];
      console.log("Today is " + weekday);

      var readSheetData=sheet_reader.readSheet(jwtClient, spreadsheetId, weekday);
      readSheetData.then(function(response){
        var eventList=[];
        var colTime, colEvent, colDescription;
        for(var columnNumber=0; columnNumber<response.data.values[0].length; columnNumber++){
          switch(response.data.values[0][columnNumber]){
            case 'Time':
              colTime=columnNumber;
              console.log("There was a time");
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
        console.log(response.data.values);
        console.log(colTime);
        console.log(colEvent);
        console.log(colDescription);
        console.log("Columns: " + colTime.toString() + colEvent.toString() + colDescription.toString());
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
}
