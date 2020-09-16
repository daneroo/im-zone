import { useState, useCallback, useEffect, useRef } from 'react'
import { Flex, Box, Label, Button, Checkbox, useThemeUI } from 'theme-ui'
// import { useAnimationFrameLoop } from 'react-timing-hooks'

import Controls from './ZonePlate/Controls'
import { useParams, useSizes, useAnimationFrame } from './ZonePlate/hooks'
import { renderJS } from './ZonePlate/renderJS'
import Equation from './ZonePlate/Equation'

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('../pkg')
  return wasm
}

export default function ZonePlate () {
  const { theme: { colors: { primary, secondary } } } = useThemeUI()

  const [renderTime, setRenderTime] = useState('0.00')
  const [timePosition, setTimePosition] = useState('0.00')
  const [shuttle, setShuttle] = useState(false)
  const [renderer, setRenderer] = useState('JS')
  // animation state
  const [pause, setPause] = useState(true)

  // These control the size and coefficients od the ZonePlate
  const [params, setParams] = useParams()
  const [width, height, size, sizes, setSize] = useSizes()

  const [canvas, setCanvas] = useState(null)
  // useCallback instead of useRef - https://medium.com/@teh_builder/ref-objects-inside-useeffect-hooks-eb7c15198780
  const canvasRef = useCallback(canvas => {
    // console.log('useCallback', size, canvas)
    setCanvas(canvas)
  }, [size])

  // make sure we render when size/params change
  useEffect(() => {
    // console.log('useEffect', size, canvas)
    if (canvas !== null) {
      draw()
    }
  }, [canvasRef, canvas, params, renderer])

  const renderTimeAverageLength = 60
  const renderTimes = []
  function addRenderTime (elapsed) {
    renderTimes.push(elapsed)
    if (renderTimes.length > renderTimeAverageLength) {
      renderTimes.shift()
    }
  }
  function averageRenderTime () {
    const avg = renderTimes.length ? renderTimes.reduce((sum, elapsed) => (sum + elapsed)) / renderTimes.length : 0
    return `${avg.toFixed(1)}ms -  ${renderTimes.length}f`
  }

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
    // console.log('renderer:', renderer, fps, averageRenderTime())
  }
  useAnimationFrame(thing, pause)

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <Controls {...{ params, setParams, size, setSize, sizes, shuttle, setShuttle }} />
      <Flex sx={{ gap: 1, my: 1, alignItems: 'center' }}>
        <Label sx={{ gap: 1 }}>
          <div>JavaScript</div>
          <Checkbox checked={renderer === 'JS'} onChange={(e) => setRenderer('JS')} />
        </Label>
        <Label sx={{ gap: 1 }}>
          <div>Rust</div>
          <Checkbox checked={renderer === 'Rust'} onChange={(e) => setRenderer('Rust')} />
        </Label>
        <Box>
          <Button onClick={() => setPause(!pause)}>{pause ? 'Play' : 'Pause'}</Button>
        </Box>
      </Flex>
      <Equation params={params} />
      <Box>
        <Label sx={{ color: secondary, fontSize: '90%' }}>Render: ~{renderTime}</Label>
        {/* add svg sparkline and time axis progress [-.5,.5] */}
        <Label sx={{ color: secondary }}>Time: {timePosition} s</Label>
      </Box>
      <Box>
        <canvas
          ref={canvasRef}
          style={{
            border: `1px solid ${primary}`,
            padding: '8px'
          }}
          width={width} height={height}
        />
      </Box>
    </Flex>
  )
}
