
// with https://1linelayouts.glitch.me/ 05. Classic Holy Grail Layout

export default function ClassicHolyGrail ({
  header = <></>,
  left = <></>, main = <></>, right = <></>,
  footer = <></>
}) {
  return (
    <div style={{
      display: 'grid',
      height: '100vh',
      gridTemplate: 'auto 1fr auto / auto 1fr auto'
    }}
    >
      <header style={{ padding: '1rem', gridColumn: '1 / 4' }}>
        {header}
      </header>
      <div style={{ gridColumn: '1 / 2', padding: '1rem' }}>
        {left}
      </div>
      <main style={{ gridColumn: '2 / 3' }}>
        {main}
      </main>
      <div style={{ gridColumn: '3 / 4', padding: '1rem' }}>
        {right}
      </div>
      <footer style={{ padding: '1rem', textAlign: 'center', gridColumn: '1 / 4' }}>
        {footer}
      </footer>
    </div>
  )
}
