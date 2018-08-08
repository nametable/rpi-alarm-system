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
      var minDate=Date.today().at("12:00am");
      var maxDate=Date.today().at("11:59pm");
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
