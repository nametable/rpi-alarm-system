# Frequently Asked Questions

## Where can I ask questions that aren't answered here?
Create a github issue at https://github.com/nametable/rpi-alarm-system/issues/new . This will allow for someone to see the issue and fix documentation and answer questions/ help resolve problems. If it is software related, share the output of ```pm2 log``` to help make more sense of the issue?

## Why does my raspberry pi only produce noise when I plug in to the audio jack?
The issue is probably a power issue. Cheap 5v power supplies can cause the audio to be bad on Raspberry Pis.

## Why is the raspberry pi not doing anying?
There could be multiple reasons. Try running the following on the pi to troubleshoot.
```
pm2 status
pm2 logs
```
Does the status show that the program has been restarting or isn't running at all?
Do the logs show red errors? This could indicate a bug in the program, bad internet connection, or something else.

## My relay isn't working. What should I do?

The software is programmed to use BCM 2 (physical pin 3) for turning a connected relay on and off. Make sure proper power is provided. Test with an arduino and with a pi using the "gpio" command (may need to be installed). There could be problems when using 5 volt power with a 3 volt gpio pin, depending on your relay.

## How long does it take for schedule changes to take effect?

Currently it takes between 0-5 minutes for the software to know that a Spreadsheet has changed. This is due to a limitation in the Google Drive API. This could be fixed to be much faster in the future. If you need an immediate schedule reload you can restart the software with ```pm2 restart rpi-alarm system``` or ```pm2 restart 0```.

## What happens if my Pi/Computer loses internet connection?

If your Raspberry Pi or Computer loses internet connectivity, the currently loaded schedule will continue to be used. If there is no connection to begin with, no schedule will be loaded, and the pi/computer will do nothing. This could be fixed in the future by having local caching of the calendar/schedules.

## How can I install updates to rpi-alarm-system?

You can update the software that you have on your pi(or any computer for that matter) by running ```git pull``` inside the software's directory. This will download new changes. For those to take effect, restart the software with ```pm2 restart rpi-alarm-system``` or ```pm2 restart 0```.

## Why can't the software do xyz?

Well, if it can't do x, y, or z then I haven't implemented it yet. If you want you can contribute to the project by forking it and making some fixes/improvements.
