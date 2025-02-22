'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MapPin, Navigation } from 'lucide-react'
import { useAuth } from '@clerk/nextjs'

export default function RideRequest () {
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [loading, setLoading] = useState(false)
  const { userId } = useAuth()

  const handleRequest = async () => {
    if (!pickup && !dropoff) {
      alert('Please Fill the pickup & dropoff Location')
    }
    try {
      const response = await fetch('/api/create-ride', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pickup, dropoff , userId })
      })

      const data = await response.json()

      if (response.ok) {
        alert("Ride Creted")
      } else{
        alert("Error while creating ride ")
      }

    } catch (error) {
      console.log('Error Creating User ', error)
      alert('Something went wrong!')
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>Request a Ride</h2>
      <div className='space-y-6'>
        <div className='relative'>
          <MapPin className='absolute top-3 left-3 text-gray-400' />
          <Input
            type='text'
            placeholder='Pickup Location'
            value={pickup}
            onChange={e => setPickup(e.target.value)}
            className='pl-10 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
        <div className='relative'>
          <Navigation className='absolute top-3 left-3 text-gray-400' />
          <Input
            type='text'
            placeholder='Dropoff Location'
            value={dropoff}
            onChange={e => setDropoff(e.target.value)}
            className='pl-10 bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          />
        </div>
        <Button
          onClick={handleRequest}
          className='w-full bg-uber-gradient hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105'
        >
          Request Ride
        </Button>
      </div>
    </div>
  )
}
