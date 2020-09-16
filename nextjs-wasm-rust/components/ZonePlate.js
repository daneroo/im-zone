import { useState } from 'react'
import { Flex, Box, Label, Button, Checkbox } from 'theme-ui'

import Controls from './ZonePlate/Controls'
import { useParams, useSizes } from './ZonePlate/hooks'
import Equation from './ZonePlate/Equation'
import View from './ZonePlate/View'

export default function ZonePlate () {
  const [shuttle, setShuttle] = useState(false)
  const [renderer, setRenderer] = useState('JS')
  // animation state
  const [pause, setPause] = useState(true)

  // These control the size and coefficients od the ZonePlate
  const [params, setParams] = useParams()
  const [width, height, size, sizes, setSize] = useSizes()

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <Controls {...{ params, setParams, size, setSize, sizes, shuttle, setShuttle }} />
      <Flex sx={{ gap: 2, my: 1, alignItems: 'center' }}>
        <Label sx={{ gap: 1 }}>
          <div>JavaScript</div>
          <Checkbox checked={renderer === 'JS'} onChange={(e) => setRenderer('JS')} />
        </Label>
        <Label sx={{ gap: 1 }}>
          <div>Rust</div>
          <Checkbox checked={renderer === 'Rust'} onChange={(e) => setRenderer('Rust')} />
        </Label>
        <Label sx={{ gap: 1 }}>
          <div>Go</div>
          <Checkbox checked={renderer === 'Go'} onChange={(e) => setRenderer('Go')} />
        </Label>
        <Box>
          <Button onClick={() => setPause(!pause)}>{pause ? 'Play' : 'Pause'}</Button>
        </Box>
      </Flex>
      <Equation params={params} />
      <Box>
        {/* <Label sx={{ color: secondary, fontSize: '90%' }}>Render: ~{renderTime}</Label> */}
        {/* add svg sparkline and time axis progress [-.5,.5] */}
        {/* <Label sx={{ color: secondary }}>Time: {timePosition} s</Label> */}
      </Box>
      <Box>
        <View {...{ width, height, params, pause, renderer }} />
      </Box>
    </Flex>
  )
}
