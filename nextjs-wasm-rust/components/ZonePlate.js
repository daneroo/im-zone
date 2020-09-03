import { useRef, useState } from 'react'

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('../pkg')
  return wasm
}

export default function ZonePlate () {
  const width = 400
  const height = 400
  const canvasRef = useRef(null)
  const [renderTime, setRenderTime] = useState(0)
  // canvas.current
  function drawJS (renderer) {
    loop(renderJS)
  }
  async function drawRust (renderer) {
    const { draw: renderRust } = await importWasm()
    loop(renderRust)
  }

  function loop (renderer) {
    const ctx = canvasRef.current.getContext('2d')
    let loop = 0
    function step () {
      loop++
      const offset = loop / 30
      const start = +new Date()
      renderer(ctx, width, height, offset)
      const elapsed = +new Date() - start
      setRenderTime(elapsed)
      if (loop < 100) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }

  return (
    <div>
      <h3>Canvas Experiment</h3>
      <div style={{ padding: 10 }}>
        Invokes the drawing function (either in JavaScript or Rust/WASM),
        and reports the render time (ms) for each render.
      </div>
      <div>
        <button onClick={() => drawJS()}>DrawJS</button>
        <button onClick={() => drawRust()}>Draw Rust</button>
        <span style={{ marginLeft: 10 }}>Render Time: {renderTime} ms</span>
      </div>
      <canvas ref={canvasRef} style={{ border: '1px solid red' }} width={width} height={height} />
    </div>
  )
}

async function renderJS (ctx, width, height, offset) {
  const imageData = ctx.getImageData(0, 0, width, height)
  // data is a width*height*4 array
  const { data } = imageData

  const cx = width / 2
  const cy = height / 2

  // const offset = Math.random() * 10
  for (let j = 0; j < height; j++) {
    const y = (j - cy) / height
    for (let i = 0; i < width; i++) {
      const x = (i - cx) / width
      const phi = x * x * width + y * y * height + offset
      const c = Math.floor(Math.sin(phi * Math.PI) * 126 + 127)
      const index = (j * width + i) * 4
      data[index + 0] = c // red
      data[index + 1] = c // green
      data[index + 2] = c // blue
      data[index + 3] = 255 // alpha
    }
  }
  ctx.putImageData(imageData, 0, 0)
}
