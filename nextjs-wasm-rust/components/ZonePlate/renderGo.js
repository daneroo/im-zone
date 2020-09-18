
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

  if (typeof window !== 'undefined') {
    console.log('global.Go is a ', typeof window.Go)
    /* global WebAssembly fetch */
    const go = new window.Go()
    const result = await WebAssembly.instantiateStreaming(fetch(wasmFile), go.importObject)
    console.log({ result })

    go.run(result.instance)
    // console.log('go.run instance started')

    // this is our mutable exported symbol
    renderGo = window.DrawGo

    console.log('imported Go WASM')
  } else {
    console.log('skipped importing Go WASM')
  }
}
importWasm()
