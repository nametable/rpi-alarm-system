# Frequently Asked Questions

## Where can I ask questions that aren't answered here?
Create a github issue at https://github.com/nametable/rpi-alarm-system/issues/new . This will allow for someone to see the issue and fix documentation and answer questions/ help resolve problems.

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