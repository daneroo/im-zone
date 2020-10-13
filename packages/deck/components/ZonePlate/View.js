
import { useState, useCallback, useEffect, useRef } from 'react'

import { annotate } from './annotate'
import { useAnimationFrame } from './useAnimationFrame'
import { getEngines, importAll } from './engines'
importAll()

export function View ({ width, height, coefs, pause, showInfo, shuttle, renderer }) {
  // When [width,height], canvasRef changes, we update the state for ctx,imageData,data
  // const [canvas, setCanvas] = useState(null)
  const [backing, setBacking] = useState({ ctx: null, imageData: null, data: null })

  // useCallback instead of useRef - https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780
  // we get a reference to the canvas object when it is created
  // at that point we allocate/replace the backing resources:
  // backing = {ctx,imageData,data}
  const canvasRef = useCallback(canvas => {
    if (canvas != null) {
      // if (canvas.width > 50)console.log('callback.ref', canvas)
      const ctx = canvas.getContext('2d')
      //  we could create a Uint8ClampedArray ourselves...
      const imageData = ctx.getImageData(0, 0, width, height)
      const { data } = imageData
      // set the alpha channel to 255, so the renderers don't have to
      // actually set all components with typedarray.fill(value)
      data.fill(255)

      setBacking({ ctx, imageData, data })
    }
  }, [width, height])

  // Make sure we render when size/coefs change
  // Not sure canvasRef should be a dependency, canvas either.. Check again
  useEffect(() => {
    if (backing.ctx !== null) {
      const frame = 30
      draw(frame)
      if (showInfo) {
        const rest = { ctx: backing.ctx, engines: getEngines(), renderer, width, height }
        annotate({ frame, ...rest })
      }
    }
  }, [backing, coefs, renderer, showInfo])

  // invoke the appropriate engine for rendering the zoneplate
  function draw (frame = 30, frames = 60) {
    const t = (frame - frames / 2) / frames
    const defaultCoefs = { cx2: 0, cy2: 0, cxt: 0, cyt: 0, ct: 0 }
    const { cx2, cy2, cxt, cyt, ct } = { ...defaultCoefs, ...coefs }

    const engines = getEngines()
    // console.log('draw', { renderer }, engines[renderer])
    if (!engines[renderer]) { // indicates renderer (mutable dynamic import) is not available
      console.log('No renderer')
      const { ctx } = backing
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, width, height)
    } else {
      const { ctx, imageData, data } = backing
      // used to default to JS:renderJS - in case loader had not completed yet
      const renderFunc = engines[renderer] || engines.JS
      renderFunc(data, width, height, frames, t / 15, cx2, cy2, cxt, cyt, ct)
      ctx.putImageData(imageData, 0, 0)
    }
  }

  // counter for current frame when in animation loop
  const frameRef = useRef()
  useEffect(() => {
    frameRef.current = 0
  }, [])

  // update the frame counter, invoke the render, annotate
  // `animate` is called from useAnimationFrame, which injects fps/elapsed
  function animate ({ avgFps, avgElapsed }) {
    const period = 60 // 2 x for shuttle
    frameRef.current = (frameRef.current + 1) % (2 * period)
    const fc = frameRef.current
    const frame = (shuttle) ? period - Math.abs(period - fc) : fc % 60

    draw(frame)
    if (showInfo) {
      const rest = { ctx: backing.ctx, engines: getEngines(), renderer, width, height }
      annotate({ avgFps, avgElapsed, frame, ...rest, hostid })
    }
  }
  useAnimationFrame(animate, pause)

  return (
    <canvas
      ref={canvasRef}
      width={width} height={height}
    />
  )
}
