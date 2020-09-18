
// These exported symbols are mutated once the WASM is asynchronously loaded
export let renderGo

// async function - uses dynamic import
// return {renderGo}
export async function importWasm () {
  console.log('importing Go WASM')

  await import('../../public/wasm-go/wasm_exec_fixed')
  // console.log('global.Go', window.Go)

  if (typeof window !== 'undefined') {
    /* global WebAssembly fetch */
    const go = new window.Go()
    const result = await WebAssembly.instantiateStreaming(fetch('/wasm-go/main.wasm'), go.importObject)
    // console.log({ result })

    go.run(result.instance)

    // console.log('Back from go.run')

    // console.log('Global Hello', window.Hello)
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // console.log('Calling Go')
    // window.HelloGo('Golang')

    renderGo = window.DrawGo

    console.log('imported Go WASM')
  } else {
    console.log('skipped importing Go WASM')
  }
}
importWasm()
