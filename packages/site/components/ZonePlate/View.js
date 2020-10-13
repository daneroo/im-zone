
import { useState, useCallback, useEffect, useRef } from 'react'

import { useAnimationFrame } from './useAnimationFrame'
import { getEngines, importAll } from './engines'
importAll()

export function View ({ width, height, params, pause, showInfo, shuttle, renderer }) {
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

  // Make sure we render when size/params change
  // Not sure canvasRef should be a dependency, canvas either.. Check again
  useEffect(() => {
    if (backing.ctx !== null) {
      const frame = 30
      draw(frame)
      if (showInfo) {
        annotate({ frame })
      }
    }
  }, [backing, params, renderer, showInfo])

  // invoke the appropriate engine for rendering the zoneplate
  function draw (frame = 30, frames = 60) {
    const t = (frame - frames / 2) / frames
    const defaultCoefs = { cx2: 0, cy2: 0, cxt: 0, cyt: 0, ct: 0 }
    const { cx2, cy2, cxt, cyt, ct } = { ...defaultCoefs, ...params }

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

  const jsYellow = '#f7df1e'
  const gopherBlue = 'rgb(1, 173, 216)'
  const rust = 'rgb(183,65,14)'
  const rendererColor = { JS: jsYellow, Rust: rust, Go: gopherBlue }

  function annotate ({ avgFps = 0, avgElapsed = 0, frame = 0 } = {}) {
    const padding = 2
    const baseFontSize = (width < 150) ? 16 : 20

    // We need the ctx to fillText, etc..
    const { ctx } = backing

    const engines = getEngines()

    // renderer color overlay
    if (engines[renderer]) {
      ctx.save()
      ctx.globalCompositeOperation = 'multiply'
      ctx.fillStyle = rendererColor[renderer] || 'red'
      ctx.fillRect(0, 0, width, height)
      ctx.restore()
    }

    // Renderer Name
    ctx.save()
    ctx.font = `${baseFontSize * 2}px monospace`
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 6
    ctx.fillStyle = rendererColor[renderer] || 'red'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(renderer, width - padding, padding)
    ctx.restore()

    // for stamp/fps/elapsed
    ctx.save()
    ctx.font = `${baseFontSize}px monospace`
    ctx.shadowColor = 'black'
    ctx.shadowBlur = 4
    ctx.fillStyle = 'white'

    // stamp
    const stamp = new Date().toISOString()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    if (width < 300) {
      // time portion
      ctx.fillText(stamp.substr(11, 10), width / 2, height - padding)
      if (width > 150) {
        // date portion above
        ctx.fillText(stamp.substr(0, 10), width / 2, height - baseFontSize - padding)
      }
    } else {
      // show timestamp one line
      ctx.fillText(stamp.substr(0, 22), width / 2, height - padding)
    }
    // avgElapsed and avgFPS
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    if (avgElapsed) {
      ctx.fillText(`${avgElapsed.toFixed(1).padStart(3, ' ')}ms`, padding, padding)
    }
    if (avgFps) {
      ctx.fillText(`${avgFps.toFixed(0)}fps`, padding, padding + baseFontSize)
    }
    ctx.restore()

    //  The timeline 'dot'
    if (frame || frame === 0) {
      ctx.save()
      ctx.fillStyle = 'white'
      // ctx.shadowColor = 'black'
      // ctx.shadowBlur = 4

      ctx.beginPath()
      const x = width * frame / 60
      const y = 0
      const radius = Math.max(4, height * 0.01)
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
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
      annotate({ avgFps, avgElapsed, frame })
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
