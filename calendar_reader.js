/*
//  2018 Logan Bateman
//
//
*/
const {google} = require('googleapis');
var calendar = google.calendar('v3');

module.exports= class calendar_reader{
  static getEventsDuringDay(jwtClient, calendarId, date){
    return new Promise(function(resolve, reject){
      //(yesterday=new Date()).setDate((new Date()).getDate()-1);
      var resp;
      var minDate=new Date(date);
      var maxDate=new Date(date);
      minDate.setHours(0); minDate.setMinutes(0); minDate.setSeconds(0);
      maxDate.setHours(23); maxDate.setHours(59); maxDate.setSeconds(59);
      calendar.events.list({
         auth: jwtClient,
         calendarId: calendarId,
         maxResults:50,
         orderBy: "updated",
         timeMin: minDate.toISOString(),
         timeMax: maxDate.toISOString()
      }, function (err, response) {
         if (err) {
             reject(err);
         }
         if(response)resolve(response.data.items); //this would be the list of events
      });
    });
  }
}
