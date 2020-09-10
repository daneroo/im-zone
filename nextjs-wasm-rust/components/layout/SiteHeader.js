import { useThemeUI, useColorMode, Flex } from 'theme-ui'
import Link from 'next/link'

import { useRouter } from 'next/router'

import Icon from './icons/Icon'
import Twitter from './icons/Twitter'
import Github from './icons/Github'
import ColorToggle from './icons/ColorToggle'

export default function SiteHeader () {
  return (
    <Flex sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
      <LogoLink />
      <Flex sx={{ gap: 1 }}>
        <ActiveLink href='/stack'>Stack</ActiveLink>
        |
        <ActiveLink href='/history'>History</ActiveLink>
      </Flex>
      <Flex sx={{ justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
        <SocialLinks size={24} />
        <ThemeSwitcher size={32} />
      </Flex>
    </Flex>
  )
}

function LogoLink ({ size = 32 }) {
  return (
    <Flex sx={{ alignItems: 'center', gap: 1 }}>
      <Link href='/'>
        <a style={{ height: size }}>
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
function ActiveLink ({ children, href }) {
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
      <a style={style}>{children}</a>
    </Link>
  )
}

function SocialLinks ({ size = 24 }) {
// TODO: get urls from ...
  const social = {
    twitter: {
      href: 'https://twitter.com/daneroo',
      IconComponent: <Twitter />
    },
    //  repo or user?
    github: {
      href: 'https://github.com/daneroo/im-zone',
      IconComponent: <Github />
    }
  }
  return (
    <Flex sx={{ gap: 1, alignItems: 'center', opacity: 0.7 }}>
      {Object.entries(social).map(([name, { href, IconComponent }]) => {
        return (
          <a
            key={name}
            href={href} target='_blank' rel='noopener noreferrer'
            // NOTE: must set height explicitly on <a/> to preserve height of icon
            style={{ height: size }}
            aria-label={name}
            title={name}
          >
            <Icon icon={IconComponent} size={size} />
          </a>

        )
      })}
    </Flex>
  )
}

// only cycles colors for now
function ThemeSwitcher ({ size = 32 }) {
  const { colorMode, cycleColorMode } = useCycleColor()
  return (
    <button
      style={{
        padding: 0,
        background: 'none',
        border: 'none',
        cursor: 'pointer'
      }}
      onClick={cycleColorMode}
      aria-label='Change Theme'
      title={colorMode}
    >
      <Icon icon={<ColorToggle />} size={size} />
    </button>
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
