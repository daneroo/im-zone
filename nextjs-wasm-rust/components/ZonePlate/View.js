
import { useState, useCallback, useEffect, useRef } from 'react'
import { useThemeUI } from 'theme-ui'
import { renderJS } from './renderJS'
import { useAnimationFrame } from './hooks'

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('../../pkg')
  return wasm
}

export default function View ({ width, height, params, pause, addRenderTime, averageRenderTime, setRenderTime, setTimePosition, renderer }) {
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

    addRenderTime(elapsed)
    if (frame % 1 === 0) {
      setRenderTime(averageRenderTime())
      setTimePosition(t.toFixed(2))
    }

    return elapsed
  }

  const frameValue = useRef()
  const stampValue = useRef()

  useEffect(() => {
    stampValue.current = +new Date()
    frameValue.current = 42
  }, [])

  async function thing (delta) {
    const fps = (1000 / delta).toFixed(1)

    frameValue.current = (frameValue.current + 1) % 60
    const frame = frameValue.current

    const elapsed = await draw(frame)
    console.log('renderer:', renderer, fps, elapsed, averageRenderTime())
  }
  useAnimationFrame(thing, pause)

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
