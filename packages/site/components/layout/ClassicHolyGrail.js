
// with https://1linelayouts.glitch.me/ 05. Classic Holy Grail Layout

import Head from 'next/head'
import { Grid } from 'theme-ui'

export function ClassicHolyGrail ({
  header = <></>,
  left = <></>, main = <></>, right = <></>,
  footer = <></>
}) {
  return (
    <>
      <Head>
        <meta charSet='utf-8' />
        <title>Zone Plate Experiment</title>
        <meta name='author' content='Daniel Lauzon' />
        <meta
          name='description' content='Next.js WebAssembly Canvas experiment with Zone Plate Patterns'
        />
      </Head>
      <Grid sx={{
        height: '100vh',
        margin: 'auto', // center when maxWidth is active
        gridTemplate: 'auto 1fr auto / auto 1fr auto',

        // maxWidth using theme-ui breakpoint array notation
        maxWidth: [null, null, 1024]
      // which is equivalent to:
      // const { theme: { sxmedia } } = useThemeUI()
      // [sxmedia.desktop_up]: {
      //   maxWidth: '1024px'
      // }
      }}
      >
        <header style={{ padding: '1rem', gridColumn: '1 / 4' }}>
          {header}
        </header>
        {/* Removed Left Right padding, because there is none on this site. */}
        <div style={{ gridColumn: '1 / 2', padding: '0rem' }}>
          {left}
        </div>
        <main style={{ gridColumn: '2 / 3' }}>
          {main}
        </main>
        <div style={{ gridColumn: '3 / 4', padding: '0rem' }}>
          {right}
        </div>
        <footer style={{ padding: '1rem', gridColumn: '1 / 4' }}>
          {footer}
        </footer>
      </Grid>
    </>
  )
}
