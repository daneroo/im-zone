import { Flex } from 'theme-ui'

import { SocialLinks } from './SocialLinks'

export function SiteFooter () {
  return (
    <Flex sx={{ gap: 2, alignItems: 'center', justifyContent: 'center' }}>
      <div>Daniel Lauzon &copy;2020</div>
      <SocialLinks size={24} />
    </Flex>
  )
}
