import React from 'react'

export function Equation ({ coefs }) {
  const { cx2, cy2, cxt, cyt, ct } = coefs
  const terms = [
    { c: cx2, monomial: <>x<sup>2</sup></> },
    { c: cy2, monomial: <>y<sup>2</sup></> },
    { c: cxt, monomial: <>xt</> },
    { c: cyt, monomial: <>yt</> },
    { c: ct, monomial: <>t</> }
  ].reduce((acc, { c, monomial }) => {
    if (c === 0 || c === undefined) return acc
    const absC = (Math.abs(c) === 1) ? '' : Math.abs(c)
    if (acc === '') {
      const sign = (c > 0) ? '' : '-'
      return <>{sign}{absC}{monomial}</>
    }
    const sign = (c > 0) ? '+' : '-'
    return (
      <>{acc} {sign} {absC}{monomial}</>
    )
  }, '')
  return (
    <code style={{ fontSize: '2em' }}>
      z = {terms}
    </code>
  )
}
