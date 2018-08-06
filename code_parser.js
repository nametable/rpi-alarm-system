
module.exports= code_parser {
  static getId(identifier, control_settings){
    if(identifier.indexOf("#")!=-1){
      return identifier.split("#")[1]
    }else if (identifier.indexOf("$")!=-1){
      var varname=identifier.split("$")[1]
      scheduleId=control_settings.schedules[varname];
      calendarId=control_settings.calendars[varname];
      if(scheduleId){return scheduleId};
      if(calendarId){return calendarId};
    }else{return undefined;}
  }
  static getScheduleFromCalendarEvents(calEventList, control_settings){
    var calEventsSplit[];
    var highestVal=0;
    var highestIndex=0;
    for(var calEventCounter=0;calEventCounter< calEventCounter.length; calEventCounter++){
      if(calEventList[calEventCounter].description.indexOf("#")!=-1){
        calEventsSplit[calEventCounter]=calEventList[calEventCounter].description.split("#");
        if (parseInt(calEventsSplit[calEventCounter][0])>=highestVal){
          highestVal=parseInt(calEventsSplit[calEventCounter][0];
          highestIndex=calEventCounter;
        }
      }
      if(calEventList[calEventCounter].description.indexOf("$")!=-1){
        calEventsSplit[calEventCounter]=calEventList[calEventCounter].description.split("$");
        calEventsSplit[calEventCounter][1]=control_settings.calendars[calEventsSplit[calEventCounter][1]];
        if (parseInt(calEventsSplit[calEventCounter][0])>=highestVal){
          highestVal=parseInt(calEventsSplit[calEventCounter][0];
          highestIndex=calEventCounter;
        }
      }
    }
  }
}
