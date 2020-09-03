
import { useState } from 'react'

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('../pkg')
  return wasm
}

export default function WasmAdder () {
  const [number, setNumber] = useState(42)

  async function add (a, b) {
    const { add_rust: addRust } = await importWasm()
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
