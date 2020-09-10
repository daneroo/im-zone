import { withRouter } from 'next/router'
import ZonePlate from '../components/ZonePlate'

const Page = ({ router: { query } }) => {
  return (
    <ZonePlate />
  )
}

export default withRouter(Page)
