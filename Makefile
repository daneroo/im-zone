
all: clean run convert
	@echo done

play:
	ffplay -loop 0 zone.mp4

run:
	go run zone.go -vxt

convert:
	# ffmpeg -loop 1 -i images/zone-%03d.png -preset slow -crf 22 -t 10 zone.mp4
	# ffmpeg -i images/zone-%03d.png -preset slow -crf 0 zone.mp4
	docker run -v `pwd`/images:/images jrottenberg/ffmpeg \
		-i /images/zone-%03d.png \
		-preset slow -crf 0 -stats \
		/images/zone.mp4
	mv images/zone.mp4 ./zone.mp4

clean:
	rm -f zone.mp4 images/zone-*png images/zone.mp4 images/zone.gif
