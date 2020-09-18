// +build js

package main

import (
	"fmt"
	"math"
	"syscall/js"
)

func main() {
	// z := zone{}
	// z.start()
	fmt.Println("Hello JS")

	// could return a func through a callback?
	//  can I pass args to main?
	js.Global().Set("HelloGo", js.FuncOf(Hello))
	js.Global().Set("DrawGo", js.FuncOf(Draw))

	// wait forever, to prevent exiting runtime
	done := make(chan struct{}, 0)
	<-done
}

func Hello(this js.Value, inputs []js.Value) interface{} {
	message := inputs[0].String()
	fmt.Printf("Hello %s\n", message)
	return nil
}

var singleZ *zone = nil

func Draw(this js.Value, inputs []js.Value) interface{} {
	ctx := inputs[0]
	width := inputs[1].Int()
	height := inputs[2].Int()
	frames := inputs[3].Int()
	t := inputs[4].Float()
	cx2 := inputs[5].Float()
	cy2 := inputs[6].Float()
	cxt := inputs[7].Float()
	cyt := inputs[8].Float()
	ct := inputs[9].Float()
	// gopherBlue := "rgb(1, 173, 216)"

	if singleZ == nil || width != singleZ.width || height != singleZ.height {
		singleZ = NewZone(ctx, width, height)
	}
	singleZ.RenderAndPutImage(frames, t, cx2, cy2, cxt, cyt, ct)

	return nil
}

type zone struct {
	ctx js.Value

	width  int
	height int

	Q   int
	cos []byte

	bitmap  []byte
	imgData js.Value
	data    js.Value
}

func NewZone(ctx js.Value, width, height int) *zone {
	z := new(zone)
	z.ctx = ctx
	z.width = width
	z.height = height

	z.bitmap = make([]byte, int(width*height)*4)
	for i := range z.bitmap {
		z.bitmap[i] = 255
	}
	z.imgData = z.ctx.Call("getImageData", 0, 0, z.width, z.height)
	z.data = z.imgData.Get("data")

	return z
}

func (z *zone) RenderAndPutImage(frames int, t, cx2, cy2, cxt, cyt, ct float64) {
	// perform actual rendering into bitmap
	singleZ.render(frames, t, cx2, cy2, cxt, cyt, ct)

	// Copy bitmap to data (which backs imgData)
	js.CopyBytesToJS(z.data, z.bitmap) // 160µs @720x480

	// copy imgData back to canvas
	z.ctx.Call("putImageData", z.imgData, 0, 0) // 360µs @720x480

}
func (z *zone) render(frames int, t, cx2, cy2, cxt, cyt, ct float64) {
	cx := float64(z.width / 2)
	cy := float64(z.height / 2)

	F := float64(frames)
	H := float64(z.height)
	W := float64(z.width)

	// originally: x=(i/W), y=(j/H)
	// phi = cx2 * x^2*W + cy2*y^2*H + cxt*x*t*F*F/2 + cyt*y*t*F*F/2 + ct*t*F

	index := 0
	ctt := ct * F * t

	for j := -cy; j < cy; j++ {
		cy2y2 := cy2 * j * j / H
		cytyt := cyt * (j / H) * (t * F * F / 2)
		cy2y2cytytctt := cy2y2 + cytyt + ctt

		for i := -cx; i < cx; i++ {
			phi := cy2y2cytytctt
			if cx2 != 0.0 {
				phi += cx2 * i * i / W
			}
			if cxt != 0 {
				phi += cxt * (i / W) * (t * F * F / 2)
			}
			phi *= math.Pi

			// This is without any common expression elimination (~20% slower)
			// phi := ct * F * t
			// phi += cy2 * j * j / H
			// phi += cyt * j / H * t * F * F / 2
			// phi += cx2 * i * i / W
			// phi += cxt * i / W * t * F * F / 2
			// phi *= math.Pi

			// c := uint8(math.Cos(phi)*126.0 + 127.0)
			// Lookup - faster than inlining Cos() code
			c := Cos(phi)

			z.bitmap[index+0] = c
			z.bitmap[index+1] = c
			z.bitmap[index+2] = c
			// z.bitmap[index+3] = 255 // initialized in NewZone

			index += 4
		}
	}
}

// Static initialization of Cosine lookup
const Q = 1024

var cos []byte

func init() {
	cos = make([]byte, Q)
	for iPhi, _ := range cos {
		phi := float64(iPhi) * 2 * math.Pi / float64(Q)
		cos[iPhi] = uint8(math.Cos(phi)*126.0 + 127.0)
	}
}

func Cos(phi float64) uint8 {
	if phi < 0 { // since math.Cos is symmetric
		phi = -phi
	}
	iPhi := int(Q*phi/(2*math.Pi)) % Q
	return cos[iPhi]
}
