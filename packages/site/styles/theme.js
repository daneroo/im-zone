
import { base, dark, swiss, deep } from '@theme-ui/presets'
import { breakpoints, sxmedia } from './mediaqueries'

export default {
  ...base,
  colors: {
    ...base.colors,
    modes: {
      dark: dark.colors,
      swiss: swiss.colors,
      deep: deep.colors
    }
  },
  // converted px to to rem
  breakpoints,
  sxmedia
}
