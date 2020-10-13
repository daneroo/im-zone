// To fetch and register our font, until we figure out how to get static assets into our API routes
import fs from 'fs'
import fetch from 'node-fetch'
// node-canvas API
import { createCanvas, createImageData, registerFont } from 'canvas'

import { renderJS } from '@daneroo/zoneplate-js'
import { importRust, importGo, annotate } from '../../components/ZonePlate'

export default async ({ query: { width = 400, height = width } } = {}, res) => {
  // validate width and height when they become query params
  width = Number(width)
  height = Number(height)
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // get and register the font, because node-canvas has no fonts
  await getAndRegisterFontOnlyOnce()

  // label as query param ?
  const knownCoefs = {
    Spherical: { cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 },
    Hyperbolic: { cx2: 1, cy2: -1, cxt: 0, cyt: 0, ct: 1 },
    'Vertical-Temporal': { cx2: 0, cy2: 1, cxt: 1, cyt: 0, ct: 0 },
    'Horizontal-Temporal': { cx2: 1, cy2: 0, cxt: 0, cyt: 1, ct: 0 }
  }
  // pick a random label - not temporal - random could be a label
  const labels = Object.keys(knownCoefs).slice(0, 2)
  const randomLabel = labels[Math.floor(Math.random() * labels.length)]

  const { cx2, cy2, cxt, cyt, ct } = knownCoefs[randomLabel]
  const t = new Date().getSeconds() / 60
  const frames = 60

  // Could throw if we setup some error middleware..
  if (typeof ImageData !== 'undefined') {
    res.statusCode = 501 // Not Implemented
    res.end()
    return
  }

  // where we will render
  const imageData = createImageData(width, height)
  const { data } = imageData
  // set the alpha channel to 255, so the renderers don't have to
  // actually set all components with typedarray.fill(value)
  data.fill(255)

  // select renderer - randomly
  const renderers = ['JS', 'Rust', 'Go']
  const renderer = renderers[Math.floor(Math.random() * renderers.length)]

  // dynamic loading ?
  // const renderFunc = (renderer==='Rust')?await (???) : renderJS

  const start = +new Date()
  if (renderer === 'Rust') {
    const renderRust = await importRust()
    console.log(renderRust)
    renderRust(data, width, height, frames, t, cx2, cy2, cxt, cyt, ct)
  } else if (renderer === 'Go') {
    const renderGo = await importGo()
    console.log(renderGo)
    renderGo(data, width, height, frames, t, cx2, cy2, cxt, cyt, ct)
  } else {
    // console.log('renderJS')
    renderJS(data, width, height, frames, t, cx2, cy2, cxt, cyt, ct)
  }

  // composite the image
  ctx.putImageData(imageData, 0, 0)

  const elapsed = +new Date() - start
  console.log({ renderer, elapsed })

  // annotate - or not
  annotate({ ctx, renderer, width, height, avgElapsed: elapsed })

  // const buffer = canvas.toBuffer('image/png')
  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')
  // res.end(buffer)
  canvas.createPNGStream().pipe(res)
}

// // requires path2d-polyfill or equivalent..
// //  or translate to moveto,line...
// function NextJSPath () {
//   /* global Path2D */
//   return Path2D('M34.992 23.495h27.855v2.219H37.546v16.699h23.792v2.219H37.546v18.334h25.591v2.219H34.992v-41.69zm30.35 0h2.96l13.115 18.334 13.405-18.334L113.055.207 83.1 43.756l15.436 21.429H95.46L81.417 45.683 67.316 65.185h-3.018L79.85 43.756 65.343 23.495zm34.297 2.219v-2.219h31.742v2.219h-14.623v39.47h-2.554v-39.47H99.64zM.145 23.495h3.192l44.011 66.003L29.16 65.185 2.814 26.648l-.116 38.537H.145v-41.69zm130.98 38.801c-.523 0-.914-.405-.914-.928 0-.524.391-.929.913-.929.528 0 .913.405.913.929 0 .523-.385.928-.913.928zm2.508-2.443H135c.019.742.56 1.24 1.354 1.24.888 0 1.391-.535 1.391-1.539v-6.356h1.391v6.362c0 1.808-1.043 2.849-2.77 2.849-1.62 0-2.732-1.01-2.732-2.556zm7.322-.08h1.379c.118.853.95 1.395 2.149 1.395 1.117 0 1.937-.58 1.937-1.377 0-.685-.521-1.097-1.708-1.377l-1.155-.28c-1.62-.38-2.36-1.166-2.36-2.487 0-1.602 1.304-2.668 3.26-2.668 1.82 0 3.15 1.066 3.23 2.58h-1.354c-.13-.828-.85-1.346-1.894-1.346-1.1 0-1.832.53-1.832 1.34 0 .642.472 1.01 1.64 1.284l.987.243c1.838.43 2.596 1.178 2.596 2.53 0 1.72-1.33 2.799-3.453 2.799-1.987 0-3.323-1.029-3.422-2.637z')
// }

// this will be (latch) promise
let successfullyRegistered = null

// This might need a little work, but seems close enough
// first invocation return a promise
// every subsequent invocation awaits that same promise
async function getAndRegisterFontOnlyOnce () {
  if (!successfullyRegistered) {
    successfullyRegistered = getAndRegisterFont()
    await successfullyRegistered
  } else {
    // console.log('Roboto Mono already registered or registering')
    await successfullyRegistered
  }
}
async function getAndRegisterFont () {
  const woffUrl = 'https://fonts.gstatic.com/s/robotomono/v12/L0xuDF4xlVMF-BfR8bXMIhJHg45mwgGEFl0_3vq_ROW-AJi8SJQt.woff'
  const fontFilePath = '/tmp/robotomono.woff'
  try {
    console.log('fetching', woffUrl, 'to', fontFilePath)
    const res = await fetch(woffUrl)
    const fileStream = fs.createWriteStream(fontFilePath)
    await new Promise((resolve, reject) => {
      res.body.pipe(fileStream)
      res.body.on('error', (err) => {
        reject(err)
      })
      fileStream.on('finish', function () {
        resolve()
      })
    })
    registerFont(fontFilePath, { family: 'monospace' })
    console.log('Roboto Mono registered as monospace')
  } catch (error) {
    console.error(error)
  }
}
