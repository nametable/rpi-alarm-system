const {google} = require('googleapis');

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
        resolve(response);
      });
    });
    return resp;
  }
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
}
