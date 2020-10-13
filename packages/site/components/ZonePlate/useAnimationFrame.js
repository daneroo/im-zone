
import { useRef, useEffect } from 'react'

// hook for request
// see: https://css-tricks.com/using-requestanimationframe-with-react-hooks/
// and: https://usehooks.com/useAnimation/
// and: https://ericlambrecht.github.io/react-timing-hooks/

/* global requestAnimationFrame cancelAnimationFrame */

// Provides control for an animation loop
// pause - animation state - start/stop control
// call back will be invoked with (fps,elapsed)
//  which are averaged over the last avgHorizon=60 frames
export function useAnimationFrame (callback = (delta) => {}, pause = true) {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef()
  const previousTimeRef = useRef()
  const pauseRef = useRef(pause)
  const callbackRef = useRef(callback)
  const deltaHistoRef = useRef([])
  const elapsedHistoRef = useRef([])
  useEffect(() => {
    pauseRef.current = pause
  }, [pause])
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])
  useEffect(() => {
    deltaHistoRef.current = [] // reset Histogram
    elapsedHistoRef.current = [] // reset Histogram
  }, [pause, callback])

  const animate = time => {
    if (previousTimeRef.current !== undefined) {
      const delta = time - previousTimeRef.current
      const histo = appendTrim(deltaHistoRef.current, delta)
      // console.log(deltaHistoRef.current)
      deltaHistoRef.current = histo
      const avgFps = (1000 / avg(histo))
      const avgElapsed = avg(elapsedHistoRef.current)

      const start = +new Date()
      callbackRef.current({ avgFps, avgElapsed })
      const elapsed = +new Date() - start

      elapsedHistoRef.current = appendTrim(elapsedHistoRef.current, elapsed)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (pauseRef.current === false) {
      requestRef.current = requestAnimationFrame(animate)
    }
    return () => {
      cancelAnimationFrame(requestRef.current)
    }
  }, [pause]) // Make sure the effect runs only once
}

function avg (histo) {
  return (histo.reduce((acc, value) => acc + value, 0) / histo.length)
}

const avgHorizon = 60
function appendTrim (histo, value) {
  return [...histo.slice(-avgHorizon + 1), value]
}
