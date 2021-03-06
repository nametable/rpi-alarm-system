# Hardware and Software Setup

## Materials
- Raspberry Pi 3 (a 2 might work)
- Relay
- Dupont connectors

## Software
- nodejs
- npm
- pm2
- git
- vlc
- espeak

## Instructions

1. Run the following script by pasting this into a terminal/ssh client (Network + SSH setup can be found [here]( https://www.raspberrypi.org/documentation/remote-access/ssh/))
```
bash <(curl -s https://raw.githubusercontent.com/nametable/rpi-alarm-system/master/setupscripts/install.sh)
```
2. Create a Project at [https://console.cloud.google.com](https://console.cloud.google.com) called rpi-alarm-system or something else meaningful to you.
3. Create a Google Service account at [https://console.cloud.google.com/iam-admin/serviceaccounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
4. Create and download a service account key to use on the pi - don't lose this - [https://console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
.. Copy service account key to the rpi-alarm-system's folder as **serviceaccountkey.json**
5. Create a **config.json** file in the rpi-alarm-system's folder using config.json.sample. In this file you can set the refresh time interval, master control gsheet id, and backup schedule gsheet id.
6. Make [schedules](./schedules.md) by uploading the template sheet TemplateSchedule.xlsx and converting to Google Sheets.
7. Make [mastercontrol](./master_control.md) by uploading the template sheet TemplateMasterControl.xlsx and converting to Google Sheet.
8. Configure your sheets and master control with info here -> [Schedules](./schedules.md) - [Master Control](./mastercontrol.md)
9. Make a new [Google Calendar](./calendars.md) for scheduling
10. Share all sheets and the calendar with your Google Service account - you should put your sheets in one folder so that the whole folder can be shared.
11. Wire the pi using the diagram and instructions [here](./wiring.md).
12. Run "pm2 start rpi-alarm-system" to start the software.
13. Run "pm2 startup" and copy and paste the output command to let pm2 autostart rpi-alarm-system when the computer boots
14. Create a github issue at [https://github.com/nametable/rpi-alarm-system/issues](https://github.com/nametable/rpi-alarm-system/issues) if you have problems, find bugs, or have improvement suggestions.

## Additional Help can be found at these pages: ##
- [MasterControlSheets](./mastercontrol.md)
- [Schedules](./schedules.md)
- [Calendars](./calendars.md)
- [FAQ](./faq.md)
