
import { useState, useCallback, useEffect, useRef } from 'react'
import { useThemeUI } from 'theme-ui'
import { useAnimationFrame } from './hooks'
import { renderJS } from './renderJS'
// Careful: these symbols are mutable
// their values change from undefined to the actual function reference
// after the async WASM has loaded
// Care should be taken if the symbols are copied...
import { renderRust } from './renderRust'
import { renderGo } from './renderGo'

// async function - uses dynamic import

export default function View ({ width, height, params, pause, showInfo, shuttle, renderer }) {
  const { theme: { colors: { primary } } } = useThemeUI()

  const [canvas, setCanvas] = useState(null)
  // useCallback instead of useRef - https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780
  const canvasRef = useCallback(canvas => {
    setCanvas(canvas)
  }, [width, height])

  // make sure we render when size/params change
  useEffect(() => {
    if (canvas !== null) {
      const frame = 30
      draw(frame)
      if (showInfo) {
        annotate({ frame })
      }
    }
  }, [canvasRef, canvas, params, renderer, showInfo])

  // invoke the appropriate engine for rendering the zoneplate
  function draw (frame = 30, frames = 60) {
    const t = (frame - frames / 2) / frames
    const { cx2, cy2, cxt, cyt, ct } = params
    const ctx = canvas.getContext('2d')

    // default to renderJS - in case loader has not completed yet
    const engines = {
      JS: renderJS,
      Rust: renderRust,
      Go: renderGo
    }

    if (!engines[renderer]) { // indicate renderer (mutable dynamic import) is not available
      // console.log(`Renderer (${renderer}) not ready, defaulting to renderJS`, { engines })
      ctx.fillStyle = 'red'
      ctx.fillRect(0, 0, width, height)
    } else {
      const renderFunc = engines[renderer] || renderJS
      renderFunc(ctx, width, height, frames, t / 15, cx2, cy2, cxt, cyt, ct)
    }
  }

  const jsYellow = '#f7df1e'
  const gopherBlue = 'rgb(1, 173, 216)'
  const rust = 'rgb(183,65,14)'
  const rendererColor = { JS: jsYellow, Rust: rust, Go: gopherBlue }

  function annotate ({ avgFps = 0, avgElapsed = 0, frame = 0 } = {}) {
    const padding = 2
    const baseFontSize = (width < 150) ? 16 : 20
    const ctx = canvas.getContext('2d')

    // renderer color overlay
    // ctx.save()
    // ctx.globalAlpha = 0.2
    // ctx.fillStyle = rendererColor[renderer] || 'yellow'
    // ctx.fillRect(0, 0, width, height)
    // ctx.restore()

    // avgElapsed and avgFPS
    ctx.font = `${baseFontSize}px monospace`
    ctx.fillStyle = 'black'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'top'
    if (avgFps) {
      ctx.fillText(`${avgElapsed.toFixed(1).padStart(3, ' ')}ms`, padding, padding)
    }
    if (avgElapsed) {
      ctx.fillText(`${avgFps.toFixed(0)}fps`, padding, padding + baseFontSize)
    }

    // Renderer Name
    ctx.font = `${baseFontSize * 2}px monospace`
    ctx.fillStyle = rendererColor[renderer] || 'yellow'
    ctx.textAlign = 'right'
    ctx.textBaseline = 'top'
    ctx.fillText(renderer, width - 2, 2)

    if (frame || frame === 0) {
      ctx.fillStyle = primary
      ctx.beginPath()
      const x = width * frame / 60
      const y = 0
      const radius = height * 0.02
      ctx.arc(x, y, radius, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()
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
