const {google} = require('googleapis');
var sheets = google.sheets('v4');

exports.mk_control_sheet=function(jwtClient, options)
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
  var resp;
  sheets.spreadsheets.batchUpdate({
    auth:jwtClient,
    spreadsheetId: fileId,
    resource:{
      requests: [{
        updateSheetProperties: {
          properties: {
            gridProperties: {
              frozenRowCount: 1
            }
          },
          fields: "gridProperties.frozenRowCount"
        }},
        {repeatCell:{
          range: {
            endRowIndex:0,
          },
          cell: {
            userEnteredFormat:{
              textFormat:{
                bold:true
              }
            }
          },
          fields: "userEnteredFormat.textFormat.bold"
        }},
        {repeatCell:{
          range:{
            startRowIndex:1,
            endColumnIndex:0
          },
          cell:{
            userEnteredFormat:{
              numberFormat:{
                type: "TIME",
                pattern: "hh+:mm:ss"
              }
            }
          },
          fields: "userEnteredFormat.numberFormat"
        }}
      ]
    }
  },
  function (err, response)
  {
    console.log(err);
    console.log(response);
    resp=response;
  });
  return resp;
}

exports.mk_schedule_sheet=function(jwtClient, sheetId)
{

}
