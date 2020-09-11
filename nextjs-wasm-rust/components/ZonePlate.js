import { useRef, useState } from 'react'
import { Flex, Box, Label, Button, useThemeUI } from 'theme-ui'

import Controls from './ZonePlate/Controls'
import { useParams, useSizes } from './ZonePlate/hooks'
import { renderJS } from './ZonePlate/renderJS'

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('../pkg')
  return wasm
}

export default function ZonePlate () {
  const { theme } = useThemeUI()
  const { colors: { primary, secondary } } = theme
  const canvasRef = useRef(null)

  const [renderTime, setRenderTime] = useState('0.00')
  const [timePosition, setTimePosition] = useState('0.00')

  // These control the size and coefficients od the ZonePlate
  const [params, setParams] = useParams()
  const [width, height, size, sizes, setSize] = useSizes()

  function drawJS (renderer) {
    loop(renderJS)
  }
  async function drawRust (renderer) {
    const { draw: renderRust } = await importWasm()
    loop(renderRust)
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
    return avg.toFixed(2) + '/' + renderTimes.length
  }

  const frames = 60
  const [looping, setLooping] = useState(false)
  function loop (renderer) {
    setLooping(true)
    const ctx = canvasRef.current.getContext('2d')
    let loop = 0

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

      if (loop < frames - 1) { // -1 because we will trigger one more step()
        window.requestAnimationFrame(step)
      } else {
        setLooping(false)
      }
      loop++
    }

    window.requestAnimationFrame(step)
  }

  if (canvasRef && canvasRef.current && !looping) {
    console.log('draw', { looping })
    const ctx = canvasRef.current.getContext('2d')

    const { cx2, cy2, cxt, cyt, ct } = params
    const t = -0.5
    renderJS(ctx, width, height, frames, t, cx2, cy2, cxt, cyt, ct)
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1 }}>
      <Controls {...{ params, setParams, size, setSize, sizes }} />
      <Flex sx={{ gap: 1 }}>
        <Button onClick={() => drawJS()}>DrawJS</Button>
        <Button onClick={() => drawRust()}>Draw Rust</Button>
        <Box>
          <Label sx={{ color: secondary }}>Render Time: ~{renderTime} ms</Label>
          <Label sx={{ color: secondary }}>Time: {timePosition} s</Label>
        </Box>
      </Flex>
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
