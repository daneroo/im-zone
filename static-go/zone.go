package main

import (
	"flag"
	"fmt"
	"image"
	"image/color"
	"image/jpeg"
	"image/png"
	"log"
	"math"
	"os"
	"time"
)

var (
	wFlag      = flag.Int("W", 640, "width of images")
	hFlag      = flag.Int("H", 480, "height of images")
	framesFlag = flag.Int("n", 60, "number of frames")
	jpegFlag   = flag.Bool("jpeg", false, "use .jpg instead oof .png")
	vxtFlag    = flag.Bool("vxt", false, "x*t+y^2 (default)")
	vhFlag     = flag.Bool("vh", false, "x^2+y^2 zone")
	hytFlag    = flag.Bool("hyt", false, "y*t+x^2")
	tFlag      = flag.Bool("t", false, "t*t")
)

func main() {
	flag.Parse()

	phi := vxt // default
	if *vxtFlag {
		phi = vxt
	}
	if *vhFlag {
		phi = vh
	}
	if *hytFlag {
		phi = hyt
	}
	if *tFlag {
		phi = t
	}

	// fmt.Println("Hello Zone")

	var rect = image.Rect(0, 0, *wFlag, *hFlag)

	img := image.NewRGBA(rect)
	frames := *framesFlag
	for t := 0; t < frames; t++ {
		t01 := (float64(t)/float64(frames) - .5)

		start := time.Now()
		render(img, t01, frames, phi)
		log.Printf("Render %d x %d took %s", *wFlag, *hFlag, time.Since(start))
		if *jpegFlag {
			writePng(fmt.Sprintf("./images/zone-%03d.jpg", t), img)

		} else {
			writePng(fmt.Sprintf("./images/zone-%03d.png", t), img)
		}
	}
}

// phi functions
func vh(s image.Point, frames int, x, y, t float64) float64 {
	return (float64(s.X)*x*x + float64(s.Y)*y*y + t*float64(frames/15)) * math.Pi
}
func vxt(s image.Point, frames int, x, y, t float64) float64 {
	return (float64(frames)*x*t + float64(s.Y)*y*y) * math.Pi
}
func hyt(s image.Point, frames int, x, y, t float64) float64 {
	return (float64(frames)*y*t + float64(s.X)*x*x) * math.Pi
}
func t(s image.Point, frames int, x, y, t float64) float64 {
	return (float64(frames) * t * t) * math.Pi
}

func render(img *image.RGBA, t float64, frames int, phiFunc func(s image.Point, frames int, x, y, t float64) float64) {
	rect := img.Bounds()
	s := rect.Size()
	cx := s.X / 2
	cy := s.Y / 2

	for j := rect.Min.Y; j < rect.Max.Y; j++ {
		y := float64(j-cy) / float64(s.Y)
		for i := rect.Min.X; i < rect.Max.X; i++ {
			x := float64(i-cx) / float64(s.X)

			phi := phiFunc(s, frames, x, y, t)

			c := uint8(math.Sin(phi)*126.0 + 127.0)
			clr := color.RGBA{c, c, c, 255}
			img.Set(i, j, clr)
		}
	}

}

func writeJpeg(filename string, img image.Image) {
	file, err := os.Create(filename)
	if err != nil {
		log.Fatal(err)
	}
	err = jpeg.Encode(file, img, nil)
	if err != nil {
		log.Fatal(err)
	}
	file.Close()
}

func writePng(filename string, img image.Image) {
	file, err := os.Create(filename)
	if err != nil {
		log.Fatal(err)
	}
	err = png.Encode(file, img)
	if err != nil {
		log.Fatal(err)
	}
	file.Close()
}

func readPng(filename string) image.Image {
	r, err := os.Open(filename)
	if err != nil {
		log.Fatal(err)
	}
	img, err := png.Decode(r)
	if err != nil {
		log.Fatal(err)
	}
	return img
}
