
import { base, dark, swiss, deep } from '@theme-ui/presets'
export default {
  ...base,
  colors: {
    ...base.colors,
    modes: {
      dark: dark.colors,
      swiss: swiss.colors,
      deep: deep.colors
    }
  }
}
