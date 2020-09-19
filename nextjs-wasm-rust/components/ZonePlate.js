import { useState } from 'react'
import { Grid, Flex, Box, Button, useThemeUI } from 'theme-ui'

import IconButton from './layout/icons/IconButton'
import PlayPause from './layout/icons/PlayPause'
import Info from './layout/icons/Info'

import { Presets, FullSettings } from './ZonePlate/Controls'
import { useParams, useSizes } from './ZonePlate/hooks'
import Equation from './ZonePlate/Equation'
import View from './ZonePlate/View'

export default function ZonePlate () {
  const [shuttle, setShuttle] = useState(false)
  const [renderer, setRenderer] = useState('JS')
  // animation state
  const [pause, setPause] = useState(true)
  const [showInfo, setShowInfo] = useState(true)

  // These control the size and coefficients od the ZonePlate
  const [params, setParams] = useParams()
  const [width, height, size, sizes, setSize] = useSizes()

  const { theme: { colors: { text } } } = useThemeUI()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <Presets {...{ params, setParams, size, setSize, sizes, shuttle, setShuttle, renderer, setRenderer }} />
      <Box>
        <Equation params={params} />
      </Box>
      <Flex sx={{
        width: sizes[size].width,
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      >
        <IconButton
          size={24}
          onClick={() => setShowInfo(!showInfo)}
          icon={<Info show={showInfo} />}
        />
        <Box sx={{
          fontSize: 0,
          // alignSelf: 'flex-end',
          opacity: 0.5
        }}
        >{(width * height * 60 / 1e6).toFixed(1)} Mp/s
        </Box>
        <IconButton
          size={24}
          onClick={() => setPause(!pause)}
          icon={<PlayPause pause={pause} />}
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
        <View {...{ width, height, params, pause, showInfo, shuttle, renderer }} />
      </Box>
      <FullSettings {...{ params, setParams, sizes, size, setSize, shuttle, setShuttle }} />
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
  return {
    params: {
      cx2: r(),
      cy2: r(),
      cxt: r(),
      cyt: r(),
      ct: r()
    },
    pause: Math.random() < 0.5,
    renderer: ['JS', 'Rust'][Math.floor(Math.random() * 2)]
  }
}
function ManyZones ({ howMany = 4 }) {
  const sz = 100
  return Array.from({ length: howMany }).map((_, key) => {
    const [settings, setSettings] = useState(randSettings())
    const icon = (
      <View
        {...{
          height: sz,
          width: sz,
          params: settings.params,
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
