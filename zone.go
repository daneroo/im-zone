package main

import (
	"fmt"
	"image"
	"image/png"
	"log"
	"os"
)

func main() {
	fmt.Println("Hello Zone")
	var markRect = image.Rect(0, 0, 64, 128)
	// m := image.NewRGBA(markRect)
	m := image.NewRGBA(markRect)
	// m.Set(x, y, color)
	writePng("black.png", m)
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
