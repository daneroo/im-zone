
all: mp4
	@echo done

play:
	ffplay -loop 0 zone.mp4

run:
	go run zone.go -vxt

mp4: clean run
	# ffmpeg -loop 1 -i images/zone-%03d.png -preset slow -crf 22 -t 10 zone.mp4
	# ffmpeg -i images/zone-%03d.png -preset slow -crf 0 zone.mp4
	docker run  --rm -it -v `pwd`/images:/images \
		  jrottenberg/ffmpeg \
		  -i /images/zone-%03d.png \
		  -preset slow -crf 0 -stats \
		  /images/zone.mp4
	mv images/zone.mp4 ./

# -delay 2 => 100/2 = 50 FPS
gif: clean run
	docker run  --rm -it -v `pwd`/images:/images \
    v4tech/imagemagick \
	  convert  -delay 2 /images/zone-*png -loop 0 /images/zone.gif
	mv images/zone.gif ./

clean:
	rm -f zone.mp4 images/zone-*png images/zone.mp4 images/zone.gif
