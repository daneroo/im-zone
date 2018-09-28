# Zone plate generation

## Dev
```

mkdir images
rm images/zone-*png; go run zone.go
docker run -v $(pwd)/images:/images --rm -it v4tech/imagemagick convert  -delay 1 /images/zone-*png -loop 0 /images/zone.gif
#

docker run -v $(pwd)/images:/images --rm -it v4tech/imagemagick identify /images/zone.gif
open zone-*png

```


## References
- CRC Code: `/archive/personal/CRC/CRC-daniel-2001-12-06.tar`
  - `Code/zone/zone.cc` and `makefile`