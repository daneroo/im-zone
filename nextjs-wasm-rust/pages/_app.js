import { ThemeProvider } from 'theme-ui'
import theme from '../styles/theme'

export default function ThemedApp ({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
