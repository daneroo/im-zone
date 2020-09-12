import { useState } from 'react'

import { Grid, Flex, Label, Button, Checkbox, IconButton, Slider, Select } from 'theme-ui'

export default function Controls ({ params, setParams, size, setSize, sizes, shuttle, setShuttle }) {
  const [showParams, setShowParams] = useState(false)

  const knownParams = {
    VH: { cx2: 1, cy2: 1, cxt: 0, cyt: 0, ct: 1 },
    VT: { cx2: 0, cy2: 1, cxt: 1, cyt: 0, ct: 0 },
    HT: { cx2: 1, cy2: 0, cxt: 0, cyt: 1, ct: 0 }
  }

  return (
    <>
      <Flex sx={{ gap: 1, alignItems: 'center' }}>
        {Object.entries(knownParams).map(([k, v]) => {
          return (
            <IconButton
              key={k} size={40}
              onClick={(e) => {
                setParams(v)
                setShuttle(k !== 'VH')
              }}
            >
              <img
                width={40} height={40}
                style={{ borderRadius: '4px' }}
                src={`https://via.placeholder.com/40/333/fff?text=${k}`}
              />
            </IconButton>
          )
        })}
        <Button onClick={() => setShowParams(!showParams)}>More...</Button>
      </Flex>
      {showParams && (
        <>
          <Grid columns={2} sx={{ gap: 1, maxWidth: '15rem' }}>
            {['cx2', 'cy2', 'cxt', 'cyt', 'ct'].map((k) => {
              return (
                <Flex key={k}>
                  <Label sx={{ flex: 1 }} htmlFor={k}>{k} ({params[k]})</Label>
                  <Slider
                    sx={{ flex: '1 2' }}
                    name={k}
                    type='range' min='-2' max='2' step='1'
                    value={params[k]}
                    onChange={(e) => setParams({ ...params, [k]: Number(e.target.value) })}
                  />
                </Flex>
              )
            })}
          </Grid>
          <Flex sx={{ maxWidth: 150 }}>
            <Label sx={{ flex: 1 }} htmlFor='size'>Size</Label>
            <Select
              name='size'
              value={size}
              sx={{ width: 100 }}
              onChange={(e) => setSize(e.target.value)}
            >
              {Object.entries(sizes).map(([k, v]) => {
                return <option key={k}>{k}</option>
              })}
            </Select>
          </Flex>
          <Label>
            <Checkbox checked={shuttle} onChange={(e) => setShuttle(!shuttle)} />
              Shuttle
          </Label>
        </>
      )}
    </>
  )
}
