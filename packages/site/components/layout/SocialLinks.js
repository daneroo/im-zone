import { Flex } from 'theme-ui'
import Icon from './icons/Icon'
import Twitter from './icons/Twitter'
import Github from './icons/Github'

export function SocialLinks ({ size = 24 }) {
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
