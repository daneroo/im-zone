// +build js

package main

import (
	"fmt"
	"math"
	"syscall/js"
	"time"
)

func main() {
	z := zone{}
	z.start()
}

type zone struct {
	doc js.Value
	ctx js.Value

	width  int
	height int
	fcount int

	Q   int
	cos []byte

	renderTimes []time.Duration

	bitmap  []byte
	imgData js.Value
	data    js.Value
}

func (z *zone) setupCos() {
	z.Q = 1024
	z.cos = make([]byte, z.Q)
	for iPhi, _ := range z.cos {
		phi := float64(iPhi) * 2 * math.Pi / float64(z.Q)
		z.cos[iPhi] = uint8(math.Cos(phi)*126.0 + 127.0)
	}
}

func (z *zone) Cos(phi float64) uint8 {
	if phi < 0 { // since math.Cos is symmetric
		phi = -phi
	}
	iPhi := int(float64(z.Q)*phi/(2*math.Pi)) % z.Q
	return z.cos[iPhi]
}

func rollingAvgTime(times []time.Duration) time.Duration {
	sum := int64(0)
	count := int64(0)
	for _, d := range times {
		if d > 0 {
			sum += int64(d)
			count += 1
		}
	}
	return time.Duration(sum / count)
}

func (z *zone) start() {
	z.doc = js.Global().Get("document")
	canvasEl := z.doc.Call("getElementById", "mycanvas")
	z.ctx = canvasEl.Call("getContext", "2d")

	// Initialize Sin lookup table
	z.setupCos()
	z.renderTimes = make([]time.Duration, 300)

	var renderFrame js.Func
	var tmark float64
	var markCount = 0
	var tdiffSum float64

	renderFrame = js.FuncOf(func(this js.Value, args []js.Value) interface{} {
		// FPS thing
		now := args[0].Float()
		tdiff := now - tmark
		tdiffSum += now - tmark
		markCount++
		if markCount > 10 {
			z.doc.Call("getElementById", "fps").Set("innerHTML", fmt.Sprintf("FPS: %.01f", 1000/(tdiffSum/float64(markCount))))
			tdiffSum, markCount = 0, 0
		}
		tmark = now

		// Canvas size handler
		// curBodyW := z.doc.Get("body").Get("clientWidth").Int()
		// curBodyH := z.doc.Get("body").Get("clientHeight").Int()
		curBodyW := canvasEl.Get("clientWidth").Int()
		curBodyH := canvasEl.Get("clientHeight").Int()
		if curBodyW != z.width || curBodyH != z.height {
			z.width, z.height = curBodyW, curBodyH
			canvasEl.Set("width", z.width)
			canvasEl.Set("height", z.height)
			z.bitmap = make([]byte, int(z.width*z.height)*4)
			z.imgData = z.ctx.Call("getImageData", 0, 0, z.width, z.height)
			z.data = z.imgData.Get("data")

			println(fmt.Sprintf("New bitmap %d x %d (fcount:%d)", z.width, z.height, z.fcount))

		}

		start := time.Now()
		z.Update(tdiff / 1000)
		elapsed := time.Since(start)
		z.renderTimes[z.fcount%len(z.renderTimes)] = elapsed

		if z.fcount%100 == 0 {
			avgTime := rollingAvgTime(z.renderTimes)
			println(fmt.Sprintf("%5d Update %d x %d took ~%s", z.fcount, z.width, z.height, avgTime))
		}

		js.Global().Call("requestAnimationFrame", renderFrame)
		return nil
	})

	done := make(chan struct{}, 0)

	js.Global().Call("requestAnimationFrame", renderFrame)
	<-done
}

func (z *zone) Update(dtTime float64) {
	z.fcount++

	frames := 120
	t := float64(z.fcount%frames)/float64(frames) - 0.5

	// render into z.bitmap
	z.render(t, 120, vxt)

	// These are cached now
	// z.imgData = z.ctx.Call("getImageData", 0, 0, z.width, z.height)
	// z.data = z.imgData.Get("data")

	// copy bitmap to data (which backsimgData)
	js.CopyBytesToJS(z.data, z.bitmap)
	// copy imgData back to canvas
	z.ctx.Call("putImageData", z.imgData, 0, 0)

}

// phi functions
func vh(w, h, frames int, x, y, t float64) float64 {
	// return (float64(w)*x*x + float64(h)*y*y + t*2) * math.Pi
	return (float64(w)*x*x + float64(h)*y*y) * math.Pi
}
func vxt(w, h, frames int, x, y, t float64) float64 {
	return (float64(frames)*x*t + float64(h)*y*y) * math.Pi
}
func hyt(w, h, frames int, x, y, t float64) float64 {
	return (float64(frames)*y*t + float64(w)*x*x) * math.Pi
}
func t2(w, h, frames int, x, y, t float64) float64 {
	return (float64(frames) * t * t) * math.Pi
}

func (z *zone) render(t float64, frames int, phiFunc func(w, h, frames int, x, y, t float64) float64) {
	// rect := img.Bounds()
	// s := rect.Size()
	cx := z.width / 2
	cy := z.height / 2

	index := 0
	for j := 0; j < z.height; j++ {
		y := float64(j-cy) / float64(z.height)
		for i := 0; i < z.width; i++ {
			x := float64(i-cx) / float64(z.width)

			// phi := phiFunc(z.width, z.height, frames, x, y, t)
			// vh ( + 2t)
			// phi := (float64(z.width)*x*x + float64(z.height)*y*y - 4*t) * math.Pi
			// vxt
			phi := (float64(frames)*x*t + float64(z.height)*y*y) * math.Pi

			// c := uint8(math.Cos(phi)*126.0 + 127.0)
			c := z.Cos(phi)

			z.bitmap[index+0] = c
			z.bitmap[index+1] = c
			z.bitmap[index+2] = c
			z.bitmap[index+3] = 255
			index += 4

		}
	}
}
