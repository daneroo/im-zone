
import { useState, useCallback, useEffect, useRef } from 'react'
import { useThemeUI } from 'theme-ui'
import { renderJS } from './renderJS'
import { useAnimationFrame } from './hooks'

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('../../pkg')
  return wasm
}

export default function View ({ width, height, params, pause, shuttle, renderer }) {
  const { theme: { colors: { primary } } } = useThemeUI()

  // Resolve dynamic imports (once only) asynchronously
  const engineRef = useRef({ JS: renderJS }) // ...Rust:renderRust,Go:renderGo
  useEffect(() => {
    async function loader () {
      const { draw: renderRust } = await importWasm()
      engineRef.current.Rust = renderRust
      // Go comes next
      engineRef.current.Go = renderJS // Placeholder
    }
    loader()
  }, [])

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
      annotate({ frame })
    }
  }, [canvasRef, canvas, params, renderer])

  // invoke the appropriate engine for rendering the zoneplate
  function draw (frame = 30, frames = 60) {
    const t = (frame - frames / 2) / frames
    const { cx2, cy2, cxt, cyt, ct } = params
    const ctx = canvas.getContext('2d')

    // default to renderJS - in case loader has not completed yet
    if (!engineRef.current || !engineRef.current[renderer]) {
      console.log('Renderer not ready, defaulting to renderJS')
    }
    const renderFunc = engineRef.current[renderer] || renderJS

    renderFunc(ctx, width, height, frames, t / 15, cx2, cy2, cxt, cyt, ct)
  }

  function annotate ({ avgFps = 0, avgElapsed = 0, frame = 0 } = {}) {
    const padding = 2
    const baseFontSize = (width < 150) ? 16 : 20
    const ctx = canvas.getContext('2d')
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
    const gopherBlue = 'rgb(1, 173, 216)'
    // const fuschia = 'rgb(206, 48, 98)'
    const rust = 'rgb(183,65,14)'
    ctx.font = `${baseFontSize * 2}px monospace`
    ctx.fillStyle = { JS: 'yellow', Rust: rust, Go: gopherBlue }[renderer] || 'yellow'
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
    annotate({ avgFps, avgElapsed, frame })
  }
  useAnimationFrame(animate, pause)

  return (
    <canvas
      ref={canvasRef}
      style={{
        border: `1px solid ${primary}`,
        padding: '8px'
      }}
      width={width} height={height}
    />
  )
}
