
import { withRouter } from 'next/router'
import { Box } from 'theme-ui'

import ZonePlate from '../components/ZonePlate'

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
        <p>
          Click on the Zone Plate or the <em>Play/Pause</em> button to animate.
          <Box sx={{ color: 'secondary' }}>
            <em>Warning: The animation presents flashing images and stroboscopic sequences.</em>
          </Box>

        </p>
      </Box>
      <ZonePlate />

    </div>
  )
}

export default withRouter(Page)
