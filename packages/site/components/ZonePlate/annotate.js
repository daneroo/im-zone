const jsYellow = '#f7df1e'
const gopherBlue = 'rgb(1, 173, 216)'
const rust = 'rgb(183,65,14)'
const rendererColor = { JS: jsYellow, Rust: rust, Go: gopherBlue }

const allEngines = { JS: true, Rust: true, Go: true }
// ctx, renderer, width, height, elapsed
export function annotate ({
  avgFps = 0, avgElapsed = 0, frame = 0, frames = 60,
  // the rest of the component context
  ctx, engines = allEngines, renderer, width, height, hostid,
  overlayColor // overlay color, in lieu of showInfo
} = {}) {
  const padding = 2
  const baseFontSize = (width < 150) ? 16 : 20
  const fontFamily = 'monospace'

  // We need the ctx to fillText, etc..
  // const { ctx } = backing

  // const engines = getEngines()

  // overlayColor is a quick shortcut, should add annotation options
  if (overlayColor) {
  // early return if overlayColor
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = overlayColor
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
    return
  }
  // renderer color overlay
  if (engines[renderer]) {
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = overlayColor || rendererColor[renderer] || 'red'
    ctx.fillRect(0, 0, width, height)
    ctx.restore()
  }
  // Renderer Name
  ctx.save()
  ctx.font = `${baseFontSize * 2}px ${fontFamily}`
  ctx.shadowColor = 'black'
  ctx.shadowBlur = 6
  ctx.fillStyle = rendererColor[renderer] || 'red'
  ctx.textAlign = 'right'
  ctx.textBaseline = 'top'
  ctx.fillText(renderer, width - padding, padding)
  ctx.restore()

  // for stamp/fps/elapsed
  ctx.save()
  ctx.font = `${baseFontSize}px monospace`
  ctx.shadowColor = 'black'
  ctx.shadowBlur = 4
  ctx.fillStyle = 'white'

  // stamp
  const stamp = new Date().toISOString()
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
  // avgElapsed and avgFPS
  ctx.textAlign = 'left'
  ctx.textBaseline = 'top'
  if (avgElapsed || avgElapsed === 0) {
    ctx.fillText(`${avgElapsed.toFixed(1).padStart(3, ' ')}ms`, padding, padding)
  }
  if (avgFps) {
    ctx.fillText(`${avgFps.toFixed(0)}fps`, padding, padding + baseFontSize)
  }
  ctx.restore()

  //  The timeline 'dot'
  if (frame || frame === 0) {
    ctx.save()
    ctx.fillStyle = 'white'
    // ctx.shadowColor = 'black'
    // ctx.shadowBlur = 4

    ctx.beginPath()
    const x = width * frame / frames
    const y = 0
    const radius = Math.max(4, height * 0.01)
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
  if (hostid) {
    ctx.save()
    const clr = ulidColor(hostid)
    ctx.strokeStyle = clr
    ctx.lineWidth = 3
    ctx.strokeRect(0, 0, width, height)
    ctx.restore()
  }
}

const ENCODING = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // Crockford Base32
// return an hsl color (from the last char in the ulid)
// hsl(<funcOfUlid>deg, 100%, 50%)
// now return rgb()
function ulidColor (u) {
  if (typeof u === 'string' && u.length > 1) {
    const charIndex = ENCODING.indexOf(u[u.length - 1])
    if (charIndex >= 0) {
      const deg = Math.floor(charIndex * 360 / 32)
      // return `hsl(${deg}deg 100% 50%)`
      const [r, g, b] = hsl2Rgb(deg, 1, 0.5)
      return `rgb(${r},${g},${b})`
    }
  }
  return 'blue'
}

// h in [0,360] s,l in [0,1]
// -> r,g,b in [0,255]
function hsl2Rgb (h, s, l) {
  let r, g, b
  h = h / 360

  if (s === 0) {
    r = g = b = l
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue(p, q, h + 1 / 3)
    g = hue(p, q, h)
    b = hue(p, q, h - 1 / 3)
  }

  return [
    Math.max(0, Math.min(Math.round(r * 255), 255)),
    Math.max(0, Math.min(Math.round(g * 255), 255)),
    Math.max(0, Math.min(Math.round(b * 255), 255))
  ]

  function hue (p, q, t) {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return p + (q - p) * 6 * t
    if (t < 1 / 2) return q
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6

    return p
  }
};
