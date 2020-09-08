import Link from 'next/link'

import { useRouter } from 'next/router'

export default function SiteHeader () {
  const router = useRouter()
  console.log({ router })
  return (
    <h2>Zone Plate -
      <Link href='/'><a>Home</a></Link>
      <Link href='/about'><a>About</a></Link>
    </h2>
  )
}
