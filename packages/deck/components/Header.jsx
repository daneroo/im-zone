import React from 'react'
import Link from 'next/link'

export default function Header ({ name, title, date, url }) {
  return (
    <header>
      <div>
        <a href={url}>
          <span>{name}</span>
        </a>{' '}
        —{' '}
        <Link href='/'>
          <a>{title}</a>
        </Link>
      </div>
      <time>{date}</time>
    </header>
  )
}
