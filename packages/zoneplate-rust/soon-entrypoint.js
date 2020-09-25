
// Not yet used

// These exported symbols are mutated once the WASM is asynchronously loaded
export let addRust
export let renderRust
export let alloc
export let dealloc

// async function - uses dynamic import
// imports {add_rust,alloc,dealloc,draw}
// then sets the exported variables
export async function importWasm () {
  const wasm = await import('./pkg')

  // Set our mutable exported variables
  addRust = wasm.add_rust
  renderRust = wasm.draw // renamed from the rust export
  alloc = wasm.alloc
  dealloc = wasm.dealloc
  console.log('imported Rust WASM')

  // also return these values, if we want use them as an async invocation
  return {
    addRust,
    renderRust,
    alloc,
    dealloc
  }
}
importWasm()
