import { useState } from 'react'
import { Flex, Box, Label, Button, Checkbox, useThemeUI } from 'theme-ui'

import Controls from './ZonePlate/Controls'
import { useParams, useSizes } from './ZonePlate/hooks'
import Equation from './ZonePlate/Equation'
import View from './ZonePlate/View'

export default function ZonePlate () {
  const { theme: { colors: { secondary } } } = useThemeUI()

  const [renderTime, setRenderTime] = useState('0.00')
  const [timePosition, setTimePosition] = useState('0.00')
  const [shuttle, setShuttle] = useState(false)
  const [renderer, setRenderer] = useState('JS')
  // animation state
  const [pause, setPause] = useState(true)

  // These control the size and coefficients od the ZonePlate
  const [params, setParams] = useParams()
  const [width, height, size, sizes, setSize] = useSizes()

  const renderTimeAverageLength = 60
  const renderTimes = []
  function addRenderTime (elapsed) {
    renderTimes.push(elapsed)
    if (renderTimes.length > renderTimeAverageLength) {
      renderTimes.shift()
    }
  }
  function averageRenderTime () {
    const avg = renderTimes.length ? renderTimes.reduce((sum, elapsed) => (sum + elapsed)) / renderTimes.length : 0
    return `${avg.toFixed(1)}ms -  ${renderTimes.length}f`
  }

  return (
    <Flex sx={{ flexDirection: 'column', gap: 1, alignItems: 'center' }}>
      <Controls {...{ params, setParams, size, setSize, sizes, shuttle, setShuttle }} />
      <Flex sx={{ gap: 2, my: 1, alignItems: 'center', flexDirection: 'column' }}>
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
        <Label sx={{ color: secondary, fontSize: '90%' }}>Render: ~{renderTime}</Label>
        {/* add svg sparkline and time axis progress [-.5,.5] */}
        <Label sx={{ color: secondary }}>Time: {timePosition} s</Label>
      </Box>
      <Box>
        <View {...{ width, height, params, pause, addRenderTime, averageRenderTime, setRenderTime, setTimePosition, renderer }} />
      </Box>
    </Flex>
  )
}
