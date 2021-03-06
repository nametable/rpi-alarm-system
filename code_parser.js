
module.exports= class code_parser {
  static getId(identifier, control_settings){
    if((!identifier)|(!control_settings)){return null}
    if(identifier.indexOf("#")!=-1){
      return identifier.split("#")[1]
    }else if (identifier.indexOf("$")!=-1){
      var varname=identifier.split("$")[1]
      var scheduleId=control_settings.schedules[varname];
      var calendarId=control_settings.calendars[varname];
      if(scheduleId){return scheduleId};
      if(calendarId){return calendarId};
    }else{return identifier;}
  }
  static getScheduleFromCalendarEvents(calEventList, control_settings){
    var calEventsSplit=[];
    var highestVal=0;
    var highestIndex=0;
    for(var calEventCounter=0;calEventCounter< calEventList.length; calEventCounter++){
      if(calEventList[calEventCounter].description){ //Check to see if there is a description
        if(calEventList[calEventCounter].description.indexOf("#")!=-1){
          calEventsSplit[calEventCounter]=calEventList[calEventCounter].description.split("#");
          if (parseInt(calEventsSplit[calEventCounter][0])>=highestVal){
            highestVal=parseInt(calEventsSplit[calEventCounter][0]);
            highestIndex=calEventCounter;
          }
        }
        if(calEventList[calEventCounter].description.indexOf("$")!=-1){
          calEventsSplit[calEventCounter]=calEventList[calEventCounter].description.split("$");
          calEventsSplit[calEventCounter][1]=control_settings.schedules[calEventsSplit[calEventCounter][1]];
          if (parseInt(calEventsSplit[calEventCounter][0])>=highestVal){
            highestVal=parseInt(calEventsSplit[calEventCounter][0]);
            highestIndex=calEventCounter;
          }
        }
      }
    }
    if(calEventsSplit[highestIndex]==undefined){console.error("Bad calendar event list... no schedule found.");return null};
    if(calEventsSplit[highestIndex][1]==undefined){console.error("Bad calendar event list... no schedule found.");return null}else{if (!calEventsSplit[highestIndex][1]){return null;}}
    return this.getId(calEventsSplit[highestIndex][1],control_settings)
  }
}
