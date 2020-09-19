import { useState } from 'react'

import { Grid, Flex, Box, Label, Button, Checkbox, Slider, Select, useThemeUI } from 'theme-ui'
import IconButton from '../layout/icons/IconButton'
import SVG from '../layout/icons/SVG'
import View from './View'

export function Presets ({ params, setParams, size, setSize, sizes, shuttle, setShuttle, renderer, setRenderer }) {
  return (
    <Grid sx={{
      gridTemplate: 'auto / auto auto',
      alignItems: 'center'
    }}
    >
      {/* Presets params */}
      <Box sx={{ justifySelf: 'end' }}>
        <Label htmlFor='presets'>Presets</Label>
      </Box>
      <Flex sx={{ gap: 1, alignItems: 'center' }}>
        <PresetParams {...{ setParams, setShuttle }} />
      </Flex>

      {/* Presets Sizes */}
      <Box sx={{ justifySelf: 'end' }}>
        <Label htmlFor='size'>Sizes</Label>
      </Box>
      <Flex sx={{ gap: 1, alignItems: 'center' }}>
        <SizeButtons sizes={sizes} setSize={setSize} />
      </Flex>

      <Box sx={{ justifySelf: 'end' }}>
        <Label htmlFor='size'>Engine</Label>
      </Box>
      <Flex sx={{ gap: 2, alignItems: 'center' }}>
        <RendererSelector {...{ renderer, setRenderer }} />
      </Flex>
    </Grid>
  )
}

// Return a fragment of IconButtons
function PresetParams ({ setParams, setShuttle }) {
  const knownParams = {
    Spherical: { cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 },
    Hyperbolic: { cx2: 1, cy2: -1, cxt: 0, cyt: 0, ct: 1 },
    'Vertical-Temporal': { cx2: 0, cy2: 1, cxt: 1, cyt: 0, ct: 0 },
    'Horizontal-Temporal': { cx2: 1, cy2: 0, cxt: 0, cyt: 1, ct: 0 }
  }
  return Object.entries(knownParams).map(([label, params]) => {
    const size = 48
    const icon = (
      <View
        {...{
          height: size,
          width: size,
          params: params,
          pause: true,
          showInfo: false,
          shuttle: false,
          renderer: 'JS'
        }}
      />
    )

    return (
      <IconButton
        key={label}
        size={size}
        label={`${label} Preset`}
        onClick={(e) => {
          setParams(params)
          // pretty flaky...
          setShuttle(label.endsWith('T'))
        }}
        icon={icon}
      />
    )
  })
}

// name: cx2, cy2, ct..
function Term ({ name, value }) {
  const monomial = {
    cx2: <>x<sup>2</sup></>,
    cy2: <>y<sup>2</sup></>,
    cxt: <>xt</>,
    cyt: <>yt</>,
    ct: <>t</>
  }
  return (
    <code style={{ fontSize: '1.3em' }}>
      {value}{monomial[name]}
    </code>

  )
}

function SizeButtons ({ sizes, setSize }) {
  // sizes is a map : label -> {width,height}
  // we want array of labels

  const iconSpecs = Object.keys(sizes).map((label, i, labels) => {
    const { width, height } = sizes[label]
    return {
      label,
      wide: (i + 2) / (labels.length + 1),
      ratio: width / height
    }
  })
  return iconSpecs.map(({ label, wide, ratio }) => (
    <SizeButton
      key={label}
      label={label}
      wide={wide}
      ratio={ratio}
      onClick={() => setSize(label)}
    />
  ))
}

function SizeButton ({ label, wide, ratio, onClick }) {
  const high = wide / ratio
  return (
    <IconButton
      label={label}
      size={48}
      onClick={onClick}
      icon={(
        // eslint-disable-next-line react/jsx-pascal-case
        <SVG viewBox='0 0 1 1'>
          <g transform={`translate(${(1 - wide) / 2},${(1 - high) / 2})scale(1,${1 / ratio})`}>
            <rect width={wide} height={wide} />
          </g>
        </SVG>
      )}
    />
  )
}

export function FullSettings ({ params, setParams, sizes, size, setSize, shuttle, setShuttle }) {
  const [showParams, setShowParams] = useState(false)
  return (
    <>
      <Flex sx={{ gap: 1, alignItems: 'center' }}>
        <Button onClick={() => setShowParams(!showParams)}>Full Settings...</Button>
      </Flex>
      {showParams && (
        <>
          <Grid columns={2} sx={{ gap: 3, alignItems: 'center' }}>
            <SliderParams {...{ params, setParams }} />
            <Box /> {/* placeholder for sixth slider */}
            <SizeAndShuttle {...{ sizes, size, setSize, shuttle, setShuttle }} />
          </Grid>
        </>
      )}
    </>

  )
}

