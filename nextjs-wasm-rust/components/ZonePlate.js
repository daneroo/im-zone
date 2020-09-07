import { useRef, useState } from 'react'
import { Flex, Box, Label, Button, useThemeUI, Slider } from 'theme-ui'
// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('../pkg')
  return wasm
}

export default function ZonePlate () {
  const width = 400
  const height = 400
  const { theme } = useThemeUI()
  const { colors: { primary, secondary } } = theme
  const canvasRef = useRef(null)
  const [renderTime, setRenderTime] = useState('0.00')
  const [timePosition, setTimePosition] = useState('0.00')
  const [params, setParams] = useState({ A: 0, B: 0, C: 0, D: 0 })

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
  function loop (renderer) {
    const ctx = canvasRef.current.getContext('2d')
    let loop = 0

    function step () {
      const t = (loop - frames / 2) / frames
      const start = +new Date()

      // TODO pass frames,t
      renderer(ctx, width, height, t)
      // renderer(ctx, width, height, { ...params, t, frames })

      const elapsed = +new Date() - start

      addRenderTime(elapsed)
      if (loop % 1 === 0) {
        setRenderTime(averageRenderTime())
        setTimePosition(Math.abs(t).toFixed(2))
      }

      if (loop < frames - 1) { // -1 because we will trigger one more step()
        window.requestAnimationFrame(step)
      }
      loop++
    }

    window.requestAnimationFrame(step)
  }

  return (
    <div>
      <h3>Canvas Experiment</h3>
      <Box sx={{ color: 'gray', py: 1 }}>
        Invokes the drawing function (either in JavaScript or Rust/WASM),
        and reports the average render time (ms) for the last {renderTimeAverageLength} frames.
      </Box>
      <Flex>
        {['A', 'B', 'C', 'D'].map((k) => {
          return (
            <>
              <Label sx={{ flex: 1 }} htmlFor={k}>{k} ({params[k]})</Label>
              <Slider
                sx={{ flex: 3, maxWidth: 100 }}
                name={k}
                type='range'
                min='-1' max='1'
                value={params[k]}
                onChange={(e) => setParams({ ...params, [k]: e.target.value })}
                step='1'
              />
            </>
          )
        })}
        <pre>{JSON.stringify(params)}</pre>
      </Flex>
      <Flex>
        <Box p={1}>
          <Button onClick={() => drawJS()}>DrawJS</Button>
        </Box>
        <Box p={1}>
          <Button onClick={() => drawRust()}>Draw Rust</Button>
        </Box>
        <Box p={1}>
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

async function renderJS (ctx, width, height, t) {
  const imageData = ctx.getImageData(0, 0, width, height)
  // data is a width*height*4 array
  const { data } = imageData

  const cx = width / 2
  const cy = height / 2

  // const { A, B, C, D, t, frames } = params
  // const Dt = D * t
  // const offset = Math.random() * 10
  let index = 0
  for (let j = -cy; j < height - cy; j++) {
    const y = j / height
    // const By2H = B * y * y * height
    // const CytF = C * y * t * 2 * frames
    for (let i = -cx; i < width - cx; i++) {
      const x = i / width

      const phi = (x * x * width + y * y * height + t) * Math.PI

      // let phi; phi = 0
      // // closest yet
      // //  pure temporal t*f===t*(60-f)
      // phi = (t * 58 * frames / 30) * Math.PI // max freq
      //
      // // x-t (Quantized)
      // const QQ = 8
      // const xx = Math.round(x * 2 * QQ) / QQ
      // phi = (t * 2 * xx * frames) * Math.PI

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
function Cosine (phi) {
  const absPhi = (phi < 0) ? -phi : phi
  const iPhi = Math.floor(Q * absPhi / (2 * Math.PI)) % Q
  return cosineLookup[iPhi]
}
