
import { withRouter } from 'next/router'
import { Box } from 'theme-ui'

import ZonePlatePlayground from '../components/ZonePlatePlayground'

const Page = ({ router: { query } }) => {
  return (
    <div>
      <h3>Next.js WebAssembly Canvas experiment</h3>
      {/* text color should be muted? */}
      <Box sx={{ color: 'text', opacity: 0.8, py: 0, mx: 2 }}>
        <p>
          Invokes the drawing function either in JavaScript, Rust or Go,
        and reports the average render time.
        The Rust and Go implementations were compiled to WebAssembly.
        </p>
        {/*
        Need to deploy as non static... lerna time, so we can build on vercel/docker
        <Flex sx={{ width: '80%', margin: 'auto', alignItems: 'center', gap: 2 }}>
          <img src={`/api/zone/?bust=${1234}`} alt='Random' width='200' height='200' />
          <img src={`/api/zone/?bust=${4321}`} alt='Random' width='200' height='200' />
        </Flex>
       */}
        <div>
          <p>Click on the Zone Plate or the <em>Play/Pause</em> button to animate.</p>
          <Box sx={{ color: 'secondary' }}>
            <em>Warning: The animation presents flashing images and stroboscopic sequences.</em>
          </Box>

        </div>
      </Box>
      <ZonePlatePlayground />

    </div>
  )
}

export default withRouter(Page)
