import { useState, useRef } from 'react'
import { withRouter } from 'next/router'
// import dynamic from 'next/dynamic'

async function importWasm () {
  const wasm = await import('../pkg')
  return wasm
}

function Adder () {
  const [number, setNumber] = useState(42)
  console.log({ number })
  async function add (a, b) {
    const { add_rust: addRust } = await importWasm()
    console.log(`adding numbers ${a},${b}`)
    return addRust(a, b)
  }
  return (
    <div>
      <h3>Simple Math</h3>
      <div>Number: {number}</div>
      <button onClick={async () => setNumber(await add(number, -1))}>-</button>
      <button onClick={async () => setNumber(await add(number, 1))}>+</button>
    </div>
  )
}

function Canvas () {
  const width = 720
  const height = 480
  const canvasRef = useRef(null)
  // canvas.current
  async function drawJS () {
    const ctx = canvasRef.current.getContext('2d')
    const imageData = ctx.getImageData(0, 0, width, height)
    const { data } = imageData
    let loop = 0
    function step () {
      loop++
      const offset = loop / 30
      const start = +new Date()
      renderJS(data, width, height, offset)
      ctx.putImageData(imageData, 0, 0)
      console.log(`drawJS.done in ${+new Date() - start}ms`)
      if (loop < 100) {
        window.requestAnimationFrame(step)
      }
    }
    for (let l = 0; l < 1; l++) {
      // step()
      window.requestAnimationFrame(step)
      // await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  async function drawRust () {
    const ctx = canvasRef.current.getContext('2d')
    const { draw } = await importWasm()

    let loop = 0
    function step () {
      loop++
      const offset = loop / 30
      const start = +new Date()
      draw(ctx, width, height, offset)
      console.log(`draw.done in ${+new Date() - start}ms`)
      if (loop < 100) {
        window.requestAnimationFrame(step)
      }
    }
    for (let l = 0; l < 1; l++) {
      // step()
      window.requestAnimationFrame(step)
      // await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }

  return (
    <div>
      <h3>Canvas Experiment</h3>
      <div>
        <button onClick={() => drawJS()}>DrawJS</button>
        <button onClick={() => drawRust()}>Draw Rust</button>
      </div>
      <canvas ref={canvasRef} style={{ border: '1px solid red' }} width={width} height={height} />
    </div>
  )
}

const Page = ({ router: { query } }) => {
  return (
    <div>
      <Adder />
      <Canvas />
    </div>
  )
}

// data is a width*height*4 ar
function renderJS (data, width, height, offset) {
  const cx = width / 2
  const cy = height / 2

  // const offset = Math.random() * 10
  for (let j = 0; j < height; j++) {
    const y = (j - cy) / height
    for (let i = 0; i < width; i++) {
      const x = (i - cx) / width
      const phi = x * x * width - y * y * height + offset
      const c = Math.floor(Math.sin(phi * Math.PI) * 126 + 127)
      const index = (j * width + i) * 4
      data[index + 0] = c // red
      data[index + 1] = c // green
      data[index + 2] = c // blue
      data[index + 3] = 255 // alpha
    }
  }
}

export default withRouter(Page)
