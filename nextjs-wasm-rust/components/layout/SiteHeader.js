import { useThemeUI, useColorMode, Flex, Box } from 'theme-ui'
import Link from 'next/link'

import { useRouter } from 'next/router'

import IconButton from './icons/IconButton'
import ColorToggle from './icons/ColorToggle'
import { SocialLinks } from './SocialLinks'

export function SiteHeader () {
  const { theme: { sxmedia } } = useThemeUI()
  return (
    <Flex sx={{
      alignItems: 'center',
      justifyContent: 'space-between'
    }}
    >
      <LogoLink size='32' />
      <Flex sx={{ gap: 1 }}>
        <ActiveLink href='/stack'>Stack</ActiveLink>
        |
        <ActiveLink href='/history'>History</ActiveLink>
      </Flex>
      <Flex sx={{ gap: 2 }}>
        <Box sx={{
          display: 'none',
          [sxmedia.tablet_up]: {
            display: 'block'
          }
        }}
        >
          <SocialLinks size={20} />
        </Box>
        <ThemeSwitcher size={24} />
      </Flex>
    </Flex>
  )
}

function LogoLink ({ size = 32 }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 1 }}>
      <Link href='/'>
        {/* compensate for active link bottom border? */}
        <a title='Zone Plate Home' style={{ height: size - 2 }}>
          <Logo size={size} />
        </a>
      </Link>
      <ActiveLink href='/'> Zone Plate</ActiveLink>
    </Flex>
  )
}

function Logo ({ size = 32 }) {
  const { theme: { colors: { primary } } } = useThemeUI()
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 64 64'
      width={size}
      height={size}
      // fill='currentcolor'
    >
      <g stroke={primary} transform='translate(32,32)'>
        <circle r={8} fill='none' strokeWidth={5} />
        <circle r={16} fill='none' strokeWidth={4} />
        <circle r={24} fill='none' strokeWidth={3} />
        <circle r={31} fill='none' strokeWidth={2} />
      </g>
    </svg>
  )
}

// for Top Menu - should Styled in theme-ui?
function ActiveLink ({ children, href, title = '' }) {
  const { theme: { colors: { primary, text } } } = useThemeUI()

  const router = useRouter()
  const isActive = router.pathname === href
  const style = {
    color: text,
    fontWeight: 'bold',
    textDecoration: 'none',
    borderBottom: isActive ? `2px solid ${primary}` : 'none'
  }

  return (
    <Link sx={{ px: 1 }} href={href}>
      <a title={title} style={style}>{children}</a>
    </Link>
  )
}

// only cycles colors for now
function ThemeSwitcher ({ size = 32 }) {
  const { colorMode, cycleColorMode } = useCycleColor()
  return (
    <IconButton
      onClick={cycleColorMode}
      label={colorMode}
      icon={<ColorToggle />}
      size={size}
    />
  )
}

function useCycleColor () {
  const { theme: { colors } } = useThemeUI()
  const [colorMode, setColorMode] = useColorMode()
  const modes = ['default', ...Object.keys(colors.modes)]
  const cycleColorMode = () => {
    const i = modes.indexOf(colorMode)
    const n = (i + 1) % modes.length
    setColorMode(modes[n])
  }

  return { colorMode, cycleColorMode }
}
