# Master Control Sheet

The master control sheet specifies the current calendar to use, schedule to use when there is nothing on the calendar for the current day, and the names to reference calendars and schedule spreadsheets. The Master Control Sheet's id must be placed in the software's config.json file.

## Schedule/Calendar Reference Syntax

A name or id can be used almost everywhere to reference a calendar or schedule spreadsheet. If referencing a schedule or calendar by name, a "$" symbol must be used. If If referencing a schedule or calendar by id, a "#" symbol must be used. Here is examples of each below.

```
$2018-2019Cal
#ukd69ks324no7cmaili3mnsbv0@group.calendar.google.com
$OddSchedule
#17pA75fVR6zIc0JaEoYS7J9jaRMZDiGoT13UK2OxQyzM/edit#
```
## Defining names for schedules and calendars

To give a schedule or calendar a name, just put the id in the id column and the name in the name/code column. Its that simple. For defining names, no "$" or "#" symbols are needed.

## Example

Below is an example of how to use the MasterControl sheet. Three schedules have names defined for them. These names can then be used in the calendar or for the blank day schedule. One calendar is being defined as "2018Cal". It can therefore be used as the current calendar by specifying "$2018Cal". "#ukd69ks324no7cmaili3mnsbv0@group.calendar.google.com" would have been the same calendar. On blank days the schedule with id "6wbz91fdjz4w9z6j3w654df1w31" is being used. This could have been specified as "$WOP" instead.

![Master Control Sheet Example](https://github.com/nametable/rpi-alarm-system/blob/master/docs/MasterControlExample.png)