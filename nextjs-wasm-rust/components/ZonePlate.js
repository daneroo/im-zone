import { useRef, useState } from 'react'
import { Flex, Box, Label, Button, useThemeUI } from 'theme-ui'

import Controls from './ZonePlate/Controls'
import { useParams, useSizes } from './ZonePlate/hooks'

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
  const [width, height, sizes, setSize] = useSizes()

  function drawJS (renderer) {
    loop(renderJS)
  }
  async function drawRust (renderer) {
    const { draw: renderRust } = await importWasm()
    loop(renderRust)
  }

  const renderTimeAverageLength = 30
  const renderTimes = []
  function addRenderTime (elapsed) {
    renderTimes.push(elapsed)
    if (renderTimes.length > renderTimeAverageLength) {
      renderTimes.shift()
    }
  }
  function averageRenderTime () {
    const avg = renderTimes.reduce((sum, elapsed) => (sum + elapsed)) / renderTimes.length
    return avg.toFixed(2)
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
    <div>
      <Controls {...{ params, setParams, setSize, sizes }} />
      <Flex sx={{ gap: 1, py: 1 }}>
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
    </div>
  )
}

async function renderJS (ctx, width, height, frames, t, cx2, cy2, cxt, cyt, ct) {
  const imageData = ctx.getImageData(0, 0, width, height)
  // data is a width*height*4 array
  const { data } = imageData

  const cx = width / 2
  const cy = height / 2

  let index = 0
  // originally as : tPart = ct * t * frames
  const ctt = ct * frames * t

  for (let j = -cy; j < height - cy; j++) {
    // originally written as yPart = cy2 * (j/height)^2 * height
    const cy2y2 = (cy2) ? (cy2 * j * j / height) : 0
    const cytyt = (cyt) ? (cyt * (t * frames * frames / 2) * (j / height)) : 0
    const cy2y2cytytctt = cy2y2 + cytyt + ctt
    for (let i = -cx; i < width - cx; i++) {
      // for x = i/width => [-.5,.5]
      // originally written as xPart = cx2 * (i/width)^2 * width
      const cx2x2 = (cx2) ? (cx2 * i * i / width) : 0
      // TODO: this is not periodic in t
      //   but we have phi(t)==phi(frames-t) ..check?
      const cxtxt = (cxt) ? (cxt * (t * frames * frames / 2) * (i / width)) : 0

      const phi = (cx2x2 + cxtxt + cy2y2cytytctt) * Math.PI

      // Inline trig calculation - Math.cos
      // const c = Math.floor(Math.cos(phi) * 126 + 127)

      // Use the Cosine lookup table
      // const c = Cosine(phi)

      // Use the Cosine lookup table - with inlined index calc
      const absPhi = (phi < 0) ? -phi : phi
      const iPhi = Math.floor(Q * absPhi / (2 * Math.PI)) % Q
      const c = cosineLookup[iPhi]

      // const index = (j * width + i) * 4
      data[index + 0] = c // red
      data[index + 1] = c // green
      data[index + 2] = c // blue
      data[index + 3] = 255 // alpha
      index += 4
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

const Q = 1024
const cosineLookup = Array.from({ length: Q }, (_, iPhi) => {
  const phi = iPhi * 2 * Math.PI / Q
  return Math.cos(phi) * 126.0 + 127.0
})

// This index calculation was inlined
// So commented for possible future use
// function Cosine (phi) {
//   const absPhi = (phi < 0) ? -phi : phi
//   const iPhi = Math.floor(Q * absPhi / (2 * Math.PI)) % Q
//   return cosineLookup[iPhi]
// }
