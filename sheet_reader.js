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
        var eventList;
        var colTime, colEvent, colDescription;
        for(var columnNumber; columnNumber<response.data.values[0].length; columnNumber++){
          switch(response.data.values[0][columnNumber]){
            case "Time":
              colTime=columnNumber;
              break;
            case "Event":
              colEvent=columnNumber;
              break;
            case "Description":
              colDescription=columnNumber;
              break;
            default:
          }
        };
        for(var rowNumber=1; rowNumber<response.data.values.length; rowNumber++){

        };
        resolve(eventList);
      });
    });
  }
}
