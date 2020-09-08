import { withRouter } from 'next/router'
// import dynamic from 'next/dynamic'
import WasmAdder from '../components/WasmAdder'
import ZonePlate from '../components/ZonePlate'

const Page = ({ router: { query } }) => {
  return (
    <>
      <ZonePlate />
      <WasmAdder />
    </>
  )
}

export default withRouter(Page)
