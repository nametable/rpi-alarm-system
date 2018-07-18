#!/usr/bin/node
var GoogleSpreadsheet = require('google-spreadsheet');
var schedule = require('node-schedule');
var creds = require('./bellscheduler.json');
var bells = require('./bells.js');
var cmd=require('node-cmd');

// Create a document object using the ID of the spreadsheet - obtained from its URL.
var doc = new GoogleSpreadsheet('1B_a2jyFjPp3bM88imgewEcvyNyENBpgIqIXn18i2m_c');
var checksheetInterval = setInterval(checkGSheet, 5000);
var lastUpdate;
var curRows;
var curAlarms;
var curDay;

doc.useServiceAccountAuth(creds, function (err) {

});

function Alarm(time,description,event) {
            this.time=time;
            this.description=description;
            this.event=event;
            this.job=null;
}


//This function gets the sheets info and sees if the updated time has changed
//If connection problem exists, function breaks
function checkGSheet()
{
	doc.getInfo( function( err, sheet_info ){
	    //console.log( sheet_info.title + ' is loaded' );
		//console.log( 'Last modified ' + sheet_info.updated );
		if (sheet_info!= undefined) //see if info was received
    {
      var newUpdate = sheet_info.updated;
    }else {
      console.warn("warning: Connection problems :(");
      return;
    }
		if ((newUpdate != lastUpdate) || (new Date()).getDay() != curDay )
		{
			console.log("Sheet modified ...");
			curDay= (new Date()).getDay();
			doc.getRows((new Date()).getDay()+1, function (err, rows) {
				//console.log(rows);
				curRows=rows;
				console.log("There are " + curRows.length + " entries.");
				if (curRows[0].event == "103")
				{
					bells.startbuzz();
				}else {bells.endbuzz();}
				//console.log(curRows[0])
				processTimes();
				scheduleAlarms();
			});
		}
		lastUpdate = newUpdate;
	});
}

function processTimes()
{
	console.log("Processing Times ...");
  if(curRows[0].timecode==null){console.error("Error: gsheet problem -> can't get timecode");return;}
	var curDate = new Date();
	console.log(curDate + "#Cur");
	var d;
  if (curAlarms != null)toastAlarms();
  curAlarms=new Array();
	for (var i = 0; i < curRows.length; i++) {
		d = new Date(Date.now());
	    s = curRows[i].timecode;
	    parts = s.match(/(\d+)\:(\d+)\:(\d+)/);
      if (parts!=null)
      {
        if (parts[1]!=null)
        {
          hours = parseInt(parts[1]);
          minutes = parseInt(parts[2]);
          seconds = parseInt(parts[3]);
          d.setHours(hours);
          d.setMinutes(minutes);
          d.setSeconds(seconds);
          if (d.getTime() > curDate.getTime())
          {
            curAlarms.push(new Alarm(d,curRows[i].description, curRows[i].event ));
            console.log(d + "#" + curAlarms.length);
          }else {console.log(d + "has passed");}
        } else
        {console.warn("warning: Bad time." + s);}
      } else
      {
        console.warn("warning: No time or bad time...");
      }
		}
	console.log("message: Done Processing Times ...");
}
function toastAlarms() //remove the old alarms safely with jobs
{
	for (var i = 0; i < curAlarms.length; i++) {
		curAlarms[i].job.cancel();
		curAlarms[i].job=null;
	}
	curAlarms=null;
	schedule = null;
	schedule = new require('node-schedule');
	console.log("Old alarms toasted...");
}
function scheduleAlarms() //schedule the new alarms // curAlarms[i].time //new Date(Date.now() + 5000)
{
  if (curAlarms==undefined){console.error("Error: no defined alarms");return;}
	for (var i = 0; i < curAlarms.length; i++) {
		curAlarms[i].job=new schedule.scheduleJob(curAlarms[i].time, function(y){
		  console.log("Alarm: " + y.description + " @ " + y.time);
		  //console.log(y);
		  bells.ring();
		  cmd.run('mpg123 whistle.mp3; espeak "'+ y.description + 'The time is' + y.time + '"');
		}.bind(null,curAlarms[i]));
	}
	//console.log(curAlarms[0].time.getHours());
	//console.log(Date(Date.now() + 5000));
	//console.log(curAlarms[0].job);
	//console.log(curAlarms[0].job.nextInvocation());
	console.log("New alarms scheduled...");
}
