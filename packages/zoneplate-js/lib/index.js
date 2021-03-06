
// data is a width*height*4 Uint8ClampedArray

export function renderJS (data, width, height, frames, t, cx2, cy2, cxt, cyt, ct) {
  const cx = width / 2
  const cy = height / 2

  // originally: x=(i/W), y=(j/H) both in [0,1]
  // phi = cx2 * x^2*W + cy2*y^2*H + cxt*x*t*F*F/2 + cyt*y*t*F*F/2 + ct*t*F

  let index = 0
  const ctt = ct * frames * t

  for (let j = -cy; j < height - cy; j++) {
    const cy2y2 = (cy2) ? (cy2 * j * j / height) : 0
    const cytyt = (cyt) ? (cyt * (j / height) * (t * frames * frames / 2)) : 0
    const cy2y2cytytctt = cy2y2 + cytyt + ctt
    for (let i = -cx; i < width - cx; i++) {
      const cx2x2 = (cx2) ? (cx2 * i * i / width) : 0

      // TODO: this is not periodic in t : same goes for cytyt
      //  but we have phi(t)==phi(frames-t) ..check?
      const cxtxt = (cxt) ? (cxt * (i / width) * (t * frames * frames / 2)) : 0

      const phi = (cx2x2 + cxtxt + cy2y2cytytctt) * Math.PI

      // Inline trig calculation - Math.cos - Way Slower
      // const c = Math.floor(Math.cos(phi) * 126 + 127)

      // Use the Cosine lookup table - Slower
      // const c = Cosine(phi)

      // Use the Cosine lookup table - with inlined index calc
      const absPhi = (phi < 0) ? -phi : phi
      const iPhi = Math.floor(Q * absPhi / (2 * Math.PI)) % Q
      const c = cosineLookup[iPhi]

      // yellow = red+green
      data[index + 0] = c // red
      data[index + 1] = c // green
      data[index + 2] = c // blue
      // data[index + 3] = 255 // alpha // set once in getCachedImageData
      index += 4
    }
  }
  // ctx.putImageData(imageData, 0, 0)
}

const Q = 1024
const cosineLookup = Array.from({ length: Q }, (_, iPhi) => {
  const phi = iPhi * 2 * Math.PI / Q
  return Math.cos(phi) * 126.0 + 127.0
})

// This index calculation was inlined for performance
// So commented for possible future use
// function Cosine (phi) {
//   const absPhi = (phi < 0) ? -phi : phi
//   const iPhi = Math.floor(Q * absPhi / (2 * Math.PI)) % Q
//   return cosineLookup[iPhi]
// }
