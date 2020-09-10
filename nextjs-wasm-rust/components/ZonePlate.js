import { useRef, useState } from 'react'
import { Grid, Flex, Box, Label, Button, IconButton, Slider, Select, useThemeUI } from 'theme-ui'

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
  const [params, setParams] = useState({ cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 })
  const sizes = {
    64: { width: 64, height: 64 },
    200: { width: 200, height: 200 },
    400: { width: 400, height: 400 }
  }
  const [size, setSize] = useState('400')
  const { width, height } = sizes[size]
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
      }
      loop++
    }

    window.requestAnimationFrame(step)
  }

  return (
    <div>
      <h2>Zone Plate Generator</h2>
      <h3>WASM / Canvas experiment</h3>
      <Box sx={{ color: 'gray', py: 1 }}>
        Invokes the drawing function (either in JavaScript or Rust/WASM),
        and reports the average render time (ms) for the last {renderTimeAverageLength} frames.
      </Box>
      <Grid>
        <Flex sx={{ my: 1, gap: 10 }}>
          {Object.entries({
            VH: { cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 },
            VT: { cx2: 0, cy2: 1, cxt: 1, cyt: 0, ct: 0 },
            HT: { cx2: 1, cy2: 0, cxt: 0, cyt: 1, ct: 0 }
          }).map(([k, v]) => {
            return (
              <IconButton
                key={k} size={64}
                onClick={(e) => setParams(v)}
              >
                <img
                  style={{ borderRadius: '10px' }}
                  src={`https://via.placeholder.com/48/000/fff?text=${k}`}
                />
              </IconButton>
            )
          })}
        </Flex>

      </Grid>
      <Grid columns={2} sx={{ gap: 1, maxWidth: '15rem' }}>
        {['cx2', 'cy2', 'cxt', 'cyt', 'ct'].map((k) => {
          return (
            <Flex key={k}>
              <Label sx={{ flex: 1 }} htmlFor={k}>{k} ({params[k]})</Label>
              <Slider
                sx={{ flex: '1 2' }}
                name={k}
                type='range' min='-2' max='2' step='1'
                value={params[k]}
                onChange={(e) => setParams({ ...params, [k]: e.target.value })}
              />
            </Flex>
          )
        })}
      </Grid>
      <Flex>
        <pre>{JSON.stringify(params)}</pre>
      </Flex>
      <Flex sx={{ maxWidth: 150 }}>
        <Label sx={{ flex: 1 }} htmlFor='size'>Size</Label>
        <Select
          name='size'
          value={size}
          sx={{ width: 100 }}
          onChange={(e) => setSize(e.target.value)}
        >
          {Object.entries(sizes).map(([k, v]) => {
            return <option key={k}>{k}</option>
          })}
        </Select>
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
