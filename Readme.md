# Raspberry Pi Alarm system
This software is a scheduling software written in nodejs using Google Sheets, Google Calendar, and Google Drive API. The purpose is to be able to schedule bells to ring between classes easily by creating weekly schedules in Google Sheets which are then selected based on Google Calendar Events. A Raspberry pi computer checks for changes and updates the schedule accordingly.

## Getting Started
You will need a google service account and private key
Make a new project - enable Google Sheets apis
Generate credentials and download json for your new Google Service account

https://console.developers.google.com
Some notes

http://isd-soft.com/tech_blog/accessing-google-apis-using-service-account-node-js/
