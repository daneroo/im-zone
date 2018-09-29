# Zone plate generation

## Operating
```
make all play
```
## Gif
```
docker run -v $(pwd)/images:/images --rm -it v4tech/imagemagick convert  -delay 1 /images/zone-*png -loop 0 /images/zone.gif

docker run -v $(pwd)/images:/images --rm -it v4tech/imagemagick identify /images/zone.gif
open zone-*png
```

## ffmpeg on OSX (with all options) to get drawtext!
See [this gist](https://gist.github.com/Piasy/b5dfd5c048eb69d1b91719988c0325d8) for homebrew magic to install ffmpeg with *all* options
```
brew install ffmpeg $(brew options ffmpeg | grep -vE '\s' | grep -- '--with-' | tr '\n' ' ')
```

### ffmpeg with drawtext
This works on MacOS
```
ffmpeg -i data/video.mp4 -vf drawtext="fontfile=./assets/NotoSans-Bold.ttf: text='Stack Overflow': fontcolor=white: fontsize=24: box=1: boxcolor=black@0.5: boxborderw=5: x=(w-text_w)/2: y=(h-text_h)/2" -codec:a copy output.mp4

## References
- CRC Code: `/archive/personal/CRC/CRC-daniel-2001-12-06.tar`
  - `Code/zone/zone.cc` and `makefile`
- [FFmpeg quality](https://trac.ffmpeg.org/wiki/Encode/H.264)