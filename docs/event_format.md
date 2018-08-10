# Event Format

The event format is like saying an action and then providing parameters after it.
```
[Command]@[Params]
```
There are several types of commands/actions that may be used.

## ringBells
```
ringBells@[seconds],[seconds],[seconds],[...]
```
The following example will ring for 1.5 seconds, stop for 2 seconds, ring for 6.7 seconds, stop for .4 seconds, ring for 5 seconds. This assumes a relay is connected to the Pi on BCM pin 2.
```
ringBells@1.5,2,6.7,.4,5
```
## eSpeak
```
eSpeak@[message] - note message can contain $time which will be replaced with the current time
```
The following example will speak the text while replacing $time with an am/pm time such as 2:35pm
```
eSpeak@The current time is $time. Have a good day.
```
## playAudioFile
```
playAudioFile@[filename] - plays files within directory ~/Music/
```
The following example will play themorningannouncement.mp3 found at ~/Music/themorningannouncement
```
playAudioFile@themorningannouncement.mp3
```
## playYoutube
```
playYoutube@[url]
```
The following will play the audio from https://www.youtube.com/watch?v=4wNpOeakhEM. There could be a delay before it starts playing depending on network speed.
```
playYoutube@https://www.youtube.com/watch?v=4wNpOeakhEM
```
## stopAudio
```
stopAudio@[doesn't matter]
```
The following will kill all instances of vlc. Vlc is used for playing audio files and youtube audio. There are no parameters.
```
stopAudio@xyznothing
```
## setVolume
```
setVolume@[percentage]
```
The following will set the Pi's volume to 50%
```
setVolume@50%
```
## combo
```
combo@[event]^[event]^...
```
This one is a bit more interesting to look at. Basically it separates events by the '^' delimeter and runs them all asynchronously. The volume change, espeak, wav audio, and youtube audio would all happen at the same time.
```
combo@setVolume@50%^eSpeak@This is a test^playAudioFile@test.wav^playYoutube@https://www.youtube.com/watch?v=-Q1kB0R4Ijs
```
