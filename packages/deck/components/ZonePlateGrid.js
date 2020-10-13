import { View } from './ZonePlate'

export function ZonePlateGrid({
  size = 400,
  pause = true,
  showInfo = false,
  renderer = 'JS',
  randomize = false,
  variants = [{}],
} = {}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }}
    >
      {variants.map((variant) => {
        const rCoefs = randomize ? randProps() : {}
        const props = {
          width: size,
          height: size,
          coefs: { cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 },
          pause,
          showInfo,
          shuttle: false,
          renderer,
          ...variant,
          ...rCoefs,
        }
        return <View {...props} />
      })}
    </div>
  )
}

// just coefs and renderer
function randProps() {
  const max = 2
  const r = () => Math.random() * max * 2 - max
  const renderers = ['JS', 'Rust', 'Go']
  return {
    coefs: {
      cx2: r(),
      cy2: r(),
      // cxt: r(),
      // cyt: r(),
      ct: r(),
    },
    shuttle: true,
    renderer: renderers[Math.floor(Math.random() * renderers.length)],
  }
}
