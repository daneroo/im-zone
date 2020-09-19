import { useState } from 'react'

import { Grid, Flex, Box, Label, Button, Checkbox, Slider, Select } from 'theme-ui'
import IconButton from '../layout/icons/IconButton'
import SVG from '../layout/icons/SVG'

export function Presets ({ params, setParams, size, setSize, sizes, shuttle, setShuttle }) {
  return (
    <>
      {/* Presets params */}
      <Flex sx={{ gap: 1, alignItems: 'center' }}>
        <Label sx={{ flex: 1 }} htmlFor='presets'>Presets</Label>
        <PresetParams {...{ setParams, setShuttle }} />
      </Flex>

      {/* Presets Sizes */}
      <Flex sx={{ my: 2, gap: 3, alignItems: 'center' }}>
        <Label sx={{ flex: 1 }} htmlFor='size'>Sizes</Label>
        <SizeButtons sizes={sizes} setSize={setSize} />
      </Flex>
    </>
  )
}

// Return a fragment of IconButtons
function PresetParams ({ setParams, setShuttle }) {
  const knownParams = {
    VH: { cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 },
    'VH-1': { cx2: 1, cy2: -1, cxt: 0, cyt: 0, ct: 1 },
    VT: { cx2: 0, cy2: 1, cxt: 1, cyt: 0, ct: 0 },
    HT: { cx2: 1, cy2: 0, cxt: 0, cyt: 1, ct: 0 }
  }
  return Object.entries(knownParams).map(([k, v]) => {
    const size = 48
    return (
      <IconButton
        key={k}
        size={size}
        onClick={(e) => {
          setParams(v)
          // pretty flaky...
          setShuttle(k.endsWith('T'))
        }}
        icon={
          <img
            width={size} height={size}
            style={{ borderRadius: '4px' }}
            src={`https://via.placeholder.com/40/333/fff?text=${k}`}
          />
        }
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
      size={24}
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
        <Button onClick={() => setShowParams(!showParams)}>More...</Button>
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
  // const renderers = {
  //   JS: 'JavaScript',
  //   Rust: 'Rust',
  //   Go: 'Go'
  // }
  return (
    <>
      <Label sx={{ gap: 1, minWidth: '7em' }}>
        <div>JavaScript</div>
        <Checkbox checked={renderer === 'JS'} onChange={(e) => setRenderer('JS')} />
      </Label>
      <Label sx={{ gap: 1, minWidth: '7em' }}>
        <div>Rust</div>
        <Checkbox checked={renderer === 'Rust'} onChange={(e) => setRenderer('Rust')} />
      </Label>
      <Label sx={{ gap: 1, minWidth: '7em' }}>
        <div>Go</div>
        <Checkbox checked={renderer === 'Go'} onChange={(e) => setRenderer('Go')} />
      </Label>
    </>
  )
}