function SliderParams ({ params, setParams }) {
  return ['cx2', 'cy2', 'cxt', 'cyt', 'ct'].map((k) => (
    <Label key={k} sx={{ gap: 2, alignItems: 'center' }}>
      <Box sx={{ textAlign: 'right', minWidth: '3em' }}>
        <Term name={k} value={params[k]} />
      </Box>
      <Slider
        sx={{ minWidth: '10em' }}
        name={k}
        type='range' min='-3' max='3' step='1'
        value={params[k]}
        onChange={(e) => setParams({ ...params, [k]: Number(e.target.value) })}
      />
    </Label>
  )
  )
}

function SizeAndShuttle ({ sizes, size, setSize, shuttle, setShuttle }) {
  return (
    <>
      <Label sx={{ gap: 1, justifyContent: 'center', alignItems: 'center' }}>
        <div>Size</div>
        <Select
          name='size'
          value={size}
          sx={{ width: '5rem' }}
          onChange={(e) => setSize(e.target.value)}
        >
          {Object.entries(sizes).map(([k, v]) => {
            return <option key={k}>{k}</option>
          })}
        </Select>
      </Label>
      <Label sx={{ gap: 1, justifyContent: 'center' }}>
        <div>Shuttle</div>
        <Checkbox checked={shuttle} onChange={(e) => setShuttle(!shuttle)} />
      </Label>
    </>
  )
}

export function RendererSelector ({ renderer, setRenderer }) {
  const size = 48
  const engineNames = {
    JS: { name: 'JavaScript', icon: <JavaScriptLogo selected={renderer === 'JS'} /> },
    Rust: { name: 'Rust', icon: <RustLogo selected={renderer === 'Rust'} /> },
    Go: { name: 'Go', icon: <GoLogo selected={renderer === 'Go'} /> }
  }
  return Object.entries(engineNames).map(([r, { name, icon }]) => {
    return (
      <IconButton
        style={{ borderRadius: '.5em', border: '1px solid black' }}
        key={r}
        label={name}
        size={size}
        onClick={(e) => {
          setRenderer(r)
        }}
        icon={icon}
      />
    )
  })
}

function BorderRect ({ w, fill = 'none', epsilon = 0.01, selected = false }) {
  const { theme: { colors: { text } } } = useThemeUI()
  return (
    <rect
      transform={`scale(${w * (1 - epsilon)},${w * (1 - epsilon)})translate(${epsilon / 2},${epsilon / 2})`}
      width={0.975} height={0.975} rx={0.2}
      fill={selected ? fill : 'none'}
      stroke={text}
      strokeWidth={0.01}
    />
  )
}
function JavaScriptLogo ({ selected }) {
  const jsYellow = '#f7df1e'
  const w = 630
  return (
  // eslint-disable-next-line react/jsx-pascal-case
    <SVG viewBox='0 0 630 630'>
      <BorderRect w={w} fill={jsYellow} selected={selected} />
      <path d='m423.2 492.19c12.69 20.72 29.2 35.95 58.4 35.95 24.53 0 40.2-12.26 40.2-29.2 0-20.3-16.1-27.49-43.1-39.3l-14.8-6.35c-42.72-18.2-71.1-41-71.1-89.2 0-44.4 33.83-78.2 86.7-78.2 37.64 0 64.7 13.1 84.2 47.4l-46.1 29.6c-10.15-18.2-21.1-25.37-38.1-25.37-17.34 0-28.33 11-28.33 25.37 0 17.76 11 24.95 36.4 35.95l14.8 6.34c50.3 21.57 78.7 43.56 78.7 93 0 53.3-41.87 82.5-98.1 82.5-54.98 0-90.5-26.2-107.88-60.54zm-209.13 5.13c9.3 16.5 17.76 30.45 38.1 30.45 19.45 0 31.72-7.61 31.72-37.2v-201.3h59.2v202.1c0 61.3-35.94 89.2-88.4 89.2-47.4 0-74.85-24.53-88.81-54.075z' />
    </SVG>
  )
}

