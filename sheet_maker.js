const {google} = require('googleapis');
var sheets = google.sheets('v4');
module.exports = class sheet_maker{
  static mk_control_sheet(jwtClient, options)
  {

    if (options.sheetId) //resets a sheet to the master_control_sheet
    {
        var fileId=options.sheetId;
    }
    else if (options.folderId) {
      sheets.spreadsheets.create({
        auth: jwtClient,
        resource: {
          title: "MasterControlSheet"
        }
      }, function (err, response){
        var fileId=response.fileId;
      });
    }
    //https://www.youtube.com/watch?v=86q5TMzvRqo
    var err1;
    var resp= new Promise(function(resolve, reject){
      sheets.spreadsheets.batchUpdate({
        auth:jwtClient,
        spreadsheetId: fileId,
        resource:{
          requests: [
            {
              "repeatCell": {
                "range": {
                    "sheetId": 0,
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
          }},{
            updateSheetProperties: {
              properties: {
                gridProperties: {
                  frozenRowCount: 1
                }
              },
              fields: "gridProperties.frozenRowCount"
            }}
            ,
            {
              "repeatCell": {
                "range": {
                  "sheetId": 0,
                  //"startRowIndex": 0,
                  //"endRowIndex": 10,
                  "startColumnIndex": 1,
                  "endColumnIndex": 2
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
            }
          ]
        }
      },
      function (err, response)
      {
        console.log(err);
        console.log(response);
        resolve(response);
      });
    });
    return resp;
  }
  mk_schedule_sheet(jwtClient, sheetId)
  {

  }
}
