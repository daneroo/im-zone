import { ThemeProvider } from 'theme-ui'

import theme from '../styles/theme'
import { ClassicHolyGrail } from '../components/layout/ClassicHolyGrail'
import { SiteHeader } from '../components/layout/SiteHeader'
import { SiteFooter } from '../components/layout/SiteFooter'

export default function ThemedApp ({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <ClassicHolyGrail
        header={<SiteHeader />}
        left={<div />}
        right={<div />}
        main={<Component {...pageProps} />}
        footer={<SiteFooter />}
      />

    </ThemeProvider>
  )
}
