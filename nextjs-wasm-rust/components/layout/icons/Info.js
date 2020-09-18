import { useThemeUI } from 'theme-ui'
import React from 'react'
import SVG from './SVG'

const Info = ({ show = true }) => {
  const { theme: { colors: { secondary } } } = useThemeUI()
  const circleStyle = (show) ? { fill: secondary } : { stroke: secondary, strokeWidth: '6px', fill: 'none' }
  return (
    // eslint-disable-next-line react/jsx-pascal-case
    <SVG viewBox='0 0 100 100'>
      <circle {...circleStyle} cx={50} cy={50} r={40} />
      <text
        style={{ font: 'bold italic 72px serif' }}
        // fill={primary}
        text-anchor='middle' x='50' y='75'
      >i
      </text>
    </SVG>
  )
}

export default Info
