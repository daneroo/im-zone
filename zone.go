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
	var rect = image.Rect(0, 0, 640, 320)
	img := image.NewRGBA(rect)
	render(img)
	writePng("black.png", img)
}

func render(img *image.RGBA) {
	rect := img.Bounds()
	s := rect.Size()
	cx := s.X / 2
	cy := s.Y / 2

	t := 15.0
	period := 30.0 * 2.0
	for j := rect.Min.Y; j < rect.Max.Y; j++ {
		y := float64(j-cy) / float64(s.Y)
		for i := rect.Min.X; i < rect.Max.X; i++ {
			x := float64(i-cx) / float64(s.X)
			phi := float64(period*x*t + float64(s.Y)*y*y) //* 2 * math.PI
			// ima.bitmap[j][i] =  (pixel) (sin(phi)*126.+127.);
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