function RustLogo ({ selected }) {
  const rust = 'rgb(183,65,14)'
  const w = 144
  return (
  // eslint-disable-next-line react/jsx-pascal-case
    <SVG viewBox='0 0 144 144'>
      <BorderRect w={w} fill={rust} selected={selected} />
      <path d='M67.743 31.035a3.108 3.108 0 0 1 6.216 0a3.108 3.108 0 0 1 -6.216 0M30.666 59.175a3.108 3.108 0 0 1 6.216 0a3.108 3.108 0 0 1 -6.216 0m74.153.145a3.108 3.108 0 0 1 6.216 0a3.108 3.108 0 0 1 -6.216 0M39.663 63.578c1.43-.635 2.076-2.311 1.441-3.744l-1.379-3.118h5.423V81.16H34.207a38.265 38.265 0 0 1 -1.239-14.607zm22.685 0.601v-7.205h12.914c.667 0 4.71.771 4.71 3.794c0 2.51-3.101 3.41-5.651 3.41zM44.717 102.972a3.108 3.108 0 0 1 6.216 0a3.108 3.108 0 0 1 -6.216 0m46.051.145a3.108 3.108 0 0 1 6.216 0a3.108 3.108 0 0 1 -6.216 0m.961-7.048c-1.531-.328-3.037.646-3.365 2.18l-1.56 7.28a38.265 38.265 0 0 1 -31.911-.153l-1.559-7.28c-.328-1.532-1.834-2.508-3.364-2.179l-6.427 1.38a38.265 38.265 0 0 1 -3.323 -3.917h31.272c.354 0 .59-.064.59-.386V81.932c0-.322-.236-.386-.59-.386h-9.146v-7.012h9.892c.903 0 4.828.258 6.083 5.275.393 1.543 1.256 6.562 1.846 8.169.588 1.802 2.982 5.402 5.533 5.402h16.146a38.265 38.265 0 0 1 -3.544 4.102zm17.365-29.207a38.265 38.265 0 0 1 .081 6.643 h-3.926c-.393 0-.551.258-.551.643v1.803c0 4.244-2.393 5.167-4.49 5.402-1.997 .225-4.211-.836-4.484-2.058-1.178-6.626-3.141-8.041-6.241-10.486 3.847-2.443,7.85-6.047 7.85-10.871 0-5.209-3.571-8.49-6.005-10.099-3.415-2.251-7.196-2.702-8.216-2.702H42.509a38.265 38.265 0 0 1 21.408-12.082l4.786 5.021c1.082 1.133 2.874 1.175 4.006.092l5.355-5.122a38.265 38.265 0 0 1 26.196 18.657l-3.666 8.28c-.633 1.433.013 3.109 1.442 3.744zm9.143.134-.125-1.28 3.776-3.522c.768-.716.481-2.157-.501-2.523l-4.827-1.805-.378-1.246 3.011-4.182c.614-.85.05-2.207-.984-2.377l-5.09-.828-.612-1.143 2.139-4.695c.438-.956-.376-2.179-1.428-2.139l-5.166.18-.816-.99 1.187-5.032c.24-1.022-.797-2.06-1.819-1.82l-5.031 1.186-.992-.816.181-5.166c.04-1.046-1.184-1.863-2.138-1.429l-4.694 2.14-1.143-.613-.83-5.091c-.168-1.032-1.526-1.596-2.376-.984l-4.185 3.011-1.244-.377-1.805-4.828c-.366-.984-1.808-1.267-2.522-.503l-3.522 3.779-1.28-.125-2.72-4.395c-.55-.89-2.023-.89-2.571 0l-2.72 4.395-1.281.125-3.523-3.779c-.714-.764-2.156-.481-2.522.503l-1.805 4.828-1.245.377-4.184-3.011c-.85-.614-2.209-.048-2.377.984l-.83 5.091-1.143.613-4.694-2.14c-.954-.436-2.178.383-2.138 1.429l.18 5.166-.992.816-5.031-1.186c-1.022-.238-2.06.798-1.82 1.82l1.185 5.032-.814.99-5.166-.18c-1.042-.03-1.863 1.183-1.429 2.139l2.14 4.695-.613 1.143-5.09.828c-1.034.168-1.594 1.527-.984 2.377l3.011 4.182-.378 1.246-4.828 1.805c-.98.366-1.267 1.807-.501 2.523l3.777 3.522-.125 1.28-4.394 2.72c-.89.55-.89 2.023 0 2.571l4.394 2.72.125 1.28-3.777 3.523c-.766.714-.479 2.154.501 2.522l4.828 1.805.378 1.246-3.011 4.183c-.612.852-.049 2.21.985 2.376l5.089.828.613 1.145-2.14 4.693c-.436.954.387 2.181 1.429 2.139l5.164-.181.816.992-1.185 5.033c-.24 1.02.798 2.056 1.82 1.816l5.031-1.185.992.814-.18 5.167c-.04 1.046 1.184 1.864 2.138 1.428l4.694-2.139 1.143.613.83 5.088c.168 1.036 1.527 1.596 2.377.986l4.182-3.013 1.246.379 1.805 4.826c.366.98 1.808 1.269 2.522.501l3.523-3.777 1.281.128 2.72 4.394c.548.886 2.021.888 2.571 0l2.72-4.394 1.28-.128 3.522 3.777c.714.768 2.156.479 2.522-.501l1.805-4.826 1.246-.379 4.183 3.013c.85.61 2.208.048 2.376-.986l.83-5.088 1.143-.613 4.694 2.139c.954.436 2.176-.38 2.138-1.428l-.18-5.167.991-.814 5.031 1.185c1.022.24 2.059-.796 1.819-1.816l-1.185-5.033.814-.992 5.166.181c1.042.042 1.866-1.185 1.428-2.139l-2.139-4.693.612-1.145 5.09-.828c1.036-.166 1.598-1.524.984-2.376l-3.011-4.183.378-1.246 4.827-1.805c.982-.368 1.269-1.808.501-2.522l-3.776-3.523.125-1.28 4.394-2.72c.89-.548.891-2.021.001-2.571z' />
    </SVG>
  )
}

