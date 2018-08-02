const {google} = require('googleapis');
const sheet_reader= require('./sheet_reader.js');
const dow_list=[
  "SUN","MON","TUE","WED","THU","FRI","SAT"
];

var sheets = google.sheets('v4');
module.exports = class sheet_maker{
  static mk_schedule_spreadsheet(jwtClient, options)
  {
    var schedulecsv;
    var resp= new Promise(function(resolve, reject){
      fs.readFile('emptyschedule.csv', 'ascii', function(err, data){
        schedulecsv=data;
        var delSheets;
        if (options.spreadsheetId) //resets a sheet to the master_control_sheet
        {
            var spreadsheetId=options.spreadsheetId;
            delSheets=sheet_maker.del_sheets_from_spreadsheet(jwtClient, spreadsheetId);
        }
        else if (options.folderId) {
          sheets.spreadsheets.create({
            auth: jwtClient,
            resource: {
              title: "MasterControlSheet"
            }
          }, function (err, response){
            var spreadsheetId=response.fileId;
          });
        }
        //https://www.youtube.com/watch?v=86q5TMzvRqo
        //Do this when sheets have been deleted
        delSheets.then(function(response){
          console.log("Old sheets deleted.");
          var readSpreadsheet= sheet_reader.readSheet(jwtClient, spreadsheetId);
          //Procede with this once spreadsheet is read
          readSpreadsheet.then(function(response){
            var spreadsheet=response;
            var err1;
            //console.log("First sheet");
            //console.log(spreadsheet.data.sheets[0].properties.sheetId);//
            var requests= [];
            var requestCounter=0;
            for (var sheetCounter=0; sheetCounter<7; sheetCounter++){
              //add a sheet
              requests[requestCounter++]={
                "addSheet":
                {
                  "properties":{
                    sheetId: sheetCounter,
                    index: sheetCounter,
                    title: dow_list[sheetCounter]
                  }
                }
              };
              //add data to sheet
              requests[requestCounter++]={
                "pasteData": {
                  "coordinate": {
                    "sheetId":sheetCounter,
                    "rowIndex":0,
                    "columnIndex":0
                  },
                  "data": schedulecsv,
                  "type": "PASTE_NORMAL",

                  // Union field kind can be only one of the following:
                  "delimiter": ','
                  //"html": false
                  // End of list of possible types for union field kind.
                }
              };
              //Bold the top row
              requests[requestCounter++]={
                "repeatCell": {
                  "range": {
                      "sheetId": sheetCounter,
                      "startRowIndex": 0,
                      "endRowIndex": 1
                  },
                  "cell": {
                      "userEnteredFormat": {
                          "textFormat": {
                              "bold": true
                          }
                      }
                  },
                  "fields": "userEnteredFormat.textFormat.bold"
                }
              };
              //Freeze top row
              requests[requestCounter++]={
                updateSheetProperties: {
                  properties: {
                    "sheetId": sheetCounter,
                    "title":"NUM0",
                    gridProperties: {
                      frozenRowCount: 1
                    }
                  },
                  fields: "(gridProperties.frozenRowCount)"
                }
              };
              //Set column to be in time format hh:mm:ss
              requests[requestCounter++]={
                "repeatCell": {
                  "range": {
                    "sheetId": sheetCounter,
                    //"startRowIndex": 0,
                    //"endRowIndex": 10,
                    "startColumnIndex": 0,
                    "endColumnIndex": 1
                  },
                  "cell": {
                    "userEnteredFormat": {
                      "numberFormat": {
                        "type": "TIME",
                        "pattern": "hh:mm:ss"
                      }
                    }
                  },
                  "fields": "userEnteredFormat.numberFormat"
                }
              };
            }
            requests[requestCounter++]= {
              "deleteSheet":{
                "sheetId": spreadsheet.data.sheets[0].properties.sheetId
              }
            }
            console.log(requests);
            sheets.spreadsheets.batchUpdate({
              auth:jwtClient,
              spreadsheetId: spreadsheetId,
              resource:{
                "requests": requests
              }
            },
            function (err, response)
            {
              console.log(err);
              //console.log(response);
              resolve(response);
            });
          });
        });
      });
    });
    return resp;
  }
  mk_control_spreadsheet(jwtClient, sheetId)
  {

  }
  static del_sheets_from_spreadsheet(jwtClient, spreadsheetId)
  {
    var resp= new Promise(function(resolve, reject){
      var spreadsheet;
      var readSpreadsheet= sheet_reader.readSheet(jwtClient, spreadsheetId);
      readSpreadsheet.then(function(response){
        spreadsheet=response;
        console.log("Current sheet data\n");
        console.log(spreadsheet.data.sheets);
        var requestCounter=0;
        var requests= [];
        //Add a request to make a new sheet
        requests[requestCounter]=
        {
          "addSheet":
          {
            "properties":{
              index: 0
            }
          }
        };
        requestCounter++;
        //Add delete sheet requests for every sheet
        spreadsheet.data.sheets.forEach(sheet => {
          //console.log("Delete sheet " + sheet.properties.sheetId.toString() );
          requests[requestCounter]= {
            "deleteSheet":{
              "sheetId": sheet.properties.sheetId
            }
          };
          //requests[requestCounter].deleteSheet.sheetId=sheet.properties.sheetId;
          requestCounter++;
        });

        sheets.spreadsheets.batchUpdate({
          auth:jwtClient,
          spreadsheetId: spreadsheetId,
          resource:{
            "requests": requests
          }
        },
        function (err, response)
        {
          console.log(err);
          //console.log(response);
          resolve(requests);
          if (response)
            {resolve(response);}
          else
            {resolve(err);}
        });
      });
    });
    return resp;
  }
}
