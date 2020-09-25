import { createCanvas } from 'canvas'

export default async ({ query: { a = 40, b = 2 } } = {}, res) => {
  const width = 320
  const height = 200
  const canvas = createCanvas(width, height)
  const context = canvas.getContext('2d')
  context.fillStyle = randomColor()
  context.fillRect(0, 0, width, height)

  const text = new Date().toISOString()

  context.font = 'bold 20px monospace'
  context.textAlign = 'center'
  context.fillStyle = '#fff'
  context.fillText(text, width / 2, height / 2)

  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')

  // about 11 ms
  // const buffer = canvas.toBuffer('image/png')
  // res.end(buffer)

  canvas.createPNGStream().pipe(res) // about 9ms
}

function randomColor () {
  return `#${Math.floor(Math.random() * 4096).toString(16)}`
}
