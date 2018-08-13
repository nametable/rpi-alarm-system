# Hardware and software setup

## Materials
- Raspberry pi 3 (a 2 might work)
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

1. Run the following script by pasting this into a terminal
```
bash <(curl -s https://raw.githubusercontent.com/nametable/rpi-alarm-system/master/setupscripts/install.sh)
```
2. Create a Project at https://console.cloud.google.com
3. Create a Google Service account @  https://console.cloud.google.com/iam-admin/serviceaccounts
4. Create and download a service account key to use on the pi - don't lose this @ https://console.cloud.google.com/apis/credentials
.. Copy service account key to the program's folder as **serviceaccountkey.json**
5. Create a **config.json** file in the program's folder using config.json.sample. In this file you can set the refresh time interval, master control gsheet id, and backup schedule gsheet id.
6. Make schedules by uploading the template sheet TemplateSchedule.xlsx and converting to Google Sheets.
7. Make master control by uploading the template sheet TemplateMasterControl.xlsx and converting to Google Sheet.
8. Configure your sheets and master control with info here -> {insert url}
9. Make a new Google Calendar for scheduling
10. Share all sheets and the calendar with your Google Service account - you should put your sheets in one folder so that the whole folder can be shared.
11. Run "pm2 start rpi-alarm-system" to start the software.
12. Wire the pi using the diagram and instructions [here](./wiring.md).
13. Create a github issue at https://github.com/nametable/rpi-alarm-system if you have problems, find bugs, or have improvement suggestions.