const jsYellow = '#f7df1e'
const gopherBlue = 'rgb(1, 173, 216)'
const rust = 'rgb(183,65,14)'
const rendererColor = { JS: jsYellow, Rust: rust, Go: gopherBlue }

const allEngines = { JS: true, Rust: true, Go: true }
// ctx, renderer, width, height, elapsed
export function annotate ({
  avgFps = 0, avgElapsed = 0, frame = 0,
  // the rest of the component context
  ctx, engines = allEngines, renderer, width, height
} = {}) {
  const padding = 2
  const baseFontSize = (width < 150) ? 16 : 20
  const fontFamily = 'monospace'

  // We need the ctx to fillText, etc..
  // const { ctx } = backing

  // const engines = getEngines()

  // renderer color overlay
  if (engines[renderer]) {
    ctx.save()
    ctx.globalCompositeOperation = 'multiply'
    ctx.fillStyle = rendererColor[renderer] || 'red'
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
    const x = width * frame / 60
    const y = 0
    const radius = Math.max(4, height * 0.01)
    ctx.arc(x, y, radius, 0, 2 * Math.PI)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }
}
