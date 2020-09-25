//  Should probably declare this as a peer-dependency, bu it ships with theme-ui
import { css } from '@emotion/core'

// values must be numbers - representing px
// other recommendations were: - 43em (688px), 62em (992px), and 82em (1312px) wide
const namedPxBreakpoints = [
  ['tablet', 600],
  ['desktop', 900]
]

/**
 * This method was inspired by https://github.com/narative/gatsby-theme-novela
 * and * https://github.com/codebushi/gatsby-theme-document/issues
 *
 * I converted to Rem's so that page zoom affects breakpoints
 * Reduced to only 2 breakpoints - for theme-ui
 */

// const toRem = size => `${size / 16}rem`
const toRem = size => `${size}px`

export const breakpoints = namedPxBreakpoints.map(([label, pxValue]) => toRem(pxValue))

/**
 * Each breakpoint is turned in to a min-width and max-width version.
 *
 * @example
 *
 *  ${mediaqueries.tablet` width: 100px; `};
 *  ${mediaqueries.desktop_up` width: 200px; `};
 *
 * This can also be used in theme-ui:
 * <Box sx={{
 *  [sxmedia.desktop_up]:{
 *    color: primary,
 *  }
 * }}>
 * </Box>
 */

export const mediaqueries = namedPxBreakpoints.reduce(
  (acc, [label, size], i) => ({
    ...acc,
    // max-width media query e.g. mediaqueries.desktop
    [label]: (...args) => css`
      @media screen and (max-width: ${toRem(size)}) {
        ${css(...args)};
      }
    `,
    // min-width media query e.g. mediaqueries.desktop_up
    [`${label}_up`]: (...args) => css`
      @media screen and (min-width: ${toRem(size)}) {
        ${css(...args)};
      }
    `
  }),
  {}
)

export const sxmedia = namedPxBreakpoints.reduce(
  (acc, [label, size], i) => ({
    ...acc,
    // max-width media query e.g. mediaqueries.desktop
    [label]: `@media screen and (max-width: ${toRem(size)})`,
    // min-width media query e.g. mediaqueries.desktop_up
    // This is the breakpoint prior's size +1
    [`${label}_up`]: `@media screen and (min-width: ${toRem(size)})`
  }),
  {}
)