function GoLogo ({ selected }) {
  const gopherBlue = 'rgb(1, 173, 216)'
  const w = 255
  // modified the viewbox height 225->255 to make it square
  return (
  // eslint-disable-next-line react/jsx-pascal-case
    <SVG viewBox='0 0 255 255'>
      <BorderRect w={w} fill={gopherBlue} selected={selected} />
      <g transform='translate(0,15)'>
        <g>{/* speed bands */}
          <path
            d='M40.2,101.1c-0.4,0-0.5-0.2-0.3-0.5l2.1-2.7c0.2-0.3,0.7-0.5,1.1-0.5l35.7,0c0.4,0,0.5,0.3,0.3,0.6 l-1.7,2.6c-0.2,0.3-0.7,0.6-1,0.6L40.2,101.1z'
          />
          <path
            d='M25.1,110.3c-0.4,0-0.5-0.2-0.3-0.5l2.1-2.7c0.2-0.3,0.7-0.5,1.1-0.5l45.6,0c0.4,0,0.6,0.3,0.5,0.6 l-0.8,2.4c-0.1,0.4-0.5,0.6-0.9,0.6L25.1,110.3z'
          />
          <path
            d='M49.3,119.5c-0.4,0-0.5-0.3-0.3-0.6l1.4-2.5c0.2-0.3,0.6-0.6,1-0.6l20,0c0.4,0,0.6,0.3,0.6,0.7 l-0.2,2.4c0,0.4-0.4,0.7-0.7,0.7L49.3,119.5z'
          />
        </g>
        <g id='CXHf1q_3_'> {/* GO letters */}
          <path
            d='M153.1,99.3c-6.3,1.6-10.6,2.8-16.8,4.4c-1.5,0.4-1.6,0.5-2.9-1c-1.5-1.7-2.6-2.8-4.7-3.8 c-6.3-3.1-12.4-2.2-18.1,1.5c-6.8,4.4-10.3,10.9-10.2,19c0.1,8,5.6,14.6,13.5,15.7c6.8,0.9,12.5-1.5,17-6.6 c0.9-1.1,1.7-2.3,2.7-3.7c-3.6,0-8.1,0-19.3,0c-2.1,0-2.6-1.3-1.9-3c1.3-3.1,3.7-8.3,5.1-10.9c0.3-0.6,1-1.6,2.5-1.6 c5.1,0,23.9,0,36.4,0c-0.2,2.7-0.2,5.4-0.6,8.1c-1.1,7.2-3.8,13.8-8.2,19.6c-7.2,9.5-16.6,15.4-28.5,17 c-9.8,1.3-18.9-0.6-26.9-6.6c-7.4-5.6-11.6-13-12.7-22.2c-1.3-10.9,1.9-20.7,8.5-29.3c7.1-9.3,16.5-15.2,28-17.3 c9.4-1.7,18.4-0.6,26.5,4.9c5.3,3.5,9.1,8.3,11.6,14.1C154.7,98.5,154.3,99,153.1,99.3z'
          />
          <path
            d='M186.2,154.6c-9.1-0.2-17.4-2.8-24.4-8.8c-5.9-5.1-9.6-11.6-10.8-19.3c-1.8-11.3,1.3-21.3,8.1-30.2 c7.3-9.6,16.1-14.6,28-16.7c10.2-1.8,19.8-0.8,28.5,5.1c7.9,5.4,12.8,12.7,14.1,22.3c1.7,13.5-2.2,24.5-11.5,33.9 c-6.6,6.7-14.7,10.9-24,12.8C191.5,154.2,188.8,154.3,186.2,154.6z M210,114.2c-0.1-1.3-0.1-2.3-0.3-3.3 c-1.8-9.9-10.9-15.5-20.4-13.3c-9.3,2.1-15.3,8-17.5,17.4c-1.8,7.8,2,15.7,9.2,18.9c5.5,2.4,11,2.1,16.3-0.6 C205.2,129.2,209.5,122.8,210,114.2z'
          />
        </g>
      </g>
    </SVG>
  )
}
