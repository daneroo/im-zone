
import { useState, useRef, useEffect } from 'react'

export function useParams () {
  const [params, setParams] = useState({ cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 })
  return [params, setParams]
}

//  This was to accommodate varying aspect ratios...
export function useSizes () {
  const sizes = {
    64: { width: 64, height: 64 },
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

export function useAnimationFrame (callback, pause = true) {
  // Use useRef for mutable variables that we want to persist
  // without triggering a re-render on their change
  const requestRef = useRef()
  const previousTimeRef = useRef()
  const pauseRef = useRef()
  useEffect(() => {
    console.log({ pause })
    pauseRef.current = pause
  }, [pause]) // Make sure the effect runs only once

  const animate = time => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current
      callback(deltaTime)
    }
    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (pauseRef.current === false) {
      requestRef.current = requestAnimationFrame(animate)
    }
    return () => {
      console.log('cancel')
      cancelAnimationFrame(requestRef.current)
    }
  }, [pause]) // Make sure the effect runs only once
}
