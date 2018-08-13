# Schedules
Schedules can be made by uploading and modifying the template schedule found the templates folder. A schedule has 7 sheets, 1 for each day of the week. Inside each of the sheets are three columns, Time, Event, and Description. Only the Time and [Event](./event_format.md) truly matter - the Description is for your the user. The time can be in almost any format(5pm, 3:00am, 17:24:36). The event for the most part is a verb, an "@", and parameter(s). Like this -> ```ringBells@2,3,4```. Here is a sample in the figure below.

![Schedule Example](https://github.com/nametable/rpi-alarm-system/blob/master/docs/scheduleExample.png)

Specific synax of events can be found in the [Event Format](./event_format.md) document.

## Schedule gsheet id

You can find your schedules' ids in the url of a loaded sheet - example in figure below.

![Sheet Id](https://github.com/nametable/rpi-alarm-system/blob/master/docs/spreadsheetId.png)