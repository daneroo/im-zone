import { useThemeUI } from 'theme-ui'
import React from 'react'
import SVG from './SVG'

const PlayPause = ({ pause = true }) => {
  const { theme: { colors: { secondary } } } = useThemeUI()
  const playFill = (pause) ? { fill: secondary } : {}
  const pauseFill = (!pause) ? { fill: secondary } : {}
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <SVG viewBox='0 0 100 100'>
      <polygon {...playFill} points='4.948,21.713 53.945,50.002 4.948,78.286 ' />
      <g {...pauseFill}>
        <rect x='53.945' y='21.713' width='15.478' height='56.573' />
        <rect x='80.77' y='21.713' width='15.48' height='56.573' />
      </g>
    </SVG>
  )
}

export default PlayPause
