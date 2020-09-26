/* global WebAssembly fetch */

// These exported symbols are mutated once the WASM is asynchronously loaded
export let renderGo

// tinygo has memory issues...
const tiny = false
const wasmFile = `/wasm-go/${tiny ? 'tinygo' : 'main'}.wasm`

export async function importWasm () {
  if (tiny) {
    await import('./wasm-go/wasm_exec_tinygo_fixed.js')
  } else {
    await import('./wasm-go/wasm_exec_fixed.js')
  }

  // prevent from running on server for now
  if (typeof window !== 'undefined') {
    // console.log('global.Go is a ', typeof window.Go)
    const go = new window.Go()

    let wasm
    if ('instantiateStreaming' in WebAssembly) {
      wasm = await WebAssembly.instantiateStreaming(fetch(wasmFile), go.importObject)
    } else { // for Safari....
      const resp = await fetch(wasmFile)
      const bytes = await resp.arrayBuffer()
      wasm = await WebAssembly.instantiate(bytes, go.importObject)
    }

    //  run the go instance
    go.run(wasm.instance)

    // This is our mutable exported symbol
    // console.log('window.DrawGo is a ', typeof window.DrawGo)
    renderGo = window.DrawGo

    console.log('imported Go WASM')
  } else {
    console.log('skipped importing Go WASM')
  }
}
importWasm()
