'use client'

import { BackgroundBeams } from '@/components/ui/background-beams'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Home () {
  const { userId } = useAuth()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRoleSelection = async (role: string) => {
    if (!userId) {
      alert('User not authenticated!')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, role })
      })

      const data = await response.json()

      if (response.ok) {
        router.push(`/${role}`)
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error selecting role:', error)
      alert('Something went wrong!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-[40rem] w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased'>
      <div className='max-w-2xl mx-auto p-4'>
        <h1 className='relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold'>
          Book Your Ride
        </h1>
        <p></p>
        <p className='text-neutral-500 max-w-lg mx-auto my-2 text-sm text-center relative z-10'>
          Welcome to Maniyar Cab, your trusted cab service platform. We offer
          reliable, affordable, and convenient rides for all your travel needs.
          Whether you're commuting to work, heading to the airport, or exploring
          the city, Maniyar Cab has got you covered.
        </p>
      </div>
      <BackgroundBeams />
    </div>
  )
}
