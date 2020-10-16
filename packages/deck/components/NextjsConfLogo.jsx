import { View } from './ZonePlate'

export function NextjsConfLogo() {
  const size = 200
  const propsSphere = {
    width: size,
    height: size,
    coefs: { cx2: 0.5, cy2: 0.5, cxt: 0, cyt: 0, ct: -0.5 },
    pause: false,
    showInfo: true,
    shuttle: false,
    renderer: 'JS',
  }
  const propsHyper = {
    ...propsSphere,
    width: size * 8,
    height: size * 8,
    coefs: { cx2: -0.5, cy2: 0.5, cxt: 0, cyt: 0, ct: 1 },
    showInfo: false,
    pause: true,
  }

  return (
    <>
      <AbsoluteCenteredFloat left={0} filter={'hue-rotate(280deg)'}>
        <View {...propsSphere}></View>
      </AbsoluteCenteredFloat>
      <AbsoluteCenteredFloat left={200} filter={'hue-rotate(0deg)'}>
        <View {...propsSphere}></View>
      </AbsoluteCenteredFloat>
      <AbsoluteCenteredFloat left={400} filter={'hue-rotate(140deg)'}>
        <View {...propsSphere}></View>
      </AbsoluteCenteredFloat>
      <div style={{ zIndex: 1 }}>
        <AbsoluteCenteredFloat
          opacity={0.1}
          top={200}
          clipRadius={600}
          left={-400}
        >
          <View {...propsHyper}></View>
        </AbsoluteCenteredFloat>
      </div>
    </>
  )
}

function AbsoluteCenteredFloat({
  children,
  opacity = 0.7,
  filter = 'none',
  left = 0,
  top = 0,
  clipRadius = 100,
}) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left,
        top,
        right: 0,
        margin: 'auto',
        // width: '100px',
        // height: '100px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          height: '100vh',
          opacity,
          filter,
          color: 'gray',
        }}
      >
        <div
          style={{
            clipPath: `circle(${clipRadius}px at center)`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
