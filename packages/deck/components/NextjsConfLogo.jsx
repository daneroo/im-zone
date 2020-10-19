import { View } from './ZonePlate'

export function NextjsConfLogoBG() {
  const size = 200
  const propsHyper = {
    width: size * 8,
    height: size * 8,
    coefs: { cx2: -0.866, cy2: 0.5, cxt: 0, cyt: 0, ct: 4 },
    renderer: 'JS',
  }

  const spheres = [
    // gradients from the svg icons
    // background: `linear-gradient(90deg,rgba(236,97,147,${alpha}),rgba(236,75,49,${alpha}))`, // globe
    // background: `linear-gradient(90deg,rgba(255,188,41,${alpha}),rgba(234,223,88,${alpha}))`, // image
    // background: `linear-gradient(90deg,rgba(87,200,79,${alpha}),rgba(83,160,236,${alpha}))`, //activity

    // reverse the order: activity,image,globe
    // hueRot no longer used
    { left: 516, hueRot: 140, t0: 80, ct: -2, overlayColor:'#54acbe'}, // activity:in the middle of the blue-green gradient
    { left: 418, hueRot: 0, t0: 40, ct: 2, overlayColor:'rgb(255,188,41)'}, // image:yellow (left) side of image gradient
    { left: 320, hueRot: 280, t0: 0, ct: -2, overlayColor:'rgb(236,75,49)'}, // globe:red side of globe gradient
  ]

  return (
    <div>
      {spheres.map(({ left, hueRot, t0, ct, overlayColor }) => {
        const propsSphere = {
          width: size,
          height: size,
          coefs: { cx2: 0.707, cy2: 0.707, cxt: 0, cyt: 0, ct },
          frames: 240,
          pause: false,
          //showInfo: true,
          shuttle: false,
          renderer: 'JS',
          overlayColor
        }

        return (
          <AbsoluteCenteredFloat
            top={320}
            left={left}
            // filter={`hue-rotate(${hueRot}deg)`}
          >
            <View {...propsSphere} t0={t0}></View>
          </AbsoluteCenteredFloat>
        )
      })}
      <div style={{ zIndex: 1 }}>
        <AbsoluteCenteredFloat
          opacity={0.3}
          top={234}
          clipRadius={600}
          left={-100}
        >
          <View {...propsHyper}></View>
        </AbsoluteCenteredFloat>
      </div>
    </div>
  )
}

export function NextjsConfLogo({
  color = 'rgba(255,255,255,.35)',
  iconColor='#fff',
  alpha = 0.6, // of the logo itself
}) {
  return (
    <div
      style={{
        display: 'inline-block',
        // display: 'flex',
        maxWidth: 720,
        alignItems: 'center',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          color,
        }}
      >
        <div class="conf-logo_next-logo__1J6d6">
          <svg
            // height="50"
            viewBox="0 0 148 90"
            version="1.1"
            style={{
              transform: 'translateX(4%)',
              shapeRendering: 'auto',
              marginRight: '25px',
              // height: '112.33px',
              height: 240,
            }}
          >
            <path
              d="M34.992 23.495h27.855v2.219H37.546v16.699h23.792v2.219H37.546v18.334h25.591v2.219H34.992v-41.69zm30.35 0h2.96l13.115 18.334 13.405-18.334L113.055.207 83.1 43.756l15.436 21.429H95.46L81.417 45.683 67.316 65.185h-3.018L79.85 43.756 65.343 23.495zm34.297 2.219v-2.219h31.742v2.219h-14.623v39.47h-2.554v-39.47H99.64zM.145 23.495h3.192l44.011 66.003L29.16 65.185 2.814 26.648l-.116 38.537H.145v-41.69zm130.98 38.801c-.523 0-.914-.405-.914-.928 0-.524.391-.929.913-.929.528 0 .913.405.913.929 0 .523-.385.928-.913.928zm2.508-2.443H135c.019.742.56 1.24 1.354 1.24.888 0 1.391-.535 1.391-1.539v-6.356h1.391v6.362c0 1.808-1.043 2.849-2.77 2.849-1.62 0-2.732-1.01-2.732-2.556zm7.322-.08h1.379c.118.853.95 1.395 2.149 1.395 1.117 0 1.937-.58 1.937-1.377 0-.685-.521-1.097-1.708-1.377l-1.155-.28c-1.62-.38-2.36-1.166-2.36-2.487 0-1.602 1.304-2.668 3.26-2.668 1.82 0 3.15 1.066 3.23 2.58h-1.354c-.13-.828-.85-1.346-1.894-1.346-1.1 0-1.832.53-1.832 1.34 0 .642.472 1.01 1.64 1.284l.987.243c1.838.43 2.596 1.178 2.596 2.53 0 1.72-1.33 2.799-3.453 2.799-1.987 0-3.323-1.029-3.422-2.637z"
              // fill="#fff"
              fill="currentColor"
              fillRule="nonzero"
            ></path>
          </svg>
        </div>
        <div class="conf-logo_text-and-icons___m8pP">
          <div
            class="conf-logo_text-conf__O4DdM"
            style={{
              fontFamily: 'sans-serif', // mine
              fontWeight: 700,
              // fontSize: 25,
              // lineHeight: '25px',
              // marginBottom: 8,
              fontSize: 50,
              lineHeight: '50px',
              marginBottom: 16,
              textTransform: 'uppercase',
            }}
          >
            Conf
          </div>
          <div
            class="conf-logo_header-icons__TAh2z"
            style={{
              display: 'flex',
              color: iconColor,
              justifyContent: 'space-between',
            }}
          >
            <div
              class="conf-logo_icon-background__3xSbg conf-logo_icon-globe__14HQv"
              style={{
                // opacity:0.5,
                // background: 'linear-gradient(90deg,#ec6193,#ec4b31)',
                background: `linear-gradient(90deg,rgba(236,97,147,${alpha}),rgba(236,75,49,${alpha}))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                // width: '24px',
                // height: '24px',
                width: 48,
                height: 48,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                height="16"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M2 12h20"></path>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"></path>
              </svg>
            </div>
            <div
              class="conf-logo_icon-background__3xSbg conf-logo_icon-image__3ZVq0"
              style={{
                // opacity:0.5,
                // background: 'linear-gradient(90deg,#ffbc29,#eadf58)',
                background: `linear-gradient(90deg,rgba(255,188,41,${alpha}),rgba(234,223,88,${alpha}))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                // width: '24px',
                // height: '24px',
                width: 48,
                height: 48,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                height="16"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <path d="M21 15l-5-5L5 21"></path>
              </svg>
            </div>
            <div
              class="conf-logo_icon-background__3xSbg conf-logo_icon-activity__3me5q"
              style={{
                // opacity:0.5,
                // background: 'linear-gradient(90deg,#57c84f,#53a0ec)',
                background: `linear-gradient(90deg,rgba(87,200,79,${alpha}),rgba(83,160,236,${alpha}))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                // width: '24px',
                // height: '24px',
                width: 48,
                height: 48,
              }}
            >
              <svg
                viewBox="0 0 24 24"
                height="16"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                fill="none"
                shapeRendering="geometricPrecision"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
              </svg>
            </div>
          </div>
        </div>
      </span>
    </div>
  )
}

function AbsoluteCenteredFloat({
  children,
  opacity = 0.7,
  filter = 'none',
  left = 0, // absolute position-left
  top = 0, // padding-top of inner div
  clipRadius = 70,
}) {
  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left,
        // top,
        right: 0,
        margin: 'auto',
        // width: '100px',
        // height: '100px',
      }}
    >
      <div
        style={{
          paddingTop: top,
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
