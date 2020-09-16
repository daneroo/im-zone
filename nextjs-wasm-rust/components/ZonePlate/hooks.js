
import { useState, useRef, useEffect } from 'react'

export function useParams () {
  const [params, setParams] = useState({ cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 })
  return [params, setParams]
}

//  This was to accommodate varying aspect ratios...
export function useSizes () {
  const sizes = {
    100: { width: 100, height: 100 },
    200: { width: 200, height: 200 },
    400: { width: 400, height: 400 },
    '480p': { width: 768, height: 480 } // or 720 or 768
    // '720p': { width: 1280, height: 720 }
  }
  // size is the label(str) index into the sizes map
  const [size, setSize] = useState('200')
  const { width, height } = sizes[size]
  return [width, height, size, sizes, setSize]
}

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
