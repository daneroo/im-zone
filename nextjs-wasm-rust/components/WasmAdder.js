
import { useState } from 'react'
import { Flex, Label, Button } from 'theme-ui'

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
      <div style={{ padding: 10 }}>
        Invokes an `add` function in Rust/WASM.
      </div>

      <Flex gap={2} columns={3}>
        <Button onClick={async () => setNumber(await add(number, -1))}>-</Button>
        <Label sx={{ maxWidth: 100 }}>Number: {number}</Label>
        <Button onClick={async () => setNumber(await add(number, 1))}>+</Button>
      </Flex>
    </div>
  )
}
