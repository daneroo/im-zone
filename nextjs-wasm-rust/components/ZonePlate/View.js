
import { useState, useCallback, useEffect, useRef } from 'react'
import { useThemeUI } from 'theme-ui'
import { renderJS } from './renderJS'
import { useAnimationFrame } from './hooks'

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('../../pkg')
  return wasm
}

export default function View ({ width, height, params, pause, renderer }) {
  const { theme: { colors: { primary } } } = useThemeUI()

  const [canvas, setCanvas] = useState(null)
  // useCallback instead of useRef - https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780
  const canvasRef = useCallback(canvas => {
    // console.log('useCallback', size, canvas)
    setCanvas(canvas)
  }, [width, height])

  // make sure we render when size/params change
  useEffect(() => {
    // console.log('useEffect', size, canvas)
    if (canvas !== null) {
      draw()
    }
  }, [canvasRef, canvas, params, renderer])

  async function draw (frame = 30, frames = 60) {
    const start = +new Date()

    const t = (frame - frames / 2) / frames
    const { cx2, cy2, cxt, cyt, ct } = params
    const ctx = canvas.getContext('2d')
    if (renderer === 'Rust') {
      const { draw: renderRust } = await importWasm()
      renderRust(ctx, width, height, frames, t / 15, cx2, cy2, cxt, cyt, ct)
    } else {
      renderJS(ctx, width, height, frames, t / 15, cx2, cy2, cxt, cyt, ct)
    }

    const elapsed = +new Date() - start
    return elapsed
  }

  const frameValue = useRef()
  const stampValue = useRef()

  useEffect(() => {
    stampValue.current = +new Date()
    frameValue.current = 42
  }, [])

  async function animate ({ fps, avgFps, avgElapsed }) {
    frameValue.current = (frameValue.current + 1) % 60
    const frame = frameValue.current

    const elapsed = await draw(frame)

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'black'
    ctx.font = '20px monospace'
    ctx.fillText(`${fps}fps ~${avgFps}fps`, 10, 20)
    ctx.fillText(`${elapsed.toString().padStart(3, ' ')}ms ~${avgElapsed.padStart(5, ' ')}ms`, 10, 40)
    const gopherBlue = 'rgb(1, 173, 216)'
    // const fuschia = 'rgb(206, 48, 98)'
    const rust = 'rgb(183,65,14)'
    ctx.font = '40px monospace'
    ctx.fillStyle = { JS: 'yellow', Rust: rust, Go: gopherBlue }[renderer] || 'yellow'
    ctx.fillText(renderer, 10, height - 20)

    return elapsed
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
