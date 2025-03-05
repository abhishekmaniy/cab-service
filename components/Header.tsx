'use client'

import { SignInButton, useAuth, UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Header () {
  const { isSignedIn } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && isSignedIn) {
      router.push('/auth-callback')
    }
  }, [isMounted, isSignedIn, router])

  return (
    <header className='bg-black text-white p-4 shadow-lg'>
      <div className='container mx-auto flex justify-between items-center'>
        <Link href='/' className='text-2xl font-bold'>
          Maniyar Cab Service
        </Link>
      <div>{isSignedIn ? <UserButton /> : <SignInButton />}</div>
      </div>
    </header>
  )
}
