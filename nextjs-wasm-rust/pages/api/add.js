import { addRust } from '../../components/ZonePlate/renderRust'

export default async ({ query: { a = 40, b = 2 } } = {}, res) => {
  // TODO add latch variable for addRust?
  // const delay = 100
  // await new Promise(resolve => setTimeout(resolve, delay))
  a = Number(a)
  b = Number(b)
  let answerRust
  if (typeof addRust !== 'undefined') {
    answerRust = addRust(40, 2)
  }
  const answerJS = a + b
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify({ answerJS, answerRust }))
}
