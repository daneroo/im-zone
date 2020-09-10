import { withRouter } from 'next/router'
import ZonePlate from '../components/ZonePlate'
import { Box } from 'theme-ui'

const Page = ({ router: { query } }) => {
  return (
    <div>
      <h3>WASM / Canvas experiment</h3>
      {/* gray should be muted? */}
      <Box sx={{ color: 'gray', py: 1 }}>
        Invokes the drawing function (either in JavaScript or Rust/WASM),
        and reports the average render time.
      </Box>
      <ZonePlate />

    </div>
  )
}

export default withRouter(Page)
