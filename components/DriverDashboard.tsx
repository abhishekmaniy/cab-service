'use client'

import { useRideStore } from '@/app/store/rideStore'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { useAuth } from '@clerk/nextjs'
import { Car } from 'lucide-react'
import { useState } from 'react'



export default function DriverDashboard () {
  const [isAvailable, setIsAvailable] = useState(false)
  const { currentRide, setCurrentRide } = useRideStore()
  const { userId } = useAuth()

  const getRide = async () => {
    if (isAvailable) {
      const response = await fetch('/api/get-ride', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      console.log(response)

      const data = await response.json()

      if (data.ride) {
        setCurrentRide(data.ride)
      } else {
        alert('No rides available')
      }
    }
  }

  const toggleAvailability = async () => {
    setIsAvailable(!isAvailable)
    if (isAvailable) {
      await getRide()
    }
  }

  const acceptRide = async () => {
    if (!currentRide) return
    try {
      const response = await fetch('/api/accept-ride', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: currentRide.id, userId })
      })

      const data = await response.json()

      if (response.ok) {
        setCurrentRide(data.ride)
        alert('Ride accepted!')
      } else {
        alert(data.error || 'Error accepting ride')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  const rejectRide = async () => {
    if (!currentRide) return

    try {
      const response = await fetch('/api/reject-ride', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rideId: currentRide.id })
      })

      if (response.ok) {
        setCurrentRide(null)
        alert('Ride rejected. Searching for a new ride...')
        await getRide() // Request another ride
      } else {
        alert('Error rejecting ride')
      }
    } catch (error) {
      console.error(error)
      alert('Something went wrong')
    }
  }

  return (
    <div className='bg-white p-6 rounded-lg shadow-lg border border-gray-200'>
      <h2 className='text-2xl font-bold mb-6 text-gray-800'>
        Driver Dashboard
      </h2>
      <div className='flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg'>
        <span className='text-lg font-semibold text-gray-700'>
          Available for rides:
        </span>
        <Switch
          checked={isAvailable}
          onCheckedChange={toggleAvailability}
          className='data-[state=checked]:bg-green-500'
        />
      </div>

      {isAvailable && !currentRide && (
        <Button
          onClick={getRide}
          className='w-full mb-6 bg-uber-gradient hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105'
        >
          <Car className='mr-2' />
          Find Ride
        </Button>
      )}

      {currentRide && (
        <div className='space-y-4 p-4 bg-blue-50 rounded-lg'>
          <h3 className='text-xl font-semibold text-blue-800'>Current Ride</h3>
          <p className='text-gray-700'>
            <strong>Pickup:</strong> {currentRide.pickup}
          </p>
          <p className='text-gray-700'>
            <strong>Dropoff:</strong> {currentRide.destination}
          </p>

          <div className='flex space-x-4'>
            <Button
              onClick={acceptRide}
              className='w-full bg-blue-500 hover:bg-blue-600'
            >
              Accept Ride
            </Button>

            <Button
              onClick={rejectRide}
              className='w-full bg-red-500 hover:bg-red-600'
            >
              Reject Ride
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
