
import { useState } from 'react'
import { Flex, Button } from 'theme-ui'

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('@daneroo/zoneplate-rust')
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

      <Flex sx={{ gap: 1, justifyContent: 'flext-start', alignItems: 'center' }}>
        <Button onClick={async () => setNumber(await add(number, -1))}>-</Button>
        <label>Number: {number}</label>
        <Button onClick={async () => setNumber(await add(number, 1))}>+</Button>
      </Flex>
    </div>
  )
}
