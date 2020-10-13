import { useState } from 'react'
import { Grid, Flex, Box, Button, useThemeUI } from 'theme-ui'

import IconButton from './layout/icons/IconButton'
import PlayPause from './layout/icons/PlayPause'
import Info from './layout/icons/Info'

import { Presets, FullSettings } from './ZonePlateControls'
import { Equation } from '@daneroo/zoneplate'
import { View } from './ZonePlate'

export default function ZonePlatePlayground () {
  const [shuttle, setShuttle] = useState(false)
  const [renderer, setRenderer] = useState('JS')
  // animation state
  const [pause, setPause] = useState(true)
  const [showInfo, setShowInfo] = useState(true)

  // These control the size and coefficients od the ZonePlate
  const [coefs, setCoefs] = useCoefs()
  const [width, height, size, sizes, setSize] = useSizes()

  const { theme: { colors: { text } } } = useThemeUI()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <Presets {...{ coefs, setCoefs, size, setSize, sizes, shuttle, setShuttle, renderer, setRenderer }} />
      <Box>
        <Equation coefs={coefs} />
      </Box>
      <Flex sx={{
        width: sizes[size].width,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      >
        <IconButton
          size={24}
          label='Show Render Info'
          icon={<Info show={showInfo} />}
          onClick={() => setShowInfo(!showInfo)}
        />
        <Box sx={{
          fontSize: 0,
          // alignSelf: 'flex-end',
          opacity: 0.8
        }}
        >{(width * height * 60 / 1e6).toFixed(1)} Mp/s
        </Box>
        <IconButton
          size={24}
          label='Play/Pause'
          icon={<PlayPause pause={pause} />}
          onClick={() => setPause(!pause)}
        />
      </Flex>
      <Box
        sx={{
          boxSizing: 'content-box',
          border: `1px solid ${text}`,
          padding: 2,
          width: width,
          height: height
        }}
        onClick={() => setPause(!pause)}
      >
        <View {...{ width, height, coefs, pause, showInfo, shuttle, renderer }} />
      </Box>
      <FullSettings {...{ coefs, setCoefs, sizes, size, setSize, shuttle, setShuttle }} />
      <ManyMore />
    </Flex>
  )
}

function ManyMore () {
  const howMany = 60

  const [showMany, setShowMany] = useState(false)
  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <Button onClick={() => setShowMany(!showMany)}>Random Zones...</Button>
      {showMany && (
        <Grid sx={{
        // minWidth: '500px',
          maxWidth: [500, 600, 700],
          gridTemplateColumns: 'repeat(auto-fit,120px)',
          alignItems: 'center'
        }}
        >
          <ManyZones howMany={howMany} />
        </Grid>
      )}
    </Flex>

  )
}
function randSettings () {
  const max = 2
  const r = () => Math.random() * max * 2 - max
  const renderers = ['JS', 'Rust', 'Go']
  return {
    coefs: {
      cx2: r(),
      cy2: r(),
      cxt: r(),
      cyt: r(),
      ct: r()
    },
    pause: Math.random() < 0.5,
    renderer: renderers[Math.floor(Math.random() * renderers.length)]
  }
}
function ManyZones ({ howMany = 4 }) {
  const sz = 100
  return Array.from({ length: howMany }).map((_, key) => {
    const [settings, setSettings] = useState(randSettings())
    const icon = (
      // <img
      //   {...{
      //     height: sz,
      //     width: sz,
      //     src: `/api/zone?width=${sz}&bust=${Math.random()}`
      //   }}
      // />
      <View
        {...{
          height: sz,
          width: sz,
          coefs: settings.coefs,
          pause: settings.pause,
          showInfo: true,
          shuttle: false,
          renderer: settings.renderer
        }}
      />
    )
    return (
      <IconButton
        key={key}
        size={sz + 10}
        onClick={() => {
          setSettings(randSettings())
        }}
        icon={icon}
      />
    )
  }
  )
}

function useCoefs () {
  const [coefs, setCoefs] = useState({ cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 })
  return [coefs, setCoefs]
}

//  This was to accommodate varying aspect ratios...
export function useSizes () {
  const sizes = {
    100: { width: 100, height: 100 },
    200: { width: 200, height: 200 },
    400: { width: 400, height: 400 },
    '480p': { width: 768, height: 480 } // or 720 or 768
    // '720p': { width: 1280, height: 720 }
  }
  // size is the label(str) index into the sizes map
  const [size, setSize] = useState('200')
  const { width, height } = sizes[size]
  return [width, height, size, sizes, setSize]
}
