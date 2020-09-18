/* global WebAssembly fetch */

// These exported symbols are mutated once the WASM is asynchronously loaded
export let renderGo

// tinygo has memory issues...
const tiny = false
const wasmFile = `/wasm-go/${tiny ? 'tinygo' : 'main'}.wasm`
// async function - uses dynamic import
// return {renderGo}
export async function importWasm () {
  console.log('importing Go WASM')

  if (tiny) {
    await import('../../public/wasm-go/wasm_exec_tinygo_fixed.js')
  } else {
    await import('../../public/wasm-go/wasm_exec_fixed.js')
  }

  // prevent from running on server for now
  if (typeof window !== 'undefined') {
    // console.log('global.Go is a ', typeof window.Go)
    const go = new window.Go()

    let wasm
    if ('instantiateStreaming' in WebAssembly) {
      wasm = await WebAssembly.instantiateStreaming(fetch(wasmFile), go.importObject)
      // console.log('instantiateStreaming - Got wasm', wasm)
    } else {
      const resp = await fetch(wasmFile)
      // console.log('instantiate - Got response')
      const bytes = await resp.arrayBuffer()
      // console.log('instantiate - Got bytes', bytes.byteLength)
      wasm = await WebAssembly.instantiate(bytes, go.importObject)
      // console.log('instantiate - Got wasm', wasm)
    }

    go.run(wasm.instance)
    console.log('go.run instance started')

    console.log('window.DrawGo is a ', typeof window.DrawGo)

    // this is our mutable exported symbol
    renderGo = window.DrawGo

    console.log('imported Go WASM')
  } else {
    console.log('skipped importing Go WASM')
  }
}
importWasm()
