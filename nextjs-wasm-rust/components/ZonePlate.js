import { useState } from 'react'
import { Flex, Box, Label, Checkbox } from 'theme-ui'

import IconButton from './layout/icons/IconButton'
import PlayPause from './layout/icons/PlayPause'
import Info from './layout/icons/Info'

import { Presets, RendererSelector, FullSettings } from './ZonePlate/Controls'
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

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <Presets {...{ params, setParams, size, setSize, sizes, shuttle, setShuttle }} />
      <Flex sx={{
        gap: 2,
        my: 1,
        alignItems: 'center'
      }}
      >
        <RendererSelector {...{ renderer, setRenderer }} />
      </Flex>
      <Box>
        <Equation params={params} />
      </Box>
      <Flex sx={{
        width: sizes[size].width,
        // alignItems: 'center',
        justifyContent: 'space-between'
      }}
      >
        <IconButton
          size={24}
          onClick={() => setShowInfo(!showInfo)}
          icon={<Info show={showInfo} />}
        />
        <IconButton
          size={24}
          onClick={() => setPause(!pause)}
          icon={<PlayPause pause={pause} />}
        />
      </Flex>
      <Box>
        <View {...{ width, height, params, pause, showInfo, shuttle, renderer }} />
      </Box>
      <FullSettings {...{ params, setParams, sizes, size, setSize, shuttle, setShuttle }} />

    </Flex>
  )
}
