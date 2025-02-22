'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@clerk/nextjs'
import { Car, UserCircle } from 'lucide-react'
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
    <div className='flex flex-col items-center justify-center min-h-screen bg-uber-pattern'>
      <div className='text-center space-y-8 p-8 bg-white rounded-lg shadow-xl max-w-2xl w-full'>
        <h1 className='text-5xl font-bold mb-8 text-gray-800'>
          Welcome to Maniyar Cab
        </h1>
        <p className='text-xl text-gray-600 mb-8'>
          Choose your role to get started
        </p>
        <div className='flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4'>
          <Button
            size='lg'
            disabled={loading}
            onClick={() => handleRoleSelection('rider')}
            className='w-full sm:w-auto bg-uber-gradient hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105'
          >
            <UserCircle className='mr-2' />
            {loading ? 'Loading...' : "I'm a Rider"}
          </Button>

          <Button
            size='lg'
            variant='outline'
            disabled={loading}
            onClick={() => handleRoleSelection('driver')}
            className='w-full sm:w-auto border-2 border-blue-600 text-blue-600 font-bold py-3 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105 hover:bg-blue-600 hover:text-white'
          >
            <Car className='mr-2' />
            {loading ? 'Loading...' : "I'm a Driver"}
          </Button>
        </div>
      </div>
    </div>
  )
}
