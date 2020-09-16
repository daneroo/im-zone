/* global ImageData */

// async to match interface contract
// Could be fixed with better WASM loader setup..
export async function renderJS (ctx, width, height, frames, t, cx2, cy2, cxt, cyt, ct) {
  // const imageData = ctx.getImageData(0, 0, width, height)
  // Was replaced with a cached allocated ImageData array
  const imageData = getCachedImageData(width, height)

  // data is a width*height*4 array
  const { data } = imageData

  const cx = width / 2
  const cy = height / 2

  let index = 0
  // originally as : tPart = ct * t * frames
  const ctt = ct * frames * t

  for (let j = -cy; j < height - cy; j++) {
    // originally written as yPart = cy2 * (j/height)^2 * height
    const cy2y2 = (cy2) ? (cy2 * j * j / height) : 0
    const cytyt = (cyt) ? (cyt * (t * frames * frames / 2) * (j / height)) : 0
    const cy2y2cytytctt = cy2y2 + cytyt + ctt
    for (let i = -cx; i < width - cx; i++) {
      // for x = i/width => [-.5,.5]
      // originally written as xPart = cx2 * (i/width)^2 * width
      const cx2x2 = (cx2) ? (cx2 * i * i / width) : 0
      // TODO: this is not periodic in t
      //   but we have phi(t)==phi(frames-t) ..check?
      const cxtxt = (cxt) ? (cxt * (t * frames * frames / 2) * (i / width)) : 0

      const phi = (cx2x2 + cxtxt + cy2y2cytytctt) * Math.PI

      // Inline trig calculation - Math.cos
      // const c = Math.floor(Math.cos(phi) * 126 + 127)

      // Use the Cosine lookup table
      // const c = Cosine(phi)

      // Use the Cosine lookup table - with inlined index calc
      const absPhi = (phi < 0) ? -phi : phi
      const iPhi = Math.floor(Q * absPhi / (2 * Math.PI)) % Q
      const c = cosineLookup[iPhi]

      // const index = (j * width + i) * 4
      data[index + 0] = c // red
      data[index + 1] = c // green
      // data[index + 2] = c // blue
      // data[index + 3] = 255 // alpha // set once in getCachedImageData
      index += 4
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

const Q = 1024
const cosineLookup = Array.from({ length: Q }, (_, iPhi) => {
  const phi = iPhi * 2 * Math.PI / Q
  return Math.cos(phi) * 126.0 + 127.0
})

// This index calculation was inlined
// So commented for possible future use
// function Cosine (phi) {
//   const absPhi = (phi < 0) ? -phi : phi
//   const iPhi = Math.floor(Q * absPhi / (2 * Math.PI)) % Q
//   return cosineLookup[iPhi]
// }

// Simply Reuse ImageData for each render
// This avoids re-allocating the data structure - unless width/height change
const reuseImageData = {}
function getCachedImageData (width, height) {
  const key = JSON.stringify({ width, height })
  if (!reuseImageData[key]) {
    Object.keys(reuseImageData).forEach((key) => {
      // console.log('de-alloc imagedata', key)
      delete reuseImageData[key]
    })
    // console.log('alloc imagedata', key)
    const imageData = new ImageData(width, height)
    const { data } = imageData
    for (let i = 0; i < width * height * 4; i += 4) {
      data[i + 3] = 255
    }
    reuseImageData[key] = imageData
    return imageData
  }
  const imageData = reuseImageData[key]
  return imageData
}
