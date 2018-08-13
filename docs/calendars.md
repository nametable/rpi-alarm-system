# Calendars

A Google Calendar can be used to schedule when weekly schedules (Google Sheets) will be used. To schedule a schedule to be used add a new event, specify the timeframe, and put some code into the description like this
```
0$RegularSchedule
```
This would signify that during the dates specified, the Google Sheet schedule represented by "RegularSchedule" in the MasterControl sheet would be used if no other Google Calendar overlaps. The number before the $ symbol specifies priority (greater meaning more priority).

## Syntax

``
[priority number][$ or #][name or google sheet id]
EX1 - by name
2$HalfDayA
EX2 - by id
1#11EDYwgZH5qx9sybk0V0RAC9CSkXvzvYhy0HBTZ8IxdA
``

## Examples
The following event specifies schedule by name and has a priority of 0.

![Calendar Event with Schedule referenced by Variable](https://github.com/nametable/rpi-alarm-system/blob/master/docs/variable_cal_event.png)

The following event specifies schedule by id and has a priority of 1.

![Calendar Event with Schedule referenced by ID](https://github.com/nametable/rpi-alarm-system/blob/master/docs/id_cal_event.png)

In the following figure, the event called "Override" takes precedence on the 8th and 9th since it has a higher priority value. 1 > 0

![Calendar Events with Overlap](https://github.com/nametable/rpi-alarm-system/blob/master/docs/cal_events.png)