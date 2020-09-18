
// These exported symbols are mutated once the WASM is asynchronously loaded
export let renderRust
export let alloc
export let dealloc

// async function - uses dynamic import
// imports {add_rust,alloc,dealloc,draw}
// then sets the exported variables
async function importWasm () {
  const wasm = await import('../../pkg')
  // const { draw: renderRust, alloc, dealloc } = wasm
  renderRust = wasm.draw // renamed from the rust export
  alloc = wasm.alloc
  dealloc = wasm.dealloc
  console.log('imported Rust WASM')
}
importWasm()
