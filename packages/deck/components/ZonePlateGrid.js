import { View } from './ZonePlate'

export function ZonePlateGrid({
  size = 400,
  pause = true,
  showInfo = false,
  renderer = 'JS',
  randomize = false,
  variants = [{}],
  urlView = false,
} = {}) {
  const [rand, setRand] = React.useState(Math.random())
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-around',
        flexWrap: 'wrap',
      }}
    >
      {randomize ? (
        <RandButton onClick={() => setRand(Math.random())} />
      ) : (
        <></>
      )}
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
        if (urlView) {
          return <URLView {...props} />
        }
        return <View {...props} />
      })}
    </div>
  )
}

function URLView({ width = 400, height = width, renderer = 'random' }) {
  // TODO change this if we deploy api route in deck
  const baseURI = 'https://zone.v.daneroo.com'
  return (
    <img
      {...{
        width,
        height,
        src: `${baseURI}/api/zone?width=${width}&height=${height}&r=${renderer}&bust=${Math.random()}`,
      }}
    />
  )
}

function RandButton({ onClick }) {
  return (
    <button
      style={{
        backgroundColor: 'Transparent',
        backgroundRepeat: 'no-repeat',
        border: 'none',
        cursor: 'pointer',
        overflow: 'hidden',
        outline: 'none',
      }}
      onClick={onClick}
    >
      🎲{' '}
    </button>
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
