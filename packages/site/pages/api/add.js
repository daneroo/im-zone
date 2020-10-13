
export default async ({ query: { a = 40, b = 2 } } = {}, res) => {
  a = Number(a)
  b = Number(b)
  let answerRust

  const { add_rust: addRust } = await importWasm()

  if (typeof addRust !== 'undefined') {
    answerRust = addRust(40, 2)
  }
  const answerJS = a + b
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ answerJS, answerRust }))
}

// async function - uses dynamic import
async function importWasm () {
  const wasm = await import('@daneroo/zoneplate-rust')
  return wasm
}
