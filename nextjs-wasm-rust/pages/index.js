import { withRouter } from 'next/router'
// import dynamic from 'next/dynamic'
import { Container } from 'theme-ui'
import WasmAdder from '../components/WasmAdder'
import ZonePlate from '../components/ZonePlate'

const Page = ({ router: { query } }) => {
  return (
    <Container>
      <ZonePlate />
      <WasmAdder />
    </Container>
  )
}

export default withRouter(Page)
