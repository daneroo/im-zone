import React, { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function index() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/slides/01')
  })
  return <div />
}
