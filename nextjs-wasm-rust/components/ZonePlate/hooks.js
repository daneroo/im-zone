
import { useState } from 'react'

export function useParams () {
  const [params, setParams] = useState({ cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 })
  return [params, setParams]
}

//  This was to accommodate varying aspect ratios...
export function useSizes () {
  const sizes = {
    64: { width: 64, height: 64 },
    200: { width: 200, height: 200 },
    400: { width: 400, height: 400 }
  }
  // size is the label(str) index into the sizes map
  const [size, setSize] = useState('400')
  const { width, height } = sizes[size]
  return [width, height, size, sizes, setSize]
}
