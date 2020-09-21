import { createCanvas } from 'canvas'
import { renderRust } from '../../components/ZonePlate/renderRust'
import { renderJS } from '../../components/ZonePlate/renderJS'

export default async ({ query: { a = 40, b = 2 } } = {}, res) => {
  const width = 400
  const height = 400
  const canvas = createCanvas(width, height)
  const ctx = canvas.getContext('2d')

  const knownParams = {
    Spherical: { cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 },
    Hyperbolic: { cx2: 1, cy2: -1, cxt: 0, cyt: 0, ct: 1 },
    'Vertical-Temporal': { cx2: 0, cy2: 1, cxt: 1, cyt: 0, ct: 0 },
    'Horizontal-Temporal': { cx2: 1, cy2: 0, cxt: 0, cyt: 1, ct: 0 }
  }

  const { cx2, cy2, cxt, cyt, ct } = knownParams.Spherical
  const t = new Date().getSeconds() / 60
  const frames = 60

  if (typeof ImageData !== 'undefined') {

  }
  if (typeof renderRust !== 'undefined') {
    console.log('renderRust')
    renderRust(ctx, width, height, frames, t, cx2, cy2, cxt, cyt, ct)
  } else {
    console.log('renderJS')
    renderJS(ctx, width, height, frames, t, cx2, cy2, cxt, cyt, ct)
  }

  // const buffer = canvas.toBuffer('image/png')
  res.statusCode = 200
  res.setHeader('Content-Type', 'image/png')
  // res.end(buffer)
  canvas.createPNGStream().pipe(res)
}

// const imageData = (typeof ImageData !== 'undefined')
// ? new ImageData(width, height)
// : createImageData(width, height)

// Fixed index_bg.js
// export const __wbg_newwithu8clampedarrayandsh_77815f5702eff971 = handleError(function (arg0, arg1, arg2, arg3) {
//   const imageData = (typeof ImageData !== 'undefined')
//     ? new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0)
//     : createImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0)
//   return addHeapObject(imageData)

//   // var ret = new ImageData(getClampedArrayU8FromWasm0(arg0, arg1), arg2 >>> 0, arg3 >>> 0);
//   // return addHeapObject(ret);
// })
