import { useState, useCallback, useEffect } from 'react'
import { Flex, Box, Label, Button, useThemeUI } from 'theme-ui'

import Controls from './ZonePlate/Controls'
import { useParams, useSizes } from './ZonePlate/hooks'
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
      drawLoop(renderJS, 1)
    }
  }, [canvasRef, canvas, params])

  async function drawJS (renderer) {
    for (let i = 0; i < 10; i++) {
      const direction = (shuttle) ? (i % 2) * 2 - 1 : 1
      /* const avgRenderTime = */ await drawLoop(renderJS, 60, direction)
    }
  }
  async function drawRust (renderer) {
    const { draw: renderRust } = await importWasm()
    for (let i = 0; i < 10; i++) {
      const direction = (shuttle) ? (i % 2) * 2 - 1 : 1
      /* const avgRenderTime = */ await drawLoop(renderRust, 60, direction)
    }
  }

  const renderTimeAverageLength = 60
  const renderTimes = []
  function addRenderTime (elapsed) {
    renderTimes.push(elapsed)
    if (renderTimes.length > renderTimeAverageLength) {
      renderTimes.shift()
    }
  }
  function averageRenderTime () {
    const avg = renderTimes.reduce((sum, elapsed) => (sum + elapsed)) / renderTimes.length
    return `${avg.toFixed(2)}ms -  ${renderTimes.length}f`
  }

  function drawLoop (renderer, frames = 1, direction = 1) {
    return new Promise((resolve) => {
      const ctx = canvas.getContext('2d')
      let loop = (direction < 0) ? frames - 2 : 0

      function step () {
        const t = (loop - frames / 2) / frames
        const start = +new Date()

        const { cx2, cy2, cxt, cyt, ct } = params
        renderer(ctx, width, height, frames, t / 15, cx2, cy2, cxt, cyt, ct)

        const elapsed = +new Date() - start

        addRenderTime(elapsed)
        if (loop % 1 === 0) {
          setRenderTime(averageRenderTime())
          setTimePosition(t.toFixed(2))
        }

        if (loop < frames - 1 && loop >= 0) { // -1 because we will trigger one more step()
          window.requestAnimationFrame(step)
        } else {
          // console.log('last.step', { loop, t, frames })
          // or maybe the average?
          resolve(averageRenderTime())
        }
        loop += direction
      }

      window.requestAnimationFrame(step)
    })
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <Controls {...{ params, setParams, size, setSize, sizes, shuttle, setShuttle }} />
      <Flex sx={{ gap: 1 }}>
        <Button onClick={() => drawJS()}>DrawJS</Button>
        <Button onClick={() => drawRust()}>Draw Rust</Button>
        <Box>
          <Label sx={{ color: secondary }}>Render Time: ~{renderTime}</Label>
          <Label sx={{ color: secondary }}>Time: {timePosition} s</Label>
        </Box>
      </Flex>
      <Equation params={params} />
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
