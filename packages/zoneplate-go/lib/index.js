
import { Go } from './wasm-go/wasm_exec_fixed'
// import { Go } from './wasm-go/wasm_exec_tinygo_fixed'

import wasmBase64Bytes from './wasm-go/main.wasm'
// or  './wasm-go/tinygo.wasm'

// These exported symbols are mutated once the WASM is asynchronously loaded
export let renderGo

// tinygo has memory issues...
// const tiny = false
// const wasmFile = `./wasm-go/${tiny ? 'tinygo' : 'main'}.wasm`

export async function importWasm () {
  // prevent from running on server for now
  if (typeof window !== 'undefined') {
    console.log('imported Go is a', typeof Go)
    const go = new Go()

    const wasm = await instantiateB64(wasmBase64Bytes, go.importObject)
    const { instance } = wasm

    //  run the go instance
    go.run(instance)

    // This is our mutable exported symbol
    console.log('window.DrawGo is a ', typeof window.DrawGo)
    renderGo = window.DrawGo

    console.log('imported Go WASM')
  } else {
    console.log('skipped importing Go WASM')
  }
}
importWasm()

export async function instantiateB64 (base64Bytes, imports) {
  const bytes = Buffer.from(base64Bytes, 'base64')
  console.log('Wasm size', { b64: base64Bytes.length, bytes: bytes.length })

  return instantiate(bytes, imports)
}
export async function instantiate (bytes, imports) {
  const wasm = await WebAssembly.instantiate(bytes, imports)
  return wasm
}

/* global WebAssembly fetch */
export async function instantiateStreaming () {
  if ('instantiateStreaming' in WebAssembly) {
    const wasm = await WebAssembly.instantiateStreaming(fetch(wasmFile), go.importObject)
    return wasm
  } else { // for Safari....
    const resp = await fetch(wasmFile)
    const bytes = await resp.arrayBuffer()
    const wasm = await WebAssembly.instantiate(bytes, go.importObject)
    return wasm
  }
}
