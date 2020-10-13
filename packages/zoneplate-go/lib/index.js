
import { Go } from './wasm-go/wasm_exec_fixed'
// import { Go } from './wasm-go/wasm_exec_tinygo_fixed'

import wasmBase64Bytes from './wasm-go/main.wasm'
// or  './wasm-go/tinygo.wasm'

// tinygo has memory issues...
// const tiny = false
// const wasmFile = `./wasm-go/${tiny ? 'tinygo' : 'main'}.wasm`

// latch variable, so we don't start the runtime more than once
let renderGo = null
export async function importWasm () {
  // prevent from instantiating runtime more that once
  if (renderGo) {
    // console.log('Already instantiated')
    return { renderGo }
  }
  try {
    const go = new Go()

    const wasm = await instantiateB64(wasmBase64Bytes, go.importObject)
    const { instance } = wasm

    //  run the go instance
    go.run(instance)
    console.log('Running new Go instance')

    // get the exposed Go func from appropriate context
    if (typeof window !== 'undefined') {
      // console.log('found window.DrawGo', window.DrawGo)
      renderGo = window.DrawGo
    } else if (typeof global !== 'undefined') {
      // console.log('found global.DrawGo', global.DrawGo)
      renderGo = global.DrawGo
    } else {
      renderGo = () => {
        console.error('Go: instantiated global object not found')
      }
    }
    return { renderGo }
  } catch (error) {
    console.error(error)
    console.error('skipped importing Go WASM')
  }
}

async function instantiateB64 (base64Bytes, imports) {
  const bytes = Buffer.from(base64Bytes, 'base64')
  // console.log('Wasm size', { b64: base64Bytes.length, bytes: bytes.length })
  return instantiate(bytes, imports)
}

/* global WebAssembly */
async function instantiate (bytes, imports) {
  const wasm = await WebAssembly.instantiate(bytes, imports)
  return wasm
}

//* global WebAssembly fetch */
// export async function instantiateStreaming () {
//   if ('instantiateStreaming' in WebAssembly) {
//     const wasm = await WebAssembly.instantiateStreaming(fetch(wasmFile), go.importObject)
//     return wasm
//   } else { // for Safari....
//     const resp = await fetch(wasmFile)
//     const bytes = await resp.arrayBuffer()
//     const wasm = await WebAssembly.instantiate(bytes, go.importObject)
//     return wasm
//   }
// }
