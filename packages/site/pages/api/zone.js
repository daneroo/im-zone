import { createCanvas, createImageData } from 'canvas'

// mutable export
import { renderRust } from '../../components/ZonePlate/renderRust'
// dynamic import
// import { importWasm } from '../../components/ZonePlate/renderRust'

import { renderJS } from '@daneroo/zoneplate-js'

export default async ({ query: { a = 40, b = 2 } } = {}, res) => {
  // validate width and height when they become query params
  const width = 400
  const height = 400
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  // label as query param ?
  const knownParams = {
    Spherical: { cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 },
    Hyperbolic: { cx2: 1, cy2: -1, cxt: 0, cyt: 0, ct: 1 },
    'Vertical-Temporal': { cx2: 0, cy2: 1, cxt: 1, cyt: 0, ct: 0 },
    'Horizontal-Temporal': { cx2: 1, cy2: 0, cxt: 0, cyt: 1, ct: 0 }
  }
  // pick a random label - not temporal - random could be a label
  const labels = Object.keys(knownParams).slice(0, 2)
  const randomLabel = labels[Math.floor(Math.random() * labels.length)]

  const { cx2, cy2, cxt, cyt, ct } = knownParams[randomLabel]
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
  const renderer = ['JS', 'Rust'][Math.floor(Math.random() * 2)]

  // dynamic loading ?
  // const renderFunc = (renderer==='Rust')?await (???) : renderJS

  const start = +new Date()
  if (renderer === 'Rust' && renderRust) {
    console.log('renderRust')
    // const { renderRust } = await importWasm()
    renderRust(data, width, height, frames, t, cx2, cy2, cxt, cyt, ct)
  } else {
    console.log('renderJS')
    renderJS(data, width, height, frames, t, cx2, cy2, cxt, cyt, ct)
  }

  // composite the image
  ctx.putImageData(imageData, 0, 0)

  const elapsed = +new Date() - start
  // annotate - or not
  annotate(ctx, renderer, width, height, elapsed)

  // const buffer = canvas.toBuffer('image/png')
  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')
  // res.end(buffer)
  canvas.createPNGStream().pipe(res)
}

// common code with View
function annotate (ctx, renderer, width, height, elapsed) {
  const padding = 2
  const baseFontSize = (width < 150) ? 16 : 20

  const jsYellow = '#f7df1e'
  const gopherBlue = 'rgb(1, 173, 216)'
  const rust = 'rgb(183,65,14)'
  const rendererColor = { JS: jsYellow, Rust: rust, Go: gopherBlue }

  // renderer color overlay
  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  ctx.fillStyle = rendererColor[renderer] || 'red'
  ctx.fillRect(0, 0, width, height)
  ctx.restore()

  // renderer name
  ctx.font = `${baseFontSize * 2}px monospace`
  ctx.shadowColor = 'black'
  ctx.shadowBlur = 6
  ctx.fillStyle = rendererColor[renderer] || 'red'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'
  ctx.fillText(renderer, width - padding, padding)

  // stamp
  const stamp = new Date().toISOString()
  ctx.font = `${baseFontSize}px monospace`
  ctx.shadowColor = 'black'
  ctx.shadowBlur = 4
  ctx.fillStyle = 'white'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'
  if (width < 300) {
    // time portion
    ctx.fillText(stamp.substr(11, 10), width / 2, height - padding)
    if (width > 150) {
      // date portion above
      ctx.fillText(stamp.substr(0, 10), width / 2, height - baseFontSize - padding)
    }
  } else {
    // show timestamp one line
    ctx.fillText(stamp.substr(0, 22), width / 2, height - padding)
  }

  // ctx.shadowColor = 'white'
  // ctx.fillStyle = 'black'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  if (elapsed) {
    ctx.fillText(`${elapsed.toFixed(1).padStart(3, ' ')}ms`, padding, padding)
  }

  // // NextJSPath.js
  // ctx.fillStyle = 'white'
  // ctx.fill(NextJSPath())
}

// // requires path2d-polyfill or equivalent..
// //  or translate to moveto,line...
// function NextJSPath () {
//   /* global Path2D */
//   return Path2D('M34.992 23.495h27.855v2.219H37.546v16.699h23.792v2.219H37.546v18.334h25.591v2.219H34.992v-41.69zm30.35 0h2.96l13.115 18.334 13.405-18.334L113.055.207 83.1 43.756l15.436 21.429H95.46L81.417 45.683 67.316 65.185h-3.018L79.85 43.756 65.343 23.495zm34.297 2.219v-2.219h31.742v2.219h-14.623v39.47h-2.554v-39.47H99.64zM.145 23.495h3.192l44.011 66.003L29.16 65.185 2.814 26.648l-.116 38.537H.145v-41.69zm130.98 38.801c-.523 0-.914-.405-.914-.928 0-.524.391-.929.913-.929.528 0 .913.405.913.929 0 .523-.385.928-.913.928zm2.508-2.443H135c.019.742.56 1.24 1.354 1.24.888 0 1.391-.535 1.391-1.539v-6.356h1.391v6.362c0 1.808-1.043 2.849-2.77 2.849-1.62 0-2.732-1.01-2.732-2.556zm7.322-.08h1.379c.118.853.95 1.395 2.149 1.395 1.117 0 1.937-.58 1.937-1.377 0-.685-.521-1.097-1.708-1.377l-1.155-.28c-1.62-.38-2.36-1.166-2.36-2.487 0-1.602 1.304-2.668 3.26-2.668 1.82 0 3.15 1.066 3.23 2.58h-1.354c-.13-.828-.85-1.346-1.894-1.346-1.1 0-1.832.53-1.832 1.34 0 .642.472 1.01 1.64 1.284l.987.243c1.838.43 2.596 1.178 2.596 2.53 0 1.72-1.33 2.799-3.453 2.799-1.987 0-3.323-1.029-3.422-2.637z')
// }