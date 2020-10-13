import { renderJS } from '@daneroo/zoneplate-js'

// Careful: these symbols are mutable
// Their values change from undefined to the actual function reference
// after the appropriate async WASM has loaded

let renderRust
let renderGo

// This function is synchronous, and returns the currently loaded rendered
export function getEngines () {
  return {
    JS: renderJS,
    Rust: renderRust,
    Go: renderGo
  }
}

export async function importAll () {
  await [importRust(), importGo()]
  return getEngines()
}

export async function importRust () {
  const wasm = await import('@daneroo/zoneplate-rust')

  // Set our mutable variable for getEngines
  if (!renderRust) { // just log the first time..
    console.log('imported Rust WASM')
  }
  renderRust = wasm.draw // renamed from the rust export
  return renderRust
}
// importRust()

export async function importGo () {
  const { importWasm } = await import('@daneroo/zoneplate-go')
  const { renderGo: dynamicallyImportedRenderGo } = await importWasm()

  // Set our mutable variable for getEngines
  if (!renderGo) {
    console.log('imported Go WASM')
  }
  renderGo = dynamicallyImportedRenderGo
  return renderGo
}
// importGo()
