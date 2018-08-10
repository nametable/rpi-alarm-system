# Event Format

The event format is like saying an action and then providing parameters after it.
```
[Command]@[Params]
```
There are several types of commands/actions that may be used.
```
ringBells

ringBells@[seconds],[seconds],[seconds],[...]
Example
ringBells@1.5,2,6.7,.4,5
Ring for 1.5 seconds, stop for 2 seconds, ring for 6.7 seconds, stop for .4 seconds, ring for 5 seconds

eSpeak

eSpeak@[message]     --- note message can contain $time which will be replaced with the current time
Example
eSpeak@The current time is $time. Have a good day.

playAudioFile

playAudioFile@[filename]     --- plays files within directory ~/Music/
Example
playAudioFile@themorningannouncement.mp3

playYoutube

playYoutube@[url]
Example
playYoutube@https://www.youtube.com/watch?v=4wNpOeakhEM

stopAudio

stopAudio@[doesn't matter]
Example
stopAudio@xyznothing
This will run "killall vlc" which closes any running youtube or mp3 audio

setVolume

setVolume@[percentage]
Example
setVolume@50%

combo

combo@[event]^[event]^...
Example
combo@setVolume@50%^eSpeak@This is a test^playAudioFile@test.wav^playYoutube@https://www.youtube.com/watch?v=-Q1kB0R4Ijs
This will currently start doing all three events at the same time
```