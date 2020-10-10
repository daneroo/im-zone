import React from 'react'
import { AnimatePresence } from 'framer-motion'
import { CurrentSlideProvider } from '../context/CurrentSlideContext'
import { ModeProvider } from '../context/ModeContext'
import MDXProvider from '../components/MDXProvider'
import { ThemeProvider } from '../components/ThemeProvider'
import TransitionPage from '../layouts/TransitionPage'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <MDXProvider>
        <CurrentSlideProvider>
          <ModeProvider>
            <AnimatePresence exitBeforeEnter>
              <TransitionPage>
                <Component {...pageProps} />
              </TransitionPage>
            </AnimatePresence>
          </ModeProvider>
        </CurrentSlideProvider>
      </MDXProvider>
    </ThemeProvider>
  )
}
