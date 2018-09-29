package main

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	"log"
	"math"
	"os"
)

func main() {
	fmt.Println("Hello Zone")
	var rect = image.Rect(0, 0, 640, 480)

	// var rect = image.Rect(0, 0, 1920, 1080)
	// var rect = image.Rect(0, 0, 1280, 720)
	// var rect = image.Rect(0, 0, 256, 256)
	img := image.NewRGBA(rect)
	frames := 120
	for t := 0; t < frames; t++ {
		t01 := (float64(t)/float64(frames) - .5)
		render(img, t01, frames)
		writePng(fmt.Sprintf("./images/zone-%03d.png", t), img)

	}
}

func render(img *image.RGBA, t float64, frames int) {
	rect := img.Bounds()
	s := rect.Size()
	cx := s.X / 2
	cy := s.Y / 2

	for j := rect.Min.Y; j < rect.Max.Y; j++ {
		y := float64(j-cy) / float64(s.Y)
		for i := rect.Min.X; i < rect.Max.X; i++ {
			x := float64(i-cx) / float64(s.X)

			// vh
			// phi := (float64(s.X)*x*x + float64(s.Y)*y*y) * math.Pi

			// vxt
			phi := (float64(frames)*x*t + float64(s.Y)*y*y) * math.Pi

			// t
			// phi := (float64(frames) * t * t) * math.Pi

			// ht
			// phi := (float64(frames)*y*t + float64(s.X)*x*x) * math.Pi

			c := uint8(math.Sin(phi)*126.0 + 127.0)
			clr := color.RGBA{c, c, c, 255}
			img.Set(i, j, clr)
		}
	}

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
